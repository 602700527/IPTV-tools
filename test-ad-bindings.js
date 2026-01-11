/**
 * 广告绑定功能测试 - 简化版（仅测试卡密功能）
 * 测试所有播放场景的广告绑定和重定向逻辑
 */

let fetchFn = fetch;
const BASE_URL = 'http://127.0.0.1:8787';
const ADMIN_PASSWORD = 'admin-key-please-change-in-production';

// 测试场景定义（仅卡密相关）
const testScenarios = [
  { name: '卡密正常播放', action: 'code_normal', shouldRedirect: true, needsValidCode: true },
  { name: '卡密过期播放', action: 'code_expired', shouldRedirect: false, needsValidCode: true },
  { name: '卡密IP未授权', action: 'code_unauth', shouldRedirect: false, needsValidCode: true },
  { name: '频道不存在卡密播放', action: 'code_channel_not_found', shouldRedirect: false, needsValidCode: true }
];

async function adminRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Key': ADMIN_PASSWORD,
    ...options.headers
  };
  const response = await fetchFn(url, { ...options, headers });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, error: text };
  }
}

async function getTestResources() {
  console.log('获取测试资源...\n');
  
  // 获取广告文件
  const adResult = await adminRequest('/admin/ad-ts?page=1&page_size=1');
  if (!adResult.success || !adResult.files || adResult.files.length === 0) {
    throw new Error('没有找到广告文件');
  }
  const adFile = adResult.files[0];
  console.log(`✓ 广告文件: ${adFile.name} (ID: ${adFile.id})`);
  
  // 获取频道
  const channelResult = await adminRequest('/admin/channels?page=1&page_size=1');
  let channel = null;
  if (channelResult.results && channelResult.results.length > 0) {
    channel = channelResult.results[0];
  } else if (channelResult.channels && channelResult.channels.length > 0) {
    channel = channelResult.channels[0];
  }
  
  if (!channel) {
    throw new Error('没有找到频道');
  }
  console.log(`✓ 测试频道: ${channel.channel_name} (Hash: ${channel.channel_hash})\n`);
  
  return { adFile, channel };
}

async function createTestCode() {
  const result = await adminRequest('/admin/codes/create', {
    method: 'POST',
    body: JSON.stringify({ duration_days: 30, max_ips: 3, remark: 'test_ad_binding' })
  });

  // 如果创建失败，尝试获取现有卡密
  if (!result.success) {
    console.log('  创建卡密失败，尝试获取现有卡密...');
    const listResult = await adminRequest('/admin/codes?page=1&page_size=1');
    let code = null;
    if (listResult.results && listResult.results.length > 0) {
      code = listResult.results[0].code;
    } else if (listResult.codes && listResult.codes.length > 0) {
      code = listResult.codes[0].code;
    }
    
    if (code) {
      console.log(`✓ 使用现有卡密: ${code}\n`);
      return code;
    }
    throw new Error('无法获取卡密: ' + JSON.stringify(result));
  }

  console.log(`✓ 创建测试卡密: ${result.code}\n`);
  return result.code;
}

async function setExpiredCode(code) {
  const result = await adminRequest('/admin/codes/update?id=' + code, {
    method: 'PUT',
    body: JSON.stringify({ expired_at: '2020-01-01T00:00:00.000Z' })
  });
  if (result.success) {
    console.log(`✓ 设置卡密过期: ${code}`);
  }
  return result.success;
}

async function restoreCode(code) {
  const result = await adminRequest('/admin/codes/update?id=' + code, {
    method: 'PUT',
    body: JSON.stringify({ expired_at: '2099-01-01T00:00:00.000Z' })
  });
  if (result.success) {
    console.log(`✓ 恢复卡密有效期: ${code}`);
  }
  return result.success;
}

async function setAdBinding(actionType, adId) {
  const listResult = await adminRequest('/admin/ad-bindings?page=1&page_size=100');
  let existingBinding = null;
  if (listResult.success && listResult.bindings) {
    existingBinding = listResult.bindings.find(b => b.action_type === actionType);
  }

  const url = existingBinding
    ? `/admin/ad-bindings/update?id=${existingBinding.id}`
    : `/admin/ad-bindings/create`;
  const method = existingBinding ? 'PUT' : 'POST';

  const result = await adminRequest(url, {
    method,
    body: JSON.stringify({
      action_type: actionType,
      ad_id: adId,
      cooldown_seconds: 0,
      priority: 0
    })
  });

  if (result.success) {
    console.log(`✓ 设置广告绑定: ${actionType} -> ${adId || '无'}`);
  } else {
    console.log(`✗ 设置广告绑定失败: ${actionType} -> ${result.error}`);
  }
  return result.success;
}

async function deleteAdBinding(actionType) {
  const listResult = await adminRequest('/admin/ad-bindings?page=1&page_size=100');
  if (listResult.success && listResult.bindings) {
    const binding = listResult.bindings.find(b => b.action_type === actionType);
    if (binding) {
      await adminRequest(`/admin/ad-bindings/delete?id=${binding.id}`, { method: 'DELETE' });
      console.log(`✓ 删除广告绑定: ${actionType}`);
    }
  }
  return true;
}

