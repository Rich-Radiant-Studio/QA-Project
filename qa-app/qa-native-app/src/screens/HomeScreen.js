import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, Dimensions, TextInput, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

const { width: screenWidth } = Dimensions.get('window');

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程?有没有系统的学习路线推荐?', type: 'reward', reward: 50, likes: 128, dislikes: 12, answers: 56, shares: 34, bookmarks: 89, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop', solvedPercent: 65, country: '中国', city: '北京' },
  { id: 2, title: '第一次养猫需要准备什么?有哪些新手容易踩的坑?', type: 'free', likes: 256, dislikes: 8, answers: 89, shares: 56, bookmarks: 120, author: '李小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'], solvedPercent: 80, country: '美国', city: '纽约' },
  { id: 3, title: '长期失眠应该怎么调理?吃褪黑素有用吗?求专业医生解答', type: 'targeted', likes: 512, dislikes: 5, answers: 234, shares: 78, bookmarks: 156, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天 18:30', verified: true, solvedPercent: 45, country: '日本', city: '东京' },
  { id: 4, title: '35岁程序员如何规划职业发展?是继续技术深耕还是转管理?', type: 'reward', reward: 100, likes: 1200, dislikes: 23, answers: 456, shares: 234, bookmarks: 567, author: '程序员小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', solvedPercent: 30, country: '中国', city: '上海' },
  { id: 5, title: '有什么简单又好吃的家常菜推荐?最好是新手也能做的那种', type: 'free', likes: 368, dislikes: 6, answers: 127, shares: 45, bookmarks: 98, author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', time: '6小时前', images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'], solvedPercent: 92, country: '英国', city: '伦敦' },
];

const tabs = ['关注', '推荐', '热榜', '同城', '国家', '行业', '个人', '职场', '教育'];

