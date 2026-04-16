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
npx playwright test tests/*.spec.js       # Run specific test file
npx playwright test --ui                  # Interactive UI mode
npx playwright test --grep "keyword"      # Run tests matching keyword
```

## Project Structure

```
cfworker2/
├── worker.js              # Main entry - routes all requests
├── database.js            # D1 schema, migrations, M3U parsing
├── admin-page.js          # Admin dashboard (bundled HTML/JS with inline templates)
├── handlers/              # Request handlers (17+ files)
│   ├── admin.js           # Admin API (sources, channels, codes CRUD)
│   ├── auth.js            # User auth, Google OAuth, sessions
│   ├── live.js            # /live/{code}/{hash} playback
│   ├── sub.js             # /sub/{code}.m3u subscription
│   ├── public.js          # Public APIs (channels, config, play)
│   ├── scheduler.js        # Cron tasks, source sync, cache refresh
│   ├── subscription-api.js # Code generation, PayPal integration
│   ├── freesub-api.js     # Free subscription system
│   ├── mall-api.js        # Payment methods, mall settings
│   ├── seo-handler.js     # SEO static HTML generation (homepage, category, sitemap)
│   ├── ip-play.js         # IP direct play link generation
│   └── ...
├── components/            # Reusable HTML components
│   ├── page-header.js     # SEO page header
│   └── page-footer.js     # SEO page footer
├── utils/
│   ├── cache.js           # Memory + KV caching
│   └── channel-cache.js   # Channel KV cache
├── security/
│   ├── ip-blacklist.js    # IP rate limiting
│   └── code-ban-cache.js  # Code ban tracking
├── tests/                 # Playwright integration tests
├── static-assets.js       # SEO homepage CSS
├── assets.js              # SVG icons (logo, favicon)
└── wrangler.toml          # Workers config, KV namespaces, D1 bindings
```

## Code Style Guidelines

### Formatting

- **2 spaces** indentation, no tabs
- **No trailing semicolons**
- **Single quotes** for strings, template literals for interpolation
- **Line length**: \~100 chars max
- **Blank lines**: Single blank line between logical sections

### Naming Conventions

| Type                | Convention             | Example                               |
| ------------------- | ---------------------- | ------------------------------------- |
| Variables/functions | camelCase              | `getUserInfo()`, `adminKey`           |
| Constants           | SCREAMING\_SNAKE\_CASE | `CACHE_TTL`, `MAX_FAILED_ATTEMPTS`    |
| Classes             | PascalCase             | `UserAccount`                         |
| URLs/headers        | kebab-case             | `/api/auth/login`, `X-Admin-Key`      |
| Database tables     | snake\_case            | `user_orders`, `play_counts`          |
| File names          | kebab-case             | `ip-blacklist.js`, `channel-cache.js` |

### Import Patterns

```javascript
// Named imports for clarity (preferred)
import { getDB, createTables } from './database.js';
import { handleAdminRequest } from './handlers/admin.js';

// Multiple imports from same module (aligned)
import { 
  handleRegister,
  handleSendVerificationCode,
  handleVerifyEmail 
} from './handlers/auth.js';

// Default export from main worker
import Worker from './worker.js';
```

### HTML/Template Escaping

```javascript
// Admin-page.js uses inline escapeHtml (defined in file):
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
```

### Response Format

```javascript
// JSON success response
return new Response(JSON.stringify({ success: true, data: result }), {
  headers: { 'Content-Type': 'application/json' }
});

// JSON error response
return new Response(JSON.stringify({ success: false, error: 'Human-readable message' }), {
  status: 400,
  headers: { 'Content-Type': 'application/json' }
});

// HTML response
return new Response(htmlContent, {
  headers: { 'Content-Type': 'text/html; charset=utf-8' }
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

| File                      | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `worker.js`               | Router, request dispatch, main entry                  |
| `database.js`             | Schema, migrations, M3U parser, security config       |
| `handlers/admin.js`       | Admin CRUD operations                                 |
| `handlers/public.js`      | Public APIs, channel lists, play links                |
| `handlers/live.js`        | Playback URL generation with caching                  |
| `handlers/sub.js`         | M3U subscription generation                           |
| `handlers/seo-handler.js` | SEO static HTML (homepage, category, sitemap)         |
| `wrangler.toml`           | Workers config, KV namespaces, D1 bindings            |
| `playwright.config.js`    | Test configuration (baseURL: <http://localhost:8787>) |

## Environment Variables (wrangler.toml)

```toml
ADMIN_KEY = "admin-key-please-change-in-production"
TIMEZONE = "Asia/Shanghai"
APP_URL = "https://your-domain.com"
DB = "tv-service-db"        # D1 binding name
```

## Database Schema (Key Tables)

| Table                | Key Columns                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| `sources`            | `id`, `name`, `url`, `parse_mode`, `is_active`, `last_updated`                        |
| `channels`           | `id`, `source_id`, `channel_name`, `play_url`, `channel_hash`, `headers`, `is_active` |
| `codes`              | `code`, `status`, `duration_days`, `expired_at`, `max_ips`, `banned_until`            |
| `users`              | `id`, `email`, `password_hash`, `is_verified`                                         |
| `user_orders`        | `id`, `user_id`, `order_id`, `code`, `duration_days`                                  |
| `free_subscriptions` | `sub_id`, `ip`, `fingerprint`, `expired_at`                                           |

**Important indexes**: `idx_channel_hash` on channels, `idx_code_status` on codes

## Testing Notes

- Playwright config: `playwright.config.js` (baseURL: <http://localhost:8787>)
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

<br />

## 开发准则

- 先想清楚再动手 — 不假设、不隐藏困惑，遇到不确定先问
- 简单性优先 — 能50行解决就不用200行，不加没被要求的功能
- 精准修改 — 只改该改的，不顺手重构
- 目标驱动 — 把"修好它"翻译成"写测试→让测试通过"

