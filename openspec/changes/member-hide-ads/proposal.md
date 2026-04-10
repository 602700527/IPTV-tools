## Why

Members who have registered and have active subscriptions should enjoy an ad-free experience on the website. Currently, ads are displayed on public pages (homepage, category pages) to all visitors. Adding a member-only ad-free tier incentivizes user registration and subscription purchases.

## What Changes

1. **Frontend ad visibility control**: Add membership check before rendering ads on public HTML pages
2. **Session-based membership detection**: Use existing user session to determine if visitor is an authenticated member
3. **Active subscription check**: Verify the member has at least one active (non-expired) subscription code
4. **Admin toggle**: Add setting to enable/disable the ad-free feature for members

## Capabilities

### New Capabilities

- `member-ad-free`: Controls whether ads are displayed based on user membership status. When enabled, authenticated users with active subscriptions will not see ads on public pages.

## Impact

- **components/page-header.js**: Google AdSense 广告（第 52-56 行），通过 `data-hide-for-member` 属性控制
- **components/page-footer.js**: 第三方广告追踪脚本 `nap5k.com`（第 63 行），通过 `data-hide-for-member` 属性控制
- **handlers/auth.js**: 需要添加会员状态检测函数 `checkMemberStatus(userId)`
- **worker.js**: 在页面渲染时调用会员状态检测，注入 `window.IS_MEMBER` 变量
- **database.js**: 无需修改表结构，使用现有 `settings` 表添加配置开关
