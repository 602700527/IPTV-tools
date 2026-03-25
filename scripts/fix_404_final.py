with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

import re

print(f"File size: {len(raw)} bytes")

# Find generate404Page function
func_start = raw.find(b'export async function generate404Page')
print(f"generate404Page starts at byte {func_start}")

# Find return backtick inside the function
ret_start = raw.find(b'ETURN_BOUNDARY_PLACEHOLDER', raw[func_start:])  # placeholder
# Use the fact that return <backtick is unique
ret_start = raw.find(b"ETURN_PLACEHOLDER", func_start + len(b"export async function generate404Page"))
print(f"Function starts at {func_start}, next: {repr(raw[func_start:func_start+60])}")

# Find the LAST </html> in the entire file
last_html_pos = raw.rfind(b'</html>')
print(f"Last </html> at byte {last_html_pos}")

# Find the </html>`; that closes the LAST template literal (generate404Page's return)
# This should be at or near the last </html>
# Look for </html>`; followed by \r\n}
candidate = raw.rfind(b'</html>`;\r\n}')
print(f"Last </html>`; followed by }} at byte {candidate}")

# Let's look at what's actually between last </html> and end of file
after_last_html = raw[last_html_pos:]
print(f"After last </html>: {repr(after_last_html[:100])}")
