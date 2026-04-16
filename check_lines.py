with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()
lines = content.split(b'\n')

# Line 4698 (1-indexed) = index 4697
line = lines[4697]
print("Line 4698:")
print(repr(line))
print()
print("Length:", len(line))

# Find invalidateToken (line 4697) and extendToken (line 4698)
for i in [4696, 4697]:
    l = lines[i]
    if b'invalidateToken' in l:
        idx = l.find(b'invalidateToken')
        print(f"\nLine {i+1} invalidateToken context:")
        print(repr(l[idx:idx+60]))
    if b'extendToken' in l:
        idx = l.find(b'extendToken')
        print(f"\nLine {i+1} extendToken context:")
        print(repr(l[idx:idx+60]))