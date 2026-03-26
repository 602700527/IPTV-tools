#!/usr/bin/env python3
"""Generate new generateStaticHomepage function for seo-handler.js"""
import re

# Read the original home-page.js
with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8') as f:
    home_content = f.read()

# Extract CSS
style_start = home_content.index('<style>') + 7
style_end = home_content.index('</style>')
css = home_content[style_start:style_end]
print(f"CSS: {len(css)} chars")

# Check for backticks
backtick_count = css.count('`')
print(f"Backticks in CSS: {backtick_count}")
dollar_count = css.count('${')
print(f"Template literal in CSS: {dollar_count}")

# Write extracted CSS
with open(r'C:\Users\60270\Desktop\cfworker2\handlers\extracted.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Done")
