# D1 查询优化建议

## 问题分析

根据D1查询日志，最后一个小时执行了以下查询：

1. **频道列表查询** - 4次
   - `SELECT c.id, c.channel_name, c.group_title, c.logo, c.channel_hash, c.source_id, s.name as source_name, c.headers FROM channels c INNER JOIN sources s ON c.source_id = s.id WHERE c.is_active = 1 AND s.is_active = 1 AND c.source_id IN (?,?) AND c.group_title = ? ORDER BY c.group_title, c.channel_name LIMIT ? OFFSET ?`
   - Rows Read: 4.47k
   - Count: 4次

2. **分组查询** - 7次
   - `SELECT DISTINCT group_title FROM channels c INNER JOIN sources s ON c.source_id = s.id WHERE c.is_active = 1 AND s.is_active = 1 AND c.source_id IN (?,?) ORDER BY group_title`
   - Rows Read: 13.49k
   - Count: 7次

3. **频道详情查询** - 18次
   - `SELECT channel_name FROM channels WHERE channel_hash = ? AND is_active = 1`
   - Rows Read: 6.8k
   - Count: 18次

4. **Token验证查询** - 18次
   - `SELECT id FROM used_tokens WHERE token = ?`
   - Rows Read: 0
   - Count: 18次

5. **总数查询** - 2次
   - `SELECT COUNT(*) as total FROM channels c INNER JOIN sources s ON c.source_id = s.id WHERE c.is_active = 1 AND s.is_active = 1 AND c.source_id IN (?,?)`
   - Rows Read: 6.69k
   - Count: 2次

**总计**: 49次查询，读取约31.45k行

## 问题原因

1. **重复查询分组列表** - 每次加载频道时都会重新查询分组，即使分组数据变化不大
2. **前端缓存失效** - 前端localStorage缓存可能没有正确使用
3. **API响应头未设置缓存** - 后端API响应头设置为 `Cache-Control: no-cache`
4. **没有请求节流** - 频繁的用户操作（如搜索）会导致大量查询

## 优化方案

### 1. 前端优化

#### 1.1 延长前端缓存时间
```javascript
// 当前：6小时缓存
setCache(cacheKey, data, 6 * 60 * 60 * 1000);

// 建议：24小时缓存
setCache(cacheKey, data, 24 * 60 * 60 * 1000);
```

#### 1.2 分组数据独立缓存
```javascript
// 分组数据变化很少，应该长期缓存（7天）
const GROUPS_CACHE_KEY = 'iptv_groups';
const GROUPS_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天

function cacheGroups(groups) {
  localStorage.setItem(GROUPS_CACHE_KEY, JSON.stringify({
    data: groups,
    timestamp: Date.now()
  }));
}

function getCachedGroups() {
  const cached = localStorage.getItem(GROUPS_CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < GROUPS_CACHE_DURATION) {
      return data;
    }
  }
  return null;
}
```

#### 1.3 添加请求节流
```javascript
let isLoadingChannels = false;
let pendingChannelLoad = null;

async function loadChannels(page = 1, updateGroups = true) {
  // 如果正在加载，保存待加载请求
  if (isLoadingChannels) {
    pendingChannelLoad = { page, updateGroups };
    return;
  }

  isLoadingChannels = true;
  try {
    // ... 原有加载逻辑
  } finally {
    isLoadingChannels = false;
    // 如果有待加载的请求，执行它
    if (pendingChannelLoad) {
      const { page, updateGroups } = pendingChannelLoad;
      pendingChannelLoad = null;
      loadChannels(page, updateGroups);
    }
  }
}
```

#### 1.4 搜索防抖优化
```javascript
// 当前：500ms
searchTimeout = setTimeout(() => { ... }, 500);

// 建议：800-1000ms
searchTimeout = setTimeout(() => { ... }, 800);
```

### 2. 后端优化

#### 2.1 启用API响应缓存
```javascript
// 在 handlePublicChannels 中
return new Response(JSON.stringify({
  success: true,
  channels: paginatedChannels,
  groups: allGroups,
  pagination
}), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // 缓存5分钟
  }
});
```

#### 2.2 使用 KV 缓存分组数据
```javascript
// 在 handlers/public.js 中
async function getGroupsFromKV(env) {
  const CACHE_KEY = 'groups:v1';
  const cached = await env.KV.get(CACHE_KEY, 'json');

  if (cached && cached.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000) {
    console.log('[Groups] 使用KV缓存');
    return cached.data;
  }

  // 查询数据库
  const groupsResult = await db.prepare(`
    SELECT DISTINCT group_title
    FROM channels c
    INNER JOIN sources s ON c.source_id = s.id
    WHERE c.is_active = 1 AND s.is_active = 1
    ORDER BY group_title
  `).all();

  const groups = groupsResult.results?.map(g => g.group_title).filter(g => g) || [];

  // 缓存7天
  await env.KV.put(CACHE_KEY, JSON.stringify({
    data: groups,
    timestamp: Date.now()
  }), { expirationTtl: 7 * 24 * 60 * 60 });

  return groups;
}
```

#### 2.3 优化查询索引
```sql
-- 确保有这些索引
CREATE INDEX idx_channels_active_source ON channels(is_active, source_id);
CREATE INDEX idx_channels_group_active ON channels(group_title, is_active);
CREATE INDEX idx_channels_hash_active ON channels(channel_hash, is_active);
```

#### 2.4 分页数据预加载
```javascript
// 在前端预加载下一页数据
async function prefetchNextPage() {
  if (currentPage < totalPages && !nextPagePrefetched) {
    const nextPageParams = new URLSearchParams({
      page: currentPage + 1,
      page_size: pageSize
    });
    if (currentSearch) {
      nextPageParams.append('search', currentSearch);
    }
    if (currentGroup && !currentSearch) {
      nextPageParams.append('group', currentGroup);
    }

    fetch(API_BASE + '/channels?' + nextPageParams.toString())
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // 缓存下一页数据
          const cacheKey = getCacheKey('channels', nextPageParams.toString());
          setCache(cacheKey, data);
          nextPagePrefetched = true;
        }
      });
  }
}
```

### 3. 监控优化

#### 3.1 添加查询计数器
```javascript
// 在后端添加查询计数
let queryCount = 0;
let lastResetTime = Date.now();

function logQuery(type) {
  queryCount++;
  const elapsed = Date.now() - lastResetTime;

  if (elapsed > 60 * 60 * 1000) { // 每小时
    console.log(`[QueryStats] 每小时查询数: ${queryCount}`);
    queryCount = 0;
    lastResetTime = Date.now();
  }
}

// 在每次查询时调用
logQuery('channels');
```

## 预期效果

实施这些优化后，预期可以：

1. **减少60-80%的D1查询次数**
   - 分组查询：从每小时7次降至1-2次
   - 频道列表查询：从每小时4次降至1-2次
   - 总查询数：从每小时49次降至10-20次

2. **降低D1读取行数**
   - 从31.45k行/小时降至5-10k行/小时

3. **提升用户体验**
   - 前端响应更快
   - 减少加载等待时间

## 实施优先级

1. **高优先级**（立即实施）
   - 延长前端缓存时间到24小时
   - 添加请求节流
   - 启用API响应缓存

2. **中优先级**（1-2天内）
   - 使用KV缓存分组数据
   - 优化搜索防抖时间

3. **低优先级**（长期优化）
   - 分页数据预加载
   - 添加查询监控
