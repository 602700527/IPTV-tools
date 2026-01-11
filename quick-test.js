/**
 * 在浏览器控制台运行的快速测试脚本
 * 复制整个脚本到管理后台页面的控制台运行
 */

async function quickTest() {
  console.log('===== 快速测试开始 =====');

  // 1. 获取广告文件列表
  console.log('\n1. 获取广告文件列表...');
  try {
    const response = await fetch('/admin/adts');
    const result = await response.json();
    console.log('广告文件:', result);
    
    if (result.success && result.files && result.files.length > 0) {
      console.log('✅ 找到广告文件:', result.files.map(f => `${f.id}:${f.name}`).join(', '));
      return result.files;
    } else {
      console.log('❌ 没有找到广告文件');
      return [];
    }
  } catch (e) {
    console.error('获取广告文件失败:', e);
    return [];
  }
}

async function testAdBinding() {
  console.log('\n===== 测试广告绑定 =====');
  
  const ads = await quickTest();
  if (ads.length === 0) {
    console.log('请先上传广告文件');
    return;
  }

  const ad = ads[0];
  console.log('\n使用广告:', ad);

  // 2. 获取频道列表
  console.log('\n2. 获取频道列表...');
  try {
    const response = await fetch('/admin/channels?page=1&page_size=1');
    const result = await response.json();
    
    if (result.success && result.channels && result.channels.length > 0) {
      const channel = result.channels[0];
      console.log('测试频道:', channel.channel_name, channel.channel_hash);
      
      // 3. 创建测试卡密
      console.log('\n3. 创建测试卡密...');
      const codeResponse = await fetch('/admin/codes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify({ duration_days: 30, max_ips: 3, remark: 'test_ad_binding' })
      });
      const codeResult = await codeResponse.json();
      
      if (codeResult.success) {
        console.log('✅ 测试卡密:', codeResult.code);
        
        // 4. 测试广告绑定 - 不播放广告
        console.log('\n4a. 测试: 不播放广告');
        await deleteAdBinding('code_normal');
        await sleep(500);
        
        const playUrl1 = `${window.location.origin}/live/${codeResult.code}/${channel.channel_hash}`;
        console.log('播放URL:', playUrl1);
        
        const response1 = await fetch(playUrl1, { redirect: 'manual' });
        console.log('响应状态:', response1.status);
        console.log('Location:', response1.headers.get('Location'));
        
        // 5. 测试广告绑定 - 播放广告
        console.log('\n4b. 测试: 播放指定广告');
        await setAdBinding('code_normal', ad.id);
        await sleep(500);
        
        const response2 = await fetch(playUrl1, { redirect: 'manual' });
        console.log('响应状态:', response2.status);
        
        const contentType = response2.headers.get('Content-Type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('m3u8')) {
          const content = await response2.text();
          console.log('响应内容前100字符:', content.substring(0, 100));
          
          if (content.includes('base64') || content.includes('ad_')) {
            console.log('✅ 检测到广告内容');
          } else {
            console.log('❌ 未检测到广告内容');
          }
        }
        
        // 清理
        await deleteAdBinding('code_normal');
        
      } else {
        console.log('❌ 创建卡密失败:', codeResult);
      }
    } else {
      console.log('❌ 没有找到频道');
    }
  } catch (e) {
    console.error('错误:', e);
  }
}

async function setAdBinding(actionType, adId) {
  console.log(`设置广告绑定: ${actionType} -> ad_id=${adId}`);
  
  // 先检查是否存在
  const listResponse = await fetch('/admin/ad-bindings?page=1&page_size=100');
  const listResult = await listResponse.json();
  
  let existingBinding = null;
  if (listResult.success && listResult.bindings) {
    existingBinding = listResult.bindings.find(b => b.action_type === actionType);
  }
  
  const url = existingBinding
    ? `/admin/ad-bindings/update?id=${existingBinding.id}`
    : '/admin/ad-bindings/create';
  const method = existingBinding ? 'PUT' : 'POST';
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
    body: JSON.stringify({
      action_type: actionType,
      ad_id: adId,
      cooldown_seconds: 0,
      priority: 0
    })
  });
  
  const result = await response.json();
  console.log('设置结果:', result);
  return result.success;
}

async function deleteAdBinding(actionType) {
  console.log(`删除广告绑定: ${actionType}`);
  
  const listResponse = await fetch('/admin/ad-bindings?page=1&page_size=100');
  const listResult = await listResponse.json();
  
  if (listResult.success && listResult.bindings) {
    const binding = listResult.bindings.find(b => b.action_type === actionType);
    if (binding) {
      const response = await fetch(`/admin/ad-bindings/delete?id=${binding.id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey }
      });
      const result = await response.json();
      console.log('删除结果:', result);
      return result.success;
    }
  }
  return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行测试
console.log('将此脚本复制到浏览器控制台运行');
console.log('然后调用: testAdBinding()');
