// 浏览器指纹生成工具
// 用于辅助用户识别（与IP结合使用）

/**
 * 获取屏幕信息
 */
function getScreenInfo() {
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth
  };
}

/**
 * 获取浏览器信息
 */
function getBrowserInfo() {
  return {
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints
  };
}

/**
 * 获取时区信息
 */
function getTimezoneInfo() {
  const offset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  
  return {
    offset,
    timezone,
    locale
  };
}

/**
 * 获取WebGL指纹（简化版）
 */
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { available: false };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null;
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null;

    return {
      available: true,
      vendor,
      renderer,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
    };
  } catch (e) {
    console.error('WebGL fingerprint error:', e);
    return { available: false, error: e.message };
  }
}

/**
 * 获取Canvas指纹（简化版）
 */
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return { available: false };
    }

    canvas.width = 200;
    canvas.height = 50;
    
    // 绘制简单的文本
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('fingerprint', 2, 15);
    
    // 获取数据URL
    const dataURL = canvas.toDataURL();
    
    return {
      available: true,
      dataURL: dataURL.substring(0, 100) // 只存储前100个字符，减少数据量
    };
  } catch (e) {
    console.error('Canvas fingerprint error:', e);
    return { available: false, error: e.message };
  }
}

/**
 * 将对象转为简单的字符串用于哈希
 */
function objectToString(obj) {
  return Object.keys(obj)
    .sort()
    .map(key => `${key}:${obj[key]}`)
    .join('|');
}

/**
 * 使用SHA-256生成哈希
 */
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 生成浏览器指纹（仅在浏览器环境中）
 */
export async function generateFingerprint() {
  if (typeof window === 'undefined') {
    throw new Error('Fingerprint generation only works in browser environment');
  }

  const components = {
    screen: getScreenInfo(),
    browser: getBrowserInfo(),
    timezone: getTimezoneInfo(),
    webgl: getWebGLFingerprint(),
    canvas: getCanvasFingerprint()
  };

  // 生成哈希
  const hash = await sha256(objectToString(components));

  return {
    hash,
    components
  };
}

/**
 * 验证指纹是否匹配
 */
export function validateFingerprint(storedComponents, currentComponents) {
  // 比较关键特征（允许一定差异）
  const tolerance = {
    screen: true,  // 允许分辨率变化（如调整窗口）
    browser: true, // 允许语言、平台等变化
    timezone: true, // 允许时区变化（如旅行）
    webgl: false,  // WebGL必须匹配
    canvas: false   // Canvas必须匹配
  };

  let matchCount = 0;
  let totalChecks = 0;

  for (const key of Object.keys(storedComponents)) {
    if (storedComponents[key].available === false || currentComponents[key].available === false) {
      // 如果任一不可用，跳过检查
      continue;
    }

    totalChecks++;

    const stored = storedComponents[key];
    const current = currentComponents[key];

    if (tolerance[key]) {
      // 宽松模式：只比较关键字段
      if (key === 'screen') {
        // 屏幕变化较大，跳过
        continue;
      } else if (key === 'browser') {
        // 比较platform（操作系统）
        if (stored.platform === current.platform) {
          matchCount++;
        }
      } else if (key === 'timezone') {
        // 时区变化，跳过
        continue;
      }
    } else {
      // 严格模式：所有字段必须匹配
      if (JSON.stringify(stored) === JSON.stringify(current)) {
        matchCount++;
      }
    }
  }

  // 至少50%的特征匹配才认为可信
  return totalChecks > 0 && (matchCount / totalChecks) >= 0.5;
}
