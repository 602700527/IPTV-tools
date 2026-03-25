with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

lines = content.split('\n')

# Find generate404Page function boundaries
start = None
for i, line in enumerate(lines):
    if 'export async function generate404Page' in line:
        start = i
        break

if start is None:
    print("Function not found!")
else:
    print(f"Function starts at line {start+1}")
    # Count braces
    brace_count = 0
    end_line = start
    for i in range(start, len(lines)):
        brace_count += lines[i].count('{') - lines[i].count('}')
        if brace_count == 0 and i > start:
            end_line = i
            break
    print(f"Function ends at line {end_line+1}")
    print("\nLast 5 lines of function:")
    for i in range(max(start, end_line-4), end_line+1):
        print(f"  Line {i+1}: {lines[i].rstrip()}")
