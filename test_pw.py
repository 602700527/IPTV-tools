from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:8787'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Collect console messages
    console_messages = []
    page.on('console', lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))
    
    print(f"Navigating to {BASE_URL}/...")
    try:
        response = page.goto(f"{BASE_URL}/", timeout=15000)
        page.wait_for_load_state('networkidle', timeout=15000)
        print(f"Status: {response.status}")
        print(f"Title: {page.title()}")
        
        # Check for errors in console
        errors = [m for m in console_messages if 'error' in m.lower()]
        if errors:
            print(f"Console errors: {errors[:5]}")
        else:
            print("No console errors")
            
        print("\nPage loaded successfully!")
    except Exception as e:
        print(f"Error: {e}")
        print(f"Console messages: {console_messages[:10]}")
    
    browser.close()