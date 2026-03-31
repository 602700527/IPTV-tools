## Why

Currently, the homepage, category pages, and channel detail pages are rendered dynamically on each request. The existing `seo-handler.js` only generates static HTML for search engine bots, not for regular users. This creates unnecessary compute load on Workers and slower page loads for users. By pre-generating static HTML files daily and hosting them on Cloudflare Pages, we can achieve instant page loads, better edge caching, and reduced Worker compute costs.

## What Changes

- **New**: Add channel detail page static generation (`/channel/{hash}`)
- **New**: Add favorites/starred channels page (`/favorites`) with localStorage persistence
- **New**: Add "star" button on channel cards across all pages (homepage, category, channel detail)
- **New**: Download starred channels as M3U file
- **New**: Extend scheduler to generate complete static site (homepage, all category pages, all channel pages) as HTML files
- **New**: Add Cloudflare Pages deployment configuration and build pipeline
- **New**: Add static file output layer to Workers for serving pre-generated HTML when CF Pages is not configured
- **Modified**: Extend existing `generateSEOHomepage` and `generateCategoryPage` to support full static generation (not just bot detection)
- **Preserved**: `/live/{code}/{hash}` playback URLs remain fully dynamic with IP binding
- **Preserved**: `/sub/{code}.m3u` subscription generation remains fully dynamic

## Capabilities

### New Capabilities

- `static-site-generator`: Scheduled task that reads channel data from D1 and generates pre-rendered HTML files for homepage, category pages, and channel detail pages. Outputs to static HTML files that can be served from Cloudflare Pages or Workers static file handling.
- `cf-pages-deployment`: Configuration and build scripts to deploy the generated static site to Cloudflare Pages, including proper routing for API endpoints back to the Workers instance.
- `channel-detail-pages`: New static page generation for individual channel pages (`/channel/{hash}`) showing channel info, logo, group, and direct M3U subscription link.
- `favorites-page`: User's starred/favorited channels page with localStorage persistence, accessible at `/favorites`. Includes download all starred channels as M3U file functionality.
- `channel-star-action`: Star/unstar button on channel cards that persists to localStorage. Works across homepage, category pages, and channel detail pages.

### Modified Capabilities

- (none - this is a net-new capability set)

## Impact

- **New Files**: 
  - `scripts/generate-static-site.js` - Static site generator CLI tool
  - `scripts/deploy-to-pages.js` - CF Pages deployment script
  - `wrangler-pages.toml` - CF Pages configuration
  - `static-output/` - Directory for generated HTML files (gitignored)
- **Modified Files**:
  - `handlers/seo-handler.js` - Add channel detail page generation, refactor for batch generation
  - `handlers/scheduler.js` - Add static site generation to cron schedule
  - `worker.js` - Add static file serving fallback for pre-generated HTML
  - `wrangler.toml` - Add Pages configuration
- **Dependencies**: 
  - Cloudflare Pages (new)
  - Wrangler Pages plugin
- **Removed**: 
  - Bot-only static HTML generation (replaced with full static generation)
