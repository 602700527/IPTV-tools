with open(r'C:\Users\60270\Desktop\cfworker2\playstation-page.js', 'rb') as f:
    raw = f.read()

import re

print(f"Original size: {len(raw)} bytes")

# Count occurrences before
count_before = raw.count(b'IPTV Live')
print(f"'IPTV Live' occurrences before: {count_before}")

# Replacement rules
replacements = [
    # These are exact string replacements, order matters
    (b'IPTV Live - Free IPTV Link Search Engine | M3U8 M3U Playlist Search', b'IPTV Search — Free Live TV Channel Search | M3U8 M3U Playlist'),
    (b'IPTV Live - Free IPTV Link Search Engine', b'IPTV Search — Free IPTV Channel Search'),
    (b'IPTV Live', b'IPTV Search'),
]

for old, new in replacements:
    count = raw.count(old)
    raw = raw.replace(old, new)
    print(f"Replaced {count}x: {old!r}")

print(f"Final size: {len(raw)} bytes")

# Verify no 'IPTV Live' remains
remaining = raw.count(b'IPTV Live')
print(f"'IPTV Live' remaining: {remaining}")

with open(r'C:\Users\60270\Desktop\cfworker2\playstation-page.js', 'wb') as f:
    f.write(raw)

print("Done!")
