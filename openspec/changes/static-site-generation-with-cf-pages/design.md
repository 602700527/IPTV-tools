## Context

The current architecture renders pages dynamically on each request in Cloudflare Workers. While `seo-handler.js` already generates static HTML, it only serves search engine bots (Googlebot, Bingbot, etc.) detected via User-Agent. Regular users receive a JavaScript-based SPA (`home-page.js`) that fetches channel data client-side.

**Current Flow:**
- Bot request → `isSearchEngineBot()` → `generateSEOHomepage()` → static HTML
- Human request → `HOME_HTML` (JS SPA) → client-side API calls → `getAllChannels()`

**Problem:**
1. Humans don't get pre-rendered HTML, resulting in slower perceived load
2. Every page view hits Workers compute, even for content that never changes
3. Cannot host on Cloudflare Pages (static hosting) - stuck with Workers pricing

**Constraints:**
- Channel data comes from D1 database, synced daily from M3U sources
- Playback URLs must remain dynamic (IP binding per code)
- Subscription M3U files must remain dynamic (user-specific codes)
- Need daily regeneration to capture channel updates

## Goals / Non-Goals

**Goals:**
- Pre-generate static HTML for homepage, all category pages, and all channel detail pages
- Serve static files from Cloudflare Pages for unlimited access (no Workers bandwidth limit)
- Maintain existing dynamic playback (`/live/{code}/{hash}`) and subscription (`/sub/{code}.m3u`) functionality
- Generate static files via CF Worker scheduled cron job (daily at 12:00)
- Support fallback to Workers serving static files if CF Pages not configured

**Non-Goals:**
- Static generation of M3U subscription files (must remain dynamic per user)
- Pre-generating personalized playback URLs (IP binding is inherently dynamic)
- Real-time channel updates (daily regeneration is acceptable per existing sync schedule)
- Modifying the admin dashboard or API endpoints

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
- CLI tool can run via `wrangler d1 execute` or `wrangler pages deploy`
- Avoids complex build-time Worker simulation

**Alternatives Considered:**
- *Build-time Worker simulation*: Would require mocking Cloudflare runtime APIs (env.DB, env.KV) which is complex and brittle
- *Workers-as-build-engine*: Using a separate Worker to generate pages on-demand and cache them adds complexity

### Decision 2: Cloudflare Pages Deployment

**Choice:** Deploy generated static files to Cloudflare Pages using `wrangler pages deploy`

**Rationale:**
- CF Pages provides free static hosting with global edge network
- Instant cache hits for all static assets (HTML, CSS, images)
- Automatic builds can be triggered via GitHub Actions or Wrangler CLI
- Workers can remain dedicated to dynamic APIs only

**Alternatives Considered:**
- *Workers static file serving*: Adding `static-output/` asassets in worker bundle works but doesn't leverage CF Pages edge
- *External CDN*: Would add complexity and cost; CF Pages is native to Cloudflare ecosystem

### Decision 3: Hybrid Routing Architecture (Plan B - CONFIRMED)

**Choice:** 
- **Workers**: `iptv-search.com` — handles `/live/*`, `/sub/*`, `/api/*`
- **Pages**: `www.iptv-search.com` — serves static HTML (`/`, `/category/*`, `/channel/*`)
- Pages uses `_routes.json` to exclude dynamic routes from Pages Functions
- Pages uses Origin Rules to proxy API requests back to Workers

**Domain Configuration:**
| Domain | Service | Handles |
|--------|---------|---------|
| `iptv-search.com` | Workers | `/live/*`, `/sub/*`, `/api/*` |
| `www.iptv-search.com` | Pages | `/`, `/category/*`, `/channel/*` |

**Routing Setup:**
1. Deploy Workers to `iptv-search.com`
2. Deploy Pages to `www.iptv-search.com` via custom domain
3. Configure `_routes.json` in Pages to exclude dynamic routes:
   ```json
   { "version": 1, "include": ["/"], "exclude": ["/live/*", "/sub/*", "/api/*"] }
   ```
4. Create Origin Rule on `www.iptv-search.com` to proxy `/live/*`, `/sub/*`, `/api/*` back to Workers

**Rationale:**
- Clean separation: Pages = static content (unlimited), Workers = dynamic APIs
- Workers dedicated to what must be dynamic (IP binding, user-specific M3U)
- Pages handles SEO-critical content at edge with no bandwidth limits
- Existing subscription URLs (`/sub/{code}.m3u`) work unchanged on Workers

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

### Decision 5: Fallback Static File Serving in Workers

**Choice:** If `STATIC_OUTPUT_DIR` env var points to a local directory, Workers can serve pre-generated HTML files directly

**Rationale:**
- Allows development/testing without deploying to CF Pages
- Provides fallback if CF Pages is not configured
- Keeps single deployment option (Workers) for simpler setups

### Decision 6: Dark/Light Theme Switching

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

### Decision 7: JavaScript-Based Dynamic Translation (i18n)

**Choice:** Keep existing `translate.js` library for automatic page translation

**Existing Implementation:**
- Uses `translate.js` from CDN (`cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js`)
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

### Decision 8: Favorites/Starred Channels System

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

- **[Risk]** Daily regeneration means new channels won't appear for up to 24 hours
  - **Mitigation**: This matches existing sync schedule (acceptable)
  
- **[Risk]** CF Pages deployment could fail silently
  - **Mitigation**: Add deployment verification step; use wrangler's built-in deployment checking

- **[Risk]** Large number of channel pages (10,000+) could slow generation
  - **Mitigation**: Generate in batches; use streaming HTML generation; skip channels without logos

- **[Trade-off]** Two deployment targets (Workers + Pages) vs single target
  - **Accept**: Operational complexity is manageable; benefits (speed, cost) outweigh it

- **[Trade-off]** Channel detail pages increase storage/processing
  - **Accept**: Most channels don't have detail pages today; generation is optional

## Migration Plan

1. **Phase 1: Generator Script**
   - Create `scripts/generate-static-site.js`
   - Refactor `seo-handler.js` to export generation functions
   - Test generation locally, verify output matches current bot experience

2. **Phase 2: Add Channel Detail Pages**
   - Add `generateChannelDetailPage()` function
   - Add route `/channel/{hash}` to `worker.js`
   - Test static generation includes all channels

3. **Phase 3: CF Pages Deployment (Plan B)**
   - Create `wrangler-pages.toml` for Pages project
   - Configure custom domain `www.iptv-search.com`
   - Create `_routes.json` to exclude dynamic routes
   - Create Origin Rules to proxy API routes to Workers
   - Deploy static files via `wrangler pages deploy`

4. **Phase 4: Scheduler Integration**
   - Add static generation to existing cron schedule (daily 12:00)
   - Add Pages deployment step to scheduler
   - Verify scheduled runs succeed

5. **Phase 5: Fallback Mode**
   - Add Workers static file serving
   - Test fallback when Pages unavailable

## Confirmed Decisions

| Item | Decision |
|------|----------|
| Channel count | 8000-10000 channels |
| Generation time | Daily at 12:00 |
| Domain config | Workers: `iptv-search.com`, Pages: `www.iptv-search.com` |
| Build environment | CF Worker scheduled task (not GitHub Actions) |
| Routing | Plan B: Pages excludes routes, Origin Rules proxy to Workers |
| Theme | Dark/light mode with localStorage + system preference |
| Theme default | Dark |
| Translation | translate.js (auto-translation, supports 10+ languages) |
