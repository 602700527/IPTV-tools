import re

with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'>([^<]+)<', content)
with open(r'C:\Users\60270\Desktop\cfworker2\scripts\svg_check.txt', 'w', encoding='utf-8') as out:
    out.write("All text labels in og-image.svg:\n")
    for t in matches:
        t = t.strip()
        if t:
            out.write(f"  [{t}]\n")
    
    out.write("\nOld strings still present?\n")
    out.write(f"  免费观看: {'YES (BAD!)' if '免费观看' in content else 'No (good)'}\n")
    out.write(f"  高清画质: {'YES (BAD!)' if '高清画质' in content else 'No (good)'}\n")
    out.write(f"  免费高清电视观看平台: {'YES (BAD!)' if '免费高清电视观看平台' in content else 'No (good)'}\n")
    out.write(f"  IPTV Search: {'YES' if 'IPTV Search' in content else 'NO'}\n")
    out.write(f"  免费IPTV频道目录与搜索工具: {'YES (good)' if '免费IPTV频道目录与搜索工具' in content else 'NO'}\n")
    out.write(f"  免费频道: {'YES (good)' if '免费频道' in content else 'NO'}\n")
    out.write(f"  每日更新: {'YES (good)' if '每日更新' in content else 'NO'}\n")
    out.write(f"  无需注册: {'YES' if '无需注册' in content else 'NO'}\n")
    out.write(f"  10000+频道: {'YES' if '10000+频道' in content else 'NO'}\n")

print("Done - results in svg_check.txt")
