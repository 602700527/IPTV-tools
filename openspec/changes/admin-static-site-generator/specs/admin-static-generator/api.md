# Admin Static Generator API

## Overview

管理后台静态页面生成 API，支持环境自动检测和差异化存储。

## Base URL

```
/api/admin/static
```

## Authentication

Requires `X-Admin-Key` header.

## Endpoints

### POST /generate

触发静态页面生成。

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | No | `homepage`, `categories`, `channels`, `all`. Default: `all` |

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Static pages generated successfully",
  "stats": {
    "total": 10500,
    "success": 10500,
    "failed": 0,
    "duration": 45000
  },
  "environment": "production",
  "storage": "R2 Bucket",
  "generated": {
    "homepage": 1,
    "categories": 120,
    "channels": 10379
  }
}
```

**Error Response** (503 Service Unavailable):

```json
{
  "success": false,
  "error": "Storage not available",
  "environment": "production",
  "storage": "R2 Bucket",
  "details": "R2_BUCKET binding is not configured"
}
```

### GET /status

获取生成状态和环境信息。

**Response** (200 OK):

```json
{
  "environment": "production",
  "staticSource": "r2",
  "storage": "R2 Bucket",
  "lastGenerated": "2026-04-03T10:30:00Z",
  "fileCount": {
    "homepage": 1,
    "categories": 120,
    "channels": 10379,
    "total": 10500
  },
  "capabilities": {
    "canGenerate": true,
    "canDelete": true,
    "supportsBatch": true
  }
}
```

### DELETE /cache

清除静态文件缓存（仅测试环境）。

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Cache cleared",
  "deleted": 10500
}
```

## Environment Detection

| Environment | Detection | STATIC_SOURCE | Storage |
|-------------|-----------|---------------|---------|
| Development | `env.R2_BUCKET` is undefined | `local` | KV Cache |
| Production | `env.R2_BUCKET` is defined | `r2` | R2 Bucket |

## File Structure

```
static-output/
├── index.html                    # 首页
├── category/
│   ├── cctv.html               # 分类页
│   ├── sports.html
│   └── ...
├── channel/
│   ├── abc123def.html          # 频道详情页
│   └── ...
└── sitemap.xml
```

## Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 400 | `invalid_type` | 无效的生成类型 |
| 401 | `unauthorized` | 缺少或无效的 Admin Key |
| 503 | `storage_unavailable` | 存储后端不可用 |
| 500 | `generation_failed` | 生成过程出错 |
