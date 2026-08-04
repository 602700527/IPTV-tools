# 同步过滤配置模板

## 配置说明

同步过滤功能用于在同步数据源时，根据规则过滤和重命名频道。

### 配置字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `excludeGroups` | string[] | 排除的分组名（包含关键字的分组） |
| `excludeUrls` | string[] | 排除的播放地址（包含关键字的 URL） |
| `excludeNames` | string[] | 排除的频道名（包含关键字的频道） |
| `excludeDuplicateUrls` | boolean | 是否过滤重复播放地址 |
| `groupRenameRules` | object[] | 分组重命名规则 [{keyword, newName}] |
| `groupRenameExclude` | string[] | 不参与重命名的分组 |

### 配置示例

```json
{
  "excludeGroups": [
    "China",
    "Hong Kong",
    "Taiwan",
    "Macao",
    "测试"
  ],
  "excludeUrls": [
    "hebttv.com",
    "cztv.com",
    "188766.xyz",
    "112.46.105.20",
    "129.211.14.102"
  ],
  "excludeNames": [
    "Geo-blocked",
    "解说",
    "轮播",
    "盗",
    "Semifinal"
  ],
  "excludeDuplicateUrls": true,
  "groupRenameRules": [
    {"keyword": "港", "newName": "港澳台[墙外]"},
    {"keyword": "MyTV", "newName": "港澳台[墙外]"},
    {"keyword": "澳", "newName": "港澳台[墙外]"},
    {"keyword": "Juli", "newName": "港澳台[墙外]"},
    {"keyword": "渣", "newName": "港澳台[墙外]"}
  ],
  "groupRenameExclude": [
    "央视",
    "CCTV",
    "体育"
  ]
}
```

### 匹配规则

- **excludeGroups**: 分组名包含任意关键字即排除
- **excludeUrls**: URL 包含任意关键字即排除
- **excludeNames**: 频道名包含任意关键字即排除
- **groupRenameRules**: 分组名包含 keyword 即重命名为 newName
- **groupRenameExclude**: 在此列表中的分组不参与重命名

## 部署步骤

1. 修改配置模板
2. 保存到数据库:
   ```bash
   curl -s -X POST "http://127.0.0.1:8787/admin/sync/filter" \
     -H "X-Admin-Key: {KEY}" \
     -H "Content-Type: application/json" \
     -d @config.json
   ```
3. 手动同步验证:
   ```bash
   curl -s -X POST "http://127.0.0.1:8787/admin/sync/all" \
     -H "X-Admin-Key: {KEY}" \
     -H "Content-Type: application/json" \
     -d '{"async":true}'
   ```
4. 检查同步日志确认过滤生效