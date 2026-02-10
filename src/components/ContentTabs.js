import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';

/**
 * 内容标签栏组件（今日头条风格）
 * 包含：全部、文章、视频、微头条、转发五个标签
 * 右侧：搜索图标和音频图标
 */
export default function ContentTabs({ activeTab, onTabChange, onSearchPress, onAudioPress }) {
  const { t } = useTranslation();

  const tabs = [
    { key: 'all', label: t('profile.tabs.all') },
    { key: 'articles', label: t('profile.tabs.articles') },
    { key: 'videos', label: t('profile.tabs.videos') },
    { key: 'microposts', label: t('profile.tabs.microposts') },
    { key: 'reposts', label: t('profile.tabs.reposts') },
  ];

  return (
    <View style={styles.container}>
      {/* 标签滚动区域 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 右侧图标 */}
      <View style={styles.rightIcons}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onSearchPress}
        >
          <Ionicons name="search" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onAudioPress}
        >
          <Ionicons name="headset" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabsScrollView: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#ef4444',
    borderRadius: 1.5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
