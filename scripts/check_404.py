import re

for fname, label in [
    (r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'seo-handler.js'),
    (r'C:\Users\60270\Desktop\cfworker2\worker.js', 'worker.js'),
]:
    with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print(f'\n=== {label} ===')
    
    # Find 'Not Found' plain responses
    for m in re.finditer(r"'Not Found'", content):
        line_num = content[:m.start()].count('\n') + 1
        ctx = content[max(0, m.start()-50):m.start()+50]
        print(f"  Line {line_num}: 'Not Found' found in context: {ctx!r}")
    
    # Find generate404Page usage
    count = content.count('generate404Page')
    print(f"  generate404Page mentions: {count}")
    
    # Find status: 404
    for m in re.finditer(r"status.*404", content):
        line_num = content[:m.start()].count('\n') + 1
        ctx = content[max(0, m.start()-30):m.start()+60]
        print(f"  Line {line_num}: {ctx!r}")

print('\nDone')
