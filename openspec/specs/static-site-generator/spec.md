# static-site-generator Specification

## Purpose
TBD - created by archiving change static-site-generation-with-cf-pages. Update Purpose after archive.
## Requirements
### Requirement: Strict Template Compliance

**⚠️ IMPORTANT**: All development MUST 100% match the prototype templates in `static-preview/` directory.

The `static-preview/` directory contains prototype HTML/CSS/JS files that define the exact UI that must be implemented. During development, you MUST:

#### Forbidden Actions (NEVER do these):
- Simplify or omit any UI elements
- Modify colors, fonts, spacing, or animations arbitrarily
- Replace SVG icons with emoji
- Omit any hint text or descriptions
- Use different component structures than the template

#### Must Do:
- [ ] Match HTML structure exactly (element order, class names, attributes)
- [ ] Match CSS styles exactly (colors, spacing, animations)
- [ ] Use the exact SVG icons provided in templates
- [ ] Implement all interaction logic (hover effects, toggles, animations)
- [ ] Include all hint text and descriptions

#### Prototype Files Reference:
```
static-preview/
├── homepage.html         # ✅ Homepage template
├── category.html        # ✅ Category page template
├── channel-detail.html  # ✅ Channel detail page template
├── favorites.html       # ✅ Favorites page template
├── login.html           # ✅ Login + Register + Google OAuth
├── account.html         # ✅ Account page template
├── privacy-policy.html  # ✅ Legal page template
├── terms.html           # ✅ Legal page template
├── tutorial.html        # ✅ Tutorial page template
├── forgot-password.html  # ✅ Password reset request + Google OAuth
├── reset-password.html   # ✅ Password reset form + Google OAuth
└── 404.html             # ✅ Not found page
```

---

### Requirement: Static Site Generator CLI

The system SHALL provide a Node.js CLI tool (`scripts/generate-static-site.js`) that reads channel data from D1 database and generates pre-rendered HTML files for static hosting.

#### Scenario: Generate homepage HTML
- **WHEN** the generator script is executed with `node scripts/generate-static-site.js --type homepage`
- **THEN** the script SHALL output a complete `index.html` file to the configured output directory containing all channels in grid layout

#### Scenario: Generate category pages
- **WHEN** the generator script is executed with `node scripts/generate-static-site.js --type categories`
- **THEN** the script SHALL generate one HTML file per unique group_title in the channels table

#### Scenario: Generate channel detail pages
- **WHEN** the generator script is executed with `node scripts/generate-static-site.js --type channels`
- **THEN** the script SHALL generate one HTML file per active channel using the channel_hash as the filename

#### Scenario: Output directory structure
- **WHEN** the generator runs successfully
- **THEN** the output directory SHALL contain:
  - `index.html` (homepage)
  - `category/index.html` (category listing)
  - `category/{slug}.html` (individual category pages)
  - `channel/index.html` (channel listing)
  - `channel/{hash}.html` (individual channel pages)

### Requirement: Generator reads from D1

The generator script SHALL read channel data directly from the configured D1 database using wrangler CLI or D1 client API.

#### Scenario: Read all active channels
- **WHEN** the generator queries channels
- **THEN** it SHALL only include channels where `is_active = 1` and the associated source has `is_active = 1`

#### Scenario: Read all unique groups
- **WHEN** the generator queries groups
- **THEN** it SHALL return distinct `group_title` values from channels where `group_title IS NOT NULL AND group_title != ''`

### Requirement: Generator uses existing HTML templates

The generator SHALL reuse the HTML generation logic from `handlers/seo-handler.js` by refactoring functions into a shared module.

**IMPORTANT**: The generated HTML MUST match the prototype templates in `static-preview/` exactly.

#### Scenario: Reuse homepage template
- **WHEN** generating homepage
- **THEN** the output HTML SHALL match the structure and styling of `generateSEOHomepage()`
- **AND** SHALL match `static-preview/homepage.html` exactly

#### Scenario: Reuse category template
- **WHEN** generating category pages
- **THEN** the output HTML SHALL match the structure and styling of `generateCategoryPage()`
- **AND** SHALL match `static-preview/category.html` exactly

#### Scenario: Reuse channel detail template
- **WHEN** generating channel detail pages
- **THEN** the output HTML SHALL match `static-preview/channel-detail.html` exactly

---

