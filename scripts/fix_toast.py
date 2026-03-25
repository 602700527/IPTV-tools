with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    lines = f.readlines()

# Lines 1849-1855 (0-indexed: 1848-1854)
# Current broken state:
# L1849: toast.innerHTML = '' (empty string - broken!)
# L1850: <div style="..."> (raw HTML - NOT a string!)
# L1851-1854: more HTML
# L1855: \\''; (broken string terminator)
#
# Target: single string assignment with string concatenation

new_content = (
    b"      toast.innerHTML = '<div style=\"position:relative;padding-right:30px\">' +\n"
    b"        '<div class=\"toast-title\">'+(title)+'</div>' +\n"
    b"        '<div class=\"toast-message\">'+(message)+'</div>' +\n"
    b"        '<button class=\"toast-close\">&times;</button>' +\n"
    b"        '</div>';\n"
)

new_lines = lines[:1848] + [new_content] + lines[1855:]

with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'wb') as f:
    f.writelines(new_lines)

print('Done.')
print(f'Old line count: {len(lines)}, New line count: {len(new_lines)}')
print(f'Difference: {len(new_lines) - len(lines)}')
