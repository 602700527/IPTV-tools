# Theme Subscription Binding Specification

## Overview

卡密与主题的多对多绑定管理。支持一个卡密绑定多个主题，一个主题可被多个卡密绑定。

## Data Model

### themes 表

```sql
CREATE TABLE themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,              -- 主题名称
  name_en TEXT,                    -- 英文名称
  rules TEXT NOT NULL,            -- JSON过滤规则
  description TEXT,               -- 描述
  priority INTEGER DEFAULT 0,      -- 优先级（预留）
  is_active BOOLEAN DEFAULT 1,    -- 是否启用
  created_at DATETIME,
  updated_at DATETIME
);
```

### code_themes 关联表

```sql
CREATE TABLE code_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,              -- 卡密
  theme_id INTEGER NOT NULL,      -- 主题ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, theme_id),
  INDEX idx_code_themes_code (code),
  INDEX idx_code_themes_theme_id (theme_id)
);
```

### 旧卡密兼容

- 旧卡密在 `code_themes` 中无记录
- 查询时：无绑定记录 = 全局直播源（全部启用频道）

## API Endpoints

### Theme CRUD

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/themes` | GET | 获取所有主题列表 |
| `/admin/themes` | POST | 创建新主题 |
| `/admin/themes/{id}` | GET | 获取单个主题详情 |
| `/admin/themes/{id}` | PUT | 更新主题 |
| `/admin/themes/{id}` | DELETE | 删除主题（有绑定拒绝） |

### Code-Theme Binding

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/codes/{code}/themes` | GET | 获取卡密绑定的主题列表 |
| `/admin/codes/{code}/themes` | POST | 绑定主题到卡密 |
| `/admin/codes/{code}/themes` | DELETE | 解绑主题 |
| `/admin/codes/bind-themes` | POST | 批量绑定（生成卡密时） |

### 卡密生成扩展

原接口 `/admin/codes` POST 新增参数：
```json
{
  "count": 10,
  "duration_days": 30,
  "max_ips": 3,
  "remark": "测试",
  "theme_ids": [1, 3]  // 可选，绑定的主题ID数组
}
```

## Theme Rules Structure

```json
{
  "version": 1,
  "conditions": [...],
  "logic": "OR"
}
```

参见 [Theme Filtering Specification](../theme-filtering/spec.md)

## Deletion Protection

删除主题前检查 `code_themes` 表：

```sql
SELECT COUNT(*) FROM code_themes WHERE theme_id = ?
```

如果有绑定记录，返回错误：
```json
{
  "success": false,
  "error": "无法删除主题，该主题已被N个卡密绑定"
}
```

## Subscription Flow Integration

```
/sub/{code}.m3u
    ↓
验证卡密状态和有效期
    ↓
查询该卡密绑定的主题（只获取存在且启用的）：
  SELECT t.rules FROM code_themes ct
  JOIN themes t ON ct.theme_id = t.id
  WHERE ct.code = ? AND t.is_active = 1
    ↓
如果无结果 → 返回全部启用频道
    ↓
如果有待应用的主题:
    ↓
遍历每个主题的 rules:
  - 使用 filterChannels() 过滤 channels
    ↓
合并所有结果取并集
    ↓
按 channel_hash 去重
    ↓
生成 M3U
```

**关键点：** JOIN 查询确保只获取有效主题，自动过滤已被删除或禁用的主题。

## KV Caching Strategy

| Key | Data | TTL |
|-----|------|-----|
| `theme_rules_{id}` | JSON rules | 12h |
| `themes_list` | 主题列表 | 1h |

变更时清除缓存：
```javascript
await env.KV.delete(`theme_rules_${themeId}`);
await env.KV.delete('themes_list');
```

## Admin UI Requirements

### Theme Management Page

- 主题列表（名称、描述、频道数预览、状态）
- 创建/编辑主题表单
  - 名称、英文名、描述
  - 规则编辑器（可视化JSON编辑）
- 删除确认对话框

### Code Generation Page

- 现有字段：数量、有效期、最大IP数、备注
- 新增：主题选择（多选下拉框）
- 可选：不绑定主题（全局直播源）

### Code Detail Page

- 显示该卡密绑定的主题列表
- 支持添加/移除绑定

## Edge Cases

| Case | Handling |
|------|----------|
| 主题被删除后卡密仍引用该主题 | JOIN查询只获取存在且启用的主题，自动过滤 |
| 主题规则为空/无效 | 使用空条件，返回全部频道 |
| 批量生成卡密时主题不存在 | 跳过无效theme_id，记录警告 |
| 批量生成时无指定theme_ids | 每个卡密不绑定任何主题，使用全局直播源 |