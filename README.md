# IPTV流媒体源扫描测试工具

## 项目简介

本工具由两个核心组件构成：

### 脚本组成

1. **IPTVtester.py** - 直播源测试工具

   - 实现实时流媒体有效性验证
   - 支持HLS/RTMP/HTTP-FLV协议检测
   - 自动识别视频编码格式
   - 支持视频源归属地检测
2. **source_scanning.py** - 扫源神器

   - 管理自动化扫描任务队列
   - 生成连续测试链接模式
   - 集成图形化操作界面

## 主要功能特性

- 🚀 自动URL范围解析：支持 `http://example.com/stream001-005.m3u8`格式自动生成连续测试链接
- 🔍 智能质量检测：实时检测视频分辨率(支持自定义阈值)和编码格式
- 📋 结果可视化：图形界面实时展示有效流媒体源及技术参数
- ⚙️ 配置持久化：自动保存/加载测试参数配置
- 📁 结果导出：自动保存有效源到指定文本文件

## 环境要求

- Python 3.8+
- FFmpeg (需包含ffprobe)

## 安装步骤

1. 安装FFmpeg：
   - Windows: [下载地址](https://www.gyan.dev/ffmpeg/builds/)
   - Mac: `brew install ffmpeg`
2. 安装Python依赖：
   ```bash
   pip install tkinter tqdm
   ```

## 使用说明

1. **直播源测试工具**：

```bash
   python IPTVtester.py [流媒体URL] [--timeout 10] [--output result.json]
```

2. **扫源神器**：

   ```bash
   python source_scanning.py
   ```

## 或直接下载exe文件使用

https://github.com/602700527/IPTV-tools/raw/refs/heads/main/dist/IPTVtester.exe

https://github.com/602700527/IPTV-tools/raw/refs/heads/main/dist/source_scanning.exe

## 配置文件说明

程序根目录下 `stream_tester_config.json`保存以下配置项：

```json
{
  "url": "测试URL模板",
  "output_file": "输出文件路径",
  "width_threshold": 860,
  "height_threshold": 480
}
```

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

## 开源协议

本项目基于MIT协议开源，欢迎二次开发。使用请遵守FFmpeg的LGPL协议要求。
