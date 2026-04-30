# FLV Playback Spec

## Overview

支持FLV格式视频播放的能力，使用flv.js库实现。

## Requirements

### URL Pattern
- 播放链接以`.flv`结尾
- 或PHP接口返回的flv链接

### Playback Logic
1. 检测链接是否为flv格式
2. 判断协议：
   - HTTPS：直接使用flv.js播放
   - HTTP：通过CF Worker代理中转
3. 支持直播和点播模式

### Error Handling
- 链接无效：显示"播放链接无效"
- 加载超时：显示"加载超时，请重试"
- 播放错误：显示具体错误信息

### Browser Support
同hls-playback