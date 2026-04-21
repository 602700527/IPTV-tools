// 搜索增强工具函数
// 中文转拼音、同义词映射、搜索匹配算法

// 常用汉字拼音映射表（覆盖常用字）
const PINYIN_MAP = {
  a: '啊阿吖嗄腌', ai: '埃挨哎唉哀皑癌矮蔼艾爱隘', an: '氨安谙岸按案黯',
  ang: '昂盎', ao: '凹敖熬翱袄傲奥', ba: '巴芭岜拔茇跋魃白伯', bai: '掰白佰败拜稗',
  ban: '扳班颁斑搬板坂半办绊', bang: '邦帮梆榜棒傍', bao: '包苞胞宝饱保堡报豹暴',
  bei: '卑背悲碑北贝呗倍狈备', ben: '奔本苯笨', beng: '蹦崩绷泵', bi: '逼鼻比吡妣笔彼碧',
  bian: '边编贬便卞变遍辨辩辫', biao: '彪标膘表', bie: '鳖憋别', bin: '彬斌滨濒',
  bing: '冰丙秉柄饼并病', bo: '拨波玻博勃搏薄卜啵', bu: '卟补捕布步部怖',
  ca: '拆擦', cai: '偲猜才材财裁采彩踩菜', can: '参骖残惭餐惨', cang: '仓沧',
  cha: '叉���查茶茬碴察衩差', chai: '拆钗柴', chan: '单产颤铲忏', chang: '昌猖肠尝常偿唱',
  chao: '抄吵潮超', che: '扯彻澈车', chen: '抻尘辰沉晨陈', cheng: '称成呈承城诚程吃赤逞',
  chi: '吃池迟驰持尺齿赤耻', chong: '冲虫忡崇', chou: '抽丑臭仇筹踌稠', chu: '出初除厨滁雏',
  chuan: '川传船串', chuang: '闯创疮', chui: '吹炊垂捶', chun: '春椿纯唇淳', chuo: '戳',
  ci: '词茨慈辞磁刺此次', cong: '从匆苁聪丛', cou: '凑辏', cu: '粗徂卒促', cuan: '窜攒篡',
  cui: '崔催脆悴', cun: '村存寸', cuo: '搓措挫', da: '答搭耷哒', dai: '呆歹傣代带',
  dan: '丹单眈耽胆旦但诞淡弹', dang: '当挡档党', dao: '刀叨导倒岛悼蹈道', de: '的得',
  deng: '灯登等邓凳', di: '低的喺嫡底抵', dian: '滇颠典点碘店电甸垫', diao: '刁叼凋碉钓',
  die: '爹跌谍叠', ding: '丁叮盯钉顶鼎', diu: '丢', dong: '东冬咚崇董懂动',
  dou: '都兜抖陡豆逗', du: '嘟督毒独读堵赌肚杜度渡', duan: '端短段断缎', dui: '堆对',
  dun: '吨敦蹲顿', duo: '咄哆夺掇朵', e: '婀额阿讹俄恶扼', en: '恩蒽', er: '而儿尔耳',
  fa: '发乏伐罚阀', fan: '帆番翻藩凡烦燔繁', fang: '方坊芳防妨房', fei: '飞非啡绯',
  fen: '分纷芬坟汾焚', feng: '丰风枫封疯', fo: '佛', fou: '否', fu: '夫弗佛拂服',
  ga: '呷嘎', gai: '该钙盖', gan: '干甘杆竿柑', gang: '冈刚岗纲肛缸港', gao: '高',
  ge: '戈仡咯哥胳鸽搁割葛', gei: '给', gen: '跟根', geng: '更耕', gong: '工弓公功攻',
  gou: '勾句沟狗苟构购垢', gu: '咕估姑孤咕沽姑菇', gua: '刮括呱', guai: '乖拐怪',
  guan: '关观官冠棺', guang: '光广', gui: '归龟规闺硅瑰轨诡鬼', gun: '棍', guo: '过',
  ha: '哈铪', hai: '还骸孩海害', han: '酣憨含函韩寒喊', hang: '夯行航沆', hao: '号浩',
  he: '诃合何和河荷核盒赫', hei: '嘿黑', hen: '痕很狠恨', heng: '亨哼横衡', hong: '轰哄',
  hou: '喉侯候后', hu: '乎呼忽唿狐弧壶斛', hua: '花华划哗', huai: '怀淮槐坏',
  huan: '欢环还桓幻涣换', huang: '荒慌皇黄凰惶蝗', hui: '灰挥辉徽回毁悔', hun: '昏婚浑',
  huo: '活火伙获祸惑', ji: '讥击叽饥机鸡姬积基', jia: '加咖茄嘉夹', jian: '奸尖坚歼间肩',
  jiang: '江姜将僵疆讲奖', jiao: '交郊娇骄胶焦礁角', jie: '节阶皆喈街截揭洁结姐',
  jin: '巾今金斤筋尽进晋', jing: '京经精睛景警净', jiu: '纠究玖久灸九旧咎救', ju: '居据鞠',
  juan: '娟捐卷倦眷', jue: '撅决诀抉', jun: '军君均菌', ka: '咔咖喀', kai: '开揩',
  kan: '刊勘坎看', kang: '康慷抗亢', kao: '尻拷烤靠', ke: '苛可克客咳', ken: '肯恳',
  keng: '坑吭', kong: '空控孔', kou: '抠口扣', ku: '枯哭窟苦酷', kua: '夸垮挎',
  kuai: '快块筷', kuan: '宽款', kuang: '匡筐狂矿', kui: '亏岿揎', kun: '坤捆困',
  kuo: '扩阔廓', la: '拉啦喇', lai: '来崃徕莱赖', lan: '兰拦栏岚蓝篮', lang: '郎狼',
  lao: '捞劳牢老佬', le: '乐肋伪', lei: '勒雷擂', leng: '棱楞冷', li: '离梨狸理礼',
  lia: '俩', lian: '连帘廉涟练炼恋', liang: '良粮凉两俩', liao: '辽疗聊寥廖料撂', lie: '列劣',
  lin: '邻林临淋凛', ling: '令另伶零龄铃', liu: '浏流留溜刘六', long: '龙聋隆',
  lou: '搂楼搂漏', lu: '卢芦炉颅卤鲁陆', lv: '驴吕铝旅履律虑', luan: '峦卵',
  lun: '抡轮伦论', luo: '罗萝逻辑洛络', ma: '妈麻摩吗', mai: '埋买卖麦',
  man: '埋蛮满慢', mang: '忙芒盲茫', mao: '猫毛矛茅锚', me: '么', mei: '没每美',
  men: '闷门们', meng: '蒙盟猛孟梦', mi: '咪迷弥谜', mian: '眠棉免面', miao: '苗瞄妙',
  mie: '灭蔑', min: '民抿闽悯敏', ming: '名明鸣', miu: '谬', mo: '摸摹膜摩磨', mou: '牟',
  mu: '木目睦牧穆', na: '那纳娜拿', nai: '氖奶奈', nan: '男南喃难', nao: '孬脑',
  ne: '呢', nei: '内馁', nen: '嫩恁', neng: '能', ni: '妮尼泥拟你昵逆', nian: '拈',
  niang: '娘酿', niao: '鸟袅尿', nie: '捏聂孽', nin: '您', ning: '宁拧狞凝', niu: '牛',
  nou: '耨', nu: '奴努怒', nv: '女', nuan: '暖疟虐', nue: '虐疟', nüe: '疟',
  nuo: '挪懦糯诺', ou: '讴欧鸥偶', pa: '扒趴啪', pai: '拍排牌迫', pan: '番攀盘',
  pang: '兵庞旁', pao: '抛创炮袍跑', pei: '胚陪培赔', pen: '喷盆', peng: '朋彭棚蓬',
  pi: '批披劈坯皮疲脾', pian: '片扁偏篇骗', piao: '飘漂票', pie: '撇瞥', pin: '拚',
  ping: '乒平评屏凭', po: '泊朴泼破迫魄', pou: '剖', pu: '扑铺扑', qi: '七戚妻栖期欺',
  qia: '掐恰洽', qian: '千仟扦扦迁', qiang: '羌枪强墙', qiao: '敲锹桥瞧', qie: '且',
  qin: '亲侵钦琴秦', qing: '青轻氢倾情晴', qiong: '穷琼', qiu: '邱秋求', qu: '区',
  quan: '全权泉', que: '却确鹊', qun: '群', ran: '然燃冉', rang: '穰壤嚷让', rao: '饶',
  re: '惹热', ren: '人仁忍刃认任', reng: '扔仍', ri: '日', rong: '荣绒容', rou: '揉',
  ru: '如儒孺肉', ruan: '软阮', rui: '蕊锐瑞', run: '闰润', ruo: '弱若', sa: '撒',
  sai: '塞腮鳃赛', san: '三参伞', sang: '桑丧嗓', sao: '搔骚扫', se: '色涩啬', sen: '森',
  seng: '僧', sha: '沙纱砂傻', shai: '筛晒', shan: '山删衫杉', shang: '伤商上尚',
  shao: '稍稍烧勺少', she: '舌佘蛇舍设社射', shen: '什伸申呻身深', sheng: '声生升',
  shi: '匙师尸失诗施湿视', shou: '收手守首寿', shu: '书孰树数输', shuai: '衰摔帅',
  shuan: '栓拴涮', shuang: '双霜爽', shui: '水税睡', shun: '顺瞬', shuo: '说硕朔',
  si: '司丝私思斯撕', song: '松耸怂讼颂', sou: '嗖搜艘', su: '苏酥俗诉肃', suan: '酸',
  sui: '虽绥随岁碎', sun: '孙笋', suo: '唆嗦所索锁', ta: '他她它', tai: '胎台抬',
  tan: '坍摊贪谈痰坦', tang: '汤唐糖塘掏', tao: '叨涛淘掏讨套', te: '特', teng: '疼腾',
  ti: '体提踢啼题蹄', tian: '天添田甜', tiao: '调挑跳', tie: '贴帖铁', ting: '听厅烃',
  tong: '通同彤童桐', tou: '偷头投', tu: '凸秃突图徒途土吐', tuan: '湍团', tui: '推',
  tun: '囤吞屯', tuo: '拖托脱', wa: '哇挖洼蛙', wai: '外歪', wan: '弯湾丸纨完', wang: '亡',
  wei: '危威微巍为韦围', wen: '温文闻纹问', weng: '嗡翁瓮', wo: '喔倭我沃卧',
  wu: '乌污邬呜巫屋无', xi: '夕汐西吸希析', xia: '虾瞎匣侠峡狭', xian: '先仙纤咸',
  xiang: '乡相香厢湘翔详', xiao: '小孝肖哮效', xie: '些协邪胁', xin: '心辛欣新',
  xing: '兴星腥猩惺', xiong: '凶兄汹胸', xiu: '休修羞朽', xu: '吁须虚需徐', xuan: '券',
  xue: '削穴学雪血', xun: '勋熏寻巡循', ya: '丫压呀鸦牙芽', yan: '咽淹延严言岩',
  yang: '央殃秧杨扬', yao: '幺吆妖腰邀姚', ye: '耶也业叶夜页', yi: '一伊医依衣仪遗宜',
  yin: '因阴音银吟', ying: '应英樱鹰迎盈营', yo: '哟唷', yong: '佣永咏泳涌', you: '优',
  yu: '于与予屿宇羽雨', yuan: '鸢冤元原圆园', yue: '曰约月岳', yun: '云匀允孕运',
  za: '匝咱杂', zai: '灾栽宰载', zan: '咱攒暂赞', zang: '赃脏葬', zao: '遭糟',
  ze: '则择泽责', zei: '贼', zen: '怎', zeng: '曾增憎', zha: '吒咋炸扎', zhai: '宅',
  zhan: '占站战颤', zhang: '张章长掌', zhao: '找着赵照罩', zhe: '折哲者锗', zhen: '珍',
  zheng: '正争筝睁蒸', zhi: '之支只汁知', zhong: '中忠终盅肿', zhou: '州舟轴肘咒',
  zhu: '朱竹主驻柱', zhua: '抓爪', zhuai: '拽', zhuan: '专砖转撰', zhuang: '妆庄',
  zhui: '追椎坠', zhun: '准', zhuo: '卓捉桌灼', zi: '仔孜咨资姿', zong: '宗棕踪纵',
  zou: '走奏揍', zu: '足卒族组', zuan: '钻攥', zui: '最罪', zun: '尊遵', zuo: '作',
  zang: '脏葬藏', cang: '藏', zeng: '增憎曾', sheng: '生声升', cheng: '成呈承城诚程'
};

