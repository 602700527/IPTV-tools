import urllib.request
import json
import time

# Try multiple ports
PORTS = [8787, 8788, 8789, 8790, 12764, 3000, 5173]

def test_port(port):
    url = f"http://localhost:{port}/"
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=3)
        return port, response.getcode(), response.read().decode('utf-8')[:100]
    except Exception as e:
        return port, None, str(e)[:50]

print("Scanning for active server...")
for port in PORTS:
    code, status, content = test_port(port)
    if status:
        print(f"FOUND! Port {port}: HTTP {code}")
    else:
        print(f"Port {port}: {content}")

print("\nAlso trying 127.0.0.1 directly...")
for port in PORTS:
    url = f"http://127.0.0.1:{port}/"
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=3)
        print(f"FOUND on 127.0.0.1! Port {port}: HTTP {response.getcode()}")
        break
    except Exception as e:
        print(f"127.0.0.1:{port}: {str(e)[:50]}")