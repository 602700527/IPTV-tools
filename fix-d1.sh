#!/bin/bash
# D1 数据库快速修复脚本

set -e

echo "=== D1 数据库诊断和修复 ==="
echo ""

# 1. 检查 D1 数据库列表
echo "1. 检查 D1 数据库列表..."
wrangler d1 list
echo ""

# 2. 测试 D1 连接
echo "2. 测试 D1 连接..."
wrangler d1 execute tv-service-db --command="SELECT 1 as test" || {
    echo "❌ D1 连接失败"
    echo ""
    echo "3. 尝试创建 D1 数据库..."
    wrangler d1 create tv-service-db
    echo ""
    echo "⚠️  请更新 wrangler.toml 中的 database_id"
    read -p "按回车键继续..."
}
echo ""

# 3. 检查表结构
echo "3. 检查现有表结构..."
wrangler d1 execute tv-service-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
echo ""

# 4. 部署 Worker
echo "4. 部署 Worker..."
wrangler deploy
echo ""

# 5. 测试生产环境 D1
echo "5. 测试生产环境 D1 连接..."
curl -s https://iptv-search.com/test/d1 | python -m json.tool
echo ""

echo "=== 修复完成 ==="
echo ""
echo "如果问题仍然存在，请查看："
echo "1. Cloudflare Dashboard -> Workers & Pages -> cf-tv-service -> Logs"
echo "2. D1_TROUBLESHOOTING.md 文件"
