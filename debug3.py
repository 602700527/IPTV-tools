with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')

# Get line 4697 (index 4696)
line = lines[4696]
print("Line 4697 raw:")
print(repr(line))
print()

# Find invalidateToken section
idx = line.find(b'invalidateToken')
snippet = line[idx:idx+50]
print("Around invalidateToken:")
print(repr(snippet))
print()
print("Hex:", snippet.hex())
print()

# The pattern in the file:
# We want: \'  (bytes 5c 27) followed by + (20 2b)
# But we might have: \' \' (5c 27 5c 27) or worse: \' \'  (5c 27 27)?

# Check each pair:
print("Byte pairs around invalidateToken:")
for i in range(len(snippet)):
    if i % 2 == 0:
        pair = snippet[i:i+2]
        print(f"{i}: {pair.hex()} = {pair.decode('ascii', errors='replace')}")