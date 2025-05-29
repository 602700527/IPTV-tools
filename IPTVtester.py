import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import threading
import re
import subprocess
import os
import webbrowser
from tkinter import ttk
from ip2region_master.binding.python.iptest import searchWithContent, load_xdb_file
import http.server
import socketserver
from threading import Thread

class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, app=None, **kwargs):
        self.app = app
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path == '/result.m3u':
            content = self.app.generate_m3u_content().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-type', 'application/octet-stream')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == '/result.txt':
            content = self.app.generate_txt_content().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_error(404, "File not found")

    def valid_file(self, filename):
        valid_files = ['result.m3u', 'result.txt']
        if filename not in valid_files:
            return False
        filepath = os.path.join(os.getcwd(), filename)
        return os.path.exists(filepath) and os.path.getsize(filepath) > 0

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

class HttpServer:
    def __init__(self, port=8000):
        self.port = port
        self.server = None
        self.thread = None

    def start(self, app):
        handler = lambda *args: HTTPRequestHandler(*args, app=app)
        self.server = ThreadedHTTPServer(('', self.port), handler)
        self.thread = Thread(target=self.server.serve_forever)
        self.thread.start()

    def stop(self):
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            self.thread.join()
            self.server = None

# 初始化IP数据库（只在服务启动时执行一次）
_ = load_xdb_file()

def test_link_with_ffmpeg(url):
    try:
        # 使用ffprobe获取视频的分辨率和编码格式信息
        result = subprocess.run(
            ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,codec_name', '-of', 'csv=p=0', '-i', url],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            startupinfo=subprocess.STARTUPINFO(dwFlags=subprocess.STARTF_USESHOWWINDOW, wShowWindow=subprocess.SW_HIDE),
            timeout=6  # 设置超时时间为6秒
        )
        
        if result.returncode != 0:
            print(f"ffprobe命令失败或超时，无法获取 {url} 的分辨率或编码格式信息。")
            return False, None, None, None, None

        output = result.stdout.decode().strip()

        # 使用正则表达式匹配编码格式、宽度和高度
        match = re.match(r'(?P<codec>\w+)?,?(?P<width>\d+)?,?(?P<height>\d+)?', output)
        if not match:
            print(f"无法解析分辨率或编码格式信息：{output}")
            return False, "", "", ""  # 如果完全无法匹配，返回默认值

        codec_name, width, height = match.groups()  # 解析宽度、高度和编码格式

        # 检查宽度和高度是否有效
        if codec_name is None or width is None or height is None:
            print("无法获取有效的分辨率信息。")
            return False, "", "", "",""

        # 打印识别到的分辨率为：{width}*{height}")
        print(f"识别到的分辨率为：{width}*{height}")
        print(f"视频编码格式为：{codec_name}")

        # 检查分辨率是否小于1280x720
        is_high_resolution = (int(width) >= 1280 and int(height) >= 720)

        # 使用curl测试链接的响应速度
        curl_result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-L', '-w', '%{time_connect},%{time_starttransfer}', url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            startupinfo=subprocess.STARTUPINFO(dwFlags=subprocess.STARTF_USESHOWWINDOW, wShowWindow=subprocess.SW_HIDE),
            timeout=20  # 设置超时时间为10秒
        )
        
        if curl_result.returncode != 0:
            print(f"curl命令失败或超时，无法测试 {url} 的响应速度。")
            return is_high_resolution, width, height, '', codec_name

        # 解析响应时间
        connect_time, starttransfer_time = curl_result.stdout.decode().strip().split(',')
        connect_time = float(connect_time)  # TCP连接时间（秒）
        starttransfer_time = float(starttransfer_time)  # 数据开始传输时间（秒）

        # 计算总响应时间
        response_time = starttransfer_time - connect_time
        response_time_ms = round(response_time * 1000, 2)  # 转换为毫秒并保留两位小数
        response_time_str = f"{response_time_ms} ms"

        return is_high_resolution, width, height, response_time_str, codec_name
    except subprocess.TimeoutExpired:
        print(f"超时：无法在指定的时间内获取 {url} 的分辨率或编码格式信息或测试响应速度。")
        return False, None, None, None, None


class StreamTester(ttk.Frame):
    def __init__(self, master):
        super().__init__(master)
        self.create_widgets()

    def create_widgets(self):
        # 输入区域
        self.input_frame = ttk.Frame(self)
        self.url_entry = ttk.Entry(self.input_frame, width=50)
        self.test_btn = ttk.Button(self.input_frame, text='测试链接', command=self.start_test)
        
        # 结果显示
        self.result_tree = ttk.Treeview(self, columns=('分辨率', '编码', '响应时间', '归属地'), show='headings')
        
        # 布局
        self.url_entry.grid(row=0, column=0, padx=5)
        self.test_btn.grid(row=0, column=1)
        self.input_frame.pack(pady=10)
        self.result_tree.pack(expand=True, fill='both')
        
        # 添加作者信息
        self.add_author_info()          
        # 初始化表格
        for col in ('分辨率', '编码', '响应时间', '归属地'):
            self.result_tree.heading(col, text=col)

          

    def start_test(self):
        url = self.url_entry.get().strip()
        if not url:
            return
        
        # 调用测试方法
        result = test_link_with_ffmpeg(url)
        
        # 插入测试结果到表格
        self.result_tree.insert('', 'end', values=(
            f"{result[1]}x{result[2]}",
            result[4],
            result[3]
        ))


