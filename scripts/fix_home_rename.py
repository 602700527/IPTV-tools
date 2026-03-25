import re

# Fix 1: Rename export PLAYSTATION_HTML -> HOME_HTML in home-page.js
HOME = r'C:\Users\60270\Desktop\cfworker2\home-page.js'
with open(HOME, 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()
cnt1 = txt.count('PLAYSTATION_HTML')
print(f'home-page.js: {cnt1}x PLAYSTATION_HTML')
if cnt1 > 0:
    txt = txt.replace('PLAYSTATION_HTML', 'HOME_HTML')
    with open(HOME, 'w', encoding='utf-8') as f:
        f.write(txt)
    print('  -> replaced with HOME_HTML')

# Fix 2: Rename import PLAYSTATION_HTML -> HOME_HTML in worker.js
WORKER = r'C:\Users\60270\Desktop\cfworker2\worker.js'
with open(WORKER, 'r', encoding='utf-8', errors='ignore') as f:
    w = f.read()
cnt2 = w.count('PLAYSTATION_HTML')
print(f'worker.js: {cnt2}x PLAYSTATION_HTML')
if cnt2 > 0:
    w = w.replace('PLAYSTATION_HTML', 'HOME_HTML')
    with open(WORKER, 'w', encoding='utf-8') as f:
        f.write(w)
    print('  -> replaced with HOME_HTML')

print('Done.')
