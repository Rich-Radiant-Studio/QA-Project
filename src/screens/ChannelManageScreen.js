import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 地区数据（与首页保持一致）
const regionData = {
  countries: ['美国', '英国', '法国', '德国', '意大利', '西班牙', '荷兰', '瑞士', '瑞典', '挪威', '丹麦', '芬兰', '比利时', '奥地利', '葡萄牙', '希腊', '波兰', '捷克', '爱尔兰', '匈牙利', '罗马尼亚'],
  cities: { 
    '美国': ['纽约州', '加利福尼亚州', '德克萨斯州', '佛罗里达州', '伊利诺伊州', '宾夕法尼亚州', '俄亥俄州', '华盛顿州', '马萨诸塞州', '亚利桑那州'],
    '英国': ['伦敦', '曼彻斯特', '伯明翰', '利物浦', '爱丁堡', '格拉斯哥', '布里斯托', '利兹', '谢菲尔德', '纽卡斯尔'], 
    '法国': ['巴黎', '马赛', '里昂', '图卢兹', '尼斯', '南特', '斯特拉斯堡', '蒙彼利埃', '波尔多', '里尔'],
    '德国': ['柏林', '慕尼黑', '汉堡', '法兰克福', '科隆', '斯图加特', '杜塞尔多夫', '多特蒙德', '埃森', '莱比锡'],
    '意大利': ['罗马', '米兰', '那不勒斯', '都灵', '佛罗伦萨', '威尼斯', '博洛尼亚', '热那亚', '巴勒莫', '维罗纳'],
    '西班牙': ['马德里', '巴塞罗那', '瓦伦西亚', '塞维利亚', '萨拉戈萨', '马拉加', '毕尔巴鄂', '格拉纳达', '阿利坎特', '科尔多瓦'],
    '荷兰': ['阿姆斯特丹', '鹿特丹', '海牙', '乌得勒支', '埃因霍温', '蒂尔堡', '格罗宁根', '阿尔梅勒', '布雷达', '奈梅亨'],
    '瑞士': ['苏黎世', '日内瓦', '巴塞尔', '伯尔尼', '洛桑', '卢塞恩', '圣加仑', '卢加诺', '比尔', '图恩'],
    '瑞典': ['斯德哥尔摩', '哥德堡', '马尔默', '乌普萨拉', '韦斯特罗斯', '厄勒布鲁', '林雪平', '赫尔辛堡', '延雪平', '诺尔雪平'],
    '挪威': ['奥斯陆', '卑尔根', '特隆赫姆', '斯塔万格', '克里斯蒂安桑', '腓特烈斯塔', '特罗姆瑟', '桑内斯', '德拉门', '阿伦达尔'],
    '丹麦': ['哥本哈根', '奥胡斯', '欧登塞', '奥尔堡', '埃斯比约', '罗斯基勒', '科灵', '霍森斯', '赫尔辛格', '腓特烈堡'],
    '芬兰': ['赫尔辛基', '埃斯波', '坦佩雷', '万塔', '奥卢', '图尔库', '于韦斯屈莱', '拉赫蒂', '库奥皮奥', '波里'],
    '比利时': ['布鲁塞尔', '安特卫普', '根特', '沙勒罗瓦', '列日', '布鲁日', '那慕尔', '鲁汶', '蒙斯', '梅赫伦'],
    '奥地利': ['维也纳', '格拉茨', '林茨', '萨尔茨堡', '因斯布鲁克', '克拉根福', '菲拉赫', '韦尔斯', '圣珀尔滕', '多恩比恩'],
    '葡萄牙': ['里斯本', '波尔图', '布拉加', '科英布拉', '丰沙尔', '塞图巴尔', '吉马良斯', '阿尔马达', '阿威罗', '埃武拉'],
    '希腊': ['雅典', '塞萨洛尼基', '帕特雷', '伊拉克利翁', '拉里萨', '沃洛斯', '罗德岛', '约阿尼纳', '哈尼亚', '哈尔基斯'],
    '波兰': ['华沙', '克拉科夫', '罗兹', '弗罗茨瓦夫', '波兹南', '格但斯克', '什切青', '比得哥什', '卢布林', '卡托维兹'],
    '捷克': ['布拉格', '布尔诺', '俄斯特拉发', '比尔森', '利贝雷茨', '奥洛穆茨', '乌斯季', '赫拉德茨', '帕尔杜比采', '哈维若夫'],
    '爱尔兰': ['都柏林', '科克', '利默里克', '戈尔韦', '沃特福德', '德罗赫达', '邓多克', '斯沃兹', '布雷', '恩尼斯'],
    '匈牙利': ['布达佩斯', '德布勒森', '塞格德', '米什科尔茨', '佩奇', '杰尔', '尼赖吉哈佐', '凯奇凯梅特', '塞克什白堡', '松博特海伊'],
    '罗马尼亚': ['布加勒斯特', '克卢日', '蒂米什瓦拉', '雅西', '康斯坦察', '克拉约瓦', '布拉索夫', '加拉茨', '普洛耶什蒂', '布勒伊拉']
  },
  states: { 
    '纽约州': ['纽约市', '布法罗', '罗切斯特', '扬克斯', '锡拉丘兹', '奥尔巴尼', '新罗谢尔', '弗农山', '斯克内克塔迪', '尤蒂卡'],
    '加利福尼亚州': ['洛杉矶', '圣地亚哥', '圣何塞', '旧金山', '弗雷斯诺', '萨克拉门托', '长滩', '奥克兰', '贝克斯菲尔德', '阿纳海姆'],
    '德克萨斯州': ['休斯顿', '圣安东尼奥', '达拉斯', '奥斯汀', '沃思堡', '埃尔帕索', '阿灵顿', '科珀斯克里斯蒂', '普莱诺', '拉雷多'],
    '佛罗里达州': ['杰克逊维尔', '迈阿密', '坦帕', '奥兰多', '圣彼得堡', '海厄利亚', '塔拉哈西', '劳德代尔堡', '彭布罗克派恩斯', '好莱坞'],
    '伊利诺伊州': ['芝加哥', '奥罗拉', '罗克福德', '乔利埃特', '内珀维尔', '斯普林菲尔德', '皮奥里亚', '埃尔金', '沃基根', '西塞罗'],
    '宾夕法尼亚州': ['费城', '匹兹堡', '阿伦敦', '伊利', '雷丁', '斯克兰顿', '贝瑟利恒', '兰开斯特', '哈里斯堡', '阿尔图纳'],
    '俄亥俄州': ['哥伦布', '克利夫兰', '辛辛那提', '托莱多', '阿克伦', '代顿', '帕尔马', '扬斯敦', '坎顿', '洛雷恩'],
    '华盛顿州': ['西雅图', '斯波坎', '塔科马', '温哥华', '贝尔维尤', '肯特', '埃弗里特', '伦顿', '斯波坎谷', '联邦路'],
    '马萨诸塞州': ['波士顿', '伍斯特', '斯普林菲尔德', '洛厄尔', '剑桥', '新贝德福德', '布罗克顿', '昆西', '林恩', '福尔里弗'],
    '亚利桑那州': ['凤凰城', '图森', '梅萨', '钱德勒', '格伦代尔', '斯科茨代尔', '吉尔伯特', '坦佩', '皮奥里亚', '惊奇城'],
    '伦敦': ['威斯敏斯特', '肯辛顿', '切尔西', '卡姆登', '伊斯灵顿', '哈克尼', '陶尔哈姆莱茨', '格林威治', '刘易舍姆', '南华克'], 
    '曼彻斯特': ['市中心', '索尔福德', '特拉福德', '斯托克波特', '奥尔德姆', '罗奇代尔', '博尔顿', '伯里', '维根', '坦姆赛德'],
    '巴黎': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区', '第11区', '第12区', '第13区', '第14区', '第15区', '第16区', '第17区', '第18区', '第19区', '第20区'],
    '马赛': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区', '第11区', '第12区', '第13区', '第14区', '第15区', '第16区'],
    '柏林': ['米特区', '腓特烈斯海因-克罗伊茨贝格区', '潘科区', '夏洛滕堡-威尔默斯多夫区', '施潘道区', '施特格利茨-策伦多夫区', '滕珀尔霍夫-舍讷贝格区', '新克尔恩区', '特雷普托-克珀尼克区', '马灿-海勒斯多夫区', '利希滕贝格区', '赖尼肯多夫区'],
    '慕尼黑': ['老城区', '路德维希郊区-伊萨尔郊区', '马克斯郊区', '施瓦宾-西区', '奥区-海德豪森区', '森德灵区', '森德灵-西公园区', '施瓦宾-弗赖曼区', '米尔贝茨霍芬-哈特区', '博根豪森区'],
    '罗马': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区', '第11区', '第12区', '第13区', '第14区', '第15区'],
    '米兰': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区'],
    '马德里': ['中心区', '阿尔甘苏埃拉区', '雷蒂罗区', '萨拉曼卡区', '查马丁区', '特图安区', '钱贝里区', '富恩卡拉尔-埃尔帕尔多区', '蒙克洛亚-阿拉瓦卡区', '拉蒂纳区'],
    '巴塞罗那': ['老城区', '扩建区', '圣马丁区', '圣安德鲁区', '蒙特惠奇区', '格拉西亚区', '奥尔塔-吉那尔多区', '诺坎普区', '圣马丁区', '莱斯科尔茨区'],
    '阿姆斯特丹': ['中心区', '西区', '新西区', '南区', '东区', '北区', '东南区', '西波特区'],
    '苏黎世': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区', '第11区', '第12区'],
    '斯德哥尔摩': ['南马尔姆区', '北马尔姆区', '奥斯特马尔姆区', '库恩斯霍尔门区', '瓦萨斯坦区', '索德马尔姆区', '恩斯克德区', '法鲁斯塔区', '布罗马区', '哈格斯特拉区'],
    '奥斯陆': ['中心区', '格吕内洛卡区', '马约尔斯图恩区', '圣汉斯豪根区', '托尔斯霍夫区', '萨格内区', '弗罗格纳区', '乌勒恩区', '诺德斯特兰德区', '阿尔纳区'],
    '哥本哈根': ['内城区', '克里斯蒂安港区', '韦斯特布罗区', '诺雷布罗区', '奥斯特布罗区', '腓特烈堡区', '比斯佩比约区', '瓦尔比区', '阿迈厄岛区', '布隆斯霍伊区'],
    '赫尔辛基': ['南区', '北区', '中区', '东区', '东南区', '西区', '东北区'],
    '布鲁塞尔': ['布鲁塞尔市', '安德莱赫特', '奥德海姆', '埃特尔贝克', '埃弗勒', '福雷', '甘斯豪伦', '伊克塞尔', '于克勒', '科克尔贝赫'],
    '维也纳': ['内城区', '利奥波德城区', '兰德施特拉瑟区', '维登区', '玛格丽特区', '玛丽亚希尔夫区', '诺伊鲍区', '约瑟夫施塔特区', '阿尔瑟格伦德区', '法沃里滕区'],
    '里斯本': ['圣玛丽亚马约尔区', '米塞里科迪亚区', '圣维森特区', '坎波德奥里克区', '阿雷罗斯区', '埃斯特雷拉区', '贝伦区', '阿尔坎塔拉区', '阿茹达区', '本菲卡区'],
    '雅典': ['中心区', '北区', '南区', '西区', '比雷埃夫斯区', '东阿提卡区', '西阿提卡区'],
    '华沙': ['中心区', '莫科托夫区', '奥霍塔区', '普拉加波卢德涅区', '普拉加波沃茨涅区', '瓦沃拉区', '维拉努夫区', '乌尔西努夫区', '维索基马佐维茨基区', '贝莫沃区'],
    '布拉格': ['布拉格1区', '布拉格2区', '布拉格3区', '布拉格4区', '布拉格5区', '布拉格6区', '布拉格7区', '布拉格8区', '布拉格9区', '布拉格10区'],
    '都柏林': ['都柏林1区', '都柏林2区', '都柏林3区', '都柏林4区', '都柏林5区', '都柏林6区', '都柏林7区', '都柏林8区', '都柏林9区', '都柏林10区'],
    '布达佩斯': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区', '第11区', '第12区', '第13区', '第14区', '第15区'],
    '布加勒斯特': ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区']
  },
  districts: { 
    '纽约市': ['曼哈顿', '布鲁克林', '皇后区', '布朗克斯', '史坦顿岛'],
    '洛杉矶': ['好莱坞', '比佛利山庄', '圣莫尼卡', '威尼斯', '市中心', '银湖', '回声公园', '韦斯特伍德', '布伦特伍德', '帕萨迪纳'],
    '芝加哥': ['卢普区', '林肯公园', '威克公园', '湖景', '洛根广场', '海德公园', '南环', '西环', '北环', '河北'],
    '威斯敏斯特': ['科文特花园', '梅费尔', '圣詹姆斯', '贝尔格拉维亚', '皮姆利科', '帕丁顿', '马里波恩'], 
    '肯辛顿': ['南肯辛顿', '诺丁山', '荷兰公园', '伯爵宫', '切尔西'], 
    '第1区': ['卢浮宫', '旺多姆广场', '协和广场', '杜乐丽花园'],
    '第8区': ['香榭丽舍大街', '凯旋门', '爱丽舍宫', '玛德莱娜教堂'],
    '米特区': ['亚历山大广场', '勃兰登堡门', '博物馆岛', '波茨坦广场'],
    '老城区': ['玛利亚广场', '新市政厅', '圣母教堂', '维克图阿连市场']
  }
};

