with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')

# Check lines 4697 and 4698 (1-indexed)
for i in [4696, 4697]:
    line = lines[i]
    if b'invalidateToken' in line:
        idx = line.find(b'invalidateToken')
        snippet = line[idx:idx+40]
        print(f"Line {i+1} invalidateToken:")
        print("Hex:", snippet.hex())
        print("Bytes:")
        for j, b in enumerate(snippet):
            print(f"  {j}: 0x{b:02x} = {chr(b) if 32 <= b < 127 else '?'}")
        print()
    if b'extendToken' in line:
        idx = line.find(b'extendToken')
        snippet = line[idx:idx+40]
        print(f"Line {i+1} extendToken:")
        print("Hex:", snippet.hex())