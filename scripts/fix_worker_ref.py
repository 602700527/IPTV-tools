with open(r'C:\Users\60270\Desktop\cfworker2\worker.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

old = "./playstation-page.js"
new = "./home-page.js"
cnt = txt.count(old)
print(f'Found {cnt} reference(s) to {old}')

if cnt > 0:
    txt = txt.replace(old, new)
    with open(r'C:\Users\60270\Desktop\cfworker2\worker.js', 'w', encoding='utf-8') as f:
        f.write(txt)
    print(f'Replaced -> {new}')
else:
    print('No replacement needed')
