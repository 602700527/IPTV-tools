# IP直连播放启用/禁用功能 - 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在管理后台"系统设置"添加开关，控制播放页面（playstation-page）的直连播放功能

**Architecture:** 
- 配置项 `enable_ip_play` 存储在 `settings` 表
- 前端通过 `/admin/system-config` API 获取配置
- 禁用时：播放按钮禁用 + hover动画隐藏

**Tech Stack:** Cloudflare Workers (D1数据库), 原生JavaScript (无框架)

---

## Chunk 1: 数据库配置项

**Files:**
- Modify: `database.js:199-228` (defaultSettings)
- Modify: `database.js:983-1034` (getSystemConfig)
- Modify: `database.js:1088-1150` (updateSystemConfig)

- [ ] **Step 1: 添加 enable_ip_play 到默认配置**

在 `database.js` 第227行 `sync_filter_config` 之前添加：
```javascript
// IP直连播放配置
'enable_ip_play': 'true',
```

- [ ] **Step 2: 更新 getSystemConfig 查询**

在 `database.js` 第985行，SQL查询中添加 `'enable_ip_play'`：
```javascript
const settings = await db.prepare('SELECT key, value FROM settings WHERE key IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  .bind('enable_ref_check', 'ref_whitelist', 'enable_play_token', 'play_token_expire_seconds', 'homepage_display_config', 'enable_ip_bind', 'enable_burn_after_read', 'enable_url_encryption', 'url_encryption_key', 'enable_anti_debug', 'disable_console_logs', 'enable_ip_play')
```

- [ ] **Step 3: 添加 enable_ip_play 到返回对象**

在 `database.js` 第1000行 `disable_console_logs: false` 后添加：
```javascript
enable_ip_play: true
```

- [ ] **Step 4: 添加 enable_ip_play 解析逻辑**

在 `database.js` 第1030行 `} else if (row.key === 'disable_console_logs') {` 之后添加：
```javascript
} else if (row.key === 'enable_ip_play') {
  config.enable_ip_play = row.value === 'true';
}
```

- [ ] **Step 5: 添加 enable_ip_play 更新逻辑**

在 `database.js` 第1149行 `disable_console_logs` 处理之后添加：
```javascript
if (config.enable_ip_play !== undefined) {
  await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
    .bind(config.enable_ip_play.toString(), 'enable_ip_play')
    .run();
}
```

- [ ] **Step 6: 提交**

```bash
git add database.js
git commit -m "feat: add enable_ip_play config option"
```

---

## Chunk 2: 管理后台UI开关

**Files:**
- Modify: `admin-page.js:999-1011` (开关HTML)
- Modify: `admin-page.js:3616-3625` (loadSystemConfig)
- Modify: `admin-page.js:3640-3649` (saveSystemConfig)

- [ ] **Step 1: 添加开关HTML**

在 `admin-page.js` 第1011行 `</div>` 之前，在"调试防护"区块之后添加：
```html
<div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5ea;">
  <h4 style="margin-bottom:16px;color:#000;font-size:16px;">📺 直连播放设置</h4>
  <div style="margin-bottom:16px;">
    <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
      <input type="checkbox" id="enableIpPlay" checked style="margin-right:12px;">
      <span style="font-size:14px;">启用IP直连播放</span>
    </label>
    <p style="margin-top:8px;color:#86868b;font-size:12px;">关闭后，用户将无法使用直连播放功能</p>
  </div>
</div>
```

- [ ] **Step 2: 更新 loadSystemConfig**

在 `admin-page.js` 第3625行 `disableConsoleLogs` 之后添加：
```javascript
document.getElementById('enableIpPlay').checked = data.config.enable_ip_play !== undefined ? data.config.enable_ip_play : true;
```

- [ ] **Step 3: 更新 saveSystemConfig**

在 `admin-page.js` 第3649行 `disable_console_logs: document.getElementById('disableConsoleLogs').checked` 之后添加：
```javascript
enable_ip_play: document.getElementById('enableIpPlay').checked
```

- [ ] **Step 4: 提交**

```bash
git add admin-page.js
git commit -m "feat: add enable/disable IP direct play toggle in admin settings"
```

---

## Chunk 3: 播放页面功能实现

**Files:**
- Modify: `playstation-page.js:405-406` (CSS)
- Modify: `playstation-page.js:1629-1657` (页面初始化)
- Modify: `playstation-page.js:2257-2266` (renderChannels)
- Modify: `playstation-page.js:2379-2388` (handleChannelClick)

- [ ] **Step 1: 添加全局配置变量**

在 `playstation-page.js` 第1614行附近（其他 let 变量区域）添加：
```javascript
let enableIpPlay = true;  // IP直连播放开关
```

- [ ] **Step 2: 修改CSS隐藏play-overlay**

将 `playstation-page.js` 第405-406行：
```css
.play-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
.channel-card:hover .play-overlay{opacity:1}
```

改为：
```css
.play-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
.channel-card:hover .play-overlay{opacity:1}
.play-overlay.disabled{display:none!important}
```

- [ ] **Step 3: 页面初始化时获取配置**

在 `playstation-page.js` 第1638行 `} catch (error) {` 之后添加：
```javascript
// 获取IP直连播放配置
try {
  const configRes = await fetch('/admin/system-config', {
    headers: { 'X-Admin-Key': adminKey }
  });
  const configData = await configRes.json();
  if (configData.success && configData.config) {
    enableIpPlay = configData.config.enable_ip_play !== false;
  }
} catch (error) {
  console.error('[Init] 获取直连播放配置失败:', error);
}
```

同时在第1635行 `updateEncryptionKey();` 之前获取 adminKey：
```javascript
// 获取管理员密钥（用于获取系统配置）
const adminKey = localStorage.getItem('admin_key') || '';
```

- [ ] **Step 4: 修改renderChannels隐藏play-overlay**

在 `playstation-page.js` 第2264行 `<div class="play-overlay">` 改为：
```javascript
<div class="play-overlay ${enableIpPlay ? '' : 'disabled'}">
```

- [ ] **Step 5: 修改handleChannelClick禁用播放**

在 `playstation-page.js` 第2379行 `function handleChannelClick` 中，添加检查：
```javascript
function handleChannelClick(event, hash, name, group) {
  // 如果IP直连播放已禁用，忽略点击
  if (!enableIpPlay) {
    return;
  }
  
  // 添加点击高亮效果
  const card = event.currentTarget;
  card.classList.add('click-highlight');
  setTimeout(() => {
    card.classList.remove('click-highlight');
  }, 300);

  // 播放频道
  playChannel(hash, name, group);
}
```

- [ ] **Step 6: 提交**

```bash
git add playstation-page.js
git commit -m "feat: disable IP direct play when enable_ip_play config is false"
```

---

## 测试验证

- [ ] **Test 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Test 2: 管理后台验证**

1. 访问 `http://localhost:8787/admin`
2. 进入"系统设置"tab
3. 确认"启用IP直连播放"开关存在且默认开启
4. 关闭开关并保存
5. 刷新页面，确认开关保持关闭状态

- [ ] **Test 3: 播放页面验证**

1. 访问播放页面 `http://localhost:8787/`
2. 确认频道hover时显示播放按钮
3. 在管理后台关闭"启用IP直连播放"
4. 刷新播放页面
5. 确认：
   - 频道hover时不显示播放按钮
   - 点击频道无反应（不触发播放）

- [ ] **Test 4: 重新启用验证**

1. 在管理后台开启"启用IP直连播放"
2. 刷新播放页面
3. 确认播放功能恢复正常
