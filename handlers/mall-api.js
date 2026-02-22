// 商城管理 API - 支付方式管理
import { createTables } from '../database.js';

/**
 * 获取所有支付方式
 */
export async function handleGetPaymentMethods(request, env) {
  try {
    const paymentMethods = await env.DB.prepare(`
      SELECT id, type, name, enabled, config, created_at, updated_at
      FROM payment_methods
      ORDER BY id
    `).all();

    return new Response(JSON.stringify({
      success: true,
      payment_methods: paymentMethods.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Mall] Get payment methods error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to load payment methods'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 创建支付方式
 */
export async function handleCreatePaymentMethod(request, env) {
  try {
    const body = await request.json();
    const { type, name, enabled, config } = body;

    // 验证必填字段
    if (!type || !name) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: type, name'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否已存在
    const existing = await env.DB.prepare('SELECT id FROM payment_methods WHERE type = ?').bind(type).first();

    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment method with this type already exists'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 插入新支付方式
    const configJson = config ? JSON.stringify(config) : '{}';

    await env.DB.prepare(`
      INSERT INTO payment_methods (type, name, enabled, config)
      VALUES (?, ?, ?, ?)
    `).bind(type, name, enabled ? 1 : 0, configJson).run();

    console.log('[Mall] Payment method created:', type, name);

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment method created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Mall] Create payment method error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create payment method'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 更新支付方式
 */
export async function handleUpdatePaymentMethod(request, env) {
  try {
    const body = await request.json();
    const { id, name, enabled, config } = body;

    // 验证必填字段
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required field: id'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否存在
    const existing = await env.DB.prepare('SELECT id FROM payment_methods WHERE id = ?').bind(id).first();

    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment method not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 构建更新 SQL
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (enabled !== undefined) {
      updates.push('enabled = ?');
      values.push(enabled ? 1 : 0);
    }

    if (config !== undefined) {
      updates.push('config = ?');
      values.push(JSON.stringify(config));
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No fields to update'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    updates.push('updated_at = datetime("now")');
    values.push(id);

    await env.DB.prepare(`
      UPDATE payment_methods
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values).run();

    console.log('[Mall] Payment method updated:', id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment method updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Mall] Update payment method error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update payment method'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 删除支付方式
 */
export async function handleDeletePaymentMethod(request, env) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameter: id'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 删除支付方式
    await env.DB.prepare('DELETE FROM payment_methods WHERE id = ?').bind(id).run();

    console.log('[Mall] Payment method deleted:', id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment method deleted successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Mall] Delete payment method error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete payment method'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 获取商城设置
 */
export async function handleGetMallSettings(request, env) {
  try {
    const settings = await env.DB.prepare(`
      SELECT key, value FROM mall_settings
    `).all();

    const settingsObj = {};
    (settings.results || []).forEach(row => {
      settingsObj[row.key] = row.value;
    });

    return new Response(JSON.stringify({
      success: true,
      settings: settingsObj
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Mall] Get settings error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to load mall settings'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 更新商城设置
 */
export async function handleUpdateMallSettings(request, env) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid settings object'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新每个设置
    for (const [key, value] of Object.entries(settings)) {
      const existing = await env.DB.prepare('SELECT id FROM mall_settings WHERE key = ?').bind(key).first();

      if (existing) {
        await env.DB.prepare(`
          UPDATE mall_settings
          SET value = ?, updated_at = datetime("now")
          WHERE key = ?
        `).bind(String(value), key).run();
      } else {
        await env.DB.prepare(`
          INSERT INTO mall_settings (key, value)
          VALUES (?, ?)
        `).bind(key, String(value)).run();
      }
    }

    console.log('[Mall] Settings updated');

    return new Response(JSON.stringify({
      success: true,
      message: 'Settings updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Mall] Update settings error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update settings'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
