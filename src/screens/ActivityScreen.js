import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const initialActivities = [
  { 
    id: 1, 
    title: '新人答题挑战赛', 
    desc: '连续7天回答问题，赢取100元现金奖励', 
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop', 
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    ],
    participants: 12580, 
    startTime: '2026-01-10', 
    endTime: '2026-01-20', 
    type: 'online', 
    tag: '热门', 
    status: 'active', 
    joined: false, 
    organizer: '官方', 
    organizerType: 'platform' 
  },
  { id: 2, title: 'Python学习打卡活动', desc: '每日打卡学习Python，坚持21天获得认证徽章', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop', participants: 8956, startTime: '2026-01-05', endTime: '2026-01-26', type: 'online', tag: '新活动', status: 'active', joined: true, progress: '12/21天', organizer: 'Python学习互助团队', organizerType: 'team' },
  { id: 3, title: '程序员线下交流会', desc: '北京站程序员面对面交流，分享技术心得', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop', participants: 156, startTime: '2026-01-25', endTime: '2026-01-25', type: 'offline', address: '北京市朝阳区望京SOHO', tag: '热门', status: 'active', joined: false, organizer: '张三', organizerType: 'personal' },
  { id: 4, title: '优质回答评选', desc: '本周最佳回答评选，获奖者可获得专属勋章', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop', participants: 5623, startTime: '2026-01-01', endTime: '2026-01-10', type: 'online', tag: '已结束', status: 'ended', joined: true, progress: '已完成', organizer: '官方', organizerType: 'platform' },
  { id: 5, title: '邀请好友得红包', desc: '邀请好友注册，双方各得5元红包', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop', participants: 23456, startTime: '2026-01-01', endTime: '2026-12-31', type: 'online', tag: '热门', status: 'active', joined: false, organizer: '官方', organizerType: 'platform' },
];

const tabs = ['全部', '热门', '新活动', '已结束', '我的活动'];

export default function ActivityScreen({ navigation, route }) {
  // 检查是否从我的页面跳转过来
  const isFromProfile = route?.params?.fromProfile === true;
  const initialTab = isFromProfile ? '我的活动' : '全部';
  
  // 检查是否从团队页面跳转过来创建活动
  const createMode = route?.params?.createMode === true;
  const teamId = route?.params?.teamId;
  const teamName = route?.params?.teamName;
  const fromTeamDetail = route?.params?.fromTeamDetail === true; // 标记是否从团队详情页进入
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activities, setActivities] = useState(initialActivities);
  const [showCreateModal, setShowCreateModal] = useState(createMode || false);
  const [showImageViewer, setShowImageViewer] = useState(false); // 图片查看器
  const [viewerImages, setViewerImages] = useState([]); // 当前查看的图片列表
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 当前图片索引
  const [showTeamSelector, setShowTeamSelector] = useState(false); // 团队选择器弹窗
  const [newActivity, setNewActivity] = useState({
    title: '',
    desc: '',
    type: 'online',
    startTime: '',
    endTime: '',
    address: '',
    image: '',
    images: [], // 活动图片数组（最多9张）
    contact: '',
    organizerType: teamId ? 'team' : 'personal', // 如果从团队进入，默认选择团队
    teamId: teamId || null,
    teamName: teamName || ''
  });

  // 模拟用户加入的团队列表
  const myTeams = [
    { id: 1, name: 'Python学习互助团队', members: 12 },
    { id: 2, name: 'JavaScript开发者社区', members: 25 },
    { id: 3, name: '数据分析爱好者', members: 8 },
  ];

  // 监听路由参数变化
  useEffect(() => {
    if (route?.params?.fromProfile) {
      setActiveTab('我的活动');
    }
  }, [route?.params?.fromProfile]);

  const getFilteredActivities = () => {
    switch (activeTab) {
      case '热门':
        return activities.filter(a => a.tag === '热门' && a.status === 'active');
      case '新活动':
        return activities.filter(a => a.tag === '新活动' && a.status === 'active');
      case '已结束':
        return activities.filter(a => a.status === 'ended');
      case '我的活动':
        return activities.filter(a => a.joined);
      default:
        return activities;
    }
  };

  // 处理图片点击
  const handleImagePress = (activity) => {
    if (activity.images && activity.images.length > 1) {
      // 多张图片，打开图片查看器
      setViewerImages(activity.images);
      setCurrentImageIndex(0);
      setShowImageViewer(true);
    } else {
      // 单张图片或无图片，进入活动详情页
      Alert.alert('提示', '进入活动详情页（待开发）');
    }
  };

  const handleJoinActivity = (id) => {
    setActivities(activities.map(a => {
      if (a.id === id) {
        if (a.joined) {
          Alert.alert('提示', '确定要退出该活动吗？', [
            { text: '取消', style: 'cancel' },
            { text: '确定', onPress: () => {
              setActivities(prev => prev.map(item => 
                item.id === id ? { ...item, joined: false, participants: item.participants - 1 } : item
              ));
            }}
          ]);
          return a;
        }
        return { ...a, joined: true, participants: a.participants + 1, progress: '0/7天' };
      }
      return a;
    }));
  };

  const handleCreateActivity = () => {
    if (!newActivity.title.trim()) {
      Alert.alert('提示', '请输入活动标题');
      return;
    }
    if (!newActivity.desc.trim()) {
      Alert.alert('提示', '请输入活动内容');
      return;
    }
    if (!newActivity.startTime || !newActivity.endTime) {
      Alert.alert('提示', '请选择活动时间');
      return;
    }
    if (newActivity.type === 'offline' && !newActivity.address.trim()) {
      Alert.alert('提示', '线下活动请填写活动地址');
      return;
    }
    // 验证团队发起时是否已选择团队
    if (newActivity.organizerType === 'team' && !newActivity.teamName) {
      Alert.alert('提示', '请选择发起活动的团队');
      return;
    }

    const activity = {
      id: Date.now(),
      title: newActivity.title,
      desc: newActivity.desc,
      type: newActivity.type,
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      address: newActivity.address,
      image: newActivity.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      participants: 1,
      tag: '新活动',
      status: 'active',
      joined: true,
      progress: '发起人',
      organizerType: newActivity.organizerType,
      organizer: newActivity.organizerType === 'team' ? newActivity.teamName : '我'
    };

    setActivities([activity, ...activities]);
    setShowCreateModal(false);
    setNewActivity({ 
      title: '', 
      desc: '', 
      type: 'online', 
      startTime: '', 
      endTime: '', 
      address: '', 
      image: '',
      images: [],
      contact: '',
      organizerType: 'personal',
      teamId: null,
      teamName: ''
    });
    Alert.alert('成功', '活动发起成功！');
    
    // 如果是从团队详情页进入的，返回团队详情页
    if (createMode && teamId) {
      navigation.goBack();
    }
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case '热门': return '#ef4444';
      case '新活动': return '#3b82f6';
      case '已结束': return '#9ca3af';
      default: return '#6b7280';
    }
  };

  const getOrganizerIcon = (organizerType) => {
    switch (organizerType) {
      case 'team': return 'people';
      case 'personal': return 'person';
      case 'platform': return 'shield-checkmark';
      default: return 'person';
    }
  };

  const getOrganizerColor = (organizerType) => {
    switch (organizerType) {
      case 'team': return '#8b5cf6';
      case 'personal': return '#3b82f6';
      case 'platform': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // 添加活动图片
  const addActivityImage = () => {
    if (newActivity.images.length < 9) {
      setNewActivity({
        ...newActivity,
        images: [...newActivity.images, `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800&h=600&fit=crop`]
      });
    } else {
      Alert.alert('提示', '最多只能上传9张图片');
    }
  };

  // 删除活动图片
  const removeActivityImage = (index) => {
    setNewActivity({
      ...newActivity,
      images: newActivity.images.filter((_, i) => i !== index)
    });
  };

  const handleSelectTeam = (team) => {
    setNewActivity({
      ...newActivity,
      teamId: team.id,
      teamName: team.name
    });
    setShowTeamSelector(false);
  };

  const handleOrganizerTypeChange = (type) => {
    if (type === 'team' && !createMode) {
      // 如果选择团队发起且不是从团队详情页进入，打开团队选择器
      setShowTeamSelector(true);
    } else {
      setNewActivity({ 
        ...newActivity, 
        organizerType: type,
        teamId: null,
        teamName: ''
      });
    }
  };

  const filteredActivities = getFilteredActivities();

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        {isFromProfile ? (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Main', { screen: '我的' })} 
            style={styles.backBtn}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
        <Text style={styles.headerTitle}>{isFromProfile ? '我的活动' : '活动中心'}</Text>
        <TouchableOpacity 
          onPress={() => setShowCreateModal(true)} 
          style={styles.createBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createBtnText}>发起</Text>
        </TouchableOpacity>
      </View>

      {/* 标签栏 - 仅在非从我的页面进入时显示 */}
      {!isFromProfile && (
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {tabs.map(tab => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 活动列表 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(item => (
            <View key={item.id} style={styles.activityCard}>
              {/* 封面图区域 - 可点击查看图片 */}
              <TouchableOpacity 
                style={styles.coverImageContainer}
                onPress={() => handleImagePress(item)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image }} style={styles.activityImage} />
                
                {/* 图片数量角标 - 仅多图时显示 */}
                {item.images && item.images.length > 1 && (
                  <View style={styles.imageCountBadge}>
                    <Ionicons name="images" size={14} color="#fff" />
                    <Text style={styles.imageCountText}>1/{item.images.length}</Text>
                  </View>
                )}
                
                {/* 标签 */}
                <View style={styles.activityBadges}>
                  <View style={[styles.activityTag, { backgroundColor: getTagColor(item.tag) }]}>
                    <Text style={styles.activityTagText}>{item.tag}</Text>
                  </View>
                  <View style={[styles.typeTag, { backgroundColor: item.type === 'online' ? '#8b5cf6' : '#f59e0b' }]}>
                    <Ionicons name={item.type === 'online' ? 'globe-outline' : 'location-outline'} size={10} color="#fff" />
                    <Text style={styles.typeTagText}>{item.type === 'online' ? '线上' : '线下'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* 活动信息区域 */}
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDesc} numberOfLines={2}>{item.desc}</Text>
                {item.type === 'offline' && item.address && (
                  <View style={styles.addressRow}>
                    <Ionicons name="location" size={14} color="#ef4444" />
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                  </View>
                )}
                <View style={styles.activityMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name={getOrganizerIcon(item.organizerType)} size={14} color={getOrganizerColor(item.organizerType)} />
                    <Text style={[styles.metaText, { color: getOrganizerColor(item.organizerType) }]}>{item.organizer}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people-outline" size={14} color="#9ca3af" />
                    <Text style={styles.metaText}>{item.participants}人参与</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                    <Text style={styles.metaText}>{item.startTime} ~ {item.endTime}</Text>
                  </View>
                </View>
                {item.joined && item.progress && (
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>我的进度：</Text>
                    <Text style={styles.progressText}>{item.progress}</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={[styles.joinBtn, item.joined && styles.joinedBtn, item.status === 'ended' && styles.endedBtn]}
                  onPress={() => item.status !== 'ended' && handleJoinActivity(item.id)}
                  disabled={item.status === 'ended'}
                >
                  <Text style={[styles.joinBtnText, item.joined && styles.joinedBtnText]}>
                    {item.status === 'ended' ? '已结束' : item.joined ? '已参与' : '立即参与'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>暂无相关活动</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 发起活动弹窗 */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setShowCreateModal(false);
                // 如果是从团队详情页进入的，关闭弹窗后返回团队详情页
                if (createMode && teamId) {
                  navigation.goBack();
                }
              }}
              style={styles.modalCloseBtn}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>发起活动</Text>
            <TouchableOpacity 
              onPress={handleCreateActivity}
              style={styles.modalSubmitBtn}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalSubmit}>发布</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* 发起身份选择 - 仅在非团队详情页进入时显示 */}
            {!createMode && (
              <>
                <Text style={styles.inputLabel}>发起身份 <Text style={styles.required}>*</Text></Text>
                <View style={styles.organizerSelector}>
                  <TouchableOpacity 
                    style={[styles.organizerOption, newActivity.organizerType === 'personal' && styles.organizerOptionActive]}
                    onPress={() => handleOrganizerTypeChange('personal')}
                  >
                    <Ionicons name="person" size={20} color={newActivity.organizerType === 'personal' ? '#fff' : '#666'} />
                    <Text style={[styles.organizerOptionText, newActivity.organizerType === 'personal' && styles.organizerOptionTextActive]}>个人发起</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.organizerOption, newActivity.organizerType === 'team' && styles.organizerOptionActive]}
                    onPress={() => handleOrganizerTypeChange('team')}
                  >
                    <Ionicons name="people" size={20} color={newActivity.organizerType === 'team' ? '#fff' : '#666'} />
                    <Text style={[styles.organizerOptionText, newActivity.organizerType === 'team' && styles.organizerOptionTextActive]}>团队发起</Text>
                  </TouchableOpacity>
                </View>

                {/* 已选择的团队显示 */}
                {newActivity.organizerType === 'team' && newActivity.teamName && (
                  <TouchableOpacity 
                    style={styles.selectedTeamBanner}
                    onPress={() => setShowTeamSelector(true)}
                  >
                    <View style={styles.selectedTeamInfo}>
                      <Ionicons name="people" size={18} color="#8b5cf6" />
                      <Text style={styles.selectedTeamName}>{newActivity.teamName}</Text>
                    </View>
                    <View style={styles.changeTeamBtn}>
                      <Text style={styles.changeTeamText}>更换</Text>
                      <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
                    </View>
                  </TouchableOpacity>
                )}

                {/* 未选择团队提示 */}
                {newActivity.organizerType === 'team' && !newActivity.teamName && (
                  <TouchableOpacity 
                    style={styles.selectTeamPrompt}
                    onPress={() => setShowTeamSelector(true)}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#8b5cf6" />
                    <Text style={styles.selectTeamPromptText}>选择团队</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* 从团队详情页进入时显示固定的团队身份 */}
            {createMode && teamName && (
              <>
                <Text style={styles.inputLabel}>发起身份</Text>
                <View style={styles.fixedOrganizerBanner}>
                  <Ionicons name="people" size={20} color="#8b5cf6" />
                  <Text style={styles.fixedOrganizerText}>{teamName}</Text>
                  <View style={styles.fixedOrganizerBadge}>
                    <Text style={styles.fixedOrganizerBadgeText}>团队</Text>
                  </View>
                </View>
              </>
            )}

            {/* 活动类型 */}
            <Text style={styles.inputLabel}>活动类型</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[styles.typeOption, newActivity.type === 'online' && styles.typeOptionActive]}
                onPress={() => setNewActivity({ ...newActivity, type: 'online' })}
              >
                <Ionicons name="globe-outline" size={20} color={newActivity.type === 'online' ? '#fff' : '#666'} />
                <Text style={[styles.typeOptionText, newActivity.type === 'online' && styles.typeOptionTextActive]}>线上活动</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeOption, newActivity.type === 'offline' && styles.typeOptionActive]}
                onPress={() => setNewActivity({ ...newActivity, type: 'offline' })}
              >
                <Ionicons name="location-outline" size={20} color={newActivity.type === 'offline' ? '#fff' : '#666'} />
                <Text style={[styles.typeOptionText, newActivity.type === 'offline' && styles.typeOptionTextActive]}>线下活动</Text>
              </TouchableOpacity>
            </View>

            {/* 活动标题 */}
            <Text style={styles.inputLabel}>活动标题 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="请输入活动标题"
              value={newActivity.title}
              onChangeText={(text) => setNewActivity({ ...newActivity, title: text })}
              maxLength={50}
            />

            {/* 活动内容 */}
            <Text style={styles.inputLabel}>活动内容 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="请输入活动详细内容"
              value={newActivity.desc}
              onChangeText={(text) => setNewActivity({ ...newActivity, desc: text })}
              multiline
              maxLength={500}
            />

            {/* 活动时间 */}
            <Text style={styles.inputLabel}>活动时间 <Text style={styles.required}>*</Text></Text>
            <View style={styles.timeRow}>
              <TextInput
                style={[styles.input, styles.timeInput]}
                placeholder="开始日期 如2026-01-20"
                value={newActivity.startTime}
                onChangeText={(text) => setNewActivity({ ...newActivity, startTime: text })}
              />
              <Text style={styles.timeSeparator}>至</Text>
              <TextInput
                style={[styles.input, styles.timeInput]}
                placeholder="结束日期 如2026-01-25"
                value={newActivity.endTime}
                onChangeText={(text) => setNewActivity({ ...newActivity, endTime: text })}
              />
            </View>

            {/* 活动地址（线下活动） */}
            {newActivity.type === 'offline' && (
              <>
                <Text style={styles.inputLabel}>活动地址 <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入活动地址"
                  value={newActivity.address}
                  onChangeText={(text) => setNewActivity({ ...newActivity, address: text })}
                />
              </>
            )}

            {/* 活动图片 */}
            <Text style={styles.inputLabel}>活动图片（最多9张）</Text>
            <View style={styles.imageGrid}>
              {newActivity.images.map((img, idx) => (
                <View key={idx} style={styles.imageItem}>
                  <Image source={{ uri: img }} style={styles.uploadedImage} />
                  <TouchableOpacity 
                    style={styles.removeImage} 
                    onPress={() => removeActivityImage(idx)}
                  >
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
              {newActivity.images.length < 9 && (
                <TouchableOpacity style={styles.addImageBtn} onPress={addActivityImage}>
                  <Ionicons name="add" size={24} color="#9ca3af" />
                  <Text style={styles.addImageText}>添加图片</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 联系方式 */}
            <Text style={styles.inputLabel}>联系方式</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入联系方式（手机号/微信/邮箱）"
              value={newActivity.contact}
              onChangeText={(text) => setNewActivity({ ...newActivity, contact: text })}
            />
            
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 团队选择器弹窗 */}
      <Modal visible={showTeamSelector} animationType="slide" transparent>
        <View style={styles.teamSelectorOverlay}>
          <View style={styles.teamSelectorModal}>
            <View style={styles.teamSelectorHeader}>
              <Text style={styles.teamSelectorTitle}>选择团队</Text>
              <TouchableOpacity onPress={() => setShowTeamSelector(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.teamSelectorList}>
              {myTeams.map(team => (
                <TouchableOpacity 
                  key={team.id}
                  style={[
                    styles.teamSelectorItem,
                    newActivity.teamId === team.id && styles.teamSelectorItemActive
                  ]}
                  onPress={() => handleSelectTeam(team)}
                >
                  <View style={styles.teamSelectorItemLeft}>
                    <View style={styles.teamSelectorIcon}>
                      <Ionicons name="people" size={20} color="#8b5cf6" />
                    </View>
                    <View style={styles.teamSelectorInfo}>
                      <Text style={styles.teamSelectorName}>{team.name}</Text>
                      <Text style={styles.teamSelectorMembers}>{team.members}名成员</Text>
                    </View>
                  </View>
                  {newActivity.teamId === team.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#8b5cf6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 图片查看器 */}
      <Modal visible={showImageViewer} animationType="fade" transparent>
        <View style={styles.imageViewerContainer}>
          {/* 顶部工具栏 */}
          <View style={styles.imageViewerHeader}>
            <TouchableOpacity onPress={() => setShowImageViewer(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.imageViewerCounter}>
              {currentImageIndex + 1}/{viewerImages.length}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* 图片轮播 */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
              );
              setCurrentImageIndex(index);
            }}
            style={styles.imageViewerScroll}
          >
            {viewerImages.map((image, index) => (
              <View key={index} style={styles.imageSlide}>
                <Image
                  source={{ uri: image }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* 底部指示器 */}
          <View style={styles.imageViewerFooter}>
            {viewerImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  index === currentImageIndex && styles.imageIndicatorActive
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', zIndex: 10 },
  backBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', flex: 1, textAlign: 'center' },
  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4, minHeight: 38, minWidth: 74, justifyContent: 'center', zIndex: 20 },
  createBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  tabBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabScroll: { paddingHorizontal: 8 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12 },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: '#ef4444' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  content: { flex: 1 },
  activityCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, overflow: 'hidden' },
  activityImage: { width: '100%', height: 140 },
  activityBadges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 },
  activityTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  activityTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  typeTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, gap: 2 },
  typeTagText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  activityInfo: { padding: 14 },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 6 },
  activityDesc: { fontSize: 13, color: '#6b7280', lineHeight: 18, marginBottom: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  addressText: { flex: 1, fontSize: 12, color: '#ef4444' },
  activityMeta: { flexDirection: 'row', marginBottom: 10, gap: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#9ca3af' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fef2f2', padding: 8, borderRadius: 6 },
  progressLabel: { fontSize: 12, color: '#6b7280' },
  progressText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  joinBtn: { backgroundColor: '#ef4444', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  joinedBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ef4444' },
  endedBtn: { backgroundColor: '#e5e7eb' },
  joinBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  joinedBtnText: { color: '#ef4444' },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, color: '#9ca3af', marginTop: 16 },
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', zIndex: 10 },
  modalCloseBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  modalTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937', flex: 1, textAlign: 'center' },
  modalSubmitBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  modalSubmit: { fontSize: 16, color: '#ef4444', fontWeight: '600' },
  modalContent: { flex: 1, padding: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8, marginTop: 16 },
  required: { color: '#ef4444' },
  input: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  textArea: { height: 120, textAlignVertical: 'top' },
  // 发起身份选择器
  organizerSelector: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  organizerOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', gap: 6 },
  organizerOptionActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  organizerOptionText: { fontSize: 14, color: '#666' },
  organizerOptionTextActive: { color: '#fff' },
  // 固定团队身份显示
  fixedOrganizerBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f3ff', borderWidth: 1, borderColor: '#e9d5ff', borderRadius: 8, padding: 12, gap: 8, marginBottom: 8 },
  fixedOrganizerText: { flex: 1, fontSize: 15, color: '#6b21a8', fontWeight: '500' },
  fixedOrganizerBadge: { backgroundColor: '#8b5cf6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  fixedOrganizerBadgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  // 已选择的团队显示
  selectedTeamBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f3ff', borderWidth: 1, borderColor: '#e9d5ff', borderRadius: 8, padding: 12, marginBottom: 8 },
  selectedTeamInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  selectedTeamName: { fontSize: 14, color: '#6b21a8', fontWeight: '500' },
  changeTeamBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeTeamText: { fontSize: 13, color: '#8b5cf6', fontWeight: '500' },
  // 选择团队提示
  selectTeamPrompt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e9d5ff', borderRadius: 8, padding: 12, gap: 8, marginBottom: 8, borderStyle: 'dashed' },
  selectTeamPromptText: { fontSize: 14, color: '#8b5cf6', fontWeight: '500' },
  // 团队选择器弹窗
  teamSelectorOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  teamSelectorModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  teamSelectorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  teamSelectorTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  teamSelectorList: { paddingHorizontal: 16, paddingVertical: 8 },
  teamSelectorItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8, backgroundColor: '#f9fafb' },
  teamSelectorItemActive: { backgroundColor: '#f5f3ff', borderWidth: 1, borderColor: '#e9d5ff' },
  teamSelectorItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  teamSelectorIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f5f3ff', alignItems: 'center', justifyContent: 'center' },
  teamSelectorInfo: { flex: 1 },
  teamSelectorName: { fontSize: 15, fontWeight: '500', color: '#1f2937', marginBottom: 2 },
  teamSelectorMembers: { fontSize: 12, color: '#9ca3af' },
  // 活动类型选择器
  typeSelector: { flexDirection: 'row', gap: 12 },
  typeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', gap: 6 },
  typeOptionActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  typeOptionText: { fontSize: 14, color: '#666' },
  typeOptionTextActive: { color: '#fff' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeInput: { flex: 1 },
  timeSeparator: { marginHorizontal: 8, color: '#6b7280' },
  // 图片上传网格
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  imageItem: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#e5e7eb', position: 'relative', overflow: 'hidden' },
  uploadedImage: { width: '100%', height: '100%' },
  removeImage: { position: 'absolute', top: -8, right: -8, zIndex: 10 },
  addImageBtn: { width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  addImageText: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  // 封面图容器
  coverImageContainer: { position: 'relative', width: '100%', height: 140 },
  // 图片数量角标
  imageCountBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  // 图片查看器
  imageViewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  imageViewerCounter: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imageViewerScroll: {
    flex: 1,
  },
  imageSlide: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  imageViewerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  imageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  imageIndicatorActive: {
    backgroundColor: '#fff',
    width: 20,
  },
});
