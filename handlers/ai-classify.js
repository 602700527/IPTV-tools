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
  'comprehensive', // 综合（无法确定类型时使用）
];

/**
 * 从 Wikipedia 获取频道的真实描述
 * @param {string} channelName - 频道名称
 * @param {string} groupTitle - 频道分组/地区
 * @returns {Promise<string>} Wikipedia 描述，如果没找到则返回空字符串
 */
async function fetchWikipediaDescription(channelName, groupTitle) {
  try {
    // 构建搜索关键词列表
    const searchTerms = [
      channelName,
      channelName + ' 电视台',
      channelName + ' 电视频道',
      groupTitle ? groupTitle + ' ' + channelName : null,
    ].filter(Boolean);

    // 尝试用 REST API 获取摘要
    for (const term of searchTerms.slice(0, 3)) {
      try {
        // 使用 Wikipedia REST API 的 summary 端点 (v1)
        const apiUrl = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // 检查是否返回了有效的摘要
        if ((data.type === 'standard' || data.type === 'not-found') && data.extract) {
          const description = data.extract;
          // 过滤掉消歧义页面和重定向
          if (description.length > 20 && !description.includes('（重定向）') && !description.includes('可以指')) {
            console.log(`[Wikipedia] Found for "${term}": ${description.substring(0, 80)}...`);
            return description;
          }
        }
      } catch (e) {
        console.log(`[Wikipedia] REST API failed for "${term}": ${e.message}`);
      }
    }

    // 备用：用 OpenSearch API
    for (const term of searchTerms.slice(0, 2)) {
      try {
        const searchUrl = `https://zh.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(term)}&limit=1&format=json&origin=*`;
        const response = await fetch(searchUrl);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const descriptions = data[2];
        
        if (descriptions && descriptions.length > 0 && descriptions[0]) {
          const desc = descriptions[0].trim();
          if (desc.length > 20 && !desc.includes('可以指') && !desc.includes('may refer to')) {
            console.log(`[Wikipedia] OpenSearch found for "${term}": ${desc.substring(0, 80)}...`);
            return desc;
          }
        }
      } catch (e) {
        console.log(`[Wikipedia] OpenSearch failed for "${term}": ${e.message}`);
      }
    }
    
    // 英文 Wikipedia 备用
    try {
      const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(channelName)}`;
      const response = await fetch(enUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.extract && data.extract.length > 20) {
          console.log(`[Wikipedia] EN found for "${channelName}": ${data.extract.substring(0, 80)}...`);
          return data.extract;
        }
      }
    } catch (e) {
      console.log(`[Wikipedia] EN fallback failed for "${channelName}": ${e.message}`);
    }
    
    console.log(`[Wikipedia] No description found for "${channelName}"`);
    return '';
  } catch (e) {
    console.error('[Wikipedia] Error:', e.message);
    return '';
  }
}

/**
 * 批量获取 Wikipedia 描述
 * @param {Array} channels - 频道列表
 * @returns {Promise<Map>} channelId -> description
 */
async function batchFetchWikipediaDescriptions(channels) {
  const descriptionMap = new Map();
  
  // 每批处理 10 个并发请求
  const CONCURRENCY = 10;
  
  for (let i = 0; i < channels.length; i += CONCURRENCY) {
    const batch = channels.slice(i, i + CONCURRENCY);
    const promises = batch.map(ch => 
      fetchWikipediaDescription(ch.channel_name, ch.group_title)
        .then(desc => ({ id: ch.id, description: desc }))
    );
    
    const results = await Promise.all(promises);
    for (const { id, description } of results) {
      if (description) {
        descriptionMap.set(id, description);
      }
    }
    
    // 避免请求过快
    if (i + CONCURRENCY < channels.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  return descriptionMap;
}

// 系统提示词
const SYSTEM_PROMPT = `You are a professional IPTV TV channel classification assistant. Your task is to classify channels AND generate unique, specific descriptions for each channel.

IMPORTANT: Generate DISTINCTIVE descriptions, NOT generic templates. Each channel should have its own unique description based on what you know about it.

Classification Rules:
1. Combine channel name AND group-title (region/location) together
2. Group-title like "央视", "北京", "上海", "广东" indicates the region - combine with channel name
3. If type cannot be determined, use "comprehensive"

Channel Types (use exactly these values):
- movie, animation, entertainment, sports, news, kids, documentary, education, drama, music, fashion, game, travel, food, finance, tech, health, comprehensive

Description Requirements - BE SPECIFIC AND UNIQUE:
- DO NOT use generic templates like "comprehensive channel for all audiences"
- Include SPECIFIC content examples when known (e.g., "covers Premier League, Champions League, La Liga" for sports)
- Include founding background or unique characteristics if known
- Include target region/audience specifically
- Include broadcast platform or unique features
- Minimum 50 characters, maximum 200 characters

Good examples (DISTINCTIVE):
- "Spanish 24-hour news channel known for breaking news coverage, political debates, and in-depth analysis across Spain and Latin America"
- "Premium Chinese movie channel featuring classic Hong Kong films, Hollywood blockbusters, and original Asian cinema with subtitle options"
- "Indian entertainment channel broadcasting Bollywood dramas, dance competitions, celebrity interviews, and regional language programming for diaspora audiences"

Bad examples (TOO GENERIC - DO NOT USE):
- "Comprehensive entertainment channel with diverse programming including news, dramas, variety shows and movies"
- "General entertainment channel for all audiences"

Return JSON format:
{"1": {"type": "sports", "description": "Your unique, specific description here..."}, "2": {"type": "news", "description": "..."}, ...}`;

const BATCH_SIZE = 50; // 每批处理数量

/**
 * 构建分类 prompt
 */
function buildClassificationPrompt(channels) {
  const channelList = channels.map((ch, i) => {
    return `${i + 1}. ${ch.channel_name}${ch.group_title ? ' [region: ' + ch.group_title + ']' : ''}`;
  }).join('\n');
  
  return `Classify IPTV channels. Return ONLY valid JSON.

${channelList}

Return this exact format (notice the outer braces):
{"1": {"type": "news", "description": "Short desc"}, "2": {"type": "movie", "description": "Short desc"}}

Rules:
- type: movie, animation, entertainment, sports, news, kids, documentary, education, drama, music, fashion, game, travel, food, finance, tech, health, comprehensive
- description: max 100 chars, be brief`;
}

/**
 * 尝试解析部分截断的 JSON
 */
function tryParsePartialJson(jsonStr) {
  try {
    // 如果 JSON 看起来像被转义的字符串，先尝试解转义
    let processedStr = jsonStr;
    if (jsonStr.startsWith('"') && jsonStr.endsWith('"')) {
      try {
        processedStr = JSON.parse(jsonStr);
        console.log('[AI-Classify] JSON was escaped string, unescaped to:', processedStr.substring(0, 200));
      } catch (e) {
        // 继续使用原始字符串
      }
    }
    
    // 方法1：尝试直接解析（完整JSON）
    try {
      const parsed = JSON.parse(processedStr);
      const keys = Object.keys(parsed);
      if (keys.length > 0 && keys.every(k => !isNaN(parseInt(k)))) {
        console.log('[AI-Classify] Direct parse succeeded with', keys.length, 'entries');
        return parsed;
      }
    } catch (e) {
      // 继续尝试其他方法
    }
    
    // 方法2：处理 AI 返回的畸形格式 {"1": {...}, {"2": {...}, ...}
    // 需要找到所有 {"N": {...}} 模式并组合成正确的对象
    const malformedPattern = /\{\s*"(\d+)"\s*:\s*\{[\s\S]*?\}(?=\s*,?\s*\{|\s*$)/g;
    const matches = [...processedStr.matchAll(malformedPattern)];
    const result = {};
    let matchCount = 0;
    
    for (const match of matches) {
      try {
        // 提取完整的对象字符串
        let objStr = match[0];
        // 确保对象闭合
        if (!objStr.endsWith('}')) {
          // 找到对应的闭合括号
          const openCount = (objStr.match(/\{/g) || []).length;
          const closeCount = (objStr.match(/\}/g) || []).length;
          if (openCount > closeCount) {
            // 尝试补全
            const neededCloses = openCount - closeCount;
            objStr = objStr + '}'.repeat(neededCloses);
          }
        }
        const obj = JSON.parse(objStr);
        const key = Object.keys(obj)[0];
        result[key] = obj[key];
        matchCount++;
      } catch (e) {
        // 忽略无效匹配
      }
    }
    
    if (matchCount > 0) {
      console.log('[AI-Classify] Extracted', matchCount, 'entries from malformed JSON');
      return result;
    }
    
    // 方法3：逐个提取 {...} 对象
    const simpleRegex = /\{\s*"(\d+)"\s*:\s*\{[^}]*\}[^}]*\}/g;
    const simpleMatches = [...processedStr.matchAll(simpleRegex)];
    for (const match of simpleMatches) {
      try {
        const obj = JSON.parse(match[0]);
        const key = Object.keys(obj)[0];
        result[key] = obj[key];
      } catch (e) {
        // 忽略
      }
    }
    
    if (Object.keys(result).length > 0) {
      console.log('[AI-Classify] Extracted', Object.keys(result).length, 'entries using simple regex');
      return result;
    }
    
    return null;
  } catch (e) {
    console.warn('[AI-Classify] tryParsePartialJson failed:', e.message);
    return null;
  }
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

    // 尝试找到有效的 JSON
    let validJson = null;
    
    // 方法1：直接解析（如果完整的话）
    try {
      validJson = JSON.parse(jsonStr);
    } catch (e1) {
      // 方法2：尝试提取 {...} 部分
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const potentialJson = jsonMatch[0];
        try {
          validJson = JSON.parse(potentialJson);
        } catch (e2) {
          // 方法3：尝试修复截断的 JSON（找到最后一个完整的对象）
          validJson = tryParsePartialJson(jsonStr);
        }
      }
    }

    if (!validJson) {
      console.warn('[AI-Classify] Could not parse AI response as JSON, using keyword fallback');
      return result;
    }

    console.log('[AI-Classify] Parsing JSON with', Object.keys(validJson).length, 'entries');

    for (const [key, value] of Object.entries(validJson)) {
      // 期望 key 是 1-based 顺序索引（如 "1", "2", "3"...）
      const idx = parseInt(key) - 1;
      // 严格检查：idx 必须在 [0, channels.length) 范围内
      if (isNaN(idx) || idx < 0 || idx >= channels.length) {
        console.warn(`[AI-Classify] Skipping invalid key "${key}" (expected 1-${channels.length}, got ${key})`);
        continue;
      }

      // 支持两种格式：{"1": "type"} 或 {"1": {"type": "type", "description": "..."}}
      let type, description;
      if (typeof value === 'object' && value !== null) {
        type = (value.type || 'comprehensive').toLowerCase().trim();
        description = (value.description || '').toString().trim();
      } else {
        type = value.toLowerCase().trim();
        description = '';
      }

      // 验证类型是否有效
      if (!CHANNEL_TYPES.includes(type)) {
        type = 'comprehensive';
      }

      result[channels[idx].id] = { type, description };
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

    // 检查 base_resp 错误（只有非0状态码才是错误）
    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error('[MiniMax] API error:', data.base_resp);
    }

    // 调试：打印 choices 结构
    if (data.choices) {
      console.log('[MiniMax] Choices[0] finish_reason:', data.choices[0]?.finish_reason);
      console.log('[MiniMax] Content length:', data.choices[0]?.message?.content?.length);
      console.log('[MiniMax] Content preview:', data.choices[0]?.message?.content?.substring(0, 300));
    }

    // MiniMax 返回格式
    let content = '';
    const msg = data.choices?.[0]?.message;

    // 优先取 content
    if (msg?.content) {
      content = msg.content;
      // 如果 content 是转义的 JSON 字符串（以 " 开头），先解析它
      if (content.startsWith('"') && content.endsWith('"')) {
        try {
          content = JSON.parse(content);
          console.log('[MiniMax] Content was escaped JSON string, unescaped');
        } catch (e) {
          // 继续使用原始 content
        }
      }
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
      // 直接让 AI 分类并生成描述（不依赖 Wikipedia API）
      const prompt = buildClassificationPrompt(batch);

      const responseText = await callMiniMaxAPI(prompt);
      const batchResults = parseAIResponse(responseText, batch);

      // 立即写回数据库（每批完成后）
      try {
        const updateStatements = [];
        const mappingStatements = [];
        for (const [idStr, item] of Object.entries(batchResults)) {
          const channelId = parseInt(idStr);
          // 直接通过ID查找channel（batchResults的key就是数据库ID）
          const channel = batch.find(ch => ch.id === channelId);
          if (!channel) {
            console.warn(`[AI-Classify] Batch ${batchNum}: channel id ${channelId} not found in batch`);
            continue;
          }
          const { type, description } = item;
          updateStatements.push(
            db.prepare('UPDATE channels SET type = ?, description = ? WHERE id = ?').bind(type, description, channelId)
          );
          mappingStatements.push(
            db.prepare(`
              INSERT OR REPLACE INTO channel_type_mapping (channel_name, group_title, type, description, updated_at)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `).bind(channel.channel_name, channel.group_title || '', type, description)
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
      for (const [id, item] of Object.entries(batchResults)) {
        results[id] = item;
        classified++;
      }

      console.log(`[AI-Classify] Batch ${batchNum} done, got ${Object.keys(batchResults).length} results`);

    } catch (e) {
      console.error(`[AI-Classify] Batch ${batchNum} failed:`, e.message);
      // AI 失败时：使用关键词分类
      console.log(`[AI-Classify] Falling back to keyword classification for batch ${batchNum}`);
      for (const channel of batch) {
        const { type, description } = classifyByKeyword(channel.channel_name, channel.group_title);
        results[channel.id] = { type, description };
        classified++;

        // 关键词分类也立即写库
        try {
          await db.prepare('UPDATE channels SET type = ?, description = ? WHERE id = ?').bind(type, description, channel.id).run();
          await db.prepare(`
            INSERT OR REPLACE INTO channel_type_mapping (channel_name, group_title, type, description, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          `).bind(channel.channel_name, channel.group_title || '', type, description).run();
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
      const updateStatements = Object.entries(results).map(([id, item]) => {
        const { type, description } = item;
        return db.prepare('UPDATE channels SET type = ?, description = ? WHERE id = ?').bind(type, description, parseInt(id));
      });
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
 * 生成较丰富的描述信息
 */
function classifyByKeyword(channelName, groupTitle) {
  const text = (channelName + ' ' + (groupTitle || '')).toLowerCase();
  const region = groupTitle || '';
  const name = channelName || '';

  // movie - 电影
  if (/电影|影院|放映|影视/.test(text)) return {
    type: 'movie',
    description: `Movie channel offering Chinese and international films, theatrical releases, and cinema highlights for movie enthusiasts${region ? ' in ' + region : ''}`
  };

  // animation - 动画
  if (/动画|动漫|卡通|少儿动画/.test(text)) return {
    type: 'animation',
    description: `Animation and anime channel featuring Japanese anime, Chinese cartoons, and international animated content for children and teens${region ? ' in ' + region : ''}`
  };

  // entertainment - 综艺
  if (/综艺|娱乐|选秀|竞猜|晚会|春晚|节目/.test(text)) return {
    type: 'entertainment',
    description: `Entertainment variety show channel with talent competitions, game shows, talk shows, and celebrity performances${region ? ' broadcasting to ' + region + ' audiences' : ''}`
  };

  // sports - 体育
  if (/体育|足球|篮球|网球|羽毛球|排球|高尔夫|赛车|赛事|欧冠|世界杯|英超|意甲|德甲|西甲|NBA|CBA|中超/.test(text)) return {
    type: 'sports',
    description: `Comprehensive sports channel covering football leagues, basketball tournaments, tennis events, motorsports, and major international competitions${region ? ' with focus on ' + region + ' sports coverage' : ''}`
  };

  // news - 新闻
  if (/新闻|资讯|时事|直播|突发事件/.test(text)) return {
    type: 'news',
    description: `24-hour news channel providing current affairs coverage, political analysis, breaking news, and in-depth reporting${region ? ' for audiences in ' + region : ''}`
  };

  // kids - 少儿
  if (/少儿|儿童|幼儿|宝宝|动漫|童年/.test(text)) return {
    type: 'kids',
    description: `Children's programming channel with animated series, educational shows, and entertaining content for toddlers to teenagers${region ? ' in ' + region : ''}`
  };

  // documentary - 纪录片
  if (/纪录|探索|人文|自然|地理|传奇|发现/.test(text)) return {
    type: 'documentary',
    description: `Documentary channel exploring history, nature, science, culture, and society with in-depth investigative programming${region ? ' with ' + region + ' regional content' : ''}`
  };

  // education - 教育
  if (/教育|课堂|讲堂|公开课|大学|学校|培训|空中课堂/.test(text)) return {
    type: 'education',
    description: `Educational channel offering lectures, online courses, academic content, and professional training programs${region ? ' from ' + region + ' institutions' : ''}`
  };

  // drama - 戏曲
  if (/戏曲|戏剧|京剧|梨园|粤剧|越剧|黄梅戏|秦腔|豫剧|曲艺|相声|小品/.test(text)) return {
    type: 'drama',
    description: `Traditional opera and drama channel showcasing Peking opera, Cantonese opera, Yue opera, and classical Chinese theatrical performances${region ? ' with ' + region + ' regional varieties' : ''}`
  };

  // music - 音乐
  if (/音乐|歌|演唱会|MV|古典|交响|民乐|摇滚/.test(text)) return {
    type: 'music',
    description: `Music channel featuring pop concerts, classical performances, music videos, and live shows for music lovers${region ? ' with ' + region + ' music programming' : ''}`
  };

  // fashion - 时尚
  if (/时尚|美妆|购物|潮流|服装/.test(text)) return {
    type: 'fashion',
    description: `Fashion and lifestyle channel covering runway shows, beauty trends, shopping guides, and celebrity style${region ? ' with ' + region + ' fashion focus' : ''}`
  };

  // game - 游戏
  if (/游戏|电竞|魔兽|英雄联盟|LOL|DOTA/.test(text)) return {
    type: 'game',
    description: `Gaming and e-sports channel featuring competitive gaming tournaments, game reviews, and live streaming of major e-sports events${region ? ' with ' + region + ' gaming community' : ''}`
  };

  // travel - 旅游
  if (/旅游|地理|风光|美景|探索|旅行/.test(text)) return {
    type: 'travel',
    description: `Travel channel showcasing destinations, scenic locations, cultural exploration, and travel guides${region ? ' featuring ' + region + ' travel content' : ''}`
  };

  // food - 美食
  if (/美食|烹饪|食堂|健康|养生/.test(text)) return {
    type: 'food',
    description: `Food and cooking channel with culinary shows, recipe tutorials, restaurant reviews, and healthy living tips${region ? ' with ' + region + ' cuisine focus' : ''}`
  };

  // finance - 财经
  if (/财经|股票|金融|经济|投资|商业/.test(text)) return {
    type: 'finance',
    description: `Financial channel covering stock markets, economic news, investment insights, and business analysis${region ? ' with ' + region + ' market coverage' : ''}`
  };

  // tech - 科技
  if (/科技|数码|手机|电脑|互联网/.test(text)) return {
    type: 'tech',
    description: `Technology channel featuring gadgets, digital innovations, tech news, and coverage of the latest consumer electronics${region ? ' with ' + region + ' tech scene' : ''}`
  };

  // health - 健康
  if (/健康|医疗|医药|保健|医学/.test(text)) return {
    type: 'health',
    description: `Health and medical channel offering wellness advice, medical information, healthy lifestyle tips, and healthcare guidance${region ? ' with ' + region + ' health services' : ''}`
  };

  // 默认返回comprehensive
  return {
    type: 'comprehensive',
    description: `General entertainment channel offering diverse programming including news, dramas, variety shows, and movies${region ? ' for ' + region + ' audiences' : ''}`
  };
}

/**
 * 处理手动分类请求（从 admin API）
 */
export async function handleClassifyChannelsAI(request, env, ctx) {
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
    // 非 SSE 版本：先解析 body
    const body = await request.json();
    
    if (body.async) {
      // 异步版本：立即返回202，后台处理
      const limit = parseInt(body.limit) || 5000;
      
      // 立即返回202 Accepted
      ctx.waitUntil((async () => {
        try {
          console.log('[AI-Classify] Async job started, processing in background...');
          const result = await classifyEmptyTypeChannels(env, limit);
          console.log('[AI-Classify] Async job completed:', result);
        } catch (e) {
          console.error('[AI-Classify] Async job failed:', e);
        }
      })());
      
      return new Response(JSON.stringify({
        success: true,
        message: 'AI 分类已在后台启动，处理完成后将显示通知'
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 普通版本：一次性返回
      try {
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
}