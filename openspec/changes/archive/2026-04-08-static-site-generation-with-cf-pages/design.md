## Context

The current architecture renders pages dynamically on each request in Cloudflare Workers. While `seo-handler.js` already generates static HTML, it only serves search engine bots (Googlebot, Bingbot, etc.) detected via User-Agent. Regular users receive a JavaScript-based SPA (`home-page.js`) that fetches channel data client-side.

**Current Flow:**
- Bot request → `isSearchEngineBot()` → `generateSEOHomepage()` → static HTML
- Human request → `HOME_HTML` (JS SPA) → client-side API calls → `getAllChannels()`

**Problem:**
1. Humans don't get pre-rendered HTML, resulting in slower perceived load
2. Every page view hits Workers compute, even for content that never changes
3. SPA approach requires client-side API calls for channel data

**Constraints:**
- Channel data comes from D1 database, synced daily from M3U sources
- Playback URLs must remain dynamic (IP binding per code)
- Subscription M3U files must remain dynamic (user-specific codes)
- Need daily regeneration to capture channel updates

## Goals / Non-Goals

**Goals:**
- Pre-generate static HTML for homepage, all category pages, and all channel detail pages
- Serve static files from Workers for instant page loads
- Maintain existing dynamic playback (`/live/{code}/{hash}`) and subscription (`/sub/{code}.m3u`) functionality
- Generate static files via CF Worker scheduled cron job (daily at 3:00 AM)
- Support R2 bucket for static file storage (optional enhancement)

**Non-Goals:**
- Static generation of M3U subscription files (must remain dynamic per user)
- Pre-generating personalized playback URLs (IP binding is inherently dynamic)
- Real-time channel updates (daily regeneration is acceptable per existing sync schedule)
- Modifying the admin dashboard or API endpoints
- Cloudflare Pages deployment (abandoned)

## Decisions

### Decision 1: Generate Static HTML via Dedicated Generator Script

**Choice:** Create `scripts/generate-static-site.js` as a Node.js CLI tool that:
1. Connects to D1 using `@cloudflare/workers-types` and `wrangler`
2. Reads all channels and groups from the database
3. Generates HTML files using the existing `generateSEOHomepage()` and `generateCategoryPage()` patterns
4. Outputs to `static-output/` directory

**Rationale:**
- Existing `seo-handler.js` already has the HTML generation logic
- Refactoring into a reusable generator allows both Workers runtime and CLI use
- CLI tool can run via cron or manual trigger

**Alternatives Considered:**
- *Build-time Worker simulation*: Would require mocking Cloudflare runtime APIs (env.DB, env.KV) which is complex and brittle
- *Workers-as-build-engine*: Using a separate Worker to generate pages on-demand and cache them adds complexity

### Decision 2: Workers Static File Serving with Environment Detection

**Choice:** Workers serves pre-generated HTML files with intelligent environment detection

**Environment Detection:**
- `STATIC_SOURCE` environment variable: `"local"` or `"r2"`
- Local dev (`npm run dev`): Reads from `static-output/` directory
- Production (`wrangler deploy`): Reads from R2 bucket

**Storage Interface:**
```javascript
// Unified static file reading interface
async function serveStaticFile(path, env) {
  const source = env.STATIC_SOURCE || 'local';

  if (source === 'r2' && env.R2_BUCKET) {
    // Production: Read from R2
    const object = await env.R2_BUCKET.get(path);
    if (object) return new Response(object.body, { headers: getMimeType(path) });
  } else {
    // Local dev: Read from local filesystem via static-output/
    // Workers serves from the built-in static assets or internal fetch
  }

  return null; // Fallback to dynamic handler
}
```

**Wrangler Configuration:**
```toml
# wrangler.toml - Base config (local development)
[vars]
STATIC_SOURCE = "local"
STATIC_OUTPUT_DIR = "static-output"

# wrangler.toml - Production env (use --env production)
[env.production.vars]
STATIC_SOURCE = "r2"

[[env.production.r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "iptv-static-files"
```

**Rationale:**
- Single codebase handles both environments
- Local dev: Fast iteration, no cloud costs
- Production: R2 ensures multi-instance consistency
- No code changes needed between environments

**Alternatives Considered:**
- *Cloudflare Pages*: Abandoned - adds complexity without sufficient benefit
- *KV storage*: Free tier insufficient (10,000 ops/day limit)

### Decision 3: Static File Routing Architecture

**Choice:** 
- **Workers**: `iptv-search.com` — serves static HTML (`/`, `/category/*`, `/channel/*`) AND handles dynamic APIs (`/live/*`, `/sub/*`, `/api/*`)

