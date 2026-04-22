// AI 批量分类频道处理器
import { getDB } from '../database.js';

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

const BATCH_SIZE = 100; // 每批处理数量（减少 prompt 长度）

/**
 * 构建分类 prompt
 */
function buildClassificationPrompt(channels) {
  const channelList = channels.map((ch, i) => `${i + 1}. ${ch.channel_name}${ch.group_title ? ' [' + ch.group_title + ']' : ''}`).join('\n');
  return `请分类以下IPTV频道（每行一个）：

${channelList}

请以JSON格式返回，格式：{"1": "movie", "2": "animation", ...}（使用数字索引对应上面的频道列表）`;
}

/**
 * 解析 AI 返回结果
 */
function parseAIResponse(response, channels) {
  const result = {};
  try {
    const jsonStr = response.trim();
    const parsed = JSON.parse(jsonStr);
    for (const [key, value] of Object.entries(parsed)) {
      const idx = parseInt(key) - 1;
      if (idx >= 0 && idx < channels.length) {
        let type = value.toLowerCase().trim();
        // 验证类型是否有效
        if (!CHANNEL_TYPES.includes(type)) {
          type = 'unknown';
        }
        result[channels[idx].id] = type;
      }
    }
  } catch (e) {
    console.error('[AI-Classify] Failed to parse AI response:', e);
  }
  return result;
}

/**
 * 批量分类空类型频道
 * @param {object} env - Workers env
 * @param {number} limit - 最大处理数量
 * @returns {Promise<object>} 分类结果
 */
export async function classifyEmptyTypeChannels(env, limit = 5000) {
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
  console.log(`[AI-Classify] Found ${channels.length} channels with empty type`);

  const results = {};
  let classified = 0;

  // 分批处理
  for (let i = 0; i < channels.length; i += BATCH_SIZE) {
    const batch = channels.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(channels.length / BATCH_SIZE);
    
    console.log(`[AI-Classify] Processing batch ${batchNum}/${totalBatches} (${batch.length} channels)`);

    try {
      const prompt = buildClassificationPrompt(batch);
      
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        max_tokens: 512,
      });

      const responseText = aiResponse.response || '';
      const batchResults = parseAIResponse(responseText, batch);
      
      // 合并结果
      for (const [id, type] of Object.entries(batchResults)) {
        results[id] = type;
        classified++;
      }

      console.log(`[AI-Classify] Batch ${batchNum} done, got ${Object.keys(batchResults).length} results`);

    } catch (e) {
      console.error(`[AI-Classify] Batch ${batchNum} failed:`, e);
    }
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
 * 处理手动分类请求（从 admin API）
 */
export async function handleClassifyChannelsAI(request, env) {
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
