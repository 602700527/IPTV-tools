with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

print("File size: {} bytes".format(len(raw)))

# Find generate404Page function end
marker = b'export async function generate404Page'
func_start = raw.find(marker)
print("generate404Page starts at byte {}".format(func_start))
print("Context: " + repr(raw[func_start:func_start+60]))

# Now find the LAST </html>`; in the ENTIRE file - that's the end of generate404Page's template
last_end = raw.rfind(b'</html>`;')
print("\nLast </html>`; at byte {}".format(last_end))
print("Next 100 bytes: " + repr(raw[last_end:last_end+100]))

# Find the position of the FIRST </main> that precedes this last </html>`;
# That will tell us if this is inside generate404Page
# Search backwards from last_end
chunk = raw[last_end-500:last_end]
idx = chunk.rfind(b'</main>')
if idx >= 0:
    abs_idx = last_end - 500 + idx
    print("\nNearest </main> before last </html>`; at byte {}".format(abs_idx))
    print("Context: " + repr(raw[abs_idx-20:abs_idx+60]))

# Check the function end
# The function should end with: </html>`;\n}\n
# We want to add the Response return between ; and }
print("\n--- Last 300 bytes of file ---")
print(repr(raw[-300:]))
