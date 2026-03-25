with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

print("File size: {} bytes".format(len(raw)))

# Find generate404Page function
marker = b'export async function generate404Page'
func_start = raw.find(marker)
print("generate404Page starts at byte {}".format(func_start))

# Find the last </html> in the file - that's the end of generate404Page's template
last_html = raw.rfind(b'</html>')
print("Last </html> at byte {}".format(last_html))
print("Context: " + repr(raw[last_html-30:last_html+50]))

# Now we need to find the EXACT ending of the function:
# It's </html>`;\n}
# Let's find </html>`; followed by \n} 
# The byte before the final } should be \n
# Check: at end of file, bytes are: </html>`;\n}
# Position of } = len(raw) - 1 = last byte
# Position of \n = len(raw) - 2
# Position of ; after backtick = ?

# The sequence is: </html>`; followed by \r\n}
# So: </html>`;\r\n}

# Let's verify
print("\nLast 10 bytes: " + repr(raw[-10:]))

# So the last function ends with: </html>`;\r\n}
# We want to insert the Response return before that final }

# The replacement target: </html>`;\r\n}
old_bytes = b'</html>`;\r\n}'
new_bytes = (
    b'</html>`;\r\n'
    b'\r\n'
    b'  return new Response(html, {\r\n'
    b'    status: 404,\r\n'
    b"    headers: {\r\n"
    b"      'Content-Type': 'text/html; charset=utf-8',\r\n"
    b"      'Cache-Control': 'public, max-age=3600',\r\n"
    b"      'X-Seo-Version': '2.0'\r\n"
    b'    }\r\n'
    b'  });\r\n'
    b'}'
)
print("\nOld bytes ({} bytes): ".format(len(old_bytes)) + repr(old_bytes))
print("New bytes ({} bytes): ".format(len(new_bytes)) + repr(new_bytes))

# Check if old_bytes exists in file
if old_bytes in raw:
    print("\nFOUND old_bytes in file!")
    idx = raw.rfind(old_bytes)
    print("At byte position: {}".format(idx))
    print("Context: " + repr(raw[idx-20:idx+len(old_bytes)+20]))
else:
    print("\nold_bytes NOT FOUND in file")
    # Try to find the closest match
    for i in range(len(raw)-len(old_bytes)-1, len(raw)):
        substr = raw[i:i+len(old_bytes)]
        if substr[:10] == old_bytes[:10]:
            print("Near match at byte {}: {}".format(i, repr(substr)))
            break
