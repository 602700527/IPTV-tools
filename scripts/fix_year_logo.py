with open(r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js', 'rb') as f:
    raw = f.read()

# The actual bytes in the file are: ${new Date().getFullYear()}
# Dollar = 0x24, Curly = 0x7B
old = b'${new Date().getFullYear()}'
new = b'2026'

count = raw.count(old)
print(f'Found {count} occurrences of the pattern')
if count > 0:
    raw = raw.replace(old, new)
    with open(r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js', 'wb') as f:
        f.write(raw)
    print('Replaced!')
else:
    print('NOT FOUND - investigating...')
    idx = raw.find(b'new Date')
    if idx >= 0:
        print(f'new Date at byte {idx}: {repr(raw[idx-5:idx+30])}')

# Verify
with open(r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js', 'rb') as f:
    v = f.read()
print(f'2026 in file: {b\"2026\" in v}')
print(f'new Date in file: {b\"new Date\" in v}')
