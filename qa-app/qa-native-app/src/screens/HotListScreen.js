import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const hotTabs = ['全站热榜', '科技', '财经', '娱乐', '体育', '教育'];

const hotListData = [
  { id: 1, rank: 1, title: '如何在三个月内从零基础学会Python编程？', hot: '1856万', tag: '热', tagColor: '#ef4444', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot1', answers: 2345, isNew: false, isUp: true },
  { id: 2, rank: 2, title: '35岁程序员如何规划职业发展？是继续技术深耕还是转管理？', hot: '1523万', tag: '热', tagColor: '#ef4444', author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot2', answers: 1892, isNew: false, isUp: true },
  { id: 3, rank: 3, title: '2026年最值得学习的编程语言是什么？', hot: '1245万', tag: '新', tagColor: '#22c55e', author: '技术博主', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot3', answers: 1567, isNew: true, isUp: false },
  { id: 4, rank: 4, title: '第一次养猫需要准备什么？有哪些新手容易踩的坑？', hot: '986万', tag: null, author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot4', answers: 1234, isNew: false, isUp: true },
  { id: 5, rank: 5, title: '长期失眠应该怎么调理？吃褪黑素有用吗？', hot: '876万', tag: null, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot5', answers: 987, isNew: false, isUp: false },
  { id: 6, rank: 6, title: '有什么简单又好吃的家常菜推荐？', hot: '756万', tag: '荐', tagColor: '#f59e0b', author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot6', answers: 856, isNew: false, isUp: true },
  { id: 7, rank: 7, title: '如何提高英语口语水平？有什么实用的方法？', hot: '654万', tag: null, author: '英语老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot7', answers: 723, isNew: false, isUp: true },
  { id: 8, rank: 8, title: '买房还是租房？年轻人应该如何选择？', hot: '543万', tag: null, author: '房产专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot8', answers: 612, isNew: false, isUp: false },
  { id: 9, rank: 9, title: '如何克服拖延症？有什么有效的方法？', hot: '432万', tag: '新', tagColor: '#22c55e', author: '心理咨询师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot9', answers: 534, isNew: true, isUp: true },
  { id: 10, rank: 10, title: '健身新手应该如何制定训练计划？', hot: '321万', tag: null, author: '健身教练', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot10', answers: 445, isNew: false, isUp: true },
  { id: 11, rank: 11, title: '如何培养孩子的阅读习惯？', hot: '287万', tag: null, author: '教育专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot11', answers: 389, isNew: false, isUp: false },
  { id: 12, rank: 12, title: '远程办公如何保持高效率？', hot: '256万', tag: null, author: '职场达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot12', answers: 312, isNew: false, isUp: true },
];

export default function HotListScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('全站热榜');

  const getRankStyle = (rank) => {
    if (rank === 1) return { backgroundColor: '#ef4444' };
    if (rank === 2) return { backgroundColor: '#f97316' };
    if (rank === 3) return { backgroundColor: '#f59e0b' };
    return { backgroundColor: '#9ca3af' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>热榜</Text>
        <TouchableOpacity style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {hotTabs.map(tab => (
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

      <View style={styles.updateInfo}>
        <Ionicons name="time-outline" size={14} color="#9ca3af" />
        <Text style={styles.updateText}>更新于 5分钟前</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {hotListData.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.hotItem}
            onPress={() => navigation.navigate('QuestionDetail', { id: item.id })}
          >
            <View style={[styles.rankBadge, getRankStyle(item.rank)]}>
              <Text style={styles.rankText}>{item.rank}</Text>
            </View>
            
            <View style={styles.hotContent}>
              <View style={styles.hotTitleRow}>
                <Text style={styles.hotTitle} numberOfLines={2}>{item.title}</Text>
                {item.tag && (
                  <View style={[styles.hotTag, { backgroundColor: item.tagColor }]}>
                    <Text style={styles.hotTagText}>{item.tag}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.hotMeta}>
                <View style={styles.hotStats}>
                  <Text style={styles.hotValue}>{item.hot}</Text>
                  <Text style={styles.hotLabel}>热度</Text>
                  {item.isUp ? (
                    <Ionicons name="trending-up" size={14} color="#22c55e" style={styles.trendIcon} />
                  ) : (
                    <Ionicons name="trending-down" size={14} color="#ef4444" style={styles.trendIcon} />
                  )}
                </View>
                <View style={styles.hotAuthor}>
                  <Image source={{ uri: item.avatar }} style={styles.authorAvatar} />
                  <Text style={styles.authorName}>{item.author}</Text>
                  <Text style={styles.answerCount}>{item.answers}回答</Text>
                </View>
              </View>
            </View>
            
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  refreshBtn: { padding: 4 },
  tabBar: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabScroll: { paddingHorizontal: 12 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12 },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: '#ef4444' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  updateInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#f9fafb' },
  updateText: { fontSize: 12, color: '#9ca3af', marginLeft: 4 },
  list: { flex: 1 },
  hotItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  rankBadge: { width: 24, height: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  hotContent: { flex: 1 },
  hotTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  hotTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1f2937', lineHeight: 22 },
  hotTag: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  hotTagText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  hotMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  hotStats: { flexDirection: 'row', alignItems: 'center' },
  hotValue: { fontSize: 13, color: '#ef4444', fontWeight: '600' },
  hotLabel: { fontSize: 11, color: '#9ca3af', marginLeft: 4 },
  trendIcon: { marginLeft: 4 },
  hotAuthor: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 18, height: 18, borderRadius: 9 },
  authorName: { fontSize: 12, color: '#6b7280', marginLeft: 6 },
  answerCount: { fontSize: 11, color: '#9ca3af', marginLeft: 8 },
});
