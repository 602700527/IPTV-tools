## ADDED Requirements

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

#### Scenario: Channel page has JSON-LD structured data
- **WHEN** a channel detail page is generated
- **THEN** the HTML SHALL include JSON-LD schema.org markup for a VideoObject

#### Scenario: Channel page has Open Graph meta tags
- **WHEN** a channel detail page is generated
- **THEN** the HTML SHALL include OG meta tags (og:title, og:description, og:image)

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

The site SHALL support dynamic language switching using the existing `translate.js` library.

#### Scenario: Translate.js included in static pages
- **WHEN** any static page is generated
- **THEN** the HTML SHALL include `translate.js` from CDN
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
- **NOTE**: Logo URLs are stored during favorite-add, not fetched from API during download

#### Scenario: Sync favorites across pages
- **WHEN** favorites are updated in one tab
- **THEN** other tabs SHALL detect the change via `storage` event
- **AND** update star button states accordingly
