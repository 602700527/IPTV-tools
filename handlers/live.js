// 播放请求处理器: /live/{code}/{hash}（简化安全版）
import { getDB, getSecurityConfig, getActiveAdTsFile } from '../database.js';
import { getClientIP, checkIPRateLimit } from '../security/ip-blacklist.js';
import { addBannedCodeToCache } from '../security/code-ban-cache.js';
import { incrementPlayCount, getPlayCount, flushCacheToDB, getAuthorizedSubscriptionIPs } from '../utils/cache.js';
import { getChannelByHash } from '../utils/channel-cache.js';

export async function handleLiveRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // 0. IP黑名单检查
    const clientIP = getClientIP(request);
    const ipCheck = await checkIPRateLimit(env, ctx, clientIP, '/live');
    
    if (!ipCheck.allowed) {
      return new Response(ipCheck.message, { status: 403 });
    }

    // 验证URL格式
    if (pathParts.length < 4) {
      return new Response('Invalid request format', { status: 400 });
    }

    const code = pathParts[2]; // 卡密
    const hash = pathParts[3]; // 频道hash

    // 1. 检查缓存 (Cache API) - 只缓存成功的响应
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (response) {
      // 缓存命中，检查是否为403错误（禁用、过期或封禁）
      if (response.status === 403) {
        // 忽略缓存的403响应，重新验证
        response = null;
      } else {
        // 缓存命中且状态正常，直接返回
        return response;
      }
    }

    // 2. 缓存未命中，执行鉴权和获取真实链接

    // 2.1 校验卡密
    const db = getDB();
    const auth = await db.prepare("SELECT status, expired_at, max_ips, banned_until FROM codes WHERE code = ?").bind(code).first();

    const now = new Date().toISOString();
    if (!auth || auth.status !== 'active' || auth.expired_at < now) {
      // 如果卡密已过期，自动设置为禁用状态
      if (auth && auth.expired_at < now && auth.status === 'active') {
        await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();
      }
      // 卡密无效或已过期
      response = new Response("Forbidden: Invalid or Expired Code", { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 检查是否被封禁（临时封禁）
    if (auth.banned_until && auth.banned_until > now) {
      response = new Response(`Forbidden: Code is banned until ${new Date(auth.banned_until).toLocaleString('zh-CN')}`, { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 获取安全配置
    const securityConfig = await getSecurityConfig();

    // 2.2 检查订阅IP限制（播放IP必须在订阅记录的IP列表中）- 使用内存缓存
    const today = new Date().toISOString().split('T')[0];
    const maxIPs = auth.max_ips || 3;

    // 使用内存缓存获取授权的订阅IP列表
    const authorizedIPs = getAuthorizedSubscriptionIPs(code, today, maxIPs);

    console.log(`[Live] Code: ${code}, IP: ${clientIP}, Authorized IPs: ${Array.from(authorizedIPs).join(', ')}, IsAuthorized: ${authorizedIPs.has(clientIP)}`);

    // 检查当前播放IP是否在订阅IP列表中
    // 如果授权IP列表为空（说明是该卡密首次订阅），则允许播放
    if (authorizedIPs.size > 0 && !authorizedIPs.has(clientIP)) {
      // 获取广告TS文件
      const adTsFile = await getActiveAdTsFile();

      if (adTsFile && adTsFile.content) {
        // 返回自定义M3U8，包含广告TS
        const m3u8Content = generateAdM3U8(adTsFile);
        response = new Response(m3u8Content, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.apple.mpegurl',
            'Cache-Control': 'public, max-age=60'
          }
        });
      } else {
        // 没有广告文件，返回403错误
        response = new Response("Forbidden: Your IP is not authorized to play (please re-subscribe)", { status: 403 });
        response.headers.set("Cache-Control", "public, max-age=60");
      }
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 如果授权IP列表为空，说明是该卡密首次订阅，记录日志并允许播放
    if (authorizedIPs.size === 0) {
      console.log(`[Live] Code: ${code}, IP: ${clientIP} - First subscription detected, allowing playback`);
    }

    // 2.3 检查每日播放额度（每个频道）

    // 尝试刷新缓存（10分钟间隔）
    await flushCacheToDB(env, ctx);

    // 从缓存获取今日该频道播放次数
    let todayPlays = getPlayCount(code, hash, today);

    // 如果缓存中没有，从数据库查询（启动时的首次请求）
    if (todayPlays === 0) {
      const dbCount = await db.prepare(`
        SELECT play_count
        FROM play_counts
        WHERE code = ? AND channel_hash = ? AND created_date = ?
      `).bind(code, hash, today).first();

      if (dbCount) {
        // 将数据库中的计数同步到缓存
        playCountCache.set(`${code}:${hash}:${today}`, dbCount.play_count);
        todayPlays = dbCount.play_count;
      }
    }

    if (todayPlays >= securityConfig.channel_daily_limit) {
      // 超过额度，自动封禁卡密
      if (securityConfig.auto_ban_on_exceed) {
        const existingRemark = await db.prepare("SELECT remark FROM codes WHERE code = ?").bind(code).first();

        // 计算封禁到期时间
        const bannedUntil = new Date();
        bannedUntil.setTime(bannedUntil.getTime() + securityConfig.ban_duration_days * 24 * 60 * 60 * 1000);

        const banReason = `系统自动封禁：频道每日播放次数超出${securityConfig.channel_daily_limit}次，封禁${securityConfig.ban_duration_days}天 (${today})`;

        const newRemark = existingRemark?.remark
          ? `${existingRemark.remark}\n${banReason}`
          : banReason;

        await db.prepare("UPDATE codes SET status = 'disabled', remark = ?, banned_until = ? WHERE code = ?")
          .bind(newRemark, bannedUntil.toISOString(), code)
          .run();

        // 添加到封禁卡密KV缓存
        const codeInfo = await db.prepare("SELECT code, status, duration_days, activated_at, expired_at, max_ips, remark, banned_until FROM codes WHERE code = ?").bind(code).first();
        if (codeInfo) {
          await addBannedCodeToCache(env, codeInfo);
        }

        // 记录封禁信息到数据库备注
        console.warn(`Code ${code} auto-banned due to exceeding limit: ${todayPlays} plays for channel ${hash}`);

        console.warn(`Code ${code} auto-banned due to exceeding limit: ${todayPlays} plays for channel ${hash}`);
      }

      response = new Response(`Forbidden: Daily play limit (${securityConfig.channel_daily_limit}) exceeded for this channel`, { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 增加播放计数到缓存
    incrementPlayCount(code, hash, today);

    // 3. 获取频道真实链接（优先从 KV 缓存）
    const channel = await getChannelByHash(env, hash);

    if (!channel || !channel.is_active) {
      response = new Response("Channel Not Found", { status: 404 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 4. 重定向到真实播放地址
    const headers = new Headers({
      "Location": channel.play_url,
      "Cache-Control": "public, max-age=300, s-maxage=300"
    });

    response = new Response(null, { status: 302, headers });

    // 5. 写入缓存
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (error) {
    console.error('Live request error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// 生成广告M3U8内容
function generateAdM3U8(adTsFile) {
  // Base64解码TS内容
  const tsContent = adTsFile.content;

  // 生成M3U8内容
  const m3u8 = `#EXTM3U8
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10.000
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.000,
ad.ts
#EXT-X-ENDLIST`;

  // 返回M3U8和TS的组合内容
  return `${m3u8}\n\n${tsContent}`;
}

