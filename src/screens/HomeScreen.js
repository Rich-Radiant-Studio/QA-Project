import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, Dimensions, TextInput, FlatList, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Avatar from '../components/Avatar';

const { width: screenWidth } = Dimensions.get('window');

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程?有没有系统的学习路线推荐?', type: 'reward', reward: 50, likes: 128, dislikes: 12, answers: 56, shares: 34, bookmarks: 89, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop', solvedPercent: 65, country: '中国', city: '北京' },
  { id: 2, title: '第一次养猫需要准备什么?有哪些新手容易踩的坑?', type: 'paid', paidAmount: 9.9, likes: 256, dislikes: 8, answers: 89, shares: 56, bookmarks: 120, author: '李小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'], solvedPercent: 80, country: '美国', city: '纽约', isPaid: false },
  { id: 3, title: '长期失眠应该怎么调理?吃褪黑素有用吗?求专业医生解答', type: 'targeted', likes: 512, dislikes: 5, answers: 234, shares: 78, bookmarks: 156, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天 18:30', verified: true, solvedPercent: 45, country: '日本', city: '东京' },
  { id: 4, title: '35岁程序员如何规划职业发展?是继续技术深耕还是转管理?', type: 'reward', reward: 100, likes: 1200, dislikes: 23, answers: 456, shares: 234, bookmarks: 567, author: '程序员小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', solvedPercent: 30, country: '中国', city: '上海' },
  { id: 5, title: '有什么简单又好吃的家常菜推荐?最好是新手也能做的那种', type: 'free', likes: 368, dislikes: 6, answers: 127, shares: 45, bookmarks: 98, author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', time: '6小时前', images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'], solvedPercent: 92, country: '英国', city: '伦敦' },
];

const tabs = ['关注', '话题', '推荐', '热榜', '收入榜', '同城', '国家', '行业', '个人', '职场', '教育'];

// 话题数据
const topicsData = [
  { id: 1, name: '#Python学习', icon: 'code-slash', color: '#3b82f6', followers: '25.6万', questions: '12.3万', description: '分享Python学习经验和技巧', isFollowed: true },
  { id: 2, name: '#家常菜谱', icon: 'restaurant', color: '#f97316', followers: '18.9万', questions: '8.6万', description: '美味家常菜做法分享', isFollowed: false },
  { id: 3, name: '#职业发展', icon: 'briefcase', color: '#8b5cf6', followers: '32.1万', questions: '15.8万', description: '职场经验与职业规划', isFollowed: true },
  { id: 4, name: '#健康养生', icon: 'fitness', color: '#22c55e', followers: '45.2万', questions: '21.3万', description: '健康生活方式分享', isFollowed: false },
  { id: 5, name: '#数码科技', icon: 'phone-portrait', color: '#06b6d4', followers: '28.7万', questions: '13.5万', description: '数码产品评测与讨论', isFollowed: true },
  { id: 6, name: '#旅游攻略', icon: 'airplane', color: '#ec4899', followers: '22.4万', questions: '10.2万', description: '旅游经验与攻略分享', isFollowed: false },
  { id: 7, name: '#理财投资', icon: 'cash', color: '#f59e0b', followers: '19.8万', questions: '9.5万', description: '理财知识与投资经验', isFollowed: true },
  { id: 8, name: '#摄影技巧', icon: 'camera', color: '#6366f1', followers: '16.3万', questions: '7.8万', description: '摄影技术交流与作品分享', isFollowed: false },
  { id: 9, name: '#读书笔记', icon: 'book', color: '#14b8a6', followers: '14.7万', questions: '6.9万', description: '读书心得与好书推荐', isFollowed: true },
  { id: 10, name: '#运动健身', icon: 'barbell', color: '#ef4444', followers: '38.5万', questions: '18.6万', description: '健身经验与运动技巧', isFollowed: false },
];

