# Cloudflare WAF Rules to block scrapers and old URLs
# Usage: terraform apply after setting up tfvars

# Provider configuration
# provider "cloudflare" {
#   api_token = var.cloudflare_api_token
# }

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for iptv-search.com"
  type        = string
}

# Rule 1: Block legacy URLs (zh-hant, zh-cn paths)
resource "cloudflare_ruleset" "block_legacy_urls" {
  zone_id     = var.cloudflare_zone_id
  name        = "Block Legacy URLs"
  description = "Block scrapers crawling old URLs like /zh-hant/search/"
  type        = "http"
  scope       = "zone"

  phase = "http_ratelimit"

  # Note: WAF rules go into "http_request" phase, not "http_ratelimit"
}

# Actually, WAF rules should be in http_request phase
resource "cloudflare_ruleset" "block_scraper_traffic" {
  zone_id     = var.cloudflare_zone_id
  name        = "Block Scraper Traffic"
  description = "Block scrapers and legacy URLs to reduce CF quota consumption"
  type        = "http"
  scope       = "zone"
  phase       = "http_request_firewall_custom"

  rules {
    action = "block"

    expression = "http.request.uri.path matches \"^/(zh-hant|zh-cn)/.*\""
    description = "Block legacy URL paths"

    enabled = true
  }

  rules {
    action = "block"

    expression = "http.request.headers.user_agent matches \"(?i)(MJ12bot|Semrushbot|AhrefsBot|DotBot|scrapy|python-requests|curl)\""
    description = "Block known scrapers"

    enabled = true
  }

  rules {
    action = "block"

    expression = "http.request.uri.path matches \"^/search\" and http.request.uri.query == \"\" and http.user_agent contains \"bot\""
    description = "Block bot requests to /search without query parameter"

    enabled = true
  }
}

# Output the rule IDs for reference
output "ruleset_id" {
  value       = cloudflare_ruleset.block_scraper_traffic.id
  description = "The ID of the created ruleset"
}

output "block_legacy_urls_message" {
  value = <<EOF
WAF Rules Created Successfully!

Ruleset ID: ${cloudflare_ruleset.block_scraper_traffic.id}
Ruleset Name: ${cloudflare_ruleset.block_scraper_traffic.name}

Active Rules:
1. Block legacy URLs (zh-hant, zh-cn paths)
2. Block known scrapers (MJ12bot, Semrush, Ahrefs, etc.)
3. Block empty search requests from bots

These rules will:
- Block requests at the edge (before reaching Worker)
- Save CF free quota by not executing Worker code
- Return 403 Forbidden to blocked requests

To apply:
  terraform init
  terraform apply -var="cloudflare_api_token=YOUR_TOKEN" -var="cloudflare_account_id=YOUR_ACCOUNT_ID" -var="cloudflare_zone_id=YOUR_ZONE_ID"
EOF
}
