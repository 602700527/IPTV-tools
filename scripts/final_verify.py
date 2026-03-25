with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()
import re

print('=== 关键位置验证 ===')
print()

# Title
m = re.search(r'<title>([^<]+)</title>', txt)
print('1. <title>:', m.group(1) if m else 'NOT FOUND')

# og:site_name
m = re.search(r'og:site_name[^>]*content="([^"]+)"', txt)
print('2. og:site_name:', m.group(1) if m else 'NOT FOUND')

# meta author
m = re.search(r'<meta name="author" content="([^"]+)"', txt)
print('3. meta author:', m.group(1) if m else 'NOT FOUND')

# alternateName
m = re.search(r'alternateName["\s:]+"([^"]+)"', txt)
print('4. alternateName:', m.group(1) if m else 'NOT FOUND')

# foundingDate
m = re.search(r'foundingDate["\s:]+"([^"]+)"', txt)
print('5. foundingDate:', m.group(1) if m else 'NOT FOUND')

# logo alt
m = re.search(r'alt="([^"]+)"[^>]*logo', txt) or re.search(r'logo[^>]*alt="([^"]+)"', txt)
print('6. logo alt:', m.group(1) if m else 'NOT FOUND')

# Count remaining
print()
print('IPTV Live remaining:', txt.count('IPTV Live'))
print('IPTV Search total:', txt.count('IPTV Search'))
print('alternateName total:', txt.count('alternateName'))
