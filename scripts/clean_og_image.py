from PIL import Image, ImageDraw
from collections import Counter

INPUT = r'C:\Users\60270\Desktop\cfworker2\public\og-homepage.png'
OUTPUT = r'C:\Users\60270\Desktop\cfworker2\public\og-homepage.png'

img = Image.open(INPUT)
w, h = img.size
print(f"Original: {w}x{h}")

# --- Step 1: Crop to standard OG ratio 1200x630 ---
# Center crop, remove any right/bottom watermark strips
target_w, target_h = 1200, 630
left = (w - target_w) // 2
top = (h - target_h) // 2
img_cropped = img.crop((left, top, left + target_w, top + target_h))
print(f"Cropped to: {img_cropped.size}")

# --- Step 2: Identify and fill bottom watermark area ---
pw, ph = img_cropped.size
pixels = img_cropped.load()

# Sample background colors from the upper 60% of image (should be clean gradient)
bg_samples = []
for y in range(50, ph - 150, 25):
    for x in range(80, pw - 80, 60):
        p = pixels[x, y]
        if isinstance(p, tuple):
            bg_samples.append((p[0], p[1], p[2]))

color_counts = Counter(bg_samples)
bg_color = color_counts.most_common(1)[0][0]
print(f"Background fill color: {bg_color}")

# Watermark appears to be semi-transparent overlay at very bottom
# Blend the bottom 100px toward the background color
watermark_h = 100
for y in range(ph - watermark_h, ph):
    blend = (y - (ph - watermark_h)) / float(watermark_h)
    blend = blend ** 0.6  # ease-in
    
    for x in range(pw):
        p = pixels[x, y]
        if isinstance(p, tuple) and len(p) >= 3:
            r = int(p[0] * (1 - blend * 0.9) + bg_color[0] * blend * 0.9)
            g = int(p[1] * (1 - blend * 0.9) + bg_color[1] * blend * 0.9)
            b = int(p[2] * (1 - blend * 0.9) + bg_color[2] * blend * 0.9)
            pixels[x, y] = (r, g, b)

img_cropped.save(OUTPUT)
print(f"Saved: {OUTPUT} ({img_cropped.size[0]}x{img_cropped.size[1]})")

# Verify
verify = Image.open(OUTPUT)
print(f"Verified size: {verify.size}")
