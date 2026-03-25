with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'rb') as f:
    content = f.read()

# "免费台道" bytes: \xe5\x85\x8d\xe8\xb4\xb9\xe5\x8f\xb0\xe9\x81\x93
# "免费频道" bytes: \xe5\x85\x8d\xe8\xb4\xb9\xe9\xa2\x91\xe9\x81\x93
# Only the 3rd character differs: \xe5\x8f\xb0 (台) -> \xe9\xa2\x91 (频)

bad = b'\xe5\x85\x8d\xe8\xb4\xb9\xe5\x8f\xb0\xe9\x81\x93'  # 免费台道
good = b'\xe5\x85\x8d\xe8\xb4\xb9\xe9\xa2\x91\xe9\x81\x93'  # 免费频道

print(f"Found '免费台道': {bad in content}")

new_content = content.replace(bad, good, 1)
print(f"Replacement done. Changed: {new_content != content}")

with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'wb') as f:
    f.write(new_content)

# Verify
with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'rb') as f:
    verify = f.read()

print(f"'免费频道' now present: {good in verify}")
print(f"'免费台道' still present: {bad in verify}")
