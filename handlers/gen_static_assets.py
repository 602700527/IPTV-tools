#!/usr/bin/env python3
"""Create static-assets.js - CSS as a static JS string importable by other modules"""
with open(r'C:\Users\60270\Desktop\cfworker2\static\seo-home.css', 'r', encoding='utf-8') as f:
    css = f.read()

# In a JS template literal we must escape:
# 1. \ (backlash) -> \\
# 2. ` (backtick) -> \`  
# 3. ${ (template interpolation start) -> \${ (but this CSS has none)
# 4. */ (CSS comment end in template) -> *\/ 

def js_escape_css(s):
    s = s.replace('\\', '\\\\')   # backslash first
    s = s.replace('`', '\\`')     # backtick
    s = s.replace('${', '\\${')   # template interpolation (defensive)
    s = s.replace('*/', '*\\' + '/')    # CSS comment end in template literal
    return s

css_escaped = js_escape_css(css)
js_content = "// 首页静态 HTML 专用 CSS (from home-page.js)\n" \
             "export const SEO_HOME_CSS = `" + css_escaped + "`;\n"

print(f"CSS: {len(css)} chars")
print(f"Backtick: {css.count('`')}, Dollar{{: {css.count('${')}, */: {css.count('*/')}")
print(f"Escaped: {len(css_escaped)} chars")
print(f"JS: {len(js_content)} chars")

with open(r'C:\Users\60270\Desktop\cfworker2\static-assets.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# Verify
content = open(r'C:\Users\60270\Desktop\cfworker2\static-assets.js', encoding='utf-8').read()
print(f"Written: {len(content)} chars, remaining */: {content.count('*/')}")
