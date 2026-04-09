## Why

建立频道详情 AI 生成功能的技术设计方案。

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         系统架构                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐       │
│  │   管理后台   │      │   AI API     │      │     R2      │       │
│  │             │─────▶│  (生成)      │─────▶│   (存储)     │       │
│  │  - 配置     │      │              │      │             │       │
│  │  - 生成     │      └──────────────┘      └──────────────┘       │
│  │  - 审核     │                                                   │
│  └──────────────┘                                                   │
│          │                                                         │
│          │                                                         │
│  ┌──────────────┐      ┌──────────────┐                            │
│  │   用户端     │◀─────│   API       │                            │
│  │   详情页     │      │  /channel   │                            │
│  └──────────────┘      └──────────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Database Schema Changes

### channels 表新增字段

```sql
ALTER TABLE channels ADD COLUMN description_status TEXT DEFAULT 'none';
-- 状态: none, pending, generating, pending_review, published, failed

ALTER TABLE channels ADD COLUMN description_r2_key TEXT;
-- R2 文件路径: descriptions/{channel_hash}.json

ALTER TABLE channels ADD COLUMN description_updated_at DATETIME;
-- 最后更新时间
```

### settings 表新增配置

```sql
INSERT INTO settings (key, value) VALUES ('ai_model_config', '{"provider":"openai","model":"gpt-4o-mini","search_model":"gpt-4o-mini","api_key":""}');
```

## R2 Storage

### 文件路径格式
```
descriptions/{channel_hash}.json
```

### 文件内容
```json
{
  "channel_hash": "abc123",
  "channel_name": "CCTV-1 综合频道",
  "description": "央视综合频道...",
  "source_info": "维基百科 · 央视官网",
  "generated_at": "2026-04-09T10:00:00Z",
  "model_used": "gpt-4o-mini",
  "source": "ai_generated",
  "review_status": "published"
}
```

## AI Generation Flow

```
1. 管理员配置 AI (API Key, 模型)
        │
        ▼
2. 点击「生成」或「仅生成新频道」
        │
        ▼
3. 获取未生成/待生成的频道列表
        │
        ▼
4. 遍历频道，调用 AI:
   a. 搜索频道相关信息 (官方网站/维基百科)
   b. 基于搜索结果生成简介
        │
        ▼
5. 保存到 R2
        │
        ▼
6. 更新 channels.description_status = 'pending_review'
        │
        ▼
7. 管理员审核页面:
   - 查看 AI 生成的详情
   - 编辑修改
   - 点击「发布」
        │
        ▼
8. status = 'published'，用户可见
```

## API Endpoints

### Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/ai-config | 获取 AI 配置 |
| POST | /admin/ai-config | 保存 AI 配置 |
| POST | /admin/ai-config/test | 测试 AI 连接 |
| GET | /admin/channels/pending-descriptions | 获取待审核列表 |
| POST | /admin/channels/generate-descriptions | 触发生成（可指定范围） |
| GET | /admin/channel-description/:hash | 获取详情 |
| POST | /admin/channel-description/:hash | 保存/发布详情 |
| DELETE | /admin/channel-description/:hash | 删除详情 |

### User APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /channel-description/:hash | 获取频道详情（已发布的） |

## Admin UI Components

### 1. AI 配置 Tab

```
┌─────────────────────────────────────────────────────────┐
│  AI 模型配置                                              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │  AI Provider 配置    │  │  模型设置            │       │
│  │                     │  │                     │       │
│  │  服务商: [OpenAI ▼] │  │  生成模型: [gpt-4o] │       │
│  │  API Key: [****]   │  │  搜索模型: [gpt-4o] │       │
│  │                     │  │                     │       │
│  │  [保存配置] [测试]   │  │                     │       │
│  └─────────────────────┘  └─────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 2. 详情生成 Tab

```
┌─────────────────────────────────────────────────────────┐
│  频道详情生成                                    [生成] │
├─────────────────────────────────────────────────────────┤
│  统计: 总 1,247 | 已生成 892 | 待审核 23 | 待生成 332   │
│                                                         │
│  [仅新频道(23)] [全部重新生成] [批量审核]               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📺 CCTV-1 综合  央视        [已生成]            │   │
│  │ 📺 CCTV-2 财经  央视        [待审核]            │   │
│  │ 📺 CCTV-3 综艺  央视        [待审核]            │   │
│  │ 📺 北京卫视     卫视        [已生成]            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3. 详情审核 Panel

```
┌─────────────────────────────────────────────────────────┐
│  详情审核编辑                                            │
├──────────────────────┬──────────────────────────────────┤
│  待审核列表           │  编辑区                           │
│  ┌────────────────┐ │  ┌──────────────────────────────┐│
│  │ ● CCTV-2 财经   │ │  │ 频道名称: [CCTV-2 财经     ] ││
│  │   CCTV-3 综艺   │ │  │                              ││
│  │   东方卫视      │ │  │ 来源: 维基百科 · 央视官网    ││
│  │   浙江卫视      │ │  │                              ││
│  └────────────────┘ │  │ [生成的详情内容...]          ]││
│                      │  │                              ││
│                      │  │ [忽略]              [发布]   ││
│                      │  └──────────────────────────────┘│
└──────────────────────┴──────────────────────────────────┘
```

## User Channel Detail Page

```
┌─────────────────────────────────────────────────────────┐
│                      📺                                 │
│                   CCTV-2 财经                            │
│                      央视                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  频道介绍                                               │
│  ───────────────────────────────────────────────────   │
│  央视财经頻道（CCTV-2）是中國中央電視台的財經資訊頻道，  │
│  以「觀眾至上，內容為王」為理念，全天候滾動播出《經濟     │
│  信息聯播》《第一時間》《交易時間》等重點欄目...          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│    央视    │    24/7    │    🤖 AI 生成               │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
handlers/
  admin.js                    # 新增: ai-config, channel-description APIs
  description-api.js          # 新增: 用户端频道详情 API

database.js                   # 修改: channels 表新增字段

admin-page.js                 # 新增: AI配置Tab, 生成Tab, 审核Panel

worker.js                     # 新增: /channel-description/:hash 路由

utils/
  ai-generator.js             # 新增: AI 生成逻辑

wrangler.toml                 # 修改: 启用 R2 bucket
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| AI API 限流 | 指数退避重试，记录失败项 |
| AI 生成超时 | 标记 status='failed'，允许重试 |
| R2 写入失败 | 返回错误，保留 status='generating' |
| API Key 无效 | 测试时检测并提示 |
