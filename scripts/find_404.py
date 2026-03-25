with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

print("File size: {} bytes".format(len(raw)))

# Find generate404Page function
marker = b'export async function generate404Page'
func_start = raw.find(marker)
print("generate404Page starts at byte {}".format(func_start))

# Find last </html> in the file
last_html = raw.rfind(b'</html>')
print("Last </html> at byte {}".format(last_html))

# Look at context around the last </html>
print("Context around last </html>:")
print(repr(raw[last_html-20:last_html+80]))

# Find </html>`; in the raw bytes
html_backtick = raw.rfind(b'</html>`;')
print("\nLast </html>`; at byte {}".format(html_backtick))

# Look at what's after the last </html>`;
print("After last </html>`;:")
print(repr(raw[html_backtick:html_backtick+100]))
