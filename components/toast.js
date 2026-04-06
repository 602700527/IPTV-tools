// Toast Notification Component - 通用提示组件
// 在页面中内联使用

export const TOAST_HTML = `
<!-- Toast Container -->
<div id="toastContainer" class="toast-container"></div>

<style>
.toast-container { position: fixed; top: 80px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.25rem; box-shadow: var(--shadow); display: flex; align-items: flex-start; gap: 0.75rem; min-width: 280px; max-width: 360px; pointer-events: auto; animation: toastSlideIn 0.3s ease; }
.toast.toast-exit { animation: toastSlideOut 0.3s ease forwards; }
.toast.toast-success { border-left: 4px solid #22c55e; }
.toast.toast-error { border-left: 4px solid #e50914; }
.toast.toast-warning { border-left: 4px solid #f59e0b; }
.toast.toast-info { border-left: 4px solid #3b82f6; }
.toast-icon { width: 20px; height: 20px; flex-shrink: 0; margin-top: 2px; }
.toast-content { flex: 1; min-width: 0; }
.toast-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; }
.toast-message { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; }
.toast-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.25rem; margin: -4px -4px 0 0; border-radius: 4px; }
.toast-close:hover { color: var(--text-primary); background: var(--bg-hover); }
.toast-action { margin-top: 0.5rem; }
.toast-action a { color: var(--accent); font-weight: 500; font-size: 0.85rem; text-decoration: none; }
.toast-action a:hover { text-decoration: underline; }
@keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes toastSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
@media (max-width: 480px) {
  .toast-container { top: auto; bottom: 20px; left: 10px; right: 10px; }
  .toast { min-width: auto; max-width: 100%; }
}
</style>
`;

export const TOAST_FUNCTIONS = `
function showToast(options) {
  const { title = '', message = '', type = 'info', duration = 4000, action = null } = options;
  
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  
  let actionHtml = '';
  if (action) {
    actionHtml = '<div class="toast-action"><a href="' + action.href + '">' + action.text + '</a></div>';
  }
  
  toast.innerHTML = 
    icons[type] +
    '<div class="toast-content">' +
      (title ? '<div class="toast-title">' + title + '</div>' : '') +
      (message ? '<div class="toast-message">' + message + '</div>' : '') +
      actionHtml +
    '</div>' +
    '<button class="toast-close" onclick="this.parentElement.remove()">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>';
  
  container.appendChild(toast);
  
  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  return toast;
}

function showToastSuccess(message, title = 'Success') {
  return showToast({ type: 'success', title, message });
}

function showToastError(message, title = 'Error') {
  return showToast({ type: 'error', title, message, duration: 6000 });
}

function showToastWarning(message, title = 'Warning', action = null) {
  return showToast({ type: 'warning', title, message, action });
}

function showToastInfo(message, title = '', action = null) {
  return showToast({ type: 'info', title, message, action });
}
`;
