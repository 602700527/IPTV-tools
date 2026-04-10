// 管理后台API处理器
import { getDB, createTables, fetchAndParseM3U, getSecurityConfig, updateSecurityConfig, getIPBlacklistConfig, updateIPBlacklistConfig, getHomepageDisplayConfig, updateHomepageDisplayConfig, getSystemConfig, updateSystemConfig, generateEncryptionKey, getSyncFilterConfig, updateSyncFilterConfig, getDomainBlacklist, addDomainToBlacklist, removeDomainFromBlacklist, addMultipleDomainsToBlacklist } from '../database.js';
import {
  handleGetPaymentMethods,
  handleUpdatePaymentMethod,
  handleDeletePaymentMethod,
  handleGetMallSettings,
  handleUpdateMallSettings
} from './mall-api.js';
import { handleGetXunhuPayOrders } from './xunhupay-api.js';
import { manualSyncAll } from './scheduler.js';
import { getBlacklistedIPs, unbanIP, getIPAccessStats, banIP } from '../security/ip-blacklist.js';
import { getBannedCodesFromCache, removeBannedCodeFromCache, syncBannedCodesToCache } from '../security/code-ban-cache.js';
import { cacheChannelsToKV, clearChannelCache, getCacheStatus } from '../utils/channel-cache.js';

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

        // 获取同步过滤规则配置
        if (syncSubAction === 'filter' && request.method === 'GET') {
          const config = await getSyncFilterConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 保存同步过滤规则配置
        if (syncSubAction === 'filter' && request.method === 'POST') {
          const data = await request.json();

          // 验证配置格式
          const validConfig = {
            excludeGroups: Array.isArray(data.excludeGroups) ? data.excludeGroups : [],
            excludeUrls: Array.isArray(data.excludeUrls) ? data.excludeUrls : [],
            excludeNames: Array.isArray(data.excludeNames) ? data.excludeNames : [],
            excludeDuplicateUrls: typeof data.excludeDuplicateUrls === 'boolean' ? data.excludeDuplicateUrls : false,
            groupRenameRules: Array.isArray(data.groupRenameRules) ? data.groupRenameRules : [],
            groupRenameExclude: Array.isArray(data.groupRenameExclude) ? data.groupRenameExclude : []
          };

          await updateSyncFilterConfig(validConfig);

          return new Response(JSON.stringify({
            success: true,
            message: '同步过滤规则已更新',
            config: validConfig
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 同步所有启用的源
        if (syncSubAction === 'all' && request.method === 'POST') {
          const filter = await request.json();
          console.log('[Admin] Sync all with filter:', filter);
          const result = await manualSyncAll(env, filter);
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

        // 获取过滤参数（从请求体中读取）
        let filter = null;
        if (request.method === 'POST') {
          try {
            filter = await request.json();
            console.log('[Admin] Sync source with filter:', filter);
          } catch (e) {
            console.error('Failed to parse filter:', e);
          }
        }

        // 先更新源的同步时间（使用 JavaScript 生成当前时间）
        const now = new Date().toISOString();
        await db.prepare(`UPDATE sources SET last_updated = ? WHERE id = ?`).bind(now, sourceId).run();

        // 获取并解析M3U内容（注意：fetchAndParseM3U也会更新时间，所以这里更新两次）
        const result = await fetchAndParseM3U(source.url, sourceId, filter);

        // 添加删除统计信息
        result.deletedChannels = oldChannelCount;

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'codes':
        // 处理卡密管理
        if (request.method === 'POST' && url.searchParams.get('action') === 'batch_delete') {
          // 批量删除卡密
          const data = await request.json();
          const { codes } = data;

          if (!Array.isArray(codes) || codes.length === 0) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid codes array' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const db = getDB();
          let deleted = 0;

          for (const code of codes) {
            if (!code) continue;
            const result = await db.prepare('DELETE FROM codes WHERE code = ?').bind(code).run();
            if (result.meta.changes > 0) {
              deleted++;
            }
          }

          return new Response(JSON.stringify({
            success: true,
            deleted,
            message: `Deleted ${deleted} codes`
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET') {
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
          const codeSearch = url.searchParams.get('code_search') || '';

          let codesQuery = 'SELECT * FROM codes';
          const countQuery = 'SELECT COUNT(*) as total FROM codes';
          const params = [];
          const whereConditions = [];

          if (statusFilter) {
            whereConditions.push('status = ?');
            params.push(statusFilter);
          }
          if (codeSearch) {
            whereConditions.push('code LIKE ?');
            params.push('%' + codeSearch + '%');
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
          let expiredAt = new Date();
          // 如果 duration_days 为 -1 表示永久卡密
          if (code.duration_days === -1) {
            expiredAt = null; // 永久卡密不设置过期时间
          } else {
            expiredAt.setTime(expiredAt.getTime() + code.duration_days * 24 * 60 * 60 * 1000);
          }

          // 激活卡密
          await getDB().prepare(`
            UPDATE codes SET status = 'active', activated_at = ?, expired_at = ?
            WHERE code = ?
          `).bind(
            now,
            expiredAt ? expiredAt.toISOString() : null,
            data.code
          ).run();

          return new Response(JSON.stringify({
            success: true,
            activated_at: now,
            expired_at: expiredAt ? expiredAt.toISOString() : null
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && url.searchParams.get('action') === 'import') {
          // 批量导入卡密
          const data = await request.json();
          const { codes: importCodes, skip_duplicates, update_existing } = data;

          if (!Array.isArray(importCodes) || importCodes.length === 0) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid data format' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const db = getDB();
          let imported = 0;
          let skipped = 0;
          let errors = 0;
          const errorDetails = [];

          for (const item of importCodes) {
            const { code, duration_days, activated_at, expired_at, remark } = item;

            if (!code || !duration_days) {
              errors++;
              errorDetails.push(`Missing required fields for code: ${code || 'unknown'}`);
              continue;
            }

            try {
              const existing = await db.prepare('SELECT * FROM codes WHERE code = ?').bind(code).first();

              if (existing) {
                if (skip_duplicates && !update_existing) {
                  skipped++;
                } else if (update_existing) {
                  let updateFields = [];
                  let updateParams = [];

                  updateFields.push('duration_days = ?');
                  updateParams.push(duration_days);

                  if (activated_at) {
                    updateFields.push('activated_at = ?');
                    updateParams.push(parseBeijingTime(activated_at));
                  }

                  if (expired_at) {
                    updateFields.push('expired_at = ?');
                    updateParams.push(parseBeijingTime(expired_at));
                  } else if (duration_days === -1) {
                    updateFields.push('expired_at = ?');
                    updateParams.push(null); // 永久卡密
                  } else {
                    const defaultExpiredAt = new Date();
                    defaultExpiredAt.setTime(defaultExpiredAt.getTime() + duration_days * 24 * 60 * 60 * 1000);
                    updateFields.push('expired_at = ?');
                    updateParams.push(defaultExpiredAt.toISOString());
                  }

                  if (remark !== undefined) {
                    updateFields.push('remark = ?');
                    updateParams.push(remark || '');
                  }

                  updateParams.push(code);

                  await db.prepare(`
                    UPDATE codes SET ${updateFields.join(', ')} WHERE code = ?
                  `).bind(...updateParams).run();

                  imported++;
                } else {
                  skipped++;
                }
              } else {
                let activatedAtISO = null;
                let expiredAtISO = null;

                if (activated_at) {
                  activatedAtISO = parseBeijingTime(activated_at);
                }

                if (expired_at) {
                  expiredAtISO = parseBeijingTime(expired_at);
                } else if (duration_days === -1) {
                  expiredAtISO = null; // 永久卡密
                } else {
                  const defaultExpiredAt = new Date();
                  defaultExpiredAt.setTime(defaultExpiredAt.getTime() + duration_days * 24 * 60 * 60 * 1000);
                  expiredAtISO = defaultExpiredAt.toISOString();
                }

                const status = activatedAtISO ? 'active' : 'unused';

                await db.prepare(`
                  INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, remark)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                  code,
                  status,
                  duration_days,
                  activatedAtISO,
                  expiredAtISO,
                  3,
                  remark || ''
                ).run();

                imported++;
              }
            } catch (error) {
              errors++;
              errorDetails.push(`Error importing code ${code}: ${error.message}`);
            }
          }

          return new Response(JSON.stringify({
            success: true,
            imported,
            skipped,
            errors,
            errorDetails
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

            // 生成卡密时只设置 status='unused' 和 duration_days
            // activated_at 和 expired_at 在激活时设置
            await db.prepare(`
              INSERT INTO codes (code, status, duration_days, max_ips, remark)
              VALUES (?, 'unused', ?, ?, ?)
            `).bind(
              code,
              data.duration_days,
              data.max_ips || 3,
              data.remark || ''
            ).run();

            codes.push({
              code,
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
        } else if (request.method === 'DELETE') {
          // 清空所有卡密数据
          const db = getDB();

          const countResult = await db.prepare('SELECT COUNT(*) as count FROM codes').first();
          const codeCount = countResult?.count || 0;

          await db.prepare('DELETE FROM codes').run();

          return new Response(JSON.stringify({
            success: true,
            message: 'Deleted ' + codeCount + ' codes'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'channels':
        // 获取频道列表（支持分页）
        const action = url.searchParams.get('action');
        const sourceIdFilter = url.searchParams.get('source_id');
        const groupTitleFilter = url.searchParams.get('group_title');
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('page_size')) || 100;
        const search = url.searchParams.get('search') || '';

        // 获取所有分组列表
        if (action === 'get_groups') {
          const db = getDB();
          let query = 'SELECT DISTINCT c.group_title FROM channels c';
          const params = [];
          const conditions = [];

          // 基础条件：分组不为空
          conditions.push('c.group_title IS NOT NULL');
          conditions.push('c.group_title != ""');

          // 如果指定了source_id，添加JOIN和过滤条件
          if (sourceIdFilter) {
            query += ' INNER JOIN sources s ON c.source_id = s.id';
            conditions.push('s.id = ?');
            params.push(sourceIdFilter);
          }

          query += ' WHERE ' + conditions.join(' AND ') + ' ORDER BY c.group_title';

          const groups = await db.prepare(query).bind(...params).all();
          return new Response(JSON.stringify({ groups: groups.results.map(g => g.group_title) }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

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

        if (groupTitleFilter) {
          whereConditions.push('c.group_title = ?');
          params.push(groupTitleFilter);
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

        // 在应用层进行分组内排序（英文 -> 数字 -> 中文）
        if (formattedResults.length > 0) {
          formattedResults.sort((a, b) => {
            const groupA = a.group_title || '';
            const groupB = b.group_title || '';
            // 先按分组名排序
            if (groupA !== groupB) {
              return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
            }

            // 同一分组内：英文 -> 数字 -> 中文（数字按数值大小排序）
            const nameA = a.channel_name || '';
            const nameB = b.channel_name || '';

            // 尝试提取CCTV格式的数字
            const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
            const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);

            // 如果都是CCTV格式（字母开头+数字），按数字大小排序
            if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
              const numA = parseInt(cctvMatchA[2]);
              const numB = parseInt(cctvMatchB[2]);
              if (numA !== numB) {
                return numA - numB;
              }
              // 数字相同，继续按后缀排序（无后缀的排前面）
              const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
              const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);

              // 如果一个有后缀一个没有，无后缀的排前面
              const hasSuffixA = suffixA.trim().length > 0;
              const hasSuffixB = suffixB.trim().length > 0;
              if (hasSuffixA !== hasSuffixB) {
                return hasSuffixA ? 1 : -1;
              }

              // 都有后缀或都没有后缀，按后缀内容排序
              return suffixA.localeCompare(suffixB, 'zh-CN', { numeric: true });
            }

            // 普通排序：按字符逐个比较
            for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
              const charA = nameA.charCodeAt(i);
              const charB = nameB.charCodeAt(i);

              // 英文字母 (A-Z, a-z: 65-90, 97-122)
              const isAlphaA = (charA >= 65 && charA <= 90) || (charA >= 97 && charA <= 122);
              const isAlphaB = (charB >= 65 && charB <= 90) || (charB >= 97 && charB <= 122);

              // 数字 (0-9: 48-57)
              const isDigitA = charA >= 48 && charA <= 57;
              const isDigitB = charB >= 48 && charB <= 57;

              // 中文 (\u4e00-\u9fa5: 19968-40869)
              const isChineseA = charA >= 19968 && charA <= 40869;
              const isChineseB = charB >= 19968 && charB <= 40869;

              // 确定字符类型优先级：英文=1, 数字=2, 中文=3
              const typeA = isAlphaA ? 1 : (isDigitA ? 2 : (isChineseA ? 3 : 4));
              const typeB = isAlphaB ? 1 : (isDigitB ? 2 : (isChineseB ? 3 : 4));

              // 类型不同时，按类型排序
              if (typeA !== typeB) {
                return typeA - typeB;
              }

              // 类型相同时，按字符值排序
              if (charA !== charB) {
                return charA - charB;
              }
            }

            // 所有字符都相等，按长度排序
            return nameA.length - nameB.length;
          });
        }

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

      case 'homepage-display':
        // 首页展示配置管理
        if (request.method === 'GET') {
          const config = await getHomepageDisplayConfig();

          // 获取所有可用的数据源
          const sources = await getDB().prepare('SELECT id, name, url FROM sources WHERE is_active = 1 ORDER BY id').all();
          const sourceList = sources.results || [];

          // 获取所有可用的分类
          const groups = await getDB().prepare(`
            SELECT DISTINCT group_title
            FROM channels
            WHERE is_active = 1
            ORDER BY group_title
          `).all();
          const groupList = (groups.results || [])
            .map(g => g.group_title)
            .filter(g => g);

          // 获取所有可用的host（从play_url提取）
          const hostResult = await getDB().prepare(`
            SELECT DISTINCT play_url
            FROM channels
            WHERE is_active = 1
            LIMIT 1000
          `).all();

          const hostSet = new Set();
          (hostResult.results || []).forEach(row => {
            try {
              const url = new URL(row.play_url);
              hostSet.add(url.hostname);
            } catch (e) {
              // 忽略无效URL
            }
          });
          const hostList = Array.from(hostSet).sort();

          return new Response(JSON.stringify({
            success: true,
            config,
            options: {
              sources: sourceList,
              groups: groupList,
              hosts: hostList
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        } else if (request.method === 'POST') {
          const data = await request.json();

          // 验证配置格式
          const validConfig = {
            sources: Array.isArray(data.sources) ? data.sources : [],
            groups: Array.isArray(data.groups) ? data.groups : [],
            hosts: Array.isArray(data.hosts) ? data.hosts : [],
            hasHeaders: data.hasHeaders !== undefined ? data.hasHeaders : null
          };
          console.log('[admin/homepage-display] 保存配置，hasHeaders:', validConfig.hasHeaders);

          await updateHomepageDisplayConfig(validConfig);

          return new Response(JSON.stringify({
            success: true,
            message: '首页展示配置已更新',
            config: validConfig
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
        }
        break;

      case 'system-config':
        // 系统配置管理
        if (request.method === 'GET') {
          const config = await getSystemConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          const data = await request.json();

          const config = {};
          if (data.enable_ref_check !== undefined) {
            config.enable_ref_check = data.enable_ref_check;
          }
          if (data.ref_whitelist !== undefined) {
            config.ref_whitelist = data.ref_whitelist;
          }
          if (data.enable_play_token !== undefined) {
            config.enable_play_token = data.enable_play_token;
          }
          if (data.play_token_expire_seconds !== undefined && data.play_token_expire_seconds > 0) {
            config.play_token_expire_seconds = parseInt(data.play_token_expire_seconds);
          }
          if (data.enable_ip_bind !== undefined) {
            config.enable_ip_bind = data.enable_ip_bind;
          }
          if (data.enable_burn_after_read !== undefined) {
            config.enable_burn_after_read = data.enable_burn_after_read;
          }
          if (data.enable_url_encryption !== undefined) {
            config.enable_url_encryption = data.enable_url_encryption;
          }
          if (data.url_encryption_key !== undefined) {
            config.url_encryption_key = data.url_encryption_key;
          }
          if (data.enable_anti_debug !== undefined) {
            config.enable_anti_debug = data.enable_anti_debug;
          }
          if (data.disable_console_logs !== undefined) {
            config.disable_console_logs = data.disable_console_logs;
          }
          if (data.enable_ip_play !== undefined) {
            config.enable_ip_play = data.enable_ip_play;
          }
          if (data.member_ad_free_enabled !== undefined) {
            config.member_ad_free_enabled = data.member_ad_free_enabled;
          }
          if (data.rotate_encryption_key === true) {
            // 自动轮换密钥
            const newKey = generateRandomEncryptionKey();
            config.url_encryption_key = newKey;
            config.rotate_encryption_key = true; // 标记为密钥轮换
          }

          await updateSystemConfig(config);

          return new Response(JSON.stringify({
            success: true,
            message: '系统配置已更新',
            config
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

      case 'cache':
        // 缓存管理
        const cacheSubAction = pathParts[3];

        // 获取缓存状态
        if (cacheSubAction === 'status' && request.method === 'GET') {
          const status = await getCacheStatus(env);
          return new Response(JSON.stringify({
            success: true,
            ...status
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 刷新缓存
        if (cacheSubAction === 'refresh' && request.method === 'POST') {
          const result = await cacheChannelsToKV(env);
          return new Response(JSON.stringify({
            success: result.success,
            message: result.success ? `缓存刷新成功：${result.channels} 个频道，${result.groups} 个分组` : '缓存刷新失败',
            channels: result.channels,
            groups: result.groups,
            version: result.version,
            error: result.error
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 清空缓存并重新生成
        if (cacheSubAction === 'clear' && request.method === 'POST') {
          console.log('[Admin] Clearing cache and regenerating...');
          
          // 先清除旧缓存
          const cleared = await clearChannelCache(env);
          
          if (cleared) {
            // 立即重新生成缓存
            const result = await cacheChannelsToKV(env);
            
            return new Response(JSON.stringify({
              success: true,
              message: '缓存已清空并重新生成',
              channels: result.channels || 0,
              groups: result.groups || 0,
              version: result.version
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            return new Response(JSON.stringify({
              success: false,
              message: '缓存清空失败'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        return new Response('Invalid cache action', { status: 400 });

      case 'announcement':
        // 公告管理
        if (request.method === 'GET') {
          // 获取最新的公告
          const db = getDB();
          const announcement = await db.prepare(`
            SELECT * FROM announcements
            ORDER BY updated_at DESC
            LIMIT 1
          `).first();

          return new Response(JSON.stringify({
            success: true,
            data: announcement
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          // 创建或更新公告
          const data = await request.json();
          const db = getDB();
          const now = new Date().toISOString();

          // 如果是更新现有公告
          if (data.id) {
            await db.prepare(`
              UPDATE announcements
              SET title = ?, content = ?, enabled = ?, display_frequency = ?, updated_at = ?
              WHERE id = ?
            `).bind(
              data.title,
              data.content,
              data.enabled !== undefined ? (data.enabled ? 1 : 0) : 1,
              data.display_frequency || 'once',
              now,
              data.id
            ).run();

            return new Response(JSON.stringify({
              success: true,
              message: '公告更新成功'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // 创建新公告
            const result = await db.prepare(`
              INSERT INTO announcements (title, content, enabled, display_frequency, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              data.title,
              data.content,
              data.enabled !== undefined ? (data.enabled ? 1 : 0) : 1,
              data.display_frequency || 'once',
              now,
              now
            ).run();

            return new Response(JSON.stringify({
              success: true,
              message: '公告创建成功',
              id: result.meta.last_row_id
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        break;

      case 'mall':
        // 商城管理
        const mallSubAction = pathParts[3];

        if (!mallSubAction) {
          return new Response('Invalid mall action', { status: 400 });
        }

        if (mallSubAction === 'settings') {
          const db = getDB();
          if (request.method === 'GET') {
            // 获取商城设置
            const settings = await db.prepare('SELECT * FROM mall_settings').all();
            const settingsMap = {};
            (settings.results || []).forEach(s => {
              settingsMap[s.key] = s.value;
            });

            return new Response(JSON.stringify({
              success: true,
              settings: settingsMap
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'PUT') {
            // 更新商城设置
            const data = await request.json();
            const now = new Date().toISOString();

            if (data.mall_enabled !== undefined) {
              await db.prepare(`
                INSERT OR REPLACE INTO mall_settings (key, value, updated_at)
                VALUES ('mall_enabled', ?, ?)
              `).bind(data.mall_enabled, now).run();
            }

            if (data.subscription_enabled !== undefined) {
              await db.prepare(`
                INSERT OR REPLACE INTO mall_settings (key, value, updated_at)
                VALUES ('subscription_enabled', ?, ?)
              `).bind(data.subscription_enabled, now).run();
            }

            return new Response(JSON.stringify({
              success: true,
              message: '商城设置已更新'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (mallSubAction === 'plans') {
          // 订阅套餐管理
          const db = getDB();
          const planId = pathParts[4];
          const isToggleAction = pathParts[5] === 'toggle';

          if (request.method === 'GET') {
            // 获取所有套餐
            const plans = await db.prepare('SELECT * FROM subscription_plans ORDER BY sort_order, id').all();
            return new Response(JSON.stringify({
              success: true,
              plans: plans.results || []
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'POST') {
            // 添加套餐
            const data = await request.json();
            const now = new Date().toISOString();

            await db.prepare(`
              INSERT INTO subscription_plans (name, name_en, days, base_price, price_per_ip, discount, is_enabled, sort_order, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              data.name,
              data.name_en || null,
              data.days,
              data.base_price,
              data.price_per_ip,
              data.discount || 0,
              data.is_enabled !== undefined ? data.is_enabled : 1,
              data.sort_order || 0,
              now,
              now
            ).run();

            return new Response(JSON.stringify({
              success: true,
              message: '套餐已添加'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'PUT') {
            if (isToggleAction) {
              // 切换套餐状态
              const data = await request.json();
              const now = new Date().toISOString();

              await db.prepare(`
                UPDATE subscription_plans SET is_enabled = ?, updated_at = ? WHERE id = ?
              `).bind(data.is_enabled, now, planId).run();

              return new Response(JSON.stringify({
                success: true,
                message: '套餐状态已更新'
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            } else {
              // 更新套餐
              const data = await request.json();
              const now = new Date().toISOString();

              await db.prepare(`
                UPDATE subscription_plans SET name = ?, name_en = ?, days = ?, base_price = ?, price_per_ip = ?, discount = ?, is_enabled = ?, sort_order = ?, updated_at = ?
                WHERE id = ?
              `).bind(
                data.name,
                data.name_en || null,
                data.days,
                data.base_price,
                data.price_per_ip,
                data.discount || 0,
                data.is_enabled !== undefined ? data.is_enabled : 1,
                data.sort_order || 0,
                now,
                data.id
              ).run();

              return new Response(JSON.stringify({
                success: true,
                message: '套餐已更新'
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } else if (request.method === 'DELETE' && planId) {
            // 删除套餐
            await db.prepare('DELETE FROM subscription_plans WHERE id = ?').bind(planId).run();

            return new Response(JSON.stringify({
              success: true,
              message: '套餐已删除'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (mallSubAction === 'payment-methods') {
          // 支付方式管理
          if (request.method === 'GET') {
            return await handleGetPaymentMethods(request, env);
          } else if (request.method === 'POST') {
            return await handleCreatePaymentMethod(request, env);
          } else if (request.method === 'PUT') {
            // 更新支付方式配置（没有 pathParts[4] 时）或切换状态（有 pathParts[4] 时）
            if (pathParts[4]) {
              // 切换支付方式状态: /admin/mall/payment-methods/{id}
              const id = parseInt(pathParts[4]);
              return await handleTogglePaymentMethod(request, env, ctx, id);
            } else {
              // 更新支付方式配置: /admin/mall/payment-methods
              return await handleUpdatePaymentMethod(request, env);
            }
          } else if (request.method === 'DELETE' && pathParts[4]) {
            // 删除支付方式（从URL查询参数中获取id）
            const id = pathParts[4];
            const newUrl = new URL(request.url);
            newUrl.searchParams.set('id', id);
            const newRequest = new Request(newUrl.toString(), {
              method: request.method,
              headers: request.headers
            });
            return await handleDeletePaymentMethod(newRequest, env);
          }
        }
        break;

      case 'ad-ts':
        // 广告TS文件管理
        const adTsSubAction = pathParts[3];

        if (request.method === 'GET' && !adTsSubAction) {
          // 获取所有广告TS文件列表
          const db = getDB();
          const adTsFiles = await db.prepare('SELECT * FROM ad_ts_files ORDER BY created_at DESC').all();

          return new Response(JSON.stringify({
            success: true,
            count: adTsFiles.results?.length || 0,
            files: adTsFiles.results || []
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && adTsSubAction === 'upload') {
          // 上传广告TS文件 或 添加远程广告URL
          const formData = await request.formData();
          const file = formData.get('file');
          const name = formData.get('name');
          const adType = formData.get('ad_type') || 'normal';
          const description = formData.get('description') || '';
          const isActive = formData.get('is_active') === 'true';
          const remoteUrl = formData.get('remote_url') || '';

          const db = getDB();
          const now = new Date().toISOString();

          // 如果提供了远程URL，则不需要上传文件
          if (remoteUrl) {
            // 验证远程URL格式
            try {
              new URL(remoteUrl);
            } catch (e) {
              return new Response(JSON.stringify({
                success: false,
                error: '远程URL格式无效'
              }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }

            // 保存远程URL
            await db.prepare(`
              INSERT INTO ad_ts_files (name, content, ad_type, description, is_active, remote_url, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              name || '远程广告',
              '',
              adType,
              description,
              isActive ? 1 : 0,
              remoteUrl,
              now,
              now
            ).run();

            return new Response(JSON.stringify({
              success: true,
              message: '远程广告URL添加成功'
            }), { headers: { 'Content-Type': 'application/json' } });
          }

          // 如果没有文件也没有远程URL，返回错误
          if (!file) {
            return new Response(JSON.stringify({ success: false, error: '请上传TS文件或填写远程广告URL' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // 将文件内容转换为Base64
          const arrayBuffer = await file.arrayBuffer();
          let binary = '';
          const bytes = new Uint8Array(arrayBuffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          // 检查 Base64 编码后的大小 (D1 实际限制约 1MB)
          // Base64 编码后大小约为原始大小的 4/3，我们保留约 800KB 的安全余量
          if (base64.length > 800 * 1024) {
            return new Response(JSON.stringify({
              success: false,
              error: `文件大小超出数据库限制 (${(file.size / 1024).toFixed(2)}KB)，编码后 ${(base64.length / 1024).toFixed(2)}KB > 800KB。建议压缩TS文件内容`
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          try {
            const result = await db.prepare(`
              INSERT INTO ad_ts_files (name, content, ad_type, description, is_active, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(
              name || file.name,
              base64,
              adType,
              description,
              isActive ? 1 : 0,
              now,
              now
            ).run();

            console.log('[Ad Upload] File uploaded successfully:', name || file.name, 'size:', base64.length);
          } catch (dbError) {
            console.error('[Ad Upload] Database error:', dbError);
            throw dbError;
          }

          return new Response(JSON.stringify({
            success: true,
            message: '广告TS文件上传成功'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && adTsSubAction === 'delete') {
          // 删除广告TS文件
          const id = url.searchParams.get('id');
          if (!id) {
            return new Response('Missing id parameter', { status: 400 });
          }

          const db = getDB();
          await db.prepare('DELETE FROM ad_ts_files WHERE id = ?').bind(id).run();

          return new Response(JSON.stringify({
            success: true,
            message: '广告TS文件已删除'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && adTsSubAction === 'update') {
          // 更新广告TS文件（启用/禁用广告）
          const id = url.searchParams.get('id');
          if (!id) {
            return new Response('Missing id parameter', { status: 400 });
          }

          const db = getDB();
          const now = new Date().toISOString();

          await db.prepare(`
            UPDATE ad_ts_files SET is_active = 1, updated_at = ? WHERE id = ?
          `).bind(now, id).run();

          return new Response(JSON.stringify({
            success: true,
            message: '广告TS文件已启用'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && adTsSubAction === 'disable') {
          // 禁用广告TS文件
          const id = url.searchParams.get('id');
        }
        break;

      case 'ad-bindings':
        // 广告绑定管理
        const adBindingsSubAction = pathParts[3];

        if (request.method === 'GET' && !adBindingsSubAction) {
          // 获取所有广告绑定列表
          const db = getDB();
          const bindings = await db.prepare(`
            SELECT ab.*, ats.name as ad_name
            FROM ad_bindings ab
            LEFT JOIN ad_ts_files ats ON ab.ad_id = ats.id
            ORDER BY ab.action_type, ab.priority DESC
          `).all();

          const actionTypeLabels = {
            'code_normal': '卡密正常播放',
            'code_expired': '卡密过期播放',
            'code_unauth': '卡密IP未授权',
            'code_channel_not_found': '频道不存在卡密播放',
            'freesub_normal': '免费订阅正常播放',
            'freesub_expired': '免费订阅过期播放',
            'freesub_unauth': '免费订阅IP未授权',
            'freesub_channel_not_found': '频道不存在免费播放'
          };

          const formattedBindings = (bindings.results || []).map(b => ({
            ...b,
            action_type_label: actionTypeLabels[b.action_type] || b.action_type,
            cooldown_display: b.cooldown_seconds > 0 ? `${b.cooldown_seconds}秒` : '不限制'
          }));

          return new Response(JSON.stringify({
            success: true,
            count: formattedBindings.length,
            bindings: formattedBindings
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && adBindingsSubAction === 'create') {
          // 创建广告绑定
          const body = await request.json();
          const { action_type, ad_id, cooldown_seconds, priority } = body;

          if (!action_type) {
            return new Response(JSON.stringify({ success: false, error: 'action_type is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const db = getDB();
          const result = await db.prepare(`
            INSERT INTO ad_bindings (action_type, ad_id, cooldown_seconds, priority)
            VALUES (?, ?, ?, ?)
          `).bind(
            action_type,
            ad_id || null,
            cooldown_seconds || 0,
            priority || 0
          ).run();

          return new Response(JSON.stringify({
            success: true,
            message: '广告绑定创建成功',
            id: result.meta.last_row_id
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && adBindingsSubAction === 'update') {
          // 更新广告绑定
          const id = url.searchParams.get('id');
          if (!id) {
            return new Response('Missing id parameter', { status: 400 });
          }

          const body = await request.json();
          const { ad_id, cooldown_seconds, priority } = body;

          const db = getDB();
          await db.prepare(`
            UPDATE ad_bindings
            SET ad_id = ?,
                cooldown_seconds = ?,
                priority = ?,
                updated_at = datetime('now')
            WHERE id = ?
          `).bind(
            ad_id || null,
            cooldown_seconds || 0,
            priority || 0,
            id
          ).run();

          return new Response(JSON.stringify({
            success: true,
            message: '广告绑定更新成功'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && adBindingsSubAction === 'delete') {
          // 删除广告绑定
          const id = url.searchParams.get('id');
          if (!id) {
            return new Response('Missing id parameter', { status: 400 });
          }

          const db = getDB();
          await db.prepare('DELETE FROM ad_bindings WHERE id = ?').bind(id).run();

          return new Response(JSON.stringify({
            success: true,
            message: '广告绑定已删除'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'users':
        // 用户管理
        if (request.method === 'GET') {
          // 获取用户列表
          const page = parseInt(url.searchParams.get('page') || '1');
          const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
          const search = url.searchParams.get('search') || '';

          let query = 'SELECT * FROM users';
          let countQuery = 'SELECT COUNT(*) as total FROM users';
          const params = [];

          if (search) {
            query += ' WHERE email LIKE ?';
            countQuery += ' WHERE email LIKE ?';
            params.push(`%${search}%`);
          }

          query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

          const offset = (page - 1) * pageSize;
          const users = await getDB().prepare(query).bind(...params, pageSize, offset).all();
          const totalResult = await getDB().prepare(countQuery).bind(...params).first();
          const total = totalResult.total;

          return new Response(JSON.stringify({
            success: true,
            users: users.results || [],
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT') {
          // 更新用户状态
          const body = await request.json();
          const { id, is_verified } = body;

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: '用户ID不能为空' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          await getDB().prepare(`
            UPDATE users SET is_verified = ?, updated_at = datetime('now')
            WHERE id = ?
          `).bind(is_verified ? 1 : 0, id).run();

          return new Response(JSON.stringify({
            success: true,
            message: '用户状态更新成功'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE') {
          // 删除用户
          const id = url.searchParams.get('id');

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: '用户ID不能为空' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          await getDB().prepare('DELETE FROM users WHERE id = ?').bind(id).run();

          return new Response(JSON.stringify({
            success: true,
            message: '用户删除成功'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'orders':
        // 订单管理
        const ordersSubAction = pathParts[3];

        if (!ordersSubAction && request.method === 'GET') {
          // 获取 user_orders 列表
          const page = parseInt(url.searchParams.get('page') || '1');
          const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
          const userId = url.searchParams.get('userId');
          const emailFilter = url.searchParams.get('email');

          let query = 'SELECT o.*, u.email FROM user_orders o JOIN users u ON o.user_id = u.id';
          let countQuery = 'SELECT COUNT(*) as total FROM user_orders o JOIN users u ON o.user_id = u.id';
          const params = [];

          if (userId) {
            query += ' WHERE o.user_id = ?';
            countQuery += ' WHERE o.user_id = ?';
            params.push(userId);
          } else if (emailFilter) {
            query += ' WHERE u.email LIKE ?';
            countQuery += ' WHERE u.email LIKE ?';
            params.push('%' + emailFilter + '%');
          }

          query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';

          const offset = (page - 1) * pageSize;
          const orders = await getDB().prepare(query).bind(...params, pageSize, offset).all();
          const totalResult = await getDB().prepare(countQuery).bind(...params).first();
          const total = totalResult.total;

          return new Response(JSON.stringify({
            success: true,
            orders: orders.results || [],
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (ordersSubAction === 'xunhupay' && request.method === 'GET') {
          // 获取虎皮椒订单列表
          return await handleGetXunhuPayOrders(request, env, ctx);
        }
        break;

      case 'payment-methods':
        // 支付方式管理
        if (request.method === 'GET') {
          return await handleGetPaymentMethods(request, env, ctx);
        } else if (request.method === 'POST') {
          return await handleUpdatePaymentMethod(request, env, ctx);
        }
        break;

      case 'domain-blacklist':
        // 域名黑名单管理
        if (request.method === 'GET') {
          // 获取所有黑名单域名
          const domains = await getDomainBlacklist();
          return new Response(JSON.stringify({
            success: true,
            domains
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          // 添加域名到黑名单
          const data = await request.json();

          if (data.domains && Array.isArray(data.domains)) {
            // 批量添加
            const results = await addMultipleDomainsToBlacklist(data.domains);
            return new Response(JSON.stringify({
              success: true,
              results
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (data.domain) {
            // 单个添加
            try {
              const result = await addDomainToBlacklist(data.domain, data.reason || '');
              return new Response(JSON.stringify({
                success: true,
                ...result
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            } catch (e) {
              return new Response(JSON.stringify({
                success: false,
                error: e.message.includes('UNIQUE constraint') ? '域名已存在' : e.message
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } else {
            return new Response(JSON.stringify({
              success: false,
              error: '请提供域名'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (request.method === 'DELETE') {
          // 从黑名单删除域名
          const domainId = pathParts[3];
          if (!domainId) {
            return new Response('Missing domain ID', { status: 400 });
          }

          try {
            const success = await removeDomainFromBlacklist(parseInt(domainId));
            if (success) {
              return new Response(JSON.stringify({
                success: true,
                message: '域名已从黑名单中删除'
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            } else {
              return new Response(JSON.stringify({
                success: false,
                error: '域名不存在'
              }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } catch (e) {
            return new Response(JSON.stringify({
              success: false,
              error: e.message
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        break;

      case 'tickets':
        // 工单管理
        return await handleAdminTickets(request, env, ctx);

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

// 解析北京时间格式的日期字符串
function parseBeijingTime(dateStr) {
  if (!dateStr) return null;

  try {
    let parsedDate;
    const trimmedStr = dateStr.trim();

    if (trimmedStr.includes(' ') && trimmedStr.includes(':')) {
      const parts = trimmedStr.split(' ');
      const datePart = parts[0];
      const timePart = parts.slice(1).join(' ');
      const isoStr = `${datePart}T${timePart}+08:00`;
      parsedDate = new Date(isoStr);
    } else {
      parsedDate = new Date(trimmedStr + 'T00:00:00+08:00');
    }

    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toISOString();
  } catch (error) {
    console.error('Error parsing Beijing time:', error);
    return null;
  }
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

// 生成随机加密密钥
function generateRandomEncryptionKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/**
 * 处理广告TS文件请求
 * @param {Request} request - 请求对象
 * @param {object} env - 环境变量
 * @param {object} ctx - 上下文
 * @returns {Response} 响应对象
 */
export async function handleAdTsFile(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const filename = pathParts[pathParts.length - 1]; // 获取文件名，如 123.ts

  // 提取广告ID
  const adId = filename.replace('.ts', '');
  const adIdNum = parseInt(adId);

  if (isNaN(adIdNum)) {
    return new Response('Invalid ad ID', { status: 400 });
  }

  const db = getDB();

  // 查询广告TS文件
  const adFile = await db.prepare('SELECT * FROM ad_ts_files WHERE id = ?').bind(adIdNum).first();

  if (!adFile) {
    console.log('[AdTS] Ad file not found:', adIdNum);
    return new Response('Ad not found', { status: 404 });
  }

  // 如果没有本地content，尝试获取远程URL内容
  let content = adFile.content;
  if (!content && adFile.remote_url) {
    try {
      console.log('[AdTS] Fetching remote ad content:', adFile.remote_url);
      const remoteResponse = await fetch(adFile.remote_url);
      if (remoteResponse.ok) {
        const arrayBuffer = await remoteResponse.arrayBuffer();
        // 使用chunked方式编码，避免栈溢出
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        const chunkSize = 8192;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, chunk);
        }
        content = btoa(binaryString);
        console.log('[AdTS] Fetched remote content length:', content.length);
      } else {
        console.error('[AdTS] Failed to fetch remote URL:', remoteResponse.status);
        return new Response('Failed to load remote ad content', { status: 502 });
      }
    } catch (fetchError) {
      console.error('[AdTS] Fetch error:', fetchError);
      return new Response('Failed to load remote ad content', { status: 502 });
    }
  }

  if (!content) {
    console.log('[AdTS] Ad file has no content:', adIdNum);
    return new Response('Ad content not available', { status: 404 });
  }

  console.log('[AdTS] Serving ad file:', adIdNum, 'name:', adFile.name, 'content length:', content.length);

  // 解码base64内容
  try {
    const binaryString = atob(adFile.content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('[AdTS] Decoded bytes length:', bytes.length, 'First 10 bytes:', Array.from(bytes.slice(0, 10)));

    // 检查TS魔数（TS文件应该以 0x47 开头）
    if (bytes.length < 188 || bytes[0] !== 0x47) {
      console.error('[AdTS] Invalid TS file format, expected 0x47 at start, got:', bytes[0].toString(16));
    }

    return new Response(bytes, {
      headers: {
        'Content-Type': 'video/mp2t',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': bytes.length.toString()
      }
    });
  } catch (error) {
    console.error('[AdTS] Error decoding ad TS content:', error);
    return new Response('Error decoding ad content', { status: 500 });
  }
}

/**
 * 切换支付方式的状态
 */
export async function handleTogglePaymentMethod(request, env, ctx, id) {
  try {
    const data = await request.json();
    const enabled = data.enabled;

    if (enabled === undefined) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing enabled field'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    await db.prepare(`
      UPDATE payment_methods
      SET enabled = ?, updated_at = datetime("now")
      WHERE id = ?
    `).bind(enabled ? 1 : 0, id).run();

    console.log('[Admin] Payment method toggled:', id, 'enabled:', enabled);

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment method status updated'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Admin] Toggle payment method error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to toggle payment method'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Ticket management routes
 * /admin/tickets - List tickets
 * /admin/tickets/:id - Ticket details
 * /admin/tickets/:id/reply - Admin reply
 * /admin/tickets/:id/resolve - Mark as resolved
 * /admin/tickets/:id/close - Close ticket
 */
export async function handleAdminTickets(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const ticketId = pathParts[3]; // /admin/tickets/:id 中的 :id
  const subAction = pathParts[4]; // /admin/tickets/:id/:action 中的 action

  try {
    const db = getDB();

    // 列表 GET /admin/tickets
    if (request.method === 'GET' && !ticketId) {
      const status = url.searchParams.get('status');
      const type = url.searchParams.get('type');
      const search = url.searchParams.get('search');

      let query = `
        SELECT t.*, u.email as user_email
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.id
        WHERE 1=1
      `;
      const bindings = [];

      if (status && status !== 'all') {
        query += ' AND t.status = ?';
        bindings.push(status);
      }

      if (type && type !== 'all') {
        query += ' AND t.type = ?';
        bindings.push(type);
      }

      if (search) {
        query += ' AND (u.email LIKE ? OR t.subject LIKE ?)';
        bindings.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY t.created_at DESC';

      console.log('[Admin Tickets] Executing query:', query);
      console.log('[Admin Tickets] Bindings:', bindings);
      
      const tickets = await db.prepare(query).bind(...bindings).all();
      console.log('[Admin Tickets] Query result:', tickets);

      return new Response(JSON.stringify({
        success: true,
        tickets: tickets.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 详情 GET /admin/tickets/:id
    if (request.method === 'GET' && ticketId && !subAction) {
      const ticket = await db.prepare(`
        SELECT t.*, u.email as user_email
        FROM tickets t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `).bind(ticketId).first();

      if (!ticket) {
        return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 获取订单信息
      const order = await db.prepare(`
        SELECT * FROM user_orders WHERE order_id = ?
      `).bind(ticket.order_id).first();

      // 获取回复
      const replies = await db.prepare(`
        SELECT r.*, u.email as user_email
        FROM ticket_replies r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.ticket_id = ?
        ORDER BY r.created_at ASC
      `).bind(ticketId).all();

      return new Response(JSON.stringify({
        success: true,
        ticket: ticket,
        order: order,
        replies: replies.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 回复 POST /admin/tickets/:id/reply
    if (request.method === 'POST' && subAction === 'reply') {
      const { content } = await request.json();

      if (!content || !content.trim()) {
        return new Response(JSON.stringify({ success: false, error: 'Content is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const ticket = await db.prepare('SELECT * FROM tickets WHERE id = ?').bind(ticketId).first();

      if (!ticket) {
        return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 添加管理员回复
      await db.prepare(`
        INSERT INTO ticket_replies (ticket_id, user_id, is_admin, content)
        VALUES (?, NULL, 1, ?)
      `).bind(ticketId, content.trim()).run();

      // 更新工单状态为 processing
      await db.prepare(`
        UPDATE tickets SET status = 'processing', updated_at = datetime('now') WHERE id = ?
      `).bind(ticketId).run();

      // 发送邮件通知用户
      try {
        const { sendEmail } = await import('../utils/email.js');
        const emailHtml = generateUserNotificationHtml('reply', ticket.subject);
        await sendEmail(ticket.user_email, `工单回复通知 - ${ticket.subject}`, emailHtml, env);
      } catch (emailError) {
        console.error('[Admin Ticket] Failed to send user notification email:', emailError);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Reply added successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 标记为已解决 POST /admin/tickets/:id/resolve
    if (request.method === 'POST' && subAction === 'resolve') {
      const ticket = await db.prepare('SELECT * FROM tickets WHERE id = ?').bind(ticketId).first();

      if (!ticket) {
        return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await db.prepare(`
        UPDATE tickets SET status = 'resolved', resolved_at = datetime('now'), updated_at = datetime('now') WHERE id = ?
      `).bind(ticketId).run();

      // 发送邮件通知用户
      try {
        const { sendEmail } = await import('../utils/email.js');
        const emailHtml = generateUserNotificationHtml('resolved', ticket.subject);
        await sendEmail(ticket.user_email, `工单已解决 - ${ticket.subject}`, emailHtml, env);
      } catch (emailError) {
        console.error('[Admin Ticket] Failed to send user notification email:', emailError);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Ticket resolved successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 关闭工单 POST /admin/tickets/:id/close
    if (request.method === 'POST' && subAction === 'close') {
      const ticket = await db.prepare('SELECT * FROM tickets WHERE id = ?').bind(ticketId).first();

      if (!ticket) {
        return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await db.prepare(`
        UPDATE tickets SET status = 'closed', updated_at = datetime('now') WHERE id = ?
      `).bind(ticketId).run();

      // 发送邮件通知用户
      try {
        const { sendEmail } = await import('../utils/email.js');
        const emailHtml = generateUserNotificationHtml('closed', ticket.subject);
        await sendEmail(ticket.user_email, `工单已关闭 - ${ticket.subject}`, emailHtml, env);
      } catch (emailError) {
        console.error('[Admin Ticket] Failed to send user notification email:', emailError);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Ticket closed successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Admin Tickets] Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 生成用户通知邮件 HTML (Admin用)
 */
function generateUserNotificationHtml(action, ticketSubject) {
  const actionLabels = {
    reply: '工单回复通知',
    resolved: '工单已解决',
    closed: '工单已关闭'
  };

  const actionMessages = {
    reply: '管理员已回复您的工单，请查看。',
    resolved: '您的工单已标记为已解决。',
    closed: '您的工单已被关闭。'
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actionLabels[action]}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📺 TV Live Service</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">${actionLabels[action]}</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 20px;">${ticketSubject}</h2>
      
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
        ${actionMessages[action]}
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
        请登录您的账户查看详情
      </p>
    </div>
    
    <div style="background-color: #f5f5f7; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        此邮件由系统自动发送，请勿回复。如有疑问，请联系客服。
      </p>
    </div>
  </div>
</body>
</html>
  `;
}


