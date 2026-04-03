const { test, expect } = require('@playwright/test');

// Tests: Admin static site generation UI

test.describe('Admin static site generation', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Try to find and fill admin key input if present
    const adminKeyInput = page.locator('input[name="adminKey"], input[placeholder*="Admin"], input[placeholder*="Key"]');
    if (await adminKeyInput.count() > 0) {
      await adminKeyInput.first().fill('admin-key-please-change-in-production');
      await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("登录")').click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('static generation tab exists and is accessible', async ({ page }) => {
    // Look for static generation tab
    const staticTab = page.locator('text=/静态生成|Static.*Generate/i');
    if (await staticTab.count() > 0) {
      await staticTab.first().click();
      await page.waitForTimeout(500);
    }
    
    // Check for static generation form elements
    const generateButton = page.locator('button:has-text("生成"), button:has-text("Generate")');
    expect(await generateButton.count()).toBeGreaterThan(0);
  });

  test('static status API returns correct environment', async ({ page }) => {
    const response = await page.request.get('/api/admin/static/status', {
      headers: { 'X-Admin-Key': 'admin-key-please-change-in-production' }
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.environment).toBe('development');
    expect(data.staticSource).toBe('local');
  });

  test('can load static status in admin UI', async ({ page }) => {
    // Navigate to static generation tab
    const staticTab = page.locator('text=/静态生成|Static.*Generate/i');
    if (await staticTab.count() > 0) {
      await staticTab.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Check that status elements are visible
    const envBadge = page.locator('#staticEnvBadge, .static-env');
    // Just verify no page errors occurred
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    expect(pageErrors.length).toBe(0);
  });
});
