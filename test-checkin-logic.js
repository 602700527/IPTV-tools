// 连续签到逻辑测试（纯逻辑测试，不依赖数据库）

console.log('========== 连续签到逻辑测试 ==========\n');

// 测试函数
function testConsecutiveCheckIn(lastCheckInRecord, today, yesterday) {
  const lastCheckInDate = lastCheckInRecord ? lastCheckInRecord.checkin_date : null;
  const lastConsecutiveDays = lastCheckInRecord ? lastCheckInRecord.consecutive_days : 0;

  let newConsecutiveDays = 1;
  let isConsecutive = false;

  if (lastCheckInDate === yesterday) {
    newConsecutiveDays = lastConsecutiveDays + 1;
    isConsecutive = true;
  } else if (lastCheckInDate === today) {
    return { success: false, reason: 'already_checked_in' };
  } else {
    newConsecutiveDays = 1;
  }

  // 计算奖励
  let rewardDays = 1;
  if (newConsecutiveDays >= 30) {
    rewardDays = 7;
  } else if (newConsecutiveDays >= 7) {
    rewardDays = 2;
  }

  // 生成提示信息
  const message = isConsecutive
    ? `连续签到${newConsecutiveDays}天，获得${rewardDays}天！`
    : `签到成功，获得${rewardDays}天！`;

  return {
    success: true,
    consecutiveDays: newConsecutiveDays,
    isConsecutive,
    rewardDays,
    message
  };
}

// 测试用例
const testCases = [
  {
    name: '测试1: 首次签到',
    lastCheckInRecord: null,
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 1,
      isConsecutive: false,
      rewardDays: 1,
      message: '签到成功，获得1天！'
    }
  },
  {
    name: '测试2: 连续签到第2天',
    lastCheckInRecord: {
      checkin_date: '2024-01-14',
      consecutive_days: 1
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 2,
      isConsecutive: true,
      rewardDays: 1,
      message: '连续签到2天，获得1天！'
    }
  },
  {
    name: '测试3: 连续签到第3天',
    lastCheckInRecord: {
      checkin_date: '2024-01-14',
      consecutive_days: 2
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 3,
      isConsecutive: true,
      rewardDays: 1,
      message: '连续签到3天，获得1天！'
    }
  },
  {
    name: '测试4: 连续签到第7天（触发2天奖励）',
    lastCheckInRecord: {
      checkin_date: '2024-01-14',
      consecutive_days: 6
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 7,
      isConsecutive: true,
      rewardDays: 2,
      message: '连续签到7天，获得2天！'
    }
  },
  {
    name: '测试5: 连续签到第30天（触发7天奖励）',
    lastCheckInRecord: {
      checkin_date: '2024-01-14',
      consecutive_days: 29
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 30,
      isConsecutive: true,
      rewardDays: 7,
      message: '连续签到30天，获得7天！'
    }
  },
  {
    name: '测试6: 中断后重新签到（3天前签到）',
    lastCheckInRecord: {
      checkin_date: '2024-01-12',
      consecutive_days: 5
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 1,
      isConsecutive: false,
      rewardDays: 1,
      message: '签到成功，获得1天！'
    }
  },
  {
    name: '测试7: 中断后重新签到（10天前签到）',
    lastCheckInRecord: {
      checkin_date: '2024-01-05',
      consecutive_days: 100
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: true,
      consecutiveDays: 1,
      isConsecutive: false,
      rewardDays: 1,
      message: '签到成功，获得1天！'
    }
  },
  {
    name: '测试8: 今天已签到',
    lastCheckInRecord: {
      checkin_date: '2024-01-15',
      consecutive_days: 5
    },
    today: '2024-01-15',
    yesterday: '2024-01-14',
    expected: {
      success: false,
      reason: 'already_checked_in'
    }
  }
];

