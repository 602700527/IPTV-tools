# HTTP Proxy Spec

## Overview

通过CF Worker代理HTTP播放链接，解决跨协议（HTTPS页面播放HTTP流）问题。

## Requirements

### Proxy Endpoint
- Worker URL: `https://proxy.<namespace>.workers.dev/`
- 请求方式：GET
- 路径：完整目标URL作为path

### Request Handling
1. 接收请求：`/https://target.com/stream.m3u8`
2. 提取目标URL
3. 添加必要Headers：
   - `User-Agent`: 模拟浏览器
   - `Referer`: 如果需要
   - `Origin`: 如果需要
4. 转发请求到目标服务器
5. 流式返回响应

### Response Handling
- 保持原始Content-Type
- 处理CORS相关headers
- 流式传输，不缓冲大文件

### Error Handling
- 目标不可达：返回502错误
- 超时：返回504错误
- 目标返回错误：透传错误状态码