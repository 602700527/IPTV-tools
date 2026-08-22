// API
import { getDB, initDB, createTables, fetchAndParseM3U, getSecurityConfig, updateSecurityConfig, getIPBlacklistConfig, updateIPBlacklistConfig, getHomepageDisplayConfig, updateHomepageDisplayConfig, getSystemConfig, updateSystemConfig, getSyncFilterConfig, updateSyncFilterConfig, getTypeMappingConfig, updateTypeMappingConfig, getDomainBlacklist, addDomainToBlacklist, removeDomainFromBlacklist, addMultipleDomainsToBlacklist, getTopics, getTopic, createTopic, updateTopic, deleteTopic, applyTopicFilter } from '../database.js';
import {
  handleGetPaymentMethods,
  handleCreatePaymentMethod,
  handleUpdatePaymentMethod,
  handleDeletePaymentMethod,
  handleGetMallSettings,
  handleUpdateMallSettings
} from './mall-api.js';
import { handleGetXunhuPayOrders } from './xunhupay-api.js';
import { handleClassifyChannelsAI } from './ai-classify.js';
import { manualSyncAll } from './scheduler.js';
import { getBlacklistedIPs, unbanIP, getIPAccessStats, banIP } from '../security/ip-blacklist.js';
import { getBannedCodesFromCache, removeBannedCodeFromCache, syncBannedCodesToCache } from '../security/code-ban-cache.js';
import { cacheChannelsToKV, clearChannelCache, getCacheStatus } from '../utils/channel-cache.js';
import { getAllTokens, generateTokenAndAddresses, invalidateToken, extendToken } from '../utils/token-manager.js';

