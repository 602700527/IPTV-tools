with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'rb') as f:
    content = f.read()

import re

# Find ALL text elements in the SVG
matches = re.findall(rb'<text[^>]*>([^<]+)</text>', content)
print("All text elements (bytes):")
for m in matches:
    try:
        decoded = m.decode('utf-8')
        print(f"  [{decoded}]")
    except:
        print(f"  [bytes: {m.hex()}]")

# Also find the specific location of the bad text
bad = '免费台道'.encode('utf-8')
idx = content.find(bad)
print(f"\n'免费台道' found at index: {idx}")
if idx >= 0:
    ctx = content[idx-10:idx+20]
    print(f"Context: {ctx}")
    print(f"As UTF-8: {ctx.decode('utf-8', errors='replace')}")
