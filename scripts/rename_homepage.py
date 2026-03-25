import os, re, shutil

base = r'C:\Users\60270\Desktop\cfworker2'

OLD_FILE = os.path.join(base, 'playstation-page.js')
NEW_FILE = os.path.join(base, 'home-page.js')
WORKER = os.path.join(base, 'worker.js')

# 1. Update playstation-page.js: rename export PLAYSTATION_HTML -> HOME_HTML
with open(OLD_FILE, 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

old_count = txt.count('PLAYSTATION_HTML')
txt = txt.replace('PLAYSTATION_HTML', 'HOME_HTML')
print('Replaced PLAYSTATION_HTML:', old_count, 'times')
print('New PLAYSTATION_HTML count:', txt.count('PLAYSTATION_HTML'))
print('New HOME_HTML count:', txt.count('HOME_HTML'))

with open(OLD_FILE, 'w', encoding='utf-8') as f:
    f.write(txt)
print('Saved playstation-page.js with HOME_HTML')

# 2. Rename file
if os.path.exists(NEW_FILE):
    print('WARNING: home-page.js already exists!')
else:
    os.rename(OLD_FILE, NEW_FILE)
    print('Renamed: playstation-page.js -> home-page.js')

# 3. Update worker.js
with open(WORKER, 'r', encoding='utf-8', errors='ignore') as f:
    worker = f.read()

old_imp = worker.count("from './playstation-page.js'")
old_use = worker.count('PLAYSTATION_HTML')
print('\nworker.js before:')
print("  './playstation-page.js' references:", old_imp)
print('  PLAYSTATION_HTML references:', old_use)

worker = worker.replace("from './playstation-page.js'", "from './home-page.js'")
worker = worker.replace('PLAYSTATION_HTML', 'HOME_HTML')

new_imp = worker.count("from './home-page.js'")
new_use = worker.count('HOME_HTML')
print('\nworker.js after:')
print("  './home-page.js' references:", new_imp)
print('  HOME_HTML references:', new_use)

with open(WORKER, 'w', encoding='utf-8') as f:
    f.write(worker)
print('Saved worker.js')

# 4. Verify node syntax
import subprocess
result = subprocess.run(['node', '--check', WORKER], capture_output=True, text=True)
print('\nworker.js syntax check:', 'OK' if result.returncode == 0 else 'ERROR: ' + result.stderr)

print('\nDone!')
