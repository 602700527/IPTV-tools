# PHP URL Resolver Spec

## Overview

PHP链接会被服务器端重定向到真实的播放地址，播放器端直接访问即可。

## Requirements

### URL Pattern
- 以`.php`结尾的URL可能包含播放地址
- 服务器端会自动重定向到真实播放链接

### Resolution Flow
1. 识别为PHP链接
2. 直接使用fetch访问（跟随重定向）
3. 最终获取的URL即为播放地址
4. 递归判断返回URL的类型和协议

### Browser Behavior
- fetch默认会跟随重定向
- 最终URL通过`response.url`获取
- 部分PHP接口通过meta refresh或js重定向，需特殊处理