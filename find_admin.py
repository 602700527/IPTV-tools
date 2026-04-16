import os

# List all files
files = os.listdir('.')
print("Files in directory:")
for f in files:
    if 'admin' in f.lower():
        print(f"  {f}")

# Check if there's a backup or different version
print()
print("Looking for invalidateToken in current admin-page.js:")
with open('admin-page.js', 'rb') as f:
    content = f.read()
if b'invalidateToken' in content:
    print("Found invalidateToken!")
    lines = content.split(b'\n')
    for i, line in enumerate(lines):
        if b'invalidateToken' in line:
            print(f"Line {i+1}: {repr(line[:100])}")
else:
    print("NOT found in admin-page.js")

# Check git log for admin-page.js
print()
print("Git log for admin-page.js:")
import subprocess
result = subprocess.run(['git', 'log', '--oneline', '-5', '--', 'admin-page.js'],
                       capture_output=True, text=True, cwd='.')
print(result.stdout if result.stdout else result.stderr)