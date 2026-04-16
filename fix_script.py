#!/usr/bin/env python3
# Fix the escaping issue

with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()

lines = content.split(b'\n')

# Print original line 4697
print("Original line 4697:")
print(lines[4696])
print()
print("Original line 4698:")
print(lines[4697])
print()

# The problem is that the file contains \\' instead of \'
# We need to replace \\' with \' in the onclick attributes

# Find lines with the problem
for i in [4696, 4697]:  # 0-indexed
    line = lines[i]
    if b'invalidateToken' in line or b'extendToken' in line:
        print(f"Line {i+1} has the problem")
        # Replace \\' with \'
        # In bytes: b'\\"' becomes b'\\"'
        # Actually we need to replace b"\\\\'" (which is \\') with b"\\'" (which is \')
        new_line = line.replace(b"\\\\'", b"\\'")
        if new_line != line:
            print(f"Fixed line {i+1}")
            lines[i] = new_line
        else:
            print(f"No fix needed for line {i+1}")

# Write back
with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'wb') as f:
    f.write(b'\n'.join(lines))

print("Done!")