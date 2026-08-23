# Components 目录

通用页面组件。

## 文件清单

- `page-header.js` — 通用页头（`PAGE_HEADER` 常量，所有页面导入使用）
- `page-footer.js` — 通用页脚（`PAGE_FOOTER` 常量，含 FAQ、广告延迟加载）
- `head-scripts.js` — 头部脚本注入
- `floating-sidebar.js` — 浮动侧边栏
- `minimal-base.js` — 最小基础页壳
- `toast.js` — 轻提示组件

## 使用示例

```javascript
import { PAGE_HEADER } from '../components/page-header.js'
import { PAGE_FOOTER } from '../components/page-footer.js'

const html = `${PAGE_HEADER}${pageContent}${PAGE_FOOTER}`
```