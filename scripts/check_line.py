with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    lines = f.readlines()

print('L1927 (idx 1926):', repr(lines[1926][:60]))
print('L1928 (idx 1927):', repr(lines[1927][:60]))

# Check the pattern
curr = lines[1926].rstrip()
nxt = lines[1927].rstrip()
print()
print('After rstrip:')
print('  curr ends with:', repr(curr[-10:]))
print("  = '' in curr:", b"= ''" in curr)
print('  nxt starts with:', repr(nxt[:8]))
print('  nxt[0]:', nxt[0] if nxt else b'empty')
