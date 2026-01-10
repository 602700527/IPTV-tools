// 免费订阅功能测试文件
// 可以在浏览器控制台运行，或集成到测试框架

/**
 * 测试1: 生成浏览器指纹
 */
async function testGenerateFingerprint() {
  console.log('=== 测试1: 生成浏览器指纹 ===');

  const fingerprintComponents = {
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth
    },
    browser: {
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent.substring(0, 100)
    },
    timezone: {
      offset: new Date().getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(fingerprintComponents));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fingerprint = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  console.log('指纹组件:', fingerprintComponents);
  console.log('指纹哈希:', fingerprint);
  console.log('测试1: ✓ 通过\n');

  return { fingerprint, fingerprintComponents };
}

/**
 * 测试2: 创建免费订阅
 */
async function testCreateFreeSubscription(fingerprint, fingerprintComponents) {
  console.log('=== 测试2: 创建免费订阅 ===');

  try {
    const response = await fetch('/api/freesub/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fingerprint: fingerprint,
        fingerprintComponents: fingerprintComponents
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('订阅ID:', data.subscription.subId);
      console.log('IP:', data.subscription.ip);
      console.log('过期时间:', data.subscription.expiredAt);
      console.log('总天数:', data.subscription.totalDays);
      console.log('测试2: ✓ 通过\n');
      return data.subscription;
    } else {
      console.error('测试2: ✗ 失败 -', data.error);
      return null;
    }
  } catch (error) {
    console.error('测试2: ✗ 失败 -', error.message);
    return null;
  }
}

/**
 * 测试3: 获取订阅信息
 */
async function testGetSubscriptionInfo(subId, fingerprint) {
  console.log('=== 测试3: 获取订阅信息 ===');

  try {
    const response = await fetch('/api/freesub/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subId: subId,
        fingerprint: fingerprint
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('订阅信息:', data.subscription);
      console.log('签到统计:', data.stats);
      console.log('测试3: ✓ 通过\n');
      return data;
    } else {
      console.error('测试3: ✗ 失败 -', data.error);
      return null;
    }
  } catch (error) {
    console.error('测试3: ✗ 失败 -', error.message);
    return null;
  }
}

/**
 * 测试4: 签到
 */
async function testCheckIn(subId, fingerprint) {
  console.log('=== 测试4: 签到 ===');

  try {
    const response = await fetch('/api/freesub/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subId: subId,
        fingerprint: fingerprint
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('签到成功!');
      console.log('奖励天数:', data.rewardDays);
      console.log('连续天数:', data.consecutiveDays);
      console.log('消息:', data.message);
      console.log('新过期时间:', data.expiredAt);
      console.log('测试4: ✓ 通过\n');
      return data;
    } else {
      console.error('测试4: ✗ 失败 -', data.reason || data.error);
      return null;
    }
  } catch (error) {
    console.error('测试4: ✗ 失败 -', error.message);
    return null;
  }
}

/**
 * 测试5: 获取订阅M3U
 */
async function testGetSubscriptionM3U(subId, fingerprint) {
  console.log('=== 测试5: 获取订阅M3U ===');

  const m3uUrl = `/api/freesub/${subId}.m3u?fp=${fingerprint}`;

  try {
    const response = await fetch(m3uUrl);
    const text = await response.text();

    if (response.ok) {
      console.log('M3U前100字符:', text.substring(0, 100));
      console.log('测试5: ✓ 通过\n');
      return text;
    } else {
      console.error('测试5: ✗ 失败 -', text);
      return null;
    }
  } catch (error) {
    console.error('测试5: ✗ 失败 -', error.message);
    return null;
  }
}

/**
 * 测试6: 验证IP绑定
 */
async function testIPBinding(subId, fingerprint) {
  console.log('=== 测试6: 验证IP绑定 ===');

  // 获取当前IP
  const currentInfo = await testGetSubscriptionInfo(subId, fingerprint);
  if (!currentInfo) {
    console.error('测试6: ✗ 无法获取当前IP信息');
    return null;
  }

  const currentIP = currentInfo.subscription.ip;
  console.log('当前IP:', currentIP);

  // 尝试使用相同订阅和指纹获取M3U（应该成功）
  const m3u1 = await testGetSubscriptionM3U(subId, fingerprint);
  if (!m3u1) {
    console.error('测试6: ✗ 正常访问失败');
    return null;
  }

  console.log('测试6: ✓ 通过（正常IP访问成功）');
  return { currentIP };
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('\n========================================');
  console.log('  免费订阅功能测试套件');
  console.log('========================================\n');

  try {
    // 测试1: 生成指纹
    const { fingerprint, fingerprintComponents } = await testGenerateFingerprint();
    if (!fingerprint) {
      console.error('指纹生成失败，终止测试');
      return;
    }

    // 测试2: 创建订阅
    const subscription = await testCreateFreeSubscription(fingerprint, fingerprintComponents);
    if (!subscription) {
      console.error('创建订阅失败，终止测试');
      return;
    }

    const subId = subscription.subId;

    // 测试3: 获取订阅信息
    await testGetSubscriptionInfo(subId, fingerprint);

    // 测试4: 签到
    await testCheckIn(subId, fingerprint);

    // 测试5: 获取M3U
    await testGetSubscriptionM3U(subId, fingerprint);

    // 测试6: IP绑定验证
    await testIPBinding(subId, fingerprint);

    console.log('========================================');
    console.log('  所有测试完成！');
    console.log('========================================\n');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 导出到全局，方便在控制台调用
window.testFreeSub = {
  runAllTests,
  testGenerateFingerprint,
  testCreateFreeSubscription,
  testGetSubscriptionInfo,
  testCheckIn,
  testGetSubscriptionM3U,
  testIPBinding
};

console.log('免费订阅测试函数已加载！');
console.log('运行所有测试: await testFreeSub.runAllTests()');
