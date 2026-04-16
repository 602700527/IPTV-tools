from playwright.sync_api import sync_playwright
import os

BASE_URL = "http://127.0.0.1:9372"
ADMIN_KEY = "admin-key-please-change-in-production"
SCREENSHOT_DIR = "C:/Users/60270/Desktop/cfworker2/test-screenshots"

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def save_screenshot(page, name):
    path = f"{SCREENSHOT_DIR}/{name}"
    page.screenshot(path=path, full_page=True)
    print(f"  Screenshot: {path}")
    return path

def main():
    print("KV M3U Cache Feature Tests")
    print(f"Base URL: {BASE_URL}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1400, 'height': 900})
        
        # Test 1: Admin Login
        print("\n=== Test 1: Admin Login ===")
        page.goto(f"{BASE_URL}/admin")
        page.wait_for_load_state('networkidle')
        save_screenshot(page, "01_admin_login.png")
        page.fill('#adminKey', ADMIN_KEY)
        page.fill('#captchaInput', 'TEST')
        page.click('button:has-text("登录")')
        page.wait_for_timeout(2000)
        save_screenshot(page, "02_admin_dashboard.png")
        
        # Test 2: Sources Tab
        print("\n=== Test 2: Sources Tab ===")
        page.click('text=直播源管理')
        page.wait_for_timeout(1000)
        save_screenshot(page, "03_sources_tab.png")
        
        # Test 3: System Settings Tab
        print("\n=== Test 3: System Settings ===")
        page.click('text=系统设置')
        page.wait_for_timeout(1000)
        save_screenshot(page, "04_system_settings.png")
        
        # Test 4: Ad Management Tab
        print("\n=== Test 4: Ad Management ===")
        page.click('text=广告管理')
        page.wait_for_timeout(1000)
        save_screenshot(page, "05_ad_management.png")
        
        # Test 5: Codes Tab
        print("\n=== Test 5: Codes Tab ===")
        page.click('text=卡密管理')
        page.wait_for_timeout(1000)
        save_screenshot(page, "06_codes_tab.png")
        
        # Test 6: Security Tab
        print("\n=== Test 6: Security Tab ===")
        page.click('text=安全监控')
        page.wait_for_timeout(1000)
        save_screenshot(page, "07_security_tab.png")
        
        # Test 7: IP Blacklist Tab
        print("\n=== Test 7: IP Blacklist Tab ===")
        page.click('text=IP黑名单')
        page.wait_for_timeout(1000)
        save_screenshot(page, "08_ip_blacklist_tab.png")
        
        # Test 8: Homepage Display Tab
        print("\n=== Test 8: Homepage Display Tab ===")
        page.click('text=首页展示')
        page.wait_for_timeout(1000)
        save_screenshot(page, "09_homepage_display_tab.png")
        
        print("\n" + "="*50)
        print("All tests completed!")
        print(f"Screenshots: {SCREENSHOT_DIR}")
        print("="*50)
        
        browser.close()

if __name__ == "__main__":
    main()
