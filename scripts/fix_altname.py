with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print('修复前 alternateName "IPTV Search":', txt.count('alternateName: "IPTV Search"'))
print('修复前 alternateName "IPTV Live":', txt.count('alternateName: "IPTV Live"'))

# 还原 alternateName: "IPTV Search" -> "IPTV Live"
txt = txt.replace('alternateName: "IPTV Search"', 'alternateName: "IPTV Live"')

print('修复后 alternateName "IPTV Search":', txt.count('alternateName: "IPTV Search"'))
print('修复后 alternateName "IPTV Live":', txt.count('alternateName: "IPTV Live"'))

with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'w', encoding='utf-8') as f:
    f.write(txt)
print('Done')
