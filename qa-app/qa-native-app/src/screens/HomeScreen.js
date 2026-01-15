import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Modal, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？', type: 'reward', reward: 50, likes: 128, dislikes: 12, answers: 56, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop', solvedPercent: 65, country: '中国', city: '北京' },
  { id: 2, title: '第一次养猫需要准备什么？有哪些新手容易踩的坑？', type: 'free', likes: 256, dislikes: 8, answers: 89, author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'], solvedPercent: 80, country: '美国', city: '纽约' },
  { id: 3, title: '长期失眠应该怎么调理？吃褪黑素有用吗？求专业医生解答', type: 'targeted', likes: 512, dislikes: 5, answers: 234, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天 18:30', verified: true, solvedPercent: 45, country: '日本', city: '东京' },
  { id: 4, title: '35岁程序员如何规划职业发展？是继续技术深耕还是转管理？', type: 'reward', reward: 100, likes: 1200, dislikes: 23, answers: 456, author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', solvedPercent: 30, country: '中国', city: '上海' },
  { id: 5, title: '有什么简单又好吃的家常菜推荐？最好是新手也能做的那种', type: 'free', likes: 368, dislikes: 6, answers: 127, author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', time: '6小时前', images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'], solvedPercent: 92, country: '英国', city: '伦敦' },
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
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
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

  // 问题类型和类别数据
  const questionTypes = ['国家问题', '行业问题', '个人问题'];
  const categoryData = {
    '国家问题': ['政策法规', '社会民生', '经济发展', '教育医疗', '环境保护', '基础设施'],
    '行业问题': ['互联网', '金融', '制造业', '医疗健康', '教育培训', '房地产', '餐饮服务'],
    '个人问题': ['职业发展', '情感生活', '健康养生', '理财投资', '学习成长', '家庭关系']
  };

  const toggleLike = (id) => setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
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
        <TouchableOpacity style={styles.notifyBtn} onPress={() => navigation.navigate('Main', { screen: '消息' })}>
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

              {/* PK进度条 - 只显示已解决百分比在交界处上方 */}
              <View style={styles.pkSection}>
                <View style={styles.pkBar}>
                  <View style={[styles.pkSolvedBar, { width: `${item.solvedPercent}%` }]} />
                  <View style={[styles.pkUnsolvedBar, { width: `${100 - item.solvedPercent}%` }]} />
                  <View style={[styles.pkPercentLabel, { left: `${item.solvedPercent}%` }]}>
                    <Text style={styles.pkPercentText}>{item.solvedPercent}%</Text>
                  </View>
                </View>
                {/* 已解决/未解决按钮 */}
                <View style={styles.pkButtons}>
                  <TouchableOpacity style={styles.solvedBtn}>
                    <Text style={styles.solvedBtnText}>已解决</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity style={styles.unsolvedBtn}>
                    <Text style={styles.unsolvedBtnText}>未解决</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 头像、姓名、时间、地区 - 放在已解决下方 */}
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.authorInfo}>
                  <View style={styles.authorRow}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    {item.verified && <Ionicons name="checkmark-circle" size={12} color="#3b82f6" style={{ marginLeft: 4 }} />}
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.postTime}>{item.time}</Text>
                    <Text style={styles.locationText}>
                      <Ionicons name="location-outline" size={10} color="#9ca3af" /> {item.country} · {item.city}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 操作按钮 */}
              <View style={styles.cardFooter}>
                <View style={styles.leftActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(item.id)}>
                    <Ionicons name={isLiked ? "thumbs-up" : "thumbs-up-outline"} size={16} color={isLiked ? "#ef4444" : "#6b7280"} />
                    <Text style={[styles.actionText, isLiked && { color: '#ef4444' }]}>{formatNumber(item.likes + (isLiked ? 1 : 0))}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="thumbs-down-outline" size={16} color="#6b7280" />
                    <Text style={styles.actionText}>{item.dislikes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                    <Text style={styles.actionText}>{item.answers}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="share-social-outline" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.rightActions}>
                  <TouchableOpacity style={styles.joinGroupBtn}>
                    <Ionicons name="people-outline" size={14} color="#6b7280" />
                    <Text style={styles.joinGroupText}>加入群聊</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerBtn}>
                    <Ionicons name="create-outline" size={14} color="#fff" />
                    <Text style={styles.answerBtnText}>回答</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moreBtn} onPress={() => openActionModal(item)}>
                    <Ionicons name="ellipsis-horizontal" size={18} color="#9ca3af" />
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
              <Ionicons name="add-circle-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>补充问题</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="bookmark-outline" size={22} color="#1f2937" />
              <Text style={styles.actionItemText}>收藏问题</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
              <Text style={styles.actionItemText}>@{selectedQuestion?.author}（推特）</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <FontAwesome5 name="facebook" size={20} color="#4267B2" />
              <Text style={styles.actionItemText}>@{selectedQuestion?.author}（Facebook）</Text>
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
                        setActiveTab(channel);
                        setShowChannelModal(false);
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 6, paddingBottom: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  authorInfo: { flex: 1, marginLeft: 8 },
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 12, fontWeight: '500', color: '#6b7280' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  postTime: { fontSize: 10, color: '#9ca3af', marginRight: 6 },
  locationText: { fontSize: 10, color: '#9ca3af' },
  moreBtn: { padding: 4 },
  questionTitle: { fontSize: 15, fontWeight: '500', color: '#1f2937', lineHeight: 22, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 },
  singleImage: { height: 160, marginHorizontal: 12, marginBottom: 10, borderRadius: 8 },
  imageGrid: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 10, gap: 6 },
  gridImage: { width: 100, height: 100, borderRadius: 8 },
  pkSection: { paddingHorizontal: 12, paddingBottom: 10 },
  pkBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'visible', backgroundColor: '#f3f4f6', position: 'relative' },
  pkSolvedBar: { backgroundColor: '#ef4444', height: '100%', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  pkUnsolvedBar: { backgroundColor: '#3b82f6', height: '100%', borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  pkPercentLabel: { position: 'absolute', top: -20, transform: [{ translateX: -15 }] },
  pkPercentText: { fontSize: 11, color: '#1f2937', fontWeight: '600', backgroundColor: '#fff', paddingHorizontal: 4, borderRadius: 4 },
  pkButtons: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8, gap: 8 },
  solvedBtn: { backgroundColor: '#fef2f2', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  solvedBtnText: { fontSize: 11, color: '#ef4444', fontWeight: '500' },
  unsolvedBtn: { backgroundColor: '#eff6ff', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  unsolvedBtnText: { fontSize: 11, color: '#3b82f6', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f9fafb' },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#6b7280' },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  joinGroupBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, gap: 4 },
  joinGroupText: { fontSize: 12, color: '#6b7280' },
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
});