class IPTVTesterGUI:
    def __init__(self, master):
        self.valid_channels = []  # 存储测试结果的内存缓存
        self.master = master
        master.title('IPTV直播源测试工具')
        master.geometry('800x600')
        
        # 添加窗口关闭事件绑定
        self.master.protocol("WM_DELETE_WINDOW", self.on_close)
        
        self.channels = []
        
        # 文件导入区域
        self.file_frame = ttk.LabelFrame(master, text='文件导入')
        self.file_frame.pack(fill='x', padx=10, pady=5)
        
        self.import_btn = ttk.Button(self.file_frame, text='导入文件', command=self.import_file)
        self.import_btn.pack(side='left', padx=5)
        
        # 过滤条件区域
        self.filter_frame = ttk.LabelFrame(master, text='参数设置')
        self.filter_frame.pack(fill='x', padx=10, pady=5)
        
        self.resolution_var = tk.BooleanVar()
        self.resolution_cb = ttk.Checkbutton(self.filter_frame, text='分辨率要求', variable=self.resolution_var)
        self.resolution_cb.grid(row=0, column=0, padx=5)
        
        self.res_combobox = ttk.Combobox(self.filter_frame, 
            values=['4K (3840x2160)', 'FHD (1920x1080)', 'HD (1280x720)', 'SD (720x576)'],
            state='readonly',
            width=15)
        self.res_combobox.current(2)
        self.res_combobox.grid(row=0, column=1, padx=5)
        
        # 归属地分组复选框
        self.location_group_var = tk.BooleanVar()
        self.location_cb = ttk.Checkbutton(self.filter_frame, text='归属地分组', variable=self.location_group_var)
        self.location_cb.grid(row=0, column=2, padx=5)
        self.res_combobox.grid(row=0, column=1, padx=5)
        
        # 保存路径选择按钮
        
        # 进度条区域
        self.progress_frame = ttk.Frame(master)
        self.progress_frame.pack(fill='x', padx=10, pady=5)
        
        self.progress = ttk.Progressbar(self.progress_frame, orient='horizontal', mode='determinate')
        self.progress.pack(fill='x')
        
        # 控制台输出
        self.console_frame = ttk.LabelFrame(master, text='运行日志')
        self.console_frame.pack(fill='both', expand=True, padx=10, pady=5)
        
        self.console_text = tk.Text(self.console_frame, state='disabled')
        self.console_text.pack(fill='both', expand=True)
        
        # 作者信息
        links_frame = ttk.Frame(master)
        links_frame.place(relx=0.95, rely=0.02, anchor='ne')

        # 技术交流群
        group_label = ttk.Label(links_frame, text="技术交流群", foreground="blue", cursor="hand2")
        group_label.pack(side='left')
        group_label.bind("<Button-1>", lambda e: webbrowser.open("https://t.me/+ZO4p61_Ms4E2ZjM1"))

        # 开发者信息
        author_label = ttk.Label(links_frame, text="开发者：iptv-search.com", foreground="blue", cursor="hand2", padding=(10, 0))
        author_label.pack(side='left')
        author_label.bind("<Button-1>", lambda e: webbrowser.open("https://iptv-search.com"))

        # 功能按钮
        self.btn_frame = ttk.Frame(master)
        self.btn_frame.pack(fill='x', padx=10, pady=5)
        
        self.start_btn = ttk.Button(self.btn_frame, text='开始测试', command=self.start_testing)
        self.start_btn.pack(side='left', padx=5)
        
        self.save_btn = ttk.Button(self.btn_frame, text='保存结果', command=self.save_file)
        self.copy_btn = ttk.Button(self.btn_frame, text='复制结果', command=self.copy_to_clipboard)
        self.http_btn = ttk.Button(self.btn_frame, text='启动HTTP服务', command=self.toggle_http_server)
        self.save_btn.pack(side='left', padx=5)
        self.copy_btn.pack(side='left', padx=5)
        self.http_btn.pack(side='left', padx=5)
        self.server = HttpServer()
        self.server_running = False
        self.update_http_button()
        
    def import_file(self):
        filetypes = (
            ('直播源文件', '*.txt;*.m3u'),
            ('所有文件', '*.*')
        )
        filename = filedialog.askopenfilename(filetypes=filetypes)
        if filename:
            self.append_log(f'已选择文件：{filename}')
            self.channels = self.parse_source_file(filename)

    def parse_source_file(self, filename):
        """智能解析直播源文件"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
    
         # 判断文件类型
            if '#EXTM3U' in content:
                channels = self.parse_m3u(content)
                total = len(channels)
                # 只统计包含#EXTINF:的行数
                lines = len([line for line in content.split('\n') if '#EXTINF:' in line])


            else:
                channels = self.parse_txt(content)
                # TXT文件计算总有效行数
                total = len(channels)
                lines = len(content.split('\n'))
                genre_lines = content.count('#genre#')
                valid_lines = lines - genre_lines  # 实际有效行数 = 总行数 - 含#genre#的行数
                lines = valid_lines  # 最终显示实际解析成功的频道数

            self.append_log(f'解析完成: 共发现{lines}个频道')
            return channels
        except Exception as e:
            messagebox.showerror('解析错误', f'文件解析失败: {str(e)}')

    def parse_m3u(self, content):
        channels = []
        valid_count = 0
        invalid_count = 0
        current_channel = {}
        
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith('#EXTINF'):
                invalid_count += 1 if current_channel else 0
                match = re.search(r'group-title="(.*?)",(.*)', line)
                if match:
                    current_channel = {
                        'group': match.group(1),
                        'name': match.group(2).split(',')[-1],
                        'url': None
                    }
                else:
                    current_channel = None
            elif line and not line.startswith('#'):
                if current_channel and not current_channel.get('url'):
                    current_channel['url'] = line.split(' ')[0]
                    if re.match(r'^https?:\/\/\S+$', current_channel['url']):
                        channels.append(current_channel)
                        valid_count += 1
                    else:
                        invalid_count += 1
                    current_channel = {}
        self.append_log(f'M3U解析结果:')
        return channels

    def parse_txt(self, content):
        channels = []
        current_group = '默认分组'
        group_pattern = r'^\s*([^#]+?)\s*,\s*#genre#\s*$'
        channel_pattern = r'^\s*([^,]+?)\s*,\s*(https?://\S+)\s*$'
        
        for line in content.split('\n'):
            line = line.strip()
            if not line:
                continue
            
            # 匹配分组行
            group_match = re.match(group_pattern, line)
            if group_match:
                current_group = group_match.group(1).strip()
                continue
            
            # 匹配频道行
            channel_match = re.match(channel_pattern, line)
            if channel_match:
                channels.append({
                    'group': current_group,
                    'name': channel_match.group(1).strip(),
                    'url': channel_match.group(2).strip()
                })
            else:
                self.append_log(f"跳过无效行: {line}")
        return channels

    def start_testing(self):
        if not self.channels:
            messagebox.showwarning("警告", "没有可测试的频道，请检查文件格式")
            return
        threading.Thread(target=self.run_tests, daemon=True).start()

    def run_tests(self):
        self.append_log('开始测试...')
        
        # 获取过滤条件
        selected_res = self.res_combobox.get()
        res_map = {
            '4K (3840x2160)': (3840, 2160),
            'FHD (1920x1080)': (1920, 1080),
            'HD (1280x720)': (1280, 720),
            'SD (720x576)': (720, 576)
        }
        min_width, min_height = res_map[selected_res] if self.resolution_var.get() else (0, 0)
        # 执行测试
        valid_channels = []
        total = len(self.channels)
        
        for idx, channel in enumerate(self.channels):
            try:
                # 更新进度
                progress = (idx+1)/total*100
                self.master.after(0, lambda: self.progress.configure(value=progress))
                
                # 执行测试
                result = test_link_with_ffmpeg(channel['url'])
                is_valid, width, height, response_time_str, codec = result
                
                # 检查有效值
                if None in (width, height):
                    raise ValueError("无法获取分辨率或不满足要求")
                
                # 获取IP归属地
                try:
                    location = searchWithContent(channel['url'])
                except Exception as e:
                    location = "归属地查询失败"
                
                # 应用过滤条件
                if is_valid and int(width) >= min_width and int(height) >= min_height:
                    self.valid_channels.append({
                        **channel,
                        'resolution': f'{width}x{height}',
                        'speed': response_time_str,
                        'codec': codec,
                        'location': location
                    })
                    
                # 更新日志
                log_msg = f"有效频道： {channel['name']},{channel['url']} | 分辨率：{width}x{height} | 响应速度：{response_time_str} | 视频格式：{codec} | 归属地：{location}"
                self.master.after(0, self.append_log, f"[{idx+1}/{total}] {log_msg}")
                
            except (ValueError, TypeError) as e:
                error_msg = f"无效数据 [{channel['url']}]: {str(e)}"
                self.master.after(0, self.append_log, error_msg)
                continue
            except Exception as e:
                import traceback
                self.master.after(0, self.append_log, error_msg + "\n" + traceback.format_exc())
                continue
        
        # 显示完成提示
        # 自动保存结果
        self.master.after(0, self.save_file)
        self.master.after(0, messagebox.showinfo, '完成', f'测试完成，有效频道数: {len(self.valid_channels)}')

    def set_save_path(self):
        # 获取程序根目录路径
        default_dir = os.getcwd()
        
        self.save_path = filedialog.asksaveasfilename(
            defaultextension='.m3u',
            filetypes=[('M3U Playlist', '*.m3u'), ('All Files', '*.*')],
            initialdir=default_dir  # 添加默认路径设置
        )
        if self.save_path:
            self.append_log(f'结果将保存至：{self.save_path}')

    def generate_m3u_content(self):
        content = ['#EXTM3U']
        for channel in self.valid_channels:
            group_title = channel['location'] if self.location_group_var.get() else channel['group']
            content.append(f'#EXTINF:-1 group-title="{group_title}",{channel["name"]}')
            content.append(channel['url'])
        return '\n'.join(content)

    def generate_txt_content(self):
        grouped = {}
        for c in self.valid_channels:
            group = c['location'] if self.location_group_var.get() else c['group']
            grouped.setdefault(group, []).append(f"{c['name']},{c['url']}")

        content = []
        for group_name in sorted(grouped.keys()):
            content.append(f"{group_name},#genre#")
            content.extend(grouped[group_name])
        return '\n'.join(content)

    def copy_to_clipboard(self):
        if not self.valid_channels:
            messagebox.showwarning("警告", "没有可复制的测试结果")
            return
        
        content = self.generate_m3u_content()
        try:
            pyperclip.copy(content)
            messagebox.showinfo('复制成功', 'M3U格式内容已复制到剪贴板')
        except Exception as e:
            messagebox.showerror('复制失败', str(e))

    def toggle_http_server(self):
        if not self.valid_channels:
            messagebox.showwarning("警告", "内存中没有有效测试结果，请先执行测试")
            return

        if not self.server_running:
            try:
                self.server.start(self)
                self.server_running = True
                self.append_log(f'HTTP服务已启动：http://localhost:{self.server.port}/result.m3u')
                self.append_log(f'实时访问链接：http://localhost:{self.server.port}/result.txt')
            except Exception as e:
                messagebox.showerror("启动失败", str(e))
        else:
            self.server.stop()
            self.server_running = False
            self.append_log('HTTP服务已停止')
        self.update_http_button()

    def append_log(self, message):
        self.console_text.configure(state='normal')
        self.console_text.insert('end', message + '\n')
        self.console_text.configure(state='disabled')
        self.console_text.see('end')

    def toggle_http_server(self):
        if not self.check_result_files():
            messagebox.showwarning("警告", "请先执行测试")
            return

        if not self.server_running:
            try:
                self.server.start(self)
                self.server_running = True
                self.append_log(f'HTTP服务已启动：http://localhost:{self.server.port}')
                messagebox.showinfo("访问路径",
                    f"M3U格式访问地址:\nhttp://localhost:{self.server.port}/result.m3u\n\n"
                    f"TXT格式访问地址:\nhttp://localhost:{self.server.port}/result.txt")
            except Exception as e:
                messagebox.showerror("启动失败", str(e))
        else:
            self.server.stop()
            self.server_running = False
            self.append_log('HTTP服务已停止')
        self.update_http_button()

    def check_result_files(self):
        return len(self.valid_channels) > 0

    def update_http_button(self):
        text = '停止HTTP服务' if self.server_running else '启动HTTP服务'
        self.http_btn.config(text=text)

    def on_close(self):
        """窗口关闭时触发的回调函数"""
        if self.server_running:
            self.server.stop()
        webbrowser.open("https://iptv-search.com")
        self.master.destroy()

    def save_file(self):
        if not self.valid_channels:
            messagebox.showwarning("警告", "没有可保存的测试结果")
            return

        filetypes = [
            ('M3U播放列表', '*.m3u'),
            ('文本文件', '*.txt'),
            ('所有文件', '*.*')
        ]

        filename = filedialog.asksaveasfilename(
            defaultextension='.m3u',
            filetypes=filetypes,
            title='保存测试结果'
        )

        if filename:
            try:
                if filename.endswith('.m3u'):
                    content = self.generate_m3u_content()
                else:
                    content = self.generate_txt_content()

                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)

                self.append_log(f'结果已保存至：{filename}')
                messagebox.showinfo('保存成功', '文件保存成功')
            except Exception as e:
                messagebox.showerror('保存失败', str(e))

if __name__ == '__main__':
    import ctypes
    ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)
    
    root = tk.Tk()
    app = IPTVTesterGUI(root)
    root.mainloop()