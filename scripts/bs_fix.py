import os

target = bytes([0x5C, 0x24])  # \$
replacement = bytes([0x24])    # $

results = []
for fname in [
    r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js',
    r'C:\Users\60270\Desktop\cfworker2\home-page.js',
    r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js',
]:
    if not os.path.exists(fname):
        results.append(f'NOT FOUND: {fname}')
        continue
    with open(fname, 'rb') as f:
        data = f.read()
    cnt = data.count(target)
    label = os.path.basename(fname)
    if cnt > 0:
        data = data.replace(target, replacement)
        with open(fname, 'wb') as f:
            f.write(data)
        results.append(f'FIXED {label}: {cnt}x backslash-dollar -> dollar')
    else:
        results.append(f'CLEAN {label}: 0 backslash-dollar')

with open(r'C:\Users\60270\Desktop\cfworker2\scripts\bs_result.txt', 'w') as f:
    f.write('\n'.join(results))

for r in results:
    print(r)
