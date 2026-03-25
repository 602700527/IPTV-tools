import re, sys

path = r'C:\Users\60270\Desktop\cfworker2\playstation-page.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print('File size:', len(txt))
print()

patterns = ['IPTV Live', 'IPTV Search', 'pageTitle', '<title>', 'logo']
for pat in patterns:
    count = txt.count(pat)
    print(f"'{pat}': {count} occurrences")
    if count > 0 and count < 30:
        for m in re.finditer(re.escape(pat), txt):
            line = txt[:m.start()].count('\n') + 1
            ctx = txt[max(0,m.start()-30):m.start()+60]
            print(f"  Line {line}: {repr(ctx)}")
    print()
