import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 频道数据
const allChannels = {
  country: [
    { id: 'c1', name: '中国', icon: '🇨🇳', subscribed: true },
    { id: 'c2', name: '美国', icon: '🇺🇸', subscribed: false },
    { id: 'c3', name: '日本', icon: '🇯🇵', subscribed: false },
    { id: 'c4', name: '英国', icon: '🇬🇧', subscribed: false },
    { id: 'c5', name: '德国', icon: '🇩🇪', subscribed: false },
    { id: 'c6', name: '法国', icon: '🇫🇷', subscribed: false },
    { id: 'c7', name: '韩国', icon: '🇰🇷', subscribed: false },
    { id: 'c8', name: '加拿大', icon: '🇨🇦', subscribed: false },
  ],
  industry: [
    { id: 'i1', name: '互联网', icon: 'globe-outline', color: '#3b82f6', subscribed: true },
    { id: 'i2', name: '金融', icon: 'cash-outline', color: '#f59e0b', subscribed: true },
    { id: 'i3', name: '医疗健康', icon: 'medical-outline', color: '#ef4444', subscribed: false },
    { id: 'i4', name: '教育培训', icon: 'school-outline', color: '#8b5cf6', subscribed: false },
    { id: 'i5', name: '房地产', icon: 'home-outline', color: '#06b6d4', subscribed: false },
    { id: 'i6', name: '制造业', icon: 'construct-outline', color: '#6b7280', subscribed: false },
    { id: 'i7', name: '餐饮服务', icon: 'restaurant-outline', color: '#f97316', subscribed: false },
    { id: 'i8', name: '零售电商', icon: 'cart-outline', color: '#ec4899', subscribed: false },
  ],
  personal: [
    { id: 'p1', name: '职场', icon: 'briefcase-outline', color: '#3b82f6', subscribed: true },
    { id: 'p2', name: '科技', icon: 'hardware-chip-outline', color: '#8b5cf6', subscribed: true },
    { id: 'p3', name: '健康', icon: 'fitness-outline', color: '#22c55e', subscribed: false },
    { id: 'p4', name: '教育', icon: 'book-outline', color: '#f59e0b', subscribed: false },
    { id: 'p5', name: '美食', icon: 'fast-food-outline', color: '#ef4444', subscribed: false },
    { id: 'p6', name: '情感', icon: 'heart-outline', color: '#ec4899', subscribed: false },
    { id: 'p7', name: '旅游', icon: 'airplane-outline', color: '#06b6d4', subscribed: false },
    { id: 'p8', name: '娱乐', icon: 'game-controller-outline', color: '#a855f7', subscribed: false },
  ],
  combo: [
    { id: 'cb1', name: '科技互联网', tags: ['互联网', '科技'], subscribed: true },
    { id: 'cb2', name: '职场发展', tags: ['职场', '教育'], subscribed: false },
    { id: 'cb3', name: '健康生活', tags: ['健康', '美食'], subscribed: false },
    { id: 'cb4', name: '金融理财', tags: ['金融', '职场'], subscribed: false },
  ]
};

