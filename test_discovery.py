import urllib.request
import json
import time

# Try different ports
PORTS = [8787, 12764]

def test_url(name, url, timeout=5):
    print(f"\n=== Testing: {name} ===")
    print(f"URL: {url}")
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=timeout)
        status = response.getcode()
        content = response.read().decode('utf-8')
        print(f"Status: {status}")
        
        # Try to parse as JSON
        try:
            data = json.loads(content)
            print(f"JSON keys: {list(data.keys())}")
            if 'data' in data:
                print(f"Data sample: {str(data['data'])[:200]}")
        except:
            print(f"Content (first 200 chars): {content[:200]}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# Find working port
working_port = None
for port in PORTS:
    url = f"http://localhost:{port}/"
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=3)
        if response.getcode() == 200:
            working_port = port
            print(f"Found working server on port {port}")
            break
    except:
        print(f"Port {port} not responding")
        continue

if not working_port:
    print("No working server found!")
    exit(1)

BASE_URL = f"http://localhost:{working_port}"

# Test URLs
results = []
results.append(test_url("Home Page", f"{BASE_URL}/"))
results.append(test_url("Home API", f"{BASE_URL}/api/home"))
results.append(test_url("Search API", f"{BASE_URL}/api/search?q=CCTV"))

print("\n" + "=" * 50)
print(f"Results: {sum(results)}/{len(results)} passed")