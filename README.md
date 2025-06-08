# IPTV流媒体源测试工具

## 项目简介

本工具是IPTV直播源测试工具，支持在线文件导入，源归属地识别，启用本地http服务器等等功能，由AI辅助开发。

## 主要功能特性

- 🚀 在线文件导入，自动识别m3u或txt格式
- 🌍源IP归属地查询
- 🔍 智能质量检测：实时检测视频分辨率(支持自定义阈值)和编码格式
- 📋 结果可视化：图形界面实时展示有效流媒体源及技术参数
- ⚙️ 配置持久化：自动保存/加载测试参数配置
- 📁 结果导出：自动保存有效源到指定文本文件
- 🖥 支持启用Http服务器

## 环境要求

- Python 3.8+
- FFmpeg (需包含ffprobe)

## 安装步骤

1. 安装FFmpeg：
   - Windows: [下载地址](https://www.gyan.dev/ffmpeg/builds/)
   - Mac: `brew install ffmpeg`
2. 安装Python依赖（实际上可能会缺其他的依赖，缺什么装什么即可）：
   ```bash
   pip install tkinter tqdm
   ```

## 使用说明

1. **直播源测试工具**：

```bash
   python IPTVtester.py
```

2. **扫源神器**：

   ```bash
   python source_scanning.py
   ```

## 或直接下载exe文件使用

https://github.com/602700527/IPTV-tools/raw/refs/heads/main/dist/IPTVtester.exe

## 技术引用声明

**检测引擎组件**：

- FFmpeg ffprobe 流媒体分析
- requests 网络请求库
- python-magic 文件类型识别
- iP2range 地址范围解析

**扫描控制组件**：

- Tkinter 图形界面框架
- tqdm 进度可视化
- configparser 配置管理

## 开发者

[直播源搜索引擎](https://iptv-search.com)-最新2025全球电视频道直播源在线搜索，包含CCTV、卫视、港澳台、海外频道

## 开源协议

本项目基于MIT协议开源，欢迎二次开发。使用请遵守FFmpeg的LGPL协议要求。
