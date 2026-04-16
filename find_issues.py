import re

with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()

lines = content.split(b'\n')

# Look for patterns that could cause issues:
# - Single quote followed by single quote without backslash in between
# - Unescaped quotes that could break strings

issues = []
for i, line in enumerate(lines, 1):
    # Check for pattern: ' followed by ' (unescaped quote pair ending string)
    # This is a heuristic - look for the specific pattern
    line_str = line.decode('utf-8', errors='replace')
    # Check if there's a JS string issue with unescaped quotes
    if "\\'" in line_str or "\\'" in line_str:
        # Find the context
        for j, c in enumerate(line):
            if j > 0 and j < len(line) - 1:
                if line[j] == 0x27 and line[j-1] != 0x5c:  # ' not preceded by \
                    if line[j+1] == 0x27:  # followed by ' - likely unescaped
                        issues.append((i, j, 'unescaped quote pair', repr(line[max(0,j-20):j+20])))

# Better approach: look for the specific bad pattern we fixed and similar
print("Searching for potential issues...")

# Look for patterns like: \'\' (backslash-quote followed by unescaped quote)
for i, line in enumerate(lines, 1):
    # Pattern: 5c 27 27 - this is \' followed by ' (bad)
    # Pattern: 5c 27 5c 27 - this is \' followed by \' (good)
    for j in range(len(line) - 2):
        if line[j] == 0x5c and line[j+1] == 0x27:
            # We have \'
            if line[j+2] == 0x27 and (j+3 >= len(line) or line[j+3] != 0x5c):
                # It's \' followed by unescaped ' without another \ after
                print(f"Line {i}, col {j}: \' followed by unescaped quote")
                print(f"  Context: {repr(line[j:j+30])}")

print("Done checking")
print(f"\nTotal lines: {len(lines)}")