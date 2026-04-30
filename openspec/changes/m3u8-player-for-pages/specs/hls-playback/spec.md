# HLS Playback Spec

## Overview

支持M3U8 HLS流媒体播放的核心能力，使用hls.js库实现。

## Requirements

### URL Pattern
- 播放链接以`.m3u8`结尾
- 或PHP接口返回的m3u8链接

### Playback Logic
1. 检测链接是否为m3u8格式
2. 判断协议：
   - HTTPS：直接使用hls.js播放
   - HTTP：通过CF Worker代理中转
3. 自动选择最佳码率

### Error Handling
- 链接无效或过期：显示"播放链接无效"提示
- 网络错误：显示"网络异常，请检查网络连接"
- 解析失败：显示"无法解析视频流"

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+