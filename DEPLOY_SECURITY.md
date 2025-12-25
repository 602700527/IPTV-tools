# 安全功能部署指南

## 部署步骤

### 1. 确认代码已更新

检查以下文件是否存在并已更新：

- ✅ `handlers/live-secure.js` - 新的安全播放处理器
- ✅ `handlers/sub.js` - 令牌生成功能
- ✅ `handlers/admin.js` - 安全监控API
- ✅ `admin-page.js` - 安全监控面板
- ✅ `worker.js` - 使用新的live-secure处理器

### 2. 部署到Cloudflare

```bash
# 进入项目目录
cd c:/Users/60270/Desktop/cfworker2

# 部署Worker
wrangler deploy
```

### 3. 验证部署

```bash
# 测试管理后台
curl -I https://sys.iptv-search.com/admin/init \
  -H "X-Admin-Key: your-admin-key"

# 应该返回 200 OK
```

## 功能测试

### 测试1：获取订阅并验证令牌

```bash
# 1. 获取订阅
curl https://sys.iptv-search.com/sub/YOUR_CODE.m3u \
  -o playlist.m3u

# 2. 查看播放地址格式
grep "live/" playlist.m3u

# 应该看到类似：/live/YOUR_CODE/TOKEN/HASH 的格式
```

**预期结果**：每个频道的播放地址包含16位随机令牌

### 测试2：播放令牌验证

```bash
# 1. 使用令牌播放
curl -I "https://sys.iptv-search.com/live/YOUR_CODE/TOKEN/HASH"

# 第一次请求应该返回 302 重定向

# 2. 再次使用同一令牌
curl -I "https://sys.iptv-search.com/live/YOUR_CODE/TOKEN/HASH"

# 应该返回 403 Forbidden: token_already_used
```

**预期结果**：令牌只能使用一次

### 测试3：令牌过期验证

```bash
# 1. 获取订阅后等待10分钟

# 2. 尝试使用令牌
curl -I "https://sys.iptv-search.com/live/YOUR_CODE/TOKEN/HASH"

# 应该返回 403 Forbidden: token_expired
```

**预期结果**：10分钟后令牌自动失效

### 测试4：播放次数限制

```bash
# 快速多次请求同一播放地址
for i in {1..600}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "https://sys.iptv-search.com/live/YOUR_CODE/TOKEN1/HASH"
done

# 注意：每次需要使用不同的令牌
```

**预期结果**：超过500次后返回 429 Too Many Requests

### 测试5：频率限制

```bash
# 快速多次访问同一频道
for i in {1..5}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "https://sys.iptv-search.com/live/YOUR_CODE/TOKEN/HASH"
done
```

**预期结果**：60秒内的后续请求返回 429

### 测试6：安全监控面板

1. 登录管理后台：`https://sys.iptv-search.com/admin`
2. 进入"安全监控"页面
3. 输入测试卡密
4. 点击"查询"

**预期结果**：显示今日播放统计、IP数量、热门频道等

## 监控检查

### 1. 检查KV使用情况

登录 Cloudflare 控制台：
1. 进入 Workers & Pages
2. 选择你的 Worker
3. 点击 KV 链接
4. 查看键数量和大小

**关注点**：
- 令牌键：`token:*`
- 访问记录：`access:*`
- 频率限制：`freq:*`
- 播放限制：`limit:play:*`

### 2. 检查Workers日志

```bash
# 实时查看日志
wrangler tail
```

**关注点**：
- `Abuse detected for code` - 检测到滥用
- `Suspicious activity for code` - 检测到可疑活动
- 403 错误 - 访问被拒绝

### 3. 成本监控

**KV读写成本**：
```
每日读取 = 播放次数 × 验证次数
每日写入 = 令牌数 + 访问记录

估算：1000用户 × 100频道 = 100,000令牌/天
成本：约 $0.05/天
```

## 常见问题

