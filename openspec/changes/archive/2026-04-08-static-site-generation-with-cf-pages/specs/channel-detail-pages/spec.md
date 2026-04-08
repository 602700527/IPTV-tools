## ADDED Requirements

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
├── homepage.html         # Homepage template
├── category.html         # Category page template
├── channel-detail.html   # Channel detail page template
├── favorites.html        # Favorites page template
├── login.html            # Login page template
├── account.html          # Account page template
├── privacy-policy.html   # Legal page template
├── terms.html            # Legal page template
└── tutorial.html         # Tutorial page template
```

---

### Requirement: Channel Detail Page Generation

The system SHALL generate static HTML pages for individual channel details, accessible at `/channel/{hash}`.

#### Scenario: Generate channel page for each active channel
- **WHEN** the static site generator runs with channel type
- **THEN** one HTML file SHALL be created per active channel using `channel_hash` as the page identifier

#### Scenario: Channel page contains channel metadata
- **WHEN** a channel detail page is generated
- **THEN** the page SHALL display:
  - Channel name
  - Channel logo (if available)
  - Group/category name
  - Source name
  - Play URL (masked)

#### Scenario: Channel page includes play options
- **WHEN** a channel detail page is generated
- **THEN** the page SHALL provide:
  - M3U subscription copy button (links to `/sub/{default_code}.m3u`)
  - Direct play link (if user has active code)
  - QR code for mobile access (optional enhancement)

### Requirement: Channel Detail Page Route

The Workers router SHALL serve channel detail pages when the static HTML file exists.

#### Scenario: Route /channel/{hash} to static file
- **WHEN** a GET request arrives at `/channel/{hash}`
- **THEN** Workers SHALL check for a pre-generated `channel/{hash}.html` file and serve it if found

#### Scenario: Return 404 for unknown channel hash
- **WHEN** a GET request arrives at `/channel/{unknown_hash}`
- **THEN** Workers SHALL return a 404 response with the custom 404 page

#### Scenario: Fallback to dynamic generation
- **WHEN** no static file exists for `/channel/{hash}` AND the hash is valid
- **THEN** Workers MAY generate the channel page dynamically using `generateChannelDetailPage()`

### Requirement: Channel Detail Page SEO

The generated channel detail pages SHALL be optimized for search engine indexing.

#### Scenario: Channel page has canonical URL
- **WHEN** a channel detail page is generated
- **THEN** the HTML SHALL include a `<link rel="canonical">` tag pointing to the channel page URL
- **AND** canonical URL SHALL use `https://iptv-search.com/` (NOT www)

#### Scenario: Channel page has JSON-LD structured data
- **WHEN** a channel detail page is generated
- **THEN** the HTML SHALL include JSON-LD schema.org markup for a VideoObject

#### Scenario: Channel page has Open Graph meta tags
- **WHEN** a channel detail page is generated
- **THEN** the HTML SHALL include OG meta tags:
  - `og:title` - Channel name + "Live - Watch Free HD IPTV Streaming | IPTV Search"
  - `og:description` - Channel description
  - `og:url` - Full canonical URL of the channel page
  - `og:image` - Channel logo URL
  - `og:type` - "video"

#### Scenario: Channel page has BreadcrumbList Schema
- **WHEN** a channel detail page is generated
- **THEN** the HTML SHALL include BreadcrumbList JSON-LD schema:
  - Home > Category > Channel Name

---

### Requirement: Complete SEO Meta Tags

**⚠️ IMPORTANT**: All SEO meta tags MUST be preserved exactly as defined in prototype templates.

#### Required Meta Tags for Channel Detail Pages:

| Tag | Content |
|-----|---------|
| `<title>` | `{Channel Name} Live - Watch Free HD IPTV Streaming \| IPTV Search` |
| `<meta name="description">` | Watch {Channel Name} live streaming free. {Group Name} channel with HD quality. No signup required. |
| `<meta name="keywords">` | free IPTV, live TV, {Channel Name}, {Group Name}, streaming, watch TV online |
| `<link rel="canonical">` | `https://iptv-search.com/channel/{hash}` |
| `og:title` | `{Channel Name} Live - Watch Free HD IPTV Streaming \| IPTV Search` |
| `og:description` | Watch {Channel Name} live streaming free online. {Group Name} channel available 24/7. |
| `og:url` | `https://iptv-search.com/channel/{hash}` |
| `og:image` | Channel logo URL |
| `og:type` | `video` |
| `og:site_name` | `IPTV Search` |

#### Required JSON-LD Schema for Channel Detail Pages:

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

