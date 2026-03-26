#!/usr/bin/env python3
import urllib.request

# Check CSS endpoint
try:
    r = urllib.request.urlopen('http://127.0.0.1:10685/seo-home.css', timeout=10)
    data = r.read()
    print(f"CSS Status: {r.status}")
    print(f"CSS Length: {len(data)}")
    print(f"Content-Type: {r.headers.get('Content-Type')}")
    print(f"First 200 chars: {data[:200]}")
except Exception as e:
    print(f"CSS Error: {e}")

# Check the link tag in the HTML
r2 = urllib.request.urlopen('http://127.0.0.1:10685/', timeout=10)
data2 = r2.read().decode('utf-8', errors='replace')
# Find the <link rel="stylesheet" in head
idx = data2.find('<link rel="stylesheet"')
print(f"\n<link stylesheet> found at: {idx}")
if idx >= 0:
    print(f"Link tag: {repr(data2[idx:idx+100])}")
# Also search for just "stylesheet"
idx2 = data2.find('stylesheet')
print(f"'stylesheet' found at: {idx2}")
if idx2 >= 0:
    print(f"Context: {repr(data2[max(0,idx2-50):idx2+80])}")