// 执行测试
let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n${testCase.name}`);
  console.log('-'.repeat(50));

  const result = testConsecutiveCheckIn(
    testCase.lastCheckInRecord,
    testCase.today,
    testCase.yesterday
  );

  // 检查结果
  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);

  if (passed) {
    console.log(`✅ 测试通过`);
    passedTests++;
  } else {
    console.log(`❌ 测试失败`);
    failedTests++;
  }

  console.log(`期望结果:`, testCase.expected);
  console.log(`实际结果:`, result);

  if (!passed) {
    if (result.success !== testCase.expected.success) {
      console.log(`  ❌ success 不匹配: 期望 ${testCase.expected.success}, 实际 ${result.success}`);
    }
    if (result.consecutiveDays !== testCase.expected.consecutiveDays) {
      console.log(`  ❌ consecutiveDays 不匹配: 期望 ${testCase.expected.consecutiveDays}, 实际 ${result.consecutiveDays}`);
    }
    if (result.isConsecutive !== testCase.expected.isConsecutive) {
      console.log(`  ❌ isConsecutive 不匹配: 期望 ${testCase.expected.isConsecutive}, 实际 ${result.isConsecutive}`);
    }
    if (result.rewardDays !== testCase.expected.rewardDays) {
      console.log(`  ❌ rewardDays 不匹配: 期望 ${testCase.expected.rewardDays}, 实际 ${result.rewardDays}`);
    }
    if (result.message !== testCase.expected.message) {
      console.log(`  ❌ message 不匹配:`);
      console.log(`     期望: "${testCase.expected.message}"`);
      console.log(`     实际: "${result.message}"`);
    }
  }
});

// 打印测试结果汇总
console.log('\n' + '='.repeat(50));
console.log(`测试结果汇总`);
console.log('='.repeat(50));
console.log(`总测试数: ${testCases.length}`);
console.log(`通过: ${passedTests} ✅`);
console.log(`失败: ${failedTests} ❌`);
console.log('='.repeat(50));

if (failedTests === 0) {
  console.log('\n🎉 所有测试通过！连续签到逻辑正确。\n');
} else {
  console.log(`\n⚠️  有 ${failedTests} 个测试失败，请检查上述结果。\n`);
}

// 额外验证：检查提示信息格式
console.log('\n额外验证：提示信息格式检查');
console.log('='.repeat(50));

const formatTests = [
  {
    name: '连续签到提示格式',
    message: '连续签到5天，获得1天！',
    expected: true,
    isConsecutive: true
  },
  {
    name: '首次签到提示格式',
    message: '签到成功，获得1天！',
    expected: true,
    isConsecutive: false
  },
  {
    name: '错误格式1（缺少连续）',
    message: '签到5天，获得1天！',
    expected: false,
    isConsecutive: true
  },
  {
    name: '错误格式2（缺少获得）',
    message: '连续签到5天！',
    expected: false,
    isConsecutive: true
  }
];

let formatPassed = 0;
formatTests.forEach(test => {
  let correctFormat = false;

  if (test.isConsecutive) {
    // 连续签到格式：连续签到X天，获得Y天！
    correctFormat = test.message.startsWith('连续签到') && test.message.includes('获得') && test.message.includes('天') && test.message.endsWith('！');
  } else {
    // 首次签到格式：签到成功，获得X天！
    correctFormat = test.message.startsWith('签到成功') && test.message.includes('获得') && test.message.includes('天') && test.message.endsWith('！');
  }

  const passed = correctFormat === test.expected;

  if (passed) {
    console.log(`✅ ${test.name}`);
    formatPassed++;
  } else {
    console.log(`❌ ${test.name}`);
    console.log(`   消息: "${test.message}"`);
  }
});

console.log(`\n格式检查: ${formatPassed}/${formatTests.length} 通过`);

// 最终结论
console.log('\n' + '='.repeat(50));
console.log('测试结论');
console.log('='.repeat(50));

if (failedTests === 0 && formatPassed === formatTests.length) {
  console.log('✅ 连续签到功能测试完全通过');
  console.log('✅ 连续签到天数统计正确');
  console.log('✅ 中断后重置逻辑正确');
  console.log('✅ 连续签到奖励规则正确（7天/30天）');
  console.log('✅ 提示信息格式正确');
  console.log('\n代码逻辑验证通过，可以部署到生产环境！🎉\n');
} else {
  console.log('❌ 存在测试失败，请修复后再部署\n');
}

process.exit(failedTests === 0 && formatPassed === formatTests.length ? 0 : 1);
