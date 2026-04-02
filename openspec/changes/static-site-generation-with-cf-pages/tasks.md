## 1. Refactor HTML Generation for Reusability

- [ ] 1.1 Extract `generateSEOHomepage()` into a separate exportable function in `handlers/seo-handler.js`
- [ ] 1.2 Extract `generateCategoryPage()` into a separate exportable function
- [ ] 1.3 Create new `generateChannelDetailPage()` function in `handlers/seo-handler.js`
- [ ] 1.4 Create shared HTML template utilities module (`utils/html-templates.js`) for escape functions and slugify
- [ ] 1.5 Verify all extracted functions work correctly in both Workers runtime and CLI context

## 1b. Implement Dark/Light Theme System

- [ ] 1b.1 Define CSS variables for dark theme (background, text, accent, borders)
- [ ] 1b.2 Define CSS variables for light theme (background, text, accent, borders)
- [ ] 1b.3 Add theme detection script in `<head>` to prevent flash (read localStorage, fallback to system)
- [ ] 1b.4 Add theme toggle button in header HTML template
- [ ] 1b.5 Implement inline theme switcher script (no page reload)
- [ ] 1b.6 Test theme switch on homepage, category pages, and channel detail pages
- [ ] 1b.7 Verify localStorage persistence works across sessions

## 1c. Implement Translation via translate.js

- [ ] 1c.1 Include translate.js CDN in all static HTML pages:
  ```
  https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js
  ```
- [ ] 1c.2 Add `translate.execute()` call after page load to auto-translate
- [ ] 1c.3 Verify language selector is displayed in header (translate.js built-in)
- [ ] 1c.4 Verify language preference persists via translate.js localStorage
- [ ] 1c.5 Test auto-translation on homepage, category pages, and channel detail pages

## 2. Create Static Site Generator CLI

- [ ] 2.1 Create `scripts/generate-static-site.js` Node.js CLI tool
- [ ] 2.2 Add D1 database connection using wrangler or `@cloudflare/d1`
- [ ] 2.3 Implement homepage HTML generation with proper output path
- [ ] 2.4 Implement category pages generation (loop through all groups)
- [ ] 2.5 Implement channel detail pages generation (loop through all active channels)
- [ ] 2.6 Add `--type` argument support (homepage, categories, channels, all)
- [ ] 2.7 Add `--output-dir` argument for configurable output directory
- [ ] 2.8 Add output verification and statistics logging
- [ ] 2.9 Test generation locally with `npm run generate-static`

## 3. Add Channel Detail Page Route

- [ ] 3.1 Add route handler in `worker.js` for `/channel/{hash}` path
- [ ] 3.2 Implement static file serving in `worker.js` (read from `static-output/` directory)
- [ ] 3.3 Add 404 handling for unknown channel hashes
- [ ] 3.4 Add proper cache headers for channel pages (public, max-age=86400)
- [ ] 3.5 Test channel route with static file serving

## 3b. Implement Favorites/Starred Channels System

- [ ] 3b.1 Create favorites JavaScript utilities module (`utils/favorites.js`)
  - localStorage read/write functions
  - Star/unstar toggle function
  - Get all favorites function
  - Check if channel is starred function
- [ ] 3b.2 Add star button to channel cards (homepage, category grid)
  - Position: top-right corner of channel card
  - Icon: ☆ (not starred) / ★ (starred)
  - Click toggles star state without page reload
  - Updates localStorage immediately
  - **IMPORTANT**: Extract and store logo URL from page DOM (not from API)
- [ ] 3b.3 Add star button to channel detail page
  - Position: next to channel title or in action buttons
  - Same toggle behavior as channel cards
  - **IMPORTANT**: Extract and store logo URL from page DOM
- [ ] 3b.4 Create favorites page (`/favorites`)
  - Static page with grid layout similar to homepage
  - Header: "My Favorites" title + "Download M3U" button
  - Empty state: "No favorites yet" message with link to browse
- [ ] 3b.5 Implement M3U functionality
  - **Channel detail page: "Copy M3U" button**
    - Call `/api/play/link?hash={channel_hash}` to get IP-bound play URL (free, no auth required)
    - Assemble M3U text with header and channel info
    - Copy to clipboard using `navigator.clipboard.writeText()`
    - Show toast: "M3U copied! Paste into VLC or IPTV player to watch."
    - Show loading spinner on button during fetch
    - On failure: show toast "Channel unavailable, please try another channel"
  - **Favorites page: "Download M3U" button**
    - **MAX 200 channels limit enforced on both add AND download**
    - Generate M3U file from starred channels
    - Include #EXTINF with channel name, logo URL, group
    - **IMPORTANT**: Call `/api/play/link?hash={channel_hash}` for EACH channel to get IP-bound play URL
    - Assemble M3U with real play links (not fake/demo links)
    - Trigger browser download with filename `favorites_{date}.m3u`
    - Show loading spinner on button during fetch
    - On all channels fail: show toast "All channels unavailable, please try other channels"
