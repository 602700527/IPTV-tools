with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

print(f"File size: {len(raw)} bytes")

# The last </html>`; is the end of generate404Page
# It ends with: </html>`;\r\n}
# We need to replace the final } with the Response return

old_tail = (
    b'\r\n'
    b'  </main>\r\n'
    b'  ${FOOTER_HTML(origin)}\r\n'
    b'</body>\r\n'
    b'</html>`;\r\n'
    b'}'
)

new_tail = (
    b'\r\n'
    b'  </main>\r\n'
    b'  ${FOOTER_HTML(origin)}\r\n'
    b'</body>\r\n'
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

print(f"Looking for old_tail ({len(old_tail)} bytes)...")
print(f"Old tail: {repr(old_tail)}")

if old_tail in raw:
    print("FOUND!")
    idx = raw.rfind(old_tail)
    print(f"Position: {idx}")
    raw = raw.replace(old_tail, new_tail, 1)
    with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'wb') as f:
        f.write(raw)
    print(f"Done! New size: {len(raw)} bytes")
else:
    print("NOT FOUND!")
    # Find what the actual ending looks like
    idx = raw.rfind(b'</html>')
    print(f"Last </html> context: {repr(raw[idx-100:idx+50])}")
