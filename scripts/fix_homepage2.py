path = r'C:\Users\60270\Desktop\cfworker2\playstation-page.js'
with open(path, 'rb') as f:
    raw = f.read()

print('Before:')
print('  IPTV Live =', raw.count(b'IPTV Live'))
print('  IPTV Search =', raw.count(b'IPTV Search'))

# Fix JSON-LD: name=IPTV Search is correct, alternateName should be IPTV Live
raw = raw.replace(
    b'"name": "IPTV Search",\r\n    "alternateName": "IPTV Search"',
    b'"name": "IPTV Search",\r\n    "alternateName": "IPTV Live"'
)

# Fix foundingDate: 2024 -> 2026
raw = raw.replace(b'"foundingDate": "2024"', b'"foundingDate": "2026"')

print('After:')
print('  IPTV Live =', raw.count(b'IPTV Live'))
print('  IPTV Search =', raw.count(b'IPTV Search'))

# Verify JSON-LD
import re
for m in re.finditer(b'alternateName', raw):
    line_num = raw[:m.start()].count(b'\n') + 1
    ctx = raw[max(0, m.start()-50):m.start()+80]
    print('\nLine', line_num, ':', repr(ctx))
    break

with open(path, 'wb') as f:
    f.write(raw)

print('\nSaved.')
