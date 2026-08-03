# VIP体验卡系统 / VIP Experience Card System

## 概述 / Overview

VIP体验卡授予临时VIP访问权限。体验卡通过签到里程碑获得或使用收视币兑换。

---

## 一、发放和领取时机 / Grant & Claim Timing

### 1.1 自动发放（签到里程碑）

| 连续签到天数 | 体验卡类型 | 时长 | 发放方式 |
|------------|-----------|------|----------|
| 10天 | checkin_gift | 14天（2周） | 自动发放 + 自动激活 |
| 20天 | - | 无体验卡 | 仅显示进度 |
| 30天 | checkin_gift | 30天（1个月） | 自动发放 + 自动激活 |

**发放触发时机**：用户完成第10天/第30天签到时，系统自动：
1. 创建体验卡记录（`is_activated=1`, `activated_at=now()`）
2. 更新用户VIP过期时间（累加到现有VIP时间后面）

### 1.2 手动兑换（收视币）

| 兑换条件 | 体验卡类型 | 时长 | 发放方式 |
|----------|-----------|------|----------|
| 30收视币 | exchange_gift | 30天 | 用户手动激活 |

**兑换触发时机**：用户在收视币页面点击"兑换VIP"
- 前提：用户余额 ≥ 30收视币
- 结果：创建体验卡（`is_activated=0`, `expired_at=granted_at+30天`）
- 用户需手动选择激活时间（激活后VIP立即生效）

---

## 二、显示和交互位置 / Display & Interaction Locations

### 2.1 VIP体验卡显示位置

```
账户页面（/account）
├── VIP状态区域
│   ├── VIP有效：显示到期倒计时 + 体验卡来源标签
│   └── VIP无效：显示"获取VIP"入口
├── 体验卡TAB
│   ├── 当前有效体验卡列表（带激活按钮）
│   ├── 待激活体验卡（exchange_gift类型，需用户激活）
│   └── 历史体验卡（已过期/已使用）
└── 签到页面（/check-in）
    └── 签到成功后：弹窗显示"获得2周VIP体验卡"（10天触发）
```

### 2.2 交互流程

**签到奖励体验卡（自动激活）**：
```
用户签到 → 连续天数达到10 → 弹窗"恭喜获得2周VIP体验卡" → 立即激活 → 跳转到账户页面查看
```

**兑换体验卡（手动激活）**：
```
用户打开账户页面 → 点击"收视币" TAB → 查看余额30币
→ 点击"立即兑换" → 弹出确认框"消耗30收视币，兑换1个月VIP"
→ 确认 → 创建待激活体验卡 → 显示"体验卡已发放，请在有效期内激活"
→ 用户点击"激活" → VIP立即生效 → 到期时间更新
```

---

## 三、数据结构 / Data Structure

### vip_experience_cards 表

```sql
CREATE TABLE vip_experience_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  card_type TEXT NOT NULL,           -- 'checkin_gift' / 'exchange_gift'
  source TEXT NOT NULL,              -- '连续签到10天' / '连续签到30天' / '30收视币兑换'
  days INTEGER NOT NULL,            -- 有效期天数
  granted_at DATETIME NOT NULL,      -- 获得时间
  expired_at DATETIME NOT NULL,     -- 到期时间（granted_at + days）
  is_activated INTEGER DEFAULT 0,  -- 0=待激活，1=已激活，2=已使用
  activated_at DATETIME,            -- 激活时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, card_type, granted_at)
);

CREATE INDEX idx_vip_cards_user ON vip_experience_cards(user_id);
CREATE INDEX idx_vip_cards_status ON vip_experience_cards(user_id, is_activated, expired_at);
```

---

## 四、VIP体验卡激活逻辑 / Activation Logic

```javascript
// 激活体验卡时
async function activateCard(cardId, userId, db) {
  const card = await db.prepare(
    'SELECT * FROM vip_experience_cards WHERE id = ? AND user_id = ?'
  ).bind(cardId, userId).first();
  
  if (!card) return { success: false, error: '体验卡不存在' };
  if (card.is_activated === 1) return { success: false, error: '体验卡已激活' };
  if (new Date(card.expired_at) < new Date()) return { success: false, error: '体验卡已过期' };
  
  const now = new Date();
  const currentExpiry = user.vip_expired_at ? new Date(user.vip_expired_at) : now;
  
  // 累加到现有VIP时间后面（如果当前VIP已过期，则从现在计算）
  const newExpiry = new Date(currentExpiry > now ? currentExpiry : now);
  newExpiry.setDate(newExpiry.getDate() + card.days);
  
  // 原子更新：用户体验卡状态 + 用户VIP时间
  await db.batch([
    db.prepare('UPDATE vip_experience_cards SET is_activated = 1, activated_at = ? WHERE id = ?')
      .bind(now.toISOString(), cardId),
    db.prepare('UPDATE users SET vip_expired_at = ? WHERE id = ?')
      .bind(newExpiry.toISOString(), userId)
  ]);
  
  return { success: true, vip_expired_at: newExpiry.toISOString() };
}
```

