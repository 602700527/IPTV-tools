/**
 * 简单测试脚本 - 测试广告绑定功能
 * 在浏览器控制台运行
 */

// 配置
const adminKey = 'admin-key-please-change-in-production';

async function testAdBinding() {
  console.log('===== 广告绑定测试 =====\n');
  
  // 1. 获取广告文件
  console.log('1. 获取广告文件...');
  const adRes = await fetch('/admin/ad-ts');
  const adData = await adRes.json();
  console.log('广告数据:', adData);
  
  if (!adData.success || !adData.files || adData.files.length === 0) {
    console.log('❌ 没有广告文件');
    return;
  }
  const adFile = adData.files[0];
  console.log(`✓ 广告: ${adFile.name} (ID: ${adFile.id})\n`);
  
  // 2. 获取频道
  console.log('2. 获取频道...');
  const chRes = await fetch('/admin/channels?page=1&page_size=1');
  const chData = await chRes.json();
  console.log('频道数据:', chData);
  
  let channel = chData.results?.[0] || chData.channels?.[0];
  if (!channel) {
    console.log('❌ 没有频道');
    return;
  }
  console.log(`✓ 频道: ${channel.channel_name} (Hash: ${channel.channel_hash})\n`);
  
  // 3. 创建测试卡密
  console.log('3. 创建测试卡密...');
  const codeRes = await fetch('/admin/codes/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
    body: JSON.stringify({
      duration_days: 30,
      max_ips: 3,
      remark: 'test_ad_binding'
    })
  });
  const codeData = await codeRes.json();
  console.log('创建卡密响应:', codeData);
  
  // 获取卡密
  const listRes = await fetch('/admin/codes?page=1&page_size=1');
  const listData = await listRes.json();
  console.log('卡密列表:', listData);
  
  const code = listData.results?.[0]?.code || listData.codes?.[0]?.code;
  if (!code) {
    console.log('❌ 没有卡密');
    return;
  }
  console.log(`✓ 卡密: ${code}\n`);
  
  // 4. 测试不播放广告
  console.log('4a. 测试: 不播放广告');
  await fetch('/admin/ad-bindings/delete?id=1', { method: 'DELETE', headers: { 'X-Admin-Key': adminKey } }).catch(() => {});
  await new Promise(r => setTimeout(r, 300));
  
  const playUrl = `${window.location.origin}/live/${code}/${channel.channel_hash}`;
  console.log('播放URL:', playUrl);
  
  const res1 = await fetch(playUrl, { redirect: 'manual' });
  console.log(`状态: ${res1.status}`);
  console.log(`Location: ${res1.headers.get('Location')}`);
  console.log(`Content-Type: ${res1.headers.get('Content-Type')}`);
  
  if (res1.status >= 300 && res1.status < 400) {
    console.log('✓ 重定向成功 (未播放广告)\n');
  } else {
    console.log('✗ 未重定向\n');
  }
  
  // 5. 测试播放广告
  console.log('4b. 测试: 播放广告');
  await fetch('/admin/ad-bindings/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
    body: JSON.stringify({
      action_type: 'code_normal',
      ad_id: adFile.id,
      cooldown_seconds: 0,
      priority: 0
    })
  }).then(r => r.json()).then(d => console.log('创建绑定响应:', d));
  
  await new Promise(r => setTimeout(r, 300));
  
  const res2 = await fetch(playUrl, { redirect: 'manual' });
  console.log(`状态: ${res2.status}`);
  console.log(`Content-Type: ${res2.headers.get('Content-Type')}`);
  
  const contentType2 = res2.headers.get('Content-Type');
  if (contentType2?.includes('m3u8')) {
    const content = await res2.text();
    console.log(`内容长度: ${content.length}`);
    console.log(`包含 #EXTM3U: ${content.includes('#EXTM3U')}`);
    console.log(`包含 base64: ${content.includes('base64')}`);
    
    if (content.includes('#EXTM3U') && content.includes('base64')) {
      console.log('✓ 广告播放成功\n');
    } else {
      console.log('✗ 未检测到广告\n');
    }
  }
  
  // 清理
  console.log('5. 清理广告绑定...');
  await fetch('/admin/ad-bindings/delete?id=1', { method: 'DELETE', headers: { 'X-Admin-Key': adminKey } });
  console.log('✓ 清理完成');
}

// 运行测试
testAdBinding();
