## ADDED Requirements

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

#### Scenario: Reuse homepage template
- **WHEN** generating homepage
- **THEN** the output HTML SHALL match the structure and styling of `generateSEOHomepage()`

#### Scenario: Reuse category template
- **WHEN** generating category pages
- **THEN** the output HTML SHALL match the structure and styling of `generateCategoryPage()`

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
