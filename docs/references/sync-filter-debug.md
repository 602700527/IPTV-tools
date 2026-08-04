# 同步过滤功能调试笔记

## 问题现象
用户反馈：同步过滤规则修改后，同步时过滤功能失效

## 根因分析

### 问题 1：前端 filter 对象不完整
**文件**: `admin-page.js` 第 1781-1803 行

**错误代码**:
```javascript
const filter = {
  excludeGroups,
  excludeUrls,
  excludeNames,
  async: true  // 这是错的，async 不是 filter 字段
};
```

**缺少字段**:
- `excludeDuplicateUrls`
- `groupRenameRules`
- `groupRenameExclude`

**修复代码**:
```javascript
// 解析分组重命名规则
const groupRenameRules = document.getElementById('groupRenameRules').value
  .split(new RegExp('[\n]+'))
  .map(s => s.trim())
  .filter(s => s.length > 0)
  .map(rule => {
    const parts = rule.split('->');
    if (parts.length === 2) {
      return {
        keyword: parts[0].trim(),
        newName: parts[1].trim()
      };
    }
    return null;
  })
  .filter(rule => rule !== null);

const groupRenameExclude = document.getElementById('groupRenameExclude').value
  .split(new RegExp('[\n,]+'))
  .map(s => s.trim())
  .filter(s => s.length > 0);

const filter = {
  excludeGroups,
  excludeUrls,
  excludeNames,
  excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
  groupRenameRules,
  groupRenameExclude
};
```

### 问题 2：后端期望 data.filter 但收到扁平结构
**文件**: `handlers/admin.js` 第 231、247 行

**错误代码**:
```javascript
const result = await manualSyncAll(env, data.filter || null);
```

**问题**: 前端发送的是扁平结构 `{ excludeGroups, ... }`，后端期望 `{ filter: { excludeGroups, ... } }`，导致 `data.filter` 为 `undefined`，最终 `filter = null`，同步不过滤。

**修复代码**:
```javascript
const result = await manualSyncAll(env, data.filter || data);
```

## API 路径

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/sync/filter` | 获取同步过滤配置 |
| POST | `/admin/sync/filter` | 保存同步过滤配置 |
| POST | `/admin/sync/all` | 同步全部数据源 |
| POST | `/admin/sync/{sourceId}` | 同步单个数据源 |

## 过滤配置格式

```json
{
  "excludeGroups": ["China", "Hong Kong", "Taiwan"],
  "excludeUrls": ["hebttv.com", "cztv.com"],
  "excludeNames": ["Geo-blocked", "解说", "轮播"],
  "excludeDuplicateUrls": true,
  "groupRenameRules": [
    {"keyword": "港", "newName": "港澳台[墙外]"},
    {"keyword": "MyTV", "newName": "港澳台[墙外]"}
  ],
  "groupRenameExclude": ["央视", "CCTV", "体育"]
}
```

## 调试步骤

```bash
# 1. 检查本地数据库配置
npx wrangler d1 execute tv-service-db --local --command "SELECT value FROM settings WHERE key = 'sync_filter_config'"

# 2. 检查生产数据库配置（需登录）
npx wrangler d1 execute tv-service-db --env production --remote --command "SELECT value FROM settings WHERE key = 'sync_filter_config'"

# 3. 测试 GET API
curl -s "http://127.0.0.1:8787/admin/sync/filter" -H "X-Admin-Key: {ADMIN_KEY}"

# 4. 测试 POST API
curl -s -X POST "http://127.0.0.1:8787/admin/sync/filter" \
  -H "X-Admin-Key: {ADMIN_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"excludeGroups":["测试"],"excludeUrls":[],"excludeNames":[],"excludeDuplicateUrls":true,"groupRenameRules":[],"groupRenameExclude":[]}'

# 5. 测试同步全部
curl -s -X POST "http://127.0.0.1:8787/admin/sync/all" \
  -H "X-Admin-Key: {ADMIN_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"excludeGroups":["测试"],"async":true}'
```

## 相关提交

- `fdaf256` - fix(admin): fix syncAllSources missing filter fields
- `415f20d` - fix(admin): fix filter not passed to manualSyncAll