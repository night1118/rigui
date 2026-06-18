import { SolarTerm, HourMapping } from './types';

export const hoursData: HourMapping[] = [
  { name: "子时", range: "23:00 - 01:00", description: "夜半，阴气最盛，睡眠养胆", meridian: "胆经当令" },
  { name: "丑时", range: "01:00 - 03:00", description: "鸡鸣，肝脏排毒，静卧熟睡", meridian: "肝经当令" },
  { name: "寅时", range: "03:00 - 05:00", description: "平旦, 肺气分配，清晨吐故纳新", meridian: "肺经当令" },
  { name: "卯时", range: "05:00 - 07:00", description: "日出，旭日东升，宜多饮温水排便", meridian: "大肠经当令" },
  { name: "辰时", range: "07:00 - 09:00", description: "食时，阳光柔和，脾胃活跃宜早餐", meridian: "胃经当令" },
  { name: "巳时", range: "09:00 - 11:00", description: "隅中，精神饱满，工作学習黄金期", meridian: "脾经当令" },
  { name: "午时", range: "11:00 - 13:00", description: "日中，艳阳高照，宜午休15-30分钟", meridian: "心经当令" },
  { name: "未时", range: "13:00 - 15:00", description: "日昳，太阳偏西，小肠吸收营养", meridian: "小肠经当令" },
  { name: "申时", range: "15:00 - 17:00", description: "哺时，夕阳渐照，多饮水利尿排毒", meridian: "膀胱经当令" },
  { name: "酉时", range: "17:00 - 19:00", description: "日入，夕阳西下，肾脏藏精最佳时", meridian: "肾经当令" },
  { name: "戌时", range: "19:00 - 21:00", description: "黄昏，夜幕降临，心包经活跃宜放松", meridian: "心包经当令" },
  { name: "亥时", range: "21:00 - 23:00", description: "人定，夜深人静，三焦调和宜入睡", meridian: "三焦经当令" }
];

