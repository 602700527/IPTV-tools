with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

# Find all references to generate404Page
import re
print("=== All generate404Page references ===")
for m in re.finditer(b'generate404Page', raw):
    pos = m.start()
    line_num = raw[:pos].count(b'\n') + 1
    ctx = raw[pos:pos+80]
    print("  Line {}: {}".format(line_num, repr(ctx[:60])))

print()
print("=== verify404Response() check ===")
# Find generate404Page function
func_start = raw.find(b'export async function generate404Page')
func_end = raw.find(b'\n}', func_start + 100)  # rough
func_raw = raw[func_start:func_start+5000]
if b'return new Response(html' in func_raw:
    print("generate404Page RETURNS Response object: OK")
    # Find the exact return
    idx = func_raw.find(b'return new Response')
    print("  Return: " + repr(func_raw[idx:idx+100]))
else:
    print("ERROR: generate404Page does NOT return Response object!")

print()
print("=== handleSEOPage generate404Page calls ===")
# Find the two calls in handleSEOPage
for m in re.finditer(b'return await generate404Page', raw):
    pos = m.start()
    line_num = raw[:pos].count(b'\n') + 1
    ctx = raw[pos:pos+60]
    print("  Line {}: {}".format(line_num, repr(ctx[:60])))

print()
print("=== Final bytes check ===")
print("Last 100 bytes: " + repr(raw[-100:]))
