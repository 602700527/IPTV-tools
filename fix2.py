with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')

# Check line 4697 (index 4696) - contains invalidateToken
line = lines[4696]
# Find invalidateToken and show 70 bytes
idx = line.find(b'invalidateToken')
snippet = line[idx:idx+70]

print("Current line 4697 invalidateToken section:")
print("Repr:", repr(snippet))
print()
print("Hex:", snippet.hex())
print()

# What we want:
# invalidateToken(\'' + escapeHtml(token.token) + '\'')
# In bytes:
# i  n  v  a  l  i  d  a  t  e  T  o  k  e  n  (  \  '  \  '     +    ...
# 69 6e 76 61 6c 69 64 61 74 65 54 6f 6b 65 6e 28 5c 27 5c 27 20 2b 20

# But we currently have:
# i  n  v  a  l  i  d  a  t  e  T  o  k  e  n  (  \  '  \  '  (no +!)
# 69 6e 76 61 6c 69 64 61 74 65 54 6f 6b 65 6e 28 5c 27 5c 27

# So we need to INSERT 20 2b 20 between the two \' sequences!

# The bad pattern is: 5c 27 5c 27
# The good pattern is: 5c 27 20 2b 20 5c 27

print("Bad pattern (current):  5c 27 5c 27")
print("Good pattern (needed):  5c 27 20 2b 20 5c 27")
print()

# Find all occurrences of the bad pattern and fix them
# Pattern: 5c 27 5c 27 (without the + in between)
bad_pattern = bytes([0x5c, 0x27, 0x5c, 0x27])
good_pattern = bytes([0x5c, 0x27, 0x20, 0x2b, 0x20, 0x5c, 0x27])

fixed_content = content.replace(bad_pattern, good_pattern)

if fixed_content != content:
    print("Found and fixed bad patterns!")
    with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'wb') as f:
        f.write(fixed_content)
    print("File updated")
else:
    print("No bad patterns found - might be a different issue")

# Verify the fix
with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    new_content = f.read()
new_lines = new_content.split(b'\n')
new_line = new_lines[4696]
new_idx = new_line.find(b'invalidateToken')
new_snippet = new_line[new_idx:new_idx+70]
print()
print("After fix:")
print("Repr:", repr(new_snippet))
print("Hex:", new_snippet.hex())