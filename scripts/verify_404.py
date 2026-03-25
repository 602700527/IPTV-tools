with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

import re

print(f"File size: {len(raw)} bytes")

# Find all </html>` occurrences
matches = list(re.finditer(rb'</html>`;', raw))
print(f"Found {len(matches)} occurrences of </html>`;")
for m in matches:
    pos = m.start()
    ctx = raw[pos-30:pos+50]
    print(f"  pos {pos}: {repr(ctx)}")

print()

# Find generate404Page function end - look for FOOTER_HTML near end
# The function body starts with: return `<!DOCTYPE html>
# We want to see what's after the final </html>`; in the function
last_404_end = raw.rfind(b'</html>`;')
print(f"Last </html>`; at byte {last_404_end}")
print(f"Context after it (next 200 bytes): {repr(raw[last_404_end:last_404_end+200])}")

print()

# Check if the Response return was added
if b'return new Response(html' in raw:
    # Find all occurrences
    for m in re.finditer(rb'return new Response\(html', raw):
        ctx = raw[m.start():m.start()+60]
        print(f"Found 'return new Response(html' at {m.start()}: {repr(ctx)}")
else:
    print("NOT FOUND: 'return new Response(html'")
