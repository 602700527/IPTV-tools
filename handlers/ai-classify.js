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
    // 构建搜索关键词：优先使用 "Channel Name" 格式，其次用 "Name (TV channel)"
    const searchTerms = [
      channelName,
      channelName + ' (TV channel)',
      channelName + ' television channel',
      groupTitle ? groupTitle + ' ' + channelName : null,
      channelName + ' ' + groupTitle,
    ].filter(Boolean);

    for (const term of searchTerms) {
      try {
        // 使用 Wikipedia OpenSearch API
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(term)}&limit=1&format=json&origin=*`;
        const response = await fetch(searchUrl);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        // OpenSearch 返回格式: [query, [titles], [descriptions], [urls]]
        const descriptions = data[2];
        const titles = data[1];
        
        if (descriptions && descriptions.length > 0 && descriptions[0]) {
          const desc = descriptions[0].trim();
          // 过滤掉过于通用的描述
          if (desc.length > 20 && !desc.includes('may refer to')) {
            console.log(`[Wikipedia] Found description for "${term}": ${desc.substring(0, 100)}...`);
            return desc;
          }
        }
      } catch (e) {
        // 继续尝试下一个搜索词
        console.log(`[Wikipedia] Search failed for "${term}": ${e.message}`);
      }
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
const SYSTEM_PROMPT = `You are a professional IPTV TV channel classification assistant. You MUST classify channels by combining BOTH the channel name AND the group-title (region/location) together for accurate classification.

Important classification rules:
1. ALWAYS consider BOTH channel name AND group-title together
2. group-title like "央视", "北京", "上海", "广东" indicates the region/location - combine with channel name for better classification
3. If a channel's type cannot be determined with confidence, use "comprehensive"
4. ALWAYS provide rich, informative descriptions (100-200 characters) that include:
   - Target audience or viewer demographic
   - Main content categories or programming focus
   - Broadcast platform or coverage area if inferable
   - Unique characteristics or positioning

Type definitions:
- movie: movies, cinema, theater
- animation: animation, anime, cartoon, kids animation
- entertainment: variety shows, entertainment, talent shows, game shows
- sports: sports, football/soccer, basketball, tennis, badminton, volleyball, golf, racing, competitions
- news: news, current affairs, information
- kids: children, kids, toddlers, babies
- documentary: documentaries, exploration, humanities, nature
- education: education, lectures, open courses, university
- drama: traditional opera, drama, Peking opera, Cantonese opera, Yue opera
- music: music, MV, concerts, opera houses, classical music
- fashion: fashion, beauty, shopping
- game: gaming, e-sports
- travel: travel, geography, scenery
- food: food, cooking, cuisine
- finance: finance, stocks, economy, investment
- tech: technology, digital
- health: health, medical

Return JSON format with classification AND rich English description:
{"1": {"type": "sports", "description": "Sports channel targeting football fans in Asia-Pacific, covering Premier League, La Liga, Champions League, NBA, and major tennis tournaments with multilingual commentary options"}, "2": {"type": "news", "description": "24-hour news channel providing comprehensive current affairs coverage, political analysis, and in-depth reporting for Chinese-speaking audiences worldwide"}, ...}

Key requirements:
- type must be one of the 17 types above (use "comprehensive" if uncertain)
- description must be in English, rich and informative (100-200 characters)
- Combine channel name + group-title for accurate classification`;

const BATCH_SIZE = 200; // 每批处理数量

/**
 * 构建分类 prompt（包含 Wikipedia 真实描述）
 */
function buildClassificationPrompt(channels, wikipediaDescriptions) {
  const channelList = channels.map((ch, i) => {
    const wikiDesc = wikipediaDescriptions.get(ch.id);
    const wikiInfo = wikiDesc ? ` [Wikipedia: ${wikiDesc}]` : '';
    return `${i + 1}. ${ch.channel_name}${ch.group_title ? ' [region: ' + ch.group_title + ']' : ''}${wikiInfo}`;
  }).join('\n');
  
  return `Classify the following IPTV channels. Return ONLY pure JSON without markdown:

${channelList}

Important: The JSON key must be the line number (starting from 1), e.g., "1", "2", "3"...
Return format: {"1": {"type": "sports", "description": "Description from Wikipedia or your knowledge..."}, "2": {"type": "movie", "description": "..."}, ...}

Rules:
- Combine channel name AND group-title (region) for accurate type classification
- If Wikipedia description is provided, use it as the primary source for the description field
- type must be one of: movie, animation, entertainment, sports, news, kids, documentary, education, drama, music, fashion, game, travel, food, finance, tech, health, comprehensive
- Use "comprehensive" if you cannot determine the type with confidence
- description should be based on the Wikipedia content if available, otherwise use your knowledge (50-150 characters)`;
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
      // 先查询 Wikipedia 获取真实描述
      if (controller) {
        const wikiMsg = JSON.stringify({ 
          type: 'progress',
          batch: batchNum,
          totalBatches,
          processed,
          total: totalChannels,
          message: `查询 Wikipedia... ${processed}/${totalChannels}`
        });
        controller.enqueue('data: ' + wikiMsg + '\n\n');
      }
      console.log(`[AI-Classify] Fetching Wikipedia descriptions for batch ${batchNum}...`);
      const wikiDescriptions = await batchFetchWikipediaDescriptions(batch);
      console.log(`[AI-Classify] Got ${wikiDescriptions.size} Wikipedia descriptions for batch ${batchNum}`);

      const prompt = buildClassificationPrompt(batch, wikiDescriptions);

      const responseText = await callMiniMaxAPI(prompt);
      const batchResults = parseAIResponse(responseText, batch);

      // 合并 Wikipedia 真实描述：如果 AI 返回的描述太短或像是通用模板，使用 Wikipedia 描述
      for (const [idStr, item] of Object.entries(batchResults)) {
        const channelId = parseInt(idStr);
        const wikiDesc = wikiDescriptions.get(channelId);
        
        if (wikiDesc) {
          const aiDesc = item.description || '';
          // 如果 AI 描述太短（<30字符）或者是通用模板，使用 Wikipedia 描述
          const isGenericAI = aiDesc.length < 30 || 
            aiDesc.includes('comprehensive') || 
            aiDesc.includes('targeting') && aiDesc.includes('audience');
          
          if (isGenericAI || aiDesc.length < wikiDesc.length * 0.5) {
            item.description = wikiDesc;
            console.log(`[AI-Classify] Using Wikipedia description for channel ${channelId}: ${wikiDesc.substring(0, 80)}...`);
          }
        }
      }

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
      // AI 失败时：优先使用 Wikipedia 描述，其次用关键词分类
      console.log(`[AI-Classify] Falling back to Wikipedia + keyword classification for batch ${batchNum}`);
      for (const channel of batch) {
        // 先尝试 Wikipedia
        const wikiDesc = await fetchWikipediaDescription(channel.channel_name, channel.group_title);
        
        let type, description;
        if (wikiDesc) {
          // 使用 Wikipedia 描述 + AI 推断类型（从描述判断）
          description = wikiDesc;
          type = classifyByKeyword(channel.channel_name, channel.group_title).type;
        } else {
          // 没有 Wikipedia 描述，使用关键词分类
          const keywordResult = classifyByKeyword(channel.channel_name, channel.group_title);
          type = keywordResult.type;
          description = keywordResult.description;
        }
        
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