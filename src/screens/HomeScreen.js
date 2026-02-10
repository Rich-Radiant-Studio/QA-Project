import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, Dimensions, TextInput, FlatList, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Avatar from '../components/Avatar';
import TranslateButton from '../components/TranslateButton';
import { useTranslation } from '../i18n/withTranslation';
import { getRegionData } from '../data/regionData';

const { width: screenWidth } = Dimensions.get('window');

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程?有没有系统的学习路线推荐?作为一名文科生，之前完全没有接触过编程，最近想转行做数据分析，听说Python是必备技能，想请教各位大神应该如何开始学习，需要掌握哪些核心知识点？', type: 'reward', reward: 50, likes: 128, dislikes: 12, answers: 56, shares: 34, bookmarks: 89, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop', solvedPercent: 65, country: '中国', city: '北京' },
  { id: 2, title: '第一次养猫需要准备什么?有哪些新手容易踩的坑?', type: 'paid', paidAmount: 9.9, likes: 256, dislikes: 8, answers: 89, shares: 56, bookmarks: 120, author: '李小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'], solvedPercent: 80, country: '美国', city: '纽约州', state: '纽约市', isPaid: false },
  { id: 3, title: '长期失眠应该怎么调理?吃褪黑素有用吗?求专业医生解答', type: 'targeted', likes: 512, dislikes: 5, answers: 234, shares: 78, bookmarks: 156, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天 18:30', verified: true, solvedPercent: 45, country: '日本', city: '东京' },
  { id: 4, title: '35岁程序员如何规划职业发展?是继续技术深耕还是转管理?', type: 'reward', reward: 100, likes: 1200, dislikes: 23, answers: 456, shares: 234, bookmarks: 567, author: '程序员小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', solvedPercent: 30, country: '中国', city: '上海' },
  { id: 5, title: '有什么简单又好吃的家常菜推荐?最好是新手也能做的那种', type: 'free', likes: 368, dislikes: 6, answers: 127, shares: 45, bookmarks: 98, author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', time: '6小时前', images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'], solvedPercent: 92, country: '英国', city: '伦敦' },
];