**Routing Setup:**
1. Check if request path matches pre-generated static file
2. If yes, serve static file directly
3. If no, fall through to dynamic handlers

**Rationale:**
- Single deployment target simplifies operations
- Static files served with edge caching
- Dynamic APIs remain fully functional

### Decision 4: Add Channel Detail Page Generation

**Choice:** Create `generateChannelDetailPage()` function in `seo-handler.js` and generate a static page for each channel hash

**Rationale:**
- Users want to see channel info before playing
- SEO benefit: each channel gets its own indexed page
- Existing pattern in `generateCategoryPage()` provides template

**Implementation:**
- Route: `/channel/{hash}`
- Shows: channel name, logo, group, source, M3U copy button
- Links to: play page (via `/live/{code}/{hash}` or `/sub/{code}.m3u`)

### Decision 5: Dark/Light Theme Switching

**Choice:** Implement CSS variable-based theming with localStorage persistence and system preference detection

**Theme Detection Priority:**
1. User's localStorage preference (`theme` key: `'dark'` or `'light'`)
2. System `prefers-color-scheme` media query
3. Default to `'dark'` if no preference set

**Implementation:**
- CSS variables for all colors (background, text, accent, borders)
- JavaScript snippet in `<head>` to prevent flash of wrong theme
- Theme toggle button in header (☀️/🌙 icons)
- Each static page embeds the current theme CSS (no runtime switch needed for static pages)

**Static Page Theme Handling:**
- During generation, pages are pre-generated with **both** dark and light CSS
- A small inline `<script>` at top of `<body>` switches theme before paint
- This ensures no flash and instant correct theme on load

**Rationale:**
- Users can manually switch and preference persists
- System preference detection provides sensible defaults
- No backend state needed - pure client-side

### Decision 6: JavaScript-Based Dynamic Translation (i18n)

**Choice:** Use `translate.js` library for automatic page translation

**CDN URL:**
```
https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js
```

**Features:**
- Automatic language detection based on browser locale
- Manual language switching via `translate.changeLanguage(lang)`
- Language selector in header (built-in translate.js language menu)
- Uses client-side edge translation service

**Static Page Translation Handling:**
- Include `translate.js` script in all static HTML pages
- Call `translate.execute()` on page load to auto-translate
- `changeLanguage(lang)` function available for manual switching
- Language preference stored via translate.js built-in localStorage

**Supported Languages:**
- translate.js automatically supports 10+ languages via edge translation
- Includes: English, 简体中文, 繁體中文, 日本語, 한국어, Español, Français, Deutsch, etc.
- Auto-detects browser language without configuration

**Rationale:**
- Existing users are familiar with the translation system
- No language JSON files needed - library handles everything
- Pure client-side solution, no backend changes needed

### Decision 7: Favorites/Starred Channels System

**Choice:** Implement client-side favorites system using localStorage with star button on all channel cards

**Data Storage:**
- Favorites stored in localStorage as JSON array of channel objects
- Key: `iptv_favorites`
- Value: `[{ channel_hash, channel_name, logo, group_title, play_url, ... }, ...]`

**Star Button Interaction:**
- Every channel card (homepage, category, channel detail) has a star icon button
- Click toggles star state: empty star (not starred) ↔ filled star (starred)
- Star state persists immediately to localStorage
- Starred channels available across all pages via shared localStorage

**Favorites Page (`/favorites`):**
- Static page showing all starred channels in grid layout
- Header action button: "Download M3U" to export all starred channels
- Empty state: "No favorites yet" with CTA to browse channels
- Syncs with localStorage on every visit

**M3U Download:**
- Click "Download M3U" generates M3U file with all starred channels
- Filename: `iptv-favorites-{date}.m3u`
- Uses play_url from stored channel data
- Triggers browser download

**Cross-Page Synchronization:**
- localStorage is shared across same-origin pages
- Star state updated in real-time via localStorage event listeners
- No page refresh needed to see updated star states

**Rationale:**
- No backend changes needed (fully client-side)
- Works offline with cached channel data
- Instant feedback without server round-trips
- Users control their own data (privacy-friendly)

### Decision 8: Delete Old Dynamic JS Rendering Code

**Choice:** Remove the old SPA/JS-based dynamic rendering entirely

**Files/Code to Delete:**
| File/Code | Description |
|-----------|-------------|
| `home-page.js` (or similar) | Frontend JS rendering for dynamic homepage |
| `HOME_HTML` constant | JS SPA HTML template in handler |
| Dynamic homepage route logic | Simplify to static file serving |
| Client-side `getAllChannels()` calls | No longer needed on homepage |

