## ADDED Requirements

### Requirement: Workers Static File Serving

**Note**: CF Pages deployment has been abandoned. Static files are now served directly via Cloudflare Workers.

### Requirement: Static File Configuration

The Workers instance SHALL serve pre-generated static HTML files from a configurable output directory.

#### Scenario: Configure static output directory
- **WHEN** Workers starts
- **THEN** the `STATIC_OUTPUT_DIR` environment variable SHALL specify the directory containing static files
- **AND** Workers SHALL read HTML files from this directory when serving static pages

#### Scenario: Serve static HTML for homepage
- **WHEN** a GET request arrives at `/`
- **THEN** Workers SHALL check for `static-output/index.html`
- **AND** serve the file if it exists

#### Scenario: Serve static HTML for category pages
- **WHEN** a GET request arrives at `/category/{slug}`
- **THEN** Workers SHALL check for `static-output/category/{slug}.html`
- **AND** serve the file if it exists

#### Scenario: Serve static HTML for channel pages
- **WHEN** a GET request arrives at `/channel/{hash}`
- **THEN** Workers SHALL check for `static-output/channel/{hash}.html`
- **AND** serve the file if it exists

#### Scenario: Return 404 for missing static files
- **WHEN** a GET request arrives for a static page that doesn't exist
- **THEN** Workers SHALL return a 404 response with the custom 404 page

### Requirement: Dynamic Route Fallthrough

Static file serving SHALL NOT interfere with dynamic routes.

#### Scenario: Dynamic routes take precedence
- **WHEN** a GET request arrives at `/live/{code}/{hash}`
- **THEN** Workers SHALL NOT check for static files
- **AND** SHALL proceed to the dynamic playback handler

#### Scenario: API routes take precedence
- **WHEN** a GET request arrives at `/api/*`
- **THEN** Workers SHALL NOT check for static files
- **AND** SHALL proceed to the API handler

### Requirement: Cache Headers for Static Files

Static HTML files SHALL be served with appropriate cache headers.

#### Scenario: Cache static HTML
- **WHEN** Workers serves a static HTML file
- **THEN** the response SHALL include `Cache-Control: public, max-age=86400`
- **AND** include `CF-Cache-Status: HIT` after first fetch

### Requirement: R2 Bucket Integration (Optional)

For multi-instance deployments, static files MAY be stored in R2 bucket instead of local directory.

#### Scenario: Configure R2 bucket
- **WHEN** `R2_BUCKET` environment variable is set
- **THEN** Workers SHALL read static files from the specified R2 bucket

#### Scenario: R2 bucket not configured
- **WHEN** `R2_BUCKET` environment variable is not set
- **THEN** Workers SHALL read static files from `STATIC_OUTPUT_DIR` local directory

#### Scenario: R2 bucket read
- **WHEN** Workers needs to serve a static file and R2 is configured
- **THEN** Workers SHALL use `env.R2_BUCKET.get(key)` to retrieve the file
- **AND** return the content with appropriate headers