### Requirement: Static File Serving via Workers

**⚠️ CRITICAL**: All dynamic HTML rendering in `worker.js` MUST be replaced with static file serving.

#### Scenario: Static file serving with environment detection
- **WHEN** a request comes to Workers
- **AND** the path matches a static file route
- **THEN** Workers SHALL call `serveStaticFile(path, env)`
- **AND** if `env.STATIC_SOURCE === 'r2'` and `env.R2_BUCKET` exists
- **THEN** Workers SHALL read from R2 bucket: `await env.R2_BUCKET.get(path)`
- **ELSE** Workers SHALL read from local `static-output/` directory
- **AND** return the file with correct Content-Type header
- **IF** the file does not exist
- **THEN** return `null` to trigger fallback to dynamic handlers

#### Static Routes Reference:

| Route | Static File Path | Notes |
|-------|----------------|-------|
| `GET /` | `static-output/index.html` | Homepage |
| `GET /login` | `static-output/login.html` | Login + Register + Google OAuth |
| `GET /favorites` | `static-output/favorites.html` | User favorites |
| `GET /forgot-password` | `static-output/forgot-password.html` | Password reset request |
| `GET /reset-password` | `static-output/reset-password.html` | Password reset form |
| `GET /account` | `static-output/account.html` | User account |
| `GET /tutorial` | `static-output/tutorial.html` | How to watch |
| `GET /plans` | `static-output/plans.html` | Subscription plans |
| `GET /category/{slug}` | `static-output/category/{slug}.html` | Category page |
| `GET /channel/{hash}` | `static-output/channel/{hash}.html` | Channel detail |
| `GET /sitemap.xml` | `static-output/sitemap.xml` | SEO sitemap |
| `GET /robots.txt` | `static-output/robots.txt` | SEO robots |
| `GET /404` | `static-output/404.html` | Not found page |

#### Scenario: Content-Type mapping
- **WHEN** serving a static file
- **THEN** Workers SHALL set the correct Content-Type based on file extension:
  - `.html` → `text/html; charset=utf-8`
  - `.css` → `text/css; charset=utf-8`
  - `.js` → `application/javascript`
  - `.json` → `application/json`
  - `.xml` → `application/xml`
  - `.txt` → `text/plain`
  - `.svg` → `image/svg+xml`
  - `.png` → `image/png`
  - `.jpg` → `image/jpeg`

#### Scenario: Legacy HTML files removal
- **WHEN** static file serving is fully implemented
- **THEN** the following dynamic HTML files SHALL be deleted:
  - `home-page.js` (HOME_HTML)
  - `reset-password-page.js` (RESET_PASSWORD_HTML)
  - `account-page.js` (ACCOUNT_HTML)
  - `tutorial-page.js` (TUTORIAL_HTML)
  - `freesub-page.js` (FREE_SUB_HTML)
  - `subscription-page.js` (SUBSCRIPTION_HTML)
  - `plans-page.js` (PLANS_HTML)

---

### Requirement: Complete SEO Meta Tags Preservation

**⚠️ IMPORTANT**: All SEO meta tags MUST be preserved exactly as defined in prototype templates. SEO information is critical for search engine indexing and social sharing.

#### Homepage SEO Requirements:

| Tag | Content |
|-----|---------|
| `<title>` | `IPTV Search - 10,000+ Free Live TV Channels Directory` |
| `<meta name="description">` | Search and watch free live TV channels from around the world. 10,000+ channels including CCTV, sports, news, entertainment and more. No signup required.` |
| `<meta name="keywords">` | `free IPTV, live TV, watch TV online, TV streaming, CCTV, sports channels, news channels, entertainment` |
| `<link rel="canonical">` | `https://iptv-search.com/` |
| `og:title` | `IPTV Search - 10,000+ Free Live TV Channels Directory` |
| `og:description` | Search and watch free live TV channels from around the world. |
| `og:type` | `website` |
| `og:url` | `https://iptv-search.com/` |
| `og:image` | Social sharing image URL |

#### Category Page SEO Requirements:

