# IPTV System

## Project Overview

Cloudflare Workers-based live TV streaming service. Provides IPTV channel aggregation, subscription management, payment processing, and an admin dashboard.

## Tech Stack

- **Runtime**: Cloudflare Workers (Node.js 20+ compat)
- **Database**: Cloudflare D1 (SQLite)
- **KV**: Cloudflare KV for caching and sessions
- **ORM**: None — raw SQL via `db.prepare()`
- **Build**: esbuild → single bundled output
- **Testing**: Playwright

## Architecture

```
worker.js          ← main entry, request router
handlers/          ← API endpoint handlers
pages-content/     ← static page HTML templates
utils/             ← shared utilities (search, cache, fingerprint, email)
admin-page.js      ← admin dashboard HTML + JS
```

## Key Domains

- **Channels**: Telegram group scraping, channel list management, source sync
- **Subscriptions**: M3U generation, token-based auth, quota enforcement
- **Users**: Authentication, subscription plans, payment tracking
- **Codes**: Discount/promo codes, batch generation, usage limits
- **Admin**: Source/channel/code management, system config, IP blacklist

## Conventions

- All API responses: `{ success: boolean, data?: any, error?: string }`
- Admin auth: `X-Admin-Key` header matching `ADMIN_KEY` env var
- Channel parse modes: `strict` (default), `flexible`
- Timezone: `Asia/Shanghai` (configurable via `TIMEZONE` env)
- Chinese UI strings throughout
