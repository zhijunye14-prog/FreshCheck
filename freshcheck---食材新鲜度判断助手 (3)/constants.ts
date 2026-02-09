
import { IngredientInfo, FreshnessDiagnostic } from './types';

export const INGREDIENT_CATEGORIES = [
  "叶菜类", "根茎类", "瓜果类蔬菜", "菌菇类", "水果", "肉类", "水产", "蛋奶类"
];

const getSpecificDiagnostics = (name: string, category: string): FreshnessDiagnostic[] => {
  if (category === '水果') {
    if (['草莓', '蓝莓', '葡萄', '樱桃'].includes(name)) {
      return [
        { level: '非常新鲜', visual: '果实饱满，果柄鲜绿，表面覆盖一层均匀的天然白霜。', feel: '质地紧实，捏起来有明显的阻力，果皮不松弛。' },
        { level: '一般', visual: '白霜变薄，果实表面失去光泽，出现轻微压痕。', feel: '弹性下降，手感开始变软，果实不再挺实。' },
        { level: '已变质', visual: '出现灰白色霉点，果肉渗水，果柄变黑脱落。', feel: '手感极其软烂，指尖触碰即破，有酒味或霉味。' }
      ];
    }
    if (['香蕉', '芒果', '牛油果'].includes(name)) {
      return [
        { level: '非常新鲜', visual: '果皮色泽自然，无黑斑（香蕉微量黑点除外），果柄处紧密。', feel: '手感坚实。香蕉微有弹性，牛油果如按压额头感。' },
        { level: '一般', visual: '颜色加深，黑斑增多。', feel: '果肉明显变软，按压后凹陷恢复缓慢。' },
        { level: '已变质', visual: '果皮发黑，切开后果肉黑腐，甚至流出粘稠汁液。', feel: '手感稀烂，完全失去结构支撑，伴有发酵异味。' }
      ];
    }
  }

  if (['豆角', '四季豆', '豇豆', '荷兰豆', '豌豆'].includes(name)) {
    return [
      { level: '非常新鲜', visual: '豆荚色泽鲜绿，表面无锈斑，豆粒不明显突出。', feel: '手感清脆，对折时会有清脆的响声和断裂感。' },
      { level: '一般', visual: '豆荚颜色转黄，表面出现褐色斑点，筋络变硬。', feel: '质地变软，韧性增强，折断时需要用力且无脆声。' },
      { level: '已变质', visual: '豆荚发黑、霉变，表面出现水渍状斑块。', feel: '手感发粘，豆荚内部软化，散发酸臭味。' }
    ];
  }

  if (category === '肉类') {
    return [
      { level: '非常新鲜', visual: '肉质呈淡粉或鲜红色，脂肪洁白，血水极少且清澈。', feel: '表面微干，按压后肉基质立即回弹，不粘手。' },
      { level: '一般', visual: '颜色转暗，脂肪微黄，盘底血水增多。', feel: '弹性降低，指压后凹陷消失较慢，表面有轻微滑腻感。' },
      { level: '已变质', visual: '肉色发灰发绿，脂肪污暗。', feel: '表面粘液浓稠拉丝，肉质极松软，有强烈氨味或酸臭。' }
    ];
  }

  if (name === '黄油' || name === '奶酪') {
    return [
      { level: '非常新鲜', visual: '色泽均匀，切面平滑，无渗水，无异味。', feel: '硬度均匀，黄油在低温下坚硬，奶酪具韧性。' },
      { level: '一般', visual: '边缘颜色稍深（油脂氧化），表面略显油亮。', feel: '表面开始变得粘腻，结构略微松散。' },
      { level: '已变质', visual: '出现可见霉斑，颜色发黑或发红。', feel: '手感极其粘稠，油脂析出严重，伴有浓烈酸腐味。' }
    ];
  }

  switch (category) {
    case '叶菜类':
      return [
        { level: '非常新鲜', visual: '叶片色泽鲜绿，挺拔无枯萎，根部切口洁白。', feel: '叶片清脆，手感挺拔，轻轻一折即断。' },
        { level: '一般', visual: '叶尖微黄，外层叶片失去水分开始卷曲发蔫。', feel: '整体变软，失去支撑力，手感略有韧性。' },
        { level: '已变质', visual: '大面积黑腐、发黄，叶片粘连并渗出液体。', feel: '手感湿粘、化泥，散发腐败臭味。' }
      ];
    case '根茎类':
      return [
        { level: '非常新鲜', visual: '外皮完整、干燥且紧实，无芽点，无黑斑。', feel: '质地极硬，无法按压，手感沉重。' },
        { level: '一般', visual: '表皮起皱缩水，光泽度下降。', feel: '硬度下降，稍用力按压有回弹感。' },
        { level: '已变质', visual: '出现黑心、霉点或长出明显的绿芽。', feel: '手感发软，局部渗水或有中空感。' }
      ];
    case '瓜果类蔬菜':
      return [
        { level: '非常新鲜', visual: '皮色鲜艳光亮，果蒂绿意盎然，表面无伤。', feel: '手感沉实，皮层紧绷，回弹迅速。' },
        { level: '一般', visual: '颜色转暗，果蒂干枯脱落，表皮微皱。', feel: '弹性变差，按压时感觉皮肉开始分离。' },
        { level: '已变质', visual: '出现软腐斑、霉点，果体流水。', feel: '手感软烂，一捏即破，散发发酵味。' }
      ];
    case '菌菇类':
      return [
        { level: '非常新鲜', visual: '菌盖完整未开伞，颜色自然，菌褶清晰。', feel: '干爽不粘手，质地清脆，容易掰断。' },
        { level: '一般', visual: '边缘发暗，表面出现褐色斑块或轻微皱缩。', feel: '开始变软，有潮湿感，不再干爽。' },
        { level: '已变质', visual: '菌盖发黑腐烂，渗出黑水。', feel: '表面极其粘手，呈糊状，有酸臭味。' }
      ];
    case '水产':
      return [
        { level: '非常新鲜', visual: '鱼眼凸起清澈，鱼鳃鲜红，鳞片紧贴。', feel: '肉质坚实，指压后痕迹瞬间消失。' },
        { level: '一般', visual: '鱼眼微凹浑浊，鱼鳃淡红，表面粘液多。', feel: '弹性减弱，恢复缓慢，腥味加重。' },
        { level: '已变质', visual: '鱼眼塌陷变红，鱼鳃灰暗，腹部鼓胀。', feel: '肉质散烂，骨肉分离，氨臭味剧烈。' }
      ];
    default:
      return [
        { level: '非常新鲜', visual: '色泽自然，状态良好。', feel: '质地紧实。' },
        { level: '一般', visual: '色泽转暗，出现疲态。', feel: '硬度下降。' },
        { level: '已变质', visual: '变色、异味、腐坏。', feel: '软烂、发粘。' }
      ];
  }
};