- [ ] 3b.6 Sync star state across pages
  - Use localStorage event listeners
  - Update all visible star buttons when favorites change
- [ ] 3b.7 Add "Favorites" link to header navigation
- [ ] 3b.8 Enforce 200 channel limit
  - Check limit when adding: if `favorites.length >= 200`, show error and reject
  - Check limit when downloading: if `favorites.length > 200`, show error and reject
  - This prevents abuse (API rate limits are finite)

## 3c. Implement User Account System

- [ ] 3c.1 Create login page (`/login`)
  - Email + password login form
  - Send verification code flow (for registration)
  - Login API: `POST /api/auth/login` (already exists in `handlers/auth.js`)
  - Remember to call `translate.execute()` for i18n
- [ ] 3c.2 Account page already exists (`/account`)
  - User info tab (email, member since, subscription status)
  - Order history tab
  - Logout button
  - Account API: `GET /api/auth/user` (already exists)
- [ ] 3c.3 Header navigation updates
  - Add "Login" link when not logged in
  - Replace with user avatar/email dropdown when logged in
  - Add "Account" link in dropdown
- [ ] 3c.4 Session management
  - Store auth token in `localStorage.auth_token`
  - Check login status on page load
  - Include token in API requests header

## 3d. SEO Optimization (CRITICAL - Must Preserve Exactly)

**⚠️ IMPORTANT**: All SEO meta tags MUST be preserved exactly as defined in prototype templates. SEO is critical for search engine ranking and social sharing.

### 3d.1 Homepage SEO Tags (EXACT values from template)
- [ ] `<title>`: "IPTV Search - 10,000+ Free Live TV Channels Directory"
- [ ] `<meta name="description">`: "Search and watch free live TV channels from around the world. 10,000+ channels including CCTV, sports, news, entertainment and more. No signup required."
- [ ] `<meta name="keywords">`: "free IPTV, live TV, watch TV online, TV streaming, CCTV, sports channels, news channels, entertainment"
- [ ] `<link rel="canonical">`: "https://iptv-search.com/"
- [ ] `og:title`: "IPTV Search - 10,000+ Free Live TV Channels Directory"
- [ ] `og:description`: "Search and watch free live TV channels from around the world."
- [ ] `og:type`: "website"
- [ ] `og:url`: "https://iptv-search.com/"
- [ ] `og:image`: Social sharing image URL

### 3d.2 Category Page SEO Tags (per category)
- [ ] `<title>`: "{Category Name} - Free Live TV Streaming | IPTV Search"
- [ ] `<meta name="description">`: "Watch free {Category Name} TV channels online. {Category Name} live streaming including all major channels."
- [ ] `<meta name="keywords">`: "free IPTV, {Category Name}, live TV, streaming, {specific channels}"
- [ ] `<link rel="canonical">`: "https://iptv-search.com/category/{slug}"
- [ ] `og:title`: "{Category Name} - Free Live TV Streaming | IPTV Search"
- [ ] `og:description`: "Watch free {Category Name} TV channels online."
- [ ] `og:type`: "website"
- [ ] `og:url`: "https://iptv-search.com/category/{slug}"

### 3d.3 Channel Detail Page SEO Tags (per channel)
- [ ] `<title>`: "{Channel Name} Live - Watch Free HD IPTV Streaming | IPTV Search"
- [ ] `<meta name="description">`: "Watch {Channel Name} live streaming free. {Group Name} channel with HD quality. No signup required."
- [ ] `<meta name="keywords">`: "free IPTV, live TV, {Channel Name}, {Group Name}, streaming, watch TV online"
- [ ] `<link rel="canonical">`: "https://iptv-search.com/channel/{hash}"
- [ ] `og:title`: "{Channel Name} Live - Watch Free HD IPTV Streaming | IPTV Search"
- [ ] `og:description`: "Watch {Channel Name} live streaming free online. {Group Name} channel available 24/7."
- [ ] `og:type`: "video"
- [ ] `og:url`: "https://iptv-search.com/channel/{hash}"
- [ ] `og:image`: Channel logo URL
- [ ] `og:site_name`: "IPTV Search"

### 3d.4 JSON-LD Schema Markup
- [ ] 3d.4.1 Homepage: FAQ schema JSON-LD
- [ ] 3d.4.2 Category pages: BreadcrumbList schema JSON-LD
- [ ] 3d.4.3 Channel pages: VideoObject + BreadcrumbList schema JSON-LD
- [ ] 3d.4.4 VideoObject includes: name, description, thumbnailUrl, uploadDate, expires

