from playwright.sync_api import sync_playwright
import json

BASE_URL = 'http://localhost:8787'

def test_api(name, url, expected_status=200):
    """Test an API endpoint"""
    print(f"\n=== Testing API: {name} ===")
    print(f"URL: {url}")
    try:
        response = page.request.get(url)
        status = response.status_code
        print(f"Status: {status}")
        if status != expected_status:
            print(f"⚠️  Expected {expected_status}, got {status}")
        
        try:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            if '@context' in data:
                print(f"@type: {data.get('@type', 'N/A')}")
            if 'data' in data:
                print(f"Data sample: {str(data['data'])[:200]}...")
        except:
            print(f"Non-JSON response: {response.text[:200] if response.text else 'empty'}")
        
        return response
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_page(name, url, check_elements=None):
    """Test a page loads and check for specific elements"""
    print(f"\n=== Testing Page: {name} ===")
    print(f"URL: {url}")
    try:
        response = page.goto(url)
        page.wait_for_load_state('networkidle')
        status = response.status_code
        print(f"Status: {status}")
        
        if check_elements:
            for selector in check_elements:
                element = page.locator(selector).first
                exists = element.count() > 0
                print(f"  Element '{selector}': {'✓' if exists else '✗'}")
        
        # Check for console errors
        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
        
        return response
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Collect console errors
    console_errors = []
    page.on('console', lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == 'error' else None)
    
    print("=" * 60)
    print("TESTING API ENDPOINTS")
    print("=" * 60)
    
    # Test APIs
    test_api("Home API", f"{BASE_URL}/api/home")
    test_api("Search API (CCTV)", f"{BASE_URL}/api/search?q=CCTV")
    test_api("Category API (央视)", f"{BASE_URL}/api/category/央视")
    
    print("\n" + "=" * 60)
    print("TESTING PAGES")
    print("=" * 60)
    
    # Test pages
    test_page("Home Page", f"{BASE_URL}/", check_elements=['header', 'footer'])
    test_page("Search Page", f"{BASE_URL}/search?q=CCTV", check_elements=['header'])
    test_page("Category Page", f"{BASE_URL}/category/央视", check_elements=['header', 'footer'])
    
    # Test 404
    print(f"\n=== Testing 404 Page ===")
    response = page.goto(f"{BASE_URL}/nonexistent-page")
    print(f"Status: {response.status_code if response else 'N/A'}")
    
    print("\n" + "=" * 60)
    print("CONSOLE ERRORS SUMMARY")
    print("=" * 60)
    if console_errors:
        for err in console_errors[:10]:
            print(f"  {err}")
    else:
        print("  No console errors detected ✓")
    
    browser.close()
    print("\n✅ All tests completed")