| Tag | Content |
|-----|---------|
| `<title>` | `{Category Name} - Free Live TV Streaming \| IPTV Search` |
| `<meta name="description">` | Watch free {Category Name} TV channels online. {Category Name} live streaming including all major channels.` |
| `<meta name="keywords">` | `free IPTV, {Category Name}, live TV, streaming, {specific channels}` |
| `<link rel="canonical">` | `https://iptv-search.com/category/{slug}` |
| `og:title` | `{Category Name} - Free Live TV Streaming \| IPTV Search` |
| `og:description` | Watch free {Category Name} TV channels online. |
| `og:type` | `website` |
| `og:url` | `https://iptv-search.com/category/{slug}` |
| `og:image` | Social sharing image URL |

#### Channel Detail Page SEO Requirements:

| Tag | Content |
|-----|---------|
| `<title>` | `{Channel Name} Live - Watch Free HD IPTV Streaming \| IPTV Search` |
| `<meta name="description">` | Watch {Channel Name} live streaming free. {Group Name} channel with HD quality. No signup required.` |
| `<meta name="keywords">` | `free IPTV, live TV, {Channel Name}, {Group Name}, streaming, watch TV online` |
| `<link rel="canonical">` | `https://iptv-search.com/channel/{hash}` |
| `og:title` | `{Channel Name} Live - Watch Free HD IPTV Streaming \| IPTV Search` |
| `og:description` | Watch {Channel Name} live streaming free online. {Group Name} channel available 24/7.` |
| `og:type` | `video` |
| `og:url` | `https://iptv-search.com/channel/{hash}` |
| `og:image` | Channel logo URL |
| `og:site_name` | `IPTV Search` |

#### Privacy Policy & Terms Page SEO Requirements:

| Tag | Content |
|-----|---------|
| `<title>` | `{Page Name} \| IPTV Search` |
| `<link rel="canonical">` | `https://iptv-search.com/{page-path}` |

#### Legal Pages SEO Requirements:

| Tag | Content |
|-----|---------|
| `<title>` | `{Page Name} \| IPTV Search` |
| `<link rel="canonical">` | `https://iptv-search.com/{page-path}` |

---

### Requirement: JSON-LD Schema Markup

All generated pages MUST include proper JSON-LD structured data for rich search results.

#### Homepage JSON-LD:
- FAQ schema with common questions about IPTV, registration, devices, etc.

#### Category Page JSON-LD:
- BreadcrumbList schema:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://iptv-search.com/"},
    {"@type": "ListItem", "position": 2, "name": "{Category Name}"}
  ]
}
```

#### Channel Detail Page JSON-LD:
- VideoObject schema:
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "{Channel Name}",
  "description": "Watch {Channel Name} live streaming free",
  "thumbnailUrl": "{Logo URL}",
  "uploadDate": "{Current Date}",
  "expires": "{Future Date}"
}
```
- BreadcrumbList schema (same structure as category page)

---

### Requirement: Domain Consistency

**CRITICAL**: All canonical URLs and internal links MUST use consistent domain.

| Requirement | Value |
|-------------|-------|
| Domain | `https://iptv-search.com/` (NOT `www.iptv-search.com`) |
| Internal links | Must use full `https://iptv-search.com/` paths |
| Canonical tags | Must use `https://iptv-search.com/` domain |

---

### Requirement: sitemap.xml and robots.txt

The static site generator SHALL also generate:

#### sitemap.xml
- List all static pages (homepage, category pages, channel pages)
- Include `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>` for each URL
- Channel pages priority: 0.6
- Category pages priority: 0.8
- Homepage priority: 1.0

#### robots.txt
- Allow all crawlers: `User-agent: * Allow: /`
- Point to sitemap: `Sitemap: https://iptv-search.com/sitemap.xml`

### Requirement: Scheduled generation

The scheduler in `handlers/scheduler.js` SHALL call the static site generator as part of the daily sync task (3 AM cron).

#### Scenario: Daily regeneration
- **WHEN** the daily cron trigger fires at 3 AM
- **THEN** the scheduler SHALL execute the static site generator after source sync completes

#### Scenario: Generation failure handling
- **WHEN** the static site generator fails
- **THEN** the scheduler SHALL log the error and continue without failing the entire cron job

### Requirement: Output verification

The generator SHALL verify output files were created successfully and report statistics.

#### Scenario: Report generation stats
- **WHEN** generation completes
- **THEN** the script SHALL log: number of homepage files, category pages, and channel pages generated

#### Scenario: Verify output files exist
- **WHEN** generating any page type
- **THEN** the script SHALL verify each output file was written to disk before reporting success

