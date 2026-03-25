with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()

lines = raw.split('\n')
print(f"Total lines: {len(lines)}")

# P0-1: Change status 404 -> 200 in generateSEOHomepage(line 246), generateChannelPage(line 374), generateCategoryPage(line 374)
# Line 739 is generate404Page, keep 404
# We'll replace ALL status: 404 occurrences in new Response blocks EXCEPT the one at line 739 (generate404Page)

# Strategy: find the three status: 404 in new Response(html) contexts and replace
# The 3 occurrences to change are at line 246 and 374
# We identify by context: they come after the HTML template closures (</html>`)

changes = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == 'status: 404,':
        # Check context - is this in generate404Page?
        # generate404Page ends the template with HOME_HTML (now FOOTER_HTML) and has a distinctive comment
        # The ones we want to change are in generateSEOHomepage, generateChannelPage, generateCategoryPage
        # All three are preceded by </html>`;
        # Check prev 3 lines for </html>
        prev_context = '\n'.join(lines[max(0,i-5):i])
        if '</html>' in prev_context:
            # This is one of the three we want to change
            lines[i] = line.replace('status: 404,', 'status: 200,')
            changes += 1
            print(f"Line {i+1}: changed to status: 200")
        else:
            print(f"Line {i+1}: kept as 404 (generate404Page)")

print(f"Total changes: {changes}")

with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print("Saved seo-handler.js")
