# Site Header Component 使用指南

## 组件介绍

`site-header.js` 提供了统一的页头组件，包含：
- Logo + 品牌名称
- 搜索框（可隐藏）
- 收藏、套餐、主题切换、账户按钮
- 语言切换器容器
- 完整的响应式设计

## 导入方式

```javascript
import { 
  generateSiteHeader, 
  SITE_HEADER_STYLES, 
  SITE_HEADER_SCRIPTS,
  generateCompleteSiteHeader 
} from './components/site-header.js';
```

## 使用示例

### 1. 基础使用

```javascript
import { generateSiteHeader, SITE_HEADER_STYLES } from './components/site-header.js';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title</title>
  <style>
    ${SITE_HEADER_STYLES}
    /* 页面其他样式 */
  </style>
</head>
<body>
  ${generateSiteHeader({ origin: 'https://iptv-search.com' })}
  
  <!-- 页面内容 -->
  <main>Content here</main>
  
  <script>
    ${SITE_HEADER_SCRIPTS}
  </script>
</body>
</html>`;
```

### 2. 高亮当前导航

```javascript
// 收藏页 - 高亮收藏按钮
${generateSiteHeader({ 
  origin: 'https://iptv-search.com',
  activeNav: 'favorites'  // 可选: 'home', 'favorites', 'plans', 'account'
})}

// 套餐页 - 高亮套餐按钮
${generateSiteHeader({ 
  origin: 'https://iptv-search.com',
  activeNav: 'plans'
})}

// 账户页 - 高亮账户按钮
${generateSiteHeader({ 
  origin: 'https://iptv-search.com',
  activeNav: 'account'
})}
```

### 3. 隐藏搜索框

```javascript
// 某些页面可能不需要搜索框
${generateSiteHeader({ 
  origin: 'https://iptv-search.com',
  showSearch: false
})}
```

### 4. 完整组件（推荐）

```javascript
import { generateCompleteSiteHeader } from './components/site-header.js';

const header = generateCompleteSiteHeader({
  origin: 'https://iptv-search.com',
  activeNav: 'favorites'
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title</title>
  <style>
    ${header.styles}
    /* 页面其他样式 */
  </style>
</head>
<body>
  ${header.html}
  
  <!-- 页面内容 -->
  <main>Content here</main>
  
  <script>
    ${header.scripts}
    // 页面其他脚本
  </script>
</body>
</html>`;
```

## 在现有页面中替换

### 替换收藏页页头

```javascript
// favorites-page.js
import { generateSiteHeader, SITE_HEADER_STYLES, SITE_HEADER_SCRIPTS } from '../components/site-header.js';

export function generateFavoritesPage(options = {}) {
  const { origin = 'https://iptv-search.com' } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... 其他 head 内容 ... -->
  <style>
    ${SITE_HEADER_STYLES}
    /* 收藏页特有样式 */
  </style>
</head>
<body>
  ${generateSiteHeader({ origin, activeNav: 'favorites' })}
  
  <!-- 收藏页内容 -->
  <main class="page-container">
    <!-- ... -->
  </main>
  
  <script>
    ${SITE_HEADER_SCRIPTS}
    // 收藏页脚本
  </script>
</body>
</html>`;
}
```

### 替换分类页页头

```javascript
// category-page.js
import { generateSiteHeader, SITE_HEADER_STYLES, SITE_HEADER_SCRIPTS } from '../components/site-header.js';

export function generateCategoryPage(options = {}) {
  const { origin = 'https://iptv-search.com', category, slug } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... 其他 head 内容 ... -->
  <style>
    ${SITE_HEADER_STYLES}
    /* 分类页特有样式 */
  </style>
</head>
<body>
  ${generateSiteHeader({ origin })}
  
  <!-- 面包屑导航 -->
  <nav class="breadcrumb">...</nav>
  
  <!-- 分类页内容 -->
  <main class="page-layout">
    <!-- ... -->
  </main>
  
  <script>
    ${SITE_HEADER_SCRIPTS}
    // 分类页脚本
  </script>
</body>
</html>`;
}
```

## 样式变量

组件使用以下 CSS 变量，可在页面中覆盖：

```css
:root {
  --bg-primary: #0a0a0a;      /* 主背景色 */
  --bg-secondary: #141414;    /* 次背景色 */
  --bg-card: #1a1a1a;         /* 卡片背景 */
  --bg-hover: #252525;        /* 悬停背景 */
  --text-primary: #ffffff;    /* 主文字 */
  --text-secondary: #a0a0a0;  /* 次文字 */
  --text-muted: #666666;      /* 弱化文字 */
  --accent: #e50914;          /* 主题色 */
  --accent-hover: #f6121d;    /* 主题色悬停 */
  --border: rgba(255,255,255,0.08);     /* 边框 */
  --border-hover: rgba(255,255,255,0.15); /* 边框悬停 */
  --shadow: 0 4px 20px rgba(0,0,0,0.5); /* 阴影 */
  --radius: 8px;              /* 圆角 */
  --transition: 0.2s ease;    /* 过渡动画 */
}

[data-theme="light"] {
  /* 亮色模式变量 */
}
```

## 注意事项

1. **CSS 变量冲突**: 如果页面已定义相同的 CSS 变量，确保值一致
2. **样式隔离**: 所有样式都以 `.site-header` 为前缀，避免污染全局样式
3. **脚本重复**: 确保 `SITE_HEADER_SCRIPTS` 只引入一次
4. **语言切换器**: 需要额外引入 translate.js 才能正常工作

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

支持所有现代浏览器，IE 不支持。
