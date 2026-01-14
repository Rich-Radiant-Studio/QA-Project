import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['动态', '用户', '话题'];

const followedUsers = [
  { id: 1, name: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow1', gradient: ['#ef4444', '#f97316'] },
  { id: 2, name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow2', gradient: ['#3b82f6', '#a855f7'] },
  { id: 3, name: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow3', gradient: ['#22c55e', '#14b8a6'] },
  { id: 4, name: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow4', gradient: null },
  { id: 5, name: '设计师小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow5', gradient: null },
];

const dynamics = [
  { id: 1, type: 'answer', user: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow1', verified: true, time: '30分钟前', questionType: 'reward', reward: 50, question: '如何在三个月内从零基础学会Python编程？', answer: '作为一个从零开始学Python的过来人，我来分享一下我的经验：如果每天能保证2-3小时的学习时间，3个月完全可以入门...', likes: 256, comments: 23 },
  { id: 2, type: 'question', user: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow2', verified: true, time: '1小时前', questionType: 'free', question: '作为医生，如何平衡工作和生活？有没有同行分享一下经验？', solvedPercent: 25, likes: 89, comments: 12 },
  { id: 3, type: 'topic', user: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow3', time: '2小时前', topic: '#家常菜谱', topicFollowers: '12.5万', topicQuestions: '8.6万' },
  { id: 4, type: 'like', user: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow4', time: '3小时前', question: '35岁程序员如何规划职业发展？', answerFrom: '技术大牛', answerPreview: '我觉得35岁不是终点，而是新的起点。关键是要保持学习的心态，同时也要考虑管理方向的发展...' },
];

export default function FollowScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('动态');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>关注</Text>
        <TouchableOpacity><Ionicons name="search" size={22} color="#4b5563" /></TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 关注的用户横向滚动 */}
        <View style={styles.usersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.usersScroll}>
            {followedUsers.map(user => (
              <TouchableOpacity key={user.id} style={styles.userItem}>
                <View style={[styles.avatarRing, user.gradient ? { borderColor: user.gradient[0] } : { borderColor: '#e5e7eb' }]}>
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                </View>
                <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.userItem}>
              <View style={styles.addUserBtn}><Ionicons name="add" size={24} color="#9ca3af" /></View>
              <Text style={styles.addUserText}>发现更多</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 动态列表 */}
        {dynamics.map(item => (
          <TouchableOpacity key={item.id} style={styles.dynamicCard} onPress={() => item.type !== 'topic' && navigation.navigate('QuestionDetail')}>
            <View style={styles.dynamicHeader}>
              <Image source={{ uri: item.avatar }} style={styles.dynamicAvatar} />
              <View style={styles.dynamicInfo}>
                <View style={styles.dynamicNameRow}>
                  <Text style={styles.dynamicName}>{item.user}</Text>
                  {item.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                </View>
                <Text style={styles.dynamicAction}>
                  {item.type === 'answer' && '回答了问题'}
                  {item.type === 'question' && '提出了问题'}
                  {item.type === 'topic' && '关注了话题'}
                  {item.type === 'like' && '赞同了回答'}
                  {' · '}{item.time}
                </Text>
              </View>
              <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={18} color="#9ca3af" /></TouchableOpacity>
            </View>

            {item.type === 'answer' && (
              <View style={styles.answerContent}>
                <View style={styles.questionBox}>
                  <View style={[styles.typeTag, { backgroundColor: item.questionType === 'reward' ? '#ef4444' : '#22c55e' }]}>
                    <Text style={styles.typeTagText}>{item.questionType === 'reward' ? `悬赏 $${item.reward}` : '免费'}</Text>
                  </View>
                  <Text style={styles.questionText} numberOfLines={1}>{item.question}</Text>
                </View>
                <Text style={styles.answerText} numberOfLines={3}>{item.answer}</Text>
                <View style={styles.dynamicFooter}>
                  <View style={styles.dynamicStats}>
                    <TouchableOpacity style={styles.statBtn}><Ionicons name="thumbs-up-outline" size={16} color="#6b7280" /><Text style={styles.statText}>{item.likes}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.statBtn}><Ionicons name="chatbubble-outline" size={16} color="#6b7280" /><Text style={styles.statText}>{item.comments}</Text></TouchableOpacity>
                  </View>
                  <Text style={styles.viewMore}>查看完整回答</Text>
                </View>
              </View>
            )}

            {item.type === 'question' && (
              <View style={styles.questionContent}>
                <View style={[styles.typeTag, { backgroundColor: '#22c55e', marginBottom: 8 }]}>
                  <Text style={styles.typeTagText}>免费</Text>
                </View>
                <Text style={styles.questionTitle}>{item.question}</Text>
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
                <View style={styles.dynamicFooter}>
                  <View style={styles.dynamicStats}>
                    <TouchableOpacity style={styles.statBtn}><Ionicons name="thumbs-up-outline" size={16} color="#6b7280" /><Text style={styles.statText}>{item.likes}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.statBtn}><Ionicons name="chatbubble-outline" size={16} color="#6b7280" /><Text style={styles.statText}>{item.comments}</Text></TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.answerBtn}><Ionicons name="create-outline" size={14} color="#fff" /><Text style={styles.answerBtnText}>回答</Text></TouchableOpacity>
                </View>
              </View>
            )}

            {item.type === 'topic' && (
              <View style={styles.topicContent}>
                <View style={styles.topicBox}>
                  <View style={styles.topicIcon}><Ionicons name="restaurant" size={24} color="#f97316" /></View>
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicName}>{item.topic}</Text>
                    <Text style={styles.topicStats}>{item.topicFollowers} 关注 · {item.topicQuestions} 问题</Text>
                  </View>
                  <TouchableOpacity style={styles.followBtn}><Text style={styles.followBtnText}>+ 关注</Text></TouchableOpacity>
                </View>
              </View>
            )}

            {item.type === 'like' && (
              <View style={styles.likeContent}>
                <View style={styles.likeBox}>
                  <Text style={styles.likeQuestion}>{item.question}</Text>
                  <Text style={styles.likeAnswer} numberOfLines={2}>{item.answerPreview}</Text>
                </View>
                <Text style={styles.answerFrom}>来自 <Text style={styles.answerFromName}>{item.answerFrom}</Text> 的回答</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 30, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  content: { flex: 1 },
  usersSection: { backgroundColor: '#fff', marginTop: 8, paddingVertical: 12 },
  usersScroll: { paddingHorizontal: 16, gap: 16 },
  userItem: { alignItems: 'center', width: 60 },
  avatarRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, padding: 2 },
  userAvatar: { width: '100%', height: '100%', borderRadius: 26 },
  userName: { fontSize: 11, color: '#4b5563', marginTop: 4, textAlign: 'center' },
  addUserBtn: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  addUserText: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  dynamicCard: { backgroundColor: '#fff', marginTop: 8 },
  dynamicHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: 8 },
  dynamicAvatar: { width: 40, height: 40, borderRadius: 20 },
  dynamicInfo: { flex: 1, marginLeft: 10 },
  dynamicNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dynamicName: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  dynamicAction: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  answerContent: { paddingHorizontal: 12, paddingBottom: 12 },
  questionBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  typeTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginRight: 8 },
  typeTagText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  questionText: { flex: 1, fontSize: 13, color: '#1f2937', fontWeight: '500' },
  answerText: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  dynamicFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  dynamicStats: { flexDirection: 'row', gap: 16 },
  statBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#6b7280' },
  viewMore: { fontSize: 13, color: '#ef4444' },
  questionContent: { paddingHorizontal: 12, paddingBottom: 12 },
  questionTitle: { fontSize: 15, fontWeight: '500', color: '#1f2937', lineHeight: 22 },
  pkSection: { marginTop: 10 },
  pkLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  pkSolved: { fontSize: 11, color: '#ef4444', fontWeight: '500' },
  pkUnsolved: { fontSize: 11, color: '#3b82f6', fontWeight: '500' },
  pkBar: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  pkSolvedBar: { backgroundColor: '#ef4444', height: '100%' },
  pkUnsolvedBar: { backgroundColor: '#3b82f6', height: '100%' },
  answerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, gap: 4 },
  answerBtnText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  topicContent: { paddingHorizontal: 12, paddingBottom: 12 },
  topicBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 8, padding: 12 },
  topicIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff7ed', justifyContent: 'center', alignItems: 'center' },
  topicInfo: { flex: 1, marginLeft: 12 },
  topicName: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  topicStats: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  followBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#ef4444', borderRadius: 14 },
  followBtnText: { fontSize: 12, color: '#ef4444' },
  likeContent: { paddingHorizontal: 12, paddingBottom: 12 },
  likeBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12 },
  likeQuestion: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 6 },
  likeAnswer: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  answerFrom: { fontSize: 12, color: '#9ca3af', marginTop: 8 },
  answerFromName: { color: '#ef4444' },
});
