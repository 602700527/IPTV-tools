from PIL import Image

INPUT = r'C:\Users\60270\Desktop\cfworker2\public\og-homepage.png'
OUTPUT = r'C:\Users\60270\Desktop\cfworker2\public\og-homepage.png'

img = Image.open(INPUT)
w, h = img.size
pixels = img.load()
print(f"Image: {w}x{h}")

# Background is near-black (0,0,0). Watermark text is white (255,255,255) at y=519-589.
# Fill the watermark zone with background color.
# Gradient: start blending from y=510 (just above watermark), reach full black at y=520+
WATERMARK_TOP = 510  # start gradient here
WATERMARK_START = 520  # full fill starts here
WATERMARK_END = h    # fill to bottom

print(f"Filling y={WATERMARK_START} to y={WATERMARK_END} with background...")
for y in range(WATERMARK_START, WATERMARK_END):
    t = (y - WATERMARK_START) / float(WATERMARK_END - WATERMARK_START)
    t = t ** 0.7  # ease-in curve

    for x in range(w):
        p = pixels[x, y]
        if isinstance(p, tuple) and len(p) >= 3:
            # Blend toward black
            r = int(p[0] * (1 - t))
            g = int(p[1] * (1 - t))
            b = int(p[2] * (1 - t))
            pixels[x, y] = (r, g, b)

# Verify
print("Bottom rows after fix:")
for y in [h-5, h-30, h-60, h-100, h-150]:
    p = pixels[w//2, y]
    print(f"  y={y}: {p[:3]}")

img.save(OUTPUT, 'PNG')
print(f"Saved to {OUTPUT}")
