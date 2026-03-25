path = r'C:\Users\60270\Desktop\cfworker2\playstation-page.js'
with open(path, 'rb') as f:
    raw = f.read()

print('Size:', len(raw))
live_count = raw.count(b'IPTV Live')
search_count = raw.count(b'IPTV Search')
print('Before: IPTV Live =', live_count, ', IPTV Search =', search_count)

# Replace all "IPTV Live" with "IPTV Search"
raw2 = raw.replace(b'IPTV Live', b'IPTV Search')

live_count2 = raw2.count(b'IPTV Live')
search_count2 = raw2.count(b'IPTV Search')
print('After:  IPTV Live =', live_count2, ', IPTV Search =', search_count2)

# Verify: name field in JSON-LD should be IPTV Search, alternateName should be IPTV Live
import re
for m in re.finditer(b'alternateName', raw2):
    line_num = raw2[:m.start()].count(b'\n') + 1
    ctx = raw2[max(0, m.start()-50):m.start()+80]
    print('\nJSON-LD alternateName at line', line_num, ':')
    print(repr(ctx))
    break

with open(path, 'wb') as f:
    f.write(raw2)

print('\nSaved to', path)
