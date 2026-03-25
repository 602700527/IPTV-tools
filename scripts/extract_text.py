with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    lines = f.readlines()

# L1930 = index 1929 - the toast-message line
line = lines[1929]
print('L1930 hex:', line.hex())
print('L1930 text attempt:')
try:
    print(line.decode('utf-8'))
except Exception as e:
    print('Error:', e)

# L1929 = index 1928 - the toast-title line with Chinese text
line1929 = lines[1928]
# Show the full hex from the emoji onwards
idx = line1929.find(b'\xe2\x9a\xa0')
print('\nL1929 from emoji onwards:')
print(line1929[idx:].hex())
# Try to decode the whole thing as utf-8 ignoring errors
full = line1929.decode('utf-8', errors='replace')
print('L1929 as string:', repr(full))
