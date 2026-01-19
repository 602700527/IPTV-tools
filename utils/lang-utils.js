// 多语言工具模块 - 智能判断浏览器语言
export function detectBrowserLanguage(storageKey = 'lang') {
  const savedLang = localStorage.getItem(storageKey);
  if (savedLang) {
    return savedLang;
  }
  
  const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
  // 简体中文使用 zh-CN，其他语言使用英文
  return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
}

// 翻译函数
export function t(translations, currentLang, key) {
  return translations[currentLang]?.[key] || translations['zh-CN']?.[key] || key;
}

// 更新页面语言
export function updatePageLanguage(currentLang, translations, storageKey = 'lang') {
  currentLang = currentLang || detectBrowserLanguage(storageKey);
  localStorage.setItem(storageKey, currentLang);

  // 更新按钮状态
  const langEn = document.getElementById('langEn');
  const langZh = document.getElementById('langZh');
  const currentLangBtn = document.getElementById('currentLangBtn');
  
  if (langEn) langEn.classList.toggle('active', currentLang === 'en');
  if (langZh) langZh.classList.toggle('active', currentLang === 'zh-CN');
  
  if (currentLangBtn) {
    const langNames = { 'en': 'EN', 'zh-CN': '简体' };
    currentLangBtn.textContent = langNames[currentLang] || '简体';
  }

  // 关闭菜单
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('show');

  // 更新 HTML lang 属性
  document.documentElement.lang = currentLang;

  // 更新文档标题
  const titleKey = document.querySelector('[data-i18n-title]');
  if (titleKey) {
    const key = titleKey.getAttribute('data-i18n-title');
    document.title = t(translations, currentLang, key);
  }

  // 更新所有带 data-i18n 的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(translations, currentLang, key);
  });

  // 更新占位符
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(translations, currentLang, key);
  });

  return currentLang;
}

// 切换语言菜单
export function toggleLangMenu() {
  const menu = document.getElementById('langMenu');
  if (menu) menu.classList.toggle('show');
}
