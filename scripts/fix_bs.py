import os

BS_DOLLAR = bytes([0x5C, 0x24])  # backslash + dollar = \$
DOLLAR = bytes([0x24])            # just dollar = $

files_to_fix = [
    r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js',
    r'C:\Users\60270\Desktop\cfworker2\home-page.js',
    r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js',
]

for fpath in files_to_fix:
    if not os.path.exists(fpath):
        print(f'NOT FOUND: {fpath}')
        continue
    with open(fpath, 'rb') as f:
        data = f.read()
    cnt = data.count(BS_DOLLAR)
    print(f'{os.path.basename(fpath)}: {cnt}x backslash-dollar found')
    if cnt > 0:
        data = data.replace(BS_DOLLAR, DOLLAR)
        with open(fpath, 'wb') as f:
            f.write(data)
        print(f'  -> Fixed {cnt}x')
    # Check new Date context
    idx = data.find(b'new Date')
    if idx >= 0:
        print(f'  new Date context: {repr(data[idx-10:idx+30])}')
    if b'1970' in data:
        print(f'  WARNING: contains 1970!')

print('Done.')
