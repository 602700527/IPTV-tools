// 验证 subscription 页面渲染和样式
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Local
  await page.goto('http://127.0.0.1:8787/subscription', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // 截屏 - 整页
  await page.screenshot({ path: 'D:/Desktop/cfworker2/tests/sub-local-full.png', fullPage: true });

  // 检查 page-header 是否显示
  const headerVisible = await page.locator('.header').isVisible();
  console.log('header visible:', headerVisible);

  // 检查 sub-hero 是否存在
  const heroExists = await page.locator('.sub-hero').count();
  console.log('sub-hero count:', heroExists);

  // 检查 plans-container
  const plansContainerExists = await page.locator('#plansContainer').count();
  console.log('plansContainer count:', plansContainerExists);

  // 检查 footer
  const footerVisible = await page.locator('.page-footer').isVisible();
  console.log('footer visible:', footerVisible);

  // 检查页面是否有 border-radius > 0 的卡片
  const styleInfo = await page.evaluate(() => {
    const samples = ['.sub-hero', '.plans-container', '.option-card', '.payment-summary', '.payment-section', '.trust-badges'];
    return samples.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { sel, exists: false };
      const cs = window.getComputedStyle(el);
      return {
        sel,
        borderRadius: cs.borderRadius,
        background: cs.backgroundColor,
        boxShadow: cs.boxShadow,
        border: cs.border,
      };
    });
  });
  console.log('style samples:');
  styleInfo.forEach(s => console.log(JSON.stringify(s)));

  // 提取 html
  const html = await page.content();
  fs.writeFileSync('D:/Desktop/cfworker2/tests/sub-local.html', html);
  console.log('html size:', html.length);

  // 解析 class 名
  const classNames = new Set();
  html.replace(/class="([^"]*)"/g, (_, cls) => {
    cls.split(/\s+/).forEach(c => c && classNames.add(c));
  });
  console.log('class count:', classNames.size);
  console.log('classes:', Array.from(classNames).sort().join(' '));

  await browser.close();
})();