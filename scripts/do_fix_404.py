with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

old_bytes = b'</html>`;\r\n}'
new_bytes = (
    b'</html>`;\r\n'
    b'\r\n'
    b'  return new Response(html, {\r\n'
    b'    status: 404,\r\n'
    b"    headers: {\r\n"
    b"      'Content-Type': 'text/html; charset=utf-8',\r\n"
    b"      'Cache-Control': 'public, max-age=3600',\r\n"
    b"      'X-Seo-Version': '2.0'\r\n"
    b'    }\r\n'
    b'  });\r\n'
    b'}'
)

if old_bytes in raw:
    idx = raw.rfind(old_bytes)
    print("Replacing at byte {}...".format(idx))
    raw = raw[:idx] + new_bytes + raw[idx+len(old_bytes):]
    with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'wb') as f:
        f.write(raw)
    print("Done! New size: {} bytes".format(len(raw)))
    print("File grew by {} bytes".format(len(new_bytes) - len(old_bytes)))
    print("\nLast 50 bytes:")
    print(repr(raw[-50:]))
else:
    print("ERROR: old_bytes not found!")
