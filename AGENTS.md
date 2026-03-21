# AGENTS.md

Cloudflare Workers TV streaming service. Build/lint/test commands and code conventions for agentic development.

## Build & Development Commands

```bash
# Development
npm run dev          # Start wrangler dev server (localhost:8787)
npm run deploy       # Deploy to production (wrangler deploy)
npm run tail         # Live tailing of production logs

# Database
npm run init-db      # Initialize D1 database (wrangler d1 execute --file=./schema.sql)
npm run db:console   # Interactive D1 query console (wrangler d1 execute tv-service-db --command "SQL")

# Testing
npx playwright test                        # Run all tests
npx playwright test tests/*.spec.js        # Run specific test file
npx playwright test --ui                   # Interactive UI mode
npx playwright test --grep "keyword"       # Run tests matching keyword

# Manual API Testing (with wrangler dev running)
curl http://localhost:8787/api/config                              # Public config API
curl http://localhost:8787/api/channels                            # Channels API
curl -H "X-Admin-Key: admin-key-please-change-in-production" \
  http://localhost:8787/admin/sources                              # Admin API
curl http://localhost:8787/test/force-scheduled                    # Force run scheduled tasks
```

## Project Structure

```
cfworker2/
├── worker.js              # Main entry - routes all requests
├── database.js            # D1 schema, migrations, M3U parsing
├── admin-page.js          # Admin dashboard (bundled HTML/JS)
├── handlers/              # Request handlers (17 files)
│   ├── admin.js          # Admin API (sources, channels, codes)
│   ├── auth.js           # User auth, Google OAuth, sessions
│   ├── live.js           # /live/{code}/{hash} playback
│   ├── sub.js            # /sub/{code}.m3u subscription
│   ├── public.js         # Public APIs (channels, config)
│   ├── scheduler.js      # Cron tasks (sync, cache refresh)
│   ├── subscription-api.js # Code generation, PayPal
│   ├── freesub-api.js   # Free subscription system
│   ├── mall-api.js       # Payment methods, mall settings
│   └── ...              # 17 handlers total
├── utils/
│   ├── cache.js          # Memory + KV caching
│   └── channel-cache.js  # Channel KV cache
├── security/
│   ├── ip-blacklist.js   # IP rate limiting
│   └── code-ban-cache.js # Code ban tracking
├── migrations/            # SQL schema files
├── tests/                # Playwright integration tests
└── wrangler.toml         # Workers config, KV namespaces, D1 bindings
```

## Code Style Guidelines

### Formatting
- **2 spaces** indentation, no tabs
- **No trailing semicolons**
- **Single quotes** for strings, template literals for interpolation
- **Line length**: ~100 chars max
- **Blank lines**: Single blank line between logical sections

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Variables/functions | camelCase | `getUserInfo()`, `adminKey` |
| Constants | SCREAMING_SNAKE_CASE | `CACHE_TTL`, `MAX_FAILED_ATTEMPTS` |
| Classes | PascalCase | `UserAccount` |
| URLs/headers | kebab-case | `/api/auth/login`, `X-Admin-Key` |
| Database tables | snake_case | `user_orders`, `play_counts` |
| File names | kebab-case | `ip-blacklist.js`, `channel-cache.js` |

### Import Patterns
```javascript
// Named imports for clarity (preferred)
import { getDB, createTables } from './database.js';
import { handleAdminRequest } from './handlers/admin.js';

// Default export from main worker
import Worker from './worker.js';

// Multiple imports from same module
import { 
  handleGetPaymentMethods,
  handleUpdatePaymentMethod 
} from './mall-api.js';
```

### Response Format
```javascript
// Success response
return new Response(JSON.stringify({ success: true, data: result }), {
  headers: { 'Content-Type': 'application/json' }
});

// Error response
return new Response(JSON.stringify({ success: false, error: 'Human-readable message' }), {
  status: 400,
  headers: { 'Content-Type': 'application/json' }
});

// HTML response
return new Response(htmlContent, {
  headers: { 'Content-Type': 'text/html' }
});
```

### Database Operations
```javascript
// Always use prepared statements with parameterized queries
const result = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

// Batch for bulk inserts (500 records per batch)
const batch = records.map(r => db.prepare('INSERT INTO channels ...').bind(...));
await db.batch(batch);

// Use transactions for multi-step operations
await db.exec('BEGIN TRANSACTION');
try {
  // operations
  await db.exec('COMMIT');
} catch (e) {
  await db.exec('ROLLBACK');
}
```

### Error Handling
```javascript
try {
  const result = await db.prepare('SELECT...').bind(...).first();
  if (!result) {
    return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404 });
  }
  return Response.json({ success: true, data: result });
} catch (error) {
  console.error('[Handler] Operation failed:', error.message);
  return Response.json({ success: false, error: 'Human-readable message' }, { status: 500 });
}
```

### Security
- Admin key validation: `request.headers.get('X-Admin-Key') !== env.ADMIN_KEY`
- Always use parameterized queries (prevents SQL injection)
- Never expose internal errors to clients
- Sanitize user inputs before database operations
- Use `ctx.waitUntil()` for async cleanup tasks

### Async/Await
- Use `await` for all database and async operations
- Use `Promise.all()` for parallel independent operations
- Use `ctx.waitUntil()` for non-blocking background tasks

## Key Files Reference

| File | Purpose |
|------|---------|
| `worker.js` | Router, request dispatch, main entry |
| `database.js` | Schema, migrations, M3U parser, security config |
| `handlers/admin.js` | Admin CRUD operations (2342 lines) |
| `handlers/live.js` | Playback URL generation with caching |
| `handlers/sub.js` | M3U subscription generation |
| `handlers/scheduler.js` | Cron tasks, source sync, cache refresh |
| `wrangler.toml` | Workers config, KV namespaces, D1 bindings |
| `playwright.config.js` | Test configuration (baseURL: http://localhost:8787) |

## Environment Variables (wrangler.toml)

```toml
ADMIN_KEY = "admin-key-please-change-in-production"
TIMEZONE = "Asia/Shanghai"
APP_URL = "https://your-domain.com"
DB = "tv-service-db"        # D1 binding name
```

## Database Schema (Key Tables)

| Table | Key Columns |
|-------|-------------|
| `sources` | `id`, `name`, `url`, `parse_mode`, `is_active`, `last_updated` |
| `channels` | `id`, `source_id`, `channel_name`, `play_url`, `channel_hash`, `headers`, `is_active` |
| `codes` | `code`, `status`, `duration_days`, `expired_at`, `max_ips`, `banned_until` |
| `users` | `id`, `email`, `password_hash`, `is_verified` |
| `user_orders` | `id`, `user_id`, `order_id`, `code`, `duration_days` |
| `free_subscriptions` | `sub_id`, `ip`, `fingerprint`, `expired_at` |

**Important indexes**: `idx_channel_hash` on channels, `idx_code_status` on codes

## Testing Notes

- Playwright config: `playwright.config.js` (baseURL: http://localhost:8787)
- Tests run against local dev server (`npm run dev`)
- Manual API testing via curl (requires wrangler dev running)
- Integration testing only - no unit test framework
- Test file pattern: `tests/*.spec.js`

## M3U Parsing

The parser supports multiple M3U formats:
- Standard: `#EXTINF:-1 group-title="央视" tvg-logo="..." ,CCTV-1`
- With headers: `#EXTINF:-1 http-user-agent="..." referer="..." ,Name`
- VLC options: `#EXTVLCOPT:http-user-agent=Mozilla/5.0`
- Global headers in `#EXTM3U` line

Channel hash is SHA-256 of play URL, first 8 characters.