**Routing After Deletion:**
```
GET /           → Static HTML (index.html)
GET /category/* → Static HTML (category/{slug}.html)
GET /channel/*  → Static HTML (channel/{hash}.html)
GET /favorites  → Static HTML (favorites.html)
GET /login      → Static HTML (login.html)
GET /account    → Dynamic (checks auth state) or Static
GET /live/*     → Dynamic (playback, IP binding)
GET /sub/*      → Dynamic (subscription M3U)
GET /api/*      → Dynamic (APIs)
```

**Rationale:**
- Eliminates dual code paths (dynamic + static)
- Reduces maintenance burden
- Faster page loads (no JS download + execute)
- SEO already covered by static HTML

### Decision 9: Batch Generation Strategy

**Choice:** Generate static files in small batches to avoid memory issues

**Batch Sizes:**
| Type | Batch Size | Rationale |
|------|------------|-----------|
| Homepage | 1 (single file) | Always one |
| Category pages | 100 per batch | ~100 categories typical |
| Channel pages | 500 per batch | Avoids Workers memory limits |
| Sitemap | 1 (single file) | Aggregated at end |

**Generation Order:**
```
1. Homepage (index.html)
2. Category listing (category/index.html)
3. Category pages (category/{slug}.html) - 100/batch
4. Channel listing (channel/index.html)
5. Channel pages (channel/{hash}.html) - 500/batch
6. Special pages (favorites.html, login.html, etc.)
7. sitemap.xml, robots.txt
```

**Progress Tracking:**
- Log current batch number and total
- Log generated files count
- Log any errors per batch (don't fail entire run)

## Risks & Mitigations

- **[Risk]** Daily regeneration means new channels won't appear for up to 24 hours
  - **Mitigation**: This matches existing sync schedule (acceptable)

- **[Risk]** Large number of channel pages (10,000+) could exceed Workers memory
  - **Mitigation**: Batch generation (500/batch), streaming output

- **[Risk]** Static file serving increases Workers bandwidth usage
  - **Mitigation**: Use Cache API for static files; R2 for production

- **[Risk]** Environment misconfiguration causes wrong storage access
  - **Mitigation**: `STATIC_SOURCE` env var must be set correctly; fallback to local

## Migration Plan

1. **Phase 1: Generator Script**
   - Create `scripts/generate-static-site.js`
   - Refactor `seo-handler.js` to export generation functions
   - Test generation locally, verify output matches current bot experience
   - Implement batch generation (500 channels/batch)

2. **Phase 2: Add Channel Detail Pages**
   - Add `generateChannelDetailPage()` function
   - Add route `/channel/{hash}` to `worker.js`
   - Test static generation includes all channels

3. **Phase 3: Workers Static File Serving**
   - Add environment-aware static file reading in `worker.js`
   - Configure `STATIC_SOURCE` and `STATIC_OUTPUT_DIR` in `wrangler.toml`
   - Test serving pre-generated HTML files locally
   - Add R2 configuration for production

4. **Phase 4: Delete Old Dynamic Rendering Code**
   - Remove `home-page.js` or equivalent SPA code
   - Remove `HOME_HTML` constant from handlers
   - Remove dynamic homepage route logic
   - Verify homepage now serves static HTML

5. **Phase 5: Scheduler Integration**
   - Add static generation to existing cron schedule (daily 3:00 AM)
   - Verify scheduled runs succeed

5b. **Phase 5b: Generate Special Pages**
   - Generate favorites.html, login.html, account.html
   - Generate legal pages (privacy-policy.html, terms.html)
   - Generate tutorial.html

6. **Phase 6: Admin UI (Optional)**
   - Add button in Admin to trigger static generation
   - Add progress tracking API

7. **Phase 7: R2 Production Deployment**
   - Configure R2 bucket for static file storage
   - Upload generated files to R2 in production
   - Verify R2 reading works in production

## Confirmed Decisions

| Item | Decision |
|------|----------|
| Channel count | 8000-10000 channels |
| Generation time | Daily at 3:00 AM |
| Domain config | Single Workers deployment at `iptv-search.com` |
| Static file serving | Environment-aware: local (`static-output/`) or R2 |
| Theme | Dark/light mode with localStorage + system preference |
| Theme default | Dark |
| Translation | translate.js from `cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js` |
| i18n approach | Client-side auto-translation via translate.js |
| Local dev storage | `static-output/` directory |
| Production storage | R2 bucket `iptv-static-files` |
| Environment detection | `STATIC_SOURCE` env var: `"local"` or `"r2"` |
| Batch size (channels) | 500 per batch |
| Batch size (categories) | 100 per batch |
| Old JS rendering | DELETE - replaced by static HTML |
