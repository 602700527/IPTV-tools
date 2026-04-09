# Channel Description AI Generation Specification

## Overview

AI-powered generation of channel descriptions with configurable models, web search for reliable sources, and admin review workflow.

## AI Configuration

### GET /admin/ai-config

Get AI configuration.

**Response:**
```json
{
  "success": true,
  "config": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "search_model": "gpt-4o-mini",
    "api_key_set": true
  }
}
```

### POST /admin/ai-config

Save AI configuration.

**Request:**
```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "search_model": "gpt-4o-mini",
  "api_key": "sk-xxxxx"
}
```

### POST /admin/ai-config/test

Test AI connection.

**Response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "model": "gpt-4o-mini"
}
```

## Description Generation

### POST /admin/channels/generate-descriptions

Trigger description generation.

**Request:**
```json
{
  "scope": "pending" | "all",
  "source_ids": [1, 2, 3]  // optional, filter by source
}
```

**Response:**
```json
{
  "success": true,
  "message": "Generation started",
  "total_channels": 23,
  "estimated_time": "5 minutes"
}
```

### GET /admin/channels/pending-descriptions

Get channels pending review.

**Response:**
```json
{
  "success": true,
  "channels": [
    {
      "id": 1,
      "channel_name": "CCTV-2 财经",
      "group_title": "央视",
      "channel_hash": "abc123",
      "description_status": "pending_review",
      "description_r2_key": "descriptions/abc123.json"
    }
  ]
}
```

### GET /admin/channel-description/:hash

Get description detail for review.

**Response:**
```json
{
  "success": true,
  "channel": {
    "id": 1,
    "channel_name": "CCTV-2 财经",
    "group_title": "央视",
    "channel_hash": "abc123",
    "logo": "https://..."
  },
  "description": {
    "content": "生成的详情内容...",
    "source_info": "维基百科 · 央视官网",
    "generated_at": "2026-04-09T10:00:00Z",
    "model_used": "gpt-4o-mini",
    "review_status": "pending_review"
  }
}
```

### POST /admin/channel-description/:hash

Save/update description (publish).

**Request:**
```json
{
  "content": "编辑后的详情内容...",
  "action": "publish" | "save"
}
```

### DELETE /admin/channel-description/:hash

Delete description.

**Response:**
```json
{
  "success": true,
  "message": "Description deleted"
}
```

## Generation Status Values

| Status | Description |
|--------|-------------|
| `none` | No description generated |
| `pending` | Queued for generation |
| `generating` | Currently generating |
| `pending_review` | Generated, awaiting admin review |
| `published` | Approved and visible to users |
| `failed` | Generation failed |

## AI Generation Prompt Strategy

### Step 1: Information Search
Use web search to gather information about the channel from:
- Official website
- Wikipedia
- Recent news

### Step 2: Description Generation
System prompt template:
```
You are an expert media content analyst. Generate concise, engaging 
descriptions for TV channels.

Rules:
- Lead with what makes this channel unique or noteworthy
- Include relevant genres, themes, and target audience
- Keep descriptions 100-200 characters
- Avoid speculative information
- Use consistent format: "[Hook] This [type] features [content]. 
  Ideal for [audience]."
- Always cite your information source
```

### Step 3: Output Format
```json
{
  "description": "...",
  "source_info": "Wikipedia · Official website",
  "model_used": "gpt-4o-mini"
}
```

## R2 File Storage

### File Path
```
descriptions/{channel_hash}.json
```

### File Content
```json
{
  "channel_hash": "abc123",
  "channel_name": "CCTV-2 财经",
  "description": "...",
  "source_info": "...",
  "generated_at": "2026-04-09T10:00:00Z",
  "model_used": "gpt-4o-mini",
  "source": "ai_generated",
  "review_status": "published"
}
```