// 同义词/别名映射表
const SYNONYM_MAP = {
  '央视': ['CCTV', '中国中央电视台', 'CCTV-', 'cctv'],
  'cctv': ['央视', '中国中央电视台', 'CCTV-', 'cctv'],
  '凤凰': ['Phoenix', '凤凰卫视', 'PH', 'phoenix'],
  'phoenix': ['凤凰', '凤凰卫视', 'PH', 'phoenix'],
  '湖南': ['湖南卫视', 'HUNAN', 'hunan'],
  'hunan': ['湖南', '湖南卫视', 'HUNAN', 'hunan'],
  '浙江': ['浙江卫视', 'ZJTV', 'zjtv'],
  'zjtv': ['浙江', '浙江卫视', 'ZJTV', 'zjtv'],
  '北京': ['北京卫视', 'BTV', 'btv'],
  'btv': ['北京', '北京卫视', 'BTV', 'btv'],
  '东方': ['东方卫视', 'DRAGON', 'dragon', '番茄'],
  '东方卫视': ['东方', 'DRAGON', '番茄'],
  '江苏': ['江苏卫视', 'JSTV', 'jstv'],
  '广东': ['广东卫视', 'GDTV', 'gdtv'],
  '深圳': ['深圳卫视', 'SZTV', 'sztv'],
  '安徽': ['安徽卫视', 'AHTV', 'ahtv'],
  '辽宁': ['辽宁卫视', 'LNTV', 'lntv'],
  '天津': ['天津卫视', 'TJTV', 'tjtv'],
  '体育': ['sport', 'sports', 'ESPN', 'espn'],
  '新闻': ['news', 'CNN', 'BBC'],
  '电影': ['movie', 'movies', 'film', 'films', 'CCTV-6'],
  '音乐': ['music', 'MTV', 'mv'],
  '综合': ['zonghe', '综合频道'],
  '国际': ['international', 'world', 'Global'],
  '纪录': ['documentary', 'doc', 'discovery'],
  '少儿': ['kids', 'children', '卡通', '动画'],
  '财经': ['finance', 'business', '经济'],
  '军事': ['military', 'army', 'defense'],
  '科教': ['science', 'education', 'tech'],
  '戏曲': ['opera', '戏剧', '曲艺'],
  '港台': ['hongkong', 'taiwan', 'hk', 'tw'],
  '高清': ['HD', 'hd', '高清频道'],
  '标清': ['SD', 'sd', '标清频道'],
  'Japan': ['日本', 'Japanese', '日剧', '日漫', '日综', 'RB', '日本偶像'],
  '日本': ['Japan', 'Japanese', '日剧', '日漫', '日综', 'RB', '日本偶像'],
  'USA': ['美国', 'America', 'American', 'US', '美剧', '美综', '美国偶像'],
  '美国': ['USA', 'America', 'American', 'US', '美剧', '美综', '美国偶像'],
  'Korea': ['韩国', 'Korean', '韩剧', '韩综', '韩娱', 'HB', '韩国偶像', '韩流'],
  '韩国': ['Korea', 'Korean', '韩剧', '韩综', '韩娱', 'HB', '韩国偶像', '韩流'],
  'UK': ['英国', 'Britain', 'British', 'England', '英剧', '英综'],
  '英国': ['UK', 'Britain', 'British', 'England', '英剧', '英综'],
  'Hong Kong': ['香港', 'HK', 'hongkong', '港剧', '港片'],
  '香港': ['Hong Kong', 'HK', 'hongkong', '港剧', '港片'],
  'Taiwan': ['台湾', 'TW', 'taiwan', '台剧', '台片'],
  '台湾': ['Taiwan', 'TW', 'taiwan', '台剧', '台片'],
  '法国': ['France', 'French', '法剧', '法综'],
  'France': ['法国', 'French', '法剧', '法综'],
  '德国': ['Germany', 'German', '德剧', '德综'],
  'Germany': ['德国', 'German', '德剧', '德综'],
  '西班牙': ['Spain', 'Spanish', '西剧', '西综'],
  'Spain': ['西班牙', 'Spanish', '西剧', '西综'],
  '意大利': ['Italy', 'Italian', '意剧', '意综'],
  'Italy': ['意大利', 'Italian', '意剧', '意综']
};

