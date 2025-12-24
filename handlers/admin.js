// 管理后台API处理器
import { getDB, createTables, fetchAndParseM3U } from '../database.js';

export async function handleAdminRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const action = pathParts[2] || ''; // 获取操作类型，如 /admin/init

  // 验证是否为管理请求（这里可以添加更复杂的认证逻辑）
  const adminKey = request.headers.get('X-Admin-Key');
  if (adminKey !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    switch (action) {
      case 'init':
        // 初始化数据库表
        await createTables(env);
        return new Response(JSON.stringify({ success: true, message: 'Database tables initialized' }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'sources':
        // 处理源管理
        if (request.method === 'GET') {
          // 获取所有源
          const sources = await getDB().prepare('SELECT * FROM sources ORDER BY id').all();
          return new Response(JSON.stringify(sources), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          // 添加新源
          const data = await request.json();
          const result = await getDB().prepare(`
            INSERT INTO sources (name, url, type, parse_mode) 
            VALUES (?, ?, ?, ?)
          `).bind(
            data.name,
            data.url,
            data.type || 'm3u',
            data.parse_mode || 'strict'
          ).run();

          return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT') {
          // 更新源
          const data = await request.json();
          await getDB().prepare(`
            UPDATE sources SET name = ?, url = ?, type = ?, parse_mode = ? 
            WHERE id = ?
          `).bind(
            data.name,
            data.url,
            data.type,
            data.parse_mode,
            data.id
          ).run();

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE') {
          // 删除源
          const sourceId = pathParts[3];
          if (!sourceId) {
            return new Response('Missing source ID', { status: 400 });
          }

          await getDB().prepare('DELETE FROM sources WHERE id = ?').bind(sourceId).run();
          await getDB().prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId).run();

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'sync':
        // 同步源数据
        const sourceId = pathParts[3];
        if (!sourceId) {
          return new Response('Missing source ID', { status: 400 });
        }

        // 先删除该源的旧频道
        await getDB().prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId).run();

        // 获取源信息
        const source = await getDB().prepare('SELECT url FROM sources WHERE id = ?').bind(sourceId).first();
        if (!source) {
          return new Response('Source not found', { status: 404 });
        }

        // 获取并解析M3U内容
        const result = await fetchAndParseM3U(source.url, sourceId);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'codes':
        // 处理卡密管理
        if (request.method === 'GET') {
          // 获取卡密列表（使用code主键排序，因为表没有created_at字段）
          const codes = await getDB().prepare('SELECT * FROM codes ORDER BY code DESC').all();
          return new Response(JSON.stringify({ results: codes.results }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && url.searchParams.get('action') === 'activate') {
          // 激活卡密
          const data = await request.json();
          const now = new Date().toISOString();
          const code = await getDB().prepare('SELECT * FROM codes WHERE code = ?').bind(data.code).first();

          if (!code) {
            return new Response(JSON.stringify({ success: false, error: 'Code not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          if (code.status !== 'unused') {
            return new Response(JSON.stringify({ success: false, error: 'Code already used' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // 计算过期时间
          const expiredAt = new Date();
          expiredAt.setDate(expiredAt.getDate() + code.duration_days);

          // 激活卡密
          await getDB().prepare(`
            UPDATE codes SET status = 'active', activated_at = ?, expired_at = ?
            WHERE code = ?
          `).bind(
            now,
            expiredAt.toISOString(),
            data.code
          ).run();

          return new Response(JSON.stringify({ 
            success: true, 
            activated_at: now,
            expired_at: expiredAt.toISOString()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          // 生成新卡密
          const data = await request.json();
          const codes = [];

          // 生成指定数量的卡密
          for (let i = 0; i < data.count; i++) {
            const code = generateCode();
            const now = new Date().toISOString();
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + data.duration_days);

            await getDB().prepare(`
              INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, remark) 
              VALUES (?, 'unused', ?, ?, ?, ?, ?)
            `).bind(
              code,
              data.duration_days,
              now,
              expiredAt.toISOString(),
              data.max_ips || 3,
              data.remark || ''
            ).run();

            codes.push({
              code,
              expired_at: expiredAt.toISOString(),
              remark: data.remark || ''
            });
          }

          return new Response(JSON.stringify({ success: true, codes }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT') {
          // 更新卡密状态
          const data = await request.json();
          await getDB().prepare(`
            UPDATE codes SET status = ?, remark = ? 
            WHERE code = ?
          `).bind(
            data.status,
            data.remark,
            data.code
          ).run();

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'channels':
        // 获取频道列表（支持分页）
        const sourceIdFilter = url.searchParams.get('source_id');
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('page_size')) || 100;
        const search = url.searchParams.get('search') || '';

        let channelsQuery = 'SELECT c.*, s.name as source_name FROM channels c LEFT JOIN sources s ON c.source_id = s.id';
        const countQuery = 'SELECT COUNT(*) as total FROM channels c LEFT JOIN sources s ON c.source_id = s.id';
        const params = [];
        const whereConditions = [];

        if (sourceIdFilter) {
          whereConditions.push('c.source_id = ?');
          params.push(sourceIdFilter);
        }

        if (search) {
          whereConditions.push('(c.channel_name LIKE ? OR c.group_title LIKE ?)');
          const searchPattern = `%${search}%`;
          params.push(searchPattern, searchPattern);
        }

        if (whereConditions.length > 0) {
          const whereClause = ' WHERE ' + whereConditions.join(' AND ');
          channelsQuery += whereClause;
        }

        // 获取总数
        const totalResult = await getDB().prepare(countQuery + (whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : '')).bind(...params).first();
        const total = totalResult.total;

        // 获取分页数据
        const offset = (page - 1) * pageSize;
        channelsQuery += ' ORDER BY c.group_title, c.channel_name LIMIT ? OFFSET ?';
        const channels = await getDB().prepare(channelsQuery).bind(...params, pageSize, offset).all();

        // 格式化结果，确保所有字段都包含在内
        const formattedResults = channels.results.map(channel => ({
          id: channel.id,
          source_id: channel.source_id,
          channel_name: channel.channel_name,
          group_title: channel.group_title,
          logo: channel.logo,
          play_url: channel.play_url,
          headers: channel.headers,
          channel_hash: channel.channel_hash,
          is_active: channel.is_active,
          source_name: channel.source_name
        }));

        return new Response(JSON.stringify({ 
          results: formattedResults,
          pagination: {
            page,
            page_size: pageSize,
            total,
            total_pages: Math.ceil(total / pageSize)
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response('Invalid admin action', { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 生成随机卡密
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
