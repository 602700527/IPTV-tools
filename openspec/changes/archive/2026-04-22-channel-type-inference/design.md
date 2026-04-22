## Why

建立频道类型（type）自动推断与管理功能的技术设计方案。

## Type 标准值

| type | 含义 | 示例 |
|------|------|------|
| movie | 电影/影视 | CCTV-6 电影 |
| animation | 动画/动漫 | 动漫剧场、卡通频道 |
| entertainment | 综艺 | 综艺频道 |
| sports | 体育 | 体育频道、足球、篮球 |
| news | 新闻 | 新闻频道 |
| kids | 少儿/儿童 | 少儿频道、儿童天地 |
| documentary | 纪录片 | 纪录片、探索频道 |
| education | 教育 | 教育频道、课堂 |
| drama | 戏曲/戏剧 | 戏曲频道、京剧 |
| music | 音乐 | 音乐频道、MV |
| general | 综合/通用 | 无法推断时的默认值 |

**允许多值**：一个频道可以有多个 type，如 `movie,documentary`

---

## Architecture Overview

```
M3U同步流程中的Type推断
═══════════════════════════════════════════════════════════════════

  远程M3U
     │
     ▼
┌─────────────────────────┐
│   1. 解析 tvg-type      │ ← M3U 自带字段
└───────────┬─────────────┘
            │ 有 → 查映射表 → 转换为标准 type
            │ 无 → 跳过
            ▼
┌─────────────────────────┐
│   2. 关键词推断 type    │ ← channel_name 匹配
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   3. 合并多匹配         │ ← 允许多个 type，逗号分隔
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   4. 存入 channels.type │
└─────────────────────────┘
```

---

## Database Schema Changes

### channels 表新增字段

```sql
ALTER TABLE channels ADD COLUMN type TEXT DEFAULT '';
-- 允许多值，逗号分隔，如: "movie,animation"
-- 可为空（历史频道保持为空，下次同步时推断）
```

### settings 表新增配置

```sql
INSERT INTO settings (key, value) VALUES ('type_mapping_config', '{"cinema":"movie","films":"movie","anim":"animation","cartoon":"animation","sports":"sports","news":"news","kids":"kids","doc":"documentary","edu":"education","drama":"drama","music":"music"}');
```

配置说明：key 是 M3U tvg-type 的原始值，value 是转换后的标准 type。

---

## Type 推断规则

### 1. tvg-type 映射（优先级 1）

M3U 中的 `tvg-type` 字段经过映射表转换：

```javascript
const TYPE_MAPPING = {
  'cinema': 'movie',
  'films': 'movie',
  'film': 'movie',
  'anim': 'animation',
  'animation': 'animation',
  'cartoon': 'animation',
  'entertainment': 'entertainment',
  'sports': 'sports',
  'sport': 'sports',
  'news': 'news',
  'kids': 'kids',
  'children': 'kids',
  'doc': 'documentary',
  'documentary': 'documentary',
  'edu': 'education',
  'education': 'education',
  'drama': 'drama',
  'theater': 'drama',
  'music': 'music',
  // 可在管理后台配置扩展
};
```

### 2. channel_name 关键词推断（优先级 2）

如果 tvg-type 为空或无映射，使用 channel_name 关键词匹配：

```javascript
const CHANNEL_TYPE_KEYWORDS = [
  // movie - 精确匹配优先
  { keywords: ['电影', '影院', '放影', '影城'], type: 'movie', exact: true },
  // animation
  { keywords: ['动画', '动漫', '卡通', '少儿动画'], type: 'animation', exact: true },
  // entertainment
  { keywords: ['综艺'], type: 'entertainment', exact: true },
  // sports
  { keywords: ['体育', '足球', '篮球', '网球', '羽毛球', '乒乓球', '排球', '高尔夫', '赛车', '赛事'], type: 'sports', exact: true },
  // news
  { keywords: ['新闻', '资讯', '时事'], type: 'news', exact: true },
  // kids - 需精确匹配（避免误匹配到其他含"儿"的词）
  { keywords: ['少儿', '儿童', '幼儿', '宝宝', '卡通'], type: 'kids', exact: true },
  // documentary
  { keywords: ['纪录', '探索', '人文', '自然'], type: 'documentary', exact: true },
  // education
  { keywords: ['教育', '课堂', '讲堂', '公开课', '大学'], type: 'education', exact: true },
  // drama
  { keywords: ['戏曲', '戏剧', '京剧', '梨园', '粤剧', '越剧', '黄梅戏'], type: 'drama', exact: true },
  // music
  { keywords: ['音乐', 'MV', '演唱会', '歌剧院', '古典音乐'], type: 'music', exact: true },
];

// 匹配逻辑：精确匹配优先于模糊匹配
// 允许多个 type 同时匹配
```

### 3. 推断优先级

```
tvg-type 映射 → 有 → 使用映射后的值
                   ↓ 无 → 关键词推断
                   ↓ 无法推断 → type = ''（保持为空）
```

### 4. 多值处理

允许多个 type 同时匹配，结果用逗号分隔：

```
channel_name = "动画电影剧场"
匹配: animation + movie
→ type = "animation,movie"
```

---