// 简化的频道数据 - 只保留两级分类
const channelData = {
  country: ['政策法规', '社会民生', '经济发展', '环境保护', '基础设施'],
  industry: ['互联网', '金融', '医疗健康', '教育培训', '房地产', '制造业'],
  personal: ['职场', '科技', '健康', '教育', '美食', '情感', '旅游', '娱乐']
};

export default function ChannelManageScreen({ navigation }) {
  // 我的频道
  const [myChannels, setMyChannels] = useState(['政策法规', '互联网', '职场', '科技']);
  
  // 组合频道创建
  const [showComboCreator, setShowComboCreator] = useState(true);
  const [comboName, setComboName] = useState('');
  const [comboStep, setComboStep] = useState('region'); // 'region' 或 'category'
  const [regionStep, setRegionStep] = useState(0); // 0:国家 1:省份 2:城市 3:区域
  const [comboSelection, setComboSelection] = useState({
    country: null,
    province: null,
    city: null,
    district: null,
    categoryType: null, // 'country', 'industry', 'personal'
    category: null
  });
  const [myComboChannels, setMyComboChannels] = useState([
    { id: 1, name: '纽约互联网', path: '美国>纽约州>纽约市>曼哈顿>行业问题>互联网' }
  ]);

  // 切换频道订阅
  const toggleChannel = (channel) => {
    if (myChannels.includes(channel)) {
      setMyChannels(myChannels.filter(c => c !== channel));
    } else {
      setMyChannels([...myChannels, channel]);
    }
  };

  // 组合频道选择逻辑
  const getRegionOptions = () => {
    switch(regionStep) {
      case 0: // 国家列表
        return regionData.countries.map(name => ({ name }));
      case 1: // 省份/州列表
        if (comboSelection.country) {
          const cities = regionData.cities[comboSelection.country.name] || [];
          return cities.map(name => ({ name }));
        }
        return [];
      case 2: // 城市列表
        if (comboSelection.province) {
          const states = regionData.states[comboSelection.province.name] || [];
          return states.map(name => ({ name }));
        }
        return [];
      case 3: // 区域列表
        if (comboSelection.city) {
          const districts = regionData.districts[comboSelection.city.name] || [];
          return districts.map(name => ({ name }));
        }
        return [];
      default: 
        return [];
    }
  };

  const getCategoryOptions = () => {
    if (!comboSelection.categoryType) {
      return [
        { id: 'country', name: '国家问题', icon: 'flag', color: '#3b82f6' },
        { id: 'industry', name: '行业问题', icon: 'briefcase', color: '#22c55e' },
        { id: 'personal', name: '个人问题', icon: 'person', color: '#8b5cf6' }
      ];
    }
    
    // 返回对应类型的频道列表
    if (comboSelection.categoryType === 'country') return channelData.country.map(name => ({ name }));
    if (comboSelection.categoryType === 'industry') return channelData.industry.map(name => ({ name }));
    if (comboSelection.categoryType === 'personal') return channelData.personal.map(name => ({ name }));
    return [];
  };

  const selectRegionOption = (option) => {
    const newSelection = { ...comboSelection };
    
    switch(regionStep) {
      case 0: // 选择国家
        newSelection.country = option;
        newSelection.province = null;
        newSelection.city = null;
        newSelection.district = null;
        // 检查是否有下一层数据
        if (regionData.cities[option.name] && regionData.cities[option.name].length > 0) {
          setRegionStep(1);
        }
        break;
      case 1: // 选择省份/州
        newSelection.province = option;
        newSelection.city = null;
        newSelection.district = null;
        // 检查是否有下一层数据
        if (regionData.states[option.name] && regionData.states[option.name].length > 0) {
          setRegionStep(2);
        }
        break;
      case 2: // 选择城市
        newSelection.city = option;
        newSelection.district = null;
        // 检查是否有下一层数据
        if (regionData.districts[option.name] && regionData.districts[option.name].length > 0) {
          setRegionStep(3);
        }
        break;
      case 3: // 选择区域
        newSelection.district = option.name;
        break;
    }
    
    setComboSelection(newSelection);
  };

  const selectCategoryOption = (option) => {
    const newSelection = { ...comboSelection };
    
    if (!comboSelection.categoryType) {
      // 选择分类类型
      newSelection.categoryType = option.id;
      newSelection.category = null;
    } else {
      // 选择具体分类
      newSelection.category = option;
    }
    
    setComboSelection(newSelection);
  };

  const goToCategory = () => {
    setComboStep('category');
  };

  const backToRegion = () => {
    setComboStep('region');
    setComboSelection({
      ...comboSelection,
      categoryType: null,
      category: null
    });
  };

  const createComboChannel = () => {
    if (!comboName.trim()) {
      Alert.alert('提示', '请输入组合频道名称');
      return;
    }
    
    const { categoryType, category } = comboSelection;
    if (!categoryType || !category) {
      Alert.alert('提示', '请选择分类');
      return;
    }

    const pathParts = [];
    const { country, province, city, district } = comboSelection;
    
    // 添加区域路径（如果有选择）
    if (country) pathParts.push(country.name);
    if (province) pathParts.push(province.name);
    if (city) pathParts.push(city.name);
    if (district) pathParts.push(district);
    
    // 添加分类路径
    const typeNames = { country: '国家问题', industry: '行业问题', personal: '个人问题' };
    pathParts.push(typeNames[categoryType]);
    pathParts.push(category.name);

    const newCombo = {
      id: Date.now(),
      name: comboName,
      path: pathParts.join('>')
    };

    setMyComboChannels([...myComboChannels, newCombo]);
    
    // 重置
    setComboName('');
    setComboStep('region');
    setRegionStep(0);
    setComboSelection({
      country: null,
      province: null,
      city: null,
      district: null,
      categoryType: null,
      category: null
    });
    setShowComboCreator(false);
    Alert.alert('成功', '组合频道创建成功！');
  };

  const getSelectedPath = () => {
    const { country, province, city, district, categoryType, category } = comboSelection;
    const parts = [];
    
    if (country) parts.push(country.name);
    if (province) parts.push(province.name);
    if (city) parts.push(city.name);
    if (district) parts.push(district);
    
    if (categoryType) {
      const typeNames = { country: '国家问题', industry: '行业问题', personal: '个人问题' };
      parts.push(typeNames[categoryType]);
    }
    if (category) parts.push(category.name);
    
    return parts.length > 0 ? parts.join(' > ') : '未选择';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>频道管理</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert('保存成功', '频道订阅已更新');
          navigation.goBack();
        }} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={styles.saveBtn}>完成</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 我的频道 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="star" size={18} color="#f59e0b" />
            <Text style={styles.sectionTitle}>我的频道</Text>
          </View>
          <View style={styles.myChannelsContainer}>
            {myChannels.map((channel, index) => (
              <View key={index} style={styles.myChannelTag}>
                <Text style={styles.myChannelText}>{channel}</Text>
                <TouchableOpacity onPress={() => toggleChannel(channel)} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                  <Ionicons name="close-circle" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 国家问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flag" size={18} color="#3b82f6" />
            <Text style={styles.sectionTitle}>国家问题</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.country.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 行业问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="briefcase" size={18} color="#22c55e" />
            <Text style={styles.sectionTitle}>行业问题</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.industry.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 个人问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person" size={18} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>个人问题</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.personal.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 组合频道 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="layers" size={16} color="#8b5cf6" /> 组合频道
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowComboCreator(!showComboCreator)}
            >
              <Ionicons name={showComboCreator ? "remove-circle" : "add-circle"} size={20} color="#8b5cf6" />
              <Text style={styles.addBtnText}>{showComboCreator ? '收起' : '展开'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionNote}>
            组合频道可以将地理位置（国家-省份-城市-区域）和问题类型（国家/行业/个人问题及其子类别）组合，创建更精准的频道
          </Text>

          {/* 创建组合频道表单 */}
          {showComboCreator && (
            <View style={styles.comboCreator}>
              <Text style={styles.comboDesc}>第一步：选择区域（可选），第二步：选择分类（必选）</Text>
              
              <TextInput
                style={styles.comboInput}
                placeholder="输入组合频道名称（例如：北京互联网）"
                value={comboName}
                onChangeText={setComboName}
                placeholderTextColor="#9ca3af"
              />
              
              {/* 步骤指示器 */}
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, comboStep === 'region' && styles.stepDotActive]}>
                  <Text style={[styles.stepDotText, comboStep === 'region' && styles.stepDotTextActive]}>1</Text>
                </View>
                <View style={[styles.stepLine, comboStep === 'category' && styles.stepLineActive]} />
                <View style={[styles.stepDot, comboStep === 'category' && styles.stepDotActive]}>
                  <Text style={[styles.stepDotText, comboStep === 'category' && styles.stepDotTextActive]}>2</Text>
                </View>
              </View>
              
              <View style={styles.comboSteps}>
                <View style={styles.comboStepHeader}>
                  <Text style={styles.comboStepTitle}>
                    {comboStep === 'region' ? '步骤1: 选择区域（可选）' : '步骤2: 选择分类（必选）'}
                  </Text>
                </View>
                <Text style={styles.comboPath}>已选: {getSelectedPath()}</Text>
                
                <ScrollView style={styles.comboOptions} nestedScrollEnabled>
                  {comboStep === 'region' ? (
                    // 区域选择
                    getRegionOptions().map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.comboOption}
                        onPress={() => selectRegionOption(option)}
                      >
                        <Text style={styles.comboOptionText}>
                          {typeof option === 'string' ? option : option.name}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    ))
                  ) : (
                    // 分类选择
                    getCategoryOptions().map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.comboOption,
                          option.icon && styles.comboOptionWithIcon
                        ]}
                        onPress={() => selectCategoryOption(option)}
                      >
                        {option.icon && (
                          <View style={[styles.categoryIcon, { backgroundColor: option.color + '20' }]}>
                            <Ionicons name={option.icon} size={18} color={option.color} />
                          </View>
                        )}
                        <Text style={styles.comboOptionText}>{option.name}</Text>
                        {/* 只有在选择分类类型时才显示箭头，选择具体分类时不显示 */}
                        {!comboSelection.categoryType && (
                          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>

                <View style={styles.comboActions}>
                  {comboStep === 'region' ? (
                    <>
                      {regionStep > 0 && (
                        <TouchableOpacity
                          style={styles.comboBackBtn}
                          onPress={() => {
                            setRegionStep(regionStep - 1);
                            const newSelection = { ...comboSelection };
                            if (regionStep === 1) newSelection.country = null;
                            if (regionStep === 2) newSelection.province = null;
                            if (regionStep === 3) newSelection.city = null;
                            setComboSelection(newSelection);
                          }}
                        >
                          <Ionicons name="arrow-back" size={16} color="#6b7280" />
                          <Text style={styles.comboBackText}>上一步</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.comboNextBtn}
                        onPress={goToCategory}
                      >
                        <Text style={styles.comboNextText}>下一步：选择分类</Text>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.comboBackBtn}
                        onPress={() => {
                          if (comboSelection.categoryType) {
                            // 返回到分类类型选择
                            setComboSelection({
                              ...comboSelection,
                              categoryType: null,
                              category: null
                            });
                          } else {
                            // 返回到区域选择
                            backToRegion();
                          }
                        }}
                      >
                        <Ionicons name="arrow-back" size={16} color="#6b7280" />
                        <Text style={styles.comboBackText}>上一步</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.comboCreateBtn,
                          (!comboName.trim() || !comboSelection.category) && styles.comboCreateBtnDisabled
                        ]}
                        onPress={createComboChannel}
                        disabled={!comboName.trim() || !comboSelection.category}
                      >
                        <Text style={styles.comboCreateText}>创建频道</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* 已创建的组合频道 */}
          <View style={styles.comboList}>
            {myComboChannels.map((combo) => (
              <View key={combo.id} style={styles.comboItem}>
                <View style={styles.comboItemContent}>
                  <Text style={styles.comboItemName}>{combo.name}</Text>
                  <Text style={styles.comboItemPath}>{combo.path}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setMyComboChannels(myComboChannels.filter(c => c.id !== combo.id));
                }}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', flex: 1, textAlign: 'center' },
  saveBtn: { fontSize: 16, color: '#ef4444', fontWeight: '600' },
  content: { flex: 1 },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 8
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  
  // 我的频道样式
  myChannelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  myChannelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6
  },
  myChannelText: {
    fontSize: 15,
    color: '#374151'
  },
  
  // 频道网格样式
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  channelTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6
  },
  channelText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '400'
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionNote: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addBtnText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500'
  },
  comboCreator: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  comboDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18
  },
  comboInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12
  },
  comboSteps: {
    marginTop: 8
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 60
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepDotActive: {
    backgroundColor: '#8b5cf6'
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af'
  },
  stepDotTextActive: {
    color: '#fff'
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 6
  },
  stepLineActive: {
    backgroundColor: '#8b5cf6'
  },
  comboStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  comboStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  skipBtnText: {
    fontSize: 12,
    color: '#8b5cf6'
  },
  comboPath: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 8
  },
  comboOptions: {
    maxHeight: 200,
    marginBottom: 12
  },
  comboOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 4
  },
  comboOptionWithIcon: {
    paddingVertical: 8
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  comboOptionText: {
    flex: 1,
    fontSize: 13,
    color: '#374151'
  },
  comboActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  comboBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  comboBackText: {
    fontSize: 13,
    color: '#6b7280'
  },
  comboNextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 6
  },
  comboNextText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600'
  },
  comboCreateBtn: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center'
  },
  comboCreateBtnDisabled: {
    backgroundColor: '#d8b4fe',
    opacity: 0.6
  },
  comboCreateText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600'
  },
  comboList: {
    marginTop: 12,
    gap: 8
  },
  comboItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f3ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff'
  },
  comboItemContent: {
    flex: 1
  },
  comboItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4
  },
  comboItemPath: {
    fontSize: 11,
    color: '#8b5cf6'
  }
});
