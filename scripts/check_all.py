files = {
    'page-footer.js': r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js',
    'page-header.js': r'C:\Users\60270\Desktop\cfworker2\components\page-header.js',
    'logo.svg': r'C:\Users\60270\Desktop\cfworker2\public\logo.svg',
    'playstation-page.js': r'C:\Users\60270\Desktop\cfworker2\playstation-page.js',
}
for name, path in files.items():
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
    live_count = txt.count('IPTV Live')
    search_count = txt.count('IPTV Search')
    print(name + ': IPTV Live=' + str(live_count) + ', IPTV Search=' + str(search_count))
