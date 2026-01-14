import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？', type: 'reward', reward: 50, likes: 128, dislikes: 12, answers: 56, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop', solvedPercent: 65 },
  { id: 2, title: '第一次养猫需要准备什么？有哪些新手容易踩的坑？', type: 'free', likes: 256, dislikes: 8, answers: 89, author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'], solvedPercent: 80 },
  { id: 3, title: '长期失眠应该怎么调理？吃褪黑素有用吗？求专业医生解答', type: 'targeted', likes: 512, dislikes: 5, answers: 234, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天 18:30', verified: true, solvedPercent: 45 },
  { id: 4, title: '35岁程序员如何规划职业发展？是继续技术深耕还是转管理？', type: 'reward', reward: 100, likes: 1200, dislikes: 23, answers: 456, author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', solvedPercent: 30 },
  { id: 5, title: '有什么简单又好吃的家常菜推荐？最好是新手也能做的那种', type: 'free', likes: 368, dislikes: 6, answers: 127, author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', time: '6小时前', images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'], solvedPercent: 92 },
];

const tabs = ['推荐', '热榜', '同城', '国家', '行业', '个人', '职场', '教育'];

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('推荐');
  const [likedItems, setLikedItems] = useState({});

  const getTypeTag = (item) => {
    if (item.type === 'reward') return { text: `悬赏 $${item.reward}`, colors: ['#ef4444', '#f97316'] };
    if (item.type === 'targeted') return { text: '定向', colors: ['#3b82f6', '#06b6d4'] };
    return { text: '免费', colors: ['#22c55e', '#14b8a6'] };
  };

  const toggleLike = (id) => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={16} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>搜索问题、话题或用户</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchTextBtn} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchText}>搜索</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifyBtn} onPress={() => navigation.navigate('Main', { screen: '消息' })}>
          <Ionicons name="notifications-outline" size={22} color="#4b5563" />
          <View style={styles.badge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishBtn} onPress={() => navigation.navigate('Main', { screen: '发布' })}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.publishBtnText}>发布</Text>
        </TouchableOpacity>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.tabMenuBtn}>
          <Ionicons name="menu" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* 问题卡片列表 */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {questions.map(item => {
          const tag = getTypeTag(item);
          const isLiked = likedItems[item.id];
          return (
            <TouchableOpacity key={item.id} style={styles.questionCard} onPress={() => navigation.navigate('QuestionDetail', { id: item.id })}>
              {/* 发布人信息 */}
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.authorInfo}>
                  <View style={styles.authorRow}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    {item.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" style={{ marginLeft: 4 }} />}
                    <View style={[styles.typeTag, { backgroundColor: tag.colors[0] }]}>
                      <Text style={styles.typeTagText}>{tag.text}</Text>
                    </View>
                  </View>
                  <Text style={styles.postTime}>{item.time}</Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                  <Ionicons name="ellipsis-horizontal" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* 问题标题 */}
              <Text style={styles.questionTitle}>{item.title}</Text>

              {/* 图片 */}
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.singleImage} />
              )}
              {item.images && (
                <View style={styles.imageGrid}>
                  {item.images.map((img, idx) => (
                    <Image key={idx} source={{ uri: img }} style={styles.gridImage} />
                  ))}
                </View>
              )}

              {/* PK进度条 */}
              <View style={styles.pkSection}>
                <View style={styles.pkLabels}>
                  <Text style={styles.pkSolved}>已解决 {item.solvedPercent}%</Text>
                  <Text style={styles.pkUnsolved}>未解决 {100 - item.solvedPercent}%</Text>
                </View>
                <View style={styles.pkBar}>
                  <View style={[styles.pkSolvedBar, { width: `${item.solvedPercent}%` }]} />
                  <View style={[styles.pkUnsolvedBar, { width: `${100 - item.solvedPercent}%` }]} />
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
                    <Text style={styles.actionText}>转发</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rightActions}>
                  <TouchableOpacity style={styles.groupChatBtn}>
                    <Ionicons name="people-outline" size={14} color="#6b7280" />
                    <Text style={styles.groupChatText}>群聊</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerBtn}>
                    <Ionicons name="create-outline" size={14} color="#fff" />
                    <Text style={styles.answerBtnText}>回答</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  searchPlaceholder: { marginLeft: 6, color: '#9ca3af', fontSize: 13 },
  searchTextBtn: { paddingHorizontal: 10 },
  searchText: { color: '#ef4444', fontSize: 14 },
  notifyBtn: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4 },
  publishBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  publishBtnText: { color: '#fff', fontSize: 13, fontWeight: '500', marginLeft: 2 },
  tabBarContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabBar: { flex: 1 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  tabMenuBtn: { paddingHorizontal: 12, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#f3f4f6' },
  list: { flex: 1, paddingTop: 12, paddingHorizontal: 12 },
  questionCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  authorInfo: { flex: 1, marginLeft: 10 },
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  typeTag: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  typeTagText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  postTime: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  moreBtn: { padding: 4 },
  questionTitle: { fontSize: 15, fontWeight: '500', color: '#1f2937', lineHeight: 22, paddingHorizontal: 12, paddingBottom: 10 },
  singleImage: { width: '100%', height: 160, marginHorizontal: 12, marginBottom: 10, borderRadius: 8, width: 'auto', marginLeft: 12, marginRight: 12 },
  imageGrid: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 10, gap: 6 },
  gridImage: { width: 100, height: 100, borderRadius: 8 },
  pkSection: { paddingHorizontal: 12, paddingBottom: 10 },
  pkLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  pkSolved: { fontSize: 11, color: '#ef4444', fontWeight: '500' },
  pkUnsolved: { fontSize: 11, color: '#3b82f6', fontWeight: '500' },
  pkBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  pkSolvedBar: { backgroundColor: '#ef4444', height: '100%' },
  pkUnsolvedBar: { backgroundColor: '#3b82f6', height: '100%' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f9fafb' },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#6b7280' },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupChatBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, gap: 4 },
  groupChatText: { fontSize: 12, color: '#6b7280' },
  answerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, gap: 4 },
  answerBtnText: { fontSize: 12, color: '#fff', fontWeight: '500' },
});