export const INGREDIENT_DB: IngredientInfo[] = [
  // --- 叶菜类 ---
  { id: 'bocai', name: '菠菜', category: '叶菜类', icon: '🥬', selectionTips: ['根部红亮', '叶片深绿'], spoilageSigns: ['发黄', '化水'], storageAdvice: '纸巾包裹冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('菠菜', '叶菜类') },
  { id: 'shengcai', name: '生菜', category: '叶菜类', icon: '🥗', selectionTips: ['叶挺拔', '心紧凑'], spoilageSigns: ['红边'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('生菜', '叶菜类') },
  { id: 'youmaicai', name: '油麦菜', category: '叶菜类', icon: '🥬', selectionTips: ['色翠绿', '无折痕'], spoilageSigns: ['叶尖烂'], storageAdvice: '冷藏', storageLife: '3-4', diagnostics: getSpecificDiagnostics('油麦菜', '叶菜类') },
  { id: 'xiaobaicai', name: '小白菜', category: '叶菜类', icon: '🥬', selectionTips: ['叶嫩', '杆白'], spoilageSigns: ['黄化'], storageAdvice: '冷藏', storageLife: '2-3', diagnostics: getSpecificDiagnostics('小白菜', '叶菜类') },
  { id: 'shanghaiqing', name: '上海青', category: '叶菜类', icon: '🥬', selectionTips: ['株型矮壮'], spoilageSigns: ['叶柄烂'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('上海青', '叶菜类') },
  { id: 'kongxincai', name: '空心菜', category: '叶菜类', icon: '🌿', selectionTips: ['杆嫩易断'], spoilageSigns: ['发黑'], storageAdvice: '冷藏', storageLife: '2-3', diagnostics: getSpecificDiagnostics('空心菜', '叶菜类') },
  { id: 'qinai', name: '芹菜', category: '叶菜类', icon: '🌿', selectionTips: ['梗实心'], spoilageSigns: ['空心'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('芹菜', '叶菜类') },
  { id: 'xiangcai', name: '香菜', category: '叶菜类', icon: '🌿', selectionTips: ['根部不烂'], spoilageSigns: ['发蔫'], storageAdvice: '根部插水', storageLife: '5', diagnostics: getSpecificDiagnostics('香菜', '叶菜类') },
  { id: 'jiucai', name: '韭菜', category: '叶菜类', icon: '🌱', selectionTips: ['切口平齐'], spoilageSigns: ['烂叶'], storageAdvice: '冷藏', storageLife: '2-3', diagnostics: getSpecificDiagnostics('韭菜', '叶菜类') },
  { id: 'tonghao', name: '茼蒿', category: '叶菜类', icon: '🌿', selectionTips: ['叶片小且嫩'], spoilageSigns: ['变黑'], storageAdvice: '冷藏', storageLife: '2-3', diagnostics: getSpecificDiagnostics('茼蒿', '叶菜类') },
  { id: 'wawacai', name: '娃娃菜', category: '叶菜类', icon: '🥬', selectionTips: ['手感沉实'], spoilageSigns: ['黑斑'], storageAdvice: '冷藏', storageLife: '10-15', diagnostics: getSpecificDiagnostics('娃娃菜', '叶菜类') },
  { id: 'juanxincai', name: '卷心菜', category: '叶菜类', icon: '🥦', selectionTips: ['包球紧密'], spoilageSigns: ['爆裂'], storageAdvice: '冷藏', storageLife: '15-20', diagnostics: getSpecificDiagnostics('卷心菜', '叶菜类') },
  { id: 'zigailan', name: '紫甘蓝', category: '叶菜类', icon: '🟣', selectionTips: ['颜色深紫'], spoilageSigns: ['枯萎'], storageAdvice: '冷藏', storageLife: '20-30', diagnostics: getSpecificDiagnostics('紫甘蓝', '叶菜类') },
  { id: 'xiancai', name: '苋菜', category: '叶菜类', icon: '🌿', selectionTips: ['叶片厚实'], spoilageSigns: ['烂根'], storageAdvice: '冷藏', storageLife: '2', diagnostics: getSpecificDiagnostics('苋菜', '叶菜类') },
  { id: 'xiyangcai', name: '西洋菜', category: '叶菜类', icon: '🌿', selectionTips: ['梗嫩'], spoilageSigns: ['发黄'], storageAdvice: '冷藏', storageLife: '2', diagnostics: getSpecificDiagnostics('西洋菜', '叶菜类') },

  // --- 根茎类 ---
  { id: 'tudou', name: '土豆', category: '根茎类', icon: '🥔', selectionTips: ['表皮光滑'], spoilageSigns: ['发芽'], storageAdvice: '避光常温', storageLife: '30-60', diagnostics: getSpecificDiagnostics('土豆', '根茎类') },
  { id: 'hongshu', name: '红薯', category: '根茎类', icon: '🍠', selectionTips: ['纺锤形'], spoilageSigns: ['黑斑'], storageAdvice: '常温', storageLife: '30-45', diagnostics: getSpecificDiagnostics('红薯', '根茎类') },
  { id: 'zishu', name: '紫薯', category: '根茎类', icon: '🍠', selectionTips: ['皮深紫'], spoilageSigns: ['干瘪'], storageAdvice: '常温', storageLife: '30-45', diagnostics: getSpecificDiagnostics('紫薯', '根茎类') },
  { id: 'huluobo', name: '胡萝卜', category: '根茎类', icon: '🥕', selectionTips: ['橘红色'], spoilageSigns: ['软化'], storageAdvice: '冷藏', storageLife: '14-21', diagnostics: getSpecificDiagnostics('胡萝卜', '根茎类') },
  { id: 'bailuobo', name: '白萝卜', category: '根茎类', icon: '🎍', selectionTips: ['皮亮不裂'], spoilageSigns: ['空心'], storageAdvice: '冷藏', storageLife: '10-14', diagnostics: getSpecificDiagnostics('白萝卜', '根茎类') },
  { id: 'shanyao', name: '山药', category: '根茎类', icon: '🥖', selectionTips: ['毛须多'], spoilageSigns: ['变色'], storageAdvice: '常温', storageLife: '15-20', diagnostics: getSpecificDiagnostics('山药', '根茎类') },
  { id: 'yutou', name: '芋头', category: '根茎类', icon: '🥔', selectionTips: ['分量重'], spoilageSigns: ['霉变'], storageAdvice: '常温', storageLife: '10-15', diagnostics: getSpecificDiagnostics('芋头', '根茎类') },
  { id: 'lianou', name: '莲藕', category: '根茎类', icon: '🥯', selectionTips: ['孔大肉厚'], spoilageSigns: ['异味'], storageAdvice: '泡水冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('莲藕', '根茎类') },
  { id: 'yangcong', name: '洋葱', category: '根茎类', icon: '🧅', selectionTips: ['皮干'], spoilageSigns: ['发芽'], storageAdvice: '悬挂常温', storageLife: '30-60', diagnostics: getSpecificDiagnostics('洋葱', '根茎类') },
  { id: 'dashuan', name: '大蒜', category: '根茎类', icon: '🧄', selectionTips: ['瓣饱满'], spoilageSigns: ['干瘪'], storageAdvice: '常温', storageLife: '90', diagnostics: getSpecificDiagnostics('大蒜', '根茎类') },
  { id: 'shengjiang', name: '生姜', category: '根茎类', icon: '🥔', selectionTips: ['皮紧实'], spoilageSigns: ['霉斑'], storageAdvice: '沙埋或常温', storageLife: '60', diagnostics: getSpecificDiagnostics('生姜', '根茎类') },
  { id: 'tiancaigen', name: '甜菜根', category: '根茎类', icon: '🥔', selectionTips: ['颜色深'], spoilageSigns: ['发软'], storageAdvice: '冷藏', storageLife: '14', diagnostics: getSpecificDiagnostics('甜菜根', '根茎类') },

  // --- 瓜果类 ---
  { id: 'xihongshi', name: '西红柿', category: '瓜果类蔬菜', icon: '🍅', selectionTips: ['底部凹陷'], spoilageSigns: ['出水'], storageAdvice: '常温', storageLife: '7-10', diagnostics: getSpecificDiagnostics('西红柿', '瓜果类蔬菜') },
  { id: 'huanggua', name: '黄瓜', category: '瓜果类蔬菜', icon: '🥒', selectionTips: ['刺细密'], spoilageSigns: ['发粘'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('黄瓜', '瓜果类蔬菜') },
  { id: 'qiezi', name: '茄子', category: '瓜果类蔬菜', icon: '🍆', selectionTips: ['皮发亮'], spoilageSigns: ['黑斑'], storageAdvice: '冷藏', storageLife: '5', diagnostics: getSpecificDiagnostics('茄子', '瓜果类蔬菜') },
  { id: 'qingjiao', name: '青椒', category: '瓜果类蔬菜', icon: '🫑', selectionTips: ['果柄鲜'], spoilageSigns: ['腐烂'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('青椒', '瓜果类蔬菜') },
  { id: 'hongjiao', name: '红椒', category: '瓜果类蔬菜', icon: '🌶️', selectionTips: ['颜色艳'], spoilageSigns: ['发软'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('红椒', '瓜果类蔬菜') },
  { id: 'caijiao', name: '彩椒', category: '瓜果类蔬菜', icon: '🫑', selectionTips: ['肉厚'], spoilageSigns: ['褶皱'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('彩椒', '瓜果类蔬菜') },
  { id: 'xihulu', name: '西葫芦', category: '瓜果类蔬菜', icon: '🥒', selectionTips: ['体型匀称'], spoilageSigns: ['霉点'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('西葫芦', '瓜果类蔬菜') },
  { id: 'nangua', name: '南瓜', category: '瓜果类蔬菜', icon: '🎃', selectionTips: ['老瓜香'], spoilageSigns: ['渗水'], storageAdvice: '常温', storageLife: '60', diagnostics: getSpecificDiagnostics('南瓜', '瓜果类蔬菜') },
  { id: 'donggua', name: '冬瓜', category: '瓜果类蔬菜', icon: '🍈', selectionTips: ['白霜厚'], spoilageSigns: ['酸味'], storageAdvice: '常温', storageLife: '30', diagnostics: getSpecificDiagnostics('冬瓜', '瓜果类蔬菜') },
  { id: 'kugua', name: '苦瓜', category: '瓜果类蔬菜', icon: '🥒', selectionTips: ['纹路宽'], spoilageSigns: ['变黄'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('苦瓜', '瓜果类蔬菜') },
  { id: 'sigua', name: '丝瓜', category: '瓜果类蔬菜', icon: '🥒', selectionTips: ['重手'], spoilageSigns: ['发软'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('丝瓜', '瓜果类蔬菜') },
  { id: 'foshougua', name: '佛手瓜', category: '瓜果类蔬菜', icon: '🍈', selectionTips: ['皮嫩'], spoilageSigns: ['枯萎'], storageAdvice: '冷藏', storageLife: '10-14', diagnostics: getSpecificDiagnostics('佛手瓜', '瓜果类蔬菜') },
  { id: 'doujiao', name: '豆角', category: '瓜果类蔬菜', icon: '🌿', selectionTips: ['无锈斑'], spoilageSigns: ['粘手'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('豆角', '瓜果类蔬菜') },
  { id: 'sijidou', name: '四季豆', category: '瓜果类蔬菜', icon: '🌿', selectionTips: ['清脆'], spoilageSigns: ['豆荚老'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('四季豆', '瓜果类蔬菜') },
  { id: 'jiangdou', name: '豇豆', category: '瓜果类蔬菜', icon: '🌿', selectionTips: ['细嫩'], spoilageSigns: ['腐败'], storageAdvice: '冷藏', storageLife: '2-3', diagnostics: getSpecificDiagnostics('豇豆', '瓜果类蔬菜') },
  { id: 'heliandou', name: '荷兰豆', category: '瓜果类蔬菜', icon: '🌿', selectionTips: ['薄翠'], spoilageSigns: ['变黄'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('荷兰豆', '瓜果类蔬菜') },
  { id: 'wandou', name: '豌豆', category: '瓜果类蔬菜', icon: '🌿', selectionTips: ['颗粒满'], spoilageSigns: ['发霉'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('豌豆', '瓜果类蔬菜') },
  { id: 'yumi', name: '玉米', category: '瓜果类蔬菜', icon: '🌽', selectionTips: ['须色鲜'], spoilageSigns: ['干瘪'], storageAdvice: '冷冻/冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('玉米', '瓜果类蔬菜') },
  { id: 'qiukui', name: '秋葵', category: '瓜果类蔬菜', icon: '🌿', selectionTips: ['个头小嫩'], spoilageSigns: ['黑变'], storageAdvice: '冷藏', storageLife: '2-3', diagnostics: getSpecificDiagnostics('秋葵', '瓜果类蔬菜') },

  // --- 菌菇类 ---
  { id: 'xianggu', name: '香菇', category: '菌菇类', icon: '🍄', selectionTips: ['菌褶白'], spoilageSigns: ['发黑'], storageAdvice: '纸袋冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('香菇', '菌菇类') },
  { id: 'pinggu', name: '平菇', category: '菌菇类', icon: '🍄', selectionTips: ['边缘紧'], spoilageSigns: ['粘腻'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('平菇', '菌菇类') },
  { id: 'jinzhengu', name: '金针菇', category: '菌菇类', icon: '🍄', selectionTips: ['色纯白'], spoilageSigns: ['粘稠'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('金针菇', '菌菇类') },
  { id: 'xingbaogu', name: '杏鲍菇', category: '菌菇类', icon: '🍄', selectionTips: ['柱体壮'], spoilageSigns: ['发软'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('杏鲍菇', '菌菇类') },
  { id: 'baiyugu', name: '白玉菇', category: '菌菇类', icon: '🍄', selectionTips: ['通体白'], spoilageSigns: ['出水'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('白玉菇', '菌菇类') },
  { id: 'xieweigu', name: '蟹味菇', category: '菌菇类', icon: '🍄', selectionTips: ['圆润'], spoilageSigns: ['发酸'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('蟹味菇', '菌菇类') },
  { id: 'koumo', name: '口蘑', category: '菌菇类', icon: '🍄', selectionTips: ['未开伞'], spoilageSigns: ['褐变'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('口蘑', '菌菇类') },
  { id: 'chashugu', name: '茶树菇', category: '菌菇类', icon: '🍄', selectionTips: ['干爽'], spoilageSigns: ['霉点'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('茶树菇', '菌菇类') },
  { id: 'muer', name: '木耳', category: '菌菇类', icon: '🍄', selectionTips: ['无异味'], spoilageSigns: ['发粘'], storageAdvice: '干燥常温', storageLife: '365', diagnostics: getSpecificDiagnostics('木耳', '菌菇类') },
  { id: 'yiner', name: '银耳', category: '菌菇类', icon: '🍄', selectionTips: ['色微黄'], spoilageSigns: ['发红'], storageAdvice: '干燥', storageLife: '365', diagnostics: getSpecificDiagnostics('银耳', '菌菇类') },

  // --- 水果 ---
  { id: 'pingguo', name: '苹果', category: '水果', icon: '🍎', selectionTips: ['底部深'], spoilageSigns: ['褐腐'], storageAdvice: '冷藏', storageLife: '30', diagnostics: getSpecificDiagnostics('苹果', '水果') },
  { id: 'xiangjiao', name: '香蕉', category: '水果', icon: '🍌', selectionTips: ['柄绿'], spoilageSigns: ['化浆'], storageAdvice: '常温', storageLife: '3-5', diagnostics: getSpecificDiagnostics('香蕉', '水果') },
  { id: 'chengzi', name: '橙子', category: '水果', icon: '🍊', selectionTips: ['皮薄'], spoilageSigns: ['青霉'], storageAdvice: '冷藏', storageLife: '14-21', diagnostics: getSpecificDiagnostics('橙子', '水果') },
  { id: 'ningmeng', name: '柠檬', category: '水果', icon: '🍋', selectionTips: ['分量重'], spoilageSigns: ['霉变'], storageAdvice: '冷藏', storageLife: '30', diagnostics: getSpecificDiagnostics('柠檬', '水果') },
  { id: 'li', name: '梨', category: '水果', icon: '🍐', selectionTips: ['肉细'], spoilageSigns: ['黑心'], storageAdvice: '冷藏', storageLife: '15-20', diagnostics: getSpecificDiagnostics('梨', '水果') },
  { id: 'putao', name: '葡萄', category: '水果', icon: '🍇', selectionTips: ['白霜厚'], spoilageSigns: ['掉粒'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('葡萄', '水果') },
  { id: 'caomei', name: '草莓', category: '水果', icon: '🍓', selectionTips: ['籽均匀'], spoilageSigns: ['渗水'], storageAdvice: '冷藏', storageLife: '1-2', diagnostics: getSpecificDiagnostics('草莓', '水果') },
  { id: 'lanmei', name: '蓝莓', category: '水果', icon: '🫐', selectionTips: ['白粉'], spoilageSigns: ['长霉'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('蓝莓', '水果') },
  { id: 'mangguo', name: '芒果', category: '水果', icon: '🥭', selectionTips: ['香味浓'], spoilageSigns: ['黑腐'], storageAdvice: '常温', storageLife: '3-5', diagnostics: getSpecificDiagnostics('mangguo', '水果') },
  { id: 'boluo', name: '菠萝', category: '水果', icon: '🍍', selectionTips: ['色橙黄'], spoilageSigns: ['流汁'], storageAdvice: '常温', storageLife: '2-3', diagnostics: getSpecificDiagnostics('boluo', '水果') },
  { id: 'xigua', name: '西瓜', category: '水果', icon: '🍉', selectionTips: ['声脆'], spoilageSigns: ['酸败'], storageAdvice: '常温', storageLife: '7-10', diagnostics: getSpecificDiagnostics('西瓜', '水果') },
  { id: 'hamigua', name: '哈密瓜', category: '水果', icon: '🍈', selectionTips: ['网纹密'], spoilageSigns: ['软烂'], storageAdvice: '常温', storageLife: '7-10', diagnostics: getSpecificDiagnostics('哈密瓜', '水果') },
  { id: 'mihoutao', name: '猕猴桃', category: '水果', icon: '🥝', selectionTips: ['绒毛整齐'], spoilageSigns: ['酒味'], storageAdvice: '催熟冷藏', storageLife: '10-15', diagnostics: getSpecificDiagnostics('猕猴桃', '水果') },
  { id: 'taozi', name: '桃子', category: '水果', icon: '🍑', selectionTips: ['果尖粉'], spoilageSigns: ['变黑'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('桃子', '水果') },
  { id: 'lizi', name: '李子', category: '水果', icon: '🫐', selectionTips: ['硬度中等'], spoilageSigns: ['裂口'], storageAdvice: '冷藏', storageLife: '5-7', diagnostics: getSpecificDiagnostics('李子', '水果') },
  { id: 'yingtao', name: '樱桃', category: '水果', icon: '🍒', selectionTips: ['梗青'], spoilageSigns: ['发褐'], storageAdvice: '冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('樱桃', '水果') },
  { id: 'huolongguo', name: '火龙果', category: '水果', icon: '🌵', selectionTips: ['鳞片绿'], spoilageSigns: ['萎缩'], storageAdvice: '冷藏', storageLife: '7-10', diagnostics: getSpecificDiagnostics('火龙果', '水果') },
  { id: 'shiliu', name: '石榴', category: '水果', icon: '🍎', selectionTips: ['棱角分明'], spoilageSigns: ['皮黑'], storageAdvice: '冷藏', storageLife: '30', diagnostics: getSpecificDiagnostics('石榴', '水果') },
  { id: 'liulian', name: '榴莲', category: '水果', icon: '🍈', selectionTips: ['刺软'], spoilageSigns: ['过熟酸味'], storageAdvice: '冷冻/冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('榴莲', '水果') },
  { id: 'niuyouguo', name: '牛油果', category: '水果', icon: '🥑', selectionTips: ['蒂头绿'], spoilageSigns: ['全黑软'], storageAdvice: '常温/冷藏', storageLife: '3-5', diagnostics: getSpecificDiagnostics('牛油果', '水果') },

  // --- 肉类 ---
  { id: 'zhurou', name: '猪肉', category: '肉类', icon: '🥓', selectionTips: ['鲜红'], spoilageSigns: ['异味'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('猪肉', '肉类') },
  { id: 'niurou', name: '牛肉', category: '肉类', icon: '🥩', selectionTips: ['暗红'], spoilageSigns: ['粘手'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('牛肉', '肉类') },
  { id: 'yangrou', name: '羊肉', category: '肉类', icon: '🥩', selectionTips: ['肉质细'], spoilageSigns: ['膻臭'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('羊肉', '肉类') },
  { id: 'jirou', name: '鸡肉', category: '肉类', icon: '🍗', selectionTips: ['皮黄白'], spoilageSigns: ['发粘'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('鸡肉', '肉类') },
  { id: 'yarou', name: '鸭肉', category: '肉类', icon: '🍗', selectionTips: ['肉紧实'], spoilageSigns: ['变色'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('鸭肉', '肉类') },
  { id: 'erou', name: '鹅肉', category: '肉类', icon: '🍗', selectionTips: ['色泽红润'], spoilageSigns: ['异味'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('鹅肉', '肉类') },
  { id: 'paigu', name: '排骨', category: '肉类', icon: '🥩', selectionTips: ['骨色白'], spoilageSigns: ['血水黑'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('排骨', '肉类') },
  { id: 'wuhuarou', name: '五花肉', category: '肉类', icon: '🥓', selectionTips: ['分层清晰'], spoilageSigns: ['油脂黄'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('五花肉', '肉类') },
  { id: 'niupai', name: '牛排', category: '肉类', icon: '🥩', selectionTips: ['大理石纹'], spoilageSigns: ['发灰'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('牛排', '肉类') },
  { id: 'jixiongrou', name: '鸡胸肉', category: '肉类', icon: '🍗', selectionTips: ['无淤血'], spoilageSigns: ['粘滑'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('鸡胸肉', '肉类') },
  { id: 'jitui', name: '鸡腿', category: '肉类', icon: '🍗', selectionTips: ['肉饱满'], spoilageSigns: ['变暗'], storageAdvice: '冷冻', storageLife: '180', diagnostics: getSpecificDiagnostics('鸡腿', '肉类') },

  // --- 水产 ---
  { id: 'yu', name: '鱼', category: '水产', icon: '🐟', selectionTips: ['眼亮鳃红'], spoilageSigns: ['肉散'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('鱼', '水产') },
  { id: 'sanwenyu', name: '三文鱼', category: '水产', icon: '🍣', selectionTips: ['纹路清晰'], spoilageSigns: ['变色'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('三文鱼', '水产') },
  { id: 'xueyu', name: '鳕鱼', category: '水产', icon: '🐟', selectionTips: ['色洁白'], spoilageSigns: ['流水'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('鳕鱼', '水产') },
  { id: 'daiyu', name: '带鱼', category: '水产', icon: '🐟', selectionTips: ['银粉不脱'], spoilageSigns: ['腥臭'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('带鱼', '水产') },
  { id: 'luyu', name: '鲈鱼', category: '水产', icon: '🐟', selectionTips: ['身匀称'], spoilageSigns: ['眼暗'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('鲈鱼', '水产') },
  { id: 'xia', name: '虾', category: '水产', icon: '🦐', selectionTips: ['壳硬头紧'], spoilageSigns: ['黑头'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('虾', '水产') },
  { id: 'pangxie', name: '螃蟹', category: '水产', icon: '🦀', selectionTips: ['眼灵敏'], spoilageSigns: ['空壳'], storageAdvice: '冷藏', storageLife: '3', diagnostics: getSpecificDiagnostics('螃蟹', '水产') },
  { id: 'shanbei', name: '扇贝', category: '水产', icon: '🐚', selectionTips: ['闭合力'], spoilageSigns: ['开口'], storageAdvice: '冷冻', storageLife: '30', diagnostics: getSpecificDiagnostics('扇贝', '水产') },
  { id: 'gali', name: '蛤蜊', category: '水产', icon: '🐚', selectionTips: ['吐沙清'], spoilageSigns: ['闭合不回'], storageAdvice: '冷藏', storageLife: '2', diagnostics: getSpecificDiagnostics('蛤蜊', '水产') },
  { id: 'youyu', name: '鱿鱼', category: '水产', icon: '🦑', selectionTips: ['皮完整'], spoilageSigns: ['发红'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('鱿鱼', '水产') },
  { id: 'zhangyu', name: '章鱼', category: '水产', icon: '🐙', selectionTips: ['吸盘力'], spoilageSigns: ['粘液'], storageAdvice: '冷冻', storageLife: '60', diagnostics: getSpecificDiagnostics('章鱼', '水产') },

  // --- 蛋奶类 ---
  { id: 'jidan', name: '鸡蛋', category: '蛋奶类', icon: '🥚', selectionTips: ['壳粗糙'], spoilageSigns: ['摇晃声'], storageAdvice: '冷藏', storageLife: '30', diagnostics: getSpecificDiagnostics('鸡蛋', '蛋奶类') },
  { id: 'yadan', name: '鸭蛋', category: '蛋奶类', icon: '🥚', selectionTips: ['青色亮'], spoilageSigns: ['散黄'], storageAdvice: '冷藏', storageLife: '30', diagnostics: getSpecificDiagnostics('鸭蛋', '蛋奶类') },
  { id: 'anchundan', name: '鹌鹑蛋', category: '蛋奶类', icon: '🥚', selectionTips: ['花纹清'], spoilageSigns: ['浮水'], storageAdvice: '冷藏', storageLife: '15', diagnostics: getSpecificDiagnostics('鹌鹑蛋', '蛋奶类') },
  { id: 'niunai', name: '牛奶', category: '蛋奶类', icon: '🥛', selectionTips: ['挂壁均'], spoilageSigns: ['沉淀'], storageAdvice: '冷藏', storageLife: '7', diagnostics: getSpecificDiagnostics('牛奶', '蛋奶类') },
  { id: 'suannai', name: '酸奶', category: '蛋奶类', icon: '🥤', selectionTips: ['质地稠'], spoilageSigns: ['发红'], storageAdvice: '冷藏', storageLife: '21', diagnostics: getSpecificDiagnostics('酸奶', '蛋奶类') },
  { id: 'naizao', name: '奶酪', category: '蛋奶类', icon: '🧀', selectionTips: ['色泽正'], spoilageSigns: ['霉点'], storageAdvice: '冷藏', storageLife: '30', diagnostics: getSpecificDiagnostics('奶酪', '蛋奶类') },
  { id: 'huangyou', name: '黄油', category: '蛋奶类', icon: '🧈', selectionTips: ['淡黄色'], spoilageSigns: ['哈喇味'], storageAdvice: '冷冻/冷藏', storageLife: '180', diagnostics: getSpecificDiagnostics('黄油', '蛋奶类') }
];
