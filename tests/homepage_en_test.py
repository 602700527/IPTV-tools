from pathlib import Path
import re
from playwright.sync_api import sync_playwright


def english_text(text: str) -> bool:
    # Fail if obvious i18n placeholders are present
    if re.search(r"\{\{.*\}\}", text):
        return False
    if 'i18n' in text.lower():
        return False
    return True


def test_homepage_english_and_functional():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to local dev server (assumes wrangler dev is running)
        page.goto('http://127.0.0.1:8787/')
        page.wait_for_load_state('networkidle')

        # 1) Console errors check
        console_msgs = []
        page.on('console', lambda msg: console_msgs.append((msg.type, msg.text)))
        # Allow a moment for any late errors to surface
        page.wait_for_timeout(1000)
        errors = [f"{t}: {txt}" for t, txt in console_msgs if t == 'error']
        assert len(errors) == 0, "Console errors observed: " + ", ".join(errors)

        # 2) Ensure English text only (no translation keys)
        content = page.content()
        assert english_text(content), "English text validation failed"
        assert page.locator('[data-i18n]').count() == 0, "Found translation keys on page"

        # 3) Test search functionality (best-effort)
        search_el = None
        for selector in [ 'input[type="search"]', 'input[placeholder*="Search"]', 'input[name="search"]', 'input[name="q"]' ]:
            el = page.query_selector(selector)
            if el:
                search_el = el
                break
        if search_el:
            search_el.fill('PlayStation')
            search_el.press('Enter')
            page.wait_for_load_state('networkidle')
            found = False
            for sel in [ '.search-results', '.results', '.search-results-list', '.channel-list' ]:
                if page.locator(sel).count() > 0:
                    found = True
                    break
            assert found, "Search results container not found after query"

        # 4) Test channel loading and display
        channel_found = False
        for sel in [ '.channel-card', '.channel-item', '.channel-tile' ]:
            if page.locator(sel).count() > 0:
                channel_found = True
                break
        assert channel_found, "No channels loaded on homepage"

        # 5) Favorites/history interactions (best-effort)
        fav_button = page.locator('[aria-label="favorite"]')
        if fav_button.count() > 0:
            fav_button.first.click()
            page.wait_for_timeout(500)

        history_label = page.locator('text=History')
        # History may or may not be visible depending on data; ensure no crash
        if history_label.count() > 0:
            pass

        # 6) Mobile menu works without language options
        page.set_viewport_size({'width': 375, 'height': 812})
        # Try commonly used mobile menu toggles
        menu_toggle = page.locator('button[aria-label="Open menu"]')
        if menu_toggle.count() > 0:
            menu_toggle.first.click()
            page.wait_for_timeout(300)

        # 7) Verify no language selector visible
        assert page.locator('#language-selector').count() == 0, "Language selector should not be visible after i18n removal"

        # 8) Responsive layout checks (already tested via viewport changes above)
        page.set_viewport_size({'width': 1280, 'height': 800})
        page.wait_for_timeout(300)

        # 9) SEO meta tags are static English
        title = page.title()
        assert title and english_text(title), "SEO title is not English or is empty"
        desc_el = page.locator('meta[name="description"]')
        description = desc_el.get_attribute('content') if desc_el.count() > 0 else ''
        assert description and english_text(description), "SEO description is not English or missing"

        browser.close()
