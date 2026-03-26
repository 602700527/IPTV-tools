#!/usr/bin/env python3
import urllib.request

r = urllib.request.urlopen('http://127.0.0.1:10703/', timeout=10)
data = r.read().decode('utf-8', errors='replace')
print('Length:', len(data))

checks = [
    'class="header"',
    'class="sidebar"',
    'class="channel-card"',
    'class="channels-grid"',
    'play-overlay',
    'enableIpPlay',
    'seo-home.css',
    'page-footer',
    'section-title',
    'online-count',
]
for p in checks:
    idx = data.find(p)
    print(p + ': ' + ('FOUND at ' + str(idx) if idx >= 0 else 'NOT FOUND'))

print()
# Section title context
idx = data.find('section-title')
if idx >= 0:
    print('section-title context:')
    print(repr(data[idx:idx+300]))

# channels-grid div
idx2 = data.find('<div class="channels-grid">')
if idx2 >= 0:
    print('\nchannels-grid div FOUND at:', idx2)
    print(repr(data[idx2:idx2+200]))
else:
    print('\nchannels-grid div NOT FOUND - only in CSS')

# Total channel-card occurrences
cc_count = data.count('channel-card')
print('\nTotal channel-card occurrences:', cc_count)

# Look for the STATIC_SIDEBAR area
idx3 = data.find('All Channels')
if idx3 >= 0:
    print('\nAll Channels found at:', idx3)
    print(repr(data[idx3-100:idx3+200]))
