import re

HOME = r'C:\Users\60270\Desktop\cfworker2\home-page.js'
with open(HOME, 'rb') as f:
    raw = f.read()

BS_BT = bytes([0x5C, 0x60])  # \`
BT = bytes([0x60])              # `

def convert_template(segment_bytes):
    """Convert \`...${...}...\` to string concat '...' + ... + '...'."""
    # Remove the outer \`...\` delimiters
    inner = segment_bytes[2:-1]  # strip leading \` and trailing \`
    
    # Decode to string for regex
    inner_str = inner.decode('utf-8', errors='replace')
    
    parts = []
    last_pos = 0
    for m in re.finditer(r'\$\{([^}]+)\}', inner_str):
        # Text before this ${...}
        before = inner_str[last_pos:m.start()]
        if before:
            escaped = before.replace("\\", "\\\\").replace("'", "\\'")
            parts.append("'" + escaped + "'")
        # The expression inside
        expr = m.group(1)
        parts.append('(' + expr + ')')
        last_pos = m.end()
    # Text after last ${
    after = inner_str[last_pos:]
    if after:
        escaped = after.replace("\\", "\\\\").replace("'", "\\'")
        parts.append("'" + escaped + "'")
    
    return "'" + "+".join(parts) + "'"

# Find and replace all \`...${{...}}...\` patterns
results = []
search_from = 0
while True:
    idx = raw.find(BS_BT, search_from)
    if idx == -1:
        break
    # Find closing backtick
    j = idx + 2
    while j < len(raw):
        if raw[j:j+1] == BT and raw[j-1:j] != BS_BT:
            break
        j += 1
    segment = raw[idx:j+1]
    if b'${' in segment:
        lineno = raw[:idx].count(b'\n') + 1
        new_seg = convert_template(segment)
        results.append((lineno, segment, new_seg.encode()))
    search_from = j + 1

print(f'Found {len(results)} template literals to convert')
for lineno, old, new in results[:10]:
    print(f'  L{lineno}: {old[:60]} -> {new[:60]}')

# Replace backwards so byte positions stay valid
new_raw = bytearray(raw)
offset = 0
for lineno, old, new in results:
    idx = bytes(new_raw).find(old)
    if idx >= 0:
        new_raw[idx:idx+len(old)] = new
    else:
        print(f'  WARNING: not found at L{lineno}')

with open(HOME, 'wb') as f:
    f.write(new_raw)

print(f'Done. Applied {len(results)} fixes.')
