with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')

# Find and show both problematic lines
for i in [4696, 4697]:
    line = lines[i]
    print(f"Line {i+1}:")
    print(repr(line))
    print()