---

## 五、API端点 / API Endpoints

### GET /api/vip/cards

返回用户所有体验卡和当前VIP状态。

**响应:**
```json
{
  "success": true,
  "current_vip": {
    "is_active": true,
    "expires_at": "2026-05-15T00:00:00Z",
    "source": "experience_card",
    "remaining_days": 11
  },
  "cards": [
    {
      "id": 1,
      "type": "checkin_gift",
      "source": "连续签到10天",
      "days": 14,
      "status": "active",
      "granted_at": "2026-05-01T00:00:00Z",
      "expired_at": "2026-05-15T00:00:00Z",
      "activated_at": "2026-05-01T00:00:00Z"
    },
    {
      "id": 2,
      "type": "exchange_gift",
      "source": "30收视币兑换",
      "days": 30,
      "status": "pending_activation",
      "granted_at": "2026-05-04T00:00:00Z",
      "expired_at": "2026-06-03T00:00:00Z",
      "activated_at": null
    }
  ]
}
```

### POST /api/vip/cards/:id/activate

激活待激活的体验卡（仅exchange_gift类型）。

**前置条件：**
- 体验卡 `is_activated = 0`
- 体验卡 `expired_at > now()`
- 用户当前VIP时间将更新

**响应:**
```json
{
  "success": true,
  "message": "体验卡激活成功",
  "vip_expired_at": "2026-06-03T00:00:00Z",
  "remaining_days": 30
}
```

### POST /api/vip/redeem

使用收视币兑换VIP体验卡。

**前置条件：**
- 用户余额 ≥ 30收视币

**响应:**
```json
{
  "success": true,
  "message": "兑换成功，请在有效期内激活",
  "card": {
    "id": 3,
    "type": "exchange_gift",
    "days": 30,
    "expired_at": "2026-06-03T00:00:00Z"
  }
}
```

---

## 六、业务规则 / Business Rules

1. **签到奖励体验卡**：获得时立即自动激活，无需用户操作
2. **兑换体验卡**：用户需手动激活（获得后30天内）
3. **体验卡叠加**：多个体验卡的时长累加到现有VIP时间后面
4. **不可重复激活**：已处于有效期内的体验卡无法重复激活
5. **过期体验卡**：过期后 `is_activated` 保持为1（已使用），仅更新 `expired_at` 状态
6. **VIP单一真理源**：`users.vip_expired_at` 是VIP状态的唯一判断依据
   - VIP判断：`vip_expired_at > now()` 即为VIP
   - 付费订阅购买时，自动更新 `vip_expired_at`
   - 体验卡激活时，累加天数到 `vip_expired_at`
   - `codes` 表仅作为订单记录，不再参与VIP判断

---

## 七、用户体验流程 / User Experience Flow

```
用户注册
    ↓
每日签到 → 连续天数累计
    ↓
第10天签到完成
    ↓
弹窗："🎉 恭喜获得2周VIP体验卡！"
    ↓
自动激活 → 显示VIP到期时间
    ↓
用户可在账户页面查看体验卡详情
```

```
用户有30收视币
    ↓
打开账户页面 → 点击"收视币"TAB
    ↓
点击"立即兑换"
    ↓
弹窗确认："消耗30收视币，兑换1个月VIP？"
    ↓
确认 → 创建待激活体验卡
    ↓
弹窗："体验卡已发放，请在6月3日前激活"
    ↓
用户点击"激活"
    ↓
VIP立即生效，到期时间更新为6月3日
```

---

## 八、验收标准 / Acceptance Criteria

- [ ] 签到第10天自动发放14天体验卡并立即激活
- [ ] 签到第30天自动发放30天体验卡并立即激活
- [ ] 30收视币兑换创建待激活体验卡
- [ ] 用户可手动激活待激活体验卡
- [ ] 多个体验卡时长正确累加
- [ ] VIP状态判断同时考虑体验卡和付费订阅
- [ ] 体验卡列表正确显示（active/pending_activation/used/expired）
- [ ] 弹窗通知用户获得体验卡（签到奖励时）
- [ ] 账户页面显示VIP到期倒计时