/**
 * 获取汉字的拼音首字母
 * @param {string} char - 单个汉字
 * @returns {string} - 拼音首字母（大写）
 */
function getPinyinInitial(char) {
  if (!char) return '';
  
  const code = char.charCodeAt(0);
  if (code >= 0x4e00 && code <= 0x9fa5) {
    for (const [initial, chars] of Object.entries(PINYIN_MAP)) {
      if (chars.includes(char)) {
        return initial.charAt(0).toUpperCase();
      }
    }
  }
  return '';
}

/**
 * 将中文转换为拼音首字母
 * @param {string} text - 中文文本
 * @returns {string} - 拼音首字母组合
 */
export function toPinyinInitials(text) {
  if (!text) return '';
  return text.split('').map(getPinyinInitial).join('');
}

/**
 * 获取字符串的模糊拼音（支持首字母模糊匹配）
 * @param {string} text - 输入文本
 * @returns {string[]} - 包含原始文本和所有可能的拼音组合
 */
export function getSearchVariants(text) {
  if (!text) return [];
  
  const variants = [text.toLowerCase()];
  const initials = toPinyinInitials(text).toLowerCase();
  
  if (initials && initials !== text.toLowerCase()) {
    variants.push(initials);
  }
  
  return variants;
}

/**
 * 检查两个字符串是否匹配（支持模糊拼音）
 * @param {string} source - 源字符串
 * @param {string} query - 查询字符串
 * @returns {boolean} - 是否匹配
 */
