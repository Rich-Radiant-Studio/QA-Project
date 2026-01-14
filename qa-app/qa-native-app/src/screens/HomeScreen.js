import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const questions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', type: 'reward', reward: 50, answers: 56, author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', time: '2小时前', preview: '本人是一名文科生，之前完全没有接触过编程...' },
  { id: 2, title: '第一次养猫需要准备什么？', type: 'free', answers: 89, author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', time: '5小时前', preview: '想养一只猫，但是完全没有经验...' },
  { id: 3, title: '长期失眠应该怎么调理？', type: 'targeted', answers: 234, author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', time: '昨天', preview: '最近压力大，经常失眠到凌晨三四点...' },
  { id: 4, title: '35岁程序员如何规划职业发展？', type: 'reward', reward: 100, answers: 456, author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', time: '3小时前', preview: '在互联网公司工作了10年，现在很迷茫...' },
];

const tabs = ['推荐', '最新', '悬赏', '热门'];

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('推荐');

  const getTypeTag = (item) => {
    if (item.type === 'reward') return { text: `悬赏 $${item.reward}`, colors: ['#ef4444', '#f97316'] };
    if (item.type === 'targeted') return { text: '定向', colors: ['#3b82f6', '#06b6d4'] };
    return { text: '免费', colors: ['#22c55e', '#14b8a6'] };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>搜索问题、话题或用户</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifyBtn}>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </TouchableOpacity>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* 问题列表 */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {questions.map(item => {
          const tag = getTypeTag(item);
          return (
            <TouchableOpacity key={item.id} style={styles.questionCard} onPress={() => navigation.navigate('QuestionDetail', { id: item.id })}>
              <View style={styles.cardHeader}>
                <View style={[styles.typeTag, { backgroundColor: tag.colors[0] }]}>
                  <Text style={styles.typeTagText}>{tag.text}</Text>
                </View>
                <Text style={styles.answerCount}>{item.answers} 回答</Text>
              </View>
              <Text style={styles.questionTitle}>{item.title}</Text>
              <Text style={styles.questionPreview} numberOfLines={2}>{item.preview}</Text>
              <View style={styles.cardFooter}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.authorInfo}>{item.author} · {item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  searchPlaceholder: { marginLeft: 8, color: '#9ca3af', fontSize: 14 },
  notifyBtn: { marginLeft: 12, position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 20, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  list: { flex: 1, paddingTop: 8 },
  questionCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  typeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  typeTagText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  answerCount: { marginLeft: 8, fontSize: 12, color: '#9ca3af' },
  questionTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', lineHeight: 22 },
  questionPreview: { fontSize: 13, color: '#6b7280', marginTop: 6, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  avatar: { width: 20, height: 20, borderRadius: 10 },
  authorInfo: { marginLeft: 8, fontSize: 12, color: '#9ca3af' },
});