### Q1: 部署后旧的播放地址还能用吗？
A: 不能。旧格式 `/live/{code}/{hash}` 的播放地址已被新格式 `/live/{code}/{token}/{hash}` 替代。

### Q2: 如何回滚到旧版本？
A:
```bash
# 切换回旧的处理器
# 编辑 worker.js:
import { handleLiveRequest } from './handlers/live.js';  # 恢复此行

# 部署
wrangler deploy
```

### Q3: 令牌生成失败？
A: 检查：
1. KV存储是否正常运行
2. 检查Cloudflare配额
3. 查看Workers日志错误

### Q4: 播放器无法播放？
A: 确保播放器：
1. 支持HTTP 302重定向（大部分都支持）
2. 播放前重新获取M3U文件
3. 使用最新的订阅链接

### Q5: 性能影响？
A: 新增了：
- KV读写：每次播放约2次读写
- 验证逻辑：令牌验证 + 频率检查
- 延迟增加：约50-100ms

影响可接受，安全增强显著。

## 安全建议

### 1. 定期检查

建议每日检查：
1. 安全监控面板 - 查看异常卡密
2. KV存储使用量 - 监控存储成本
3. Workers日志 - 查看错误和警告

### 2. 参数调优

根据实际情况调整安全参数（`live-secure.js`）：

```javascript
const SECURITY_CONFIG = {
  TOKEN_TTL: 600,              // 令牌有效期（秒）
  TOKEN_MAX_USES: 1,            // 令牌使用次数
  DAILY_PLAY_LIMIT: 500,         // 每日播放限制
  PLAY_FREQUENCY_LIMIT: 60,       // 频率限制（秒）
  SUSPICIOUS_IP_THRESHOLD: 10,    // 可疑IP阈值
  ABUSE_THRESHOLD: 100           // 滥用访问阈值
};
```

**调优建议**：
- 正常用户多：提高 `DAILY_PLAY_LIMIT`
- 严格防滥用：降低 `TOKEN_TTL`
- 减少误报：提高 `SUSPICIOUS_IP_THRESHOLD`

### 3. 处理异常卡密

发现异常后：
1. 禁用卡密（管理后台 → 卡密管理 → 禁用）
2. 联系用户确认
3. 必要时发放新卡密
4. 记录异常日志

## 性能优化

### 1. 减少KV操作

当前实现：
- 每次播放：约3次KV读写
- 可优化：批量操作

### 2. 缓存优化

当前实现：
- 缓存时间：2分钟
- 可调整：根据实际情况

### 3. 清理策略

建议定期清理：
- 过期令牌（自动10分钟清理）
- 旧的访问记录（TTL自动清理）

## 成本估算

### KV存储成本

**1000个活跃卡密，每人看100个频道/天**：

| 项目 | 数量/天 | 大小 | 成本/天 |
|------|----------|------|----------|
| 令牌 | 100,000 | ~20MB | $0.02 |
| 访问记录 | 1,000 | ~100KB | $0.0005 |
| 频率限制 | 50,000 | ~1MB | $0.001 |
| 播放限制 | 1,000 | ~20KB | $0.0001 |
| **总计** | - | - | **~$0.022** |

**月成本**：约 $0.66

### Workers执行成本

- 请求：免费额度 100,000 请求/天
- 超出：$0.50/百万请求

假设 50,000 播放/天：
- 成本：$0.025/天

**总成本/月**：约 $2-3（含KV和Workers）

## 总结

### 安全增强效果

✅ **防止播放地址分享**：令牌一次性使用
✅ **限制批量访问**：每日播放次数限制
✅ **检测异常行为**：高频访问和异常IP检测
✅ **实时监控**：安全监控面板
✅ **灵活配置**：所有安全参数可调

### 实施建议

1. **先测试环境验证**：确保所有功能正常
2. **逐步推广**：先小范围，再全面推广
3. **密切监控**：第一周密切关注数据
4. **及时调优**：根据实际情况调整参数
5. **用户通知**：说明新的安全机制

---

**部署时间**：2025-12-25
**文档版本**：v1.0
