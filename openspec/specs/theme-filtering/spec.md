# Theme Filtering Specification

## Overview

主题过滤规则引擎，根据预定义的规则从全部频道中筛选出符合条件的子集。

## Rule Structure

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

## Condition Types

### source_ids

按数据源ID过滤。频道的 `source_id` 在列表中即匹配。

| Field | Type | Description |
|-------|------|-------------|
| type | string | `"source_ids"` |
| values | number[] | 数据源ID数组 |

### group_titles

按M3U分类名称（group-title）过滤。频道的 `group_title` 在列表中即匹配。

| Field | Type | Description |
|-------|------|-------------|
| type | string | `"group_titles"` |
| values | string[] | 分类名称数组 |

### domains

按播放URL的域名过滤。支持通配符 `*.` 前缀。

| Field | Type | Description |
|-------|------|-------------|
| type | string | `"domains"` |
| values | string[] | 域名数组，支持 `*.example.com` 格式 |

**匹配逻辑：**
- 精确匹配：`qq.com` 匹配 `https://qq.com/live/...`
- 通配符匹配：`*.qq.com` 匹配任何 `*.qq.com` 子域名

### channel_patterns

按频道名称模式过滤。

| Field | Type | Description |
|-------|------|-------------|
| type | string | `"channel_patterns"` |
| patterns | Pattern[] | 模式数组 |

**Pattern:**

| Field | Type | Description |
|-------|------|-------------|
| pattern | string | 匹配模式字符串 |
| match_type | string | `"prefix"` / `"contains"` / `"regex"` |

**match_type 说明：**
- `prefix`: 频道名以 pattern 开头
- `contains`: 频道名包含 pattern
- `regex`: 正则表达式匹配

### types

按AI分类类型过滤。频道的 `type` 字段在列表中即匹配。

| Field | Type | Description |
|-------|------|-------------|
| type | string | `"types"` |
| values | string[] | 类型数组，如 `["movie", "sports"]` |

## Logic Mode

| Value | Description |
|-------|-------------|
| `"OR"` | 并集：频道被任一条件匹配即加入结果集 |
| `"AND"` | 交集：频道必须被所有条件匹配才加入（当前仅支持OR） |

## Filtering Algorithm

```
Input: channels[], rules{}
Output: filteredChannels[]

1. Parse rules JSON
2. For each channel in channels:
   a. For each condition in rules.conditions:
      - If condition.type matches channel, add to matched set
   b. If rules.logic == "OR" AND matched set not empty:
      - Add channel to result
3. Return result (deduplicated by channel_hash)
```

## Implementation Requirements

### Domain Matching

```javascript
function matchDomain(playUrl, patterns) {
  const hostname = new URL(playUrl).hostname;

  for (const pattern of patterns) {
    if (pattern.startsWith('*.')) {
      // Wildcard: *.example.com
      const suffix = pattern.substring(2);
      if (hostname === suffix || hostname.endsWith('.' + suffix)) {
        return true;
      }
    } else if (hostname === pattern) {
      return true;
    }
  }
  return false;
}
```

### Channel Pattern Matching

```javascript
function matchChannelPattern(channelName, patterns) {
  for (const {pattern, match_type} of patterns) {
    switch (match_type) {
      case 'prefix':
        if (channelName.startsWith(pattern)) return true;
        break;
      case 'contains':
        if (channelName.includes(pattern)) return true;
        break;
      case 'regex':
        if (new RegExp(pattern).test(channelName)) return true;
        break;
    }
  }
  return false;
}
```

### Deduplication

结果按 `channel_hash` 去重，同一频道只出现一次。

## Caching

- Theme rules 缓存到 KV：`theme_rules_{id}`
- TTL: 12小时
- 变更主题规则时清除缓存

## Edge Cases

| Case | Handling |
|------|----------|
| 空 rules | 返回全部频道 |
| 空 conditions | 返回全部频道 |
| 无效的 domain URL | 跳过该频道 |
| 正则表达式错误 | 跳过该匹配条件，记录警告 |
| channel.name 为空 | 跳过该频道 |