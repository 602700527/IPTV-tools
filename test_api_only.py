import urllib.request
import json
import time

BASE_URL = 'http://localhost:8787'

def test_url(name, url, timeout=10):
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
                print(f"Data type: {type(data['data'])}")
                if isinstance(data['data'], dict):
                    print(f"Data keys: {list(data['data'].keys())}")
                elif isinstance(data['data'], list):
                    print(f"Data length: {len(data['data'])}")
        except:
            print(f"Content (first 300 chars): {content[:300]}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# Test URLs
results = []
results.append(test_url("Home Page", f"{BASE_URL}/"))
results.append(test_url("Home API", f"{BASE_URL}/api/home"))
results.append(test_url("Search API", f"{BASE_URL}/api/search?q=CCTV"))
results.append(test_url("Category API", f"{BASE_URL}/api/category/%E5%A4%AE%E8%A7%86"))

print("\n" + "=" * 50)
print(f"Results: {sum(results)}/{len(results)} passed")