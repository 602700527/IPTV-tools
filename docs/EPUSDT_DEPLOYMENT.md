# epusdt-workers 部署指南

USDT (TRC20) 收款服务。和你现在用的 Cloudflare Workers 技术栈一致，
部署后通过 HTTP API 给 cfworker2 调用。

## 概览

```
用户付款 USDT ──→ Tronscan 公开 API（每分钟 cron 轮询）
                          ↓
                   epusdt-workers（CF Worker）
                          ↓
                   POST notify_url ──→ cfworker2 webhook
                          ↓
                   叠加订阅（与现有 generateActivationCode 共用）
```

## 准备工作

- 已登录 wrangler（`npx wrangler whoami` 验证）
- 一个 TRC20 USDT 钱包地址（手边没有可临时跳过，本地测试用 `TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 占位）

## 部署步骤

### 1. 克隆项目

```bash
git clone --depth 1 https://github.com/xiaohuilam/epusdt-workers.git
cd epusdt-workers
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建 D1 数据库

```bash
npx wrangler d1 create epusdt-workers
```

**复制输出里的 `database_id`**，下一步要填。

### 4. 修改 wrangler.toml

复制 `wrangler.toml.example` 为 `wrangler.toml`，按下面填：

```toml
name = "epusdt-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
APP_NAME = "epusdt"
APP_URI = "https://epusdt.YOUR-SUBDOMAIN.workers.dev"  # 部署后改为真实 URL
APP_DEBUG = "false"
API_AUTH_TOKEN = "随机生成一个长字符串，例如：openssl rand -hex 32"
ORDER_EXPIRATION_TIME = "10"   # 订单 10 分钟过期
FORCED_USDT_RATE = ""          # 留空用 Binance 实时汇率

[[d1_databases]]
binding = "DB"
database_name = "epusdt-workers"
database_id = "上一步输出的 ID"

[triggers]
crons = ["* * * * *"]
```

### 5. 初始化表结构

```bash
npx wrangler d1 execute epusdt-workers --file=./schema.sql
```

### 6. 添加 USDT 钱包地址

```bash
npx wrangler d1 execute epusdt-workers --command \
  \"INSERT INTO wallet_address (token, status, created_at, updated_at) VALUES ('你的TRC20地址', 1, $(date +%s%3N), $(date +%s%3N));"
```

> 多个地址可以反复加。系统会按金额匹配到空闲的 (地址, 金额) 组合。

### 7. 部署

```bash
npx wrangler deploy
```

部署成功后会输出 Worker URL，类似：
```
Published epusdt-worker
  https://epusdt-worker.YOUR-SUBDOMAIN.workers.dev
```

### 8. 把真实 URL 回填 wrangler.toml 并重新部署

```toml
APP_URI = "https://epusdt-worker.YOUR-SUBDOMAIN.workers.dev"
```

```bash
npx wrangler deploy
```

### 9. 验证

```bash
curl https://epusdt-worker.YOUR-SUBDOMAIN.workers.dev/
# → hello epusdt-workers, ...
```

## cfworker2 接入所需

部署完告诉我这两项：

1. **`API_AUTH_TOKEN`** —— wrangler.toml 里的字符串
2. **Worker URL** —— 比如 `https://epusdt-worker.YOUR-SUBDOMAIN.workers.dev`

我会写入 cfworker2 的 secrets 并配置 webhook URL：
`https://iptv-search.com/api/subscription/usdt/webhook`

## API 契约（cfworker2 调用时用）

### 创建订单

```
POST {WORKER_URL}/api/v1/order/create-transaction
Content-Type: application/json

{
  "order_id": "TV17869367435757M0DWQ",   // cfworker2 自己的订单号
  "amount": "29.00",                     // CNY 金额（必填）
  "notify_url": "https://iptv-search.com/api/subscription/usdt/webhook",
  "redirect_url": "https://iptv-search.com/account?payment=success",  // 可选
  "currency": "CNY",                     // 可选，默认 CNY
  "signature": "MD5(amount=29.00&...)"   // 见下
}
```

签名算法：
1. 去掉 `signature` 字段和空值
2. 按 key 字典序排序
3. `key1=value1&key2=value2` 拼接
4. 末尾追加 `API_AUTH_TOKEN`
5. MD5 哈希（小写）

### 查订单状态

```
GET {WORKER_URL}/pay/check-status/{trade_id}
```

返回 `{status: 2, ...}` 表示已支付。

### Webhook 回调

epusdt 收到链上确认后，POST 到 `notify_url`：
```json
{
  "trade_id": "T...",
  "order_id": "TV...",
  "amount": "29.00",
  "actual_amount": "4.1234",
  "token": "T...",
  "block_transaction_id": "...",
  "status": 2,
  "currency": "CNY",
  "signature": "MD5(...)"
}
```

cfworker2 必须验签 + 校验 order_id 归属，**返回字符串 `success` 或 `ok`**，
否则 epusdt 会重试。

## 限额

- `actual_amount` 精度 0.0001 USDT（4 位小数）
- 系统按金额轮询找空闲 (地址, 金额) 组合，最多向上递增 100 次
- 单笔订单过期时间 `ORDER_EXPIRATION_TIME` 分钟（默认 10）
- cron 每分钟跑一次，所以最长 1 分钟确认到账