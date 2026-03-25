with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    lines = f.readlines()

broken = []
for i in range(len(lines) - 1):
    curr = lines[i].rstrip()
    nxt = lines[i+1].rstrip()
    
    # Current line ends with = '' or = "" 
    # Next line starts with whitespace then <div
    has_empty_str = (b"= ''" in curr or b'= ""' in curr or b"=''" in curr or b'=""' in curr)
    next_is_div = len(nxt) > 0 and nxt.lstrip()[0:4] == b'<div'
    
    if has_empty_str and next_is_div:
        broken.append((i+1, i+2, curr[:80], nxt[:80]))

print(f'Found {len(broken)} broken innerHTML assignments:')
for start, next_line, l1, l2 in broken:
    print(f'  L{start} ends with empty str, L{next_line} starts with <div:')
    print(f'    L{start}: {l1}')
    print(f'    L{next_line}: {l2}')
    print()
