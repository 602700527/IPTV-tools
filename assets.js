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
