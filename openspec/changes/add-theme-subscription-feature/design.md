## Context

当前IPTV系统的卡密(兑换码)只支持按"有效期天数"和"最大IP数"区分产品，无法实现内容差异化。用户只能选择不同天数的卡密，但收到的都是相同的全部直播源。

未来商业场景需要：
- 提供不同价格的主题套餐（如"央视套餐 ¥30"、"体育专项 ¥50"、"全通套餐 ¥80"）
- 不同主题包含不同的直播源组合
- 卡密可以绑定一个或多个主题

### 现有数据模型
- `sources`: 直播源（多个M3U URL）
- `channels`: 解析后的频道（按 source_id 关联）
- `codes`: 卡密表（code, status, duration_days, max_ips）
- KV缓存: `channels_cache` 存储所有频道

### 现有订阅流程
```
/sub/{code}.m3u → 验证卡密 → 获取全部启用频道 → 生成M3U
```

## Goals / Non-Goals

**Goals:**
- 实现卡密与主题的多对多绑定
- 支持多种匹配规则：数据源ID、分类名称、域名（含通配符）、频道名模式、频道类型
- 所有主题匹配的频道取并集，允许重复匹配但最终去重
- 订阅M3U按主题规则过滤后生成
- 管理后台支持主题CRUD和卡密绑定

**Non-Goals:**
- 不修改现有购买套餐的自动发卡密流程（保持现状，即会员订阅仍使用全局直播源）
- 不实现主题的继承/组合关系
- 不实现套餐与主题的绑定（套餐定价暂不修改）

## Decisions

### 1. 数据模型设计

**themes 表：**
```sql
CREATE TABLE themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,              -- 主题名称
  name_en TEXT,                   -- 英文名称
  rules TEXT NOT NULL,            -- JSON过滤规则
  description TEXT,               -- 描述
  priority INTEGER DEFAULT 0,     -- 优先级（预留，暂不使用）
  is_active BOOLEAN DEFAULT 1,    -- 是否启用
  created_at DATETIME,
  updated_at DATETIME
);
```

**code_themes 关联表：**
```sql
CREATE TABLE code_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,             -- 卡密
  theme_id INTEGER NOT NULL,      -- 主题ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, theme_id),         -- 防止重复绑定
  INDEX idx_code_themes_code (code),  -- 按卡密查询索引
  INDEX idx_code_themes_theme_id (theme_id)  -- 按主题ID查询索引
);
```

**说明：**
- 卡密与主题通过 `code_themes` 关联表实现多对多关系
- 旧卡密在 `code_themes` 中无记录，等价于全局直播源
- 不使用 `codes` 表的 JSON 字段方式

### 2. 规则结构设计

```json
{
  "version": 1,
  "conditions": [
    { "type": "source_ids", "values": [1, 3] },
    { "type": "group_titles", "values": ["央视", "卫视"] },
    { "type": "domains", "values": ["qq.com", "*.taobao.com"] },
    { "type": "channel_patterns", "patterns": [
      { "pattern": "CCTV*", "match_type": "prefix" },
      { "pattern": "*体育*", "match_type": "contains" },
      { "pattern": "CCTV\\d+", "match_type": "regex" }
    ]},
    { "type": "types", "values": ["movie", "sports"] }
  ],
  "logic": "OR"
}
```

**匹配逻辑说明：**
- `logic: "OR"`: 所有条件是或关系，频道被任一条件匹配即加入
- `domains` 支持通配符 `*.` 前缀，如 `*.qq.com` 匹配 `live.qq.com`
- `channel_patterns` 的 `match_type`: `prefix`(前缀)、`contains`(包含)、`regex`(正则)

### 3. 频道过滤流程

```
1. 从KV获取全部 channels
2. 查询 code_themes 关联表获取该卡密绑定的主题
   SELECT t.rules FROM code_themes ct
   JOIN themes t ON ct.theme_id = t.id
   WHERE ct.code = ? AND t.is_active = 1
3. 如果无绑定记录 → 返回全部启用频道
4. 遍历每个主题的 rules，对 channels 进行过滤
5. 合并所有主题的过滤结果（取并集）
6. 按 channel_hash 去重
```

