// 极简线条风格 CSS 片段（生产环境标准）
// 统一 :root 变量和通用 body 样式

export const MINIMAL_STYLE_BASE = `
    :root {
      --accent: #e50914;
      --accent-hover: #ff1a1a;
      --transition: 0.2s ease;
      --bg-primary: #0a0a0a;
      --bg-secondary: #0f0f0f;
      --bg-card: transparent;
      --bg-hover: transparent;
      --text-primary: #ffffff;
      --text-secondary: #888888;
      --text-muted: #8b8b8b;
      --border: 1px solid rgba(255,255,255,0.08);
      --border-hover: 1px solid rgba(229,9,20,0.4);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 60px; }
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }
`;
