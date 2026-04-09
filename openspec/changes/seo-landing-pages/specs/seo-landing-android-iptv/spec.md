## ADDED Requirements

### Requirement: Android IPTV App Landing Page

The system SHALL serve a static SEO-optimized landing page at `GET /android-iptv-app` that targets the keyword "Android IPTV App 推荐".

#### Scenario: Page serves successfully
- **WHEN** a user requests `GET /android-iptv-app`
- **THEN** the system returns an HTML page with proper meta tags (title, description, canonical URL)

#### Scenario: Page has correct SEO meta
- **WHEN** the page is served at `/android-iptv-app`
- **THEN** the title SHALL be "Android IPTV App 推荐 - 最佳IPTV播放器For Android手机/平板"
- **AND** the meta description SHALL mention "Android IPTV应用推荐" and app names like "Televizo" or "TiviMate"
- **AND** the canonical URL SHALL be `https://iptv-search.com/android-iptv-app`

#### Scenario: Page includes app recommendations
- **WHEN** the page is rendered
- **THEN** it SHALL include reviews/rankings of at least 3 Android IPTV apps
- **AND** each app SHALL have name, platform info, features, and pros/cons

#### Scenario: Page contains FAQ section
- **WHEN** the page is rendered
- **THEN** it SHALL include an FAQ section with at least 3 questions about Android IPTV apps
- **AND** FAQ SHALL be structured for SEO schema markup

### Requirement: Sitemap includes Android IPTV page

The system SHALL include the `/android-iptv-app` page in the sitemap.xml generation.

#### Scenario: Sitemap includes new page
- **WHEN** sitemap.xml is generated
- **THEN** it SHALL contain a URL entry for `/android-iptv-app` with appropriate priority and changefreq