// 区域数据
const regionData = {
  countries: ['中国', '美国', '日本', '英国', '韩国'],
  cities: { '中国': ['北京', '上海', '广州', '深圳'], '美国': ['纽约', '洛杉矶', '芝加哥'], '日本': ['东京', '大阪', '京都'], '英国': ['伦敦', '曼彻斯特'], '韩国': ['首尔', '釜山'] },
  states: { '北京': ['朝阳区', '海淀区', '东城区'], '上海': ['浦东新区', '黄浦区', '静安区'], '纽约': ['曼哈顿', '布鲁克林'], '东京': ['新宿区', '涩谷区'], '伦敦': ['威斯敏斯特', '肯辛顿'], '首尔': ['江南区', '中区'] },
  districts: { '朝阳区': ['三里屯', '国贸', 'CBD'], '海淀区': ['中关村', '五道口'], '浦东新区': ['陆家嘴', '张江'], '曼哈顿': ['时代广场', '华尔街'] }
};

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('推荐');
  const [likedItems, setLikedItems] = useState({});
  const [bookmarkedItems, setBookmarkedItems] = useState({});
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialSearchText, setSocialSearchText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [regionStep, setRegionStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState({ country: '', city: '', state: '', district: '' });
  // 频道管理状态
  const [myChannels, setMyChannels] = useState(['关注', '推荐', '热榜', '同城']);
  const [channelTab, setChannelTab] = useState('my'); // my, country, industry, personal, combo

  // 频道数据
  const channelCategories = {
    country: {
      name: '国家',
      icon: 'business',
      color: '#3b82f6',
      subcategories: ['政策法规', '社会民生', '经济发展', '教育医疗', '环境保护', '基础设施']
    },
    industry: {
      name: '行业',
      icon: 'briefcase',
      color: '#22c55e',
      subcategories: ['互联网', '金融', '制造业', '医疗健康', '教育培训', '房地产', '餐饮服务', '交通运输']
    },
    personal: {
      name: '个人',
      icon: 'person',
      color: '#8b5cf6',
      subcategories: ['职业发展', '情感生活', '健康养生', '理财投资', '学习成长', '家庭关系']
    }
  };

  // 组合频道配置
  const [showComboCreator, setShowComboCreator] = useState(false);
  const [comboStep, setComboStep] = useState(0); // 0:选择地区 1:选择类别
  const [comboConfig, setComboConfig] = useState({
    region: { country: '', city: '', state: '' },
    categoryType: '', // country/industry/personal
    category: ''
  });
  const [comboRegionStep, setComboRegionStep] = useState(0); // 0:国家 1:省份 2:城市
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

  // 频道管理函数
  const addToMyChannels = (channel) => {
    if (!myChannels.includes(channel)) {
      setMyChannels([...myChannels, channel]);
    }
  };

  const removeFromMyChannels = (channel) => {
    // 保留固定频道
    const fixedChannels = ['关注', '推荐', '热榜', '同城'];
    if (!fixedChannels.includes(channel)) {
      setMyChannels(myChannels.filter(c => c !== channel));
    }
  };

  // 组合频道创建
  const getComboRegionOptions = () => {
    if (comboRegionStep === 0) return cityRegionData.countries;
    if (comboRegionStep === 1) return cityRegionData.states[comboConfig.region.country] || [];
    if (comboRegionStep === 2) return cityRegionData.cities[comboConfig.region.state] || [];
    return [];
  };

  const selectComboRegion = (value) => {
    if (comboRegionStep === 0) {
      setComboConfig({ ...comboConfig, region: { country: value, state: '', city: '' } });
      setComboRegionStep(1);
    } else if (comboRegionStep === 1) {
      setComboConfig({ ...comboConfig, region: { ...comboConfig.region, state: value, city: '' } });
      setComboRegionStep(2);
    } else {
      setComboConfig({ ...comboConfig, region: { ...comboConfig.region, city: value } });
      setComboStep(1);
      setComboRegionStep(0);
    }
  };

  const createComboChannel = () => {
    const { region, categoryType, category } = comboConfig;
    const parts = [];

    if (region.country) parts.push(region.country);
    if (region.state) parts.push(region.state);
    if (region.city) parts.push(region.city);

    if (categoryType) {
      parts.push(channelCategories[categoryType].name);
    }
    if (category) {
      parts.push(category);
    }

    if (parts.length > 0) {
      const channelName = parts.join('·');
      addToMyChannels(channelName);
      setComboConfig({ region: { country: '', city: '', state: '' }, categoryType: '', category: '' });
      setShowComboCreator(false);
      setComboStep(0);
    }
  };

  const getComboRegionDisplay = () => {
    const { country, state, city } = comboConfig.region;
    const parts = [country, state, city].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : '选择地区';
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
    if (regionStep === 0) { setSelectedRegion({ ...selectedRegion, country: value, city: '', state: '', district: '' }); setRegionStep(1); }
    else if (regionStep === 1) { setSelectedRegion({ ...selectedRegion, city: value, state: '', district: '' }); setRegionStep(2); }
    else if (regionStep === 2) { setSelectedRegion({ ...selectedRegion, state: value, district: '' }); setRegionStep(3); }
    else { setSelectedRegion({ ...selectedRegion, district: value }); setShowRegionModal(false); setRegionStep(0); }
  };

  const getRegionTitle = () => ['选择国家', '选择城市', '选择省份', '选择区'][regionStep];
  const getDisplayRegion = () => {
    const parts = [selectedRegion.country, selectedRegion.city, selectedRegion.state, selectedRegion.district].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : '全球';
  };

  const removeChannel = (channel) => {
    if (myChannels.length > 1) {
      setMyChannels(myChannels.filter(c => c !== channel));
      setRecommendChannels([...recommendChannels, channel]);
    }
  };

  const addChannel = (channel) => {
    setRecommendChannels(recommendChannels.filter(c => c !== channel));
    setMyChannels([...myChannels, channel]);
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
          <Text style={styles.regionText} numberOfLines={1}>{getDisplayRegion()}</Text>
          <Ionicons name="chevron-down" size={14} color="#6b7280" />
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
        <TouchableOpacity style={styles.tabMenuBtn} onPress={() => setShowChannelModal(true)}>
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
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {/* 同城筛选条 */}
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

        {questions.map(item => {
          const isLiked = likedItems[item.id];
          return (
            <TouchableOpacity key={item.id} style={styles.questionCard} onPress={() => navigation.navigate('QuestionDetail', { id: item.id })}>
              {/* 问题标题 */}
              <Text style={styles.questionTitle}>
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
                {(item.type === 'reward' || item.type === 'targeted') && ' '}
                {item.title}
              </Text>

              {/* 图片 */}
              {item.image && <Image source={{ uri: item.image }} style={styles.singleImage} />}
              {item.images && (
                <View style={styles.imageGrid}>
                  {item.images.map((img, idx) => <Image key={idx} source={{ uri: img }} style={styles.gridImage} />)}
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
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 区域选择弹窗 */}
      <Modal visible={showRegionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.regionModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => { if (regionStep > 0) setRegionStep(regionStep - 1); else setShowRegionModal(false); }}>
                <Ionicons name={regionStep > 0 ? "arrow-back" : "close"} size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{getRegionTitle()}</Text>
              <TouchableOpacity onPress={() => { setShowRegionModal(false); setRegionStep(0); }}>
                <Text style={styles.resetText}>重置</Text>
              </TouchableOpacity>
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

      {/* 我的频道弹窗 - 完整版本 */}
      <Modal visible={showChannelModal} transparent animationType="slide">
        <View style={styles.channelModalOverlay}>
          <View style={styles.channelModal}>
            <View style={styles.channelHeader}>
              <Text style={styles.channelTitle}>频道管理</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowChannelModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* 频道分类标签 */}
            <View style={styles.channelTabs}>
              <TouchableOpacity
                style={[styles.channelTabItem, channelTab === 'my' && styles.channelTabItemActive]}
                onPress={() => setChannelTab('my')}
              >
                <Text style={[styles.channelTabText, channelTab === 'my' && styles.channelTabTextActive]}>我的频道</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.channelTabItem, channelTab === 'country' && styles.channelTabItemActive]}
                onPress={() => setChannelTab('country')}
              >
                <Text style={[styles.channelTabText, channelTab === 'country' && styles.channelTabTextActive]}>国家</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.channelTabItem, channelTab === 'industry' && styles.channelTabItemActive]}
                onPress={() => setChannelTab('industry')}
              >
                <Text style={[styles.channelTabText, channelTab === 'industry' && styles.channelTabTextActive]}>行业</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.channelTabItem, channelTab === 'personal' && styles.channelTabItemActive]}
                onPress={() => setChannelTab('personal')}
              >
                <Text style={[styles.channelTabText, channelTab === 'personal' && styles.channelTabTextActive]}>个人</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.channelTabItem, channelTab === 'combo' && styles.channelTabItemActive]}
                onPress={() => setChannelTab('combo')}
              >
                <Text style={[styles.channelTabText, channelTab === 'combo' && styles.channelTabTextActive]}>组合</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.channelScrollView}>
              {/* 我的频道 */}
              {channelTab === 'my' && (
                <View style={styles.channelSection}>
                  <Text style={styles.channelSectionTitle}>已添加的频道</Text>
                  <View style={styles.channelGrid}>
                    {myChannels.map((channel) => {
                      const isFixed = ['关注', '推荐', '热榜', '同城'].includes(channel);
                      return (
                        <View key={channel} style={styles.myChannelItem}>
                          <TouchableOpacity
                            style={styles.channelTag}
                            onPress={() => {
                              setActiveTab(channel);
                              setShowChannelModal(false);
                            }}
                          >
                            <Text style={styles.channelTagText}>{channel}</Text>
                          </TouchableOpacity>
                          {!isFixed && (
                            <TouchableOpacity
                              style={styles.removeChannelBtn}
                              onPress={() => removeFromMyChannels(channel)}
                            >
                              <Ionicons name="close-circle" size={16} color="#ef4444" />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 国家频道 */}
              {channelTab === 'country' && (
                <View style={styles.channelSection}>
                  <TouchableOpacity
                    style={styles.categoryMainBtn}
                    onPress={() => addToMyChannels('国家')}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: channelCategories.country.color + '20' }]}>
                      <Ionicons name={channelCategories.country.icon} size={24} color={channelCategories.country.color} />
                    </View>
                    <Text style={styles.categoryMainText}>国家问题</Text>
                    <Ionicons name="add-circle" size={20} color={channelCategories.country.color} />
                  </TouchableOpacity>

                  <Text style={styles.channelSectionTitle}>二级类别</Text>
                  <View style={styles.channelGrid}>
                    {channelCategories.country.subcategories.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[styles.channelTag, myChannels.includes(sub) && styles.channelTagAdded]}
                        onPress={() => addToMyChannels(sub)}
                      >
                        <Text style={[styles.channelTagText, myChannels.includes(sub) && styles.channelTagTextAdded]}>{sub}</Text>
                        {myChannels.includes(sub) && <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 行业频道 */}
              {channelTab === 'industry' && (
                <View style={styles.channelSection}>
                  <TouchableOpacity
                    style={styles.categoryMainBtn}
                    onPress={() => addToMyChannels('行业')}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: channelCategories.industry.color + '20' }]}>
                      <Ionicons name={channelCategories.industry.icon} size={24} color={channelCategories.industry.color} />
                    </View>
                    <Text style={styles.categoryMainText}>行业问题</Text>
                    <Ionicons name="add-circle" size={20} color={channelCategories.industry.color} />
                  </TouchableOpacity>

                  <Text style={styles.channelSectionTitle}>二级类别</Text>
                  <View style={styles.channelGrid}>
                    {channelCategories.industry.subcategories.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[styles.channelTag, myChannels.includes(sub) && styles.channelTagAdded]}
                        onPress={() => addToMyChannels(sub)}
                      >
                        <Text style={[styles.channelTagText, myChannels.includes(sub) && styles.channelTagTextAdded]}>{sub}</Text>
                        {myChannels.includes(sub) && <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 个人频道 */}
              {channelTab === 'personal' && (
                <View style={styles.channelSection}>
                  <TouchableOpacity
                    style={styles.categoryMainBtn}
                    onPress={() => addToMyChannels('个人')}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: channelCategories.personal.color + '20' }]}>
                      <Ionicons name={channelCategories.personal.icon} size={24} color={channelCategories.personal.color} />
                    </View>
                    <Text style={styles.categoryMainText}>个人问题</Text>
                    <Ionicons name="add-circle" size={20} color={channelCategories.personal.color} />
                  </TouchableOpacity>

                  <Text style={styles.channelSectionTitle}>二级类别</Text>
                  <View style={styles.channelGrid}>
                    {channelCategories.personal.subcategories.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[styles.channelTag, myChannels.includes(sub) && styles.channelTagAdded]}
                        onPress={() => addToMyChannels(sub)}
                      >
                        <Text style={[styles.channelTagText, myChannels.includes(sub) && styles.channelTagTextAdded]}>{sub}</Text>
                        {myChannels.includes(sub) && <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 组合频道 */}
              {channelTab === 'combo' && (
                <View style={styles.channelSection}>
                  <Text style={styles.channelSectionDesc}>创建自定义组合频道，结合地区和类别筛选</Text>
                  <TouchableOpacity
                    style={styles.createComboBtn}
                    onPress={() => setShowComboCreator(true)}
                  >
                    <Ionicons name="add-circle" size={24} color="#ef4444" />
                    <Text style={styles.createComboBtnText}>创建组合频道</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 组合频道创建弹窗 */}
      <Modal visible={showComboCreator} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.comboCreatorModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                if (comboStep === 1) {
                  setComboStep(0);
                } else if (comboRegionStep > 0) {
                  setComboRegionStep(comboRegionStep - 1);
                } else {
                  setShowComboCreator(false);
                  setComboStep(0);
                  setComboRegionStep(0);
                }
              }}>
                <Ionicons name="arrow-back" size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {comboStep === 0 ? (comboRegionStep === 0 ? '选择国家' : comboRegionStep === 1 ? '选择省份' : '选择城市') : '选择类别'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowComboCreator(false);
                setComboStep(0);
                setComboRegionStep(0);
                setComboConfig({ region: { country: '', city: '', state: '' }, categoryType: '', category: '' });
              }}>
                <Text style={styles.resetText}>重置</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.comboCreatorContent}>
              {/* 步骤1: 选择地区 */}
              {comboStep === 0 && (
                <View>
                  {getComboRegionOptions().map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.regionOption}
                      onPress={() => selectComboRegion(option)}
                    >
                      <Text style={styles.regionOptionText}>{option}</Text>
                      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 步骤2: 选择类别 */}
              {comboStep === 1 && (
                <View>
                  <View style={styles.comboSummary}>
                    <Text style={styles.comboSummaryLabel}>已选地区：</Text>
                    <Text style={styles.comboSummaryValue}>{getComboRegionDisplay()}</Text>
                  </View>

                  <Text style={styles.channelSectionTitle}>选择问题类型</Text>
                  {Object.keys(channelCategories).map((key) => {
                    const cat = channelCategories[key];
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[styles.categorySelectItem, comboConfig.categoryType === key && styles.categorySelectItemActive]}
                        onPress={() => setComboConfig({ ...comboConfig, categoryType: key, category: '' })}
                      >
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                          <Ionicons name={cat.icon} size={20} color={cat.color} />
                        </View>
                        <Text style={styles.categorySelectText}>{cat.name}问题</Text>
                        {comboConfig.categoryType === key && <Ionicons name="checkmark-circle" size={20} color={cat.color} />}
                      </TouchableOpacity>
                    );
                  })}

                  {comboConfig.categoryType && (
                    <>
                      <Text style={styles.channelSectionTitle}>选择二级类别（可选）</Text>
                      <View style={styles.channelGrid}>
                        {channelCategories[comboConfig.categoryType].subcategories.map((sub) => (
                          <TouchableOpacity
                            key={sub}
                            style={[styles.channelTag, comboConfig.category === sub && styles.channelTagAdded]}
                            onPress={() => setComboConfig({ ...comboConfig, category: sub })}
                          >
                            <Text style={[styles.channelTagText, comboConfig.category === sub && styles.channelTagTextAdded]}>{sub}</Text>
                            {comboConfig.category === sub && <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}

                  <TouchableOpacity
                    style={[styles.comboCreateBtn, !comboConfig.categoryType && styles.comboCreateBtnDisabled]}
                    onPress={createComboChannel}
                    disabled={!comboConfig.categoryType}
                  >
                    <Text style={styles.comboCreateBtnText}>创建频道</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  regionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#fef2f2', borderRadius: 16, marginRight: 8, maxWidth: 100 },
  regionText: { fontSize: 12, color: '#ef4444', marginHorizontal: 4, fontWeight: '500' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  searchPlaceholder: { marginLeft: 6, color: '#9ca3af', fontSize: 13 },
  teamBtn: { padding: 6, marginLeft: 8 },
  notifyBtn: { padding: 6, marginLeft: 0, position: 'relative' },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4 },
  tabBarContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabBar: { flex: 1 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  tabMenuBtn: { paddingHorizontal: 12, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#f3f4f6' },
  socialButtonsBar: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10, gap: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  socialButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  socialButtonText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  list: { flex: 1, paddingTop: 0, paddingHorizontal: 0 },
  questionCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 16, height: 16, borderRadius: 8 },
  authorName: { fontSize: 10, fontWeight: '500', color: '#9ca3af', marginLeft: 4 },
  metaSeparator: { fontSize: 8, color: '#d1d5db', marginHorizontal: 3 },
  postTime: { fontSize: 9, color: '#9ca3af' },
  locationText: { fontSize: 9, color: '#9ca3af', marginLeft: 1 },
  headerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  headerActionText: { fontSize: 10, color: '#9ca3af' },
  headerMoreBtn: { padding: 2 },
  rewardTagInline: { backgroundColor: '#ef4444', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  rewardTagText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  targetedTagInline: { backgroundColor: '#f5f3ff', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  targetedTagText: { fontSize: 10, color: '#8b5cf6', fontWeight: '600' },
  questionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.2,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  singleImage: { height: 160, marginHorizontal: 12, marginBottom: 10, borderRadius: 8 },
  imageGrid: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 10, gap: 6 },
  gridImage: { width: 100, height: 100, borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  regionModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  resetText: { fontSize: 14, color: '#ef4444' },
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
  channelSection: { marginBottom: 20 },
  channelSectionTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 12, marginTop: 8 },
  channelSectionDesc: { fontSize: 13, color: '#9ca3af', marginBottom: 16, lineHeight: 18 },
  channelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
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
});
