# Components 目录

## 通用页头组件 (site-header.js)

统一的网站页头组件，提取自首页设计。

### 导出内容

```javascript
import { 
  generateSiteHeader,      // 生成页头 HTML
  SITE_HEADER_STYLES,      // 页头 CSS 样式
  SITE_HEADER_SCRIPTS,     // 页头 JavaScript
  generateCompleteSiteHeader  // 生成完整组件（HTML + CSS + JS）
} from './site-header.js';
```

### 使用示例

```javascript
import { generateSiteHeader, SITE_HEADER_STYLES, SITE_HEADER_SCRIPTS } from './components/site-header.js';

// 在页面中使用
const html = `
  <style>${SITE_HEADER_STYLES}</style>
  ${generateSiteHeader({ 
    origin: 'https://iptv-search.com',
    activeNav: 'favorites'  // 高亮收藏导航
  })}
  <script>${SITE_HEADER_SCRIPTS}</script>
`;
```

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `origin` | string | 'https://iptv-search.com' | 网站域名 |
| `activeNav` | string | '' | 当前激活的导航: 'home', 'favorites', 'plans', 'account' |
| `showSearch` | boolean | true | 是否显示搜索框 |

### 特性

- ✅ 统一的品牌 Logo 和样式
- ✅ 响应式设计（移动端适配）
- ✅ 主题切换（深色/亮色）
- ✅ 导航高亮状态
- ✅ CSS 命名空间隔离（`.site-header`）
- ✅ 完整的 CSS 变量支持

## 文件清单

```
components/
├── site-header.js           # 通用页头组件
├── site-header-usage.md     # 使用指南
├── page-header.js           # 原有页头组件（SEO 页面用）
├── page-footer.js           # 页脚组件
└── README.md                # 本文档
```

## 测试

```bash
# 运行页头组件测试
node test-site-header.js

# 查看示例页面
# 打开 static-preview/site-header-demo.html
```

## 集成到现有页面

参考 `site-header-usage.md` 中的详细说明，替换现有页面的页头部分。

主要步骤：
1. 导入组件
2. 替换页头 HTML
3. 添加 CSS 样式
4. 添加 JavaScript
5. 测试响应式布局
