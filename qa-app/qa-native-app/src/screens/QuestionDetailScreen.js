import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const answers = [
  { id: 1, author: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', verified: true, adopted: true, content: '作为一个从零开始学Python的过来人，我来分享一下我的经验。如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。建议学习路线：1. 基础语法（2周）2. 数据结构（2周）3. 面向对象（2周）4. 实战项目（6周）', likes: 256, comments: 23, time: '1小时前' },
  { id: 2, author: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', verified: false, adopted: false, content: '我也是文科转行的，现在在做数据分析。给你几点建议：1. 不要一开始就啃书，先跟着视频教程敲代码 2. 多做项目，边学边练 3. 加入学习社群，有问题随时问', likes: 89, comments: 12, time: '30分钟前' },
];

export default function QuestionDetailScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>问题详情</Text>
        <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={24} color="#374151" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 问题信息 */}
        <View style={styles.questionSection}>
          <View style={styles.questionHeader}>
            <View style={styles.rewardTag}><Text style={styles.rewardText}>悬赏 $50</Text></View>
            <Text style={styles.answerCount}>56 回答</Text>
          </View>
          <Text style={styles.questionTitle}>如何在三个月内从零基础学会Python编程？</Text>
          <Text style={styles.questionContent}>本人是一名文科生，之前完全没有接触过编程。最近想转行做数据分析，听说Python是必备技能。想请教各位大佬，零基础学Python需要多长时间？有没有系统的学习路线推荐？</Text>
          <View style={styles.questionFooter}>
            <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' }} style={styles.avatar} />
            <Text style={styles.authorName}>张三丰</Text>
            <Text style={styles.postTime}>· 2小时前发布</Text>
          </View>
          <View style={styles.topicTags}>
            <Text style={styles.topicTag}>#Python学习</Text>
            <Text style={styles.topicTag}>#编程入门</Text>
            <Text style={styles.topicTag}>#职业转型</Text>
          </View>
        </View>

        {/* 回答列表 */}
        <View style={styles.answersSection}>
          <Text style={styles.sectionTitle}>全部回答 (56)</Text>
          {answers.map(answer => (
            <View key={answer.id} style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Image source={{ uri: answer.avatar }} style={styles.answerAvatar} />
                <View style={styles.answerAuthorInfo}>
                  <View style={styles.authorRow}>
                    <Text style={styles.answerAuthor}>{answer.author}</Text>
                    {answer.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                  </View>
                  <Text style={styles.answerTime}>{answer.time}</Text>
                </View>
                {answer.adopted && (
                  <View style={styles.adoptedTag}><Text style={styles.adoptedText}>已采纳</Text></View>
                )}
              </View>
              <Text style={styles.answerContent}>{answer.content}</Text>
              <View style={styles.answerActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="thumbs-up-outline" size={18} color="#6b7280" />
                  <Text style={styles.actionText}>{answer.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="thumbs-down-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="chatbubble-outline" size={18} color="#6b7280" />
                  <Text style={styles.actionText}>{answer.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="share-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 底部输入框 */}
      <View style={styles.inputBar}>
        <TextInput style={styles.input} placeholder="写回答..." value={inputText} onChangeText={setInputText} />
        <TouchableOpacity style={styles.sendBtn}><Ionicons name="send" size={20} color="#fff" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  content: { flex: 1 },
  questionSection: { backgroundColor: '#fff', padding: 16 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rewardTag: { backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  rewardText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  answerCount: { marginLeft: 8, fontSize: 12, color: '#9ca3af' },
  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', lineHeight: 26 },
  questionContent: { fontSize: 14, color: '#4b5563', marginTop: 12, lineHeight: 22 },
  questionFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  avatar: { width: 24, height: 24, borderRadius: 12 },
  authorName: { marginLeft: 8, fontSize: 13, color: '#1f2937', fontWeight: '500' },
  postTime: { fontSize: 12, color: '#9ca3af' },
  topicTags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  topicTag: { fontSize: 12, color: '#3b82f6', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  answersSection: { marginTop: 8, backgroundColor: '#fff', padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 16 },
  answerCard: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerHeader: { flexDirection: 'row', alignItems: 'center' },
  answerAvatar: { width: 40, height: 40, borderRadius: 20 },
  answerAuthorInfo: { flex: 1, marginLeft: 12 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerAuthor: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  answerTime: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  adoptedTag: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  adoptedText: { fontSize: 11, color: '#16a34a', fontWeight: '500' },
  answerContent: { fontSize: 14, color: '#374151', lineHeight: 22, marginTop: 12 },
  answerActions: { flexDirection: 'row', marginTop: 12, gap: 24 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#6b7280' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  input: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn: { marginLeft: 12, backgroundColor: '#ef4444', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
