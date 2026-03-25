import re

path = r'C:\Users\60270\Desktop\cfworker2\playstation-page.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print('Checking for year references...')
for year in ['2024', '2025']:
    matches = [(m.start(), txt[:m.start()].count('\n')+1) for m in re.finditer(year, txt)]
    print(f'{year}: {len(matches)} occurrences')
    for pos, line in matches[:5]:
        ctx = txt[max(0, pos-30):pos+40]
        print(f'  Line {line}: {repr(ctx)}')
    print()
