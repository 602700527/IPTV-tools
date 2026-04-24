// AI 批量分类频道处理器
import { getDB } from '../database.js';

// MiniMax API 配置
const MINIMAX_API_KEY = 'sk-cp-5ilFcBs4KPZ68IlgyAhRgfqH1z3IAC_4SfxzQlOUjVsvjjzj7MEivmKuRo-A7qiS8SPZeqducUd3CjVclcKBRLwemP6068y7iv6r58Cd7DRctUGvkFcT6pc';
const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2';

// 频道分类标准
const CHANNEL_TYPES = [
  'movie',       // 电影、影院
  'animation',   // 动画、动漫、卡通
  'entertainment', // 综艺、娱乐
  'sports',      // 体育、足球、篮球、赛事
  'news',        // 新闻、资讯
  'kids',        // 少儿、儿童
  'documentary', // 纪录、探索
  'education',   // 教育、课堂
  'drama',       // 戏曲、戏剧、京剧
  'music',       // 音乐、MV
  'fashion',     // 时尚、美妆
  'game',        // 游戏、电竞
  'travel',      // 旅游、地理
  'food',        // 美食
  'finance',     // 财经、股票
  'tech',        // 科技
  'health',      // 健康、医疗
];

// 系统提示词
const SYSTEM_PROMPT = `你是一个专业的IPTV电视频道分类助手。请根据频道名称和分组信息，将其分类到以下最合适的类型中：

类型定义：
- movie: 电影、影院、放映
- animation: 动画、动漫、卡通、少儿动画
- entertainment: 综艺、娱乐、选秀、竞猜
- sports: 体育、足球、篮球、网球、羽毛球、排球、高尔夫、赛车、赛事
- news: 新闻、资讯、时事
- kids: 少儿、儿童、幼儿、宝宝
- documentary: 纪录片、探索、人文、自然
- education: 教育、课堂、讲堂、公开课、大学
- drama: 戏曲、戏剧、京剧、梨园、粤剧、越剧、黄梅戏
- music: 音乐、MV、演唱会、歌剧院、古典音乐
- fashion: 时尚、美妆、购物
- game: 游戏、电竞
- travel: 旅游、地理、风光
- food: 美食、烹饪、食堂
- finance: 财经、股票、金融
- tech: 科技、数码
- health: 健康、医疗

如果无法确定分类，返回 "unknown"。

请以JSON格式返回，格式：{"channel_name": "type"}`;

const BATCH_SIZE = 200; // 每批处理数量

/**
 * 构建分类 prompt
 */
function buildClassificationPrompt(channels) {
  const channelList = channels.map((ch, i) => `${i + 1}. ${ch.channel_name}${ch.group_title ? ' [' + ch.group_title + ']' : ''}`).join('\n');
  return `请分类以下IPTV频道（每行一个）：

${channelList}

重要：JSON中的key必须是列表中的行号（从1开始），即：
- 第1行频道对应 key "1"
- 第2行频道对应 key "2"
- 以此类推

只返回纯JSON，不要markdown代码块，格式：{"1": "movie", "2": "animation", "3": "news", ...}`;
}

/**
 * 解析 AI 返回结果
 */
function parseAIResponse(response, channels) {
  const result = {};
  try {
    let jsonStr = response.trim();

    // 去除 markdown 代码块标记
    jsonStr = jsonStr.replace(/```json\s*/gi, '');
    jsonStr = jsonStr.replace(/```\s*/gi, '');
    jsonStr = jsonStr.trim();

    // 如果 JSON 在大括号内，确保提取完整
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    console.log('[AI-Classify] Parsing JSON:', jsonStr.substring(0, 200), '...');

    const parsed = JSON.parse(jsonStr);
    for (const [key, value] of Object.entries(parsed)) {
      // 期望 key 是 1-based 顺序索引（如 "1", "2", "3"...）
      const idx = parseInt(key) - 1;
      // 严格检查：idx 必须在 [0, channels.length) 范围内
      if (isNaN(idx) || idx < 0 || idx >= channels.length) {
        console.warn(`[AI-Classify] Skipping invalid key "${key}" (expected 1-${channels.length}, got ${key})`);
        continue;
      }
      let type = value.toLowerCase().trim();
      // 验证类型是否有效
      if (!CHANNEL_TYPES.includes(type)) {
        type = 'unknown';
      }
      result[channels[idx].id] = type;
    }
  } catch (e) {
    console.error('[AI-Classify] Failed to parse AI response:', e.message);
    console.error('[AI-Classify] Response was:', response.substring(0, 500));
  }
  return result;
}

/**
 * 调用 MiniMax API (Anthropic 兼容格式)
 */
