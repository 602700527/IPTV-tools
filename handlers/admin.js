// 管理后台API处理器
import { getDB, createTables, fetchAndParseM3U, getSecurityConfig, updateSecurityConfig, getIPBlacklistConfig, updateIPBlacklistConfig } from '../database.js';
import { manualSyncAll } from './scheduler.js';
import { getBlacklistedIPs, unbanIP, getIPAccessStats, banIP } from '../security/ip-blacklist.js';
import { getBannedCodesFromCache, removeBannedCodeFromCache, syncBannedCodesToCache } from '../security/code-ban-cache.js';

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

      case 'migrate':
        // 执行数据库迁移
        try {
          await createTables(env);
          return new Response(JSON.stringify({ success: true, message: 'Database migration completed' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

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
        } else if (request.method === 'PATCH' && pathParts[3] === 'toggle') {
          // 切换源的启用/禁用状态
          const sourceId = pathParts[4];
          if (!sourceId) {
            return new Response('Missing source ID', { status: 400 });
          }

          const data = await request.json();
          const isActive = data.is_active !== undefined ? (data.is_active ? 1 : 0) : null;
          
          if (isActive === null) {
            // 如果没有指定状态，则切换状态
            const source = await getDB().prepare('SELECT is_active FROM sources WHERE id = ?').bind(sourceId).first();
            if (!source) {
              return new Response('Source not found', { status: 404 });
            }
            const newStatus = source.is_active ? 0 : 1;
            await getDB().prepare('UPDATE sources SET is_active = ? WHERE id = ?').bind(newStatus, sourceId).run();
            
            return new Response(JSON.stringify({ 
              success: true, 
              is_active: newStatus === 1,
              message: newStatus === 1 ? '源已启用' : '源已禁用'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // 设置指定状态
            await getDB().prepare('UPDATE sources SET is_active = ? WHERE id = ?').bind(isActive, sourceId).run();
            
            return new Response(JSON.stringify({ 
              success: true, 
              is_active: isActive === 1,
              message: isActive === 1 ? '源已启用' : '源已禁用'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
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
          await db.batch(stmts);

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
        const syncSubAction = pathParts[3];
        
        // 同步所有启用的源
        if (syncSubAction === 'all' && request.method === 'POST') {
          const result = await manualSyncAll(env);
          return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 同步单个源
        const sourceId = syncSubAction;
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

        // 先更新源的同步时间（使用 JavaScript 生成当前时间）
        const now = new Date().toISOString();
        await db.prepare(`UPDATE sources SET last_updated = ? WHERE id = ?`).bind(now, sourceId).run();

        // 获取并解析M3U内容（注意：fetchAndParseM3U也会更新时间，所以这里更新两次）
        const result = await fetchAndParseM3U(source.url, sourceId);

        // 添加删除统计信息
        result.deletedChannels = oldChannelCount;

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'codes':
        // 处理卡密管理
        if (request.method === 'GET') {
          // 导出CSV功能
          if (url.searchParams.get('action') === 'export') {
            const codes = await getCodesForExport(url.searchParams);
            
            // 生成CSV内容
            let csv = '卡密,状态,有效期(天),最大IP数,激活时间,过期时间,备注\n';
            codes.forEach(code => {
              const statusMap = { 'unused': '未使用', 'active': '活跃', 'disabled': '禁用' };
              const status = statusMap[code.status] || code.status;
              const activatedAt = code.activated_at ? formatDateTime(code.activated_at) : '-';
              const expiredAt = code.expired_at ? formatDateTime(code.expired_at) : '-';
              const remark = code.remark || '-';
              // 处理CSV中的特殊字符
              const cleanCode = escapeCsvField(code.code);
              const cleanRemark = escapeCsvField(remark);
              csv += `${cleanCode},${status},${code.duration_days},${code.max_ips || 3},${activatedAt},${expiredAt},${cleanRemark}\n`;
            });
            
            return new Response(csv, {
              headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="codes_export_' + new Date().toISOString().slice(0, 10) + '.csv"'
              }
            });
          }
          
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

          // 获取卡密列表（支持分页和查询）
          const page = parseInt(url.searchParams.get('page')) || 1;
          const pageSize = Math.min(parseInt(url.searchParams.get('page_size')) || 100, 100);
          const statusFilter = url.searchParams.get('status') || '';
          const expiredFrom = url.searchParams.get('expired_from') || '';
          const expiredTo = url.searchParams.get('expired_to') || '';
          const activatedFrom = url.searchParams.get('activated_from') || '';
          const activatedTo = url.searchParams.get('activated_to') || '';
          const durationMin = url.searchParams.get('duration_min') || '';
          const durationMax = url.searchParams.get('duration_max') || '';
          const remark = url.searchParams.get('remark') || '';

          let codesQuery = 'SELECT * FROM codes';
          const countQuery = 'SELECT COUNT(*) as total FROM codes';
          const params = [];
          const whereConditions = [];

          if (statusFilter) {
            whereConditions.push('status = ?');
            params.push(statusFilter);
          }
          if (expiredFrom) {
            whereConditions.push('expired_at >= ?');
            params.push(expiredFrom);
          }
          if (expiredTo) {
            whereConditions.push('expired_at <= ?');
            params.push(expiredTo);
          }
          if (activatedFrom) {
            whereConditions.push('activated_at >= ?');
            params.push(activatedFrom);
          }
          if (activatedTo) {
            whereConditions.push('activated_at <= ?');
            params.push(activatedTo);
          }
          if (durationMin) {
            whereConditions.push('duration_days >= ?');
            params.push(parseInt(durationMin));
          }
          if (durationMax) {
            whereConditions.push('duration_days <= ?');
            params.push(parseInt(durationMax));
          }
          if (remark) {
            whereConditions.push('remark LIKE ?');
            params.push('%' + remark + '%');
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

      case 'ip-blacklist-config':
        // IP黑名单配置管理
        if (request.method === 'GET') {
          const config = await getIPBlacklistConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          const data = await request.json();

          // 验证配置值
          const fields = ['sub_rate_min', 'sub_rate_hour', 'sub_rate_day', 'live_rate_min', 'live_rate_hour', 'live_rate_day', 'admin_rate_hour'];
          const validConfig = {};
          
          for (const field of fields) {
            if (data[field] !== undefined && data[field] > 0) {
              validConfig[field] = parseInt(data[field]);
            }
          }

          await updateIPBlacklistConfig(validConfig);

          return new Response(JSON.stringify({
            success: true,
            message: 'IP黑名单配置已更新',
            config: validConfig
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'security':
        // 安全监控和管理
        const securitySubAction = pathParts[3];

        if (request.method === 'GET' && securitySubAction === 'banned-codes') {
          // 获取所有被封禁的卡密列表 - 优先从KV缓存读取
          let codes = [];
          const cacheResult = await getBannedCodesFromCache(env, 100, 0);
          codes = cacheResult.data;

          // 如果KV缓存为空，从数据库同步
          if (codes.length === 0) {
            const db = getDB();
            await syncBannedCodesToCache(env, db);
            const cacheResult2 = await getBannedCodesFromCache(env, 100, 0);
            codes = cacheResult2.data;
          }

          return new Response(JSON.stringify({
            success: true,
            count: cacheResult.total,
            codes
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && securitySubAction === 'config') {
          // 获取安全配置
          const config = await getSecurityConfig();
          return new Response(JSON.stringify({
            success: true,
            config: {
              channel_daily_limit: config.channel_daily_limit,
              ban_duration_days: config.ban_duration_days,
              auto_ban_on_exceed: config.auto_ban_on_exceed
            }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && securitySubAction === 'config') {
          // 更新安全配置
          const data = await request.json();

          const config = {};
          if (data.channel_daily_limit !== undefined && data.channel_daily_limit > 0) {
            config.channel_daily_limit = data.channel_daily_limit;
          }
          if (data.ban_duration_days !== undefined && data.ban_duration_days >= 0) {
            config.ban_duration_days = data.ban_duration_days;
          }
          if (data.auto_ban_on_exceed !== undefined) {
            config.auto_ban_on_exceed = data.auto_ban_on_exceed;
          }

          await updateSecurityConfig(config);

          return new Response(JSON.stringify({
            success: true,
            message: '配置已更新',
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && securitySubAction === 'quota') {
          // 查看卡密额度使用情况
          const code = url.searchParams.get('code');
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          const today = new Date().toISOString().split('T')[0];
          // 列出该卡密今日所有频道的播放记录
          const quotaRecords = [];

          // 由于KV不支持通配符查询，这里简化处理
          // 返回汇总信息
          const quotaKey = `code_quota:${today}:${code}`;
          const quotaData = await env.KV.get(quotaKey, { type: "json" }) || {
            totalPlays: 0,
            channelPlays: {},
            bannedChannels: [],
            exceededChannels: []
          };

          // 获取频道名称
          const channelHashes = Object.keys(quotaData.channelPlays || {});
          const channelNames = {};
          if (channelHashes.length > 0) {
            // 批量查询频道名称
            const channels = await getDB().prepare(
              'SELECT channel_hash, channel_name FROM channels WHERE channel_hash IN (' + channelHashes.map(() => '?').join(',') + ')'
            ).bind(...channelHashes).all();

            if (channels.results) {
              channels.results.forEach(channel => {
                channelNames[channel.channel_hash] = channel.channel_name;
              });
            }
          }

          // 获取卡密封禁信息
          const codeInfo = await getDB().prepare("SELECT banned_until FROM codes WHERE code = ?").bind(code).first();
          const isBanned = codeInfo?.banned_until && codeInfo.banned_until > new Date().toISOString();

          return new Response(JSON.stringify({
            success: true,
            date: today,
            total_plays: quotaData.totalPlays || 0,
            exceeded_channels_count: quotaData.exceededChannels?.length || 0,
            is_banned: isBanned,
            banned_at: quotaData.bannedAt || null,
            banned_until: quotaData.bannedUntil || (isBanned ? codeInfo.banned_until : null),
            ban_duration_days: quotaData.banDurationDays || null,
            channel_names: channelNames,
            details: quotaData
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && securitySubAction === 'unban') {
          // 手动解封卡密
          const data = await request.json();
          const code = data.code;
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          const codeInfo = await getDB().prepare("SELECT status, remark FROM codes WHERE code = ?").bind(code).first();
          if (!codeInfo) {
            return new Response('Code not found', { status: 404 });
          }

          // 清除封禁备注
          const newRemark = codeInfo.remark
            ? codeInfo.remark.replace(/系统自动封禁：[^\n]*/g, '').trim()
            : '';

          await getDB().prepare("UPDATE codes SET status = 'active', remark = ?, banned_until = NULL WHERE code = ?")
            .bind(newRemark, code)
            .run();

          // 从KV缓存中移除
          await removeBannedCodeFromCache(env, code);

          // 清除额度记录
          const today = new Date().toISOString().split('T')[0];
          await env.KV.delete(`code_quota:${today}:${code}`);

          return new Response(JSON.stringify({
            success: true,
            message: '卡密已解封'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && securitySubAction === 'stats') {
          // 获取安全统计
          const code = url.searchParams.get('code');
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          const today = new Date().toISOString().split('T')[0];
          const accessData = await env.KV.get(`access:${code}:${today}`, { type: "json" }) || {
            totalPlays: 0,
            channels: {},
            ips: [],
            lastAccess: 0
          };

          const abuseFlag = await env.KV.get(`abuse_flag:${code}`, { type: "json" });
          const suspiciousFlag = await env.KV.get(`suspicious:${code}`, { type: "json" });

          return new Response(JSON.stringify({
            success: true,
            date: today,
            total_plays: accessData.totalPlays || 0,
            unique_ips: accessData.ips ? accessData.ips.length : 0,
            channel_count: Object.keys(accessData.channels || {}).length,
            top_channels: Object.entries(accessData.channels || {})
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([hash, count]) => ({ channel_hash: hash, play_count: count })),
            abuse_detected: !!abuseFlag,
            suspicious_detected: !!suspiciousFlag,
            abuse_details: abuseFlag,
            suspicious_details: suspiciousFlag
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && securitySubAction === 'reset') {
          // 重置安全计数
          const code = url.searchParams.get('code');
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          // 删除所有安全相关数据
          const keysToDelete = [
            `access:${code}:*`,
            `limit:play:*:${code}`,
            `abuse:${code}`,
            `abuse_flag:${code}`,
            `suspicious:${code}`
          ];

          // KV不支持通配符删除，需要逐个删除已知键
          const today = new Date().toISOString().split('T')[0];
          await env.KV.delete(`access:${code}:${today}`);
          await env.KV.delete(`abuse:${code}`);
          await env.KV.delete(`abuse_flag:${code}`);
          await env.KV.delete(`suspicious:${code}`);

          // 删除令牌（需要列出所有令牌，这里简化处理）
          // 实际中可以使用KV list API

          return new Response(JSON.stringify({
            success: true,
            message: '安全计数已重置'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

      case 'ip-blacklist':
        // IP黑名单管理
        const blacklistSubAction = pathParts[3];

        if (request.method === 'GET' && !blacklistSubAction) {
          // 获取所有封禁的IP列表（默认返回前100条）
          const result = await getBlacklistedIPs(env, 100, 0);
          return new Response(JSON.stringify({
            success: true,
            count: result.total,
            ips: result.data
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && blacklistSubAction === 'remove') {
          // 解封IP
          const ip = url.searchParams.get('ip');
          if (!ip) {
            return new Response('Missing IP parameter', { status: 400 });
          }

          await unbanIP(env, ip);
          return new Response(JSON.stringify({
            success: true,
            message: `IP ${ip} has been unbanned`
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && blacklistSubAction === 'stats') {
          // 查看IP访问统计
          const ip = url.searchParams.get('ip');
          if (!ip) {
            return new Response('Missing IP parameter', { status: 400 });
          }

          const stats = await getIPAccessStats(env, ip);
          return new Response(JSON.stringify({
            success: true,
            ip,
            stats
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && blacklistSubAction === 'ban') {
          // 手动封禁IP
          const data = await request.json();
          if (!data.ip) {
            return new Response('Missing IP parameter', { status: 400 });
          }

          await banIP(env, data.ip, data.reason || 'Manual ban', data.details || {});
          return new Response(JSON.stringify({
            success: true,
            message: `IP ${data.ip} has been banned`
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'sql':
        // 执行SQL查询
        if (request.method === 'POST') {
          const data = await request.json();
          const sql = data.sql;

          if (!sql) {
            return new Response('Missing SQL query', { status: 400 });
          }

          try {
            const db = getDB();
            const result = await db.prepare(sql).all();

            return new Response(JSON.stringify({
              success: true,
              results: result.results || [],
              meta: result.meta || {}
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (error) {
            return new Response(JSON.stringify({
              success: false,
              error: error.message
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else {
          return new Response('Method not allowed', { status: 405 });
        }
        break;

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

// 获取符合查询条件的卡密用于导出
async function getCodesForExport(params) {
  const db = getDB();
  let codesQuery = 'SELECT * FROM codes';
  const queryParams = [];
  const whereConditions = [];

  const statusFilter = params.get('status') || '';
  const expiredFrom = params.get('expired_from') || '';
  const expiredTo = params.get('expired_to') || '';
  const activatedFrom = params.get('activated_from') || '';
  const activatedTo = params.get('activated_to') || '';
  const durationMin = params.get('duration_min') || '';
  const durationMax = params.get('duration_max') || '';
  const remark = params.get('remark') || '';

  if (statusFilter) {
    whereConditions.push('status = ?');
    queryParams.push(statusFilter);
  }
  if (expiredFrom) {
    whereConditions.push('expired_at >= ?');
    queryParams.push(expiredFrom);
  }
  if (expiredTo) {
    whereConditions.push('expired_at <= ?');
    queryParams.push(expiredTo);
  }
  if (activatedFrom) {
    whereConditions.push('activated_at >= ?');
    queryParams.push(activatedFrom);
  }
  if (activatedTo) {
    whereConditions.push('activated_at <= ?');
    queryParams.push(activatedTo);
  }
  if (durationMin) {
    whereConditions.push('duration_days >= ?');
    queryParams.push(parseInt(durationMin));
  }
  if (durationMax) {
    whereConditions.push('duration_days <= ?');
    queryParams.push(parseInt(durationMax));
  }
  if (remark) {
    whereConditions.push('remark LIKE ?');
    queryParams.push('%' + remark + '%');
  }

  if (whereConditions.length > 0) {
    codesQuery += ' WHERE ' + whereConditions.join(' AND ');
  }

  codesQuery += ' ORDER BY code DESC';
  const codes = await db.prepare(codesQuery).bind(...queryParams).all();
  return codes.results || [];
}

// 格式化日期时间
function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// 转义CSV字段
function escapeCsvField(field) {
  if (!field) return '';
  const str = String(field);
  // 如果包含逗号、引号或换行，需要用引号包裹并转义引号
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
