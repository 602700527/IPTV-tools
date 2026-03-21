# 设计文档：IP直连播放启用/禁用功能

**日期**：2026-03-22
**状态**：已确认

## 1. 功能概述

在管理后台"系统设置"tab添加"启用IP直连播放"开关，关闭后播放页面的播放功能被禁用。

**目的**：合规需求，关闭在线播放功能。

## 2. 实现范围

| 文件 | 改动说明 |
|------|----------|
| `database.js` | 添加 `enable_ip_play` 默认配置项 |
| `admin-page.js` | 系统设置tab添加开关UI + 加载/保存函数 |
| `playstation-page.js` | 根据配置决定是否禁用播放按钮和hover动画 |

## 3. 配置项

| Key | 默认值 | 类型 | 说明 |
|-----|--------|------|------|
| `enable_ip_play` | `true` | boolean | `true`=启用，`false`=禁用 |

**存储位置**：`settings` 表

## 4. UI设计

### 4.1 管理后台 - 系统设置Tab

**位置**：管理后台 → 系统设置

**新增开关**：
- 开关名称：启用IP直连播放
- 开关ID：`enableIpPlay`
- 帮助文本：关闭后，用户将无法使用直连播放功能
- 默认状态：开启（checked）

### 4.2 播放页面 - 禁用行为

当 `enable_ip_play = false` 时：

| 元素 | 行为 |
|------|------|
| 播放按钮 | `disabled` 状态 |
| 频道hover动画 | 播放按钮不显示 |

## 5. 数据流

```
用户访问 /?play={link_id}
    ↓
playstation-page.js 加载
    ↓
调用 /admin/system-config 获取配置
    ↓
检查 enable_ip_play 值
    ↓
enable_ip_play = false
    ↓
禁用播放按钮 + 禁用hover动画
```

## 6. 详细实现

### 6.1 database.js

在 `defaultSettings` 对象中添加：
```javascript
'enable_ip_play': 'true',
```

### 6.2 admin-page.js

**HTML**：在系统设置tab中添加开关：
```html
<div class="form-group">
  <label style="display:flex;align-items:center;gap:8px;">
    <input type="checkbox" id="enableIpPlay" checked style="width:auto;">
    <span>启用IP直连播放</span>
  </label>
  <small style="color:#86868b;font-size:12px;">关闭后，用户将无法使用直连播放功能</small>
</div>
```

**JavaScript**：
- `loadSystemConfig()`：加载配置时设置 checkbox 状态
- `saveSystemConfig()`：保存配置时收集 `enableIpPlay` 的值

### 6.3 playstation-page.js

**页面加载时**：
1. 调用 `/admin/system-config` 获取配置
2. 检查 `enable_ip_play` 值
3. 如为 `false`：
   - 禁用所有播放按钮（添加 `disabled` 属性）
   - 移除或禁用 hover 时显示播放按钮的动画

**具体实现**：
- 播放按钮添加 `disabled` 属性
- CSS 中 `.channel-item:hover .play-overlay` 或类似选择器，当配置禁用时不显示

## 7. 用户流程

### 启用状态（默认）
1. 管理员在"系统设置"中开启"启用IP直连播放"
2. 用户访问播放页面
3. 频道hover时显示播放按钮
4. 点击播放按钮正常播放

### 禁用状态
1. 管理员在"系统设置"中关闭"启用IP直连播放"
2. 用户访问播放页面
3. 播放按钮显示为禁用状态
4. 频道hover时不显示播放按钮动画
5. 用户无法触发播放

## 8. 测试要点

1. 开关默认应为开启状态
2. 关闭开关后，刷新播放页面验证按钮已禁用
3. 关闭开关后，hover频道不应显示播放按钮
4. 重新开启开关后，功能恢复正常
5. 配置应持久化保存
