import urllib.request
import json

BASE_URL = 'http://localhost:8787'

def test(name, url, timeout=15):
    print(f"Testing: {name}")
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=timeout)
        content = response.read().decode('utf-8')
        print(f"  Status: {response.getcode()}")
        try:
            data = json.loads(content)
            print(f"  JSON: {list(data.keys())}")
        except:
            print(f"  Content: {content[:100]}...")
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

results = []
results.append(test("Home", f"{BASE_URL}/"))
results.append(test("API Home", f"{BASE_URL}/api/home"))
print(f"\n{sum(results)}/{len(results)} passed")