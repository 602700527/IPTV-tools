with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    lines = f.readlines()

problems = []
for i in range(len(lines) - 1):
    line = lines[i]
    next_line = lines[i + 1]
    stripped = line.rstrip(b'\r\n')
    next_stripped = next_line.rstrip(b'\r\n')
    # If a line ends with = '' and next line starts with <div or <button
    if (b"= ''" in line or b"=''" in line or b'= ""' in line):
        if len(next_stripped) > 3 and next_stripped[0:4] in [b' <d', b' <b', b' <s', b' <i', b' <t']:
            problems.append((i + 1, stripped[:80], next_stripped[:80]))

print(f'Found {len(problems)} potential broken assignments')
for lineno, l1, l2 in problems[:10]:
    print(f'  L{lineno}: {l1}')
    print(f'  L{lineno+1}: {l2}')
    print()
