import re

HOME = r'C:\Users\60270\Desktop\cfworker2\home-page.js'
with open(HOME, 'rb') as f:
    data = f.read()

count_fixed = 0
count_skipped = 0

def replace_template(match):
    global count_fixed, count_skipped
    # match is a template literal with interpolations like: `${var}` or `${expr}`
    # that appears inside a JS string (escaped backtick in source)
    full = match.group(0)
    # Remove the outer escaped backticks: \` ... \`
    inner = full[2:-2]  # strip leading \` and trailing \`
    
    # Check if there's actually a ${...} interpolation
    if '${' not in inner:
        count_skipped += 1
        return full
    
    # We'll rebuild using string concatenation
    # Find all ${...} expressions
    parts = []
    last_pos = 0
    for m in re.finditer(r'\$\{([^}]+)\}', inner):
        # Text before this ${...}
        before = inner[last_pos:m.start()]
        if before:
            # Escape quotes in the before text
            escaped = before.replace("'", "\\'").replace('\\', '\\\\')
            parts.append("'" + escaped + "'")
        # The expression
        parts.append('(' + m.group(1) + ')')
        last_pos = m.end()
    # Text after last ${
    after = inner[last_pos:]
    if after:
        escaped = after.replace("'", "\\'").replace('\\', '\\\\')
        parts.append("'" + escaped + "'")
    
    result = "'" + "+".join(parts) + "'"
    count_fixed += 1
    return result

# Find all template literals within the JS string context
# Pattern: \`...content with possible ${...}...\` 
# where the outer \` is an escaped backtick in source
# We need to find things like: \`...${...}...\`
pattern = rb'\x60[^\x60]*\x60'
# But we need to exclude already-converted ones (single quotes)
# Actually, let's just use the pattern: \` followed by content and closing \`
# But we need to find ones WITH interpolations

# Simple approach: find all \`...\` with ${...} inside
results = []
i = 0
while i < len(data):
    # Find next escaped backtick \`
    idx = data.find(b'\x60', i)
    if idx == -1:
        break
    # Check if preceded by backslash (escape)
    if idx > 0 and data[idx-1:idx] == b'\\':
        # This is an escaped backtick - find the matching closing \`
        search_start = idx + 1
    else:
        search_start = idx + 1
    
    # Find the closing unescaped backtick
    j = search_start
    while j < len(data):
        if data[j:j+1] == b'\x60' and data[j-1:j] != b'\\':
            break
        j += 1
    
    segment = data[idx:j+1]
    if b'${' in segment:
        results.append((idx, segment))
    i = j + 1

print(f'Found {len(results)} template literals with interpolations')

# Process and replace
new_data = bytearray(data)
offset = 0
for idx, segment in results:
    original = segment
    # Convert the inner content
    inner = segment[2:-1]  # remove \` at both ends
    # Rebuild
    parts = []
    last_pos = 0
    for m in re.finditer(r'\$\{([^}]+)\}', bytes(inner).decode('utf-8', errors='replace')):
        before = bytes(inner)[last_pos:m.start()].decode('utf-8', errors='replace')
        if before:
            escaped = before.replace("'", "\\'")
            parts.append("'" + escaped + "'")
        parts.append('(' + m.group(1) + ')')
        last_pos = m.end()
    after = bytes(inner)[last_pos:].decode('utf-8', errors='replace')
    if after:
        escaped = after.replace("'", "\\'")
        parts.append("'" + escaped + "'")
    result = "'" + "+".join(parts) + "'"
    # Pad with single quotes to match original length approximately
    # Actually we need to replace the segment with a string expression
    # Since we're inside a template string, we use string concatenation
    print(f'  Would replace: {segment[:50]} -> {result[:50]}')

print(f'Total: {count_fixed} fixed, {count_skipped} skipped')
