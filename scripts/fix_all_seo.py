import re

# ============================================================
# PART 1: home-page.js
# ============================================================
HOME = r'C:\Users\60270\Desktop\cfworker2\home-page.js'
with open(HOME, 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print(f"home-page.js: {len(txt)} bytes")

# P0-2: Delete the duplicate title (second occurrence, line ~305)
lines = txt.split('\n')
dup_indices = []
for i, line in enumerate(lines):
    s = line.strip()
    if s.startswith('<title>') and 'IPTV Search' in s and s.endswith('</title>'):
        dup_indices.append(i)
        print(f"Title at line {i+1}: {s[:80]}")
# Keep first, delete rest
for idx in reversed(dup_indices[1:]):  # reverse to not shift indices
    print(f"Deleting duplicate title at line {idx+1}")
    del lines[idx]
txt = '\n'.join(lines)
print(f"After title cleanup: {len(txt)} bytes")

# P1-1: og:image SVG -> PNG
txt = txt.replace(
    'content="https://iptv-search.com/og-image.svg">',
    'content="https://iptv-search.com/og-homepage.png">'
)
txt = txt.replace(
    "content='https://iptv-search.com/og-image.svg'>",
    "content='https://iptv-search.com/og-homepage.png'>"
)
print(f"og:image PNG count: {txt.count('og-homepage.png')}")

# P1-2: Title and og:title shortened
for old, new in [
    ('<title>IPTV Search - Free IPTV Link Search Engine | M3U8 M3U Playlist Search</title>',
     '<title>IPTV Search \u2014 Free IPTV Channel Directory &amp; Search Engine</title>'),
    ('<meta property="og:title" content="IPTV Search - Free IPTV Link Search Engine">',
     '<meta property="og:title" content="IPTV Search \u2014 Free IPTV Channel Directory &amp; Search Engine">'),
]:
    count = txt.count(old)
    txt = txt.replace(old, new)
    print(f"Replaced title variant: {count}x")

# P1-5: Dynamic dateModified
# JSON-LD in script tag: "dateModified": "2026-02-19",  -> use JS template
txt = txt.replace(
    '"dateModified": "2026-02-19",',
    '"dateModified": "${new Date().toISOString().split(\'T\')[0]}",'
)
# meta tags in HTML (inside JS template literal):
# <meta name="article:modified_time" content="2026-02-19"> 
txt = txt.replace(
    '<meta name="article:modified_time" content="2026-02-19">',
    '<meta name="article:modified_time" content="${new Date().toISOString().split(\'T\')[0]}">'
)
txt = txt.replace(
    '<meta name="last-modified" content="2026-02-19">',
    '<meta name="last-modified" content="${new Date().toISOString().split(\'T\')[0]}">'
)
print(f"dateModified dynamic count: {txt.count('toISOString()')}")

with open(HOME, 'w', encoding='utf-8') as f:
    f.write(txt)
print("Saved home-page.js")

# ============================================================
# PART 2: seo-handler.js - generateSEOHomepage add og:description
# ============================================================
SEO = r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js'
with open(SEO, 'r', encoding='utf-8', errors='ignore') as f:
    seo = f.read()

# Find the <meta property="og:type" line inside generateSEOHomepage function
# and add og:description right after it
og_type_marker = '<meta property="og:type" content="website">'
pos = seo.find(og_type_marker)
if pos > 0:
    # Verify this is in generateSEOHomepage (before generateChannelPage at line ~254)
    channel_func_pos = seo.find('export async function generateChannelPage')
    if pos < channel_func_pos:
        line_end = seo.find('\n', pos)
        og_desc = (
            og_type_marker + '\n'
            '  <meta property="og:description"'
            ' content="Search over ${channels.length} free IPTV channels.'
            ' Browse live TV by country. Updated daily.">'
        )
        seo = seo[:pos] + og_desc + seo[line_end+1:]
        print("Added og:description to generateSEOHomepage")
    else:
        print("WARNING: og:type found but not in generateSEOHomepage!")
else:
    print("WARNING: og:type not found in seo-handler.js!")

with open(SEO, 'w', encoding='utf-8') as f:
    f.write(seo)
print("Saved seo-handler.js")

# ============================================================
# PART 3: page-footer.js
# ============================================================
FOOT = r'C:\Users\60270\Desktop\cfworker2\components\page-footer.js'
with open(FOOT, 'r', encoding='utf-8', errors='ignore') as f:
    foot = f.read()

# P1-3: Default language to English
foot = foot.replace(
    "translate.language.setLocal('chinese_simplified');",
    "translate.language.setLocal('english');"
)
print("\npage-footer.js: language -> english")

# P1-4: Remove suspicious third-party script
# The script is inside a comment: <!-- 100%填充 --> ... <script>(function(s){...gizokraijaw.net...</script>
# Find the whole block and remove it
giz_start = foot.find("gizokraijaw.net")
if giz_start > 0:
    # Find the opening comment before this
    comment_start = foot.rfind('<!--', 0, giz_start)
    comment_end = foot.find('-->', giz_start)
    if comment_end > 0:
        block = foot[comment_start:comment_end+3]
        foot = foot[:comment_start] + foot[comment_end+3:]
        print(f"Removed script block ({len(block)} bytes): {block[:60]!r}")
    else:
        print("WARNING: gizokraijaw found but no comment wrapper")

with open(FOOT, 'w', encoding='utf-8') as f:
    f.write(foot)
print("Saved page-footer.js")

print("\n=== All done! ===")
