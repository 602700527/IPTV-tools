## 1. Create Page Content Files

- [x] 1.1 Create `pages-content/usa-iptv.js` with SEO content for USA IPTV landing page
- [x] 1.2 Create `pages-content/uk-iptv-plans.js` with SEO content for UK IPTV landing page
- [x] 1.3 Create `pages-content/android-iptv-app.js` with SEO content for Android IPTV App landing page
- [x] 1.4 Create `pages-content/free-iptv-app-review.js` with SEO content for Free IPTV App landing page

## 2. Update Tutorial Page SEO Meta

- [x] 2.1 Update `pages-content/tutorial.js` pageTitle to include "Smart TV IPTV" keywords
- [x] 2.2 Update `pages-content/tutorial.js` pageDescription to mention Smart TV IPTV

## 3. Add Routes in worker.js

- [x] 3.1 Import usa-iptv module in worker.js
- [x] 3.2 Import uk-iptv-plans module in worker.js
- [x] 3.3 Import android-iptv-app module in worker.js
- [x] 3.4 Import free-iptv-app-review module in worker.js
- [x] 3.5 Add route handler for `GET /usa-iptv`
- [x] 3.6 Add route handler for `GET /uk-iptv-plans`
- [x] 3.7 Add route handler for `GET /android-iptv-app`
- [x] 3.8 Add route handler for `GET /free-iptv-app-review`

## 4. Update sitemap.xml

- [x] 4.1 Add `/usa-iptv` to staticPages array in sitemap.xml generation
- [x] 4.2 Add `/uk-iptv-plans` to staticPages array in sitemap.xml generation
- [x] 4.3 Add `/android-iptv-app` to staticPages array in sitemap.xml generation
- [x] 4.4 Add `/free-iptv-app-review` to staticPages array in sitemap.xml generation

## 5. Verification

- [ ] 5.1 Run `npm run dev` and verify all 4 new pages serve correctly
- [ ] 5.2 Verify `/tutorial` page still works with updated meta
- [ ] 5.3 Verify sitemap.xml includes all new pages
- [ ] 5.4 Check for any syntax errors or missing imports