export function fuzzyMatch(source, query) {
  if (!source || !query) return false;
  
  const sourceLower = source.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (sourceLower.includes(queryLower)) {
    return true;
  }
  
  const sourcePinyin = toPinyinInitials(source).toLowerCase();
  const queryPinyin = toPinyinInitials(query).toLowerCase();
  
  if (sourcePinyin && queryPinyin) {
    if (sourcePinyin.includes(queryPinyin)) {
      return true;
    }
    
    if (sourcePinyin.startsWith(queryPinyin)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 扩展搜索词（通过同义词映射）
 * @param {string} query - 原始查询词
 * @returns {string[]} - 包含原始词和所有同义词
 */
export function expandQuery(query) {
  if (!query) return [];
  
  const queryLower = query.toLowerCase();
  const expandedTerms = [queryLower];
  const seen = new Set([queryLower]);
  
  for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
    if (key === queryLower) {
      for (const syn of synonyms) {
        const synLower = syn.toLowerCase();
        if (!seen.has(synLower)) {
          expandedTerms.push(synLower);
          seen.add(synLower);
        }
      }
    }
    
    for (const syn of synonyms) {
      if (syn.toLowerCase() === queryLower) {
        const keyLower = key.toLowerCase();
        if (!seen.has(keyLower)) {
          expandedTerms.push(keyLower);
          seen.add(keyLower);
        }
        
        for (const otherSyn of synonyms) {
          const otherLower = otherSyn.toLowerCase();
          if (!seen.has(otherLower)) {
            expandedTerms.push(otherLower);
            seen.add(otherLower);
          }
        }
        break;
      }
    }
  }
  
  return expandedTerms;
}

/**
 * 增强的频道搜索函数
 * @param {Object} channel - 频道对象
 * @param {string[]} searchTerms - 扩展后的搜索词列表
 * @returns {Object} - { matches: boolean, score: number, matchType: string }
 */
export function enhancedChannelMatch(channel, searchTerms) {
  if (!channel || !searchTerms || searchTerms.length === 0) {
    return { matches: false, score: 0, matchType: null };
  }
  
  const name = (channel.channel_name || '').toLowerCase();
  const group = (channel.group_title || '').toLowerCase();
  const namePinyin = toPinyinInitials(channel.channel_name || '').toLowerCase();
  const groupPinyin = toPinyinInitials(channel.group_title || '').toLowerCase();
  
  let bestScore = 0;
  let matchType = null;
  
  for (const term of searchTerms) {
    const termPinyin = toPinyinInitials(term).toLowerCase();
    
    if (name.includes(term)) {
      if (term.length > bestScore) {
        bestScore = term.length;
        matchType = 'name_exact';
      }
    }
    
    if (namePinyin.includes(termPinyin) || (termPinyin && namePinyin.startsWith(termPinyin))) {
      const score = termPinyin.length * 0.9;
      if (score > bestScore) {
        bestScore = score;
        matchType = 'name_pinyin';
      }
    }
    
    if (group.includes(term)) {
      if (term.length > bestScore) {
        bestScore = term.length;
        matchType = 'group_exact';
      }
    }
    
    if (groupPinyin.includes(termPinyin) || (termPinyin && groupPinyin.startsWith(termPinyin))) {
      const score = termPinyin.length * 0.9;
      if (score > bestScore) {
        bestScore = score;
        matchType = 'group_pinyin';
      }
    }
  }
  
  return {
    matches: bestScore > 0,
    score: bestScore,
    matchType
  };
}

/**
 * 智能排序函数
 * @param {Object} a - 频道A
 * @param {Object} b - 频道B
 * @param {number} aScore - A的匹配分数
 * @param {number} bScore - B的匹配分数
 * @returns {number} - 排序结果
 */
export function smartSort(a, b, aScore, bScore) {
  if (bScore !== aScore) {
    return bScore - aScore;
  }
  
  const nameA = a.channel_name || '';
  const nameB = b.channel_name || '';
  
  return nameA.localeCompare(nameB, 'zh-CN', { numeric: true });
}