#### Required BreadcrumbList Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://iptv-search.com/"},
    {"@type": "ListItem", "position": 2, "name": "{Category}", "item": "https://iptv-search.com/category/{slug}"},
    {"@type": "ListItem", "position": 3, "name": "{Channel Name}"}
  ]
}
```

### Requirement: Channel Detail Page Template

The channel detail page template SHALL be consistent with the site design.

#### Scenario: Consistent header and footer
- **WHEN** a channel detail page is rendered
- **THEN** it SHALL use the same page header and footer as homepage and category pages

#### Scenario: Responsive design
- **WHEN** a channel detail page is viewed on mobile
- **THEN** the layout SHALL adapt using the same CSS framework as other pages

### Requirement: Dark/Light Theme Toggle

The site SHALL support switching between dark and light themes with user preference persistence.

#### Scenario: Theme toggle button in header
- **WHEN** a user views any page (homepage, category, channel)
- **THEN** the header SHALL display a theme toggle button (☀️/🌙)
- **AND** clicking the button SHALL switch theme immediately without page reload

#### Scenario: Theme preference persistence
- **WHEN** a user selects a theme preference
- **THEN** the preference SHALL be saved to localStorage (`theme` key)
- **AND** subsequent visits SHALL respect the saved preference

#### Scenario: System preference detection
- **WHEN** no localStorage preference exists
- **THEN** the site SHALL respect the system's `prefers-color-scheme` setting
- **AND** default to dark theme if system preference is not detectable

#### Scenario: Theme CSS variables
- **WHEN** generating any static page
- **THEN** the CSS SHALL use CSS custom properties (variables) for all colors
- **AND** both dark and light theme values SHALL be defined in the CSS

### Requirement: Dynamic Translation (i18n)

The site SHALL support dynamic language switching using `translate.js` from CDN.

#### Scenario: Translate.js included in static pages
- **WHEN** any static page is generated
- **THEN** the HTML SHALL include `translate.js` from:
  ```
  https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js
  ```
- **AND** `translate.execute()` SHALL be called to auto-translate the page

#### Scenario: Manual language switching
- **WHEN** a user selects a language via translate.js language selector
- **THEN** `translate.changeLanguage(lang)` SHALL be called
- **AND** the preference SHALL be saved via translate.js built-in storage

#### Scenario: Browser language auto-detection
- **WHEN** a user visits the site for the first time
- **THEN** translate.js SHALL auto-detect browser language
- **AND** translate.js SHALL auto-translate the page accordingly

#### Scenario: Translation persistence
- **WHEN** a user changes language preference
- **THEN** translate.js SHALL persist the preference
- **AND** subsequent visits SHALL respect the saved preference

### Requirement: Favorites System with localStorage

The site SHALL support storing favorites in browser's localStorage without requiring backend storage.

#### Scenario: Add channel to favorites
- **WHEN** a user clicks the star button on a channel
- **THEN** the channel SHALL be saved to localStorage with:
  - `channel_hash`: unique channel identifier
  - `channel_name`: display name
  - `group_title`: category/group name
  - `logo`: remote image URL (extracted from page DOM, NOT from API)
- **AND** the star icon SHALL change to filled ★

#### Scenario: 200 channel limit on favorites
- **WHEN** a user attempts to add a channel to favorites
- **AND** `favorites.length >= 200`
- **THEN** the add operation SHALL be rejected
- **AND** a toast message SHALL show "Maximum 200 channels in favorites"
- **WHEN** a user attempts to download M3U with >200 channels
- **THEN** the download SHALL be rejected
- **AND** a toast message SHALL show "Maximum 200 channels allowed"

#### Scenario: Copy single channel M3U to clipboard
- **WHEN** a user clicks "Copy M3U" on a channel detail page
- **THEN** the system SHALL call `/api/play/link?hash={channel_hash}` to get IP-bound play URL
- **AND** assemble M3U text with:
  - `#EXTM3U` header
  - `#EXTINF:-1 tvg-logo="{logo_url}" group-title="{group}",{channel_name}`
  - Real IP-bound play URL
- **AND** copy the M3U text to clipboard
- **AND** show toast: "M3U copied! Paste into VLC or IPTV player to watch."
- **WHEN** API call fails (channel unavailable)
- **THEN** show toast: "Channel unavailable, please try another channel."

