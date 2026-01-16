import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Modal, Dimensions, TextInput, FlatList } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？', type: 'reward', reward: 50, likes: 128, dislikes: 12, answers: 56, shares: 34, bookmarks: 89, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop', solvedPercent: 65, country: '中国', city: '北京' },
  { id: 2, title: '第一次养猫需要准备什么？有哪些新手容易踩的坑？', type: 'free', likes: 256, dislikes: 8, answers: 89, shares: 56, bookmarks: 120, author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'], solvedPercent: 80, country: '美国', city: '纽约' },
  { id: 3, title: '长期失眠应该怎么调理？吃褪黑素有用吗？求专业医生解答', type: 'targeted', likes: 512, dislikes: 5, answers: 234, shares: 78, bookmarks: 156, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天 18:30', verified: true, solvedPercent: 45, country: '日本', city: '东京' },
  { id: 4, title: '35岁程序员如何规划职业发展？是继续技术深耕还是转管理？', type: 'reward', reward: 100, likes: 1200, dislikes: 23, answers: 456, shares: 234, bookmarks: 567, author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', solvedPercent: 30, country: '中国', city: '上海' },
  { id: 5, title: '有什么简单又好吃的家常菜推荐？最好是新手也能做的那种', type: 'free', likes: 368, dislikes: 6, answers: 127, shares: 45, bookmarks: 98, author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', time: '6小时前', images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'], solvedPercent: 92, country: '英国', city: '伦敦' },
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
  const [myChannels, setMyChannels] = useState(['关注', '推荐', '热榜', '同城', '国家', '行业', '个人', '职场', '教育']);
  const [recommendChannels, setRecommendChannels] = useState(['科技', '财经', '娱乐', '体育', '健康', '美食', '旅游', '汽车', '房产', '游戏', '音乐', '电影', '读书', '历史', '军事', '育儿']);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showComboCreator, setShowComboCreator] = useState(false);
  const [comboConfig, setComboConfig] = useState({
    region: { country: '', city: '', state: '', district: '' },
    questionType: '', // 国家问题、行业问题、个人问题
    category: ''
  });
  // 同城筛选状态
  const [localCity, setLocalCity] = useState('北京');
  const [localFilter, setLocalFilter] = useState('最新');
  const [showCityModal, setShowCityModal] = useState(false);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [nearbyDistance, setNearbyDistance] = useState('3公里');
  const [citySelectStep, setCitySelectStep] = useState(0); // 0:国家 1:州/省 2:市
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

  const getCitySelectOptions = () => {
    if (citySelectStep === 0) return cityRegionData.countries;
    if (citySelectStep === 1) return cityRegionData.states[selectedCityRegion.country] || [];
    if (citySelectStep === 2) return cityRegionData.cities[selectedCityRegion.state] || [];
    return [];
  };

  const getCitySelectTitle = () => ['选择国家', '选择州/省', '选择城市'][citySelectStep];

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
      { id: 1, name: 'Python学习群', handle: 'Python Learning', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fb1', followers: '25万' },
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
    alert(`已向 ${user.name} 发送私信，邀请回答问题：${selectedQuestion?.title?.substring(0, 30)}...`);
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

  const getRegionTitle = () => ['选择国家', '选择城市', '选择州/省', '选择区'][regionStep];
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

  const createComboChannel = () => {
    const { region, questionType, category } = comboConfig;
    const parts = [];
    if (region.country) parts.push(region.country);
    if (region.city) parts.push(region.city);
    if (questionType) parts.push(questionType);
    if (category) parts.push(category);
    
    if (parts.length > 0) {
      const channelName = parts.join('·');
      if (!myChannels.includes(channelName)) {
        setMyChannels([...myChannels, channelName]);
      }
      setComboConfig({ region: { country: '', city: '', state: '', district: '' }, questionType: '', category: '' });
      setShowComboCreator(false);
    }
  };

  const getComboRegionDisplay = () => {
    const { country, city, state, district } = comboConfig.region;
    const parts = [country, city, state, district].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : '选择地区';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.regionBtn} onPress={() => setShowRegionModal(true)}>
          <Ionicons name="location-outline" size={16} color="#ef4444" />
          <Text style={styles.regionText} numberOfLines={1}>{getDisplayRegion()}</Text>
          <Ionicons name="chevron-down" size={14} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={16} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>搜索问题、话题或用户</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifyBtn} onPress={() => navigation.navigate('Messages')}>
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
              <Text style={styles.questionTitle}>{item.title}</Text>

              {/* 图片 */}
              {item.image && <Image source={{ uri: item.image }} style={styles.singleImage} />}
              {item.images && (
                <View style={styles.imageGrid}>
                  {item.images.map((img, idx) => <Image key={idx} source={{ uri: img }} style={styles.gridImage} />)}
                </View>
              )}

              {/* PK进度条 - 已解决/未解决按钮在左右两侧 */}
              <View style={styles.pkSection}>
                <View style={styles.pkRow}>
                  <TouchableOpacity style={styles.voteSolvedBtn}>
                    <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />
                    <Text style={styles.voteSolvedText}>已解决</Text>
                  </TouchableOpacity>
                  <View style={styles.pkBarWrapper}>
                    <View style={styles.pkBar}>
                      <View style={[styles.pkSolvedBar, { width: `${item.solvedPercent}%` }]} />
                      <View style={[styles.pkUnsolvedBar, { width: `${100 - item.solvedPercent}%` }]} />
                    </View>
                    <View style={[styles.pkPercentLabel, { left: `${item.solvedPercent}%` }]}>
                      <Text style={styles.pkPercentText}>{item.solvedPercent}%</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.voteUnsolvedBtn}>
                    <Ionicons name="close-circle" size={14} color="#ef4444" />
                    <Text style={styles.voteUnsolvedText}>未解决</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 头像、姓名、时间、地区 - 全部放在一行，右侧放点赞和评论 */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
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
              <Ionicons name={selectedQuestion && bookmarkedItems[selectedQuestion.id] ? "bookmark" : "bookmark-outline"} size={22} color={selectedQuestion && bookmarkedItems[selectedQuestion.id] ? "#f59e0b" : "#1f2937"} />
              <Text style={styles.actionItemText}>收藏 ({formatNumber(selectedQuestion?.bookmarks || 0)})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setShowActionModal(false); navigation.navigate('GroupChat', { question: selectedQuestion }); }}>
              <Ionicons name="people-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>加入群聊</Text>
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

      {/* 我的频道弹窗 */}
      <Modal visible={showChannelModal} transparent animationType="slide">
        <View style={styles.channelModalOverlay}>
          <View style={styles.channelModal}>
            <View style={styles.channelHeader}>
              <Text style={styles.channelTitle}>我的频道</Text>
              <View style={styles.channelHeaderRight}>
                <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
                  <Text style={styles.editText}>{isEditMode ? '完成' : '编辑'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => { setShowChannelModal(false); setIsEditMode(false); }}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView style={styles.channelScrollView} showsVerticalScrollIndicator={true}>
              <Text style={styles.channelTip}>{isEditMode ? '拖拽排序，点击删除频道' : '点击进入频道'}</Text>
              <View style={styles.channelGrid}>
                {myChannels.map((channel, idx) => (
                  <TouchableOpacity 
                    key={channel} 
                    style={[styles.channelTag, idx === 0 && styles.channelTagFirst]}
                    onPress={() => {
                      if (isEditMode && idx !== 0) {
                        removeChannel(channel);
                      } else if (!isEditMode) {
                        if (channel === '热榜') {
                          setShowChannelModal(false);
                          navigation.navigate('HotList');
                        } else {
                          setActiveTab(channel);
                          setShowChannelModal(false);
                        }
                      }
                    }}
                  >
                    <Text style={[styles.channelTagText, idx === 0 && styles.channelTagTextFirst]}>{channel}</Text>
                    {isEditMode && idx !== 0 && (
                      <View style={styles.deleteIcon}>
                        <Ionicons name="close" size={12} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.recommendSection}>
                <Text style={styles.recommendTitle}>频道推荐</Text>
                <Text style={styles.recommendTip}>点击添加频道</Text>
              </View>
              <View style={styles.channelGrid}>
                {recommendChannels.map(channel => (
                  <TouchableOpacity key={channel} style={styles.channelTagAdd} onPress={() => addChannel(channel)}>
                    <Ionicons name="add" size={14} color="#6b7280" />
                    <Text style={styles.channelTagAddText}>{channel}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 组合频道模块 */}
              <View style={styles.comboSection}>
                <View style={styles.comboHeader}>
                  <Text style={styles.comboTitle}>组合频道</Text>
                  <Text style={styles.comboTip}>自定义地区+问题类型组合</Text>
                </View>
                
                {!showComboCreator ? (
                  <TouchableOpacity style={styles.createComboBtn} onPress={() => setShowComboCreator(true)}>
                    <Ionicons name="add-circle-outline" size={20} color="#ef4444" />
                    <Text style={styles.createComboBtnText}>创建组合频道</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.comboCreator}>
                    {/* 地区选择 */}
                    <Text style={styles.comboLabel}>选择地区（国家）</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.comboScrollRow}>
                      {regionData.countries.map(country => (
                        <TouchableOpacity 
                          key={country} 
                          style={[styles.comboOption, comboConfig.region.country === country && styles.comboOptionActive]}
                          onPress={() => setComboConfig({...comboConfig, region: { country, city: '', state: '', district: '' }})}
                        >
                          <Text style={[styles.comboOptionText, comboConfig.region.country === country && styles.comboOptionTextActive]}>{country}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    
                    {comboConfig.region.country && regionData.cities[comboConfig.region.country] && (
                      <>
                        <Text style={styles.comboLabel}>选择城市</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.comboScrollRow}>
                          {regionData.cities[comboConfig.region.country].map(city => (
                            <TouchableOpacity 
                              key={city} 
                              style={[styles.comboOption, comboConfig.region.city === city && styles.comboOptionActive]}
                              onPress={() => setComboConfig({...comboConfig, region: { ...comboConfig.region, city, state: '', district: '' }})}
                            >
                              <Text style={[styles.comboOptionText, comboConfig.region.city === city && styles.comboOptionTextActive]}>{city}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </>
                    )}

                    {/* 问题类型选择 */}
                    <Text style={styles.comboLabel}>问题类型</Text>
                    <View style={styles.comboTypeRow}>
                      {questionTypes.map(type => (
                        <TouchableOpacity 
                          key={type} 
                          style={[styles.comboOption, comboConfig.questionType === type && styles.comboOptionActive]}
                          onPress={() => setComboConfig({...comboConfig, questionType: type, category: ''})}
                        >
                          <Text style={[styles.comboOptionText, comboConfig.questionType === type && styles.comboOptionTextActive]}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* 类别选择 */}
                    {comboConfig.questionType && categoryData[comboConfig.questionType] && (
                      <>
                        <Text style={styles.comboLabel}>选择类别</Text>
                        <View style={styles.comboCategoryGrid}>
                          {categoryData[comboConfig.questionType].map(cat => (
                            <TouchableOpacity 
                              key={cat} 
                              style={[styles.comboOption, comboConfig.category === cat && styles.comboOptionActive]}
                              onPress={() => setComboConfig({...comboConfig, category: cat})}
                            >
                              <Text style={[styles.comboOptionText, comboConfig.category === cat && styles.comboOptionTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </>
                    )}

                    {/* 预览和创建 */}
                    <View style={styles.comboPreview}>
                      <Text style={styles.comboPreviewLabel}>频道预览：</Text>
                      <Text style={styles.comboPreviewText}>
                        {[comboConfig.region.country, comboConfig.region.city, comboConfig.questionType, comboConfig.category].filter(Boolean).join('·') || '请选择组合条件'}
                      </Text>
                    </View>
                    <View style={styles.comboActions}>
                      <TouchableOpacity style={styles.comboCancelBtn} onPress={() => { setShowComboCreator(false); setComboConfig({ region: { country: '', city: '', state: '', district: '' }, questionType: '', category: '' }); }}>
                        <Text style={styles.comboCancelText}>取消</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.comboConfirmBtn} onPress={createComboChannel}>
                        <Text style={styles.comboConfirmText}>创建频道</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              
              <View style={{ height: 50 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 切换城市弹窗 */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.cityModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => { if (citySelectStep > 0) setCitySelectStep(citySelectStep - 1); else closeCityModal(); }}>
                <Ionicons name={citySelectStep > 0 ? "arrow-back" : "close"} size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{getCitySelectTitle()}</Text>
              <TouchableOpacity onPress={closeCityModal}>
                <Text style={styles.resetText}>取消</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.currentCityRow}>
              <Ionicons name="navigate" size={16} color="#22c55e" />
              <Text style={styles.currentCityLabel}>当前位置：</Text>
              <Text style={styles.currentCityValue}>{localCity}</Text>
            </View>
            {/* 已选择的路径 */}
            <View style={[styles.selectedPathRow, { display: citySelectStep > 0 ? 'flex' : 'none' }]}>
              <Text style={styles.selectedPathLabel}>已选择：</Text>
              <Text style={styles.selectedPathText}>
                {selectedCityRegion.country}
                {selectedCityRegion.state ? ` > ${selectedCityRegion.state}` : ''}
              </Text>
            </View>
            <ScrollView style={styles.citySelectList}>
              {getCitySelectOptions().map((option, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.citySelectOption}
                  onPress={() => selectCityRegion(option)}
                >
                  <Text style={styles.citySelectOptionText}>{option}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 附近距离选择弹窗 */}
      <Modal visible={showNearbyModal} transparent animationType="fade">
        <TouchableOpacity style={styles.nearbyModalOverlay} activeOpacity={1} onPress={() => setShowNearbyModal(false)}>
          <View style={styles.nearbyModal}>
            <Text style={styles.nearbyTitle}>选择距离范围</Text>
            {['1公里', '2公里', '3公里', '5公里', '10公里'].map(distance => (
              <TouchableOpacity 
                key={distance} 
                style={[styles.nearbyOption, nearbyDistance === distance && styles.nearbyOptionActive]}
                onPress={() => { setNearbyDistance(distance); setShowNearbyModal(false); }}
              >
                <Text style={[styles.nearbyOptionText, nearbyDistance === distance && styles.nearbyOptionTextActive]}>{distance}</Text>
                {nearbyDistance === distance && <Ionicons name="checkmark" size={18} color="#ef4444" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 紧急求助弹窗 */}
      <Modal visible={showEmergencyModal} animationType="slide">
        <SafeAreaView style={styles.emergencyModal}>
          <View style={styles.emergencyHeader}>
            <TouchableOpacity onPress={() => setShowEmergencyModal(false)}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.emergencyHeaderCenter}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.emergencyHeaderTitle}>紧急求助</Text>
            </View>
            <TouchableOpacity 
              style={[styles.emergencySubmitBtn, !emergencyForm.title.trim() && styles.emergencySubmitBtnDisabled]}
              onPress={() => {
                if (!emergencyForm.title.trim()) {
                  alert('请输入求助标题');
                  return;
                }
                alert('紧急求助已发布，附近用户将收到通知！');
                setShowEmergencyModal(false);
                setEmergencyForm({ title: '', description: '', location: '', contact: '' });
              }}
              disabled={!emergencyForm.title.trim()}
            >
              <Text style={[styles.emergencySubmitText, !emergencyForm.title.trim() && styles.emergencySubmitTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyWarning}>
            <Ionicons name="warning" size={18} color="#f59e0b" />
            <Text style={styles.emergencyWarningText}>紧急求助将通知附近用户，请确保情况紧急真实</Text>
          </View>

          <ScrollView style={styles.emergencyFormArea} keyboardShouldPersistTaps="handled">
            <View style={styles.emergencyFormGroup}>
              <Text style={styles.emergencyFormLabel}>求助标题 <Text style={{ color: '#ef4444' }}>*</Text></Text>
              <TextInput
                style={styles.emergencyFormInput}
                placeholder="简要描述您遇到的紧急情况"
                placeholderTextColor="#bbb"
                value={emergencyForm.title}
                onChangeText={(text) => setEmergencyForm({...emergencyForm, title: text})}
              />
            </View>

            <View style={styles.emergencyFormGroup}>
              <Text style={styles.emergencyFormLabel}>详细描述</Text>
              <TextInput
                style={[styles.emergencyFormInput, styles.emergencyFormTextarea]}
                placeholder="请详细描述您的情况，以便他人更好地帮助您..."
                placeholderTextColor="#bbb"
                value={emergencyForm.description}
                onChangeText={(text) => setEmergencyForm({...emergencyForm, description: text})}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.emergencyFormGroup}>
              <Text style={styles.emergencyFormLabel}>当前位置</Text>
              <View style={styles.emergencyLocationRow}>
                <View style={styles.emergencyLocationInput}>
                  <Ionicons name="location" size={18} color="#ef4444" />
                  <TextInput
                    style={styles.emergencyLocationText}
                    placeholder="输入或获取当前位置"
                    placeholderTextColor="#bbb"
                    value={emergencyForm.location || localCity}
                    onChangeText={(text) => setEmergencyForm({...emergencyForm, location: text})}
                  />
                </View>
                <TouchableOpacity style={styles.emergencyLocationBtn}>
                  <Ionicons name="navigate" size={18} color="#3b82f6" />
                  <Text style={styles.emergencyLocationBtnText}>定位</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.emergencyFormGroup}>
              <Text style={styles.emergencyFormLabel}>联系方式</Text>
              <View style={styles.emergencyContactInput}>
                <Ionicons name="call" size={18} color="#6b7280" />
                <TextInput
                  style={styles.emergencyContactText}
                  placeholder="请留下您的联系电话"
                  placeholderTextColor="#bbb"
                  value={emergencyForm.contact}
                  onChangeText={(text) => setEmergencyForm({...emergencyForm, contact: text})}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.emergencyTips}>
              <Text style={styles.emergencyTipsTitle}>温馨提示</Text>
              <Text style={styles.emergencyTipsText}>• 紧急求助将推送给附近 {nearbyDistance} 内的用户</Text>
              <Text style={styles.emergencyTipsText}>• 请确保描述真实准确，虚假求助将被处罚</Text>
              <Text style={styles.emergencyTipsText}>• 如遇生命危险，请优先拨打急救电话</Text>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
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
                  <Image source={{ uri: item.avatar }} style={styles.socialUserAvatar} />
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
  notifyBtn: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4 },
  tabBarContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabBar: { flex: 1 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  tabMenuBtn: { paddingHorizontal: 12, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#f3f4f6' },
  list: { flex: 1, paddingTop: 12, paddingHorizontal: 12 },
  questionCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 4, paddingBottom: 8 },
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
  moreBtn: { padding: 4 },
  questionTitle: { fontSize: 15, fontWeight: '500', color: '#1f2937', lineHeight: 22, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 },
  singleImage: { height: 160, marginHorizontal: 12, marginBottom: 10, borderRadius: 8 },
  imageGrid: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 10, gap: 6 },
  gridImage: { width: 100, height: 100, borderRadius: 8 },
  pkSection: { paddingHorizontal: 12, paddingBottom: 10 },
  pkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pkBarWrapper: { flex: 1, position: 'relative' },
  pkBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  pkSolvedBar: { backgroundColor: '#3b82f6', height: '100%' },
  pkUnsolvedBar: { backgroundColor: '#ef4444', height: '100%' },
  pkPercentLabel: { position: 'absolute', top: 10, transform: [{ translateX: -12 }] },
  pkPercentText: { fontSize: 10, color: '#6b7280', fontWeight: '500' },
  voteSolvedBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 2 },
  voteSolvedText: { fontSize: 10, color: '#3b82f6', fontWeight: '500' },
  voteUnsolvedBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 2 },
  voteUnsolvedText: { fontSize: 10, color: '#ef4444', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f9fafb' },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#6b7280' },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  joinGroupIconBtn: { padding: 4 },
  answerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, gap: 4 },
  answerBtnText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  // Modal styles
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
  // Channel Modal styles
  channelModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  channelModal: { flex: 1, backgroundColor: '#fff', marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  channelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  channelScrollView: { flex: 1, padding: 16 },
  channelTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  channelHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  editText: { fontSize: 14, color: '#ef4444' },
  closeBtn: { padding: 4 },
  channelTip: { fontSize: 12, color: '#9ca3af', marginBottom: 12 },
  channelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  channelTag: { backgroundColor: '#f3f4f6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, position: 'relative' },
  channelTagFirst: { backgroundColor: '#fef2f2' },
  channelTagText: { fontSize: 14, color: '#1f2937' },
  channelTagTextFirst: { color: '#ef4444' },
  deleteIcon: { position: 'absolute', top: -6, right: -6, width: 16, height: 16, backgroundColor: '#9ca3af', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  recommendSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recommendTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginRight: 8 },
  recommendTip: { fontSize: 12, color: '#9ca3af' },
  channelTagAdd: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, gap: 4 },
  channelTagAddText: { fontSize: 14, color: '#6b7280' },
  // Combo Channel styles
  comboSection: { marginTop: 10, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  comboHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  comboTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginRight: 8 },
  comboTip: { fontSize: 12, color: '#9ca3af' },
  createComboBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', paddingVertical: 12, borderRadius: 8, gap: 6 },
  createComboBtnText: { fontSize: 14, color: '#ef4444', fontWeight: '500' },
  comboCreator: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
  comboLabel: { fontSize: 13, fontWeight: '500', color: '#4b5563', marginBottom: 8, marginTop: 12 },
  comboScrollRow: { marginBottom: 4 },
  comboTypeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  comboOption: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  comboOptionActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  comboOptionText: { fontSize: 13, color: '#4b5563' },
  comboOptionTextActive: { color: '#fff' },
  comboCategoryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  comboPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12 },
  comboPreviewLabel: { fontSize: 13, color: '#6b7280', marginRight: 8 },
  comboPreviewText: { fontSize: 14, color: '#ef4444', fontWeight: '500', flex: 1 },
  comboActions: { flexDirection: 'row', marginTop: 12, gap: 12 },
  comboCancelBtn: { flex: 1, backgroundColor: '#f3f4f6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  comboCancelText: { fontSize: 14, color: '#6b7280' },
  comboConfirmBtn: { flex: 1, backgroundColor: '#ef4444', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  comboConfirmText: { fontSize: 14, color: '#fff', fontWeight: '500' },
  // Social Modal styles
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
  // 同城筛选条样式
  localFilterBar: { backgroundColor: '#fff', marginBottom: 12, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8 },
  localFilterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  localFilterItem: { alignItems: 'center', flex: 1 },
  localFilterIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  localFilterLabel: { fontSize: 12, color: '#4b5563' },
  localFilterLabelActive: { color: '#ef4444', fontWeight: '500' },
  // 切换城市弹窗样式
  cityModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  currentCityRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f0fdf4', marginHorizontal: 16, marginTop: 12, borderRadius: 8, gap: 6 },
  currentCityLabel: { fontSize: 13, color: '#6b7280' },
  currentCityValue: { fontSize: 14, color: '#22c55e', fontWeight: '500' },
  selectedPathRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fef3c7', marginHorizontal: 16, marginTop: 8, borderRadius: 8 },
  selectedPathLabel: { fontSize: 12, color: '#92400e' },
  selectedPathText: { fontSize: 13, color: '#f59e0b', fontWeight: '500', marginLeft: 4 },
  citySelectList: { padding: 8, maxHeight: 400 },
  citySelectOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  citySelectOptionText: { fontSize: 15, color: '#1f2937' },
  hotCityTitle: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginHorizontal: 16, marginTop: 16, marginBottom: 12 },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  cityItem: { width: (screenWidth - 24 - 30) / 4, backgroundColor: '#f3f4f6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  cityItemActive: { backgroundColor: '#fef2f2' },
  cityItemText: { fontSize: 13, color: '#4b5563' },
  cityItemTextActive: { color: '#ef4444', fontWeight: '500' },
  // 附近距离弹窗样式
  nearbyModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  nearbyModal: { backgroundColor: '#fff', borderRadius: 12, width: screenWidth - 80, padding: 16 },
  nearbyTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  nearbyOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  nearbyOptionActive: { backgroundColor: '#fef2f2', borderRadius: 8 },
  nearbyOptionText: { fontSize: 15, color: '#4b5563' },
  nearbyOptionTextActive: { color: '#ef4444', fontWeight: '500' },
  // 紧急求助弹窗样式
  emergencyModal: { flex: 1, backgroundColor: '#fff' },
  emergencyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  emergencyHeaderCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  emergencyHeaderTitle: { fontSize: 17, fontWeight: '600', color: '#ef4444' },
  emergencySubmitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  emergencySubmitBtnDisabled: { backgroundColor: '#fecaca' },
  emergencySubmitText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  emergencySubmitTextDisabled: { color: '#fff' },
  emergencyWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  emergencyWarningText: { fontSize: 12, color: '#92400e', flex: 1 },
  emergencyFormArea: { flex: 1, padding: 16 },
  emergencyFormGroup: { marginBottom: 16 },
  emergencyFormLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  emergencyFormInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyFormTextarea: { minHeight: 100, textAlignVertical: 'top' },
  emergencyLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emergencyLocationInput: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  emergencyLocationText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyLocationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, gap: 4 },
  emergencyLocationBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  emergencyContactInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  emergencyContactText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyTips: { backgroundColor: '#fef2f2', borderRadius: 8, padding: 12, marginTop: 8 },
  emergencyTipsTitle: { fontSize: 13, fontWeight: '500', color: '#991b1b', marginBottom: 8 },
  emergencyTipsText: { fontSize: 12, color: '#b91c1c', lineHeight: 20 },
});
