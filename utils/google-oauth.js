/**
 * Google OAuth 前端集成模块
 *
 * 使用方法：
 * 1. 在HTML中引入此脚本
 * 2. 调用 GoogleAuth.init() 初始化
 * 3. 添加Google Sign-In按钮到页面
 *
 * 依赖：无（纯原生JavaScript）
 */

const GoogleAuth = (function() {
  let isInitialized = false;
  let callbacks = {
    onSuccess: null,
    onError: null,
    onInit: null
  };

  /**
   * 初始化Google Sign-In
   */
  async function init(options = {}) {
    if (isInitialized) {
      console.warn('GoogleAuth already initialized');
      return;
    }

    callbacks.onSuccess = options.onSuccess || null;
    callbacks.onError = options.onError || null;
    callbacks.onInit = options.onInit || null;

    try {
      // 检查Google Identity Services脚本是否已加载
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('Google Identity Services already loaded');
        setupGoogleSignin();
        isInitialized = true;
        if (callbacks.onInit) {
          callbacks.onInit();
        }
        return;
      }

      // 动态加载Google Identity Services脚本
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity Services loaded');
        setupGoogleSignin();
        isInitialized = true;
        if (callbacks.onInit) {
          callbacks.onInit();
        }
      };
      script.onerror = () => {
        const error = 'Failed to load Google Identity Services script';
        console.error(error);
        if (callbacks.onError) {
          callbacks.onError(error);
        }
      };
      document.head.appendChild(script);

    } catch (error) {
      console.error('GoogleAuth init error:', error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    }
  }

  /**
   * 配置Google Sign-In处理器
   */
  function setupGoogleSignin() {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google Identity Services not available');
      return;
    }

    window.google.accounts.id.initialize({
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      client_id: '1070165774283-e75bs3en213p81iaq3g5dmpt15e6te9l.apps.googleusercontent.com',
      context: 'signin',
      origin: window.location.origin,
      ux_mode: 'popup',
      allow_parent_origin: window.location.origin
    });

    console.log('Google Sign-In configured successfully');
  }

  /**
   * 处理Google凭证响应
   * 这里我们只获取授权URL，然后用popup打开
   */
  function handleCredentialResponse(response) {
    console.log('Google credential response:', response);
    // 这个回调在popup模式下不会被调用
    // 我们使用OAuth授权流程，不是Token直接登录
  }

  /**
   * 启动Google OAuth授权流程
   */
  async function login() {
    if (!isInitialized) {
      const error = 'GoogleAuth not initialized. Call init() first';
      console.error(error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
      return;
    }

    try {
      // 1. 请求后端获取授权URL
      const initResponse = await fetch('/api/auth/google/init');
      const initData = await initResponse.json();

      if (!initData.success || !initData.auth_url) {
        throw new Error(initData.error || 'Failed to initialize Google OAuth');
      }

      // 2. 使用popup打开Google授权页面
      const popup = window.open(
        initData.auth_url,
        'googleAuthPopup',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Failed to open popup. Please allow popups for this site');
      }

      // 3. 监听popup关闭
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          console.log('Google auth popup closed by user');
          // 用户可能取消了授权
          if (callbacks.onError) {
            callbacks.onError('Authorization was cancelled');
          }
        }
      }, 500);

      // 4. 监听OAuth回调
      window.addEventListener('message', handleMessageEvent);

    } catch (error) {
      console.error('Google login error:', error);
      if (callbacks.onError) {
        callbacks.onError(error.message || 'Failed to start Google login');
      }
    }
  }

  /**
   * 处理来自popup的OAuth回调消息
   */
  async function handleMessageEvent(event) {
    // 验证消息来源
    if (event.origin !== window.location.origin) {
      console.warn('Ignoring message from different origin:', event.origin);
      return;
    }

    const data = event.data;

    if (data.type === 'google_oauth_success') {
      console.log('Google OAuth successful:', data.user);
      // 保存token到localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      // 调用成功回调
      if (callbacks.onSuccess) {
        callbacks.onSuccess(data);
      }
    } else if (data.type === 'google_oauth_error') {
      console.error('Google OAuth failed:', data.error);
      if (callbacks.onError) {
        callbacks.onError(data.error);
      }
    }

    // 移除事件监听器
    window.removeEventListener('message', handleMessageEvent);
  }

  /**
   * 渲染Google Sign-In按钮
   */
  function renderButton(container, options = {}) {
    if (!isInitialized) {
      console.error('GoogleAuth not initialized');
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = options.className || 'google-signin-button';
    button.innerHTML = options.text || `
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
        <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9568C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
        <path d="M9 18C11.43 18 13.4673 17.1941 14.9568 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
        <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
        <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
      </svg>
      使用 Google 账号登录
    `;

    // 应用样式
    Object.assign(button.style, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 24px',
      backgroundColor: '#ffffff',
      color: '#3c4043',
      border: '1px solid #dadce0',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'Roboto, Arial, sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'background-color 0.2s, box-shadow 0.2s'
    });

    // 悬停效果
    button.onmouseenter = function() {
      this.style.backgroundColor = '#f7f8f8';
      this.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
    };

    button.onmouseleave = function() {
      this.style.backgroundColor = '#ffffff';
      this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    };

    // 点击事件
    button.onclick = function() {
      login();
    };

    container.appendChild(button);
  }

  /**
   * 退出登录
   */
  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    console.log('Logged out');
  }

  /**
   * 获取当前用户信息
   */
  function getUser() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * 获取当前token
   */
  function getToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * 检查是否已登录
   */
  function isLoggedIn() {
    return !!getToken();
  }

  // 公开API
  return {
    init: init,
    login: login,
    logout: logout,
    getUser: getUser,
    getToken: getToken,
    isLoggedIn: isLoggedIn,
    renderButton: renderButton
  };
})();

// 导出为全局变量（如果使用ES6模块可修改）
if (typeof window !== 'undefined') {
  window.GoogleAuth = GoogleAuth;
}

// 也可以导出为ES6模块
export default GoogleAuth;
