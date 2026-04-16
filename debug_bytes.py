with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')

line = lines[4697]
# Find extendToken
idx = line.find(b'extendToken')
snippet = line[idx:idx+20]

print("Bytes around extendToken:")
for i, b in enumerate(snippet):
    print(f"{i:2d}: 0x{b:02x} = {chr(b) if 32 <= b < 127 else '?'}")

print()
print("Full hex of snippet:")
print(snippet.hex())

# What we want:
# extendToken(\'\' + escapeHtml
# Bytes: 65 78 74 65 6e 64 54 6f 6b 65 6e 28 5c 27 5c 27 20 2b 20
# i.e. ( \ ' \ ' + )

print()
print("Expected hex for extendToken(\\'\\' +:")
expected = b"extendToken(" + bytes([0x5c, 0x27, 0x5c, 0x27]) + b" + "
print("Expected:", expected.hex())
print("Actual:  ", snippet[:15].hex())