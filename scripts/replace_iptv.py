with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

before = txt.count('IPTV Live')
print(f'替换前: {before} 处')

# 全局替换 IPTV Live -> IPTV Search
txt = txt.replace('IPTV Live', 'IPTV Search')

after_wrong = txt.count('IPTV Live')
print(f'替换后检查: {after_wrong} 处 (应为0)')

# 检查 alternateName 是否被误替换
alt_wrong = txt.count('alternateName: "IPTV Search"')
print(f'alternateName 被误替换: {alt_wrong} 处，需要还原')

# 还原 alternateName 中的 IPTV Search -> IPTV Live
txt = txt.replace('alternateName: "IPTV Search"', 'alternateName: "IPTV Live"')

final_live = txt.count('IPTV Live')
final_search = txt.count('IPTV Search')
print(f'最终 IPTV Live 出现: {final_live} 处 (应为 alternateName)')
print(f'最终 IPTV Search 出现: {final_search} 处')

with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'w', encoding='utf-8') as f:
    f.write(txt)
print('文件已写入完成')