export const solarTermsData: SolarTerm[] = [
  // --- SPRING TERMS ---
  {
    id: "lichun",
    name: "立春",
    englishName: "Beginning of Spring",
    pinyin: "Lìchūn",
    season: "spring",
    shadowLevel: 5,
    dates: "2月3日 - 2月5日",
    description: "立春，是二十四节气之首，标志着春天的序幕正式拉开。阳气上升，万物开始复苏，草木萌芽，生命在大地深处积蓄力量，准备吐出崭新的绿意。",
    threePhases: ["东风解冻 (东风送暖，大地上冰雪开始融化)", "蛰虫始振 (冬眠的小虫苏醒，能够活动了)", "鱼 shall 负冰 (河道冰面融化崩解，草鱼畅游如背负冰片)"],
    customs: ["咬春 (吃春饼、春卷、萝卜)", "打春 (鞭春牛以示春耕开始)", "迎春 (设祭坛迎接春神句芒)"],
    recommendation: "立春时节，早春阳气渐生，宜食甘、辛、温，如葱、蒜、韭菜，少食酸味，以护肝阳。早卧早起，披发缓行，放松身心。",
    climate: "气温回升，春寒料峭。北方仍有积雪，南方草木初显萌新，风力增大，暖意渐显。",
    poetry: {
      title: "立春日",
      author: "陆游 [宋]",
      content: "春生何处暗周游，忽到家山第一秋。\n野水忽翻青秧浪，柴门初挂绿杨丝。"
    },
    themeColor: "#10b981",
    bgGradient: "from-emerald-900/60 via-slate-900 to-emerald-950/40",
    accentColor: "emerald-500"
  },
  {
    id: "yushui",
    name: "雨水",
    englishName: "Rain Water",
    pinyin: "Yǔshuǐ",
    season: "spring",
    shadowLevel: 4,
    dates: "2月18日 - 2月20日",
    description: "雨水节气意味着雪渐少而雨渐多，气温升高，冰雪消融。春雨随风潜入夜，润物无声，大地在甘霖的滋润下散发出淡淡的泥土芬芳。",
    threePhases: ["獭祭鱼 (水獭开始捕鱼，将鱼摆在冰面像祭祀一般)", "候雁北 (大雁感知阳气，开始编队北飞)", "草木萌动 (在暖湿雨水的滋润下，草木舒展枝叶开始发芽)"],
    customs: ["回娘家 (携礼拜望父母)", "占稻色 (通过爆炒糯米占卜稻谷丰歉)", "拉保保 (为孩子拜干爹以求平安成长)"],
    recommendation: "雨水季节湿气渐重，脾胃容易受损。宜多食小米粥、山药、莲子等甘平之物，健脾祛湿，注意防范寒湿侵袭入骨。",
    climate: "冰雪融化，降雨增多，湿度上升，南方春意渐浓，而北方仍有倒春寒之虞。",
    poetry: {
      title: "春夜喜雨",
      author: "杜甫 [唐]",
      content: "好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。"
    },
    themeColor: "#34d399",
    bgGradient: "from-teal-900/60 via-slate-900 to-teal-950/40",
    accentColor: "teal-400"
  },
  {
    id: "jingzhe",
    name: "惊蛰",
    englishName: "Awakening of Insects",
    pinyin: "Jīngzhé",
    season: "spring",
    shadowLevel: 3,
    dates: "3月5日 - 3月7日",
    description: "惊蛰意为春雷乍动，惊醒了蛰伏在土中冬眠的万千生灵。大自然开始呈现出一派生机勃勃的景致，桃花红，李花白，春耕大忙季节自此开始。",
    threePhases: ["桃始华 (桃花开始盛开，露出粉红的笑脸)", "仓庚鸣 (仓庚即黄鹂，欢快地在枝头鸣叫)", "鹰化为鸠 (鹰躲藏产卵，斑鸠飞出，古人误以为鹰化身成了鸠)"],
    customs: ["吃梨 (寓意离家奋斗，亦可清热润肺)", "打小人 (驱除霉运与身边的小人障碍)", "祭白虎以防口舌是非"],
    recommendation: "惊蛰气候干燥多变，极易口干舌燥、咳嗽。应多吃润肺止咳、顺气健脾之物，如梨、银耳、枇杷、蜂蜜。同时，宜顺应春气舒展运动。",
    climate: "气温回升极快，春雷隐隐，雨水渐丰。华北、江南大部分地区进入春耕时节。",
    poetry: {
      title: "观田家",
      author: "韦应物 [唐]",
      content: "微雨众卉新，一雷惊蛰始。\n田家几日闲，耕种从此起。"
    },
    themeColor: "#059669",
    bgGradient: "from-lime-900/60 via-slate-900 to-lime-950/40",
    accentColor: "lime-500"
  },
  {
    id: "chunfen",
    name: "春分",
    englishName: "Spring Equinox",
    pinyin: "Chūnfēn",
    season: "spring",
    shadowLevel: 2,
    dates: "3月19日 - 3月22日",
    description: "春分这天，太阳直射地球赤道，昼夜平分，春季九十日亦平分于此。大江南北，春暖花开，燕子越冬归来，是一年中色彩最明媚的时刻。",
    threePhases: ["玄鸟至 (玄鸟即燕子，从南方飞回筑巢筑窝)", "雷乃发声 (春雷阵阵，雨水充沛)", "始电 (天空开始出现闪电，伴随着明亮的雷雨)"],
    customs: ["挺立春蛋 (尝试让鸡蛋在平地上竖立)", "吃春菜 (采摘野春苋菜做春汤)", "放风筝 (放走霉运，放飞希望)"],
    recommendation: "春分人体阴阳平衡，养生重在“平”。寒热均衡，宜清淡，荤素配合。可以多走出户外放风筝、踏青，舒展筋骨以宣肺健脾。",
    climate: "南北气温平稳升高，降水丰沛。大地到处呈现出一片郁郁葱葱、欣欣向荣的蓬勃春光。",
    poetry: {
      title: "春分",
      author: "徐铉 [唐]",
      content: "仲春初四日，春色正中分。\n绿野徘徊自，红尘扰攘多。"
    },
    themeColor: "#84cc16",
    bgGradient: "from-green-900/60 via-slate-900 to-green-950/40",
    accentColor: "green-500"
  },
  {
    id: "qingming",
    name: "清明",
    englishName: "Pure Brightness",
    pinyin: "Qīngmíng",
    season: "spring",
    shadowLevel: 1,
    dates: "4月4日 - 4月6日",
    description: "清明，既是自然节气，也是传统节日。此时万物皆洁齐而清明，天地清朗，空气空灵。人们或扫墓祭祖缅怀先人，或踏青游玩亲近自然。",
    threePhases: ["桐始华 (白桐花开始绽放)", "田鼠化为鴽 (田鼠钻入地下，小鸟在林中歌唱，体现阴阳消长)", "虹始见 (雨后天晴，天空中开始出现瑰丽的彩虹)"],
    customs: ["扫墓祭祖 (缅怀先烈与祖先，表达慎终追远)", "踏青郊游 (在春光中拥抱大自然)", "吃青团 (艾草汁制成的糯米糕点，清香软糯)"],
    recommendation: "清明正是踏青赏春好时节，宜多步行。饮食宜温，减少寒凉，可食荠菜、菠菜、银耳。情绪宜舒缓开朗，戒暴怒以防肝火过旺。",
    climate: "气温转暖明显，清明时节雨纷纷，多蒙蒙细雨，空气清新潮湿，草木繁盛茂密。",
    poetry: {
      title: "清明",
      author: "杜牧 [唐]",
      content: "清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有？牧童遥指杏花村。"
    },
    themeColor: "#0d9488",
    bgGradient: "from-teal-900/60 via-slate-900 to-emerald-950/40",
    accentColor: "teal-500"
  },
  {
    id: "guyu",
    name: "谷雨",
    englishName: "Grain Rain",
    pinyin: "Gǔyǔ",
    season: "spring",
    shadowLevel: 0,
    dates: "4月19日 - 4月21日",
    description: "谷雨是春季的最后一个节气，意为“雨生百谷”。寒潮宣告结束，降雨量显著增加，农作物在这最后的春霖中疯长，樱桃红熟，牡丹吐蕊，暮春盛宴在此谢幕。",
    threePhases: ["萍始生 (浮萍在丰沛的池塘雨水里大量生长)", "鸣鸠拂其羽 (斑鸠抖动羽毛欢快啼叫)", "戴胜降于桑 (戴胜鸟飞落在桑树上，提示蚕农养蚕大忙)"],
    customs: ["品谷雨茶 (采摘清香明目去火的谷雨鲜茶)", "赏牡丹 (暮春时节牡丹盛开，故称谷雨花)", "祭祀仓颉 (感恩仓颉造字之功)"],
    recommendation: "谷雨湿温相夹，易发生风湿病或皮肤不适。饮食应以健脾祛湿为主，宜食鲫鱼、豆芽、黑豆。喝谷雨茶可明目祛火、消食祛湿。",
    climate: "气温升高迅速，降雨量明显增多，湿度较大。春将归去，江南漫山翠绿，北方杨柳絮飞扬。",
    poetry: {
      title: "谷雨",
      author: "朱槔 [宋]",
      content: "旅人游汲汲，天气雨生凉。\n叶底成阴绿，花梢带露忙。"
    },
    themeColor: "#047857",
    bgGradient: "from-emerald-900/60 via-slate-900 to-lime-950/40",
    accentColor: "emerald-600"
  },

  // --- SUMMER TERMS ---
  {
    id: "lixia",
    name: "立夏",
    englishName: "Beginning of Summer",
    pinyin: "Lìxià",
    season: "summer",
    shadowLevel: 5,
    dates: "5月5日 - 5月7日",
    description: "立夏，万物至此皆生长，宣告夏天的开端。温度快速攀升，绿树浓阴，蝉鸣渐起，大自然由春的温柔婉约彻底转变为夏的热烈与繁茂。",
    threePhases: ["蝼蝈鸣 (蝼蝈在夏夜的小河田坎边啼鸣)", "蚯蚓出 (蚯蚓感知地下温热，钻出泥土呼吸)", "王瓜生 (红色的王瓜藤蔓开始迅速生长延展)"],
    customs: ["立夏秤人 (称体重祈求夏季免受苦夏之累)", "尝新 (吃新鲜樱桃、青梅、蚕豆等首批鲜果)", "斗蛋/吃立夏蛋 (孩子们玩丝网套蛋)"],
    recommendation: "立夏属火，通于心。养生应以养心为主。饮食提倡清淡，多食绿豆、荷叶、大麦，多吃些苦味蔬菜如苦瓜，能清热防暑。宜子午双休。",
    climate: "全国大部分地区均已入夏，气温直线上升，雷雨天气明显变多，白昼时间变长。",
    poetry: {
      title: "立夏",
      author: "陆游 [宋]",
      content: "赤帜渐移云渐薄，绿阴初合麦初齐。\n一川芳草游人远，双燕飞来又乳溪。"
    },
    themeColor: "#f59e0b",
    bgGradient: "from-amber-900/60 via-slate-900 to-amber-950/40",
    accentColor: "amber-500"
  },
  {
    id: "xiaoman",
    name: "小满",
    englishName: "Lesser Fullness",
    pinyin: "Xiǎomǎn",
    season: "summer",
    shadowLevel: 4,
    dates: "5月20日 - 5月22日",
    description: "小满意指北方麦粒开始灌浆饱满，但尚未完全成熟；在南方，小满意味着雨水开始充盈盈满。此时物候繁荣，金黄的麦浪与丰盈的溪流勾勒出一幅知足常乐的丰收前奏。",
    threePhases: ["苦菜秀 (荒野或田埂上的小苦菜开始茂盛绽放)", "靡草死 (细软的喜阴野草不耐烈日暴晒大批枯死)", "麦秋至 (北方的小麦成熟季节开始来临，开始收割)"],
    customs: ["祭车神 (旧时农家祭祀水车车神)", "祭蚕 (感谢蚕丝始祖蚕神)", "尝苦菜 (吃苦苦菜清热解火)"],
    recommendation: "小满天气闷热、空气潮湿，极易发因湿热导致的皮肤红疹。宜多吃清凉祛湿之物，如薏仁、绿豆、冬瓜、胡萝卜。避免辛辣生冷暴汗。",
    climate: "气温持续走高，降雨范围更广，进入暴雨多发期。黄河中下游麦浪渐渐翻金黄。",
    poetry: {
      title: "归田园四首 其一",
      author: "晏殊 [宋]",
      content: "小满温和温度均，麦秋早晚播田畴。\n晴光淡淡摇风柳，绿野茫茫一水流。"
    },
    themeColor: "#eab308",
    bgGradient: "from-yellow-900/60 via-slate-900 to-yellow-950/40",
    accentColor: "yellow-500"
  },
  {
    id: "mangzhong",
    name: "芒种",
    englishName: "Grain in Ear",
    pinyin: "Mángzhòng",
    season: "summer",
    shadowLevel: 3,
    dates: "6月5日 - 6月7日",
    description: "芒种字面意思是“有芒的长麦急需收割，有谷的夏播作物急需播种”。这是一个既伴随收获又极富希望的辛劳时节，耕耘与收获并存，汗水洒满黄土地。",
    threePhases: ["螳螂生 (去年秋天产的螳螂卵破壳而出，小螳螂诞生)", "鵙始鸣 (鵙即伯劳鸟，在枝头发出响亮的鸣叫)", "反舌无声 (能模仿百鸟叫的反舌鸟停止了歌唱)"],
    customs: ["送花神 (向盛夏饯别花神，感恩花红叶绿)", "煮青梅 (梅子成熟，煮梅子酒)", "安苗 (祈求秋季家园丰收)"],
    recommendation: "芒种处于梅雨季节，午后暑热闷湿，人易疲乏口渴。宜饮食清淡，多食酸甘之物以生津，如乌梅、西红柿、桑葚、生姜，温水洗浴消散汗气。",
    climate: "多雨潮湿，气温高耸，长江流域进入著名的“梅雨”阶段，闷热难耐，雷雨不期而至。",
    poetry: {
      title: "芒种日雨",
      author: "范成大 [宋]",
      content: "芒种初过雨及时，纱幮睡起角巾欹。\n痴儿不知春已去，犹为杜鹃花流泪。"
    },
    themeColor: "#d97706",
    bgGradient: "from-amber-900/70 via-slate-900 to-amber-950/50",
    accentColor: "amber-600"
  },
  {
    id: "xiazhi",
    name: "夏至",
    englishName: "Summer Solstice",
    pinyin: "Xiàzhì",
    season: "summer",
    shadowLevel: 0,
    dates: "6月20日 - 6月22日",
    description: "夏至，这天太阳直射北回归线，是北半球白昼最长、黑夜最短的一天。光影在这一刻达到极致，也是日晷上手影最短的时刻。盛夏自此全面进入炽热深处。",
    threePhases: ["鹿角解 (鹿角属阳，夏至阳极生阴，鹿角开始脱落)", "蜩始鸣 (蜩即夏蝉，在葱郁的树梢声嘶力竭地鸣叫)", "半夏生 (半夏这种喜阴中药开始在野外沼地破土而出)"],
    customs: ["吃夏至面 (俗话说“冬至饺子夏至面”)", "赠扇与香囊以消暑排汗", "拜神祭祖表达丰收祈求"],
    recommendation: "夏至气温极高，阳气外泄。不可贪凉，慎吃寒冷冰水，宜常喝温开水。适量食用鸭肉、苦瓜、西瓜、绿茶，静心养性以避盛暑。",
    climate: "正午太阳高度达到一年之巅。多强对流阵雨，南方烈日似火，北方进入极暑滚烫炎热天气。",
    poetry: {
      title: "夏至避暑北池",
      author: "韦应物 [唐]",
      content: "昼晷已云极，宵漏自此长。\n未及清晓日，已厌烈日阳。"
    },
    themeColor: "#ef4444",
    bgGradient: "from-red-950/60 via-slate-900 to-red-900/40",
    accentColor: "red-500"
  },
  {
    id: "xiaoshu",
    name: "小暑",
    englishName: "Lesser Heat",
    pinyin: "Xiǎoshǔ",
    season: "summer",
    shadowLevel: 1,
    dates: "7月6日 - 7月8日",
    description: "小暑意为小热，盛夏的高温序幕由此拉开。大地上热浪扑面，虽还未到最热的“三伏天”，但空气中已经开始充满了蒸腾烦闷的灼热暑气。",
    threePhases: ["温风至 (风中吹来的尽是滚烫饱满的热流)", "蟋蟀居壁 (蟋蟀离开酷热的原野，躲进屋角阴凉处躲烈日)", "鹰始挚 (老鹰在极高温的对流空中盘旋捕猎)"],
    customs: ["尝新 (品尝新收获的大米五谷)", "晒衣晒书 (利用极强的太阳烈日杀菌驱潮)", "食芒果、饮凉茶消暑解渴"],
    recommendation: "小暑天气闷热潮湿，不宜剧烈运动，宜温和静养。多吃清热利湿排毒之品，如绿豆百合汤、冬瓜荷叶粥、莲子等。切忌大汗淋漓灌冷水。",
    climate: "气温继续升高，桑拿天明显。进入雷暴与台风逐渐活跃多发期，池塘里荷花盛开分外娇艳。",
    poetry: {
      title: "小暑",
      author: "元稹 [唐]",
      content: "倏忽温风至，因循小暑来。\n竹喧先觉雨，山暗欲发雷。"
    },
    themeColor: "#ea580c",
    bgGradient: "from-orange-900/60 via-slate-900 to-orange-950/40",
    accentColor: "orange-500"
  },
  {
    id: "dashu",
    name: "大暑",
    englishName: "Greater Heat",
    pinyin: "Dàshǔ",
    season: "summer",
    shadowLevel: 2,
    dates: "7月22日 - 7月24日",
    description: "大暑是二十四节气中的第十二个节气，也是一年中最炎热的时期。恰逢“中伏”，日照最猛烈、降水最丰沛。万物虽苦于燥热，但生机在滚烫大地上达到了最旺盛的顶点。",
    threePhases: ["腐草为萤 (腐烂落叶草木中，萤火虫翩翩飞舞)", "土润溽暑 (空气潮湿闷热，大地上泥土滚烫蒸腾)", "大雨时行 (时常有狂暴倾盆的雷阵雨和强对流雨消暑)"],
    customs: ["饮伏茶 (喝凉茶清热防暑)", "晒伏姜 (伏天晒生姜暖胃驱寒)", "吃仙草/烧仙草消热解毒"],
    recommendation: "大暑烈日如火，最易中暑。宜避烈日，多食生津消暑佳品，如西瓜、苦瓜、菊花茶。可用冬瓜薏米煲老鸭汤，清补脾胃，补足水分。",
    climate: "极度炎热，全国多雨闷热，“桑拿天”为主。午后雷阵雨来去匆匆，天边时有壮美虹桥。",
    poetry: {
      title: "大暑",
      author: "曾几 [宋]",
      content: "赤日几时过，清风无处寻。\n经书聊自慰，池塘水更深。"
    },
    themeColor: "#dc2626",
    bgGradient: "from-red-900/60 via-slate-900 to-red-950/50",
    accentColor: "red-600"
  },

  // --- AUTUMN TERMS ---
  {
    id: "liqiu",
    name: "立秋",
    englishName: "Beginning of Autumn",
    pinyin: "Lìqiū",
    season: "autumn",
    shadowLevel: 0,
    dates: "8月7日 - 8月9日",
    description: "立秋是秋季的开端，预示着酷暑将尽，秋凉将至。虽然“三伏天”尚未结束，大地上仍有余温，但落叶知秋，风中已隐隐拂过一丝极其细微的清爽与秋意。",
    threePhases: ["凉风至 (晨夕微风中隐隐有一丝爽凉之感)", "白露生 (清晨的大草叶片上开始凝聚出了微凉的晶莹露珠)", "寒蝉鸣 (寒蝉开始在树荫深处感知萧瑟唱出鸣叫)"],
    customs: ["贴秋膘 (吃红烧肉等肉食以滋补盛夏的消耗)", "啃秋 (立秋日吃西瓜防止苦夏和秋燥)", "晒秋 (农家晾晒红椒、玉米挂满房前屋后)"],
    recommendation: "立秋虽立，余暑未消。饮食开始需要注重滋阴润肺，宜多食蜂蜜、枇杷、百合、梨，少吃辛辣和寒凉，防止秋燥侵害呼吸和脾胃系统。",
    climate: "早晚温差增大，常有立秋暴雨。北方渐渐天高云淡，南方有些年份依然饱受秋老虎暴晒。",
    poetry: {
      title: "立秋",
      author: "刘翰 [宋]",
      content: "乳鸦啼散玉屏空，一榻凉生自作风。\n未觉池塘绿草尽，秋声先到翠尊中。"
    },
    themeColor: "#b45309",
    bgGradient: "from-amber-900/60 via-slate-900 to-neutral-950/40",
    accentColor: "amber-700"
  },
  {
    id: "chushu",
    name: "处暑",
    englishName: "End of Heat",
    pinyin: "Chǔshǔ",
    season: "autumn",
    shadowLevel: 1,
    dates: "8月22日 - 8月24日",
    description: "处暑意为“出暑”，标志着炎热酷暑的彻底终结。气温自此转入凉爽。此时天空纯净高远，北雁南飞，红叶染霜，正是秋高气爽游历山河的绝佳开始。",
    threePhases: ["鹰乃祭鸟 (老鹰开始大量捕猎鸟类堆放在林地上像祭祀)", "天地始肃 (万物凋零，大自然呈现一派秋季肃杀整洁气象)", "禾乃登 (玉米、红薯、谷稻等庄稼成熟，开始秋季大丰收)"],
    customs: ["吃鸭子 (处暑吃鸭，祛火温补)", "放河灯 (农历七月中元，放河灯悼念先人)", "开渔节 (海滨地区热烈开海捕鱼)"],
    recommendation: "出暑期间，温差显著，防秋燥为重。推荐润肺生津之物，如秋梨膏、鸭肉、银耳、萝卜，早睡早起以敛阳气，中午宜小憩以解秋乏困倦。",
    climate: "全国气温逐步下降。北方干燥高爽，天高云淡，江南晚香稻吐穗，雨水减少，空气沁凉宜人。",
    poetry: {
      title: "处暑",
      author: "仇远 [元]",
      content: "疾风驱急雨，残暑扫除空。\n因识凉飙意，还胜夏热风。"
    },
    themeColor: "#ca8a04",
    bgGradient: "from-yellow-900/60 via-slate-900 to-yellow-950/40",
    accentColor: "yellow-600"
  },
  {
    id: "bailu",
    name: "白露",
    englishName: "White Dew",
    pinyin: "Báilù",
    season: "autumn",
    shadowLevel: 2,
    dates: "9月7日 - 9月9日",
    description: "白露时节，水汽在清晨的荷叶与野草上凝结成一颗颗晶莹剔透的水珠。白露是秋季由温热向寒凉过度的天平支点，也是一年中最富有诗意、最清雅如画的节气。",
    threePhases: ["鸿雁来 (鸿雁大雁编排成人字雁阵南飞越冬)", "玄鸟归 (燕子告别北方屋檐，重回温暖的南方避寒)", "群鸟养羞 (各种小鸟开始在巢穴中积攒越冬的小野果坚果)"],
    customs: ["品白露茶 (享用回甘清爽的秋茶叶)", "饮白露酒 (苏浙农家自酿糯米清酒)", "吃红薯 (白露吃红薯防胃酸，滋养脾胃)"],
    recommendation: "白露时节温差急剧扩大，俗话说“白露身不露”，不能再光膀子以免受寒气。应注重增添衣物。多吃百合、杏仁、百合生梨粥以防秋燥秋寒流行。",
    climate: "气温下降极快，早晚温差高达10余度。晨有雾霜，秋草枯黄。天空极其澄澈碧蓝。",
    poetry: {
      title: "蒹葭 (节选)",
      author: "《诗经》",
      content: "蒹葭苍苍，白露为霜。\n所谓伊人，在水一方。"
    },
    themeColor: "#cbd5e1",
    bgGradient: "from-slate-800/60 via-slate-900 to-amber-950/40",
    accentColor: "slate-300"
  },
  {
    id: "qiufen",
    name: "秋分",
    englishName: "Autumn Equinox",
    pinyin: "Qiūfēn",
    season: "autumn",
    shadowLevel: 3,
    dates: "9月22日 - 9月24日",
    description: "秋分这天，太阳再次直射赤道，昼夜再次等长，平分秋季九十日。自此，太阳向南半球游走，北半球夜渐长，白昼渐短。秋色斑斓，处处成熟丰收，丹桂飘香，蟹肥菊黄。",
    threePhases: ["雷始收声 (秋雨连绵，滚滚春雷和夏电自此销声匿迹)", "蛰虫坯户 (冬眠的小虫开始吐丝黏泥筑墙封堵巢穴防寒)", "水始涸 (降雨骤减，池塘、溪流露出浅浅的乱石河床)"],
    customs: ["吃秋菜 (合家喝野苋菜汤)", "竖鸡蛋 (昼夜平分，重演立蛋神迹)", "祭月/拜月 (秋分圆月，感恩秋季丰收)"],
    recommendation: "秋分阴阳均平。应顺应自然变化，防凉防燥。宜食用百合、秋梨、山药、石榴，保养肺气，多在晴朗午后登高远眺，消除萧瑟悲秋之情。",
    climate: "气温明显微冷，北风渐紧。降雨减少。枫叶变红，漫山银杏金黄，大江南北进入繁忙的秋作秋收大忙。",
    poetry: {
      title: "晚晴",
      author: "杜甫 [唐]",
      content: "返照斜初彻，浮云薄未归。\n江虹明渐隐，秋分夜更微。"
    },
    themeColor: "#d97706",
    bgGradient: "from-amber-900/60 via-slate-900 to-orange-950/40",
    accentColor: "amber-600"
  },
  {
    id: "hanlu",
    name: "寒露",
    englishName: "Cold Dew",
    pinyin: "Hánlù",
    season: "autumn",
    shadowLevel: 4,
    dates: "10月7日 - 10月9日",
    description: "寒露时节，白露时的露珠已微冷冰凉，即将凝结成霜。寒气渐重，草木枯槁，残荷立水。但这也是柿子红熟、菊花盛开、秋蟹最是膏肥味美的金色佳期。",
    threePhases: ["鸿雁来宾 (最后一批南飞的小雁也全部抵达南方)", "雀入大水为蛤 (麻雀等不见了，海边出现花纹相似的花蛤)", "菊有黄华 (漫山野菊花开始迎着瑟瑟北风盛开怒放)"],
    customs: ["登高赏秋 (秋意虽冷，漫山遍野红叶美不胜收)", "赏菊/喝菊花茶 (菊花傲霜，赏心悦目)", "饮寒露茶、吃芝麻"],
    recommendation: "寒露时寒气由足起，不宜再赤脚，保护足部。饮食注意润肺养胃为主，宜食百合、沙参、麦冬，多吃红枣、山药、牛肉，少辛辣防内火燥热。",
    climate: "气温直线滑坡，夜凉侵骨。雨水绝少，艳阳在天，秋高气爽但深秋干燥刺骨，南方也开始明显变凉。",
    poetry: {
      title: "池上",
      author: "白居易 [唐]",
      content: "袅袅凉风动，凄凄寒露零。\n兰衰花始谢，荷破叶犹青。"
    },
    themeColor: "#84cc16",
    bgGradient: "from-lime-900/40 via-slate-900 to-slate-950/40",
    accentColor: "lime-500"
  },
  {
    id: "shuangjiang",
    name: "霜降",
    englishName: "Frost's Descent",
    pinyin: "Shuāngjiàng",
    season: "autumn",
    shadowLevel: 5,
    dates: "10月23日 - 10月24日",
    description: "霜降是秋季的最后一个节气，标志着秋天在此完美谢幕。大地由霜点墨，红叶落尽，朔风瑟瑟，一片大草原野开始呈现肃穆寂静之美，白霜降临在屋瓦和松针上。",
    threePhases: ["豺祭兽 (豺狼捕获大量野兽并整齐陈列准备越冬)", "草木黄落 (在严霜和冷北风下，枯黄叶片纷纷凋落归根)", "蛰虫咸俯 (地下蛰伏冬眠的小动物彻底低下头完全进入沉睡)"],
    customs: ["吃柿子 (俗话说“霜降吃柿子，冬天不冻嘴”)", "赏玩红叶 (观赏漫落红枫深秋美景)", "吃牛肉/进补 (防寒防冻，补中益气)"],
    recommendation: "霜降气候寒冷刺骨。宜补气益胃防秋寒入体。建议食用山药、百合、栗子、牛羊肉。晨练时间宜退迟，注意御寒，保护大膝关节不受风。建议泡脚。",
    climate: "寒潮大风天气骤增，白霜遍地。气温跌近冰点，草木凋落净尽，北方万木枯槁，江南枫叶似火红艳。",
    poetry: {
      title: "霜降",
      author: "钱镠 [五代]",
      content: "深秋林叶薄，大野白露寒。\n霜降冰始结，朝朝对镜看。"
    },
    themeColor: "#ea580c",
    bgGradient: "from-orange-950/50 via-slate-900 to-neutral-950/40",
    accentColor: "orange-600"
  },

  // --- WINTER TERMS ---
  {
    id: "lidong",
    name: "立冬",
    englishName: "Beginning of Winter",
    pinyin: "Lìdōng",
    season: "winter",
    shadowLevel: 0,
    dates: "11月7日 - 11月8日",
    description: "立冬，冬之伊始，万物避御寒冷而退避收藏。冬气初生，河水初凝，北风凛冽。人们开始添置冬装，备足薪火，祈愿在融融暖炉旁度过寂静深沉之冬。",
    threePhases: ["水始冰 (河流和池塘水面开始结出薄薄的透亮冰皮)", "地始冻 (由于寒气聚积，大地表层泥土开始冻结硬实)", "雉入大水为蜃 (雉鸟不见，海中吐贝，古人寄托造化玄幻)"],
    customs: ["吃饺子 (立冬吃饺子防止冻烂耳朵)", "补冬 (民间杀鸡炖肉，冬至大补气血)", "冬翻农田以杀虫防寒"],
    recommendation: "立冬养生重在“藏”。宜早卧晚起，必待日光，休养生息。饮食宜温补助阳，多吃牛羊肉、桂圆、黑芝麻，少吃冷食防止伤及阳气。",
    climate: "寒潮频发，气温骤降，北方多发生首场初雪。万物凋零，大草原野一片安详、沉静、肃穆。",
    poetry: {
      title: "立冬",
      author: "李白 [唐]",
      content: "冻笔新诗懒写，寒炉美酒时温。\n醉看墨花月白，黄昏独步微云。"
    },
    themeColor: "#3b82f6",
    bgGradient: "from-blue-900/60 via-slate-900 to-sky-950/40",
    accentColor: "blue-500"
  },
  {
    id: "xiaoxue",
    name: "小雪",
    englishName: "Lesser Snow",
    pinyin: "Xiǎoxuě",
    season: "winter",
    shadowLevel: 1,
    dates: "11月21日 - 11月23日",
    description: "小雪时节，寒北风凛冽，开始出现降雪。雪点细碎随北风飘落，落地即化，虽未积雪成原，但是这莹莹雪花却给苍茫萧瑟的严冬大地点缀了一丝无比冰莹纯洁的情致。",
    threePhases: ["虹藏不见 (因为天空几乎不再落雷雨下虹，彩虹彻底消失)", "天气上升地气下降 (天气回归高空地气回归土中，阴阳不解)", "闭塞而成冬 (天地闭塞，万物沉寂，彻底陷入寒冷冬季)"],
    customs: ["腌咸菜 (利用严寒腌制小青菜等越冬)", "吃糍粑 (南方农家打糍粑、吃年糕)", "晒鱼干/腊肉以防潮防变质"],
    recommendation: "小雪气候阴冷干燥，易生内火郁闷。应多吃黑色食物滋养肾脏，如黑木耳、黑豆、芝麻。早睡晚起，温热水泡脚，保持积极乐观、心境平和昂扬。",
    climate: "寒北强风增多，气温持续降到零度以下，长江以北广大地区迎来如梦如幻的初雪飘飞。",
    poetry: {
      title: "小雪",
      author: "戴叔伦 [唐]",
      content: "花雪随风不厌看，更多还落画屏间。\n孤舟夜钓蓑衣湿，唯听清溪水潺声。"
    },
    themeColor: "#60a5fa",
    bgGradient: "from-indigo-900/60 via-slate-900 to-indigo-950/40",
    accentColor: "indigo-400"
  },
  {
    id: "daxue",
    name: "大雪",
    englishName: "Greater Snow",
    pinyin: "Dàxuě",
    season: "winter",
    shadowLevel: 2,
    dates: "12月6日 - 12月8日",
    description: "大雪标志着隆冬的深入。冷北狂风卷雪，大雪封山。雪原苍苍，银装素裹。虽然大地被冻至严实沉睡，但雪里已孕育着梅花的清香，大地上蕴藏着丰年的美好期冀。",
    threePhases: ["鶡鴠不鸣 (鶡鴠夜啼感知寒冷至极，停止了聒噪啼叫)", "虎始交 (猛虎在极阴之中感应纯阳之萌生，开始求偶配对)", "荔挺出 (荔草即马蔺兰在深厚白雪中悄然吐出绿丝针叶)"],
    customs: ["积雪兆丰年 (观赏大雪)", "吃红薯粥 (喝热锅红枣红薯粥御寒)", "制作咸肉灌肠腌制品"],
    recommendation: "大雪寒凛异常，最要保护身体经络防寒。应保暖头、项、腰不被侵袭。适度温补，多吃栗子、核桃、白薯，喝温热老母鸡汤。适度有氧快走。",
    climate: "暴雪频发，极寒突袭。大地积雪，华北乃至南方大部分山区呈现壮丽璀璨的世界银白纯净之美。",
    poetry: {
      title: "江雪",
      author: "柳宗元 [唐]",
      content: "千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。"
    },
    themeColor: "#93c5fd",
    bgGradient: "from-sky-900/60 via-slate-900 to-slate-950/40",
    accentColor: "sky-300"
  },
  {
    id: "xiaohan",
    name: "小寒",
    englishName: "Lesser Cold",
    pinyin: "Xiǎohán",
    season: "winter",
    shadowLevel: 4,
    dates: "1月5日 - 1月7日",
    description: "小寒，标志着一年中极寒的“三九天”到来。寒潮袭人，数九寒天。然而，小寒也是一年由终向新岁过渡的使者。腊梅在严寒中静静吐蕊，爆竹红火，年味在白茫茫的雾雪间慢慢升腾。",
    threePhases: ["雁北乡 (大雁开始集结，感知极其微弱的春天阳气回归)", "鹊始巢 (喜鹊感应阳气，开始顶着严寒在枯树中树枝筑巢)", "雉始雊 (野雉山鸡在皑皑白雪中高亢啼叫，呼唤春雷)"],
    customs: ["吃腊八粥 (合家熬制腊八五谷热粥)", "吃糯米饭 (南方小寒吃香糯米饭暖胃御寒)", "采腊梅花装点清雅厅堂"],
    recommendation: "小寒极冷，阴寒之极。建议多加姜、羊肉、红枣炖汤。多吃核桃、山药。早卧晚起，保持温煦的微汗快步运动，切不可大汗淋漓被冷风吹散正气。",
    climate: "气温持续在一年低谷。北风刺骨。天寒地冻，池塘河流水被完全冰封结为厚重透明的冰块。",
    poetry: {
      title: "小寒临",
      author: "黄庚 [元]",
      content: "一阳渐复天心转，节物惊心更小寒。\n梅影横斜溪月白，数声爆竹透云湍。"
    },
    themeColor: "#38bdf8",
    bgGradient: "from-cyan-900/60 via-slate-900 to-cyan-950/40",
    accentColor: "cyan-400"
  },
  {
    id: "dahan",
    name: "大寒",
    englishName: "Greater Cold",
    pinyin: "Dàhán",
    season: "winter",
    shadowLevel: 3,
    dates: "1月20日 - 1月21日",
    description: "大寒，是二十四节气的终章，也是一年中最寒切、最凛冽的节气。大寒至顶点，冬将尽，春将信。旧岁在此圆满谢幕，冰河深处暗流涌动，暖暖新春已在红灯高挂的欢笑声里含苞欲放。",
    threePhases: ["鸡乳 (母鸡感知春气，开始孵化新生命雏鸡)", "征鸟厉疾 (老鹰捕杀禽鸟的动作变得极其迅捷凶猛越冬)", "水泽腹坚 (高寒结冻，冰层一直冻入江河中心腹地最坚厚)"],
    customs: ["除旧迎新/扫尘 (合家洒扫庭院、除旧迎新)", "买年货 (采办春联红灯年纸)", "吃腊八粥、尾牙聚餐感恩岁末"],
    recommendation: "大寒时岁末，养生由“封藏”向“宣泄”平缓转轨。可适量少摄入过咸温补多食酸甘如山楂，保护心阳，睡前必须热水双脚，情绪保暖，满心欢喜准备迎接春天。",
    climate: "天寒地冻，中国大部分地区冰雪深重。冰挂树枝千树雪，而红梅和春联在大地白皑皑中爆出热闹光彩。",
    poetry: {
      title: "大寒吟",
      author: "邵雍 [宋]",
      content: "大寒至极春何暮，极寒深处阳自生。\n松柏青葱承雪意，岁华安享乐天情。"
    },
    themeColor: "#3b82f6",
    bgGradient: "from-blue-950/60 via-slate-900 to-zinc-950/40",
    accentColor: "blue-600"
  },
  {
    id: "dongzhi",
    name: "冬至",
    englishName: "Winter Solstice",
    pinyin: "Dōngzhì",
    season: "winter",
    shadowLevel: 5,
    dates: "12月21日 - 12月23日",
    description: "冬至这天，太阳直射南回归线，是北半球白昼最短、黑夜最长的一天。日晷上的影子在这一刻达到了全年中最为绵长、幽远的极致。阴气极高、阳气始生，大自然在此进入最深沉的转折点。",
    threePhases: ["蚯蚓结 (喜温的蚯蚓在冻土深处交缠冻结成团)", "麋角解 (麋角属阴，冬至感一阳生而解下麋角换新)", "水泉动 (在坚硬冰层之下，温暖的地下泉水开始暗自涌动)"],
    customs: ["吃饺子 (北方有防冻耳朵的吃饺子大俗)", "吃汤圆 (南方吃彩色小粘汤圆寓意合家大团圆)", "祭天拜祖 (国家和家族隆重设祭祀感恩丰收)"],
    recommendation: "冬至一阳生，是阴阳交替大黄金保健日。最宜静养闭藏，切忌房劳、暴怒或超强度剧烈暴汗。应食用桂圆红枣黑鸡汤、饺子或牛羊肉生姜热汤补虚扶正。",
    climate: "进入“数九寒天”，冷气透骨，天寒地冻，万物闭藏。白昼由此平缓延长。",
    poetry: {
      title: "冬至",
      author: "杜甫 [唐]",
      content: "年年至日长为客，忽忽穷愁泥杀人。\n江上形容吾独老，天边风俗自相亲。"
    },
    themeColor: "#0284c7",
    bgGradient: "from-slate-900/80 via-slate-900 to-sky-950/40",
    accentColor: "sky-500"
  }
];

