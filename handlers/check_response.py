#!/usr/bin/env python3
import urllib.request

r = urllib.request.urlopen('http://127.0.0.1:10685/', timeout=10)
data = r.read().decode('utf-8', errors='replace')

idx_css = data.find('seo-home.css')
idx_header = data.find('class="header"')
idx_sidebar = data.find('class="sidebar"')
idx_channel = data.find('class="channel-card"')
idx_footer = data.find('page-footer')
idx_play = data.find('play-overlay')
idx_enableIpPlay = data.find('enableIpPlay')

print(f"Total length: {len(data)}")
print(f"CSS link (seo-home.css): {idx_css}")
print(f"Header: {idx_header}")
print(f"Sidebar: {idx_sidebar}")
print(f"Channel-card: {idx_channel}")
print(f"Footer: {idx_footer}")
print(f"Play-overlay: {idx_play}")
print(f"enableIpPlay JS: {idx_enableIpPlay}")

if idx_header > 0:
    print(f"\nHeader snippet: {repr(data[idx_header:idx_header+100])}")
if idx_channel > 0:
    print(f"\nFirst channel-card: {repr(data[idx_channel:idx_channel+200])}")
if idx_css > 0:
    print(f"\nCSS link context: {repr(data[idx_css-50:idx_css+50])}")
