# Channel Description AI - Tasks

## Implementation Status

### Phase 1: Database & Infrastructure

- [ ] Enable R2 bucket in wrangler.toml
- [ ] Add `description_status` field to channels table
- [ ] Add `description_r2_key` field to channels table
- [ ] Add `description_updated_at` field to channels table
- [ ] Add `ai_model_config` to settings table

### Phase 2: Backend APIs

- [ ] Create `/admin/ai-config` GET handler
- [ ] Create `/admin/ai-config` POST handler
- [ ] Create `/admin/ai-config/test` handler
- [ ] Create `/admin/channels/pending-descriptions` handler
- [ ] Create `/admin/channels/generate-descriptions` handler
- [ ] Create `/admin/channel-description/:hash` GET handler
- [ ] Create `/admin/channel-description/:hash` POST handler
- [ ] Create `/admin/channel-description/:hash` DELETE handler
- [ ] Create `/channel-description/:hash` public GET handler

### Phase 3: AI Generation Logic

- [ ] Create `utils/ai-generator.js`
- [ ] Implement AI API client (OpenAI compatible)
- [ ] Implement web search for channel info
- [ ] Implement description generation prompt
- [ ] Implement R2 file save/read
- [ ] Implement batch processing with rate limiting

### Phase 4: Admin UI

- [ ] Add AI Configuration Tab to admin
- [ ] Add Description Generation Tab to admin
- [ ] Add Description Review Panel to admin
- [ ] Connect generate button to API
- [ ] Connect publish button to API

### Phase 5: User UI

- [ ] Add channel detail link to channel list
- [ ] Create channel detail modal/page
- [ ] Display description content
- [ ] Handle loading states
- [ ] Handle empty description states

### Phase 6: Testing & Integration

- [ ] Test AI config save/load
- [ ] Test description generation
- [ ] Test R2 storage
- [ ] Test admin review workflow
- [ ] Test user detail page
- [ ] Test error handling

## Technical Notes

### R2 Operations
```javascript
// Save
await env.R2_BUCKET.put('descriptions/abc123.json', JSON.stringify(data));

// Read
const obj = await env.R2_BUCKET.get('descriptions/abc123.json');
const data = await obj.json();
```

### AI API Call (OpenAI compatible)
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate description for: ${channelName}` }
    ]
  })
});
```

### Status Transitions
```
none → pending → generating → pending_review → published
                              ↓
                           failed (can retry)
```