#### Scenario: M3U download with IP-bound play URLs
- **WHEN** a user clicks "Download M3U" on the favorites page
- **THEN** the system SHALL call `/api/play/link?hash={channel_hash}` for EACH favorited channel
- **AND** use the returned `play_link` URL in the M3U file
- **AND** the M3U SHALL include:
  - `#EXTM3U` header
  - `#EXTINF:-1 tvg-logo="{logo_url}" group-title="{group}",{channel_name}` for each channel
  - Real IP-bound play URL (not fake/demo URLs)
- **AND** trigger browser download with filename `favorites_{date}.m3u`
- **AND** show loading spinner on button during fetch
- **WHEN** all channels fail to fetch (data source expired)
- **THEN** show toast: "All channels unavailable, please try other channels."
- **NOTE**: Logo URLs are stored during favorite-add, not fetched from API during download

#### Scenario: Sync favorites across pages
- **WHEN** favorites are updated in one tab
- **THEN** other tabs SHALL detect the change via `storage` event
- **AND** update star button states accordingly

### Requirement: User Account System

The site SHALL provide user authentication and account management using existing auth APIs.

#### Scenario: User login
- **WHEN** a user navigates to `/login`
- **THEN** the page SHALL display a login form with email and password fields
- **AND** submit to `POST /api/auth/login`
- **AND** store returned token in `localStorage.auth_token`
- **AND** redirect to homepage or intended page on success

#### Scenario: User registration
- **WHEN** a user submits registration form on login page
- **THEN** system SHALL send verification code to email via `POST /api/auth/send-code`
- **AND** user enters 6-digit code to complete registration via `POST /api/auth/register`
- **AND** auto-login and store token on success

#### Scenario: Account page access
- **WHEN** a logged-in user navigates to `/account`
- **THEN** display user info (email, member since date)
- **AND** display order history
- **AND** show logout button
- **AND** fetch data from `GET /api/auth/user` with auth token

#### Scenario: Unauthenticated access to protected pages
- **WHEN** a user tries to access `/account` without being logged in
- **THEN** redirect to `/login` page
- **AND** store intended page URL for redirect after login

#### Scenario: Header authentication state
- **WHEN** a user is NOT logged in
- **THEN** header SHALL show "Login" link
- **WHEN** a user IS logged in
- **THEN** header SHALL show user email or avatar dropdown
- **AND** dropdown contains "Account" and "Logout" options

#### Scenario: User forgot password
- **WHEN** a user clicks "Forgot Password?" on login page
- **THEN** navigate to `/forgot-password`
- **AND** display email input form
- **WHEN** user submits email
- **THEN** system SHALL call `POST /api/auth/forgot-password`
- **AND** show message: "If an account exists with this email, a reset link has been sent"
- **AND** rate limit: max 3 requests per IP per hour

#### Scenario: User resets password via email link
- **WHEN** user clicks reset link in email (contains token)
- **THEN** navigate to `/reset-password?token=xxx`
- **WHEN** page loads with valid token
- **THEN** display password reset form
- **WHEN** user enters new password and submits
- **THEN** system SHALL call `POST /api/auth/reset-password`
- **AND** validate token is not expired (1 hour max)
- **AND** update user password in database
- **AND** invalidate token after use
- **AND** redirect to login with success message
- **WHEN** token is invalid or expired
- **THEN** show error: "This reset link has expired. Please request a new one."
- **AND** provide link to `/forgot-password`

#### Scenario: Password reset token security
- **WHEN** a reset token is generated
- **THEN** it SHALL be cryptographically random (UUID or JWT with short expiry)
- **AND** stored securely in database with expiration timestamp
- **AND** invalidated immediately after use
- **AND** rejected if expired or already used

#### Scenario: Google OAuth login
- **WHEN** user clicks "Continue with Google" on any auth page
- **THEN** system SHALL call `POST /api/auth/google/init`
- **AND** receive Google OAuth URL
- **AND** redirect to Google consent screen
- **WHEN** user grants permission
- **THEN** Google redirects to `/api/auth/google/callback` with auth code
- **AND** system exchanges code for tokens
- **AND** creates user account if not exists (email-only, no password)
- **AND** generates session token
- **AND** redirects to `/account?token=xxx`
- **AND** frontend stores token in `localStorage.auth_token`

#### Scenario: Google OAuth button placement
- **WHEN** user is on login page (`/login`)
- **THEN** "Continue with Google" button SHALL appear above email/password form
- **WHEN** user is on forgot-password page (`/forgot-password`)
- **THEN** "Continue with Google" button SHALL appear below email form
- **WHEN** user is on reset-password page (`/reset-password`)
- **THEN** "Continue with Google" button SHALL appear below password form
