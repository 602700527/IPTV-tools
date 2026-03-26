with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()
import re

# Find generateCategoryPage function
idx = txt.find('export async function generateCategoryPage')
if idx >= 0:
    line = txt[:idx].count('\n') + 1
    print(f'generateCategoryPage starts at L{line}')
    # Show first 60 lines of function
    func = txt[idx:idx+3000]
    lines = func.split('\n')
    for i in range(min(40, len(lines))):
        print(f'  {lines[i]}')
