with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

old_block = (
    b'  // \xe9\xa2\x91\xe9\x81\x93\xe9\xa1\xb5\xef\xbc\x88\xe6\x9c\x80\xe5\xa4\x9a1000\xe4\xb8\xaa\xef\xbc\x89\r\n'
    b'\r\n'
    b'  const activeChannels = channels.filter(ch => ch.is_active !== 0).slice(0, 1000);\r\n'
    b'\r\n'
    b'  for (const ch of activeChannels) {\r\n'
    b'\r\n'
    b'    xml += `  <url><loc>${origin}/channel/${escapeAttr(ch.channel_hash)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>\\n`;\r\n'
    b'\r\n'
    b'  }\r\n'
)

new_block = (
    b'  // \xe9\xa2\x91\xe9\x81\x93\xe9\xa1\xb5\xe5\xb7\xb2\xe7\xa7\xbb\xe9\x99\xa4\xe2\x80\x94\xe2\x80\x94\xe9\xa2\x91\xe9\x81\x93\xe9\xa1\xb5\xe9\x87\x8d\xe5\xa4\x9a\xe4\xb8\x8a\xe4\xb8\x8b\xe7\xba\xbf\xe4\xb8\x8d\xe9\x80\x82\xe5\x90\x88 Google \xe7\xb4\xa2\xe5\xbc\x95\xef\xbc\x8c sitemap \xe4\xb8\xad\xe5\xa4\x9a\xe9\x87\x8f\xe6\xad\xbb\xe9\x93\xbe\xe4\xbc\x9a\xe6\x8d\x9f\xe5\xae\xb9\xe6\x8a\x93\xe5\x8f\x96\xe9\xa2\x84\xe7\xae\x97\xe3\x80\x82\r\n'
    b'  // \xe5\xa6\x82\xe9\x9c\x80\xe6\x81\xa2\xe5\xa4\x8d\xef\xbc\x8c\xe5\xb0\x86\xe4\xb8\x8b\xe9\x9d\xa2\xe6\xb3\xa8\xe9\x87\x8a\xe5\xaf\xb9\xe5\xba\x94\xe4\xbb\xa3\xe7\xa0\x81\xe5\x9d\x97\xe5\x8f\x96\xe6\xb6\x88\xe5\x8d\x95\xe5\x8f\x91\xe5\x8f\xaf\xe3\x80\x82\r\n'
    b'  // const activeChannels = channels.filter(ch => ch.is_active !== 0).slice(0, 1000);\r\n'
    b'  // for (const ch of activeChannels) {\r\n'
    b'  //   xml += `  <url><loc>${origin}/channel/${escapeAttr(ch.channel_hash)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>\\n`;\r\n'
    b'  // }\r\n'
)

count = raw.count(old_block)
print(f'Found {count} occurrence(s)')

if count > 0:
    new_raw = raw.replace(old_block, new_block, 1)
    with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'wb') as f:
        f.write(new_raw)
    print('Replaced and saved!')
    # Verify
    with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
        v = f.read()
    print('activeChannels still in file:', b'activeChannels' in v)
    print('New comment present:', b'\xe5\xb7\xb2\xe7\xa7\xbb\xe9\x99\xa4' in v)
else:
    print('ERROR: block not found')
