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

          const db = getDB();

          // 先获取该源关联的频道数量
          const countResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(sourceId).first();
          const channelCount = countResult?.count || 0;

          // 使用事务删除，确保数据一致性
          const stmts = [
            db.prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId),
            db.prepare('DELETE FROM sources WHERE id = ?').bind(sourceId)
          ];
          await db.batch(stmts).all();

          return new Response(JSON.stringify({
            success: true,
            message: `已删除源及其关联的 ${channelCount} 个频道`
          }), {
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

        const db = getDB();

        // 先获取该源关联的频道数量（用于返回统计信息）
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(sourceId).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 删除该源的旧频道
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId).run();

        // 获取源信息
        const source = await db.prepare('SELECT url FROM sources WHERE id = ?').bind(sourceId).first();
        if (!source) {
          return new Response('Source not found', { status: 404 });
        }

        // 获取并解析M3U内容
        const result = await fetchAndParseM3U(source.url, sourceId);

        // 添加删除统计信息
        result.deletedChannels = oldChannelCount;

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'codes':
        // 处理卡密管理
        if (request.method === 'GET') {
          const codeQuery = url.searchParams.get('code');
          // 如果指定了code参数，返回单个卡密
          if (codeQuery) {
            const code = await getDB().prepare('SELECT * FROM codes WHERE code = ?').bind(codeQuery).first();
            if (!code) {
              return new Response(JSON.stringify({ success: false, error: 'Code not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            return new Response(JSON.stringify(code), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // 获取卡密列表（支持分页）
          const page = parseInt(url.searchParams.get('page')) || 1;
          const pageSize = Math.min(parseInt(url.searchParams.get('page_size')) || 100, 100);
          const statusFilter = url.searchParams.get('status') || '';

          let codesQuery = 'SELECT * FROM codes';
          const countQuery = 'SELECT COUNT(*) as total FROM codes';
          const params = [];
          const whereConditions = [];

          if (statusFilter) {
            whereConditions.push('status = ?');
            params.push(statusFilter);
          }

          if (whereConditions.length > 0) {
            const whereClause = ' WHERE ' + whereConditions.join(' AND ');
            codesQuery += whereClause;
          }

          // 获取总数
          const totalResult = await getDB().prepare(countQuery + (whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : '')).bind(...params).first();
          const total = totalResult.total;

          // 获取分页数据
          const offset = (page - 1) * pageSize;
          codesQuery += ' ORDER BY code DESC LIMIT ? OFFSET ?';
          const codes = await getDB().prepare(codesQuery).bind(...params, pageSize, offset).all();

          return new Response(JSON.stringify({
            results: codes.results,
            pagination: {
              page,
              page_size: pageSize,
              total,
              total_pages: Math.ceil(total / pageSize)
            }
          }), {
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
          const db = getDB();

          // 生成指定数量的卡密
          for (let i = 0; i < data.count; i++) {
            let code;
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 100;

            // 生成唯一卡密，确保不重复
            while (!isUnique && attempts < maxAttempts) {
              code = generateCode();
              const existing = await db.prepare('SELECT code FROM codes WHERE code = ?').bind(code).first();
              if (!existing) {
                isUnique = true;
              }
              attempts++;
            }

            if (!isUnique) {
              return new Response(JSON.stringify({ success: false, error: 'Failed to generate unique code' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
              });
            }

            const now = new Date().toISOString();
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + data.duration_days);

            await db.prepare(`
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

        if (request.method === 'DELETE') {
          // 清空所有频道数据
          const db = getDB();

          // 获取清空前的频道数量
          const countResult = await db.prepare('SELECT COUNT(*) as count FROM channels').first();
          const channelCount = countResult?.count || 0;

          // 清空频道表
          await db.prepare('DELETE FROM channels').run();

          return new Response(JSON.stringify({
            success: true,
            message: `已清空 ${channelCount} 个频道数据`
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
