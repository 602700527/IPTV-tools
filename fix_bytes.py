#!/usr/bin/env python3
# Fix the escaping issue

with open(r'C:\Users\60270\Desktop\cfworker2\admin-page.js', 'rb') as f:
    content = f.read()

# The problem is \\' (double backslash + single quote)
# It should be \' (single backslash + single quote)

# Fix line 4697
old_4697 = b'\\\'<button class="btn btn-sm btn-danger" onclick="invalidateToken(\\\\\\'\\\' + escapeHtml(token.token) + \'\\\\\'\\\'")'
new_4697 = b'\\\'<button class="btn btn-sm btn-danger" onclick="invalidateToken(\\\'\\' + escapeHtml(token.token) + \\\'\\')"'

# Fix line 4698
old_4698 = b'\\\'<button class="btn btn-sm" onclick="extendToken(\\\\\\'\\\' + escapeHtml(token.token) + \'\\\\\'\\\'")>'
new_4698 = b'\\\'<button class="btn btn-sm" onclick="extendToken(\\\'\\' + escapeHtml(token.token) + \\\'\\')">'

print("Original line 4697:")
print(lines[4696])
print()
print("Original line 4698:")
print(lines[4697])