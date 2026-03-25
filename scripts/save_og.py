import urllib.request
from PIL import Image
from io import BytesIO

URL = "https://autoglm-agent.aminer.cn/transfer/3a4160ab05106277f4f2bf762be003c6830f97ecd077973c8b4c95829038a196.jpg"
OUTPUT = r'C:\Users\60270\Desktop\cfworker2\public\og-homepage.png'

print("Downloading...")
req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req, timeout=30)
data = resp.read()

print(f"Downloaded {len(data)} bytes")
img = Image.open(BytesIO(data))
w, h = img.size
print(f"Original: {w}x{h} mode={img.mode}")

# Crop to 1200x630 (center crop to remove any edge artifacts)
target_w, target_h = 1200, 630
left = (w - target_w) // 2
top = (h - target_h) // 2
img_crop = img.crop((left, top, left + target_w, top + target_h))

# Verify bottom edge is clean
pw, ph = img_crop.size
print(f"Cropped: {pw}x{ph}")
for y in [ph-5, ph-30, ph-60]:
    p = img_crop.getpixel((pw//2, y))
    print(f"  y={y} center: {p[:3]}")

img_crop.save(OUTPUT, 'PNG')
print(f"Saved to {OUTPUT}")
