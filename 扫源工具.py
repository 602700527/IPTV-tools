import subprocess
import time
import re
import os
import json
import threading
from tkinter import *
from tkinter import messagebox, ttk
from tqdm import tqdm
import webbrowser
import tkinter as tk
from tkinter import ttk


class StreamTesterGUI:
    def __init__(self, root):
        
        self.root = root
        self.root.title("扫源神器v1.0.0")
        self.root.geometry("700x750")
        self.root.resizable(True, True)

        # 防止按钮重复点击
        self.testing_in_progress = False

        # 创建主框架
        main_frame = Frame(root)
        main_frame.pack(fill=BOTH, expand=True, padx=20, pady=20)

        # 创建输入区框架
        input_frame = LabelFrame(main_frame, text="测试参数设置")
        input_frame.pack(fill=X, padx=10, pady=10)

        # 创建动作区框架
        action_frame = Frame(main_frame)
        action_frame.pack(fill=X, padx=10, pady=10)

        # 创建输出区框架
        output_frame = LabelFrame(main_frame, text="测试结果")
        output_frame.pack(fill=BOTH, expand=True, padx=10, pady=10)

        # 创建标签和输入框
        self.create_widgets(input_frame, action_frame, output_frame)

        # 初始化测试范围
        self.stream_urls = []
        self.valid_urls = set()  # 用于检查重复名称

        # 添加作者信息
        self.add_author_info()

    def create_widgets(self, input_frame, action_frame, output_frame):
        # 测试链接输入区域
        Label(input_frame, text="源范围:").grid(row=0, column=0, sticky=W, padx=10, pady=5)
        self.url_entry = Entry(input_frame, width=70)
        self.url_entry.grid(row=0, column=1, columnspan=3, padx=10, pady=5)
        Label(input_frame, text="格式示例: http://example.com/stream001-005.m3u8\n"
                                "此格式将生成从001到005的五组流媒体链接").grid(row=1, column=1, sticky=W, padx=10,
                                                                               pady=2)

        # 输出文件名
        Label(input_frame, text="输出文件:").grid(row=2, column=0, sticky=W, padx=10, pady=5)
        self.output_file_entry = Entry(input_frame, width=60)  # 宽度从80改为60
        self.output_file_entry.grid(row=2, column=1, columnspan=2, padx=(10,0), pady=5)  # 调整列布局

        # 添加浏览按钮
        browse_button = Button(input_frame, text="浏览", width=10, command=self.choose_output_file)
        browse_button.grid(row=2, column=3, sticky=W, padx=(5,10), pady=5)

        self.output_file_entry.insert(0, "valid_streams.txt")


        # 阈值设置区域
        Label(input_frame, text="分辨率阈值:").grid(row=3, column=0, sticky=W, padx=10, pady=5)
        Label(input_frame, text="宽度 ≥").grid(row=3, column=1, sticky=W, padx=10, pady=5)
        self.width_threshold = Entry(input_frame, width=10)
        self.width_threshold.grid(row=3, column=2, sticky=W, padx=10, pady=5)
        self.width_threshold.insert(0, "860")

        Label(input_frame, text="高度 ≥").grid(row=4, column=1, sticky=W, padx=10, pady=5)
        self.height_threshold = Entry(input_frame, width=10)
        self.height_threshold.grid(row=4, column=2, sticky=W, padx=10, pady=5)
        self.height_threshold.insert(0, "480")



        # 行动按钮区域
        self.start_button = Button(action_frame, text="开始测试", command=self.start_testing, width=15)
        self.start_button.pack(side=LEFT, padx=10)

        self.clear_button = Button(action_frame, text="清空结果文件", command=self.clear_output_file, width=15)
        self.clear_button.pack(side=LEFT, padx=10)

        self.save_config_button = Button(action_frame, text="保存配置", command=self.save_config, width=12)
        self.save_config_button.pack(side=LEFT, padx=10)

        self.load_config_button = Button(action_frame, text="加载配置", command=self.load_config, width=12)
        self.load_config_button.pack(side=LEFT, padx=10)

        # 输出区域
        console_frame = Frame(output_frame)
        console_frame.pack(fill=BOTH, expand=True, padx=10, pady=10)

        # 控制台输出区域
        Label(console_frame, text="控制台输出:").pack(anchor=W)
        self.console_text = Text(console_frame, height=8, width=100)
        self.console_text.pack(fill=BOTH, expand=True, padx=5, pady=5)


        # 有效连接列表框
        Label(console_frame, text="有效列表:").pack(anchor=W)
        valid_frame = Frame(console_frame)
        valid_frame.pack(fill=BOTH, expand=True, padx=5, pady=5)

        self.valid_streams_listbox = Listbox(valid_frame, height=8, width=100)
        self.valid_streams_listbox.pack(side=LEFT, fill=BOTH, expand=True)

        scrollbar = Scrollbar(valid_frame)
        scrollbar.pack(side=RIGHT, fill=Y)

        self.valid_streams_listbox.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=self.valid_streams_listbox.yview)

        # 添加进度条 (新增代码)
        self.progress = ttk.Progressbar(console_frame, orient=HORIZONTAL, length=100, mode='determinate')
        self.progress.pack(fill=X, padx=5, pady=5)

    def choose_output_file(self):
        """打开文件选择对话框"""
        from tkinter import filedialog
        file_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
            title="结果文件存放位置"
        )
        if file_path:
            self.output_file_entry.delete(0, END)
            self.output_file_entry.insert(0, file_path)

    def add_author_info(self):
        """在右上角添加作者信息和技术交流群"""
        author_frame = Frame(self.root)
        author_frame.place(relx=1.0, rely=0.0, anchor="ne", x=-10, y=10)

        # 创建一个包含两个链接的框架
        links_frame = Frame(author_frame)
        links_frame.pack()

        # 技术交流群信息
        group_label = Label(links_frame, text="技术交流群", fg="blue", cursor="hand2")
        group_label.pack(side=LEFT)  # 使用side=LEFT使链接并排显示

        # 添加点击事件
        def open_group_url(event):
            webbrowser.open("https://t.me/+ZO4p61_Ms4E2ZjM1")

        group_label.bind("<Button-1>", open_group_url)

        # 作者信息
        author_label = Label(links_frame, text="开发者：iptv-search.com", fg="blue", cursor="hand2")
        author_label.pack(side=LEFT, padx=(10, 0))  # 使用side=LEFT并添加左边距

        # 添加点击事件
        def open_author_url(event):
            webbrowser.open("https://iptv-search.com")

        author_label.bind("<Button-1>", open_author_url)

    def parse_url_ranges(self, url):
        # 使用正则表达式匹配模式 "xxx-yyy"，其中xxx和yyy可以是任意数字，包括带前导零的
        pattern = r'(\d+)-(\d+)'
        match = re.search(pattern, url)

        if match:
            start_str, end_str = match.groups()
            start = int(start_str)
            end = int(end_str)
            prefix = url[:match.start()]
            suffix = url[match.end():]

            # 确定数字的位数，用于保持前导零
            num_digits = len(start_str)

            # 生成所有URL
            urls = []
            for i in range(start, end + 1):
                # 格式化数字，保持前导零
                num_str = f"{i:0{num_digits}d}"
                urls.append(f"{prefix}{num_str}{suffix}")

            return urls
        else:
            return [url]

    def test_stream_url(self, url):
        try:
            # 使用ffprobe获取视频的分辨率和编码格式信息
            result = subprocess.run(
                ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,codec_name',
                 '-of', 'csv=p=0', '-i', url],
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                timeout=10,
                creationflags=subprocess.CREATE_NO_WINDOW
            )

            if result.returncode != 0:
                self.append_to_console(f"ffprobe命令失败或超时，无法获取 {url} 的分辨率或编码格式信息。")
                return None, None

            output = result.stdout.decode().strip()

            # 使用正则表达式匹配编码格式、宽度和高度
            match = re.match(r'(?P<codec>\w+)?,?(?P<width>\d+)?,?(?P<height>\d+)?', output)
            if not match:
                self.append_to_console(f"无法解析分辨率或编码格式信息：{output}")
                return None, None

            codec_name, width, height = match.groups()  # 解析宽度、高度和编码格式

            # 检查宽度和高度是否有效
            if codec_name is None or width is None or height is None:
                self.append_to_console("无法获取有效的分辨率信息。")
                return None, None

            # 打印识别到的分辨率和编码格式
            self.append_to_console(f"识别到的分辨率为：{width}*{height}")
            self.append_to_console(f"视频编码格式为：{codec_name}")

            # 检查分辨率是否高于阈值
            min_width = int(self.width_threshold.get())
            min_height = int(self.height_threshold.get())
            is_high_resolution = (int(width) >= min_width and int(height) >= min_height)

            return is_high_resolution, f"{width}x{height}", codec_name

        except subprocess.TimeoutExpired:
            self.append_to_console(f"超时：无法在指定的时间内获取 {url} 的分辨率或编码格式信息。")
            return None, None
        except Exception as e:
            self.append_to_console(f"Error testing {url}: {e}")
            return None, None

    def append_to_console(self, message):
        # 确保console_text已创建
        if hasattr(self, 'console_text'):
            self.console_text.insert(END, message + "\n")
            self.console_text.see(END)

    def clear_output_file(self):
        output_file = self.output_file_entry.get()
        try:
            open(output_file, 'w').close()  # 创建或清空文件
            messagebox.showinfo("操作成功", f"已清空结果文件 {output_file}")
        except Exception as e:
            messagebox.showerror("操作失败", f"无法清空文件 {output_file}: {e}")

    def save_config(self):
        config = {
            'url': self.url_entry.get(),
            'output_file': self.output_file_entry.get(),
            'width_threshold': self.width_threshold.get(),
            'height_threshold': self.height_threshold.get()

        }

        try:
            with open('stream_tester_config.json', 'w') as f:
                json.dump(config, f)
            messagebox.showinfo("保存成功", "配置已成功保存")
        except Exception as e:
            messagebox.showerror("保存失败", f"保存配置失败: {e}")

    def load_config(self):
        try:
            with open('stream_tester_config.json', 'r') as f:
                config = json.load(f)

                self.url_entry.delete(0, END)
                self.url_entry.insert(0, config.get('url', ''))

                self.output_file_entry.delete(0, END)
                self.output_file_entry.insert(0, config.get('output_file', 'valid_streams.txt'))

                self.width_threshold.delete(0, END)
                self.width_threshold.insert(0, config.get('width_threshold', '860'))

                self.height_threshold.delete(0, END)
                self.height_threshold.insert(0, config.get('height_threshold', '480'))

            messagebox.showinfo("加载成功", "配置已成功加载")
        except Exception as e:
            messagebox.showerror("加载失败", f"加载配置失败: {e}")

    def start_testing(self):
        if self.testing_in_progress:
            messagebox.showwarning("警告", "测试正在进行中，请稍后再试")
            return

        url = self.url_entry.get()
        output_file = self.output_file_entry.get()

        # 检查必要参数是否填写
        if not url or not output_file:
            messagebox.showwarning("警告", "请填写所有必要参数")
            return

        # 禁用开始测试按钮
        self.testing_in_progress = True
        self.start_button.config(state=DISABLED)

        # 解析URL并生成所有测试链接
        self.stream_urls = self.parse_url_ranges(url)

        if not self.stream_urls:
            messagebox.showwarning("警告", "解析URL失败，请检查格式")
            self.testing_in_progress = False
            self.start_button.config(state=NORMAL)
            return

        # 清空有效连接列表
        self.valid_streams_listbox.delete(0, END)

        # 创建或清空输出文件
        try:
            open(output_file, 'w').close()
        except Exception as e:
            messagebox.showerror("错误", f"无法创建或清空输出文件: {e}")
            self.testing_in_progress = False
            self.start_button.config(state=NORMAL)
            return

        # 初始化进度条 (新增代码)
        self.progress['maximum'] = len(self.stream_urls)
        self.progress['value'] = 0

        # 创建一个新线程进行测试
        def run_tests():
            try:
                with open(output_file, 'a', encoding='utf-8') as file:
                    for index, url in enumerate(self.stream_urls, 1):
                        result = self.test_stream_url(url)
                        # 更新进度条 (新增代码)
                        self.root.after(10, lambda idx=index: self.progress.configure(value=idx))
                        if result and len(result) == 3:
                            is_high_resolution, resolution, codec_name = result

                            if is_high_resolution:
                                # 生成频道名 - 使用URL中的数字部分
                                url_num_part = re.search(r'\d+', url).group()
                                channel_name = f"频道{url_num_part}"

                                # 检查是否有重复的名称
                                while channel_name in self.valid_urls:
                                    channel_name += "_dup"
                                self.valid_urls.add(channel_name)

                                file.write(f"{channel_name},{url}\n")
                                self.append_to_console(
                                    f"Valid Stream: {url}, Resolution: {resolution}, Codec: {codec_name}")

                                # 添加到有效连接列表
                                self.valid_streams_listbox.insert(END,
                                                                  f"{channel_name} - {url}, Resolution: {resolution}, Codec: {codec_name}")
                            else:
                                self.append_to_console(f"分辨率不足: {url} (Resolution: {resolution})")
                        else:
                            self.append_to_console(f"无效或无法访问: {url}")
            except Exception as e:
                self.append_to_console(f"测试过程中发生错误: {e}")
            finally:
                # 启用开始测试按钮
                self.testing_in_progress = False
                self.start_button.config(state=NORMAL)
                messagebox.showinfo("完成", "测试完成！结果已保存到文件中")

        # 启动测试线程
        test_thread = threading.Thread(target=run_tests)
        test_thread.daemon = True
        test_thread.start()

    def on_closing(self):
        """在关闭窗口时打开指定网站"""
        webbrowser.open("https://iptv-search.com")
        self.root.destroy()


