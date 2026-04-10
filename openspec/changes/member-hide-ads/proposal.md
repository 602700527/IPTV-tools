## Why

Members who have registered and have active subscriptions should enjoy an **ad-free website experience**. Currently, ads are displayed on public pages (homepage, category pages) to all visitors. This feature adds a compelling selling point: **VIP members can browse the site without seeing any ads**, incentivizing user registration and subscription purchases.

## What Changes

1. **Frontend ad visibility control**: Add membership check before rendering ads on public HTML pages
2. **Session-based membership detection**: Use existing user session to determine if visitor is an authenticated member
3. **Active subscription check**: Verify the member has at least one active (non-expired) subscription code
4. **Admin toggle**: Add setting to enable/disable the ad-free feature for members

## Capabilities

### New Capabilities

- `member-ad-free`: Controls whether ads are displayed based on user membership status. When enabled, authenticated users with active subscriptions will not see ads on public pages.

## Impact

**广告注入点（需隐藏）：**
- `components/page-header.js` 第 52-56 行：Google AdSense (`adsbygoogle`)
- `components/page-footer.js` 第 63 行：第三方广告 (`nap5k.com/tag.min.js`)

**功能实现：**
- `handlers/auth.js`: 添加会员状态检测函数 `checkMemberStatus(userId)`
- `worker.js`: 页面渲染时调用检测，注入 `window.IS_MEMBER`
- `database.js`: 无需修改表结构，使用现有 `settings` 表添加配置开关

**营销卖点更新：**
- `plans-page.js`: VIP 计划功能列表添加"网站免广告"
- `components/page-footer.js`: FAQ 添加会员网站免广告说明
