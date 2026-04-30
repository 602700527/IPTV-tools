## Why

当前项目需要配套的视频播放器来支持详情页点击播放的需求。现有播放链接格式多样（m3u8、php接口、flv），且存在HTTP/HTTPS协议不一致导致的跨协议播放问题。需要开发独立部署在Cloudflare Pages的播放器，自动处理各种链接格式和协议问题，提供流畅的播放体验。

## What Changes

- 新建独立的CF Pages播放器项目
- 支持M3U8 HLS流媒体播放（hls.js）
- 支持FLV格式播放（flv.js）
- 支持PHP接口链接：先请求PHP获取真实播放地址再播放
- HTTP链接通过CF Worker代理转发，解决跨协议问题
- 播放器UI：播放控制、返回按钮、播放状态提示
- 响应式设计，支持移动端

## Capabilities

### New Capabilities

- `hls-playback`: M3U8 HLS流媒体播放能力，使用hls.js库，支持直接播放HTTPS链接
- `flv-playback`: FLV格式播放能力，使用flv.js库
- `php-url-resolver`: PHP接口解析能力，播放器先请求PHP接口获取真实播放URL
- `http-proxy`: HTTP链接代理能力，通过CF Worker将HTTP播放链接转为可用的播放流
- `player-frontend`: 播放器前端UI，包含播放控制条、返回入口、加载状态、错误提示

### Modified Capabilities

（无）

## Impact

- 新增 CF Pages 播放器项目
- 播放器URL格式：`https://<subdomain>.workers.dev/?url=<encoded_play_url>&return=<encoded_return_url>`
- 支持画中画（Picture-in-Picture）模式
- PHP链接直接访问，服务器自动重定向到播放地址
- 依赖外部库：hls.js、flv.js
- 本项目详情页点击播放时跳转到播放器URL