### 3d.5 Domain Consistency (CRITICAL)
- [ ] 3d.5.1 All canonical URLs MUST use `https://iptv-search.com/` (NOT www)
- [ ] 3d.5.2 All internal links MUST use full `https://iptv-search.com/` paths
- [ ] 3d.5.3 og:url MUST match canonical URL exactly

### 3d.6 sitemap.xml and robots.txt
- [ ] 3d.6.1 Generate sitemap.xml with all static pages
- [ ] 3d.6.2 sitemap.xml includes `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- [ ] 3d.6.3 Channel pages priority: 0.6, Category pages: 0.8, Homepage: 1.0
- [ ] 3d.6.4 Generate robots.txt allowing all crawlers
- [ ] 3d.6.5 robots.txt includes Sitemap reference

## 3e. Marketing Enhancement

- [ ] 3e.1 Homepage hero section
  - Clear value proposition: "10,000+ Free Live TV Channels - Watch Instantly"
  - Primary CTA: "Start Watching Free" button
  - Secondary CTA: "Browse All Channels" button
- [ ] 3e.2 Add trust signals to homepage hero
  - "🔒 No Signup Required"
  - "✅ Works on Any Device"
  - "📺 HD Quality Available"
- [ ] 3e.3 CTA buttons styling
  - Primary: Red accent color, rounded, shadow
  - Secondary: Outline style, hover effect
- [ ] 3e.4 Batch download M3U on category pages
  - "Download M3U" button in bulk actions bar
  - Fetches play links for selected channels

## 3f. Mobile Optimization

- [ ] 3f.1 Touch target sizes
  - All buttons minimum 44x44px
  - Pill buttons adequately sized for touch
- [ ] 3f.2 Responsive breakpoints
  - 768px: Tablet adjustments
  - 480px: Mobile phone adjustments
- [ ] 3f.3 Mobile header
  - Search box full width
  - Compact navigation
- [ ] 3f.4 Mobile channel grid
  - 2 columns on small screens
  - Reduced gaps
- [ ] 3f.5 Mobile sidebar
  - Hidden by default, show via hamburger menu

## 4. Integrate with Scheduler (Daily 3:00)

- [ ] 4.1 Add static site generation call to scheduler in `handlers/scheduler.js`
- [ ] 4.2 Keep cron trigger at "0 3 * * *" (daily at 3:00 AM) in `wrangler.toml`
- [ ] 4.3 Add error handling so generation failure doesn't break cron job
- [ ] 4.4 Add generation stats logging after successful run
- [ ] 4.5 Test scheduler runs correctly via `GET /test/scheduled`

## 5. Static File Serving via Workers

- [ ] 5.1 Add `STATIC_OUTPUT_DIR` configuration option to `wrangler.toml`
- [ ] 5.2 Implement static file reading in `worker.js`
- [ ] 5.3 Serve pre-generated HTML files for homepage, category pages, and channel pages
- [ ] 5.4 Test static file serving works locally with `npm run dev`
- [ ] 5.5 Document static file serving mode in README

## 6. Admin Static Generation Trigger

- [ ] 6.1 Add Admin UI button to trigger static site generation
- [ ] 6.2 Implement background generation using `ctx.waitUntil()`
- [ ] 6.3 Add progress tracking API: `GET /api/admin/static-generation/status`
- [ ] 6.4 Display real-time progress: current file, completed/total count
- [ ] 6.5 Add logs output: success/failure status, error details
- [ ] 6.6 Generation flow:
  1. Homepage `/` → static file
  2. Category pages `/category/{slug}` → static files
  3. Channel detail pages `/channel/{hash}` → static files (8000+)
  4. sitemap.xml → static file
  5. Update generation status on completion

## 7. R2 Bucket Integration (Optional Enhancement)

- [ ] 7.1 Configure R2 bucket `iptv-static-assets` for static file storage
- [ ] 7.2 Upload generated files to R2 instead of local `static-output/`
- [ ] 7.3 Workers reads from R2 for multi-instance consistency
- [ ] 7.4 Note: KV free tier insufficient (8000 ops/day), R2 recommended

## 8. Testing and Verification

- [ ] 8.1 Run static site generator and verify all files are created correctly
- [ ] 8.2 Verify homepage HTML matches existing `generateSEOHomepage()` output
- [ ] 8.3 Verify category pages generate for all groups
- [ ] 8.4 Verify channel detail pages contain all required information
- [ ] 8.5 Test end-to-end user flow: homepage → category → channel → play
- [ ] 8.6 Verify favorites system works across pages
- [ ] 8.7 Verify theme switching persists correctly
