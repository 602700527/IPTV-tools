// Floating Sidebar Component - VIP promotion & navigation
// Features: Back to top + VIP ad-free shortcut with animated icon

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
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .sidebar-btn:hover {
    transform: scale(1.1);
  }

  .sidebar-btn:active {
    transform: scale(0.95);
  }

  /* Back to Top Button */
  .back-to-top {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .back-to-top svg {
    width: 22px;
    height: 22px;
    color: #ffffff;
    transition: transform 0.3s ease;
  }

  .back-to-top:hover svg {
    transform: translateY(-3px);
  }

  .back-to-top::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .back-to-top:hover::after {
    opacity: 1;
  }

  /* VIP Ad-Free Button */
  .vip-sidebar-btn {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
    text-decoration: none;
  }

  .vip-sidebar-btn .crown-icon {
    width: 26px;
    height: 26px;
    color: #1a1a1a;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }

  /* Crown pulse animation */
  .vip-sidebar-btn::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24);
    background-size: 200% 200%;
    animation: vipPulse 2s ease-in-out infinite;
    z-index: -1;
    opacity: 0.6;
  }

  @keyframes vipPulse {
    0%, 100% {
      background-position: 0% 50%;
      transform: scale(1);
      opacity: 0.4;
    }
    50% {
      background-position: 100% 50%;
      transform: scale(1.15);
      opacity: 0.8;
    }
  }

  /* Sparkle effect on hover */
  .vip-sidebar-btn::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .vip-sidebar-btn:hover::after {
    opacity: 1;
  }

  /* Crown bounce on hover */
  .vip-sidebar-btn:hover .crown-icon {
    animation: crownBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes crownBounce {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-4px) rotate(-5deg); }
    50% { transform: translateY(-8px) rotate(5deg); }
    75% { transform: translateY(-4px) rotate(-3deg); }
  }

  /* Tooltip */
  .sidebar-tooltip {
    position: absolute;
    right: 65px;
    top: 50%;
    transform: translateY(-50%);
    background: #1a1a1a;
    color: #fff;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .sidebar-tooltip::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-left-color: #1a1a1a;
  }

  .sidebar-btn:hover .sidebar-tooltip {
    opacity: 1;
    transform: translateY(-50%) translateX(-5px);
  }

  .sidebar-tooltip.vip-tooltip {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1a1a1a;
    font-weight: 600;
  }

  .sidebar-tooltip.vip-tooltip::after {
    border-left-color: #fbbf24;
  }

  /* Hide on mobile */
  @media (max-width: 768px) {
    .floating-sidebar {
      right: 12px;
      bottom: 20px;
      gap: 8px;
    }
    .sidebar-btn {
      width: 46px;
      height: 46px;
    }
    .sidebar-tooltip {
      display: none;
    }
  }

  /* Light theme adjustments */
  [data-theme="light"] .back-to-top {
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  [data-theme="light"] .back-to-top svg {
    color: #1a1a1a;
  }
  [data-theme="light"] .sidebar-tooltip {
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  [data-theme="light"] .sidebar-tooltip::after {
    border-left-color: #ffffff;
  }
`;

export const FLOATING_SIDEBAR_HTML = `
  <div class="floating-sidebar">
    <a href="/plans" class="sidebar-btn vip-sidebar-btn" title="Go VIP">
      <!-- Crown Icon -->
      <svg class="crown-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-2.57-6.39c-.27-.67-.92-1.07-1.6-1.01-.68.06-1.17.6-1.21 1.28L8.98 10l-5.31-1.42c-.8-.22-1.63.26-1.84 1.06-.21.8.26 1.62 1.06 1.84l5.66 1.52 2.43 6.04v4.32h2v-4.32l2.43-6.04 5.66-1.52c.8-.22 1.27-1.04 1.06-1.84l-.03-.01z"/>
      </svg>
      <span class="sidebar-tooltip vip-tooltip">🎧 Ad-Free Experience</span>
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
    // Show/hide based on scroll position
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.3';
        backToTopBtn.style.pointerEvents = 'none';
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
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
