#!/bin/bash
# 同步过滤功能测试脚本

ADMIN_KEY="${ADMIN_KEY:-admin-key-please-change-in-production}"
BASE_URL="http://127.0.0.1:8787"

echo "=== 同步过滤功能测试 ==="
echo ""

# 1. 检查数据库配置
echo "1. 检查本地数据库 sync_filter_config:"
npx wrangler d1 execute tv-service-db --local --command "SELECT value FROM settings WHERE key = 'sync_filter_config'" 2>&1 | head -20
echo ""

# 2. 测试 GET API
echo "2. 测试 GET /admin/sync/filter:"
curl -s "$BASE_URL/admin/sync/filter" -H "X-Admin-Key: $ADMIN_KEY" 2>&1
echo ""
echo ""

# 3. 测试 POST API（保存配置）
echo "3. 测试 POST /admin/sync/filter:"
curl -s -X POST "$BASE_URL/admin/sync/filter" \
  -H "X-Admin-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "excludeGroups": ["China", "Hong Kong", "Taiwan", "Macao", "测试"],
    "excludeUrls": ["hebttv.com", "cztv.com", "188766.xyz"],
    "excludeNames": ["Geo-blocked", "解说", "轮播", "盗", "Semifinal"],
    "excludeDuplicateUrls": true,
    "groupRenameRules": [
      {"keyword": "港", "newName": "港澳台[墙外]"},
      {"keyword": "MyTV", "newName": "港澳台[墙外]"},
      {"keyword": "澳", "newName": "港澳台[墙外]"},
      {"keyword": "Juli", "newName": "港澳台[墙外]"},
      {"keyword": "渣", "newName": "港澳台[墙外]"}
    ],
    "groupRenameExclude": []
  }' 2>&1
echo ""
echo ""

# 4. 验证配置已保存
echo "4. 验证配置已保存:"
curl -s "$BASE_URL/admin/sync/filter" -H "X-Admin-Key: $ADMIN_KEY" 2>&1
echo ""
echo ""

# 5. 测试同步全部（异步模式）
echo "5. 测试 POST /admin/sync/all (async mode):"
curl -s -X POST "$BASE_URL/admin/sync/all" \
  -H "X-Admin-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"excludeGroups":["测试"],"async":true}' 2>&1
echo ""
echo ""

echo "=== 测试完成 ==="