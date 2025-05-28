import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import threading
import re
import subprocess
import re
from tkinter import ttk


def test_link_with_ffmpeg(url):
    try:
        # 使用ffprobe获取视频的分辨率和编码格式信息
        result = subprocess.run(
            ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,codec_name', '-of', 'csv=p=0', '-i', url],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
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

        # 打印识别到的分辨率和编码格式
        print(f"识别到的分辨率为：{width}*{height}")
        print(f"视频编码格式为：{codec_name}")

        # 检查分辨率是否小于1280x720
        is_high_resolution = (int(width) >= 1280 and int(height) >= 720)

        # 使用curl测试链接的响应速度
        curl_result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-L', '-w', '%{time_connect},%{time_starttransfer}', url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=10  # 设置超时时间为10秒
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
        self.result_tree = ttk.Treeview(self, columns=('分辨率', '编码', '响应时间'), show='headings')
        
        # 布局
        self.url_entry.grid(row=0, column=0, padx=5)
        self.test_btn.grid(row=0, column=1)
        self.input_frame.pack(pady=10)
        self.result_tree.pack(expand=True, fill='both')
        
        # 初始化表格
        for col in ('分辨率', '编码', '响应时间'):
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
        self.master = master
        master.title('IPTV直播源测试工具')
        master.geometry('800x600')
        self.channels = []  # 初始化频道列表
        
        # 文件导入区域
        self.file_frame = ttk.LabelFrame(master, text='文件导入')
        self.file_frame.pack(fill='x', padx=10, pady=5)
        
        self.import_btn = ttk.Button(self.file_frame, text='导入文件', command=self.import_file)
        self.import_btn.pack(side='left', padx=5)
        
        # 过滤条件区域
        self.filter_frame = ttk.LabelFrame(master, text='过滤条件')
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
        
        # 保存路径选择按钮
        self.save_btn = ttk.Button(self.file_frame, text='保存路径', command=self.set_save_path)
        self.save_btn.pack(side='left', padx=5)
        self.save_path = ''
        
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
        
        # 功能按钮
        self.btn_frame = ttk.Frame(master)
        self.btn_frame.pack(fill='x', padx=10, pady=5)
        
        self.start_btn = ttk.Button(self.btn_frame, text='开始测试', command=self.start_testing)
        self.start_btn.pack(side='left', padx=5)
        
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
            else:
                channels = self.parse_txt(content)

            self.append_log(f'成功解析到 {len(channels)} 个频道')
            return channels
        except Exception as e:
            messagebox.showerror('解析错误', f'文件解析失败: {str(e)}')

    def parse_m3u(self, content):
        """解析M3U格式文件"""
        channels = []
        current_group = '默认分组'
        
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith('#EXTINF'):
                # 提取频道名和分组
                match = re.search(r'group-title="(.*?)",(.*)', line)
                if match:
                    current_group = match.group(1)
                    channel_name = match.group(2).split(',')[-1]
            elif line and not line.startswith('#'):
                channels.append({
                    'group': current_group,
                    'name': channel_name,
                    'url': line
                })
        return channels

    def parse_txt(self, content):
        """解析TXT格式文件"""
        channels = []
        pattern = r'^(.*?),(.*?),(.*?)$'
        
        for line in content.split('\n'):
            line = line.strip()
            if line and not line.startswith('#'):
                match = re.match(pattern, line)
                if match:
                    channels.append({
                        'group': match.group(1),
                        'name': match.group(2),
                        'url': match.group(3)
                    })
        return channels
            
    def append_log(self, message):
        self.console_text.configure(state='normal')
        self.console_text.insert('end', message + '\n')
        self.console_text.configure(state='disabled')
        
    def start_testing(self):
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
                is_valid, width, height, speed, codec = result
                
                # 检查有效值
                if None in (width, height):
                    raise ValueError("无效的分辨率数据")
                
                # 应用过滤条件
                if is_valid and int(width) >= min_width and int(height) >= min_height:
                    valid_channels.append({
                        **channel,
                        'resolution': f'{width}x{height}',
                        'speed': speed,
                        'codec': codec
                    })
                    
                # 更新日志
                log_msg = f"测试 {channel['name']}: 分辨率{width}x{height} 速度{speed}"
                self.master.after(0, self.append_log, f"[{idx+1}/{total}] {log_msg}")
                
            except (ValueError, TypeError) as e:
                error_msg = f"测试失败 [{channel['url']}]: {str(e)}"
                self.master.after(0, self.append_log, error_msg)
                continue
            except Exception as e:
                import traceback
                self.master.after(0, self.append_log, error_msg + "\n" + traceback.format_exc())
                continue
        
        # 保存结果
        self.export_m3u(valid_channels)
        self.master.after(0, messagebox.showinfo, '完成', f'测试完成，有效频道数: {len(valid_channels)}')

    def set_save_path(self):
        self.save_path = filedialog.asksaveasfilename(
            defaultextension='.m3u',
            filetypes=[('M3U Playlist', '*.m3u'), ('All Files', '*.*')]
        )
        if self.save_path:
            self.append_log(f'结果将保存至：{self.save_path}')

    def export_m3u(self, channels):
        if not self.save_path:
            messagebox.showwarning('保存路径', '请先选择保存路径')
            return

        try:
            with open(self.save_path, 'w', encoding='utf-8') as f:
                f.write('#EXTM3U\n')
                for channel in channels:
                    f.write(f'#EXTINF:-1 group-title="{channel["group"]}",{channel["name"]}\n')
                    f.write(f'{channel["url"]}\n')
            messagebox.showinfo('保存成功', f'已保存{len(channels)}个频道到{self.save_path}')
        except Exception as e:
            messagebox.showerror('保存失败', str(e))

if __name__ == '__main__':
    root = tk.Tk()
    app = IPTVTesterGUI(root)
    root.mainloop()