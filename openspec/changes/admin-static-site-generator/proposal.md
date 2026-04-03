# Admin Static Site Generator

## Summary

在管理后台增加静态页面生成功能，支持测试环境和生产环境的不同存储策略。

## Motivation

当前静态页面生成需要手动运行 CLI 脚本，不便于运营人员操作。需要在管理后台提供一键生成功能。

## Solution

### 环境检测与存储策略

| 环境 | STATIC_SOURCE | 存储位置 | 路由指向 |
|------|---------------|----------|----------|
| 测试环境 (wrangler dev) | `local` | KV 缓存 | 直接读取 |
| 生产环境 (wrangler deploy) | `r2` | R2 Bucket | R2 直读 |

### 功能设计

1. **环境自动检测**：根据 `env.ENVIRONMENT` 或 `env.R2_BUCKET` 是否存在自动判断
2. **一键生成**：在管理后台添加「生成静态页面」按钮
3. **生成选项**：
   - 首页 (index.html)
   - 分类页 (category/*.html)
   - 频道详情页 (channel/*.html)
   - 全部
4. **进度显示**：显示生成进度和结果统计
5. **环境标识**：管理后台显示当前环境类型

### API 设计

```
POST /api/admin/static/generate
  - type: homepage | categories | channels | all
  - response: { success, message, stats: { total, success, failed } }

GET /api/admin/static/status
  - response: { environment, staticSource, storage, lastGenerated }
```

## Consequences

- 运营人员可自主生成静态页面，无需 CLI
- 测试环境和生产环境自动适配
- 增加 Workers CPU 时间（生成时），但静态文件缓存后大幅降低运行时负载
