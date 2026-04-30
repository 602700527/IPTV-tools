## Context

当前项目（cfworker2）是一个TV streaming服务，用户在详情页点击播放时需要跳转到专门的播放器。目前缺少配套播放器，需要独立开发部署在Cloudflare Pages的播放器。

播放链接类型：
- M3U8（HLS流）：标准格式，主流
- PHP接口链接：需要先请求获取真实播放地址
- FLV：Flash视频格式，需要flv.js播放
- HTTP vs HTTPS：某些https链接可能重定向到http，需要CF代理

## Goals / Non-Goals

**Goals:**
- 独立部署在CF Pages的播放器
- 支持m3u8、flv、php接口等播放格式
- 自动识别并处理HTTP/HTTPS协议问题
- 响应式UI设计，交互友好
- 提供返回原页面的入口

**Non-Goals:**
- 不实现PHP服务器端逻辑，只负责播放
- 不做视频下载功能
- 不支持RTMP等特殊协议

## Decisions

### 1. 播放器技术选型

**决定**: 单页HTML + 原生JavaScript + CDN库

**理由**:
- 最简单部署：CF Pages直接托管静态HTML
- 无需构建工具，调试方便
- CDN引入hls.js和flv.js，减少包体积

**替代方案**:
- Vue/React SPA：过于复杂，不需要路由
- Workers嵌入播放器：增加延迟，不必要

### 2. 播放链接识别与处理

**播放流程判断逻辑**:

```
1. 获取url参数
2. 判断是否为php接口（.php结尾或包含php参数）
   → 是：fetch(url)获取真实地址，再判断类型
   → 否：直接判断类型
3. 判断播放格式
   → .m3u8 → hls.js播放
   → .flv → flv.js播放
4. 判断协议
   → https直接播放
   → http → 通过CF Worker代理转发
```

### 3. HTTP代理方案

**决定**: 前端直接播放 + CF Worker代理兜底

**理由**:
- hls.js/flv.js通常支持跨域播放
- 复杂情况通过Worker代理转发
- CF Worker代理：创建 `https://proxy.xxx.workers.dev/` 接收请求并转发到目标URL

**替代方案**:
- 后端代理：增加复杂度，当前不需要
- CORS代理：可能引入其他问题

### 4. 播放器UI设计

**决定**: 使用设计skill进行U设计

**组件**:
- 视频容器（全屏）
- 顶部导航栏（返回按钮 + 标题）
- 播放控制条（播放/暂停、时间、进度条、全屏）
- 加载遮罩（播放前显示loading）
- 错误提示（播放失败时显示）

### 5. URL参数设计

```
播放器地址: https://<subdomain>.workers.dev/?url=<编码的播放链接>&return=<编码的来源页面>
```

- `url`: Base64编码的播放链接
- `return`: Base64编码的返回目标URL（可选，默认返回上一页）

## Risks / Trade-offs

[风险] PHP接口返回的URL可能也是需要代理的http链接  
→ 缓解：递归判断返回的URL协议，必要时走代理

[风险] 某些m3u8有防盗链验证  
→ 缓解：在代理层面添加常见referer/UA头

[风险] 移动端全屏播放体验  
→ 缓解：使用video原生全屏API，适配触摸操作

## Migration Plan

1. 创建CF Pages项目（可选workers.dev子域或自定义域名）
2. 编写index.html播放器页面
3. 创建CF Worker代理（http-proxy）
4. 配置本项目详情页播放跳转逻辑
5. 测试各类型链接播放
6. 部署上线

## Open Questions

1. 播放器部署的子域名前缀？（建议player或tv-player）
2. 是否需要支持播放历史/记忆功能？
3. 是否需要支持画中画模式？