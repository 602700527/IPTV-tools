// Floating Sidebar Component - VIP promotion & navigation
// Features: Back to top + VIP ad-free shortcut

export const FLOATING_SIDEBAR_STYLES = `
  .floating-sidebar {
    position: fixed;
    right: 20px;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .sidebar-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  }

  .sidebar-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  .sidebar-btn:active {
    transform: scale(0.96);
  }

  /* Back to Top Button */
  .back-to-top {
    background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
    color: #ffffff;
    transition: transform 0.2s ease;
  }

  .back-to-top:hover svg {
    transform: translateY(-2px);
  }

  /* VIP Ad-Free Button */
  .vip-sidebar-btn {
    background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    text-decoration: none;
  }

  .vip-sidebar-btn .vip-icon {
    width: 22px;
    height: 22px;
    /* Gold color on icon */
    color: #d4a843;
  }

  /* Subtle glow on hover only */
  .vip-sidebar-btn:hover {
    border-color: rgba(212, 168, 67, 0.4);
  }

  .vip-sidebar-btn:hover .vip-icon {
    color: #e8c872;
  }

  /* Tooltip */
  .sidebar-tooltip {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    background: #1a1a1a;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  .sidebar-tooltip::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left-color: #1a1a1a;
  }

  .sidebar-btn:hover .sidebar-tooltip {
    opacity: 1;
    transform: translateY(-50%) translateX(-4px);
  }

  .sidebar-tooltip.vip-tooltip {
    background: #1a1a1a;
    color: #d4a843;
    font-weight: 600;
    border: 1px solid rgba(212, 168, 67, 0.3);
  }

  .sidebar-tooltip.vip-tooltip::after {
    border-left-color: #1a1a1a;
  }

  /* Hide on mobile */
  @media (max-width: 768px) {
    .floating-sidebar {
      right: 10px;
      bottom: 16px;
      gap: 8px;
    }
    .sidebar-btn {
      width: 42px;
      height: 42px;
    }
    .sidebar-tooltip {
      display: none;
    }
  }
`;

export const FLOATING_SIDEBAR_HTML = `
  <div class="floating-sidebar">
    <a href="/plans" class="sidebar-btn vip-sidebar-btn" title="Go VIP">
      <!-- No Ads Icon: AD with diagonal line -->
      <svg class="vip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <text x="12" y="18" font-size="14" font-weight="bold" text-anchor="middle" fill="currentColor" stroke="none">AD</text>
        <line x1="4" y1="4" x2="20" y2="20"/>
      </svg>
      <span class="sidebar-tooltip vip-tooltip">Ad-Free - Go VIP</span>
    </a>
    <button class="sidebar-btn back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Back to Top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <span class="sidebar-tooltip">Back to Top</span>
    </button>
  </div>
`;

export const FLOATING_SIDEBAR_SCRIPTS = `
// Floating sidebar back-to-top functionality
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.35';
        backToTopBtn.style.pointerEvents = 'none';
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }
});
`;

export function generateFloatingSidebar() {
  return {
    styles: FLOATING_SIDEBAR_STYLES,
    html: FLOATING_SIDEBAR_HTML,
    scripts: FLOATING_SIDEBAR_SCRIPTS
  };
}