## M3U 输出

### generateM3UContent 修改

```javascript
// 在 #EXTINF 行中添加 tvg-type
let extinf = '#EXTINF:-1';
if (channel.logo) extinf += ` tvg-logo="${channel.logo}"`;
if (channel.group_title) extinf += ` group-title="${channel.group_title}"`;
if (channel.type) extinf += ` tvg-type="${channel.type}"`;
extinf += `,${channel.channel_name}\n`;
```

---

## KV 缓存

### cacheChannelsToKV 修改

```javascript
// SELECT 语句增加 type 字段
SELECT
  c.id,
  c.channel_name,
  c.group_title,
  c.type,        -- 新增
  c.logo,
  c.play_url,
  c.headers,
  c.channel_hash,
  c.is_active,
  c.source_id,
  s.name as source_name,
  s.is_active as source_active
FROM channels c
INNER JOIN sources s ON c.source_id = s.id
WHERE c.is_active = 1 AND s.is_active = 1
```

---

## 管理后台功能

### 频道列表

```
┌────────────────────────────────────────────────────────────────┐
│ 频道管理                                              [导出CSV] │
├────────────────────────────────────────────────────────────────┤
│ 搜索: [____________]  源: [全部 ▼]  分组: [全部 ▼]  类型: [全部 ▼] │
│                                                                │
│ ┌────┬──────────┬────────┬────────┬─────────────────┬─────┐ │
│ │ ID │ 频道名   │ 分组   │ 类型   │ 来源            │ 操作│ │
│ ├────┼──────────┼────────┼────────┼─────────────────┼─────┤ │
│ │ 1  │ CCTV-6  │ 央视   │ movie  │ 源A             │ 编辑│ │
│ │ 2  │ 动漫剧场 │ 北京   │ animation,movie │ 源B  │ 编辑│ │
│ │ 3  │ 体育频道 │ 卫视   │ sports | 源A             │ 编辑│ │
│ └────┴──────────┴────────┴────────┴─────────────────┴─────┘ │
│                                                                │
│                          [批量设置类型 ▼]                      │
└────────────────────────────────────────────────────────────────┘
```

### 频道编辑

```
┌────────────────────────────────────────────────────────────────┐
│ 编辑频道                                              [保存]   │
├────────────────────────────────────────────────────────────────┤
│ 频道名称: [CCTV-6 电影                                    ]    │
│ 分组:     [央视                                          ]    │
│ 类型:     [movie                                     ] [x]    │
│           [animation                                  ] [+]    │
│           (输入框，支持多选或新建)                             │
│ 来源:     [源A                                          ]    │
│ Logo:     [http://example.com/logo.png                 ]    │
│ 播放地址: [http://example.com/stream.m3u8              ]    │
└────────────────────────────────────────────────────────────────┘
```

### 批量设置类型

```
┌────────────────────────────────────────────────────────────────┐
│ 批量设置类型                                                    │
├────────────────────────────────────────────────────────────────┤
│ 已选择: 23 个频道                                               │
│                                                                │
│ 操作: [设置类型 ▼]  →  选择: [movie                    ]       │
│                                                                │
│ 或根据分组自动设置:                                              │
│ 分组: [央视                                     ▼]              │
│ 类型: [movie                                   ]               │
│                                                                │
│                          [取消]                    [确认批量]    │
└────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/channels | 频道列表（支持 type 筛选参数） |
| PUT | /admin/channels/:id | 更新频道（包括 type） |
| PUT | /admin/channels/batch-type | 批量更新 type |
| GET | /admin/type-config | 获取类型映射配置 |
| PUT | /admin/type-config | 更新类型映射配置 |

### Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/channels | 频道列表（返回 type 字段） |
| GET | /api/groups | 分组列表（不变） |

---

## File Structure

```
database.js                    # 修改: channels 表新增 type 字段, parseM3UContent 推断逻辑

channel-cache.js               # 修改: SELECT/缓存包含 type

handlers/
  admin.js                     # 修改: 频道 CRUD 支持 type, 批量更新 API
  public.js                    # 修改: 频道 API 返回 type

admin-page.js                  # 修改: 频道列表 type 列, 筛选, 编辑, 批量操作

worker.js                      # 修改: 路由（如有新增 API）

wrangler.toml                  # (无改动)
```

---

## 历史频道处理

| 场景 | 处理方式 |
|------|----------|
| 新频道同步 | 自动推断 type |
| 已有频道 | 保持 type=''，下次同步时自动推断（如果 group-title/name 变化会重新推断） |
| 手动编辑 | 管理员可随时手动设置/覆盖 |

---

## 错误处理

| Scenario | Handling |
|----------|----------|
| tvg-type 不在映射表 | 保留原始值（允许非标准 type） |
| channel_name 关键词无匹配 | type = '' |
| 多规则冲突 | 全部合并去重 |
| type 字段超长 | 截断到 500 字符 |

---

## 后续扩展点

1. **Type 筛选页**：用户端按 type 筛选频道
2. **Type 统计**：管理后台显示各 type 频道数量分布
3. **AI 推断**：对于无法匹配的频道，可用 AI 推断 type
4. **自动学习**：根据用户播放行为自动优化 type 映射
