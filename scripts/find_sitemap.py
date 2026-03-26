with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()
import re

# Find sitemap generation function
for m in re.finditer('sitemap|Sitemap', txt):
    line = txt[:m.start()].count('\n') + 1
    print(f'L{line}: {txt[max(0,m.start()-40):m.start()+60]}')
    print()
