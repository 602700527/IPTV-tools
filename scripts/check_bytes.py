with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    raw = f.read()

# Find the first occurrence of ${ pattern
idx = raw.find(b'${')
if idx >= 0:
    print(f'First ${{ at byte {idx}')
    print(f'Context: {raw[max(0,idx-10):idx+30]}')
    print(f'Bytes: {raw[max(0,idx-5):idx+30].hex()}')
    # Check what's before the $
    for i in range(max(0, idx-5), idx):
        print(f'  Byte {i}: {raw[i]} = {hex(raw[i])} = {chr(raw[i]) if 32 <= raw[i] < 127 else "non-printable"}')
