## ADDED Requirements

### Requirement: Tutorial Page SEO Optimization

The system SHALL optimize the existing `/tutorial` page's SEO meta to target the keyword "Smart TV IPTV 安装教程".

#### Scenario: Tutorial page has optimized meta
- **WHEN** the page is served at `/tutorial`
- **THEN** the title SHALL be "Smart TV IPTV 安装教程 - 三星/ LG/ Android TV IPTV安装指南" (or similar including Smart TV IPTV keywords)
- **AND** the meta description SHALL include "Smart TV IPTV安装" and mention supported TV brands

#### Scenario: Tutorial page remains functional
- **WHEN** a user requests `GET /tutorial`
- **THEN** the page SHALL display all existing tutorial content (iOS, Android, Smart TV, Desktop sections)
- **AND** all tab switching and navigation SHALL work as before

### Requirement: Sitemap reflects tutorial page

The system SHALL ensure the `/tutorial` page is in sitemap.xml (already exists).

#### Scenario: Sitemap includes tutorial
- **WHEN** sitemap.xml is generated
- **THEN** it SHALL contain a URL entry for `/tutorial` with appropriate priority and changefreq
