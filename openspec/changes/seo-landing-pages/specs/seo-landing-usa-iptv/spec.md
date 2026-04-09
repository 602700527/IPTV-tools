## ADDED Requirements

### Requirement: USA IPTV Landing Page

The system SHALL serve a static SEO-optimized landing page at `GET /usa-iptv` that targets the keyword "USA IPTV 频道大全".

#### Scenario: Page serves successfully
- **WHEN** a user requests `GET /usa-iptv`
- **THEN** the system returns an HTML page with proper meta tags (title, description, canonical URL)

#### Scenario: Page has correct SEO meta
- **WHEN** the page is served at `/usa-iptv`
- **THEN** the title SHALL be "USA IPTV 频道大全 - 美国IPTV直播频道目录"
- **AND** the meta description SHALL contain "美国IPTV直播频道大全"
- **AND** the canonical URL SHALL be `https://iptv-search.com/usa-iptv`

#### Scenario: Page includes channel listing
- **WHEN** the page is rendered
- **THEN** it SHALL include a section that dynamically loads channels with `group_title = "United States"` via the `/api/channels?group=United%20States` endpoint
- **AND** display channel name, logo, and play URL

#### Scenario: Page contains FAQ section
- **WHEN** the page is rendered
- **THEN** it SHALL include an FAQ section with at least 3 questions about USA IPTV
- **AND** FAQ SHALL be structured for SEO schema markup

### Requirement: Sitemap includes USA IPTV page

The system SHALL include the `/usa-iptv` page in the sitemap.xml generation.

#### Scenario: Sitemap includes new page
- **WHEN** sitemap.xml is generated
- **THEN** it SHALL contain a URL entry for `/usa-iptv` with appropriate priority and changefreq