export default function ChannelManageScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('my');
  const [channels, setChannels] = useState(allChannels);

  // 获取我的频道
  const getMyChannels = () => {
    const my = [];
    Object.keys(channels).forEach(category => {
      channels[category].forEach(channel => {
        if (channel.subscribed) {
          my.push({ ...channel, category });
        }
      });
    });
    return my;
  };

  // 切换订阅状态
  const toggleSubscribe = (category, channelId) => {
    setChannels(prev => ({
      ...prev,
      [category]: prev[category].map(ch =>
        ch.id === channelId ? { ...ch, subscribed: !ch.subscribed } : ch
      )
    }));
  };

  // 渲染频道卡片
  const renderChannelCard = (channel, category) => {
    const isCountry = category === 'country';
    const isCombo = category === 'combo';

    return (
      <TouchableOpacity
        key={channel.id}
        style={[
          styles.channelCard,
          channel.subscribed && styles.channelCardActive
        ]}
        onPress={() => toggleSubscribe(category, channel.id)}
        activeOpacity={0.7}
      >
        {isCountry ? (
          <Text style={styles.countryIcon}>{channel.icon}</Text>
        ) : isCombo ? (
          <View style={styles.comboIcon}>
            <Ionicons name="layers-outline" size={24} color="#8b5cf6" />
          </View>
        ) : (
          <View style={[styles.channelIcon, { backgroundColor: `${channel.color}15` }]}>
            <Ionicons name={channel.icon} size={24} color={channel.color} />
          </View>
        )}
        
        <Text style={[
          styles.channelName,
          channel.subscribed && styles.channelNameActive
        ]}>
          {channel.name}
        </Text>

        {isCombo && (
          <View style={styles.comboTags}>
            {channel.tags.map((tag, idx) => (
              <Text key={idx} style={styles.comboTag}>{tag}</Text>
            ))}
          </View>
        )}

        {channel.subscribed && (
          <View style={styles.subscribedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // 渲染内容
  const renderContent = () => {
    switch (activeTab) {
      case 'my':
        const myChannels = getMyChannels();
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>我的频道</Text>
              <Text style={styles.sectionCount}>{myChannels.length}个</Text>
            </View>
            {myChannels.length > 0 ? (
              <View style={styles.channelGrid}>
                {myChannels.map(channel => renderChannelCard(channel, channel.category))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="albums-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyText}>还没有订阅任何频道</Text>
                <Text style={styles.emptyHint}>点击下方标签选择感兴趣的频道</Text>
              </View>
            )}
          </View>
        );

      case 'country':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>国家频道</Text>
              <Text style={styles.sectionCount}>
                已订阅 {channels.country.filter(c => c.subscribed).length}/{channels.country.length}
              </Text>
            </View>
            <View style={styles.channelGrid}>
              {channels.country.map(channel => renderChannelCard(channel, 'country'))}
            </View>
          </View>
        );

      case 'industry':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>行业频道</Text>
              <Text style={styles.sectionCount}>
                已订阅 {channels.industry.filter(c => c.subscribed).length}/{channels.industry.length}
              </Text>
            </View>
            <View style={styles.channelGrid}>
              {channels.industry.map(channel => renderChannelCard(channel, 'industry'))}
            </View>
          </View>
        );

      case 'personal':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>个人兴趣</Text>
              <Text style={styles.sectionCount}>
                已订阅 {channels.personal.filter(c => c.subscribed).length}/{channels.personal.length}
              </Text>
            </View>
            <View style={styles.channelGrid}>
              {channels.personal.map(channel => renderChannelCard(channel, 'personal'))}
            </View>
          </View>
        );

      case 'combo':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>组合频道</Text>
              <Text style={styles.sectionCount}>
                已订阅 {channels.combo.filter(c => c.subscribed).length}/{channels.combo.length}
              </Text>
            </View>
            <Text style={styles.sectionDesc}>组合频道包含多个相关主题，一键订阅更方便</Text>
            <View style={styles.channelGrid}>
              {channels.combo.map(channel => renderChannelCard(channel, 'combo'))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { key: 'my', label: '我的频道', icon: 'star' },
    { key: 'country', label: '国家', icon: 'flag' },
    { key: 'industry', label: '行业', icon: 'business' },
    { key: 'personal', label: '个人', icon: 'person' },
    { key: 'combo', label: '组合', icon: 'layers' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>频道管理</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
            Alert.alert('保存成功', '频道订阅已更新');
            navigation.goBack();
          }}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Text style={styles.saveBtnText}>完成</Text>
        </TouchableOpacity>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                activeTab === tab.key && styles.tabItemActive
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === tab.key ? tab.icon : `${tab.icon}-outline`}
                size={20}
                color={activeTab === tab.key ? '#ef4444' : '#6b7280'}
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 内容区域 */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    zIndex: 10
  },
  backBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center'
  },
  saveBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  saveBtnText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600'
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  tabScroll: {
    paddingHorizontal: 8
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#ef4444'
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280'
  },
  tabTextActive: {
    color: '#ef4444',
    fontWeight: '600'
  },
  content: {
    flex: 1
  },
  section: {
    padding: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  sectionCount: {
    fontSize: 13,
    color: '#6b7280'
  },
  sectionDesc: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 12,
    lineHeight: 18
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  channelCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f3f4f6',
    position: 'relative'
  },
  channelCardActive: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4'
  },
  countryIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  comboIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3ff',
    marginBottom: 8
  },
  channelName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center'
  },
  channelNameActive: {
    color: '#22c55e',
    fontWeight: '600'
  },
  comboTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
    justifyContent: 'center'
  },
  comboTag: {
    fontSize: 11,
    color: '#8b5cf6',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  subscribedBadge: {
    position: 'absolute',
    top: 8,
    right: 8
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    fontWeight: '500'
  },
  emptyHint: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8
  }
});
