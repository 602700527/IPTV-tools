# 流媒体播放器 Chrome 扩展

支持 M3U8(HLS) / FLV / RTMP 的 Chrome 扩展，可自动捕获网页播放地址。

## 目录结构

```
chrome-stream-plugin/
  manifest.json          # MV3 清单配置
  js/
    background.js        # Service Worker（消息路由、新标签页播放）
    content.js           # Content Script（页面注入、测试按钮、URL检测）
    popup.js             # Popup 逻辑（播放器控制、剪贴板播放）
  css/
    popup.css            # Popup 暗黑主题样式
  pages/
    popup.html           # Popup 界面
    player.html          # 独立播放器页面（新标签页）
  lib/
    hls.min.js           # HLS.js（M3U8 播放）
    flv.min.js           # FLV.js（FLV 播放）
  icons/
    icon16/48/128.svg
```

## 功能说明

### 功能一：流媒体播放器
- 弹窗内嵌播放器，支持 M3U8(HLS)、FLV、MP4
- 手动输入 URL 或从页面自动捕获
- 播放历史本地存储

### 功能二：频道页「测试播放」按钮
- Content Script 自动注入「▶ 测试播放」按钮
- 紧邻页面中的「复制」按钮
- 点击后自动复制播放地址并在新标签页打开播放器

### 功能三：剪贴板播放
- Popup 中提供「从剪贴板播放」按钮
- 读取系统剪贴板，在新标签页打开播放器

## 安装步骤

1. 打开 Chrome -> chrome://extensions/
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择文件夹: D:\\Desktop\\cfworker2\\chrome-stream-plugin\\

## 使用方式

### 方式一：频道页测试播放
1. 在频道页找到播放地址的「复制」按钮
2. 点击旁边的「▶ 测试播放」按钮（紫色渐变按钮）
3. 自动复制地址并在新标签页打开播放器

### 方式二：Popup 剪贴板播放
1. 在频道页复制播放地址
2. 点击扩展图标打开 Popup
3. 点击「从剪贴板播放」按钮
4. 新标签页自动打开播放器

### 方式三：手动输入播放
1. 点击扩展图标
2. 在输入框粘贴 M3U8/FLV 地址
3. 点击「播放」

### 方式四：快速测试
点击 Popup 中的「HLS 测试」「FLV 测试」「Apple HLS」按钮验证播放功能

## 技术要点

- Manifest V3: service_worker 替代 background page
- Content Script: 注入所有页面，自动添加测试播放按钮
- 剪贴板: 模拟 execCommand 复制 + clipboard.readText 读取
- 新标签页播放: 复用已有 player 标签或新建，URL 通过 ?url= 参数传递
- hls.js/flv.js: CDN 库内置于 lib/ 目录