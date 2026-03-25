with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    data = f.read()

# backslash (0x5C) followed by backtick (0x60) = \`
BS_BT = bytes([0x5C, 0x60])
# Just backtick
BT = bytes([0x60])

results = []
pos = 0
while True:
    idx = data.find(BS_BT, pos)
    if idx == -1:
        break
    # Find closing backtick for this inner template
    j = idx + 2
    while j < len(data):
        if data[j:j+1] == BT and data[j-1:j] != BS_BT:
            break
        j += 1
    segment = data[idx:j+1]
    lineno = data[:idx].count(b'\n') + 1
    has_dollar = b'${' in segment
    results.append((lineno, segment[:80], has_dollar))
    pos = j + 1

print(f'Found {len(results)} escaped-backtick template literals')
with_dollar = [(l, s, d) for l, s, d in results if d]
print(f'With ${{...}} interpolations: {len(with_dollar)}')
for lineno, seg, _ in with_dollar[:30]:
    print(f'L{lineno}: {seg}')
