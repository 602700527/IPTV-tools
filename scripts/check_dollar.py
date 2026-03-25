with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    raw = f.read()

dollar_brace = b'${'
count = raw.count(dollar_brace)
print(f'Total occurrences of dollar-brace: {count}')

pos = 0
for i in range(min(10, count)):
    idx = raw.find(dollar_brace, pos)
    if idx == -1:
        break
    lineno = raw[:idx].count(b'\n') + 1
    print(f'  Line {lineno}, byte {idx}: {raw[idx:idx+50]}')
    pos = idx + 1
