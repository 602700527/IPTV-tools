// 静态资源文件

// Logo SVG (200x60)
export const LOGO_SVG = `<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="tvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
    </linearGradient>
  </defs>

  <g transform="translate(10, 8)">
    <rect x="0" y="0" width="44" height="32" rx="4" fill="url(#tvGradient)" />
    <rect x="4" y="4" width="36" height="24" rx="2" fill="#0a0a0a" />
    <path d="M18 10 L30 16 L18 22 Z" fill="#fff" />
    <rect x="12" y="34" width="8" height="4" rx="1" fill="#333" />
    <rect x="24" y="34" width="8" height="4" rx="1" fill="#333" />
    <g stroke="#e50914" stroke-width="2" fill="none">
      <path d="M48 8 Q52 12 48 16" opacity="0.8" />
      <path d="M52 4 Q60 12 52 20" opacity="0.6" />
    </g>
  </g>

  <text x="65" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="20" font-weight="800" fill="url(#logoGradient)">IPTV</text>
  <text x="65" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" font-weight="500" fill="#fff" opacity="0.8">Live</text>
</svg>`;

// Favicon SVG (32x32)
export const FAVICON_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="32" height="32" rx="6" fill="url(#faviconGradient)" />

  <g transform="translate(5, 4)">
    <rect x="1" y="1" width="20" height="15" rx="2" fill="#0a0a0a" />
    <path d="M9 5 L16 9 L9 13 Z" fill="#e50914" />
    <rect x="5" y="18" width="4" height="2" rx="1" fill="#0a0a0a" />
    <rect x="12" y="18" width="4" height="2" rx="1" fill="#0a0a0a" />
  </g>
</svg>`;

// Alipay Logo SVG (32x32)
export const ALIPAY_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#1677FF"/>
  <path d="M6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16Z" fill="white"/>
  <path d="M12.5 12H19.5V14H12.5V12ZM10 15H22V17H10V15ZM10 18H22V20H10V18Z" fill="#1677FF"/>
  <path d="M16 8L18 10H14L16 8ZM13 22L16 25L19 22H13Z" fill="#1677FF"/>
</svg>`;

// WeChat Pay Logo SVG (32x32)
export const WECHAT_PAY_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#07C160"/>
  <path d="M10 10C10 8.34315 11.3431 7 13 7H19C20.6569 7 22 8.34315 22 10V15C22 16.6569 20.6569 18 19 18H13C11.3431 18 10 16.6569 10 15V10Z" fill="white"/>
  <circle cx="14" cy="13" r="1.5" fill="#07C160"/>
  <circle cx="18" cy="13" r="1.5" fill="#07C160"/>
  <path d="M10 16C10 14.8954 10.8954 14 12 14H20C21.1046 14 22 14.8954 22 16V19C22 20.1046 21.1046 21 20 21H12C10.8954 21 10 20.1046 10 19V16Z" fill="white"/>
  <circle cx="14" cy="17.5" r="1" fill="#07C160"/>
  <circle cx="18" cy="17.5" r="1" fill="#07C160"/>
</svg>`;

// Apple Touch Icon (180x180) - iOS设备
export const APPLE_TOUCH_ICON_SVG = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="appleIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="180" height="180" rx="40" fill="url(#appleIconGradient)" />

  <g transform="translate(30, 25)">
    <rect x="5" y="5" width="110" height="80" rx="12" fill="#0a0a0a" />
    <path d="M55 30 L95 52.5 L55 75 Z" fill="#e50914" />
    <rect x="25" y="95" width="25" height="12" rx="4" fill="#0a0a0a" />
    <rect x="70" y="95" width="25" height="12" rx="4" fill="#0a0a0a" />
  </g>
</svg>`;

// Icon 192x192 - Android PWA
export const ICON_192_SVG = `<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icon192Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="192" height="192" rx="42" fill="url(#icon192Gradient)" />

  <g transform="translate(32, 27)">
    <rect x="6" y="6" width="116" height="88" rx="12" fill="#0a0a0a" />
    <path d="M58 36 L98 58 L58 80 Z" fill="#e50914" />
    <rect x="26" y="104" width="28" height="12" rx="4" fill="#0a0a0a" />
    <rect x="74" y="104" width="28" height="12" rx="4" fill="#0a0a0a" />
  </g>
</svg>`;

// Favicon ICO (生成ICO格式的SVG，浏览器可以处理)
export const FAVICON_ICO_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconIcoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="48" height="48" rx="10" fill="url(#faviconIcoGradient)" />

  <g transform="translate(7, 7)">
    <rect x="1" y="1" width="32" height="24" rx="3" fill="#0a0a0a" />
    <path d="M15 9 L25 14 L15 19 Z" fill="#e50914" />
    <rect x="7" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
    <rect x="21" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
  </g>
</svg>`;

// OG Image SVG (1200x630)
export const OG_IMAGE_SVG = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#141414;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGradient)" />

  <circle cx="100" cy="100" r="80" fill="#e50914" opacity="0.1" />
  <circle cx="200" cy="150" r="40" fill="#e50914" opacity="0.05" />

  <circle cx="1100" cy="530" r="100" fill="#e50914" opacity="0.1" />
  <circle cx="1000" cy="480" r="50" fill="#e50914" opacity="0.05" />

  <g transform="translate(480, 200)" filter="url(#glow)">
    <rect x="0" y="0" width="240" height="180" rx="12" fill="url(#logoGradient)" />
    <rect x="20" y="20" width="200" height="140" rx="8" fill="#0a0a0a" />
    <path d="M100 60 L160 90 L100 120 Z" fill="#fff" />
    <rect x="60" y="190" width="40" height="15" rx="4" fill="#333" />
    <rect x="140" y="190" width="40" height="15" rx="4" fill="#333" />
    <g stroke="#e50914" stroke-width="3" fill="none">
      <path d="M250 30 Q270 60 250 90" opacity="0.6" />
      <path d="M260 10 Q300 60 260 110" opacity="0.4" />
    </g>
  </g>

  <text x="600" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="72" font-weight="800" fill="url(#textGradient)" text-anchor="middle" filter="url(#glow)">IPTV Live</text>

  <text x="600" y="510" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="28" font-weight="400" fill="#fff" opacity="0.8" text-anchor="middle">免费高清电视观看平台</text>

  <line x1="300" y1="530" x2="900" y2="530" stroke="#e50914" stroke-width="2" opacity="0.3" />

  <g transform="translate(400, 560)">
    <rect x="0" y="0" width="100" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="50" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">10000+频道</text>
  </g>
  <g transform="translate(520, 560)">
    <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="40" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">免费观看</text>
  </g>
  <g transform="translate(620, 560)">
    <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="40" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">高清画质</text>
  </g>
  <g transform="translate(720, 560)">
    <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="40" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">无需注册</text>
  </g>
</svg>`;
