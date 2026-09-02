#!/bin/bash
# =================================================================
# Production deploy script - bypasses wrangler, preserves R2 binding
# =================================================================
# Usage:
#   CLOUDFLARE_API_TOKEN=cfut_xxx ./deploy.sh
#
# Steps:
#   1. Build worker with wrangler (--dry-run + --outdir)
#   2. PUT bundled script to Cloudflare API with R2 binding in metadata
# =================================================================

set -e

ACCOUNT_ID="83bc7552e54dd94303f04ef8d7429066"
SCRIPT_NAME="cf-tv-service-production"
# Windows-compatible temp dir (Git Bash maps /tmp to %TEMP%)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  OUT_DIR="$(cygpath -u "$TEMP")/cf-deploy-$$"
else
  OUT_DIR="/tmp/cf-deploy-$$"
fi

# Parse main filename from wrangler.toml (wrangler outputs to that name, not fixed worker.js)
MAIN_FILE=$(grep -E '^main[[:space:]]*=' wrangler.toml | head -1 | sed -E 's/^main[[:space:]]*=[[:space:]]*"?([^"]+)"?$/\1/' | xargs basename)
if [ -z "$MAIN_FILE" ]; then
  MAIN_FILE="worker.js"
fi
echo "    Main file (from wrangler.toml): $MAIN_FILE"

# 1. Build bundled worker
echo "==> Building worker..."
mkdir -p "$OUT_DIR"
# ponytail: --config wrangler.toml 让 wrangler 找到 main=worker-entry.js
# 不传 --config 会忽略 wrangler.toml 的 main，强制找 worker.js
npx wrangler deploy --config wrangler.toml --env production --outdir="$OUT_DIR" --dry-run > /dev/null 2>&1 || true
# --dry-run exits early but writes the bundle. Fall back to regular build if needed.
if [ ! -f "$OUT_DIR/$MAIN_FILE" ]; then
  echo "    dry-run didn't produce bundle, building for real..."
  npx wrangler deploy --config wrangler.toml --env production --outdir="$OUT_DIR" > /dev/null 2>&1
fi

if [ ! -f "$OUT_DIR/$MAIN_FILE" ]; then
  echo "Build failed - no $OUT_DIR/$MAIN_FILE"
  exit 1
fi

echo "    Bundle: $(wc -c < "$OUT_DIR/$MAIN_FILE") bytes"
echo "    OUT_DIR=$OUT_DIR"
ls -la "$OUT_DIR/"

# 2. Build metadata with ALL bindings (including R2)
# ponytail: main_module 跟 wrangler.toml 的 main 文件名一致
echo "==> Uploading with bindings..."
METADATA=$(cat <<EOF
{
  "main_module": "$MAIN_FILE",
  "bindings": [
    {"type": "r2_bucket", "name": "R2_BUCKET", "bucket_name": "static-assets"},
    {"type": "kv_namespace", "name": "KV", "namespace_id": "d5e943d023d0474382b04b3c15c47ffb"},
    {"type": "d1", "name": "DB", "id": "9c7c22f1-fa0e-48da-8874-19731483c550"},
    {"type": "ai", "name": "AI"},
    {"type": "plain_text", "name": "TIMEZONE", "text": "Asia/Shanghai"},
    {"type": "plain_text", "name": "FROM_EMAIL", "text": "support@iptv-search.com"},
    {"type": "plain_text", "name": "GOOGLE_CLIENT_ID", "text": "1070165774283-e75bs3en213p81iaq3g5dmpt15e6te9l.apps.googleusercontent.com"},
    {"type": "plain_text", "name": "APP_URL", "text": "https://iptv-search.com"},
    {"type": "plain_text", "name": "XUNHUPAY_GATEWAY", "text": "https://api.xunhuweb.com/payment/do.html"},
    {"type": "plain_text", "name": "STATIC_SOURCE", "text": "local"},
    {"type": "plain_text", "name": "STATIC_OUTPUT_DIR", "text": "static-output"},
    {"type": "plain_text", "name": "USD_WORKER_URL", "text": "https://epusdt.iptv-search.com"},
    {"type": "plain_text", "name": "USD_API_AUTH_TOKEN", "text": "fc8afe257db9841f2b25a52f7055ef417b06a00c36067a81000ceb6c2d5b2b9d"}
  ]
}
EOF
)

# 3. PUT to Cloudflare API (use main_module for ES module worker)
# Convert Unix path to Windows path for curl (Cygwin/MSYS/Git Bash on Windows)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  WORKER_FILE="$(cygpath -w "$OUT_DIR/$MAIN_FILE")"
else
  WORKER_FILE="$OUT_DIR/$MAIN_FILE"
fi
echo "    Uploading: $WORKER_FILE"
RESPONSE=$(curl -sS --tls-max 1.2 --max-time 180 -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${SCRIPT_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -F "metadata=${METADATA}" \
  -F "main_module=@${WORKER_FILE};type=application/javascript+module")

# Check result (allow optional whitespace after colon - CF API returns JSON with spaces)
if echo "$RESPONSE" | grep -q '"success":\s*true'; then
  echo "Deployed successfully"
  echo "$RESPONSE" | head -c 200
  echo
else
  echo "Deploy failed:"
  echo "$RESPONSE"
  exit 1
fi

# Purge CDN cache so the new code is visible immediately (cache TTL is 1h on homepage)
ZONE_ID="d59d3242de0a6aee90f84a242f4228dc"
echo "==> Purging CDN cache for iptv-search.com..."
PURGE_RESPONSE=$(curl -sS --tls-max 1.2 --max-time 60 -X POST \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"files":["https://iptv-search.com/","https://iptv-search.com"]}')

if echo "$PURGE_RESPONSE" | grep -q '"success":\s*true'; then
  echo "Cache purged"
else
  echo "Cache purge failed (non-fatal - deploy still succeeded):"
  echo "$PURGE_RESPONSE" | head -c 300
  echo
fi

# Purge sitemap too (cache TTL is 1h on sitemap)
curl -sS --tls-max 1.2 --max-time 60 -X POST \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"files":["https://iptv-search.com/sitemap.xml"]}' > /dev/null 2>&1 || true

# Static pages are regenerated by the production scheduler - do not trigger manually here
# (was previously calling /api/admin/refresh-static with ADMIN_KEY, removed per request)

# Cleanup
rm -rf "$OUT_DIR"
