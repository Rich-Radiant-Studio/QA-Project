import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['关注的人', '关注的话题'];

const followedUsers = [
  { id: 1, name: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=python', verified: true, desc: '资深Python开发', followers: '1.2k', newAnswer: true },
  { id: 2, name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor', verified: true, desc: '三甲医院主治医师', followers: '5.6k', newAnswer: true },
  { id: 3, name: '职场导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=career', verified: false, desc: '10年HR经验', followers: '3.2k', newAnswer: false },
];

const followedTopics = [
  { id: 1, name: '#Python学习', icon: 'code-slash', color: '#3b82f6', questions: '3.2万', followers: '8.5万', newQuestions: 12 },
  { id: 2, name: '#职场', icon: 'briefcase', color: '#22c55e', questions: '4.5万', followers: '12.5万', newQuestions: 8 },
  { id: 3, name: '#健康', icon: 'heart', color: '#ef4444', questions: '2.8万', followers: '9.8万', newQuestions: 5 },
];

const recentUpdates = [
  { id: 1, type: 'answer', user: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=python', question: '如何在三个月内从零基础学会Python编程？', time: '1小时前' },
  { id: 2, type: 'question', topic: '#职场', question: '35岁程序员如何规划职业发展？', time: '2小时前' },
];

export default function FollowScreen() {
  const [activeTab, setActiveTab] = useState('关注的人');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>关注</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 最近更新 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近更新</Text>
          {recentUpdates.map(item => (
            <TouchableOpacity key={item.id} style={styles.updateCard}>
              {item.type === 'answer' ? (
                <Image source={{ uri: item.avatar }} style={styles.updateAvatar} />
              ) : (
                <View style={[styles.topicIcon, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="chatbubbles" size={16} color="#3b82f6" />
                </View>
              )}
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle} numberOfLines={2}>
                  {item.type === 'answer' ? `${item.user} 回答了：` : `${item.topic} 有新问题：`}
                  <Text style={styles.updateQuestion}>{item.question}</Text>
                </Text>
                <Text style={styles.updateTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 关注的人/话题列表 */}
        {activeTab === '关注的人' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>关注的人 ({followedUsers.length})</Text>
            {followedUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                    {user.newAnswer && <View style={styles.newDot} />}
                  </View>
                  <Text style={styles.userDesc}>{user.desc} · {user.followers} 粉丝</Text>
                </View>
                <TouchableOpacity style={styles.followingBtn}>
                  <Text style={styles.followingBtnText}>已关注</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>关注的话题 ({followedTopics.length})</Text>
            {followedTopics.map(topic => (
              <View key={topic.id} style={styles.topicCard}>
                <View style={[styles.topicIconLarge, { backgroundColor: `${topic.color}20` }]}>
                  <Ionicons name={topic.icon} size={24} color={topic.color} />
                </View>
                <View style={styles.topicInfo}>
                  <View style={styles.topicNameRow}>
                    <Text style={styles.topicName}>{topic.name}</Text>
                    {topic.newQuestions > 0 && (
                      <View style={styles.newBadge}><Text style={styles.newBadgeText}>+{topic.newQuestions}</Text></View>
                    )}
                  </View>
                  <Text style={styles.topicStats}>{topic.followers} 关注 · {topic.questions} 问题</Text>
                </View>
                <TouchableOpacity style={styles.followingBtn}>
                  <Text style={styles.followingBtnText}>已关注</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 40, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  content: { flex: 1 },
  section: { backgroundColor: '#fff', marginTop: 8, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  updateCard: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  updateAvatar: { width: 36, height: 36, borderRadius: 18 },
  topicIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  updateContent: { flex: 1, marginLeft: 12 },
  updateTitle: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  updateQuestion: { color: '#1f2937' },
  updateTime: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  userCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  userAvatar: { width: 48, height: 48, borderRadius: 24 },
  userInfo: { flex: 1, marginLeft: 12 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  newDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ef4444', marginLeft: 4 },
  userDesc: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  followingBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  followingBtnText: { fontSize: 12, color: '#6b7280' },
  topicCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  topicIconLarge: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  topicInfo: { flex: 1, marginLeft: 12 },
  topicNameRow: { flexDirection: 'row', alignItems: 'center' },
  topicName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  newBadge: { marginLeft: 8, backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  newBadgeText: { fontSize: 10, color: '#ef4444', fontWeight: '500' },
  topicStats: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
});