function isAdM3U8(content) {
  return content && content.includes('#EXTM3U') && content.includes('data:application/octet-stream;base64');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testScenario(scenario, adFile, channel, code) {
  console.log(`\n测试: ${scenario.name}`);
  console.log(`  期望重定向: ${scenario.shouldRedirect ? '是' : '否'}`);

  const results = [];

  // 准备测试环境
  if (scenario.action === 'code_expired') {
    await setExpiredCode(code);
  }

  // 测试1: 不播放广告
  console.log(`  子测试1: 不播放广告`);
  if (!await setAdBinding(scenario.action, null)) {
    results.push('设置广告绑定失败');
    return { passed: false, failures: results };
  }
  await sleep(300);

  const url = `${BASE_URL}/live/${code}/${scenario.action.includes('not_found') ? 'nonexistent_' + Date.now() : channel.channel_hash}`;
  const response1 = await fetchFn(url, { redirect: 'manual' });
  const isRedirect1 = response1.status >= 300 && response1.status < 400;
  const text1 = await response1.text();
  const hasAd1 = isAdM3U8(text1);

  console.log(`    状态: ${response1.status}, 重定向: ${isRedirect1}, 广告: ${hasAd1}`);

  if (scenario.shouldRedirect && !isRedirect1 && !hasAd1) {
    results.push('期望重定向或广告但未检测到');
  } else if (!scenario.shouldRedirect && isRedirect1) {
    results.push('期望不重定向但重定向了');
  }
  if (!scenario.shouldRedirect && hasAd1 && !isRedirect1) {
    // 如果不期望重定向但检测到广告，这是正确的行为
    console.log(`    ✓ 正确返回广告而不重定向`);
  }

  await deleteAdBinding(scenario.action);
  await sleep(300);

  // 测试2: 播放指定广告
  console.log(`  子测试2: 播放指定广告`);
  if (!await setAdBinding(scenario.action, adFile.id)) {
    results.push('设置广告绑定失败');
    return { passed: false, failures: results };
  }
  await sleep(300);

  const response2 = await fetchFn(url, { redirect: 'manual' });
  const isRedirect2 = response2.status >= 300 && response2.status < 400;
  const text2 = await response2.text();
  const hasAd2 = isAdM3U8(text2);

  console.log(`    状态: ${response2.status}, 重定向: ${isRedirect2}, 广告: ${hasAd2}`);

  if (scenario.shouldRedirect && !isRedirect2 && !hasAd2) {
    results.push('期望重定向或广告但未检测到');
  } else if (!scenario.shouldRedirect && isRedirect2) {
    results.push('期望不重定向但重定向了');
  }
  if (!scenario.shouldRedirect && hasAd2 && !isRedirect2) {
    console.log(`    ✓ 正确返回广告而不重定向`);
  }

  await deleteAdBinding(scenario.action);
  await sleep(300);

  // 恢复卡密状态
  if (scenario.action === 'code_expired') {
    await restoreCode(code);
  }

  const passed = results.length === 0;
  if (passed) {
    console.log(`  ✅ 通过`);
  } else {
    console.log(`  ❌ 失败: ${results.join(', ')}`);
  }

  return { passed, failures: results };
}

async function runTests() {
  console.log('========================================');
  console.log('广告绑定功能测试（卡密部分）');
  console.log('========================================\n');

  try {
    const { adFile, channel } = await getTestResources();
    const code = await createTestCode();

    console.log('========================================');
    console.log('开始测试');
    console.log('========================================');

    const results = {
      total: 0,
      passed: 0,
      failed: 0,
      details: []
    };

    for (const scenario of testScenarios) {
      results.total++;
      const result = await testScenario(scenario, adFile, channel, code);
      if (result.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
      results.details.push({
        scenario: scenario.name,
        passed: result.passed,
        failures: result.failures
      });
    }

    console.log('\n========================================');
    console.log('测试摘要');
    console.log('========================================');
    console.log(`总计: ${results.total}`);
    console.log(`通过: ${results.passed} ✅`);
    console.log(`失败: ${results.failed} ❌`);
    console.log(`通过率: ${((results.passed / results.total) * 100).toFixed(2)}%`);

    if (results.failed > 0) {
      console.log('\n失败的测试:');
      results.details.filter(d => !d.passed).forEach(d => {
        console.log(`  - ${d.scenario}: ${d.failures.join(', ')}`);
      });
    }

    console.log('\n========================================');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('请确保:');
    console.log('  1. 本地服务正在运行 (http://127.0.0.1:8787)');
    console.log('  2. 已上传至少一个广告TS文件');
    console.log('  3. 数据库中有频道数据');
    console.log('  4. 已创建至少一个卡密');
  }
}

runTests().catch(console.error);