export const seasonsData = {
  spring: {
    name: "春",
    nameFull: "青春首度 · 暖春发生",
    color: "emerald",
    desc: "立春起，谷雨结。阳气苏醒，东风解冻，万物发生生机蓬勃。",
    themeColor: "#10b981",
    terms: ["lichun", "yushui", "jingzhe", "chunfen", "qingming", "guyu"]
  },
  summer: {
    name: "夏",
    nameFull: "朱明盛景 · 盛夏繁华",
    color: "amber",
    desc: "立夏起，大暑结。赤帜移云，骄阳如火，生命狂飙壮丽茁壮。",
    themeColor: "#f59e0b",
    terms: ["lixia", "xiaoman", "mangzhong", "xiazhi", "xiaoshu", "dashu"]
  },
  autumn: {
    name: "秋",
    nameFull: "金秋素商 · 金色收获",
    color: "orange",
    desc: "立秋起，霜降结。天高气爽，露珠凝白，红枫飘零万山丰饶。",
    themeColor: "#ea580c",
    terms: ["liqiu", "chushu", "bailu", "qiufen", "hanlu", "shuangjiang"]
  },
  winter: {
    name: "冬",
    nameFull: "玄冬闭藏 · 岁末深沉",
    color: "blue",
    desc: "立冬起，大寒结。天寒地冻，水始结冰，万物闭藏守岁守新。",
    themeColor: "#3b82f6",
    terms: ["lidong", "xiaoxue", "daxue", "dongzhi", "xiaohan", "dahan"]
  }
};
