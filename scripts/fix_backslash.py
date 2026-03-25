with open(r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js', 'rb') as f:
    raw = f.read()

print(f'File size: {len(raw)} bytes')

# Find backslash-dollar in the file
backslash_dollar = b'\\$'
count_bs = raw.count(backslash_dollar)
print(f'Backslash-dollar (\\$) occurrences: {count_bs}')

if count_bs > 0:
    raw = raw.replace(backslash_dollar, b'$')
    with open(r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js', 'wb') as f:
        f.write(raw)
    print('Replaced \\$ -> $')
else:
    print('Pattern not found as bytes!')
    # Check what's actually there
    idx = raw.find(b'getFullYear')
    if idx >= 0:
        print(f'getFullYear context: {repr(raw[idx-30:idx+30])}')

# Also fix home-page.js if it has the same issue
HOME = r'C:\Users\60270\Desktop\cfworker2\home-page.js'
with open(HOME, 'rb') as f:
    hraw = f.read()
cnt = hraw.count(backslash_dollar)
print(f'\nhome-page.js backslash-dollar: {cnt}')
if cnt > 0:
    hraw = hraw.replace(backslash_dollar, b'$')
    with open(HOME, 'wb') as f:
        f.write(hraw)
    print('home-page.js: replaced')

# Also check seo-handler.js for the same issue (generateSEOHomepage)
SEO = r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js'
with open(SEO, 'rb') as f:
    sraw = f.read()
cnt2 = sraw.count(backslash_dollar)
print(f'\nseo-handler.js backslash-dollar: {cnt2}')
if cnt2 > 0:
    sraw = sraw.replace(backslash_dollar, b'$')
    with open(SEO, 'wb') as f:
        f.write(sraw)
    print('seo-handler.js: replaced')

print('\nDone!')
