// D1 数据库诊断脚本
// 使用方法: wrangler dev --local 或部署后在 Worker 中测试

export async function testD1Connection(env) {
  console.log('=== D1 诊断开始 ===');

  // 1. 检查 DB 是否存在
  if (!env.DB) {
    console.error('❌ D1 数据库未绑定');
    return { success: false, error: 'D1 database not bound' };
  }
  console.log('✓ D1 数据库已绑定');

  // 2. 尝试简单查询
  try {
    const result = await env.DB.prepare('SELECT 1 as test').first();
    console.log('✓ 简单查询成功:', result);
  } catch (error) {
    console.error('❌ 简单查询失败:', error);
    return { success: false, error: `Query failed: ${error.message}` };
  }

  // 3. 尝试创建测试表
  try {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, data TEXT)').run();
    console.log('✓ 创建测试表成功');
  } catch (error) {
    console.error('❌ 创建测试表失败:', error);
    return { success: false, error: `Create table failed: ${error.message}` };
  }

  // 4. 尝试插入数据
  try {
    await env.DB.prepare('INSERT INTO test_table (data) VALUES (?)').bind('test-data').run();
    console.log('✓ 插入数据成功');
  } catch (error) {
    console.error('❌ 插入数据失败:', error);
    return { success: false, error: `Insert failed: ${error.message}` };
  }

  // 5. 尝试查询数据
  try {
    const result = await env.DB.prepare('SELECT * FROM test_table').all();
    console.log('✓ 查询数据成功:', result.results);
  } catch (error) {
    console.error('❌ 查询数据失败:', error);
    return { success: false, error: `Select failed: ${error.message}` };
  }

  // 6. 清理测试表
  try {
    await env.DB.prepare('DROP TABLE IF EXISTS test_table').run();
    console.log('✓ 清理测试表成功');
  } catch (error) {
    console.error('❌ 清理测试表失败:', error);
  }

  console.log('=== D1 诊断完成 ===');
  return { success: true, message: 'D1 数据库工作正常' };
}

// 如果你需要在本地测试，可以添加到 worker.js 的路由中
// 示例: 如果路径是 '/test/d1'，执行 testD1Connection(env)
