## ADDED Requirements

### Requirement: UK IPTV Landing Page

The system SHALL serve a static SEO-optimized landing page at `GET /uk-iptv-plans` that targets the keyword "UK IPTV 套餐对比".

#### Scenario: Page serves successfully
- **WHEN** a user requests `GET /uk-iptv-plans`
- **THEN** the system returns an HTML page with proper meta tags (title, description, canonical URL)

#### Scenario: Page has correct SEO meta
- **WHEN** the page is served at `/uk-iptv-plans`
- **THEN** the title SHALL be "UK IPTV 套餐对比 - 英国IPTV服务套餐选购指南"
- **AND** the meta description SHALL contain "英国IPTV套餐" and "BBC" or "ITV"
- **AND** the canonical URL SHALL be `https://iptv-search.com/uk-iptv-plans`

#### Scenario: Page includes channel listing
- **WHEN** the page is rendered
- **THEN** it SHALL include a section that dynamically loads channels with `group_title = "United Kingdom"` via the `/api/channels?group=United%20Kingdom` endpoint
- **AND** display channel name, logo, and play URL

#### Scenario: Page contains FAQ section
- **WHEN** the page is rendered
- **THEN** it SHALL include an FAQ section with at least 3 questions about UK IPTV
- **AND** FAQ SHALL be structured for SEO schema markup

### Requirement: Sitemap includes UK IPTV page

The system SHALL include the `/uk-iptv-plans` page in the sitemap.xml generation.

#### Scenario: Sitemap includes new page
- **WHEN** sitemap.xml is generated
- **THEN** it SHALL contain a URL entry for `/uk-iptv-plans` with appropriate priority and changefreq
