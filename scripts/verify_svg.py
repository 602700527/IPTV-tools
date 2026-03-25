with open(r'C:\Users\60270\Desktop\cfworker2\public\og-image.svg', 'rb') as f:
    content = f.read()

checks = [
    (b'IPTV Search', 'IPTV Search'),
    (b'\xe5\x85\x8d\xe8\xb4\xb9IPTV\xe5\x8f\xb0\xe9\x81\x93\xe7\x9b\xae\xe5\xbd\x95\xe4\xb8\x8e\xe6\x90\x9c\xe7\xb4\xa2\xe5\xb7\xa5\xe5\x85\xb7', 'Subtitle OK'),
    (b'10000+\xe5\x8f\xb0\xe9\x81\x93', '10000+Channels'),
    (b'\xe5\x85\x8d\xe8\xb4\xb9\xe5\x8f\xb0\xe9\x81\x93', 'Free Channels (NEW)'),
    (b'\xe6\xaf\x8f\xe6\x97\xa5\xe6\x9b\xb4\xe6\x96\xb0', 'Daily Update (NEW)'),
    (b'\xe6\x97\xa0\xe9\x9c\x80\xe6\xb3\xa8\xe5\x86\x8c', 'No Register'),
    (b'\xe5\x85\x8d\xe8\xb4\xb9\xe8\xa7\x82\xe7\x9c\x8b', 'OLD: 免费观看 - GONE'),
    (b'\xe9\xab\x98\xe6\xb8\x85\xe7\x94\xbb\xe8\xb4\xa8', 'OLD: 高清画质 - GONE'),
]

all_ok = True
for btext, label in checks:
    found = btext in content
    status = 'OK' if found else ('MISSING' if not ('OLD' in label) else 'CORRECTLY REMOVED')
    if status != 'OK' and status != 'CORRECTLY REMOVED':
        all_ok = False
    print(status + ' : ' + label)

print()
print('All OK!' if all_ok else 'Some issues found.')
