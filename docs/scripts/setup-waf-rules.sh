#!/bin/bash
# Cloudflare WAF Rules Setup Script
# Usage: ./setup-waf-rules.sh YOUR_API_TOKEN YOUR_ACCOUNT_ID YOUR_ZONE_ID

set -e

API_TOKEN="${1:?Error: API Token required}"
ACCOUNT_ID="${2:?Error: Account ID required}"
ZONE_ID="${3:?Error: Zone ID required}"

echo "=== Cloudflare WAF Rules Setup ==="
echo "Account ID: $ACCOUNT_ID"
echo "Zone ID: $ZONE_ID"
echo ""

# Create ruleset
echo "Creating WAF ruleset..."
RULESET_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Block Scraper Traffic",
    "description": "Block scrapers and legacy URLs to reduce CF quota consumption",
    "type": "http",
    "phase": "http_request_firewall_custom"
  }')

RULESET_ID=$(echo "$RULESET_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$RULESET_ID" ]; then
  echo "Failed to create ruleset"
  echo "$RULESET_RESPONSE"
  exit 1
fi

echo "Ruleset created: $RULESET_ID"
echo ""

# Add Rule 1: Block legacy URLs
echo "Adding Rule 1: Block legacy URLs..."
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"rules\": [
      {
        \"action\": \"block\",
        \"expression\": \"http.request.uri.path matches '^/(zh-hant|zh-cn)/.*'\",
        \"description\": \"Block legacy URL paths\"
      }
    ]
  }"
echo ""

# Add Rule 2: Block known scrapers
echo "Adding Rule 2: Block known scrapers..."
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"rules\": [
      {
        \"action\": \"block\",
        \"expression\": \"http.request.headers.user_agent matches '(?i)(MJ12bot|Semrushbot|AhrefsBot|DotBot|scrapy|python-requests|curl)'\",
        \"description\": \"Block known scrapers\"
      }
    ]
  }"
echo ""

# Add Rule 3: Block empty search requests from bots
echo "Adding Rule 3: Block empty search requests from bots..."
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"rules\": [
      {
        \"action\": \"block\",
        \"expression\": \"http.request.uri.path matches '^/search' and http.request.uri.query == '' and http.user_agent contains 'bot'\",
        \"description\": \"Block bot requests to /search without query parameter\"
      }
    ]
  }"
echo ""

echo "=== Setup Complete ==="
echo "Ruleset ID: $RULESET_ID"
echo ""
echo "Rules are now active. Blocked requests will return 403 at the edge."
echo ""
echo "To view rules:"
echo "  curl -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "       \"https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules\""
