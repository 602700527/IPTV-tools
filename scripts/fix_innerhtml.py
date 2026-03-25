with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'rb') as f:
    lines = f.readlines()

orig_count = len(lines)

# Block 1: L1927-L1933 (indices 1926-1932), 7 lines -> 1 line
# Block 2: L2541-L2548 (indices 2540-2547), 8 lines -> 1 line
# Apply in REVERSE order so indices don't shift

toast_error_html = (
    b"      toast.innerHTML = '<div style=\"position:relative;padding-right:30px\">' +\n"
    b"        '<div class=\"toast-title\">'+(currentLanguage === 'zh-CN' ? '\xe2\x9a\xa0\xef\xb8\x8f \xe6\x92\xad\xe6\x94\xbe\xe5\xa4\xb1\xe8\xb4\xa5' : '\xe2\x9a\xa0\xef\xb8\x8f Playback Failed')+'</div>' +\n"
    b"        '<div class=\"toast-message\">'+(message)+'</div>' +\n"
    b"        '<button class=\"toast-close\">&times;</button>' +\n"
    b"        '</div>';\n"
)

playing_indicator_html = (
    b"      indicator.innerHTML = '<div class=\"playing-dots\">' +\n"
    b"        '<div class=\"playing-dot\"></div>' +\n"
    b"        '<div class=\"playing-dot\"></div>' +\n"
    b"        '<div class=\"playing-dot\"></div>' +\n"
    b"        '</div>' +\n"
    b"        '<span>'+(t('playing'))+': '+(escapeHtml(channelName))+'</span>';\n"
)

# Fix block 2 first (indices 2540-2547), since it's after block 1
step1 = lines[:2540] + [playing_indicator_html] + lines[2548:]
print(f'After removing block 2 (8 lines): {len(lines)} -> {len(step1)}')

# Fix block 1 (indices 1926-1932), now at same indices in step1
step2 = step1[:1926] + [toast_error_html] + step1[1933:]
print(f'After removing block 1 (7 lines): {len(step1)} -> {len(step2)}')

with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'wb') as f:
    f.writelines(step2)

print(f'Done. Final count: {len(step2)} (expected: {orig_count - 7 - 8 + 2})')
