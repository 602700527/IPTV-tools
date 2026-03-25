with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'rb') as f:
    content = f.read()

# Fix: 免费台道 -> 免费频道
bad = b'\xe5\x85\x8d\xe8\xb4\xb9\xe5\x8f\xb0\xe9\x81\x93'  # 免费台道
good = b'\xe5\x85\x8d\xe8\xb4\xb9\xe9\xa2\x91\xe9\x81\x93'  # 免费频道
new_content = content.replace(bad, good, 1)

with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'wb') as f:
    f.write(new_content)

# Verify
with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'rb') as f:
    final = f.read()

import re

matches = re.findall(rb'<text[^>]*>([^<]+)</text>', final)
print("=== TEXT LABELS IN SVG ===")
for m in matches:
    try:
        print("  [" + m.decode('utf-8') + "]")
    except:
        print("  [bytes: " + m.hex() + "]")

print()
print("Checks:")
print("  IPTV Search:", "YES" if b'IPTV Search' in final else "NO")
print("  免费频道:", "YES" if b'\xe5\x85\x8d\xe8\xb4\xb9\xe9\xa2\x91\xe9\x81\x93' in final else "NO")
print("  免费台道 (BAD if YES):", "YES-BAD" if b'\xe5\x85\x8d\xe8\xb4\xb9\xe5\x8f\xb0\xe9\x81\x93' in final else "NO-GOOD")
print("  免费观看 (OLD BAD):", "YES-BAD" if b'\xe5\x85\x8d\xe8\xb4\xb9\xe8\xa7\x82\xe7\x9c\x8b' in final else "NO-GOOD")
print("  高清画质 (OLD BAD):", "YES-BAD" if b'\xe9\xab\x98\xe6\xb8\x85\xe7\x94\xbb\xe8\xb4\xa8' in final else "NO-GOOD")
print("  每日更新:", "YES" if b'\xe6\xaf\x8f\xe6\x97\xa5\xe6\x9b\xb4\xe6\x96\xb0' in final else "NO")
print("  无需注册:", "YES" if b'\xe6\x97\xa0\xe9\x9c\x80\xe6\xb3\xa8\xe5\x86\x8c' in final else "NO")
print("  10000+频道:", "YES" if b'10000+\xe5\x8f\xb0\xe9\x81\x93' in final else "NO")
