import re, os

base = r'C:\Users\60270\Desktop\cfworker2'

with open(os.path.join(base, 'home-page.js'), 'r', encoding='utf-8', errors='ignore') as f:
    home = f.read()

with open(os.path.join(base, 'components/page-footer.js'), 'r', encoding='utf-8', errors='ignore') as f:
    footer = f.read()

with open(os.path.join(base, 'components/page-header.js'), 'r', encoding='utf-8', errors='ignore') as f:
    header = f.read()

print('=== SEO 问题清单 ===')
print()
print('【P0 - Logo/Branding】')
print('1. Title 包含 IPTV Live:', 'IPTV Live' in home)
m = re.search(r'<title>([^<]+)</title>', home)
if m: print('   <title>:', m.group(1)[:80])

print('2. Logo alt 包含 IPTV Live:', 'IPTV Live' in header)

json_ld = re.search(r'<script type="application/ld\+json">(.*?)</script>', home, re.DOTALL)
if json_ld:
    jstr = json_ld.group(1)
    m2 = re.search(r'"name"\s*:\s*"([^"]+)"', jstr)
    m3 = re.search(r'"alternateName"\s*:\s*"([^"]+)"', jstr)
    print('3. JSON-LD name:', m2.group(1) if m2 else 'NOT FOUND')
    print('4. JSON-LD alternateName:', m3.group(1) if m3 else 'NOT FOUND')
    m4 = re.search(r'"foundingDate"\s*:\s*"([^"]+)"', jstr)
    print('5. foundingDate:', m4.group(1) if m4 else 'NOT FOUND')

print()
print('【P0 - Fake Data】')
print('6. aggregateRating:', 'aggregateRating' in home)
m = re.search(r'aggregateRating.*?"ratingValue"\s*:\s*"([^"]+)"', home)
if m: print('   ratingValue:', m.group(1))
m = re.search(r'"reviewCount"\s*:\s*"([^"]+)"', home)
if m: print('   reviewCount:', m.group(1))

print()
print('【P0 - Footer】')
idx = footer.find('copyright')
print('7. Footer copyright:', repr(footer[idx:idx+70]))
print('8. Footer gizokraijaw script:', 'gizokraijaw' in footer)
m = re.search(r'setLocal\(["\'](\w+)["\']\)', footer)
if m: print('9. Footer default language:', m.group(1))

print()
print('【P1 - Description / Watch Now】')
print('10. Watch Now button:', 'Watch Now' in home)
m = re.search(r'og:description[^>]*content="([^"]{20,})"', home)
if m: print('11. og:description:', m.group(1)[:100])
else: print('11. og:description: NOT FOUND')
print('12. og:image:', '/og-homepage.png' in home or 'og-homepage' in home)
print('13. twitter:card:', 'twitter:card' in home)
m = re.search(r'twitter:card[^>]*content="([^"]+)"', home)
if m: print('14. twitter:card value:', m.group(1))
