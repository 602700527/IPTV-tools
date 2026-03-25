import os, re

wrangler_dir = r'C:\Users\60270\Desktop\cfworker2\.wrangler\tmp'
entries = [(os.path.getmtime(os.path.join(wrangler_dir, d)), d) for d in os.listdir(wrangler_dir) if os.path.isdir(os.path.join(wrangler_dir, d))]
entries.sort()
latest = entries[-1][1]
wfile = os.path.join(wrangler_dir, latest, 'worker.js')
with open(wfile, 'rb') as f:
    data = f.read()
lines = data.split(b'\n')

found = []
for i, line in enumerate(lines):
    if b'name}' in line or b'name]' in line:
        found.append((i+1, line[:200]))

print(f'Found {len(found)} lines with name')
for lineno, line in found[:10]:
    print(f'Line {lineno}: {line}')
