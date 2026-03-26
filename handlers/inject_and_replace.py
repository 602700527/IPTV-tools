#!/usr/bin/env python3
"""Replace generateSEOHomepage in seo-handler.js with the new version"""
import re

# Read extracted CSS
with open(r'C:\Users\60270\Desktop\cfworker2\handlers\extracted.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Read the new function
with open(r'C:\Users\60270\Desktop\cfworker2\handlers\generate_seo_homepage_new.js', 'r', encoding='utf-8') as f:
    new_func = f.read()

# Replace INLINE_CSS_HERE with actual CSS
# Need to escape for JS string: \ then ` then ${
def js_escape(s):
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

css_escaped = js_escape(css)
new_func = new_func.replace('INLINE_CSS_HERE', '`' + css_escaped + '`')
print(f"CSS escaped: {len(css_escaped)} chars")
print(f"New function: {len(new_func)} chars")

# Read seo-handler.js
with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8') as f:
    seo_content = f.read()

# Find old function boundaries
marker_start = 'export async function generateSEOHomepage'
marker_end = 'export async function generateChannelPage'
start_idx = seo_content.index(marker_start)
end_idx = seo_content.index(marker_end)
print(f"Old function: {start_idx} to {end_idx} ({end_idx - start_idx} chars)")

# Replace
new_seo = seo_content[:start_idx] + new_func + '\n\n' + seo_content[end_idx:]

with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'w', encoding='utf-8') as f:
    f.write(new_seo)

print(f"Written: {len(new_seo)} chars. Done!")
