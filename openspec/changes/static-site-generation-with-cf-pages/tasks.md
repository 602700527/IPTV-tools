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

## 1c. Preserve JavaScript Translation (i18n)

- [ ] 1c.1 Identify existing translate.js initialization code in current pages
- [ ] 1c.2 Extract translate.js script tag and initialization from page-footer.js
- [ ] 1c.3 Include translate.js CDN link in static HTML generation
- [ ] 1c.4 Add `translate.execute()` call in generated HTML
- [ ] 1c.5 Test auto-translation works on homepage, category pages, and channel detail pages
- [ ] 1c.6 Verify language preference persists across sessions

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
- [ ] 3.2 Implement static file serving fallback in `worker.js` for pre-generated HTML
- [ ] 3.3 Add 404 handling for unknown channel hashes
- [ ] 3.4 Add proper cache headers for channel pages (public, max-age=86400)
- [ ] 3.5 Test channel route with existing bot detection and new static file serving

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

## 3d. SEO Optimization

- [ ] 3d.1 All page titles and meta descriptions in English
  - Homepage: "IPTV Search - 10,000+ Free Live TV Channels Directory"
  - Category pages: "{Category Name} - Free Live TV Streaming | IPTV Search"
  - Channel pages: "{Channel Name} Live - Watch Free HD IPTV Streaming | IPTV Search"
- [ ] 3d.2 Add meta keywords tag to all pages
  - Include relevant keywords: free IPTV, live TV, streaming, {category names}
- [ ] 3d.3 Add Open Graph meta tags (og:title, og:description, og:type, og:url)
- [ ] 3d.4 Add FAQ schema JSON-LD to homepage
  - Include common questions about IPTV, registration, devices, etc.
- [ ] 3d.5 Add TelevisionChannel schema to channel detail pages
- [ ] 3d.6 Ensure canonical URLs use `https://iptv-search.com` (not www)

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

## 4. Integrate with Scheduler (Daily 12:00)

- [ ] 4.1 Add static site generation call to scheduler in `handlers/scheduler.js`
- [ ] 4.2 Update cron trigger from "0 3 * * *" to "0 12 * * *" in `wrangler.toml`
- [ ] 4.3 Add error handling so generation failure doesn't break cron job
- [ ] 4.4 Add generation stats logging after successful run
- [ ] 4.5 Test scheduler runs correctly via `GET /test/scheduled`

## 5. Domain and DNS Configuration

- [ ] 5.1 Ensure Workers is deployed on `iptv-search.com`
- [ ] 5.2 Set up Pages project on `www.iptv-search.com` via Cloudflare Dashboard
- [ ] 5.3 Configure Origin Rule: if hostname is `www.iptv-search.com` AND path is `/live/*` OR `/sub/*` OR `/api/*`, proxy to Workers
- [ ] 5.4 Verify DNS is pointing correctly (CNAME for www to Pages)
- [ ] 5.5 Test API proxy from Pages to Workers

## 6. Create CF Pages Deployment Configuration

- [ ] 6.1 Create `wrangler-pages.toml` for Pages project
- [ ] 6.2 Configure Pages project name and build output directory
- [ ] 6.3 Set up custom domain `www.iptv-search.com` in Pages dashboard
- [ ] 6.4 Create `_routes.json` to exclude dynamic routes (`/live/*`, `/sub/*`, `/api/*`)
- [ ] 6.5 Configure Origin Rules in Cloudflare Dashboard to proxy API routes to Workers
- [ ] 6.6 Test Pages deployment via `wrangler pages deploy`
- [ ] 6.7 Verify Pages custom domain works correctly

## 7. Workers Fallback Static File Serving

- [ ] 7.1 Add `STATIC_OUTPUT_DIR` configuration option to `wrangler.toml`
- [ ] 7.2 Implement static file reading in `worker.js` for when Pages is not configured
- [ ] 7.3 Test fallback serving works locally with `npm run dev`
- [ ] 7.4 Document fallback mode in README

## 8. Testing and Verification

- [ ] 8.1 Run static site generator and verify all files are created correctly
- [ ] 8.2 Verify homepage HTML matches existing `generateSEOHomepage()` output
- [ ] 8.3 Verify category pages generate for all groups
- [ ] 8.4 Verify channel detail pages contain all required information
- [ ] 8.5 Test deployment to CF Pages preview environment
- [ ] 8.6 Verify Pages routing proxies correctly to Workers for dynamic routes
- [ ] 8.7 Test end-to-end user flow: homepage → category → channel → play