async function callMiniMaxAPI(prompt) {
  try {
    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        max_tokens: 32768,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ]
      })
    });

    console.log('[MiniMax] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MiniMax] API error:', response.status, errorText);
      throw new Error(`MiniMax API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('[MiniMax] Response data keys:', Object.keys(data || {}));

// MiniMax 返回格式
    let content = '';
    const msg = data.choices?.[0]?.message;

    // 优先取 content
    if (msg?.content) {
      content = msg.content;
    }
    // 如果 content 为空但有 reasoning_content，用它
    else if (msg?.reasoning_content) {
      console.log('[MiniMax] Using reasoning_content instead of content');
      content = msg.reasoning_content;
    }
    // 其他格式
    else if (data.output?.text) {
      content = data.output.text;
    } else if (typeof data === 'string') {
      content = data;
    } else {
      console.warn('[MiniMax] Unknown response format, choices[0]:', JSON.stringify(data.choices?.[0])?.substring(0, 300));
    }

    if (!content) {
      console.warn('[MiniMax] Empty response content');
      return '';
    }

    return content;
  } catch (e) {
    console.error('[MiniMax] Fetch error:', e.message);
    throw e;
  }
}

/**
 * 批量分类空类型频道
 * @param {object} env - Workers env
 * @param {number} limit - 最大处理数量
 * @param {ReadableStreamDefaultController} controller - SSE控制器，用于进度推送
 * @returns {Promise<object>} 分类结果
 */
export async function classifyEmptyTypeChannels(env, limit = 5000, controller = null) {
  const db = getDB();
  
  // 查询 type 为空的频道
  const emptyChannels = await db.prepare(`
    SELECT id, channel_name, group_title, type
    FROM channels
    WHERE type IS NULL OR type = '' OR type = '-'
    LIMIT ?
  `).bind(limit).all();

  if (!emptyChannels.results || emptyChannels.results.length === 0) {
    return { success: true, classified: 0, message: '没有需要分类的空类型频道' };
  }

  const channels = emptyChannels.results;
  const totalChannels = channels.length;
  console.log(`[AI-Classify] Found ${totalChannels} channels with empty type`);

  // 发送初始进度
  if (controller) {
    const initMsg = JSON.stringify({ 
      type: 'start', 
      total: totalChannels,
      message: `开始分类 ${totalChannels} 个频道...`
    });
    controller.enqueue('data: ' + initMsg + '\n\n');
  }

  const results = {};
  let classified = 0;

  // 分批处理
  for (let i = 0; i < channels.length; i += BATCH_SIZE) {
    const batch = channels.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(channels.length / BATCH_SIZE);
    const processed = Math.min(i + BATCH_SIZE, channels.length);
    
    // 发送进度更新
    if (controller) {
      const progressMsg = JSON.stringify({ 
        type: 'progress',
        batch: batchNum,
        totalBatches,
        processed,
        total: totalChannels,
        message: `处理中... ${processed}/${totalChannels}`
      });
      controller.enqueue('data: ' + progressMsg + '\n\n');
    }

    console.log(`[AI-Classify] Processing batch ${batchNum}/${totalBatches} (${batch.length} channels)`);

    try {
      const prompt = buildClassificationPrompt(batch);

      const responseText = await callMiniMaxAPI(prompt);
      const batchResults = parseAIResponse(responseText, batch);

      // 立即写回数据库（每批完成后）
      try {
        const updateStatements = [];
        const mappingStatements = [];
        for (const [idx, type] of Object.entries(batchResults)) {
          const channelIdx = parseInt(idx) - 1;
          const channel = batch[channelIdx];
          if (!channel) {
            console.warn(`[AI-Classify] Batch ${batchNum}: skipped invalid index ${idx}`);
            continue;
          }
          const channelId = parseInt(idx);
          updateStatements.push(
            db.prepare('UPDATE channels SET type = ? WHERE id = ?').bind(type, channelId)
          );
          mappingStatements.push(
            db.prepare(`
              INSERT OR REPLACE INTO channel_type_mapping (channel_name, type, updated_at)
              VALUES (?, ?, CURRENT_TIMESTAMP)
            `).bind(channel.channel_name, type)
          );
        }
        if (updateStatements.length > 0) {
          await db.batch(updateStatements);
          await db.batch(mappingStatements);
          console.log(`[AI-Classify] Batch ${batchNum} written to DB (${updateStatements.length} channels)`);
        }
      } catch (e) {
        console.error(`[AI-Classify] Batch ${batchNum} DB write failed:`, e.message);
      }

      // 合并结果
      for (const [id, type] of Object.entries(batchResults)) {
        results[id] = type;
        classified++;
      }

      console.log(`[AI-Classify] Batch ${batchNum} done, got ${Object.keys(batchResults).length} results`);

    } catch (e) {
      console.error(`[AI-Classify] Batch ${batchNum} failed:`, e.message);
      // AI 失败时使用关键词备用分类
      console.log(`[AI-Classify] Falling back to keyword classification for batch ${batchNum}`);
      for (const channel of batch) {
        const type = classifyByKeyword(channel.channel_name, channel.group_title);
        results[channel.id] = type;
        classified++;

        // 关键词分类也立即写库
        try {
          await db.prepare('UPDATE channels SET type = ? WHERE id = ?').bind(type, channel.id).run();
          await db.prepare(`
            INSERT OR REPLACE INTO channel_type_mapping (channel_name, type, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `).bind(channel.channel_name, type).run();
        } catch (e2) {
          console.error(`[AI-Classify] Keyword fallback DB write failed for channel ${channel.id}:`, e2.message);
        }
      }
    }
  }

  // 发送完成进度
  if (controller) {
    const doneMsg = JSON.stringify({ 
      type: 'done',
      classified,
      total: totalChannels,
      message: `分类完成！共分类 ${classified} 个频道`
    });
    controller.enqueue('data: ' + doneMsg + '\n\n');
  }

  // 批量更新数据库
  if (Object.keys(results).length > 0) {
    try {
      const updateStatements = Object.entries(results).map(([id, type]) =>
        db.prepare('UPDATE channels SET type = ? WHERE id = ?').bind(type, parseInt(id))
      );
      await db.batch(updateStatements);
      console.log(`[AI-Classify] Updated ${Object.keys(results).length} channels in database`);
    } catch (e) {
      console.error('[AI-Classify] Failed to update database:', e);
    }
  }

  return {
    success: true,
    classified,
    totalEmpty: channels.length,
    results
  };
}

/**
 * 基于关键词的简单分类（备用方案）
 */
function classifyByKeyword(channelName, groupTitle) {
  const text = (channelName + ' ' + (groupTitle || '')).toLowerCase();

  // movie - 电影
  if (/电影|影院|放映|影视/.test(text)) return 'movie';
  // animation - 动画
  if (/动画|动漫|卡通|少儿动画/.test(text)) return 'animation';
  // entertainment - 综艺
  if (/综艺|娱乐|选秀|竞猜|晚会|春晚|节目/.test(text)) return 'entertainment';
  // sports - 体育
  if (/体育|足球|篮球|网球|羽毛球|排球|高尔夫|赛车|赛事|欧冠|世界杯|英超|意甲|德甲|西甲|NBA|CBA|中超/.test(text)) return 'sports';
  // news - 新闻
  if (/新闻|资讯|时事|直播|突发事件/.test(text)) return 'news';
  // kids - 少儿
  if (/少儿|儿童|幼儿|宝宝|动漫|童年/.test(text)) return 'kids';
  // documentary - 纪录片
  if (/纪录|探索|人文|自然|地理|传奇|发现/.test(text)) return 'documentary';
  // education - 教育
  if (/教育|课堂|讲堂|公开课|大学|学校|培训|空中课堂/.test(text)) return 'education';
  // drama - 戏曲
  if (/戏曲|戏剧|京剧|梨园|粤剧|越剧|黄梅戏|秦腔|豫剧|曲艺|相声|小品/.test(text)) return 'drama';
  // music - 音乐
  if (/音乐|歌|演唱会|MV|古典|交响|民乐|摇滚/.test(text)) return 'music';
  // fashion - 时尚
  if (/时尚|美妆|购物|潮流|服装/.test(text)) return 'fashion';
  // game - 游戏
  if (/游戏|电竞|魔兽|英雄联盟|LOL|DOTA/.test(text)) return 'game';
  // travel - 旅游
  if (/旅游|地理|风光|美景|探索|旅行/.test(text)) return 'travel';
  // food - 美食
  if (/美食|烹饪|食堂|健康|养生/.test(text)) return 'food';
  // finance - 财经
  if (/财经|股票|金融|经济|投资|商业/.test(text)) return 'finance';
  // tech - 科技
  if (/科技|数码|手机|电脑|互联网/.test(text)) return 'tech';
  // health - 健康
  if (/健康|医疗|医药|保健|医学/.test(text)) return 'health';

  return 'unknown';
}

/**
 * 处理手动分类请求（从 admin API）
 */
export async function handleClassifyChannelsAI(request, env) {
  // 检查是否支持 SSE（通过 Accept 头判断）
  const acceptHeader = request.headers.get('Accept') || '';
  const wantsSSE = acceptHeader.includes('text/event-stream');

  if (wantsSSE) {
    // SSE 版本：流式返回进度
    const body = await request.json();
    const limit = parseInt(body.limit) || 5000;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await classifyEmptyTypeChannels(env, limit, controller);
          // 最终结果已经通过 controller.enqueue 发送
          controller.close();
        } catch (e) {
          console.error('[AI-Classify] SSE Error:', e);
          const errorMsg = JSON.stringify({ type: 'error', error: e.message });
          controller.enqueue('data: ' + errorMsg + '\n\n');
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } else {
    // 普通版本：一次性返回
    try {
      const body = await request.json();
      const limit = parseInt(body.limit) || 5000;
      
      const result = await classifyEmptyTypeChannels(env, limit);
      
      return new Response(JSON.stringify({
        success: true,
        ...result
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error('[AI-Classify] Error:', e);
      return new Response(JSON.stringify({
        success: false,
        error: e.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}