if __name__ == "__main__":
    root = Tk()
    app = StreamTesterGUI(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()


class SourceScanner(ttk.Frame):
    def __init__(self, master):
        super().__init__(master)
        self.create_widgets()
        
    def create_widgets(self):
        # 输入区域
        self.input_frame = ttk.Frame(self)
        self.ip_range_label = ttk.Label(self.input_frame, text="IP范围:")
        self.ip_start = ttk.Entry(self.input_frame, width=15)
        self.ip_separator = ttk.Label(self.input_frame, text=" - ")
        self.ip_end = ttk.Entry(self.input_frame, width=15)
        
        # 扫描按钮
        self.scan_btn = ttk.Button(self.input_frame, text="开始扫描", command=self.start_scan)
        
        # 结果展示
        self.result_text = tk.Text(self, height=20, width=80)
        
        # 布局
        self.ip_range_label.grid(row=0, column=0, padx=5)
        self.ip_start.grid(row=0, column=1)
        self.ip_separator.grid(row=0, column=2)
        self.ip_end.grid(row=0, column=3)
        self.scan_btn.grid(row=0, column=4, padx=10)
        self.input_frame.pack(pady=10)
        self.result_text.pack(expand=True, fill='both')
        
    def start_scan(self):
        # 保留原有扫描逻辑
        pass