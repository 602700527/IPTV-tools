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
- 

## 🛠️ 环境配置

Python 3.8+

### 必备组件

- **FFmpeg 安装** （必须配置到系统PATH）：

```bash
# Windows
choco install ffmpeg # 或手动下载 https://www.gyan.dev/ffmpeg/builds/

# macOS
brew install ffmpeg

# Linux
sudoaptinstall ffmpeg
```

* Python依赖安装：

```bash
pip install -r requirements.txt
```

```requirements
requests==2.28.1
python-magic==0.4.27
geoip2==4.2.0
tqdm==4.64.1
```

## 安装步骤

1. 安装FFmpeg：
   - Windows: [下载地址](https://www.gyan.dev/ffmpeg/builds/)
   - Mac: `brew install ffmpeg`
2. 安装Python依赖（实际上可能会缺其他的依赖，缺什么装什么即可）：
   ```bash
   pip install tkinter tqdm
   ```

1. **直播源测试工具**：

## 🚀 快速开始



### 图形界面模式


```bash
# 启动主检测工具（推荐）
python IPTVtester.py

# 启动高级扫描器
python source_scanning.py
```


### 命令行模式


```bash
# 批量检测m3u列表
python IPTVtester.py --input playlist.m3u --output valid_channels.csv

# 自定义检测参数
python IPTVtester.py --timeout 10 --threads 8 --min-bitrate 2000
```


### 直接下载可执行版

[📥 Windows便携版下载](https://github.com/602700527/IPTV-tools/raw/main/dist/IPTVtester.exe)（包含所有依赖项）


## 📖 使用指南


1. **主界面操作流程** ： ![GUI界面截图](https://via.placeholder.com/800x500.png?text=GUI+Demo)
2. 点击 "导入直播源" 选择m3u/txt文件
3. 设置检测参数（或使用预设配置）
4. 开始检测并观察实时进度
5. 导出有效源或启用http服务


## 开源协议

本项目采用 [MIT License](https://file+.vscode-resource.vscode-cdn.net/c%3A/Users/acer/.vscode/extensions/marscode.marscode-extension-1.2.16/LICENSE)，使用时请遵守FFmpeg的[LGPL v2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html)协议要求。商业使用需自行解决版权授权问题。

---

由 [直播源搜索引擎](https://iptv-search.com/) 提供技术支持 | 数据更新于2025年6月
