// 测试免费订阅令牌机制
// 运行方式: node test-freesub-token.js

import { generateFreeSubPlayToken, verifyFreeSubPlayToken } from './database.js';

console.log('=== 测试免费订阅令牌机制 ===\n');

// 测试数据
const channelHash = 'test_channel_hash_123';
const subId = 'free_abc123def456';

console.log('1. 生成播放令牌');
const token = generateFreeSubPlayToken(channelHash, subId);
console.log('   频道哈希:', channelHash);
console.log('   订阅ID:', subId);
console.log('   生成的令牌:', token);
console.log();

console.log('2. 验证令牌（正确参数）');
const isValid1 = verifyFreeSubPlayToken(token, channelHash, subId);
console.log('   验证结果:', isValid1 ? '✓ 有效' : '✗ 无效');
console.log();

console.log('3. 验证令牌（错误的频道哈希）');
const isValid2 = verifyFreeSubPlayToken(token, 'wrong_hash', subId);
console.log('   验证结果:', isValid2 ? '✓ 有效' : '✗ 无效');
console.log();

console.log('4. 验证令牌（错误的订阅ID）');
const isValid3 = verifyFreeSubPlayToken(token, channelHash, 'wrong_subid');
console.log('   验证结果:', isValid3 ? '✓ 有效' : '✗ 无效');
console.log();

console.log('5. 等待5秒后验证（未过期）');
setTimeout(() => {
  const isValid4 = verifyFreeSubPlayToken(token, channelHash, subId);
  console.log('   验证结果:', isValid4 ? '✓ 有效' : '✗ 无效');
  console.log();

  console.log('6. 测试过期令牌');
  // 创建一个6分钟前的令牌
  const oldTimestamp = Date.now() - 6 * 60 * 1000;
  const oldData = `${channelHash}|${subId}|${oldTimestamp}`;
  const oldToken = btoa(oldData);
  const isValid5 = verifyFreeSubPlayToken(oldToken, channelHash, subId);
  console.log('   验证结果:', isValid5 ? '✓ 有效' : '✗ 无效（已过期）');
  console.log();

  console.log('=== 测试完成 ===');
}, 5000);
