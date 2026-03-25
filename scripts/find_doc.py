import os, re

wrangler_dir = r'C:\Users\60270\Desktop\cfworker2\.wrangler\tmp'
entries = [(os.path.getmtime(os.path.join(wrangler_dir, d)), d) for d in os.listdir(wrangler_dir) if os.path.isdir(os.path.join(wrangler_dir, d))]
entries.sort()
latest = entries[-1][1]
wfile = os.path.join(wrangler_dir, latest, 'worker.js')
with open(wfile, 'rb') as f:
    data = f.read()

# Find document.querySelector or other document.* calls
matches = [(m.start(), data[max(0,m.start()-100):m.start()+50]) for m in re.finditer(b'document\\.querySelector', data)]
print(f'document.querySelector: {len(matches)} found')
for pos, ctx in matches[:5]:
    lineno = data[:pos].count(b'\n') + 1
    print(f'  Line {lineno}: {ctx[-80:]}')

# Find any 'name' used without definition in JS context
# Search for 'is not defined' or undefined name refs
matches2 = [(m.start(), data[max(0,m.start()-50):m.start()+50]) for m in re.finditer(b'name.*not.*defin', data)]
print(f'\\nname not defined context: {len(matches2)}')
for pos, ctx in matches2[:3]:
    lineno = data[:pos].count(b'\n') + 1
    print(f'  Line {lineno}: {ctx}')
