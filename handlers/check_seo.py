#!/usr/bin/env python3
import urllib.request

req = urllib.request.Request(
    'http://127.0.0.1:10685/',
    headers={'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'}
)
r = urllib.request.urlopen(req, timeout=15)
data = r.read().decode('utf-8', errors='replace')

print(f"Total length: {len(data)}")
print(f"Status: {r.status}")

checks = {
    'stylesheet link': 'rel="stylesheet"',
    'seo-home.css': 'seo-home.css',
    'channel-card class': 'class="channel-card"',
    'play-overlay': 'play-overlay',
    'header class': 'class="header"',
    'sidebar class': 'class="sidebar"',
    'page-footer': 'page-footer',
    'enableIpPlay': 'enableIpPlay',
    'channels-grid': 'channels-grid',
    'STATIC_HEADER': 'header-left',
    'section-title': 'section-title',
}

for name, pattern in checks.items():
    idx = data.find(pattern)
    print(f"  {name}: {'FOUND at ' + str(idx) if idx >= 0 else 'NOT FOUND'}")

# Show first 500 chars
print(f"\nFirst 500 chars:\n{data[:500]}")
