# AGENTS.md

Cloudflare Workers TV streaming service. Build/lint/test commands and code conventions for agentic development.

## Build & Development Commands

```bash
# Development
npm run dev          # Start wrangler dev server (localhost:8787)
npm run deploy       # Deploy to production (wrangler deploy)

# Database
npm run init-db      # Initialize D1 database (wrangler d1 execute --file=./schema.sql)
npm run db:console   # Interactive D1 query console

# Testing (Playwright)
npx playwright test                    # Run all tests
npx playwright test tests/*.spec.js    # Run specific test file
npx playwright test --ui               # Interactive UI mode
npx playwright test --grep "keyword"  # Run tests matching keyword

# Testing via curl (with wrangler dev running)
curl http://localhost:8787/api/config                              # Public API
curl http://localhost:8787/api/channels                            # Channels API
curl -H "X-Admin-Key: admin-key-please-change-in-production" \
  http://localhost:8787/admin/sources                              # Admin API
curl http://localhost:8787/test/force-scheduled                    # Force scheduled tasks
```

## Project Structure

```
cfworker2/
├── worker.js              # Main entry - routes all requests
├── database.js            # D1 schema, migrations, M3U parsing
├── admin-page.js          # Admin dashboard (HTML/JS bundled)
├── handlers/              # Request handlers
│   ├── admin.js          # Admin API (sources, channels, codes)
│   ├── auth.js           # User auth, Google OAuth, sessions
│   ├── live.js           # /live/{code}/{hash} playback
│   ├── sub.js            # /sub/{code}.m3u subscription
│   ├── public.js         # Public APIs (channels, config)
│   ├── scheduler.js      # Cron tasks (sync, cache refresh)
│   ├── subscription-api.js # Code generation, PayPal
│   ├── freesub-api.js    # Free subscription system
│   ├── mall-api.js       # Payment methods, mall settings
│   └── ...
├── utils/                # Utilities
│   ├── cache.js          # Memory + KV caching
│   └── channel-cache.js  # Channel KV cache
├── security/             # Security middleware
│   ├── ip-blacklist.js   # IP rate limiting
│   └── code-ban-cache.js # Code ban tracking
├── migrations/          # SQL schema files
└── tests/               # Playwright tests
```

## Code Style Guidelines

### Formatting
- **2 spaces** indentation, no tabs
- **No trailing semicolons**
- **Single quotes** for strings, template literals for interpolation
- **Line length**: ~100 chars max

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Variables/functions | camelCase | `getUserInfo()`, `adminKey` |
| Constants | SCREAMING_SNAKE_CASE | `CACHE_TTL`, `MAX_FAILED_ATTEMPTS` |
| Classes | PascalCase | `UserAccount` |
| URLs/headers | kebab-case | `/api/auth/login`, `X-Admin-Key` |

### Import Patterns
```javascript
// Named imports for clarity
import { getDB, createTables } from './database.js';
import { handleAdminRequest } from './handlers/admin.js';

// Default export from main file
import Worker from './worker.js';
```

### Response Format
```javascript
// Success
return new Response(JSON.stringify({ success: true, data: result }), {
  headers: { 'Content-Type': 'application/json' }
});

// Error
return new Response(JSON.stringify({ success: false, error: 'Message' }), {
  status: 400,
  headers: { 'Content-Type': 'application/json' }
});
```

### Database Operations
- **Always use prepared statements**: `db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()`
- **Batch for bulk inserts**: `db.batch([...])` (500 records per batch)
- **Use transactions** for multi-step operations

### Error Handling
```javascript
try {
  const result = await db.prepare('SELECT...').bind(...).first();
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

### Async/Await
- Use `await` for all database operations
- Use `Promise.all()` for parallel independent operations
- Use `ctx.waitUntil()` for non-blocking background tasks

## Environment Variables

```bash
ADMIN_KEY="admin-key-please-change-in-production"
DB="tv-service-db"           # D1 binding name
TIMEZONE="Asia/Shanghai"
APP_URL="https://your-domain.com"
```

## Key Files for Reference

| File | Purpose |
|------|---------|
| `worker.js` | Router, request dispatch |
| `database.js` | Schema, migrations, M3U parser |
| `handlers/admin.js` | Admin CRUD operations |
| `handlers/live.js` | Playback URL generation |
| `handlers/sub.js` | M3U subscription generation |
| `wrangler.toml` | Workers config, KV namespaces, D1 bindings |

## Database Schema (Key Tables)

- **sources**: M3U feed sources (`id`, `name`, `url`, `parse_mode`, `is_active`)
- **channels**: TV channels (`id`, `source_id`, `channel_name`, `play_url`, `channel_hash`)
- **codes**: Activation codes (`code`, `status`, `duration_days`, `expired_at`, `max_ips`)
- **users**: User accounts (`id`, `email`, `password_hash`, `is_verified`)
- **user_orders**: Purchase history (`id`, `user_id`, `order_id`, `code`, `duration_days`)
- **free_subscriptions**: Free sub IDs (`sub_id`, `ip`, `fingerprint`, `expired_at`)

## Testing Notes

- Playwright config: `playwright.config.js` (baseURL: http://localhost:8787)
- Tests run against local dev server (`npm run dev`)
- Manual API testing via curl (see commands above)
- No unit test framework - integration testing only
