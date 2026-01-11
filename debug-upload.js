/**
 * 调试本地环境TS文件上传问题
 * 在浏览器控制台运行此脚本
 */

async function testAdUpload() {
  // 1. 创建一个测试TS文件内容
  const testTsContent = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
test_ad_segment_1.ts
#EXT-X-ENDLIST`;

  // 2. 转换为Blob
  const blob = new Blob([testTsContent], { type: 'video/mp2t' });
  const file = new File([blob], 'test_ad.ts', { type: 'video/mp2t' });

  console.log('测试文件:', file);
  console.log('文件大小:', file.size, 'bytes');

  // 3. 准备FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', 'Test Advertisement');
  formData.append('ad_type', 'normal');
  formData.append('description', 'Test upload');
  formData.append('is_active', 'true');

  console.log('FormData prepared');

  // 4. 发送请求
  try {
    const adminKey = prompt('请输入管理员密钥:', '');
    if (!adminKey) {
      console.error('未提供管理员密钥');
      return;
    }

    console.log('开始上传请求...');
    const response = await fetch('/admin/ad-ts/upload', {
      method: 'POST',
      headers: {
        'X-Admin-Key': adminKey
      },
      body: formData
    });

    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('响应内容:', result);

    if (result.success) {
      console.log('✅ 上传成功!');
    } else {
      console.error('❌ 上传失败:', result.error);
    }
  } catch (error) {
    console.error('❌ 请求异常:', error);
    console.error('错误堆栈:', error.stack);
  }
}

// 检查环境支持
function checkEnvironmentSupport() {
  console.log('===== 环境支持检查 =====');

  // 检查 FormData
  console.log('FormData 支持:', typeof FormData !== 'undefined');

  // 检查 File/Blob
  console.log('File 支持:', typeof File !== 'undefined');
  console.log('Blob 支持:', typeof Blob !== 'undefined');

  // 检查 Base64 编码
  try {
    const test = btoa('test');
    console.log('btoa 支持:', true);
  } catch (e) {
    console.log('btoa 支持:', false);
  }

  // 检查 fetch API
  console.log('fetch 支持:', typeof fetch !== 'undefined');

  // 检查当前环境
  console.log('当前URL:', window.location.href);
  console.log('User-Agent:', navigator.userAgent);

  console.log('===== 检查完成 =====');
}

// 运行检查
checkEnvironmentSupport();

// 测试上传按钮
console.log('\n运行 testAdUpload() 来测试上传');
