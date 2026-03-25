from PIL import Image, ImageDraw
import re

# First: update the SVG text
SVG_PATH = r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg'

with open(SVG_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace "免费观看" with "免费频道"
content = content.replace('>免费观看<', '>免费频道<')
# Replace "高清画质" with "每日更新"
content = content.replace('>高清画质<', '>每日更新<')

with open(SVG_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print("SVG text updated")

# Verify
with open(SVG_PATH, 'r', encoding='utf-8') as f:
    verify = f.read()
for m in re.finditer(r'<text[^>]*>[^<]+</text>', verify):
    text = m.group()
    if any(x in text for x in ['免费', '高清', '注册', '频道', '更新', '无需']):
        print(f"  Found: {text}")
