import tkinter as tk
from tkinter import ttk
from 扫源工具 import SourceScanner
from iptv_tester import StreamTester

class MainApplication(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('IPTV工具箱')
        self.geometry('800x600')
        self.iconbitmap('app_icon.ico')
        
        # 创建标签容器
        self.notebook = ttk.Notebook(self)
        
        # 实例化各功能模块
        self.scanner_tab = SourceScanner(self.notebook)
        self.tester_tab = StreamTester(self.notebook)
        
        # 添加标签页
        self.notebook.add(self.scanner_tab, text='直播源扫描')
        self.notebook.add(self.tester_tab, text='链接测试')
        
        self.notebook.pack(expand=True, fill='both')

if __name__ == '__main__':
    app = MainApplication()
    app.mainloop()