// 区域数据
const regionData = {
  countries: ['英国', '法国', '德国', '意大利', '西班牙', '荷兰', '瑞士', '瑞典', '挪威', '丹麦', '芬兰', '比利时', '奥地利', '葡萄牙', '希腊', '波兰', '捷克', '爱尔兰', '匈牙利', '罗马尼亚'],
  cities: { 
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
    '威斯敏斯特': ['科文特花园', '梅费尔', '圣詹姆斯', '贝尔格拉维亚', '皮姆利科', '帕丁顿', '马里波恩'], 
    '肯辛顿': ['南肯辛顿', '诺丁山', '荷兰公园', '伯爵宫', '切尔西'], 
    '第1区': ['卢浮宫', '旺多姆广场', '协和广场', '杜乐丽花园'],
    '第8区': ['香榭丽舍大街', '凯旋门', '爱丽舍宫', '玛德莱娜教堂'],
    '米特区': ['亚历山大广场', '勃兰登堡门', '博物馆岛', '波茨坦广场'],
    '老城区': ['玛利亚广场', '新市政厅', '圣母教堂', '维克图阿连市场']
  }
};

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('推荐');
  const [likedItems, setLikedItems] = useState({});
  const [bookmarkedItems, setBookmarkedItems] = useState({});
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialSearchText, setSocialSearchText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [regionStep, setRegionStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState({ country: '', city: '', state: '', district: '' });
  
  // 话题关注状态
  const [topicFollowState, setTopicFollowState] = useState({});
  
  // 列表状态
  const [questionList, setQuestionList] = useState(questions);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  



  // 同城筛选状态
  const [localCity, setLocalCity] = useState('北京');
  const [localFilter, setLocalFilter] = useState('最新');
  const [showCityModal, setShowCityModal] = useState(false);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [nearbyDistance, setNearbyDistance] = useState('3公里');
  const [citySelectStep, setCitySelectStep] = useState(0); // 0:国家 1:省份 2:城市
  const [selectedCityRegion, setSelectedCityRegion] = useState({ country: '中国', state: '北京市', city: '北京' });

  // 同城地区数据
  const cityRegionData = {
    countries: ['中国', '美国', '日本', '英国', '韩国', '澳大利亚', '加拿大'],
    states: {
      '中国': ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '陕西省'],
      '美国': ['加利福尼亚州', '纽约州', '德克萨斯州', '佛罗里达州', '华盛顿州'],
      '日本': ['东京都', '大阪府', '京都府', '北海道', '神奈川县'],
      '英国': ['英格兰', '苏格兰', '威尔士', '北爱尔兰'],
      '韩国': ['首尔特别市', '釜山广域市', '仁川广域市', '京畿道'],
      '澳大利亚': ['新南威尔士州', '维多利亚州', '昆士兰州'],
      '加拿大': ['安大略省', '魁北克省', '不列颠哥伦比亚省']
    },
    cities: {
      '北京市': ['北京'],
      '上海市': ['上海'],
      '广东省': ['广州', '深圳', '东莞', '佛山', '珠海'],
      '浙江省': ['杭州', '宁波', '温州', '嘉兴'],
      '江苏省': ['南京', '苏州', '无锡', '常州'],
      '四川省': ['成都', '绵阳', '德阳'],
      '湖北省': ['武汉', '宜昌', '襄阳'],
      '陕西省': ['西安', '咸阳', '宝鸡'],
      '加利福尼亚州': ['洛杉矶', '旧金山', '圣地亚哥'],
      '纽约州': ['纽约', '布法罗', '奥尔巴尼'],
      '德克萨斯州': ['休斯顿', '达拉斯', '奥斯汀'],
      '佛罗里达州': ['迈阿密', '奥兰多', '坦帕'],
      '华盛顿州': ['西雅图', '塔科马'],
      '东京都': ['东京'],
      '大阪府': ['大阪'],
      '京都府': ['京都'],
      '北海道': ['札幌', '函馆'],
      '神奈川县': ['横滨', '川崎'],
      '英格兰': ['伦敦', '曼彻斯特', '伯明翰', '利物浦'],
      '苏格兰': ['爱丁堡', '格拉斯哥'],
      '威尔士': ['加的夫'],
      '北爱尔兰': ['贝尔法斯特'],
      '首尔特别市': ['首尔'],
      '釜山广域市': ['釜山'],
      '仁川广域市': ['仁川'],
      '京畿道': ['水原', '城南'],
      '新南威尔士州': ['悉尼', '纽卡斯尔'],
      '维多利亚州': ['墨尔本'],
      '昆士兰州': ['布里斯班', '黄金海岸'],
      '安大略省': ['多伦多', '渥太华'],
      '魁北克省': ['蒙特利尔', '魁北克城'],
      '不列颠哥伦比亚省': ['温哥华', '维多利亚']
    }
  };



  // 同城功能
  const getCitySelectOptions = () => {
    if (citySelectStep === 0) return cityRegionData.countries;
    if (citySelectStep === 1) return cityRegionData.states[selectedCityRegion.country] || [];
    if (citySelectStep === 2) return cityRegionData.cities[selectedCityRegion.state] || [];
    return [];
  };

  const getCitySelectTitle = () => ['选择国家', '选择省份', '选择城市'][citySelectStep];

  const selectCityRegion = (value) => {
    if (citySelectStep === 0) {
      setSelectedCityRegion({ ...selectedCityRegion, country: value, state: '', city: '' });
      setCitySelectStep(1);
    } else if (citySelectStep === 1) {
      setSelectedCityRegion({ ...selectedCityRegion, state: value, city: '' });
      setCitySelectStep(2);
    } else {
      setSelectedCityRegion({ ...selectedCityRegion, city: value });
      setLocalCity(value);
      setShowCityModal(false);
      setCitySelectStep(0);
    }
  };

  const closeCityModal = () => {
    setShowCityModal(false);
    setCitySelectStep(0);
  };

  // 紧急求助状态
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({ title: '', description: '', location: '', contact: '' });
  const freeCount = 3; // 每日免费次数
  const usedCount = 0; // 已使用次数
  const remainingFree = freeCount - usedCount;

  // 下拉刷新
  const onRefresh = async () => {
    setRefreshing(true);
    // 模拟API请求
    setTimeout(() => {
      // 重置数据
      setQuestionList(questions);
      setPage(1);
      setHasMore(true);
      setRefreshing(false);
    }, 1500);
  };

  // 上拉加载更多
  const onLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // 模拟API请求
    setTimeout(() => {
      const nextPage = page + 1;
      // 模拟加载更多数据，这里复制现有数据并修改id
      const moreData = questions.map((item, index) => ({
        ...item,
        id: item.id + nextPage * 100 + index,
      }));
      
      setQuestionList([...questionList, ...moreData]);
      setPage(nextPage);
      
      // 模拟到第3页就没有更多数据了
      if (nextPage >= 3) {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 1500);
  };

  // 渲染底部组件
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color="#ef4444" />
          <Text style={styles.footerText}>加载中...</Text>
        </View>
      );
    }
    
    if (!hasMore) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>没有更多内容了</Text>
        </View>
      );
    }
    
    return null;
  };

  // 问题类型和类别数据
  const questionTypes = ['国家问题', '行业问题', '个人问题'];
  const categoryData = {
    '国家问题': ['政策法规', '社会民生', '经济发展', '教育医疗', '环境保护', '基础设施'],
    '行业问题': ['互联网', '金融', '制造业', '医疗健康', '教育培训', '房地产', '餐饮服务'],
    '个人问题': ['职业发展', '情感生活', '健康养生', '理财投资', '学习成长', '家庭关系']
  };

  // 社交平台用户数据
  const socialUsers = {
    twitter: [
      { id: 1, name: 'Python大神', handle: '@python_master', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tw1', followers: '12.5万' },
      { id: 2, name: '技术博主', handle: '@tech_blogger', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tw2', followers: '8.3万' },
      { id: 3, name: '编程达人', handle: '@code_expert', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tw3', followers: '5.6万' },
      { id: 4, name: '数据分析师', handle: '@data_analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tw4', followers: '3.2万' },
    ],
    facebook: [
      { id: 1, name: 'Python学习组', handle: 'Python Learning', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fb1', followers: '25万' },
      { id: 2, name: '程序员社区', handle: 'Dev Community', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fb2', followers: '18万' },
      { id: 3, name: '技术问答', handle: 'Tech Q&A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fb3', followers: '9.8万' },
      { id: 4, name: '编程入门', handle: 'Coding Beginner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fb4', followers: '6.5万' },
    ]
  };

  const openSocialModal = (platform) => {
    setSocialPlatform(platform);
    setSocialSearchText('');
    setShowActionModal(false);
    setShowSocialModal(true);
  };

  const sendSocialMessage = (user) => {
    alert(`已向 ${user.name} 发送私信,邀请回答问题:${selectedQuestion?.title?.substring(0, 30)}...`);
    setShowSocialModal(false);
  };

  const filteredSocialUsers = socialUsers[socialPlatform]?.filter(user =>
    user.name.toLowerCase().includes(socialSearchText.toLowerCase()) ||
    user.handle.toLowerCase().includes(socialSearchText.toLowerCase())
  ) || [];

  const toggleLike = (id) => setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleBookmark = (id) => setBookmarkedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFollowTopic = (topicId) => setTopicFollowState(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;

  const openActionModal = (item) => { setSelectedQuestion(item); setShowActionModal(true); };

  const getRegionOptions = () => {
    if (regionStep === 0) return regionData.countries;
    if (regionStep === 1) return regionData.cities[selectedRegion.country] || [];
    if (regionStep === 2) return regionData.states[selectedRegion.city] || [];
    if (regionStep === 3) return regionData.districts[selectedRegion.state] || [];
    return [];
  };

  const selectRegion = (value) => {
    if (regionStep === 0) { 
      setSelectedRegion({ ...selectedRegion, country: value, city: '', state: '', district: '' }); 
      // 自动跳转到下一层
      if (regionData.cities[value] && regionData.cities[value].length > 0) {
        setRegionStep(1);
      }
    }
    else if (regionStep === 1) { 
      setSelectedRegion({ ...selectedRegion, city: value, state: '', district: '' }); 
      // 自动跳转到下一层
      if (regionData.states[value] && regionData.states[value].length > 0) {
        setRegionStep(2);
      }
    }
    else if (regionStep === 2) { 
      setSelectedRegion({ ...selectedRegion, state: value, district: '' }); 
      // 自动跳转到下一层
      if (regionData.districts[value] && regionData.districts[value].length > 0) {
        setRegionStep(3);
      }
    }
    else { 
      setSelectedRegion({ ...selectedRegion, district: value }); 
    }
  };

  const getRegionTitle = () => ['选择国家', '选择城市', '选择省份', '选择区'][regionStep];
  const getDisplayRegion = () => {
    const parts = [selectedRegion.country, selectedRegion.city, selectedRegion.state, selectedRegion.district].filter(Boolean);
    // 只显示最后一级，如果没有选择则显示"全球"
    if (parts.length === 0) return '全球';
    return parts[parts.length - 1];
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.regionBtn}
          onPress={() => setShowRegionModal(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="location-outline" size={16} color="#ef4444" />
          <Text style={styles.regionText} numberOfLines={1} ellipsizeMode="tail">{getDisplayRegion()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={16} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>搜索问题、话题或用户</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.teamBtn}
          onPress={() => navigation.navigate('MyTeams')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="people-circle-outline" size={24} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notifyBtn}
          onPress={() => navigation.navigate('Messages')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#4b5563" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => {
                if (tab === '关注') {
                  navigation.navigate('Follow');
                } else if (tab === '热榜') {
                  navigation.navigate('HotList');
                } else if (tab === '收入榜') {
                  navigation.navigate('IncomeRanking');
                } else {
                  setActiveTab(tab);
                }
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.tabMenuBtn} onPress={() => navigation.navigate('ChannelManage')}>
          <Ionicons name="menu" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* 社交媒体按钮 - 显示在关注tab下方 */}
      <View style={[styles.socialButtonsBar, { display: activeTab === '关注' ? 'flex' : 'none' }]}>
        <TouchableOpacity style={styles.socialButton} onPress={() => openSocialModal('twitter')}>
          <FontAwesome5 name="twitter" size={16} color="#1DA1F2" />
          <Text style={styles.socialButtonText}>@推特</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => openSocialModal('facebook')}>
          <FontAwesome5 name="facebook" size={16} color="#4267B2" />
          <Text style={styles.socialButtonText}>@Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* 问题卡片列表 */}
      {activeTab !== '话题' ? (
        <View style={styles.listContainer}>
          <FlashList
            data={questionList}
            estimatedItemSize={300}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#ef4444']}
                tintColor="#ef4444"
              />
            }
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.3}
            ListHeaderComponent={() => (
              /* 同城筛选条 */
              <View style={[styles.localFilterBar, { display: activeTab === '同城' ? 'flex' : 'none' }]}>
                <View style={styles.localFilterRow}>
                  <TouchableOpacity style={styles.localFilterItem} onPress={() => setShowCityModal(true)}>
                    <View style={[styles.localFilterIcon, { backgroundColor: '#e0f2fe' }]}>
                      <Ionicons name="navigate" size={22} color="#0ea5e9" />
                    </View>
                    <Text style={styles.localFilterLabel}>切换位置</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => setLocalFilter('最新')}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="time" size={22} color="#f59e0b" />
                    </View>
                    <Text style={[styles.localFilterLabel, localFilter === '最新' && styles.localFilterLabelActive]}>最新</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => setLocalFilter('最热')}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="flame" size={22} color="#f59e0b" />
                    </View>
                    <Text style={[styles.localFilterLabel, localFilter === '最热' && styles.localFilterLabelActive]}>最热</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => { setLocalFilter('附近'); setShowNearbyModal(true); }}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="location" size={22} color="#ef4444" />
                    </View>
                    <Text style={[styles.localFilterLabel, localFilter === '附近' && styles.localFilterLabelActive]}>附近</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => setShowEmergencyModal(true)}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="alert-circle" size={22} color="#ef4444" />
                    </View>
                    <Text style={styles.localFilterLabel}>紧急求助</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          ListFooterComponent={renderFooter}
          renderItem={({ item, index }) => {
            const isLiked = likedItems[item.id];
            const isFirstItem = index === 0;
            const isLastItem = index === questionList.length - 1;
            return (
              <TouchableOpacity style={[styles.questionCard, isFirstItem && styles.firstQuestionCard]} onPress={() => navigation.navigate('QuestionDetail', { id: item.id })}>
                <View style={[styles.questionCardInner, isLastItem && styles.lastQuestionCardInner]}>
                  {/* 问题标题 */}
                  <View style={styles.questionTitleContainer}>
                    {item.type === 'reward' && item.reward && (
                      <View style={styles.rewardTagInline}>
                        <Text style={styles.rewardTagText}>${item.reward}</Text>
                      </View>
                    )}
                    {item.type === 'targeted' && (
                      <View style={styles.targetedTagInline}>
                        <Text style={styles.targetedTagText}>定向</Text>
                      </View>
                    )}
                    {item.type === 'paid' && (
                      <View style={styles.paidTagInline}>
                        <Ionicons name="lock-closed" size={10} color="#fff" />
                        <Text style={styles.paidTagText}>付费</Text>
                      </View>
                    )}
                    <Text style={styles.questionTitle}>{item.title}</Text>
                  </View>

                  {/* 付费查看按钮 */}
                  {item.type === 'paid' && !item.isPaid && (
                    <TouchableOpacity 
                      style={styles.paidViewButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        alert(`支付 $${item.paidAmount} 查看完整内容`);
                      }}
                    >
                      <View style={styles.paidViewContent}>
                        <Ionicons name="lock-closed-outline" size={20} color="#f59e0b" />
                        <Text style={styles.paidViewText}>付费查看完整内容</Text>
                      </View>
                      <View style={styles.paidViewPrice}>
                        <Text style={styles.paidViewPriceText}>${item.paidAmount}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#f59e0b" />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* 图片 */}
                  {item.image && <Image source={{ uri: item.image }} style={styles.singleImage} resizeMode="cover" />}
                  {item.images && item.images.length > 0 && (
                    <View style={styles.imagesContainer}>
                      {/* 1张图片：大图显示 */}
                      {item.images.length === 1 && (
                        <Image source={{ uri: item.images[0] }} style={styles.singleImage} resizeMode="cover" />
                      )}
                      
                      {/* 2张图片：左右各一张 */}
                      {item.images.length === 2 && (
                        <View style={styles.twoImagesGrid}>
                          <Image source={{ uri: item.images[0] }} style={styles.twoImageItem} resizeMode="cover" />
                          <Image source={{ uri: item.images[1] }} style={styles.twoImageItem} resizeMode="cover" />
                        </View>
                      )}
                      
                      {/* 3张图片：横向三张 */}
                      {item.images.length === 3 && (
                        <View style={styles.threeImagesGrid}>
                          <Image source={{ uri: item.images[0] }} style={styles.threeImageItem} resizeMode="cover" />
                          <Image source={{ uri: item.images[1] }} style={styles.threeImageItem} resizeMode="cover" />
                          <Image source={{ uri: item.images[2] }} style={styles.threeImageItem} resizeMode="cover" />
                        </View>
                      )}
                      
                      {/* 4张图片：2x2网格 */}
                      {item.images.length === 4 && (
                        <View style={styles.fourImagesGrid}>
                          {item.images.map((img, idx) => (
                            <Image key={idx} source={{ uri: img }} style={styles.fourImageItem} resizeMode="cover" />
                          ))}
                        </View>
                      )}
                      
                      {/* 5-6张图片：3列布局 */}
                      {item.images.length >= 5 && item.images.length <= 6 && (
                        <View style={styles.multiImagesGrid}>
                          {item.images.map((img, idx) => (
                            <Image key={idx} source={{ uri: img }} style={styles.multiImageItem} resizeMode="cover" />
                          ))}
                        </View>
                      )}
                      
                      {/* 7-9张图片：3x3网格 */}
                      {item.images.length >= 7 && item.images.length <= 9 && (
                        <View style={styles.nineImagesGrid}>
                          {item.images.slice(0, 9).map((img, idx) => (
                            <Image key={idx} source={{ uri: img }} style={styles.nineImageItem} resizeMode="cover" />
                          ))}
                        </View>
                      )}
                      
                      {/* 超过9张：显示前9张，最后一张显示+N */}
                      {item.images.length > 9 && (
                        <View style={styles.nineImagesGrid}>
                          {item.images.slice(0, 8).map((img, idx) => (
                            <Image key={idx} source={{ uri: img }} style={styles.nineImageItem} resizeMode="cover" />
                          ))}
                          <View style={styles.moreImagesWrapper}>
                            <Image source={{ uri: item.images[8] }} style={styles.nineImageItem} resizeMode="cover" />
                            <View style={styles.moreImagesOverlay}>
                              <Text style={styles.moreImagesText}>+{item.images.length - 8}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* 头像、姓名、时间、地区 - 全部放在一行,右侧放点赞和评论 */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Avatar uri={item.avatar} name={item.author} size={24} />
                      <Text style={styles.authorName}>{item.author}</Text>
                      {item.verified && <Ionicons name="checkmark-circle" size={10} color="#3b82f6" style={{ marginLeft: 2 }} />}
                      <Text style={styles.metaSeparator}>·</Text>
                      <Text style={styles.postTime}>{item.time}</Text>
                      <Text style={styles.metaSeparator}>·</Text>
                      <Ionicons name="location-outline" size={9} color="#9ca3af" />
                      <Text style={styles.locationText}>{item.country} · {item.city}</Text>
                    </View>
                    <View style={styles.cardHeaderRight}>
                      <TouchableOpacity style={styles.headerActionBtn} onPress={() => toggleLike(item.id)}>
                        <Ionicons name={isLiked ? "thumbs-up" : "thumbs-up-outline"} size={14} color={isLiked ? "#ef4444" : "#9ca3af"} />
                        <Text style={[styles.headerActionText, isLiked && { color: '#ef4444' }]}>{formatNumber(item.likes + (isLiked ? 1 : 0))}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.headerActionBtn}>
                        <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                        <Text style={styles.headerActionText}>{item.answers}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.headerMoreBtn} onPress={() => openActionModal(item)}>
                        <Ionicons name="ellipsis-horizontal" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      ) : (
        /* 话题列表 */
        <ScrollView style={styles.topicsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.topicsSection}>
            {topicsData.map(topic => {
              const isFollowed = topic.isFollowed !== undefined ? topic.isFollowed : false;
              const currentFollowState = topicFollowState[topic.id];
              const displayFollowed = currentFollowState !== undefined ? currentFollowState : isFollowed;
              
              return (
                <TouchableOpacity key={topic.id} style={styles.topicCard}>
                  <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
                    <Ionicons name={topic.icon} size={24} color={topic.color} />
                  </View>
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicName}>{topic.name}</Text>
                    <Text style={styles.topicDesc}>{topic.description}</Text>
                    <Text style={styles.topicStats}>{topic.followers} 关注 · {topic.questions} 问题</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.topicFollowBtn, displayFollowed && styles.topicFollowBtnActive]}
                    onPress={() => toggleFollowTopic(topic.id)}
                  >
                    <Text style={[styles.topicFollowBtnText, displayFollowed && styles.topicFollowBtnTextActive]}>
                      {displayFollowed ? '已关注' : '+ 关注'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* 区域选择弹窗 */}
      <Modal visible={showRegionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.regionModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => { setShowRegionModal(false); setRegionStep(0); }}>
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>选择区域</Text>
              <TouchableOpacity onPress={() => { 
                setShowRegionModal(false);
                setRegionStep(0);
              }}>
                <Text style={styles.confirmText}>确定</Text>
              </TouchableOpacity>
            </View>
            
            {/* 面包屑导航 */}
            <View style={styles.breadcrumbContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.breadcrumbScrollContent}>
                <TouchableOpacity 
                  style={styles.breadcrumbItem}
                  onPress={() => setRegionStep(0)}
                >
                  <Text style={[styles.breadcrumbText, regionStep === 0 && styles.breadcrumbTextActive]}>
                    {selectedRegion.country || '国家'}
                  </Text>
                </TouchableOpacity>
                
                {selectedRegion.country && (
                  <>
                    <View style={styles.breadcrumbSeparatorWrapper}>
                      <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
                    </View>
                    <TouchableOpacity 
                      style={styles.breadcrumbItem}
                      onPress={() => setRegionStep(1)}
                    >
                      <Text style={[styles.breadcrumbText, regionStep === 1 && styles.breadcrumbTextActive]}>
                        {selectedRegion.city}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                
                {selectedRegion.city && selectedRegion.state && (
                  <>
                    <View style={styles.breadcrumbSeparatorWrapper}>
                      <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
                    </View>
                    <TouchableOpacity 
                      style={styles.breadcrumbItem}
                      onPress={() => setRegionStep(2)}
                    >
                      <Text style={[styles.breadcrumbText, regionStep === 2 && styles.breadcrumbTextActive]}>
                        {selectedRegion.state}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                
                {selectedRegion.state && selectedRegion.district && (
                  <>
                    <View style={styles.breadcrumbSeparatorWrapper}>
                      <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
                    </View>
                    <TouchableOpacity 
                      style={styles.breadcrumbItem}
                      onPress={() => setRegionStep(3)}
                    >
                      <Text style={[styles.breadcrumbText, regionStep === 3 && styles.breadcrumbTextActive]}>
                        {selectedRegion.district}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
            
            <ScrollView style={styles.regionList}>
              {getRegionOptions().map((option, idx) => (
                <TouchableOpacity key={idx} style={styles.regionOption} onPress={() => selectRegion(option)}>
                  <Text style={styles.regionOptionText}>{option}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 三个点操作弹窗 */}
      <Modal visible={showActionModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionModal(false)}>
          <View style={styles.actionModal}>
            <View style={styles.actionModalHandle} />
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="thumbs-down-outline" size={22} color="#6b7280" />
              <Text style={styles.actionItemText}>踩一下</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="arrow-redo-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>分享 ({formatNumber(selectedQuestion?.shares || 0)})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { if (selectedQuestion) toggleBookmark(selectedQuestion.id); setShowActionModal(false); }}>
              <Ionicons name={selectedQuestion && bookmarkedItems[selectedQuestion.id] ? "bookmark" : "star-outline"} size={22} color={selectedQuestion && bookmarkedItems[selectedQuestion.id] ? "#f59e0b" : "#1f2937"} />
              <Text style={styles.actionItemText}>收藏 ({formatNumber(selectedQuestion?.bookmarks || 0)})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setShowActionModal(false); navigation.navigate('GroupChat', { question: selectedQuestion }); }}>
              <Ionicons name="people-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>加入群聊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setShowActionModal(false); alert('加入团队功能'); }}>
              <Ionicons name="people-circle-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>加入团队</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setShowActionModal(false); navigation.navigate('QuestionDetail', { id: selectedQuestion?.id, openAnswerModal: true }); }}>
              <Ionicons name="create-outline" size={22} color="#ef4444" />
              <Text style={[styles.actionItemText, { color: '#ef4444' }]}>写回答</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="add-circle-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>补充问题</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setShowActionModal(false); navigation.navigate('Activity', { question: selectedQuestion }); }}>
              <Ionicons name="calendar-outline" size={22} color="#22c55e" />
              <Text style={styles.actionItemText}>发起活动</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => openSocialModal('twitter')}>
              <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
              <Text style={styles.actionItemText}>@推特</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => openSocialModal('facebook')}>
              <FontAwesome5 name="facebook" size={20} color="#4267B2" />
              <Text style={styles.actionItemText}>@Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionItem, styles.reportItem]}>
              <Ionicons name="flag-outline" size={22} color="#ef4444" />
              <Text style={[styles.actionItemText, { color: '#ef4444' }]}>举报</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowActionModal(false)}>
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 社交平台用户选择弹窗 */}
      <Modal visible={showSocialModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.socialModal}>
            <View style={styles.socialHeader}>
              <TouchableOpacity onPress={() => setShowSocialModal(false)}>
                <Ionicons name="arrow-back" size={24} color="#1f2937" />
              </TouchableOpacity>
              <View style={styles.socialTitleRow}>
                {socialPlatform === 'twitter' ? (
                  <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
                ) : (
                  <FontAwesome5 name="facebook" size={20} color="#4267B2" />
                )}
                <Text style={styles.socialTitle}>
                  {socialPlatform === 'twitter' ? '推特用户' : 'Facebook用户'}
                </Text>
              </View>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.socialSearchBar}>
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                style={styles.socialSearchInput}
                placeholder="搜索用户..."
                value={socialSearchText}
                onChangeText={setSocialSearchText}
              />
            </View>

            <Text style={styles.socialRecommendTitle}>推荐用户</Text>

            <FlatList
              data={filteredSocialUsers}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.socialUserItem} onPress={() => sendSocialMessage(item)}>
                  <Avatar uri={item.avatar} name={item.name} size={40} />
                  <View style={styles.socialUserInfo}>
                    <Text style={styles.socialUserName}>{item.name}</Text>
                    <Text style={styles.socialUserHandle}>{item.handle}</Text>
                  </View>
                  <View style={styles.socialUserMeta}>
                    <Text style={styles.socialUserFollowers}>{item.followers} 粉丝</Text>
                    <TouchableOpacity style={styles.inviteBtn} onPress={() => sendSocialMessage(item)}>
                      <Text style={styles.inviteBtnText}>邀请回答</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.socialUserList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ffffff' },
  regionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#fef2f2', borderRadius: 16, marginRight: 8, maxWidth: 80 },
  regionText: { fontSize: 12, color: '#ef4444', marginLeft: 4, fontWeight: '500', lineHeight: 16, includeFontPadding: false, maxWidth: 56 },
  searchBar: { flex: 1, height: 36, backgroundColor: '#f5f5f5', borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginHorizontal: 10 },
  searchPlaceholder: { fontSize: 14, color: '#999999', marginLeft: 6 },
  teamBtn: { flexDirection: 'row', alignItems: 'center', padding: 6, marginLeft: 8 },
  notifyBtn: { flexDirection: 'row', alignItems: 'center', padding: 6, marginLeft: 0, position: 'relative' },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4 },
  tabBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 44, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ebebeb' },
  tabBar: { flex: 1 },
  tabItem: { paddingHorizontal: 12, height: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 16, color: '#505050', fontWeight: '400', paddingBottom: 4 },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 16, height: 2.5, borderRadius: 2, backgroundColor: '#f04444' },
  tabMenuBtn: { flexDirection: 'row', alignItems: 'center', height: '100%', backgroundColor: '#ffffff', paddingHorizontal: 12 },
  socialButtonsBar: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10, gap: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  socialButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  socialButtonText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  listContainer: { flex: 1 },
  list: { flex: 1, paddingTop: 0, paddingHorizontal: 0 },
  footerLoading: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  footerText: { marginLeft: 8, fontSize: 14, color: '#9ca3af' },
  footerEnd: { paddingVertical: 20, alignItems: 'center' },
  footerEndText: { fontSize: 14, color: '#9ca3af' },
  questionCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  firstQuestionCard: {
    paddingTop: 14,
  },
  questionCardInner: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 14,
    paddingTop: 14,
  },
  lastQuestionCardInner: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  questionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 16, height: 16, borderRadius: 8 },
  authorName: { fontSize: 12, color: '#999999', marginLeft: 4, fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif' },
  metaSeparator: { fontSize: 12, color: '#999999', marginHorizontal: 3, fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif' },
  postTime: { fontSize: 12, color: '#999999', fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif' },
  locationText: { fontSize: 12, color: '#999999', marginLeft: 1, fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif' },
  headerActionBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
  headerActionText: { fontSize: 12, color: '#666666', marginLeft: 4 },
  headerMoreBtn: { padding: 2, marginLeft: 16 },
  rewardTagInline: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(240, 68, 68, 0.08)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2, marginRight: 6, marginTop: 2 },
  rewardTagText: { fontSize: 10, color: '#f04444', fontWeight: '700', textTransform: 'uppercase', includeFontPadding: false },
  targetedTagInline: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(147, 51, 234, 0.08)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2, marginRight: 6, marginTop: 2 },
  targetedTagText: { fontSize: 10, color: '#9333ea', fontWeight: '700', textTransform: 'uppercase', includeFontPadding: false },
  paidTagInline: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#f59e0b', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2, marginRight: 6, marginTop: 2 },
  paidTagText: { fontSize: 10, color: '#fff', fontWeight: '700', textTransform: 'uppercase', includeFontPadding: false },
  paidViewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, borderStyle: 'dashed' },
  paidViewContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paidViewText: { fontSize: 14, color: '#92400e', fontWeight: '500' },
  paidViewPrice: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  paidViewPriceText: { fontSize: 16, color: '#f59e0b', fontWeight: '700' },
  questionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    flex: 1,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  singleImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8,
    marginBottom: 12,
  },
  twoImagesGrid: {
    flexDirection: 'row',
    gap: 4,
  },
  twoImageItem: {
    flex: 1,
    height: 180,
    borderRadius: 6,
  },
  threeImagesGrid: {
    flexDirection: 'row',
    gap: 4,
  },
  threeImageItem: {
    flex: 1,
    height: 120,
    borderRadius: 6,
  },
  fourImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  fourImageItem: {
    width: '49%',
    height: 120,
    borderRadius: 6,
  },
  multiImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  multiImageItem: {
    width: '32.5%',
    height: 100,
    borderRadius: 6,
  },
  nineImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  nineImageItem: {
    width: '32.5%',
    height: 100,
    borderRadius: 6,
  },
  moreImagesWrapper: {
    width: '32.5%',
    height: 100,
    position: 'relative',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imageGrid: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 10, gap: 6 },
  gridImage: { width: 100, height: 100, borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  regionModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  confirmText: { fontSize: 14, color: '#ef4444', fontWeight: '600' },
  // 面包屑导航样式
  breadcrumbContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff'
  },
  breadcrumbScrollContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  breadcrumbItem: { 
    paddingHorizontal: 4, 
    paddingVertical: 4,
    justifyContent: 'center'
  },
  breadcrumbItemActive: { 
    // 不需要了，保留以防万一
  },
  breadcrumbText: { 
    fontSize: 15, 
    color: '#6b7280',
    fontWeight: '400',
    lineHeight: 20
  },
  breadcrumbTextActive: { 
    color: '#ef4444',
    fontWeight: '500'
  },
  breadcrumbIndicator: {
    display: 'none'
  },
  breadcrumbSeparatorWrapper: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  breadcrumbSeparator: { 
    marginHorizontal: 6,
    marginTop: 5
  },
  regionList: { padding: 8 },
  regionOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  regionOptionText: { fontSize: 15, color: '#1f2937' },
  actionModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  actionModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  actionItemText: { fontSize: 15, color: '#1f2937', marginLeft: 14 },
  reportItem: { borderBottomWidth: 0 },
  cancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  channelModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  channelModal: { flex: 1, backgroundColor: '#fff', marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  channelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  channelScrollView: { flex: 1, padding: 16 },
  channelTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  closeBtn: { padding: 4 },
  channelTabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingHorizontal: 8 },
  channelTabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  channelTabItemActive: { borderBottomColor: '#ef4444' },
  channelTabText: { fontSize: 14, color: '#6b7280' },
  channelTabTextActive: { color: '#ef4444', fontWeight: '600' },
  channelSection: { marginBottom: 0 },
  channelCategoryTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8, marginTop: 4 },
  channelSectionTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 8, marginTop: 4 },
  channelDivider: { height: 8, backgroundColor: '#f3f4f6', marginVertical: 12 },
  channelSectionDesc: { fontSize: 13, color: '#9ca3af', marginBottom: 12, lineHeight: 18 },
  channelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  myChannelItem: { position: 'relative' },
  channelTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  channelTagAdded: { backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#22c55e' },
  channelTagText: { fontSize: 14, color: '#1f2937' },
  channelTagTextAdded: { color: '#16a34a', fontWeight: '500' },
  removeChannelBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#fff', borderRadius: 10 },
  categoryMainBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  categoryIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  categoryMainText: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1f2937' },
  createComboBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', padding: 16, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: '#fecaca' },
  createComboBtnText: { fontSize: 15, fontWeight: '500', color: '#ef4444', marginLeft: 8 },
  comboCreatorModal: { flex: 1, backgroundColor: '#fff', marginTop: 100, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  comboCreatorContent: { flex: 1, padding: 16 },
  comboSummary: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 16 },
  comboSummaryLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  comboSummaryValue: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  categorySelectItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f9fafb', borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  categorySelectItemActive: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  categorySelectText: { flex: 1, fontSize: 14, color: '#1f2937', marginLeft: 12 },
  comboCreateBtn: { backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  comboCreateBtnDisabled: { backgroundColor: '#fca5a5' },
  comboCreateBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  socialModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', paddingBottom: 30 },
  socialHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  socialTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  socialTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  socialSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20 },
  socialSearchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  socialRecommendTitle: { fontSize: 14, fontWeight: '500', color: '#6b7280', marginHorizontal: 16, marginBottom: 8 },
  socialUserList: { maxHeight: 400 },
  socialUserItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  socialUserAvatar: { width: 48, height: 48, borderRadius: 24 },
  socialUserInfo: { flex: 1, marginLeft: 12 },
  socialUserName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  socialUserHandle: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  socialUserMeta: { alignItems: 'flex-end' },
  socialUserFollowers: { fontSize: 12, color: '#9ca3af', marginBottom: 6 },
  inviteBtn: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  inviteBtnText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  localFilterBar: { backgroundColor: '#fff', marginBottom: 12, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8 },
  localFilterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  localFilterItem: { alignItems: 'center', flex: 1 },
  localFilterIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  localFilterLabel: { fontSize: 12, color: '#4b5563' },
  localFilterLabelActive: { color: '#ef4444', fontWeight: '500' },
  
  // 话题列表样式
  topicsContainer: { flex: 1, backgroundColor: '#f3f4f6' },
  topicsSection: { backgroundColor: '#fff', marginTop: 8, padding: 12 },
  topicCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  topicIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  topicInfo: { flex: 1, marginLeft: 12 },
  topicName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  topicDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  topicStats: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  topicFollowBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f3f4f6' },
  topicFollowBtnText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  topicFollowBtnActive: { backgroundColor: '#fef2f2' },
  topicFollowBtnTextActive: { color: '#ef4444' },
});
