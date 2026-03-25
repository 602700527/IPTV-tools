with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()
import re

print('IPTV Live remaining:', txt.count('IPTV Live'))
print('IPTV Search total:', txt.count('IPTV Search'))
print()

# Check key spots
checks = [
    ('og:site_name', r'og:site_name[^>]*content="[^"]+"'),
    ('alternateName', r'alternateName:\s*"[^"]+"'),
    ('logo alt', r'alt="IPTV [^"]+"'),
    ('title tag', r'<title>[^<]+</title>'),
]
for name, pat in checks:
    m = re.search(pat, txt)
    if m:
        print(f'{name}: {m.group()[:80]}')
    else:
        print(f'{name}: NOT FOUND')