export async function handleAdminRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const action = pathParts[2] || ''; // ， /admin/init

  // （）
  const adminKey = request.headers.get('X-Admin-Key');
  if (adminKey !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 
  await initDB(env);

  try {
    switch (action) {
      case 'init':
        // 
        await createTables(env);
        return new Response(JSON.stringify({ success: true, message: 'Database tables initialized' }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'migrate':
        // 
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
        // 
        if (request.method === 'GET') {
          // 
          const sources = await getDB().prepare('SELECT * FROM sources ORDER BY id').all();
          return new Response(JSON.stringify(sources), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          // 
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
          // 
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
          // /
          const sourceId = pathParts[4];
          if (!sourceId) {
            return new Response('Missing source ID', { status: 400 });
          }

          const data = await request.json();
          const isActive = data.is_active !== undefined ? (data.is_active ? 1 : 0) : null;
          
          if (isActive === null) {
            // ，
            const source = await getDB().prepare('SELECT is_active FROM sources WHERE id = ?').bind(sourceId).first();
            if (!source) {
              return new Response('Source not found', { status: 404 });
            }
            const newStatus = source.is_active ? 0 : 1;
            await getDB().prepare('UPDATE sources SET is_active = ? WHERE id = ?').bind(newStatus, sourceId).run();
            
            return new Response(JSON.stringify({ 
              success: true, 
              is_active: newStatus === 1,
              message: newStatus === 1 ? '' : ''
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // 
            await getDB().prepare('UPDATE sources SET is_active = ? WHERE id = ?').bind(isActive, sourceId).run();
            
            return new Response(JSON.stringify({ 
              success: true, 
              is_active: isActive === 1,
              message: isActive === 1 ? '' : ''
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (request.method === 'DELETE') {
          // 
          const sourceId = pathParts[3];
          if (!sourceId) {
            return new Response('Missing source ID', { status: 400 });
          }

          const db = getDB();

          // 
          const countResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(sourceId).first();
          const channelCount = countResult?.count || 0;

          // ，
          const stmts = [
            db.prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId),
            db.prepare('DELETE FROM sources WHERE id = ?').bind(sourceId)
          ];
          await db.batch(stmts);

          return new Response(JSON.stringify({
            success: true,
            message: ` ${channelCount} `
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'sync':
        // 
        const syncSubAction = pathParts[3];

        // 
        if (syncSubAction === 'filter' && request.method === 'GET') {
          const config = await getSyncFilterConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 
        if (syncSubAction === 'filter' && request.method === 'POST') {
          const data = await request.json();

          // 
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
            message: '',
            config: validConfig
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 
        if (syncSubAction === 'status' && request.method === 'GET') {
          const syncLock = await env.KV.get('lock:sync');
          const syncResult = await env.KV.get('sync:last_result', { type: 'json' });

          return new Response(JSON.stringify({
            success: true,
            sync_in_progress: syncLock === '1',
            last_result: syncResult || null,
            timestamp: new Date().toISOString()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 
        if (syncSubAction === 'all' && request.method === 'POST') {
          const data = await request.json();
          const asyncMode = data.async === true;
          
          console.log('[Admin] Sync all requested, async:', asyncMode);
          
          if (asyncMode) {
            // ：，
            ctx.waitUntil((async () => {
              try {
                const result = await manualSyncAll(env, data.filter || data);
                console.log('[Admin] Async sync completed:', result);
              } catch (e) {
                console.error('[Admin] Async sync failed:', e);
              }
            })());
            
            return new Response(JSON.stringify({
              success: true,
              message: ''
            }), {
              status: 202,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // ：
            const result = await manualSyncAll(env, data.filter || data);
            return new Response(JSON.stringify(result), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        // 
        const sourceId = syncSubAction;
        if (!sourceId) {
          return new Response('Missing source ID', { status: 400 });
        }

        const db = getDB();

        // （）
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(sourceId).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId).run();

        // 
        const source = await db.prepare('SELECT url FROM sources WHERE id = ?').bind(sourceId).first();
        if (!source) {
          return new Response('Source not found', { status: 404 });
        }

        // （）
        let filter = null;
        if (request.method === 'POST') {
          try {
            filter = await request.json();
            console.log('[Admin] Sync source with filter:', filter);
          } catch (e) {
            console.error('Failed to parse filter:', e);
          }
        }

        // filter，
        if (!filter) {
          filter = {};
        }

        //  typeMappingConfig
        try {
          const typeMappingConfig = await getTypeMappingConfig();
          filter.typeMappingConfig = typeMappingConfig;
          console.log('[Admin] Loaded typeMappingConfig:', typeMappingConfig);
        } catch (e) {
          console.error('[Admin] Failed to load typeMappingConfig:', e);
        }

        // （ JavaScript ）
        const now = new Date().toISOString();
        await db.prepare(`UPDATE sources SET last_updated = ? WHERE id = ?`).bind(now, sourceId).run();

        // M3U
        const result = await fetchAndParseM3U(source.url, sourceId, filter);

        // 
        result.deletedChannels = oldChannelCount;

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'codes':
        // 
        if (request.method === 'POST' && url.searchParams.get('action') === 'batch_delete') {
          // 
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
          // CSV
          if (url.searchParams.get('action') === 'export') {
            const codes = await getCodesForExport(url.searchParams);
            
            // CSV
            let csv = ',,(),IP,,,\n';
            codes.forEach(code => {
              const statusMap = { 'unused': '', 'active': '', 'disabled': '' };
              const status = statusMap[code.status] || code.status;
              const activatedAt = code.activated_at ? formatDateTime(code.activated_at) : '-';
              const expiredAt = code.expired_at ? formatDateTime(code.expired_at) : '-';
              const remark = code.remark || '-';
              // CSV
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
          // code，
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

          // （）
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

          // 
          const totalResult = await getDB().prepare(countQuery + (whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : '')).bind(...params).first();
          const total = totalResult.total;

          // 
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
          // 
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

          // 
          let expiredAt = new Date();
          //  duration_days  -1 
          if (code.duration_days === -1) {
            expiredAt = null; // 
          } else {
            expiredAt.setTime(expiredAt.getTime() + code.duration_days * 24 * 60 * 60 * 1000);
          }

          // 
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
          // 
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
                    updateParams.push(null); // 
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
                  expiredAtISO = null; // 
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
          // 
          const data = await request.json();
          const codes = [];
          const db = getDB();

          // 
          for (let i = 0; i < data.count; i++) {
            let code;
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 100;

            // ，
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

            //  status='unused'  duration_days
            // activated_at  expired_at 
            await db.prepare(`
              INSERT INTO codes (code, status, duration_days, max_ips, remark, topic_id)
              VALUES (?, 'unused', ?, ?, ?, ?)
            `).bind(
              code,
              data.duration_days,
              data.max_ips || 3,
              data.remark || '',
              data.topic_id || null
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
          // 
          const data = await request.json();
          await getDB().prepare(`
            UPDATE codes SET status = ?, remark = ?, topic_id = ?
            WHERE code = ?
          `).bind(
            data.status,
            data.remark || '',
            data.topic_id || null,
            data.code
          ).run();

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE') {
          // 
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

      case 'topics':
        //  API
        const topicAction = url.searchParams.get('action');
        
        if (request.method === 'GET' && !topicAction) {
          // 
          const topics = await getTopics();
          return new Response(JSON.stringify(topics), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && topicAction === 'get') {
          // 
          const id = parseInt(url.searchParams.get('id'));
          if (!id) {
            return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });
          }
          const topic = await getTopic(id);
          if (!topic) {
            return new Response(JSON.stringify({ success: false, error: 'Topic not found' }), { status: 404 });
          }
          return new Response(JSON.stringify(topic), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && topicAction === 'create') {
          // 
          const data = await request.json();
          if (!data.name) {
            return new Response(JSON.stringify({ success: false, error: 'Missing name' }), { status: 400 });
          }
          const topic = await createTopic(data);
          return new Response(JSON.stringify({ success: true, topic }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && topicAction === 'update') {
          // 
          const data = await request.json();
          if (!data.id) {
            return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });
          }
          const topic = await updateTopic(data.id, data);
          if (!topic) {
            return new Response(JSON.stringify({ success: false, error: 'Topic not found' }), { status: 404 });
          }
          return new Response(JSON.stringify({ success: true, topic }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && topicAction === 'delete') {
          // 
          const id = parseInt(url.searchParams.get('id'));
          if (!id) {
            return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });
          }
          const result = await deleteTopic(id);
          return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'channels':
        // （）
        const action = url.searchParams.get('action');
        const sourceIdFilter = url.searchParams.get('source_id');
        const groupTitleFilter = url.searchParams.get('group_title');
        const typeFilter = url.searchParams.get('type');
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('page_size')) || 100;
        const search = url.searchParams.get('search') || '';

        // 
        if (action === 'get_groups') {
          const db = getDB();
          let query = 'SELECT DISTINCT c.group_title FROM channels c';
          const params = [];
          const conditions = [];

          // ：
          conditions.push('c.group_title IS NOT NULL');
          conditions.push('c.group_title != ""');

          // source_id，JOIN
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
          // 
          const db = getDB();

          // 
          const countResult = await db.prepare('SELECT COUNT(*) as count FROM channels').first();
          const channelCount = countResult?.count || 0;

          // 
          await db.prepare('DELETE FROM channels').run();

          return new Response(JSON.stringify({
            success: true,
            message: ` ${channelCount} `
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        let channelsQuery = 'SELECT c.id, c.source_id, c.channel_name, c.group_title, c.type, c.description, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active, c.original, s.name as source_name, s.is_active as source_active FROM channels c LEFT JOIN sources s ON c.source_id = s.id';
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

        if (typeFilter) {
          whereConditions.push("(c.type LIKE ? OR c.type LIKE ? OR c.type LIKE ? OR c.type = ?)");
          const typePattern = '%' + typeFilter + '%';
          const typePatternStart = typeFilter + ',%';
          const typePatternEnd = '%,' + typeFilter + ',%';
          params.push(typePattern, typePatternStart, typePatternEnd, typeFilter);
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

        // 
        const totalResult = await getDB().prepare(countQuery + (whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : '')).bind(...params).first();
        const total = totalResult.total;

        // 
        const offset = (page - 1) * pageSize;
        channelsQuery += ' ORDER BY c.group_title, c.channel_name LIMIT ? OFFSET ?';
        const channels = await getDB().prepare(channelsQuery).bind(...params, pageSize, offset).all();

        // ，
        const formattedResults = channels.results.map(channel => ({
          id: channel.id,
          source_id: channel.source_id,
          channel_name: channel.channel_name,
          group_title: channel.group_title,
          type: channel.type || '',
          logo: channel.logo,
          play_url: channel.play_url,
          headers: channel.headers,
          channel_hash: channel.channel_hash,
          is_active: channel.is_active,
          source_name: channel.source_name,
          description: channel.description || ''
        }));

        // （ ->  -> ）
        if (formattedResults.length > 0) {
          formattedResults.sort((a, b) => {
            const groupA = a.group_title || '';
            const groupB = b.group_title || '';
            // 
            if (groupA !== groupB) {
              return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
            }

            // ： ->  -> （）
            const nameA = a.channel_name || '';
            const nameB = b.channel_name || '';

            // CCTV
            const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
            const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);

            // CCTV（+），
            if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
              const numA = parseInt(cctvMatchA[2]);
              const numB = parseInt(cctvMatchB[2]);
              if (numA !== numB) {
                return numA - numB;
              }
              // ，（）
              const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
              const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);

              // ，
              const hasSuffixA = suffixA.trim().length > 0;
              const hasSuffixB = suffixB.trim().length > 0;
              if (hasSuffixA !== hasSuffixB) {
                return hasSuffixA ? 1 : -1;
              }

              // ，
              return suffixA.localeCompare(suffixB, 'zh-CN', { numeric: true });
            }

            // ：
            for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
              const charA = nameA.charCodeAt(i);
              const charB = nameB.charCodeAt(i);

              //  (A-Z, a-z: 65-90, 97-122)
              const isAlphaA = (charA >= 65 && charA <= 90) || (charA >= 97 && charA <= 122);
              const isAlphaB = (charB >= 65 && charB <= 90) || (charB >= 97 && charB <= 122);

              //  (0-9: 48-57)
              const isDigitA = charA >= 48 && charA <= 57;
              const isDigitB = charB >= 48 && charB <= 57;

              //  (\u4e00-\u9fa5: 19968-40869)
              const isChineseA = charA >= 19968 && charA <= 40869;
              const isChineseB = charB >= 19968 && charB <= 40869;

              // ：=1, =2, =3
              const typeA = isAlphaA ? 1 : (isDigitA ? 2 : (isChineseA ? 3 : 4));
              const typeB = isAlphaB ? 1 : (isDigitB ? 2 : (isChineseB ? 3 : 4));

              // ，
              if (typeA !== typeB) {
                return typeA - typeB;
              }

              // ，
              if (charA !== charB) {
                return charA - charB;
              }
            }

            // ，
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

      case 'channel':
        // 
        const channelId = pathParts[3];
        if (channelId && request.method === 'PUT') {
          const data = await request.json();
          const db = getDB();

          // 
          const updateFields = [];
          const updateParams = [];

          if (data.channel_name !== undefined) {
            updateFields.push('channel_name = ?');
            updateParams.push(data.channel_name);
          }
          if (data.group_title !== undefined) {
            updateFields.push('group_title = ?');
            updateParams.push(data.group_title);
          }
          if (data.type !== undefined) {
            updateFields.push('type = ?');
            updateParams.push(data.type || '');
          }
          if (data.logo !== undefined) {
            updateFields.push('logo = ?');
            updateParams.push(data.logo || '');
          }
          if (data.play_url !== undefined) {
            updateFields.push('play_url = ?');
            updateParams.push(data.play_url);
          }
          if (data.headers !== undefined) {
            updateFields.push('headers = ?');
            updateParams.push(typeof data.headers === 'string' ? data.headers : JSON.stringify(data.headers || {}));
          }
          if (data.is_active !== undefined) {
            updateFields.push('is_active = ?');
            updateParams.push(data.is_active ? 1 : 0);
          }
          if (data.description !== undefined) {
            updateFields.push('description = ?');
            updateParams.push(data.description || '');
          }

          if (updateFields.length === 0) {
            return new Response(JSON.stringify({ success: false, error: 'No fields to update' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          updateParams.push(channelId);

          await db.prepare(`UPDATE channels SET ${updateFields.join(', ')} WHERE id = ?`).bind(...updateParams).run();

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'channels-batch-type':
        // 
        if (request.method === 'PUT') {
          const data = await request.json();
          const { ids, type } = data;

          if (!Array.isArray(ids) || ids.length === 0) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid ids array' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const db = getDB();
          let updated = 0;

          for (const id of ids) {
            if (!id) continue;
            const result = await db.prepare('UPDATE channels SET type = ? WHERE id = ?').bind(type || '', id).run();
            if (result.meta.changes > 0) {
              updated++;
            }
          }

          return new Response(JSON.stringify({
            success: true,
            updated,
            message: `Updated ${updated} channels`
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'type-config':
        // 
        if (request.method === 'GET') {
          const config = await getTypeMappingConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT') {
          const data = await request.json();

          // （ [{channel_name, type}, ...]）
          if (!Array.isArray(data)) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid config format: expected array' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          await updateTypeMappingConfig(data);

          return new Response(JSON.stringify({
            success: true,
            message: 'Type mapping config updated',
            config: data
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'ip-blacklist-config':
        // IP
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

          // 
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
            message: 'IP',
            config: validConfig
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'homepage-display':
        // 
        if (request.method === 'GET') {
          const config = await getHomepageDisplayConfig();

          // 
          const sources = await getDB().prepare('SELECT id, name, url FROM sources WHERE is_active = 1 ORDER BY id').all();
          const sourceList = sources.results || [];

          // 
          const groups = await getDB().prepare(`
            SELECT DISTINCT group_title
            FROM channels
            WHERE is_active = 1
            ORDER BY group_title
          `).all();
          const groupList = (groups.results || [])
            .map(g => g.group_title)
            .filter(g => g);

          // host（play_url）
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
              // URL
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

          // 
          const validConfig = {
            sources: Array.isArray(data.sources) ? data.sources : [],
            groups: Array.isArray(data.groups) ? data.groups : [],
            hosts: Array.isArray(data.hosts) ? data.hosts : [],
            hasHeaders: data.hasHeaders !== undefined ? data.hasHeaders : null
          };
          console.log('[admin/homepage-display] ，hasHeaders:', validConfig.hasHeaders);

          await updateHomepageDisplayConfig(validConfig);

          return new Response(JSON.stringify({
            success: true,
            message: '',
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
        // 
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
          if (data.enable_ip_play !== undefined) {
            config.enable_ip_play = data.enable_ip_play;
          }
          if (data.member_ad_free_enabled !== undefined) {
            config.member_ad_free_enabled = data.member_ad_free_enabled;
          }

          await updateSystemConfig(config);

          return new Response(JSON.stringify({
            success: true,
            message: '',
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'security':
        // 
        const securitySubAction = pathParts[3];

        if (request.method === 'GET' && securitySubAction === 'banned-codes') {
          //  - KV
          let codes = [];
          const cacheResult = await getBannedCodesFromCache(env, 100, 0);
          codes = cacheResult.data;

          // KV，
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
          // 
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
          // 
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
            message: '',
            config
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && securitySubAction === 'quota') {
          // 
          const code = url.searchParams.get('code');
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          const today = new Date().toISOString().split('T')[0];
          // 
          const quotaRecords = [];

          // KV，
          // 
          const quotaKey = `code_quota:${today}:${code}`;
          const quotaData = await env.KV.get(quotaKey, { type: "json" }) || {
            totalPlays: 0,
            channelPlays: {},
            bannedChannels: [],
            exceededChannels: []
          };

          // 
          const channelHashes = Object.keys(quotaData.channelPlays || {});
          const channelNames = {};
          if (channelHashes.length > 0) {
            // 
            const channels = await getDB().prepare(
              'SELECT channel_hash, channel_name FROM channels WHERE channel_hash IN (' + channelHashes.map(() => '?').join(',') + ')'
            ).bind(...channelHashes).all();

            if (channels.results) {
              channels.results.forEach(channel => {
                channelNames[channel.channel_hash] = channel.channel_name;
              });
            }
          }

          // 
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
          // 
          const data = await request.json();
          const code = data.code;
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          const codeInfo = await getDB().prepare("SELECT status, remark FROM codes WHERE code = ?").bind(code).first();
          if (!codeInfo) {
            return new Response('Code not found', { status: 404 });
          }

          // 
          const newRemark = codeInfo.remark
            ? codeInfo.remark.replace(/：[^\n]*/g, '').trim()
            : '';

          await getDB().prepare("UPDATE codes SET status = 'active', remark = ?, banned_until = NULL WHERE code = ?")
            .bind(newRemark, code)
            .run();

          // KV
          await removeBannedCodeFromCache(env, code);

          // 
          const today = new Date().toISOString().split('T')[0];
          await env.KV.delete(`code_quota:${today}:${code}`);

          return new Response(JSON.stringify({
            success: true,
            message: ''
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'GET' && securitySubAction === 'stats') {
          // 
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
          // 
          const code = url.searchParams.get('code');
          if (!code) {
            return new Response('Missing code parameter', { status: 400 });
          }

          // 
          const keysToDelete = [
            `access:${code}:*`,
            `limit:play:*:${code}`,
            `abuse:${code}`,
            `abuse_flag:${code}`,
            `suspicious:${code}`
          ];

          // KV，
          const today = new Date().toISOString().split('T')[0];
          await env.KV.delete(`access:${code}:${today}`);
          await env.KV.delete(`abuse:${code}`);
          await env.KV.delete(`abuse_flag:${code}`);
          await env.KV.delete(`suspicious:${code}`);

          // （，）
          // KV list API

          return new Response(JSON.stringify({
            success: true,
            message: ''
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

      case 'ip-blacklist':
        // IP
        const blacklistSubAction = pathParts[3];

        if (request.method === 'GET' && !blacklistSubAction) {
          // IP（100）
          const result = await getBlacklistedIPs(env, 100, 0);
          return new Response(JSON.stringify({
            success: true,
            count: result.total,
            ips: result.data
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && blacklistSubAction === 'remove') {
          // IP
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
          // IP
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
          // IP
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
        // 
        const cacheSubAction = pathParts[3];

        // 
        if (cacheSubAction === 'status' && request.method === 'GET') {
          const status = await getCacheStatus(env);
          return new Response(JSON.stringify({
            success: true,
            ...status
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 
        if (cacheSubAction === 'refresh' && request.method === 'POST') {
          const result = await cacheChannelsToKV(env);
          return new Response(JSON.stringify({
            success: result.success,
            message: result.success ? `：${result.channels} ，${result.groups} ` : '',
            channels: result.channels,
            groups: result.groups,
            version: result.version,
            error: result.error
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 
        if (cacheSubAction === 'clear' && request.method === 'POST') {
          console.log('[Admin] Clearing cache and regenerating...');
          
          // 
          const cleared = await clearChannelCache(env);
          
          if (cleared) {
            // 
            const result = await cacheChannelsToKV(env);
            
            return new Response(JSON.stringify({
              success: true,
              message: '',
              channels: result.channels || 0,
              groups: result.groups || 0,
              version: result.version
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            return new Response(JSON.stringify({
              success: false,
              message: ''
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        return new Response('Invalid cache action', { status: 400 });

      case 'mall':
        // 
        const mallSubAction = pathParts[3];

        if (!mallSubAction) {
          return new Response('Invalid mall action', { status: 400 });
        }

        if (mallSubAction === 'settings') {
          const db = getDB();
          if (request.method === 'GET') {
            // 
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
            // 
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
              message: ''
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (mallSubAction === 'plans') {
          // 
          const db = getDB();
          const planId = pathParts[4];
          const isToggleAction = pathParts[5] === 'toggle';

          if (request.method === 'GET') {
            // 
            const plans = await db.prepare('SELECT * FROM subscription_plans ORDER BY sort_order, id').all();
            return new Response(JSON.stringify({
              success: true,
              plans: plans.results || []
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'POST') {
            // 
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
              message: ''
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'PUT') {
            if (isToggleAction) {
              // 
              const data = await request.json();
              const now = new Date().toISOString();

              await db.prepare(`
                UPDATE subscription_plans SET is_enabled = ?, updated_at = ? WHERE id = ?
              `).bind(data.is_enabled, now, planId).run();

              return new Response(JSON.stringify({
                success: true,
                message: ''
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            } else {
              // 
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
                message: ''
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } else if (request.method === 'DELETE' && planId) {
            // 
            await db.prepare('DELETE FROM subscription_plans WHERE id = ?').bind(planId).run();

            return new Response(JSON.stringify({
              success: true,
              message: ''
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (mallSubAction === 'payment-methods') {
          // 
          if (request.method === 'GET') {
            return await handleGetPaymentMethods(request, env);
          } else if (request.method === 'POST') {
            return await handleCreatePaymentMethod(request, env);
          } else if (request.method === 'PUT') {
            // （ pathParts[4] ）（ pathParts[4] ）
            if (pathParts[4]) {
              // : /admin/mall/payment-methods/{id}
              const id = parseInt(pathParts[4]);
              return await handleTogglePaymentMethod(request, env, ctx, id);
            } else {
              // : /admin/mall/payment-methods
              return await handleUpdatePaymentMethod(request, env);
            }
          } else if (request.method === 'DELETE' && pathParts[4]) {
            // （URLid）
            const id = pathParts[4];
            const newUrl = new URL(request.url);
            newUrl.searchParams.set('id', id);
            const newRequest = new Request(newUrl.toString(), {
              method: request.method,
              headers: request.headers
            });
            return await handleDeletePaymentMethod(newRequest, env);
          }
        } else if (mallSubAction === 'discount-codes') {
          // 优惠码管理
          const db = getDB();
          const codeId = pathParts[4];

          if (request.method === 'GET') {
            // 列表（分页）
            const page = parseInt(url.searchParams.get('page')) || 1;
            const pageSize = Math.min(parseInt(url.searchParams.get('page_size')) || 20, 100);
            const statusFilter = url.searchParams.get('status') || '';

            let sql = 'SELECT * FROM discount_codes';
            const params = [];
            const whereClauses = [];

            if (statusFilter) {
              whereClauses.push('status = ?');
              params.push(statusFilter);
            }

            if (whereClauses.length > 0) {
              sql += ' WHERE ' + whereClauses.join(' AND ');
            }

            sql += ' ORDER BY id DESC';

            const countSql = 'SELECT COUNT(*) as total FROM discount_codes' + (whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '');
            const countResult = await db.prepare(countSql).bind(...params).first();
            const total = countResult?.total || 0;

            const offset = (page - 1) * pageSize;
            sql += ' LIMIT ? OFFSET ?';
            params.push(pageSize, offset);

            const codes = await db.prepare(sql).bind(...params).all();

            return new Response(JSON.stringify({
              success: true,
              data: codes.results || [],
              pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'POST') {
            // 批量生成
            const data = await request.json();
            const { count, type, value, usage_limit, min_amount, expires_at, remark } = data;

            if (!count || count < 1 || count > 100) {
              return new Response(JSON.stringify({ success: false, error: '数量必须在1-100之间' }), { status: 400 });
            }

            const createdCodes = [];
            for (let i = 0; i < count; i++) {
              const code = generateDiscountCode();
              await db.prepare(`
                INSERT INTO discount_codes (code, type, value, usage_limit, min_amount, expires_at, remark, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
              `).bind(code, type, value, usage_limit || 0, min_amount || 0, expires_at || null, remark || '').run();
              createdCodes.push(code);
            }

            return new Response(JSON.stringify({ success: true, codes: createdCodes, count: createdCodes.length }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'PUT' && codeId) {
            // 更新状态
            const data = await request.json();
            const now = new Date().toISOString();

            if (data.status) {
              await db.prepare('UPDATE discount_codes SET status = ?, updated_at = ? WHERE id = ?').bind(data.status, now, codeId).run();
            }
            if (data.remark !== undefined) {
              await db.prepare('UPDATE discount_codes SET remark = ? WHERE id = ?').bind(data.remark, codeId).run();
            }

            return new Response(JSON.stringify({ success: true }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (request.method === 'DELETE' && codeId) {
            // 删除
            await db.prepare('DELETE FROM discount_codes WHERE id = ?').bind(codeId).run();
            return new Response(JSON.stringify({ success: true }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        break;

      case 'ad-ts':
        // TS
        const adTsSubAction = pathParts[3];

        if (request.method === 'GET' && !adTsSubAction) {
          // TS
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
          // TS  URL
          const formData = await request.formData();
          const file = formData.get('file');
          const name = formData.get('name');
          const adType = formData.get('ad_type') || 'normal';
          const description = formData.get('description') || '';
          const isActive = formData.get('is_active') === 'true';
          const remoteUrl = formData.get('remote_url') || '';

          const db = getDB();
          const now = new Date().toISOString();

          // URL，
          if (remoteUrl) {
            // URL
            try {
              new URL(remoteUrl);
            } catch (e) {
              return new Response(JSON.stringify({
                success: false,
                error: 'URL'
              }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }

            // URL
            await db.prepare(`
              INSERT INTO ad_ts_files (name, content, ad_type, description, is_active, remote_url, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              name || '',
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
              message: 'URL'
            }), { headers: { 'Content-Type': 'application/json' } });
          }

          // URL，
          if (!file) {
            return new Response(JSON.stringify({ success: false, error: 'TSURL' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Base64
          const arrayBuffer = await file.arrayBuffer();
          let binary = '';
          const bytes = new Uint8Array(arrayBuffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          //  Base64  (D1  1MB)
          // Base64  4/3， 800KB 
          if (base64.length > 800 * 1024) {
            return new Response(JSON.stringify({
              success: false,
              error: ` (${(file.size / 1024).toFixed(2)}KB)， ${(base64.length / 1024).toFixed(2)}KB > 800KB。TS`
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
            message: 'TS'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && adTsSubAction === 'delete') {
          // TS
          const id = url.searchParams.get('id');
          if (!id) {
            return new Response('Missing id parameter', { status: 400 });
          }

          const db = getDB();
          await db.prepare('DELETE FROM ad_ts_files WHERE id = ?').bind(id).run();

          return new Response(JSON.stringify({
            success: true,
            message: 'TS'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && adTsSubAction === 'update') {
          // TS（/）
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
            message: 'TS'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && adTsSubAction === 'disable') {
          // TS
          const id = url.searchParams.get('id');
        }
        break;

      case 'ad-bindings':
        // 
        const adBindingsSubAction = pathParts[3];

        if (request.method === 'GET' && !adBindingsSubAction) {
          // 
          const db = getDB();
          const bindings = await db.prepare(`
            SELECT ab.*, ats.name as ad_name
            FROM ad_bindings ab
            LEFT JOIN ad_ts_files ats ON ab.ad_id = ats.id
            ORDER BY ab.action_type, ab.priority DESC
          `).all();

          const actionTypeLabels = {
            'vip_expired': 'VIP',
            'vip_limit_exceeded': 'VIP',
            'free_normal': 'VIP',
            'free_expired': 'VIP',
            'free_limit_exceeded': 'VIP',
            'channel_not_found': ''
          };

          const formattedBindings = (bindings.results || []).map(b => ({
            ...b,
            action_type_label: actionTypeLabels[b.action_type] || b.action_type,
            cooldown_display: b.cooldown_seconds > 0 ? `${b.cooldown_seconds}` : ''
          }));

          return new Response(JSON.stringify({
            success: true,
            count: formattedBindings.length,
            bindings: formattedBindings
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && adBindingsSubAction === 'create') {
          // 
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
            message: '',
            id: result.meta.last_row_id
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'PUT' && adBindingsSubAction === 'update') {
          // 
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
            message: ''
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE' && adBindingsSubAction === 'delete') {
          // 
          const id = url.searchParams.get('id');
          if (!id) {
            return new Response('Missing id parameter', { status: 400 });
          }

          const db = getDB();
          await db.prepare('DELETE FROM ad_bindings WHERE id = ?').bind(id).run();

          return new Response(JSON.stringify({
            success: true,
            message: ''
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'users':
        // 
        if (request.method === 'GET') {
          // 
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
          // 
          const body = await request.json();
          const { id, is_verified } = body;

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: 'ID' }), {
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
            message: ''
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'DELETE') {
          // 
          const id = url.searchParams.get('id');

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: 'ID' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          await getDB().prepare('DELETE FROM users WHERE id = ?').bind(id).run();

          return new Response(JSON.stringify({
            success: true,
            message: ''
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'orders':
        // 
        const ordersSubAction = pathParts[3];

        if (!ordersSubAction && request.method === 'GET') {
          //  user_orders 
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
          // 
          return await handleGetXunhuPayOrders(request, env, ctx);
        }
        break;

      case 'payment-methods':
        // 
        if (request.method === 'GET') {
          return await handleGetPaymentMethods(request, env, ctx);
        } else if (request.method === 'POST') {
          return await handleUpdatePaymentMethod(request, env, ctx);
        }
        break;

      case 'domain-blacklist':
        // 
        if (request.method === 'GET') {
          // 
          const domains = await getDomainBlacklist();
          return new Response(JSON.stringify({
            success: true,
            domains
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST') {
          // 
          const data = await request.json();

          if (data.domains && Array.isArray(data.domains)) {
            // 
            const results = await addMultipleDomainsToBlacklist(data.domains);
            return new Response(JSON.stringify({
              success: true,
              results
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          } else if (data.domain) {
            // 
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
                error: e.message.includes('UNIQUE constraint') ? '' : e.message
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } else {
            return new Response(JSON.stringify({
              success: false,
              error: ''
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (request.method === 'DELETE') {
          // 
          const domainId = pathParts[3];
          if (!domainId) {
            return new Response('Missing domain ID', { status: 400 });
          }

          try {
            const success = await removeDomainFromBlacklist(parseInt(domainId));
            if (success) {
              return new Response(JSON.stringify({
                success: true,
                message: ''
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            } else {
              return new Response(JSON.stringify({
                success: false,
                error: ''
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
        // 
        return await handleAdminTickets(request, env, ctx);

      case 'tokens':
        // Token
        const tokenSubAction = pathParts[3];

        if (request.method === 'GET' && !tokenSubAction) {
          // token
          const tokens = await getAllTokens(env);
          return new Response(JSON.stringify({
            success: true,
            tokens
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (request.method === 'POST' && tokenSubAction === 'refresh') {
          // token
          const ttlHours = parseInt(url.searchParams.get('ttl')) || 72;
          try {
            const token = await generateTokenAndAddresses(env, { ttlHours });
            return new Response(JSON.stringify({
              success: true,
              token
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
        } else if (request.method === 'POST' && pathParts[4] === 'invalidate') {
          // token
          const tokenToInvalidate = pathParts[3];
          try {
            await invalidateToken(tokenToInvalidate, env);
            return new Response(JSON.stringify({ success: true }), {
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
        } else if (request.method === 'POST' && pathParts[4] === 'extend') {
          // token
          const tokenToExtend = pathParts[3];
          const additionalHours = parseInt(url.searchParams.get('hours')) || 72;
          try {
            const success = await extendToken(tokenToExtend, additionalHours, env);
            return new Response(JSON.stringify({ success }), {
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
        }
        break;

      case 'classify-channels-ai':
        // AI 
        return await handleClassifyChannelsAI(request, env, ctx);

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

// 
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 生成优惠码（6位字母数字+短横线格式，如 ABCD-1234）
function generateDiscountCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉易混淆字符 0/O/1/I
  let part1 = '', part2 = '';
  for (let i = 0; i < 4; i++) part1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  return part1 + '-' + part2;
}

// 
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

// 
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

// 
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

// CSV
function escapeCsvField(field) {
  if (!field) return '';
  const str = String(field);
  // 、，
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * TS
 * @param {Request} request - 
 * @param {object} env - 
 * @param {object} ctx - 
 * @returns {Response} 
 */
export async function handleAdTsFile(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const filename = pathParts[pathParts.length - 1]; // ， 123.ts

  // ID
  const adId = filename.replace('.ts', '');
  const adIdNum = parseInt(adId);

  if (isNaN(adIdNum)) {
    return new Response('Invalid ad ID', { status: 400 });
  }

  const db = getDB();

  // TS
  const adFile = await db.prepare('SELECT * FROM ad_ts_files WHERE id = ?').bind(adIdNum).first();

  if (!adFile) {
    console.log('[AdTS] Ad file not found:', adIdNum);
    return new Response('Ad not found', { status: 404 });
  }

  // content，URL
  let content = adFile.content;
  if (!content && adFile.remote_url) {
    try {
      console.log('[AdTS] Fetching remote ad content:', adFile.remote_url);
      const remoteResponse = await fetch(adFile.remote_url);
      if (remoteResponse.ok) {
        const arrayBuffer = await remoteResponse.arrayBuffer();
        // chunked，
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

  // base64
  try {
    const binaryString = atob(adFile.content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('[AdTS] Decoded bytes length:', bytes.length, 'First 10 bytes:', Array.from(bytes.slice(0, 10)));

    // TS（TS 0x47 ）
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
 * 
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
  const ticketId = pathParts[3]; // /admin/tickets/:id  :id
  const subAction = pathParts[4]; // /admin/tickets/:id/:action  action

  try {
    const db = getDB();

    //  GET /admin/tickets
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

    //  GET /admin/tickets/:id
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

      // 
      const order = await db.prepare(`
        SELECT * FROM user_orders WHERE order_id = ?
      `).bind(ticket.order_id).first();

      // 
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

    //  POST /admin/tickets/:id/reply
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

      // 
      await db.prepare(`
        INSERT INTO ticket_replies (ticket_id, user_id, is_admin, content)
        VALUES (?, NULL, 1, ?)
      `).bind(ticketId, content.trim()).run();

      //  processing
      await db.prepare(`
        UPDATE tickets SET status = 'processing', updated_at = datetime('now') WHERE id = ?
      `).bind(ticketId).run();

      // 
      try {
        const { sendEmail } = await import('../utils/email.js');
        const emailHtml = generateUserNotificationHtml('reply', ticket.subject);
        await sendEmail(ticket.user_email, ` - ${ticket.subject}`, emailHtml, env);
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

    //  POST /admin/tickets/:id/resolve
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

      // 
      try {
        const { sendEmail } = await import('../utils/email.js');
        const emailHtml = generateUserNotificationHtml('resolved', ticket.subject);
        await sendEmail(ticket.user_email, ` - ${ticket.subject}`, emailHtml, env);
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

    //  POST /admin/tickets/:id/close
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

      // 
      try {
        const { sendEmail } = await import('../utils/email.js');
        const emailHtml = generateUserNotificationHtml('closed', ticket.subject);
        await sendEmail(ticket.user_email, ` - ${ticket.subject}`, emailHtml, env);
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
 *  HTML (Admin)
 */
function generateUserNotificationHtml(action, ticketSubject) {
  const actionLabels = {
    reply: '',
    resolved: '',
    closed: ''
  };

  const actionMessages = {
    reply: '，。',
    resolved: '。',
    closed: '。'
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
        
      </p>
    </div>
    
    <div style="background-color: #f5f5f7; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        ，。，。
      </p>
    </div>
  </div>
</body>
</html>
  `;
}