**关键点：**
- 使用 JOIN 查询确保只获取存在且启用的主题
- 自动过滤掉已被删除或禁用的主题的绑定关系
- 每个主题独立过滤一次，结果取并集

**优化策略：**
- Theme rules 也缓存到 KV (`theme_rules_{id}`)
- 变更主题规则时清除缓存，下次订阅时重新缓存

### 4. 删除主题保护

如果 `code_themes` 中存在该主题的绑定记录，不允许删除主题。

### 5. Admin API 设计

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/admin/themes` | GET | 获取所有主题列表 |
| `/admin/themes` | POST | 创建新主题 |
| `/admin/themes` | PUT | 更新主题信息 |
| `/admin/themes` | DELETE | 删除主题（有绑定则拒绝） |
| `/admin/codes` | POST | 生成卡密时增加 `theme_ids` 参数 |

### 6. 频道类型来源

`channel.type` 字段由 AI 分类功能填充，通过 `handlers/ai-classify.js` 的 `handleClassifyChannelsAI` 更新。

常见类型包括：movie, sports, entertainment, news, animation, documentary 等。运行时从数据库 `SELECT DISTINCT type FROM channels WHERE type != ''` 获取。

## Risks / Trade-offs

| Risk | Mitigation |
|-----|------------|
| 域名通配符匹配增加CPU开销 | 限制通配符只支持 `*.` 前缀格式，避免复杂正则 |
| 主题规则变更时已下载的M3U不生效 | M3U有12小时缓存，用户需要重新订阅 |
| 删除主题时误操作 | 使用 DELETE 前的 count 检查，有绑定则拒绝 |
| 多主题绑定的频道重复处理 | 取并集后使用 channel_hash 去重 |
| 主题被删除后卡密仍引用该主题 | JOIN查询只获取存在且启用的主题，自动过滤失效绑定 |

## Migration Plan

1. **Phase 1: 数据库迁移**
   - 创建 `themes` 表
   - 创建 `code_themes` 关联表（含索引）
   - 旧卡密在 `code_themes` 中无记录 → 订阅时使用全局直播源

2. **Phase 2: 核心逻辑**
   - 实现 `filterChannels(rules, channels)` 函数
   - 实现主题CRUD的D1操作函数
   - 订阅流程改造（使用 JOIN 查询获取有效主题）

3. **Phase 3: Admin UI**
   - 主题管理页面（JSON编辑器）
   - 卡密生成页面增加主题选择多选框

## Open Questions

1. ~~主题是否需要继承关系~~ → 不需要
2. ~~频道去重策略~~ → 取并集后按 channel_hash 去重
3. ~~主题变更是否立即生效~~ → 立即生效（清除KV缓存）
4. ~~旧卡密处理~~ → 无绑定关系 → 全局
5. ~~主题数量预估~~ → 10几个

**已解决，无需继续确认。**

---

## 补充确认的设计决策

### 主题规则配置入口

主题规则通过**主题管理界面**的JSON编辑器配置。

管理员在 `admin-page.js` 中：
- 创建/编辑主题时，直接在表单中粘贴或手写JSON格式的规则
- 提供规则示例模板，方便复制粘贴
- 不做复杂的可视化编辑器（保持灵活性）

### 主题列表位置

主题管理入口集成在现有**卡密管理页面**中：
- 在卡密列表上方或侧边添加"主题管理"按钮
- 点击弹出主题管理对话框
- 或新增独立的"主题"Tab页面

### 批量卡密生成规则

- 批量生成卡密时，`theme_ids` 参数可选
- 如果指定 `theme_ids: [1, 2]`，则**每个卡密**都绑定这组主题
- 如果不指定 `theme_ids` 或留空，则卡密不绑定任何主题（使用全局直播源）

### 优先级设计

当前设计预留了 `priority` 字段，但**暂不启用**，未来如需多主题排序时可扩展。