// tabs array will be moved inside component to use translation

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

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  // 获取多语言区域数据
  const regionData = getRegionData();
  
  // 添加调试信息 - 显示检测到的语言
  React.useEffect(() => {
    console.log('='.repeat(50));
    console.log('🔍 HomeScreen mounted - Language Detection Debug');
    console.log('='.repeat(50));
    console.log('📱 regionData.countries:', regionData.countries?.slice(0, 3));
    console.log('🌐 First country:', regionData.countries?.[0]);
    console.log('='.repeat(50));
  }, []);
  
  // Tabs array using translation
  const tabs = [
    t('home.follow'),
    t('home.topics'),
    t('home.recommend'),
    t('home.hotList'),
    t('home.incomeRanking'),
    t('home.sameCity'),
    t('home.country'),
    t('home.industry'),
    t('home.personal'),
    t('home.workplace'),
    t('home.education')
  ];
  
  const [activeTab, setActiveTab] = useState(t('home.recommend'));
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
  
  // 翻译状态
  const [translatedContent, setTranslatedContent] = useState({});
  
  // 问题标题展开/折叠状态
  const [expandedTitles, setExpandedTitles] = useState({});
  
  // 记录哪些标题需要折叠（超过3行）
  const [needsExpand, setNeedsExpand] = useState({});
  
  // 记录标题的完整行数
  const [titleLineCount, setTitleLineCount] = useState({});
  
  // 时间格式化函数 - with translation support
  const formatTime = (timeStr) => {
    // 如果已经是格式化的字符串（如"2小时前"），需要解析
    const now = new Date();
    let targetTime;
    
    // 解析不同格式的时间字符串
    if (timeStr.includes('小时前') || timeStr.includes('hours ago')) {
      const hours = parseInt(timeStr);
      targetTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
    } else if (timeStr.includes('分钟前') || timeStr.includes('minutes ago')) {
      const minutes = parseInt(timeStr);
      targetTime = new Date(now.getTime() - minutes * 60 * 1000);
    } else if (timeStr.includes('昨天') || timeStr.includes('Yesterday')) {
      targetTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else {
      // 假设是时间戳或其他格式
      targetTime = new Date(timeStr);
    }
    
    const diff = now - targetTime;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days >= 1) {
      return t('home.yesterday');
    } else if (hours >= 1) {
      return `${hours} ${t('home.hoursAgo')}`;
    } else if (minutes >= 1) {
      return `${minutes} ${t('home.minutesAgo')}`;
    } else {
      return t('home.justNow');
    }
  };

  // 根据选择的区域层级显示地区信息
  const getLocationDisplay = (item) => {
    // 始终根据问题本身的地区数据来显示
    // 如果没有选择任何区域，只显示国家
    if (!selectedRegion.country) {
      return item.country;
    }
    
    // 如果只选择了国家，显示城市（省份/州）
    if (selectedRegion.country && !selectedRegion.city) {
      return item.city || item.country;
    }
    
    // 如果选择了城市（省份/州），显示州/区（如果有的话）
    if (selectedRegion.city && !selectedRegion.state) {
      return item.state || item.city || item.country;
    }
    
    // 如果选择了州/区，显示最后一层（区）
    if (selectedRegion.state && !selectedRegion.district) {
      return item.district || item.state || item.city;
    }
    
    // 如果选择了最后一层，显示最后一层的名字
    if (selectedRegion.district) {
      return item.district || item.state || item.city;
    }
    
    // 默认显示国家
    return item.country;
  };



  // 同城筛选状态
  const [localCity, setLocalCity] = useState('北京');
  const [localFilter, setLocalFilter] = useState('latest');
  const [showCityModal, setShowCityModal] = useState(false);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [nearbyDistance, setNearbyDistance] = useState('3公里');
  const [citySelectStep, setCitySelectStep] = useState(0); // 0:国家 1:省份 2:城市
  const [selectedCityRegion, setSelectedCityRegion] = useState({ country: '中国', state: '北京市', city: '北京' });

  // 同城地区数据 - 使用与主区域选择器相同的多语言数据
  const cityRegionData = regionData;



  // 同城功能
  const getCitySelectOptions = () => {
    if (citySelectStep === 0) return cityRegionData.countries;
    if (citySelectStep === 1) {
      // 使用 cities 对象，键是国家名
      return cityRegionData.cities[selectedCityRegion.country] || [];
    }
    if (citySelectStep === 2) {
      // 使用 states 对象，键是城市名
      return cityRegionData.states[selectedCityRegion.state] || [];
    }
    return [];
  };

  const getCitySelectTitle = () => [t('home.selectCountry'), t('home.selectState'), t('home.selectCity')][citySelectStep];

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
          <Text style={styles.footerText}>{t('home.loading')}</Text>
        </View>
      );
    }
    
    if (!hasMore) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>{t('home.noMoreContent')}</Text>
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

  const getRegionTitle = () => [t('home.selectCountry'), t('home.selectCity'), t('home.selectState'), t('home.selectDistrict')][regionStep];
  const getDisplayRegion = () => {
    const parts = [selectedRegion.country, selectedRegion.city, selectedRegion.state, selectedRegion.district].filter(Boolean);
    // 只显示最后一级，如果没有选择则显示"全球"
    if (parts.length === 0) return t('home.global');
    return parts[parts.length - 1];
  };



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          <Text style={styles.searchPlaceholder}>{t('home.search')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.teamBtn}
          onPress={() => navigation.navigate('MyTeams')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="person-add-outline" size={22} color="#4b5563" />
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
                if (tab === t('home.follow')) {
                  navigation.navigate('Follow');
                } else if (tab === t('home.hotList')) {
                  navigation.navigate('HotList');
                } else if (tab === t('home.incomeRanking')) {
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
      <View style={[styles.socialButtonsBar, { display: activeTab === t('home.follow') ? 'flex' : 'none' }]}>
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
      {activeTab !== t('home.topics') ? (
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
              <View style={[styles.localFilterBar, { display: activeTab === t('home.sameCity') ? 'flex' : 'none' }]}>
                <View style={styles.localFilterRow}>
                  <TouchableOpacity style={styles.localFilterItem} onPress={() => setShowCityModal(true)}>
                    <View style={[styles.localFilterIcon, { backgroundColor: '#e0f2fe' }]}>
                      <Ionicons name="navigate" size={22} color="#0ea5e9" />
                    </View>
                    <Text style={styles.localFilterLabel}>{t('home.switchLocation')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => setLocalFilter('latest')}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="time" size={22} color="#f59e0b" />
                    </View>
                    <Text style={[styles.localFilterLabel, localFilter === 'latest' && styles.localFilterLabelActive]}>{t('home.latest')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => setLocalFilter('hottest')}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="flame" size={22} color="#f59e0b" />
                    </View>
                    <Text style={[styles.localFilterLabel, localFilter === 'hottest' && styles.localFilterLabelActive]}>{t('home.hottest')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => { setLocalFilter('nearby'); setShowNearbyModal(true); }}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="location" size={22} color="#ef4444" />
                    </View>
                    <Text style={[styles.localFilterLabel, localFilter === 'nearby' && styles.localFilterLabelActive]}>{t('home.nearby')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.localFilterItem}
                    onPress={() => setShowEmergencyModal(true)}
                  >
                    <View style={[styles.localFilterIcon, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="alert-circle" size={22} color="#ef4444" />
                    </View>
                    <Text style={styles.localFilterLabel}>{t('emergency.title')}</Text>
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
                  {/* 问题标题和标签 */}
                  <View style={styles.questionTitleWrapper}>
                    {/* 隐藏的完整文本用于检测行数 */}
                    <Text 
                      style={[styles.questionTitle, { position: 'absolute', opacity: 0, zIndex: -1 }]}
                      onTextLayout={(e) => {
                        const lineCount = e.nativeEvent.lines.length;
                        if (lineCount > 3 && !titleLineCount[item.id]) {
                          setTitleLineCount(prev => ({ ...prev, [item.id]: lineCount }));
                          setNeedsExpand(prev => ({ ...prev, [item.id]: true }));
                        }
                      }}
                    >
                      {(item.type === 'reward' && item.reward) || (item.type === 'targeted' && item.reward) || item.type === 'paid' ? (
                        <>
                          {item.type === 'reward' && item.reward && (
                            <Text style={styles.rewardTagInline}> ${item.reward} </Text>
                          )}
                          {item.type === 'targeted' && (
                            <>
                              {item.reward && item.reward > 0 ? (
                                <Text style={styles.targetedTagInline}> ${item.reward} </Text>
                              ) : (
                                <Text style={styles.targetedTagInline}> {t('home.targeted')} </Text>
                              )}
                            </>
                          )}
                          {item.type === 'paid' && (
                            <Text style={styles.paidTagInline}> {t('home.paid')} </Text>
                          )}
                          {'  '}
                        </>
                      ) : null}
                      {translatedContent[item.id]?.title || item.title}
                    </Text>
                    
                    {/* 实际显示的文本 */}
                    <View style={styles.titleContainer}>
                      <Text style={styles.questionTitle} numberOfLines={3}>
                        {(item.type === 'reward' && item.reward) || (item.type === 'targeted' && item.reward) || item.type === 'paid' ? (
                          <>
                            {item.type === 'reward' && item.reward && (
                              <Text style={styles.rewardTagInline}> ${item.reward} </Text>
                            )}
                            {item.type === 'targeted' && (
                              <>
                                {item.reward && item.reward > 0 ? (
                                  <Text style={styles.targetedTagInline}> ${item.reward} </Text>
                                ) : (
                                  <Text style={styles.targetedTagInline}> {t('home.targeted')} </Text>
                                )}
                              </>
                            )}
                            {item.type === 'paid' && (
                              <Text style={styles.paidTagInline}> {t('home.paid')} </Text>
                            )}
                            {'  '}
                          </>
                        ) : null}
                        {translatedContent[item.id]?.title || item.title}
                      </Text>
                      {needsExpand[item.id] && (
                        <TouchableOpacity 
                          style={styles.fullTextBtnBottom}
                          onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate('QuestionDetail', { id: item.id });
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.fullTextBtnText}>...全文</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {/* 翻译按钮 */}
                    <TranslateButton 
                      text={item.title}
                      compact={false}
                      onTranslated={(translatedText, isTranslated) => {
                        setTranslatedContent(prev => ({
                          ...prev,
                          [item.id]: {
                            ...prev[item.id],
                            title: isTranslated ? translatedText : null
                          }
                        }));
                      }}
                    />
                  </View>

                  {/* 付费查看按钮 */}
                  {item.type === 'paid' && !item.isPaid && (
                    <TouchableOpacity 
                      style={styles.paidViewButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        alert(t('home.payToView').replace('${amount}', item.paidAmount));
                      }}
                    >
                      <View style={styles.paidViewContent}>
                        <Ionicons name="lock-closed-outline" size={20} color="#f59e0b" />
                        <Text style={styles.paidViewText}>{t('home.paidViewContent')}</Text>
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
                      <Avatar uri={item.avatar} name={item.author} size={17} />
                      <Text style={styles.authorName}>{item.author}</Text>
                      {item.verified && <Ionicons name="checkmark-circle" size={10} color="#3b82f6" style={{ marginLeft: 2 }} />}
                      <Text style={styles.metaSeparator}>·</Text>
                      <Text style={styles.postTime}>{formatTime(item.time)}</Text>
                      <Text style={styles.metaSeparator}>·</Text>
                      <Ionicons name="location-outline" size={9} color="#9ca3af" />
                      <Text style={styles.locationText}>{getLocationDisplay(item)}</Text>
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
                    <Text style={styles.topicStats}>{topic.followers} {t('home.followers')} · {topic.questions} {t('home.questions')}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.topicFollowBtn, displayFollowed && styles.topicFollowBtnActive]}
                    onPress={() => toggleFollowTopic(topic.id)}
                  >
                    <Text style={[styles.topicFollowBtnText, displayFollowed && styles.topicFollowBtnTextActive]}>
                      {displayFollowed ? t('home.unfollowTopic') : `+ ${t('home.followTopic')}`}
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
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1} 
            onPress={() => { setShowRegionModal(false); setRegionStep(0); }}
          />
          <View style={[styles.regionModal, { paddingBottom: 30 }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => { setShowRegionModal(false); setRegionStep(0); }}>
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('home.selectRegion')}</Text>
              <TouchableOpacity onPress={() => { 
                setShowRegionModal(false);
                setRegionStep(0);
              }}>
                <Text style={styles.confirmText}>{t('home.confirm')}</Text>
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
                    {selectedRegion.country || t('home.country')}
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
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ffffff' },
  regionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#fef2f2', borderRadius: 16, marginRight: 8, maxWidth: 80 },
  regionText: { fontSize: 12, color: '#ef4444', marginLeft: 4, fontWeight: '500', lineHeight: 16, includeFontPadding: false, maxWidth: 56 },
  searchBar: { flex: 1, height: 36, backgroundColor: '#f5f5f5', borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginHorizontal: 8 },
  searchPlaceholder: { fontSize: 13, color: '#999999', marginLeft: 6, flexShrink: 1 },
  teamBtn: { flexDirection: 'row', alignItems: 'center', padding: 6, marginLeft: 4 },
  notifyBtn: { flexDirection: 'row', alignItems: 'center', padding: 6, marginLeft: 4, position: 'relative' },
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
  listContainer: { flex: 1, backgroundColor: '#ffffff' },
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
  },
  firstQuestionCard: {
    paddingTop: 0,
  },
  questionCardInner: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  lastQuestionCardInner: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0,
  },
  questionTitleWrapper: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
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
  rewardTagInline: { 
    backgroundColor: 'transparent', 
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    borderRadius: 0,
    fontSize: 19, 
    color: '#ef4444', 
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 22,
  },
  targetedTagInline: { 
    backgroundColor: 'transparent', 
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    borderRadius: 0,
    fontSize: 19, 
    color: '#8b5cf6', 
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 22,
  },
  paidTagInline: { 
    backgroundColor: 'transparent', 
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    borderRadius: 0,
    fontSize: 18, 
    color: '#f59e0b', 
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 22,
  },
  paidTagText: { fontSize: 10, color: '#fff', fontWeight: '700', textTransform: 'uppercase', includeFontPadding: false },
  paidViewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 6, borderStyle: 'dashed' },
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
    textAlign: 'left',
  },
  titleContainer: {
    position: 'relative',
  },
  expandHintHome: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  expandHintTextHome: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  expandHintInline: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  fullTextInline: { 
    fontSize: 17,
    color: '#1a1a1a',
  },
  fullTextBtnBottom: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  fullTextBtnText: { fontSize: 14, color: '#3b82f6', fontWeight: '500' },
  imagesContainer: {
    marginBottom: 6,
  },
  singleImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8,
    marginBottom: 6,
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
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
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
