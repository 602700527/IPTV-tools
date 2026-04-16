#!/usr/bin/env python3
# Check the exact bytes around the problematic lines

with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()

lines = content.split(b'\n')
print("Line 4697 (bytes 4696):")
print(lines[4696])
print()
print("Line 4698 (bytes 4697):")
print(lines[4697])
print()
print("Looking for invalidateToken and extendToken...")
for i, line in enumerate(lines):
    if b'invalidateToken' in line or b'extendToken' in line:
        print(f"Line {i+1}: {line[:200]}")