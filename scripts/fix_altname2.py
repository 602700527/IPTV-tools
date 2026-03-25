with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print('Before: alternateName occurrences:', txt.count('alternateName'))

# Fix JSON-LD style: alternateName": "IPTV Search" -> alternateName": "IPTV Live"
txt = txt.replace('alternateName": "IPTV Search"', 'alternateName": "IPTV Live"')

# Also fix JS object style: alternateName: "IPTV Search" -> alternateName: "IPTV Live"
txt = txt.replace('alternateName: "IPTV Search"', 'alternateName: "IPTV Live"')

print('After: alternateName occurrences:', txt.count('alternateName'))

# Verify
idx = txt.find('alternateName')
print('First occurrence:', repr(txt[idx:idx+50]))

with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'w', encoding='utf-8') as f:
    f.write(txt)
print('Saved')
