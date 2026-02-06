/**
 * 订阅套餐公开API
 */

/**
 * 获取已启用的订阅套餐列表（公开API）
 */
export async function handleGetPlans(request, env, ctx) {
  try {
    const db = env.DB;
    const result = await db.prepare(`
      SELECT * FROM subscription_plans
      WHERE is_enabled = 1
      ORDER BY sort_order, id
    `).all();

    const plans = result.results || [];
    const formattedPlans = plans.map(p => ({
      id: p.id,
      name: p.name,
      name_en: p.name_en,
      days: p.days,
      base_price: parseFloat(p.base_price),
      price_per_ip: parseFloat(p.price_per_ip),
      discount: p.discount
    }));

    return new Response(JSON.stringify({
      success: true,
      plans: formattedPlans
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Plans API] Get plans error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
