## ADDED Requirements

### Requirement: Free IPTV App Review Landing Page

The system SHALL serve a static SEO-optimized landing page at `GET /free-iptv-app-review` that targets the keyword "免费IPTV App 评测".

#### Scenario: Page serves successfully
- **WHEN** a user requests `GET /free-iptv-app-review`
- **THEN** the system returns an HTML page with proper meta tags (title, description, canonical URL)

#### Scenario: Page has correct SEO meta
- **WHEN** the page is served at `/free-iptv-app-review`
- **THEN** the title SHALL be "免费IPTV App 评测 - 最佳免费IPTV播放器推荐2024"
- **AND** the meta description SHALL mention "免费IPTV应用" and app names like "Kodi" or "VLC"
- **AND** the canonical URL SHALL be `https://iptv-search.com/free-iptv-app-review`

#### Scenario: Page includes app reviews
- **WHEN** the page is rendered
- **THEN** it SHALL include reviews/comparison of at least 3 free IPTV apps
- **AND** each app SHALL have name, platform info, features, pros/cons, and download links

#### Scenario: Page contains comparison section
- **WHEN** the page is rendered
- **THEN** it SHALL include a comparison table or list of free vs paid IPTV differences

#### Scenario: Page contains FAQ section
- **WHEN** the page is rendered
- **THEN** it SHALL include an FAQ section with at least 3 questions about free IPTV apps
- **AND** FAQ SHALL be structured for SEO schema markup

### Requirement: Sitemap includes Free IPTV page

The system SHALL include the `/free-iptv-app-review` page in the sitemap.xml generation.

#### Scenario: Sitemap includes new page
- **WHEN** sitemap.xml is generated
- **THEN** it SHALL contain a URL entry for `/free-iptv-app-review` with appropriate priority and changefreq
