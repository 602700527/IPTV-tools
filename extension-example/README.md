# IPTV Helper - Chrome 扩展

自动为 IPTV 视频流添加必要的请求头（如 User-Agent），解决 CORS 跨域问题。

---

## 📁 文件结构

```
extension-example/
├── manifest.json    # 扩展配置（v2.2）
├── background.js    # 后台服务脚本
├── content.js      # ISOLATED world 脚本
├── main-world.js  # MAIN world 脚本
├── popup.html      # 扩展弹出页面
└── icons/         # 图标目录（可选）
```

---

## 🚀 安装步骤

### 1. 打开扩展管理页面
在 Chrome 地址栏输入：
```
chrome://extensions/
```

### 2. 启用开发者模式
点击右上角的"开发者模式"开关

### 3. 加载扩展
点击"加载已解压的扩展程序"，选择 `extension-example` 文件夹

### 4. 验证安装
扩展列表中应该看到 "IPTV Helper"

---

## 🔧 使用方法

### 自动添加 Headers

页面可以自动调用扩展添加 Headers：

```javascript
if (window.IPTVHelper) {
  await window.IPTVHelper.addHeaders({
    'User-Agent': 'iPhone',
    'Referer': 'https://example.com'
  });
}
```

### 获取配置的 Headers

```javascript
if (window.IPTVHelper) {
  const headers = await window.IPTVHelper.getHeaders('https://example.com/stream.m3u8');
  console.log('Headers:', headers);
}
```

### 手动配置

1. 点击浏览器工具栏的扩展图标
2. 点击"手动添加源站"
3. 输入域名或 IP
4. 配置 Headers（JSON 格式）
5. 点击"刷新配置列表"

---

## 🛠️ 工作原理

### 双 World 架构

**ISOLATED World** (content.js):
- 独立的 JavaScript 环境
- 可以访问 chrome API
- 拦截网络请求，添加 Headers

**MAIN World** (main-world.js):
- 与页面共享 window 对象
- 暴露 API 给页面使用
- 通过 postMessage 与 ISOLATED world 通信

### 通信流程

```
页面脚本 → MAIN World → ISOLATED World → Chrome Extension
```

---

## 📋 功能特性

- ✅ 自动添加 User-Agent、Referer 等 Headers
- ✅ 支持 HLS (m3u8) 和原生视频格式
- ✅ 解决 CORS 跨域问题
- ✅ 自动检测和配置源站
- ✅ 手动添加和管理源站配置

---

## ❓ 常见问题

### Q: 页面检测不到扩展？

**A**: 检查以下内容：
1. 扩展是否已加载（chrome://extensions/）
2. 控制台是否有 `[IPTV Helper]` 日志
3. 刷新页面（Ctrl+F5）

### Q: Mixed Content 错误？

**A**: HTTPS 页面不能加载 HTTP 视频，解决方案：
- 将视频源改为 HTTPS
- 使用代理转发
- 本地测试时使用 HTTP

### Q: Headers 不生效？

**A**: 检查：
1. 域名是否匹配配置
2. 扩展规则是否正确设置
3. 查看网络请求的 Headers

---

## 📞 支持

如有问题，请：
1. 打开浏览器控制台（F12）查看日志
2. 打开 Service Worker 查看后台日志

---

**版本**: 2.2
**更新日期**: 2025-12-26
