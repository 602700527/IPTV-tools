const { test, expect } = require('@playwright/test');

test.describe('Enhanced Search', () => {
  test('should search by Chinese name', async ({ page }) => {
    await page.goto('/search?q=央视');
    await page.waitForLoadState('networkidle');
    
    const results = await page.locator('.channel-grid .channel-card').count();
    expect(results).toBeGreaterThan(0);
  });

  test('should search by pinyin initial', async ({ page }) => {
    await page.goto('/search?q=YANGZI');
    await page.waitForLoadState('networkidle');
    
    const results = await page.locator('.channel-grid .channel-card').count();
    expect(results).toBeGreaterThan(0);
  });

  test('should search by English synonym', async ({ page }) => {
    await page.goto('/search?q=CCTV');
    await page.waitForLoadState('networkidle');
    
    const results = await page.locator('.channel-grid .channel-card').count();
    expect(results).toBeGreaterThan(0);
  });

  test('should show search tips when no results', async ({ page }) => {
    await page.goto('/search?q=xxxNOTFOUND');
    await page.waitForLoadState('networkidle');
    
    const tips = await page.locator('#searchTips').isVisible();
    expect(tips).toBe(true);
  });

  test('should handle mixed Chinese/English query', async ({ page }) => {
    await page.goto('/search?q=Phoenix');
    await page.waitForLoadState('networkidle');
    
    const results = await page.locator('.channel-grid .channel-card').count();
    expect(results).toBeGreaterThan(0);
  });
});