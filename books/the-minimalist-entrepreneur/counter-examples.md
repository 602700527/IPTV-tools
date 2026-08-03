# 反例库 — The Minimalist Entrepreneur

> 来自 Sahil Lavingia《The Minimalist Entrepreneur》的失败模式 / 反例 / 陷阱,用于约束下游正面 skill 的适用范围。

## 目录

- [ce01 — VC 驱动的"成长即一切"陷阱](#ce01)
- [ce02 — 把用户卖给广告主而非卖给用户](#ce02)
- [ce03 — 在产品上烧 VC 钱,误以为是赛道问题](#ce03)
- [ce04 — 用"高估值 = 成功"绑架自我价值](#ce04)
- [ce05 — 跳过社区,直奔"我能做什么产品"](#ce05)
- [ce06 — 越过客户,直接问"你愿意付钱吗"](#ce06)
- [ce07 — 先写代码,再做客户访谈](#ce07)
- [ce08 — 死磕技术方案,忽视已浮现的非技术方案](#ce08)
- [ce09 — 追求"盛大发布"而非"先卖给 100 个人"](#ce09)
- [ce10 — 用钱而不是用时间买增长](#ce10)
- [ce11 — 等产品"完美"才上线](#ce11)
- [ce12 — 创始人变成产品独裁者 / 企业文化的单点故障](#ce12)
- [ce13 — 用 ad 之外的"增长黑客"找客户](#ce13)
- [ce14 — 跳过"动手能力"环节,直接外包或自动化](#ce14)
- [ce15 — 把不相关的爱好者硬凑成社区](#ce15)
- [ce16 — 假装"教育"实则"说服"](#ce16)
- [ce17 — 把"寒暄/支持"等同于"潜在付费用户"](#ce17)
- [ce18 — 只做创始人账户,不做公司账户](#ce18)
- [ce19 — 等 PMF 之后才定价](#ce19)
- [ce20 — 把品牌营销等同于广告](#ce20)
- [ce21 — 业绩增长后开始松手花钱](#ce21)
- [ce22 — 雇人/扩张时跳过"痛到不得不雇"的临界点](#ce22)
- [ce23 — 在文化未定义前就开始雇人](#ce23)
- [ce24 — 等"自然长出"企业文化](#ce24)
- [ce25 — 把创业等同于身份](#ce25)

---

<a id="ce01"></a>
## ce01 — VC 驱动的"成长即一切"陷阱

```yaml
- id: ce01
  title: VC 驱动的"成长即一切"陷阱
  type: counter-example
  source_chapter: Introduction / Chapter 1
  source_quote: |
    "Gumroad's pitched flight into the stratosphere leveled off after we burned
    through about $10 million in venture capital. After nine months of trying
    to raise more funding, we failed. In October 2015, I laid off three-quarters
    of the staff."
  failure_mode: |
    把 VC 的回报模型(必须出现 10x-100x 的赢家)内化为公司目标,导致产品
    路线、招聘速度、定价策略全部围绕"如何尽快做大"运转——牺牲利润、用户
    体验与可持续性。最终当 VC 资金断流时,公司既无客户黏性也无现金流。
  mechanism: |
    VC 资金的"电击效应":账面有钱时,失败被掩盖→团队误以为"我们正在
    接近成功"→继续加注增长而非验证 PMF→一旦烧光,既无客户付费意愿,
    也无内部求生本能。VC 的成功概率模型(70% 失败,5% 撑起整盘)天然
    与单个创业者的"我想做成一件事"的目标对立。
  warning_signs:
    - 你发现自己在做"投资人想听的故事",而非"客户想买的产品"
    - 月增长指标比月利润指标让你更焦虑
    - 你开始回避和客户一对一谈话,因为"那不 scale"
    - 招聘计划的依据是"下轮融资需要这个规模",而非"我们真的需要这个人"
  bound_to:
    - "s01-盈利优先财务模型" — 必须先回答"不融资我能不能活",否则利润只是口号
    - "s05-真实性营销" — 一旦被 VC 估值绑架,真实故事就被替换为"增长叙事"
    - "s07-VC vs Bootstrap 决策框架" — 此反例是该决策的核心输入
  tags: [counter-example, vc-trap, growth-at-all-costs]
```

---

<a id="ce02"></a>
## ce02 — 把用户卖给广告主而非卖给用户

```yaml
- id: ce02
  title: 把用户卖给广告主而非卖给用户
  type: counter-example
  source_chapter: Chapter 1
  source_quote: |
    "Minimalist entrepreneurs aim to be profitable from day one or soon after,
    because profit is oxygen for businesses. And they do that by selling a
    product to customers, not by selling their users to advertisers."
  failure_mode: |
    用广告作为主要变现方式,等于把"客户注意力"商品化。用户越多越廉价
    产品就越被扭曲——优化点击率、追踪行为、滥用数据——同时真正的痛点
    没人在乎,因为广告主才是"客户",用户只是库存。
  mechanism: |
    广告模式的两条隐性扭曲:(1) 收入与"用户被分心的程度"成正比,
    导致产品体验越糟反而收入越高;(2) 用户从"付费者"变成"被出售的
    资产",创业者对用户的同理心被切断。一旦形成正反馈,任何"用户体验
    改进"都会被广告团队否决。
  warning_signs:
    - 你开始说"用户量是核心 KPI"而不是"付费客户数"
    - 你花了大量时间优化推荐算法/推送通知,但不改进产品本身
    - 你的客户访谈里,用户说"我讨厌这个 app 但又离不开"
  bound_to:
    - "s04-创始人亲售" — 一旦广告变现,创始人就不再亲自面对付费客户的反馈
    - "s08-小企业企业文化" — 广告模式下"客户"是广告主,文化会被营销扭曲
  tags: [counter-example, business-model, ad-tech]
```

---

<a id="ce03"></a>
## ce03 — 在产品上烧 VC 钱,误以为是赛道问题

```yaml
- id: ce03
  title: 在产品上烧 VC 钱,误以为是赛道问题
  type: counter-example
  source_chapter: Introduction
  source_quote: |
    "Gumroad may have been a crappy investment for a few venture capitalists,
    but it was still a great company for its customers."
  failure_mode: |
    把"投资人不想再投"误读为"这个市场太小/赛道不行",进而要么放弃
    真实在运转的业务,要么追逐下一个热点。错位的指标让人看不见眼前
    正在产生现金流的生意。
  mechanism: |
    VC 投资人用的是"基金回报"视角(需要 10x+ 退出),而创业者错用了
    同一把尺子去衡量自己的公司。当产品已经盈利、用户喜爱时,创业者
    仍然觉得"我不合格,因为我没做成独角兽"——这是典型的指标错配
    (proxy misalignment)。
  warning_signs:
    - 你的产品已经有付费客户、现金流为正,但你仍然焦虑"市场是不是太小"
    - 你开始认真考虑"是不是该转方向"
    - 你在投资人的 pitch 框架里否定自己的真实业务
  bound_to:
    - "s01-盈利优先财务模型" — 验证该模型的标准必须是"客户愿不愿付费",不是"VC 愿不愿投"
    - "s07-VC vs Bootstrap 决策框架" — 这是决策框架的核心:同一指标对 VC 与对创业者的含义不同
  tags: [counter-example, vc-trap, proxy-misalignment]
```

---

<a id="ce04"></a>
## ce04 — 用"高估值 = 成功"绑架自我价值

```yaml
- id: ce04
  title: 用"高估值 = 成功"绑架自我价值
  type: counter-example
  source_chapter: Introduction / Chapter 6
  source_quote: |
    "Companies like mine may not grace the covers of glossy magazines or
    inspire Hollywood biopics... I know that now, but it took me years to
    decouple my self-worth from my net worth and to realize that I hadn't
    failed. I had succeeded."
  failure_mode: |
    把公司估值/融资金额当作个人成就的代理指标。一旦公司"没做成独角兽",
    创业者陷入抑郁、羞耻、逃避——即便业务本身健康、用户喜爱、现金流为正。
  mechanism: |
    媒体 + 同辈压力的反馈环路:科技媒体只报道"赢家",社交圈在衡量
    "谁融了 A 轮"。创业者把外部评价当作身份认证。当结果不符合预期时,
    触发"冒充者综合征"和"失败者叙事",可能让人放弃本应继续经营的业务。
  warning_signs:
    - 你把"VC 关注度"看得比"客户满意度"更重
    - 你在派对上回避"你的公司融了多少"的问题
    - 你开始羡慕同辈的估值,而忘了回头看你自己的用户
  bound_to:
    - "s01-盈利优先财务模型" — 需要建立"对自己有用的 KPI",而非"媒体爱看的 KPI"
    - "s05-真实性营销" — 一旦自我价值与估值绑定,真实分享就被替换为"包装"
  tags: [counter-example, psychology, identity]
```

---

<a id="ce05"></a>
## ce05 — 跳过社区,直奔"我能做什么产品"

```yaml
- id: ce05
  title: 跳过社区,直奔"我能做什么产品"
  type: counter-example
  source_chapter: Chapter 2
  source_quote: |
    "It's ironic to me how often people go around hoping to find a startup idea
    while simultaneously complaining about all the everyday stuff around them
    that doesn't work properly. 'Sure, I could solve that for people with a
    little effort, but the potential market just isn't big enough to really
    scale.' That's the kind of thinking that this book seeks to address."
  failure_mode: |
    用"市场规模"和"技术酷不酷"来筛选 idea,而不是用"我身边谁在为这事
    痛苦"。结果做出没人买的产品,然后用"市场教育"作为借口,烧钱做营销。
  mechanism: |
    硅谷叙事的"市场优先"教育:YC、a16z 不断强化"找大市场→做大产品
    →拿到大份额"的路径。这让创业者对"小但真实"的痛点视而不见,因为
    它们"不够性感"。再加上"我朋友也用这个"的样本偏差,让人误以为
    痛点是普遍需求。
  warning_signs:
    - 你的 idea 来自"市场研究报告",而非"朋友的抱怨"
    - 你无法在 5 分钟内描述出 3 个具体可联系的潜在客户
    - 你的目标市场是"所有人",而不是某个具体的人群
  bound_to:
    - "s02-社区发现与验证" — 该 skill 的前提是"你已经属于某个社区",此反例是它的反面镜像
    - "s03-MVP 手动验证" — 跳过社区必然导致手动验证无人可问
  tags: [counter-example, idea-selection, market-first-thinking]
```

---

<a id="ce06"></a>
## ce06 — 越过客户,直接问"你愿意付钱吗"

```yaml
- id: ce06
  title: 越过客户,直接问"你愿意付钱吗"
  type: counter-example
  source_chapter: Chapter 3
  source_quote: |
    "When you are validating a hypothesis, do not ask leading questions—
    questions that point people to the answer you want to hear. Instead...
    you shouldn't ask: 'Would you pay for my product?' Instead, ask:
    'Why haven't you been able to fix this already?'"
  failure_mode: |
    用"假设性问题"做需求验证,客户出于礼貌、社交压力或想象场景说"会买",
    创业者据此投入工程资源,结果没人真的掏钱。
  mechanism: |
    The Mom Test 揭示的认知陷阱:客户的"想象购买"和"实际购买"是两件事。
    大脑默认对未来的自己过度乐观,且不愿意承认"我没有这个问题"。直接
    问付费意愿,得到的是社交信号,不是购买信号。
  warning_signs:
    - 你的市场调研问卷里出现"如果有一个产品 X,你愿意付多少钱?"
    - 你没看过任何潜在客户"为同类问题"已经花过钱
    - 你把"潜在客户说很感兴趣"等同于"会付费"
  bound_to:
    - "s03-MVP 手动验证" — 验证的方式必须是"看见真实的人花钱"
    - "s04-创始人亲售" — 一对一销售本身就是最好的验证,绕过此反例
  tags: [counter-example, validation, mom-test]
```

---

<a id="ce07"></a>
## ce07 — 先写代码,再做客户访谈

```yaml
- id: ce07
  title: 先写代码,再做客户访谈
  type: counter-example
  source_chapter: Chapter 3
  source_quote: |
    "Many people miss this step, falter, and ultimately fail because they go
    straight from problem to product before learning exactly what and how to
    build. But processizing is a cheap, quick discovery process that is
    essential."
  failure_mode: |
    沉迷于"先把产品做出来再说",把代码当作思考的替代品。结果做出来
    的不是客户要的,然后用"功能不够好"为借口继续堆功能,陷入
    building forever 的死循环。
  mechanism: |
    工程师最容易掉进的陷阱:把"做出来"等同于"在学习"。事实上,在
    没和客户聊过之前,做的所有东西都是猜测。代码越精致,沉没成本越
    越高,改方向的代价越大,反而越难承认"我错了"。
  warning_signs:
    - 你的工作时间中"和客户聊"占比低于 20%
    - 你能详细说出技术架构,但说不出 3 个具体客户的姓名
    - 你把"还没做完"当作"还没开始销售"的借口
  bound_to:
    - "s03-MVP 手动验证" — 该 skill 的核心是"手动先于代码"
    - "s04-创始人亲售" — 创始人应该在卖东西,而不是在写代码
  tags: [counter-example, engineering-mindset, building-fallacy]
```

---

<a id="ce08"></a>
## ce08 — 死磕技术方案,忽视已浮现的非技术方案

```yaml
- id: ce08
  title: 死磕技术方案,忽视已浮现的非技术方案
  type: counter-example
  source_chapter: Chapter 3 (Interintellect 案例)
  source_quote: |
    "'I was hell-bent on building technology,' she says, and the whole endeavor
    had been so expensive and time-consuming that she was reluctant to abandon
    it. But in the meantime, she was organizing in-person salons where people
    could share their opinions and ideas. She didn't consider these gatherings
    to be a business, but she knew she had inadvertently created the vibrant
    intellectual community she had been seeking."
  failure_mode: |
    沉没成本陷阱 + 身份认同陷阱:工程师/产品经理把"用技术解决问题"
    当作身份,即使面前已经出现了一个明显可行的人工方案(沙龙),仍然
    拒绝承认,继续追加投入。
  mechanism: |
    双层心理: (1) 沉没成本谬误——"我已经投了两年,放弃就是浪费";
    (2) 身份保护——"如果不用技术,我就不是工程师/创业者"。结果是
    客户的需求被忽视,解决方案变成"我想做的东西"而非"客户要的"。
  warning_signs:
    - 你在做的产品和用户实际解决该问题的方式完全不同
    - 你能列出 5 个理由解释"为什么用户最终会用我的产品",但他们现在没用
    - 你听到客户反馈"我自己手动 X 也行"时,感到被冒犯
  bound_to:
    - "s03-MVP 手动验证" — 手动验证要求先承认"技术不是必需的"
    - "s02-社区发现与验证" — 客户的真实解决方案往往不在产品里
  tags: [counter-example, sunk-cost, identity, anna-got-case]
```

---

<a id="ce09"></a>
## ce09 — 追求"盛大发布"而非"先卖给 100 个人"

```yaml
- id: ce09
  title: 追求"盛大发布"而非"先卖给 100 个人"
  type: counter-example
  source_chapter: Chapter 4
  source_quote: |
    "Lots of businesses go this route... There's probably a restaurant near
    you with a giant red sign pinned over its entrance reading grand opening...
    They're always opening, and grandly too!"
  failure_mode: |
    把"launch"当作商业里程碑,投入大量资源做发布会、产品演示、广告
    投放。但没有先手动卖给 100 个客户,产品尚未打磨。结果是"开业即
    关门",或者"第一天一堆好奇者,之后没人复购"。
  mechanism: |
    媒体叙事 + 完美主义 + 自我保护:创业故事被简化为"车库→launch→
    成功",创业者把"launch"当作终点仪式。同时,把 launch 推迟可以
    回避"产品不够好"的焦虑。Quibi 是这个反例的极端版——烧 $1.8B
    砸发布,6 个月关门。
  warning_signs:
    - 你的时间表是"3 月发布→拿 1000 用户",而不是"现在就开始卖"
    - 你在准备 demo video、press kit、launch page,但还没和真实用户谈过
    - 你害怕"产品还不够完美"被外人看见
  bound_to:
    - "s04-创始人亲售" — 亲售先于 launch
    - "s05-真实性营销" — 真实性营销的素材就是"先卖出去的那 100 个客户"
  tags: [counter-example, launch-fallacy, quibi-case]
```

---

<a id="ce10"></a>
## ce10 — 用钱而不是用时间买增长

```yaml
- id: ce10
  title: 用钱而不是用时间买增长
  type: counter-example
  source_chapter: Chapter 5
  source_quote: |
    "Most growth you see is paid for. So if you are jealous of someone's
    constant press and stratospheric growth, keep in mind that they are likely
    burning cash in order to acquire customers... It is quite literally growth
    at all costs."
  failure_mode: |
    用广告预算/付费推广"买"客户。一旦停止付费,客户立刻流失。这种
    模式让创业者误以为"我们做对了,只是需要更多预算",陷入"不烧就
    死、烧光也死"的循环。
  mechanism: |
    注意力经济 + 投资人压力 + 算法依赖:广告平台设计成"让你停不下来",
    投资人偏好"有增长故事"的标的,创业者把"广告能换来短期增长"误
    读为"我们的 PMF 没问题"。实际上,付费买来的客户和自然来的客户,
    留存率与 LTV 完全不同。
  warning_signs:
    - 你的获客成本(CAC)大于客户的 LTV,或者你根本不知道
    - 你停止投放的那一周,新增用户立刻跌 80%
    - 你把"广告预算花完"当作问题,而非"产品本身不够吸引人"
  bound_to:
    - "s05-真实性营销" — 该 skill 用"时间和故事"代替"钱和广告"
    - "s06-有节制地成长" — 反向约束"花钱买增长"
  tags: [counter-example, paid-growth, customer-acquisition]
```

---

<a id="ce11"></a>
## ce11 — 等产品"完美"才上线

```yaml
- id: ce11
  title: 等产品"完美"才上线
  type: counter-example
  source_chapter: Chapter 4
  source_quote: |
    "If you wait too long, if you endlessly iterate without showing your work
    to the world, you may feel productive even though you are slowly (or
    quickly) running out of runway."
  failure_mode: |
    完美主义/打磨强迫症:不停加 feature、refactor、重新设计,认为"还
    没准备好"。结果是用户从未看到产品,或者看到时市场已变。Sahil
    本人在 Gumroad 早期"花 4 小时做图标,如果有源文件能省一半时间"
    的痛点,如果没有"周末上线",永远不会被发现。
  mechanism: |
    完美主义的两层心理: (1) 害怕被拒绝——"产品不够好,用户会笑";
    (2) 沉迷于"舒适区"——打磨产品比面对真实市场反馈更可控。这种
    拖延看起来像"认真",实际是回避。
  warning_signs:
    - 你的产品已经"内部测试"超过 3 个月但没让真实用户用过
    - 你的 todo list 永远在加,从不删
    - 你最常说的话是"再迭代几个版本就好"
  bound_to:
    - "s03-MVP 手动验证" — 该 skill 的核心是"用最丑的版本去验证"
    - "s04-创始人亲售" — 销售先于完美
  tags: [counter-example, perfectionism, launch-procrastination]
```

---

<a id="ce12"></a>
## ce12 — 创始人变成产品独裁者 / 企业文化的单点故障

```yaml
- id: ce12
  title: 创始人变成产品独裁者 / 企业文化的单点故障
  type: counter-example
  source_chapter: Chapter 7
  source_quote: |
    "Don't be a product visionary--or, worse, a product dictator. Your company
    shouldn't be a cult of personality, building exclusively what you want on
    the timelines you decide. WeWork is one example of how that path leads to
    certain doom. Among the numerous excesses... one fascinating detail
    stands out. Even though WeWork's business has nothing to do with surfing,
    the board approved a $13 million investment in a company that made
    artificial wave pools because former CEO Adam Neumann is an avid surfer."
  failure_mode: |
    创始人把自己的个人偏好、品味、冲动当作公司决策的依据。一旦公司
    增长,这种"个人化决策"会被放大,造成资源错配和文化扭曲。
  mechanism: |
    三层病理: (1) 信息不对称——团队不敢挑战 CEO; (2) 模仿效应
    ——员工把"揣摩老板"当核心技能; (3) 董事会顺从——当公司高估值
    时,治理结构失效。结果是公司决策与"用户/员工/股东的最大利益"
    脱钩。
  warning_signs:
    - 重要决策频繁出现"因为 CEO 想要"的理由
    - 团队开会时无人反对你的意见
    - 你把"快速行动"的本能延伸到"不需要验证的领域"
  bound_to:
    - "s08-小企业企业文化设计" — 文化必须能反向约束创始人
    - "s07-VC vs Bootstrap 决策框架" — 高估值 + 弱治理 = 独裁放大器
  tags: [counter-example, governance, wework-case, cult-of-personality]
```

---

<a id="ce13"></a>
## ce13 — 用 ad 之外的"增长黑客"找客户

```yaml
- id: ce13
  title: 用 ad 之外的"增长黑客"找客户
  type: counter-example
  source_chapter: Chapter 4
  source_quote: |
    "My sense is that people who wish to reach customers some other way, like
    search engine optimization (SEO) or content marketing, are looking for an
    out. If that's you: Stop! It doesn't exist! Just hunker down and dedicate
    some time to finding people, reaching out to them personally via email,
    phone, whatever, and being okay with it sucking for a while."
  failure_mode: |
    把 SEO、内容营销、红人投放当作"绕过手动销售"的捷径,结果学到
    一堆增长技巧,但产品没人买,因为这些技巧替代不了"理解客户"和
    "获得第一个 100 个客户的真实反馈"。
  mechanism: |
    "Growth hacking"叙事的认知陷阱:把"找到客户"与"理解客户"混为一
    谈。SEO/内容营销能做的是"让已经存在需求的人找到你",但它不能
    创造需求,也不能验证你的产品是否真的解决了问题。如果产品本身
    不行,再多的流量也是漏斗上端的浪费。
  warning_signs:
    - 你花更多时间学 SEO/投放技巧,而不是和客户对话
    - 你的"营销漏斗"在"awareness"层很丰富,但"purchase"层是空的
    - 你把"增加网站流量"作为月度 OKR
  bound_to:
    - "s04-创始人亲售" — 亲售是其他所有营销的前提
    - "s05-真实性营销" — 该 skill 是建立在已有忠实客户基础上的放大器
  tags: [counter-example, growth-hacking, marketing-shortcut]
```

---

<a id="ce14"></a>
## ce14 — 跳过"动手能力"环节,直接外包或自动化

```yaml
- id: ce14
  title: 跳过"动手能力"环节,直接外包或自动化
  type: counter-example
  source_chapter: Chapter 3
  source_quote: |
    "Without processization, you may think you know what the customer actually
    wants, maybe even because the customer has told you what they want, and
    maybe even what they would pay for. But as Anna Gőt can tell us, talk is
    cheap. Until you get through the entire process of solving the customer's
    problem and (ultimately) receiving payment, you won't know what the
    customer wants and is willing to pay for."
  failure_mode: |
    直接外包、招人、做软件,跳过"创始人亲手做几遍"的过程。结果是
    对客户需求的理解只停留在二手信息,且 SOP 是设计出来的而非从实践中
    沉淀的,出错时无法快速修复。
  mechanism: |
    "看起来低效"的心理抗拒:创始人觉得"我做了就高级了"或"外包更快",
    但亲手做一遍的价值不在交付,而在建立对客户问题的体感。这种体感
    是后续所有规模化决策的 ground truth,缺了它,再贵的工具也救不回来。
  warning_signs:
    - 你雇了客服/运营/销售,但你从没亲自接待过一个客户
    - 你用 Zapier/Notion 模板搭建了 SOP,但你自己没跑过
    - 你无法详细描述"完成一次客户服务的 7 个步骤"
  bound_to:
    - "s03-MVP 手动验证" — 手动是 processizing 的起点
    - "s08-小企业企业文化" — 没亲自动手就招人,会雇到"不是你的人"
  tags: [counter-example, founder-distance, processizing]
```

---

<a id="ce15"></a>
## ce15 — 把不相关的爱好者硬凑成社区

```yaml
- id: ce15
  title: 把不相关的爱好者硬凑成社区
  type: counter-example
  source_chapter: Chapter 2 (Calendly 案例)
  source_quote: |
    "He tried again with a third startup, selling grills, but as he says, 'I
    didn't know anything about grills and I didn't want to! I lived in an
    apartment, and never even grilled.' Not only was he not part of the
    grilling community, but he didn't even want to be!"
  failure_mode: |
    为了"大市场"硬挑社区,创始人既不属于该社区,也不喜欢该社区。结果
    既做不出让用户喜欢的产品,也无法持续投入精力。
  mechanism: |
    "市场看起来很大 + 我能做什么"的反向选择:很多创业者把"市场规模"
    放在"个人热爱"前面,导致 idea 和创始人割裂。即便产品做出来了,
    创始人无法成为社区的"内部人",没法做内容营销、没法做产品决策、
    没法熬过 3-5 年社区建设的寂寞期。
  warning_signs:
    - 你不能列出 3 个你认识的"目标客户"的真实姓名
    - 你对目标客户的描述是人口统计特征,不是行为习惯
    - 你加入目标社区 6 个月了,仍然觉得"这些人在聊什么"
  bound_to:
    - "s02-社区发现与验证" — 社区必须是"你已经属于"的,而非"你想要打入的"
    - "s05-真实性营销" — 真实性要求创始人本人是社区的一部分
  tags: [counter-example, community-fit, tope-awotona-case]
```

---

<a id="ce16"></a>
## ce16 — 假装"教育"实则"说服"

```yaml
- id: ce16
  title: 假装"教育"实则"说服"
  type: counter-example
  source_chapter: Chapter 4
  source_quote: |
    "Never oversell. Be honest, open, and always kind. Show them how you most
    recently improved your product. Tell them a recent failing. Don't sell them
    on your product, educate them on your journey and learnings."
  failure_mode: |
    用"我教育了你"的外壳,实际在做"说服/操纵/夸大"。客户一旦识破,
    信任彻底崩塌,且创业者会陷入"必须不断加大说服力度"的螺旋。
  mechanism: |
    销售话术 vs 真实分享的界限模糊:创业者学会了一些话术(提问、倾听
    、共情),但内核仍然是"我要成交"。客户在长期互动中能感知真假
    ,一旦察觉,所有后续沟通都被污染。
  warning_signs:
    - 你的销售话术里出现"如果有的话,您是否会考虑..."
    - 你隐瞒产品已知问题,等客户自己发现
    - 你在客户反馈后第一反应是"怎么反驳",而非"他说的对吗"
  bound_to:
    - "s04-创始人亲售" — 该 skill 要求真实分享先于成交
    - "s05-真实性营销" — 真实性营销建立在"我愿意暴露失败"的基础上
  tags: [counter-example, dark-patterns, sales-integrity]
```

---

<a id="ce17"></a>
## ce17 — 把"寒暄/支持"等同于"潜在付费用户"

```yaml
- id: ce17
  title: 把"寒暄/支持"等同于"潜在付费用户"
  type: counter-example
  source_chapter: Chapter 5
  source_quote: |
    "Most people will not be a fit for your business. That's okay. Your audience
    will grow much larger than your customer base--but your customer base is
    a subset, likely the most passionate, of your audience."
  failure_mode: |
    把"喜欢我/支持我"等同于"会买我的产品"。实际上,绝大多数人
    支持你是因为喜欢你这个人、你的内容、你的价值观,但他们不一定
    需要/愿意付费买你的产品。结果误判市场规模,做出错误的商业决策。
  mechanism: |
    受众与客户的混淆:粉丝会点赞、转发、买书、参加直播,但不会买
    你的 B2B SaaS。需要明确区分"audience"与"customer",前者是
    注意力,后者是付费行为。
  warning_signs:
    - 你用"关注者/订阅者数量"作为业务健康的核心指标
    - 你惊讶地发现"粉丝那么多,为什么没人买"
    - 你把营销预算花在涨粉上,而不是转化率上
  bound_to:
    - "s05-真实性营销" — 受众是营销的入口,不是终点
    - "s06-有节制地成长" — 增长指标必须区分"audience growth"和"revenue growth"
  tags: [counter-example, audience-vs-customers, metric-confusion]
```

---

<a id="ce18"></a>
## ce18 — 只做创始人账户,不做公司账户

```yaml
- id: ce18
  title: 只做创始人账户,不做公司账户
  type: counter-example
  source_chapter: Chapter 5
  source_quote: |
    "Create social media accounts. You'll need two sets of accounts, one for
    you personally and one for your business (you'll see why in the chapter
    on marketing). ... Too many people think their business account is enough.
    No, it's not. People don't care about your business and its success, they
    care about you and your struggles."
  failure_mode: |
    只运营公司品牌账号,创始人隐身幕后。结果:公司账号缺乏"人味",
    涨粉困难,无法形成"创始人 IP",且一旦公司出问题,创始人个人
    没有独立的信任资产可以承接。
  mechanism: |
    公司账号与人设账号的本质差异:人设账号有"故事/脆弱性/真实性",
    公司账号只有"产品/PR"。人们对人有兴趣,对公司没兴趣。Sahil
    自己在 Gumroad 早期也踩过这个坑,后来用 @shl 个人账号 + @gumroad
    公司账号双线运营才解决这个问题。
  warning_signs:
    - 你的 LinkedIn/Twitter 只发产品更新,从不出现你的脸
    - 公司账号涨粉很慢,你不知道为什么
    - 你离职后,客户认不出下一任 CEO
  bound_to:
    - "s05-真实性营销" — 该 skill 的核心是"做你自己",前提是有个人账号
  tags: [counter-example, personal-brand, founder-account]
```

---

<a id="ce19"></a>
## ce19 — 等 PMF 之后才定价

```yaml
- id: ce19
  title: 等 PMF 之后才定价
  type: counter-example
  source_chapter: Chapter 4
  source_quote: |
    "In the early days, you may be tempted to give your product away for free
    or to charge less than the value of your time or the raw materials you
    used. Don't. In order to stay alive, you need to make money."
  failure_mode: |
    免费或低定价,等"用户量上来再想变现"。结果:用户被低价吸引后,
    对真实定价产生强烈抵触;且免费用户行为模式与付费用户完全不同,
    产品被"白嫖党"的需求扭曲。
  mechanism: |
    "Free 之后涨价"的零价格效应:用户从免费涨到 1 元,流失率远高于
    从 1 元涨到 2 元(参见 Dan Ariely)。免费用户的留存信号、LTV
    信号都不可信,无法作为 PMF 的证据。
  warning_signs:
    - 你的产品免费,但你说"等用户多了再收费"
    - 你给所有早期用户"终身免费"承诺
    - 你把"免费"作为获客手段,而不是把"付费"作为筛选手段
  bound_to:
    - "s04-创始人亲售" — 收费是销售动作,销售先于产品打磨
    - "s01-盈利优先财务模型" — 盈利要求从第一天就开始收钱
  tags: [counter-example, pricing, freemium-trap]
```

---

<a id="ce20"></a>
## ce20 — 把品牌营销等同于广告

```yaml
- id: ce20
  title: 把品牌营销等同于广告
  type: counter-example
  source_chapter: Chapter 5
  source_quote: |
    "Most people will not be a fit for your business. That's okay. Your audience
    will grow much larger than your customer base... You're not for everyone.
    Owning that can be liberating. People who aren't interested in your product
    will skip over your content, and the ones who are interested will self-select
    in."
  failure_mode: |
    把"做品牌"理解为"投放大量广告让所有人记住我们"。结果:花钱
    触达大量不相关人群,品牌没有沉淀;真正的小众用户被淹没在大众
    营销中,反而感受不到你的独特性。
  mechanism: |
    "品牌 = 重复曝光"的工业化思维:大公司(可口可乐、耐克)的品牌
    逻辑是"让所有人记住同一个符号",但对小公司来说,这既不可负担
    也不必要。小公司的品牌应该是"让对的人知道你在做对的事",这两
    个目标的策略截然不同。
  warning_signs:
    - 你的营销 KPI 是"品牌曝光量"而不是"目标客户认知度"
    - 你的内容试图讨好所有人
    - 你雇了品牌咨询公司,给出的方案是"投放 + 创意 + 大覆盖"
  bound_to:
    - "s05-真实性营销" — 该 skill 是"对的人+对的故事",不是"所有人+重复曝光"
  tags: [counter-example, branding, marketing-misconception]
```

---

<a id="ce21"></a>
## ce21 — 业绩增长后开始松手花钱

```yaml
- id: ce21
  title: 业绩增长后开始松手花钱
  type: counter-example
  source_chapter: Chapter 6
  source_quote: |
    "There's no free lunch. Once you have it, you will feel the pressure to
    spend money more loosely... Instead of hiring like crazy, hire when it
    hurts. Instead of getting a fancy office, work out of a fancy coffee shop.
    When you do spend money, see how it affects your burn rate and your runway."
  failure_mode: |
    一旦账上有钱(尤其是 VC 进来或大客户签下),立刻扩张:租办公室
    、雇人、买工具、请咨询公司。表面是"奖励自己",实际是把利润
    /runway 烧掉,最终回到缺钱状态。
  mechanism: |
    "Parkinson 定律"的商业版:支出会自动膨胀到收入水平。一旦收入
    增加,人会下意识把"多出来的钱"花掉(享受 / 安全感),而不是
    把它视为"风险缓冲"。这种行为在个人理财上叫"生活方式通胀",
    在公司里叫"scale up tax"。
  warning_signs:
    - 你开始想"现在租个像样的办公室吧"
    - 你开始觉得"我们值得雇个 X 总监"
    - 你不再每周看 P&L
  bound_to:
    - "s01-盈利优先财务模型" — 该 skill 要求"看烧钱速度"的纪律
    - "s06-有节制地成长" — 直接约束"有了就花"
  tags: [counter-example, lifestyle-inflation, burn-rate]
```

---

<a id="ce22"></a>
## ce22 — 雇人/扩张时跳过"痛到不得不雇"的临界点

```yaml
- id: ce22
  title: 雇人/扩张时跳过"痛到不得不雇"的临界点
  type: counter-example
  source_chapter: Chapter 6
  source_quote: |
    "Instead of hiring like crazy, hire when it hurts."
  failure_mode: |
    在"看起来很忙但其实还可以更聪明地工作"的阶段就雇人。结果是
    新人承担的工作是"不必要的",无法产生增量价值,且公司的固定
    成本(工资 + 福利 + 管理负担)增加,让公司变得更脆弱。
  mechanism: |
    "看起来该雇人"的视觉偏差:当团队/创始人持续加班、客户反馈积压
    ,外部观察者(包括投资人)会说"该雇人了"。但实际上,可能是流程
    优化或自动化就能解决的问题。雇人应该解决"真实的痛点",而不是
    "视觉上的忙"。
  warning_signs:
    - 你想雇人,但说不上来"如果没人接,具体哪件事会出错"
    - 你正在考虑"先雇上再说"
    - 你雇的人入职后,做的事和你原本期待的不同
  bound_to:
    - "s06-有节制地成长" — 该 skill 的核心判断是"痛到不得不雇"
    - "s03-MVP 手动验证" — 手动验证阶段就该雇人?这是反例
  tags: [counter-example, premature-hiring, headcount-tax]
```

---

<a id="ce23"></a>
## ce23 — 在文化未定义前就开始雇人

```yaml
- id: ce23
  title: 在文化未定义前就开始雇人
  type: counter-example
  source_chapter: Chapter 7 (Simply Eloped 案例)
  source_quote: |
    "'We made every mistake in the book,' they said. 'We hired for our wish
    list, we hired friends and family, and we hired anyone who seemed nice
    and wanted a job.' The result was what Janessa called a 'cultural crisis'
    during which bullying, gossip, and drama became common-place."
  failure_mode: |
    在没有清晰的价值观、招聘标准、协作方式之前,基于"看起来合适"
    "朋友推荐""招聘压力"匆忙招人。结果:不同价值观的人混在一起,
    形成文化冲突,严重时形成 bully / gossip / drama 的毒性环境,
    迫使好员工离职。
  mechanism: |
    创始人在第一年往往自己定义了文化(通过言传身教),但他们没有
    把这些"隐性规则"写下来。当团队从 3 人变成 10 人时,新员工
    各自带入自己的价值观,创始人又忙于业务没空管理,文化真空导致
    恶性循环。
  warning_signs:
    - 你说不出"我们要雇的人具有哪 3 个特征"
    - 你最近招的人让你感到"哪里不对劲"
    - 你的老员工开始抱怨"现在的氛围不一样了"
  bound_to:
    - "s08-小企业企业文化设计" — 该 skill 必须在雇人前完成
  tags: [counter-example, premature-hiring, culture, simply-eloped-case]
```

---

<a id="ce24"></a>
## ce24 — 等"自然长出"企业文化

```yaml
- id: ce24
  title: 等"自然长出"企业文化
  type: counter-example
  source_chapter: Chapter 7
  source_quote: |
    "A lot of founders think they can wait to write down their values, that
    they'll appear to them just in time, and that culture will develop
    naturally. That's true, but be forewarned that it may not be a culture
    you want for you, your team, or your customers."
  failure_mode: |
    "我们先把业务跑起来,文化自然会形成"。结果:文化是由最早加入
    的几个员工的习惯 + 创始人的情绪 + 投资人/董事会的要求混合形成
    的,一旦定型,改起来成本极高。
  mechanism: |
    文化形成的"路径依赖":最先雇的 3-5 个人,他们的工作风格会变
    成"默认模式",后加入的人会被同化,创始人在忙于业务时通常
    没有精力纠正。结果是文化"长出来"了,但不是你想要的那个。
  warning_signs:
    - 你的团队已经 5+ 人,但你写不出"我们的 3 条核心价值观"
    - 你觉得"我们文化不错",但新员工融入困难
    - 你离职的员工说"我以为这家公司是另一种样子"
  bound_to:
    - "s08-小企业企业文化设计" — 该 skill 要求"尽早定义"
    - "s02-社区发现与验证" — 创始人本身的价值观是社区筛选的起点
  tags: [counter-example, culture-by-default]
```

---

<a id="ce25"></a>
## ce25 — 把创业等同于身份

```yaml
- id: ce25
  title: 把创业等同于身份
  type: counter-example
  source_chapter: Chapter 8
  source_quote: |
    "Generally, I don't let my business make me too happy, so that it can't
    make me too sad. But it took years for me to get here, and the kind of
    people who wanted to work on Gumroad at each phase were very different.
    I basically had to rebuild the whole team from scratch."
  failure_mode: |
    把"我是创业者/CEO"作为身份认同的核心,导致: (1) 业务出问题
    = 个人价值崩塌; (2) 团队 phase 切换时无法调整(因为换人就
    像换器官); (3) 无法真正"放手",即便已经财务自由。
  mechanism: |
    身份与角色混淆:创业是一种"行为",但很多人把它当作"我是谁"。
    行为可以变、可以停,但身份必须持续。一旦公司出问题或方向要变
    ,身份受到威胁,大脑会启动保护机制(否认/攻击/逃避),而不是
    理性调整。
  warning_signs:
    - 你介绍自己时第一句话永远是"我做了 X 公司"
    - 你无法想象"如果不做这件事,我在干嘛"
    - 你的情绪几乎完全被公司表现主导
  bound_to:
    - "s05-真实性营销" — 真实性要求"我"大于"我的公司",否则营销就成了身份保护
    - "s06-有节制地成长" — 增长需要适时放手,身份绑定让这不可能
  tags: [counter-example, founder-identity, mental-health]
```

---

## 提取说明

- **数量**: 25 个反例,超过 methodology 书的常规 10-15 个。
- **来源**: Sahil 在本书中既是作者,也是反面教材(Gumroad 烧 $10M VC 资金后裁 75%),因此反例密度极高。
- **结构**: 每个反例包含 `failure_mode`(具体描述)、`mechanism`(为什么人会犯)、`warning_signs`(早期信号)、`bound_to`(约束哪些正面 skill)。
- **核心主题分类**:
  - **VC 陷阱系**: ce01, ce03, ce04, ce07, ce10
  - **手动验证/社区系**: ce05, ce06, ce07, ce08, ce14, ce15
  - **发布/营销系**: ce09, ce10, ce11, ce13, ce17, ce18, ce20
  - **增长/雇人系**: ce21, ce22, ce23, ce24
  - **心理/身份系**: ce04, ce12, ce25
- **没有纳入的原因**:
  - 一般性的"VC 是坏的"批评 → 已并入 ce01, ce03, ce04
  - 单一案例(Quibi, WeWork)的具体数字细节 → 用作引用而非独立反例
  - Sahil 个人情感宣泄(在 Provo 的孤独感)→ 没有可学的机制
