import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const answers = [
  { id: 1, author: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', verified: true, adopted: true, title: '资深Python开发 · 10年经验', content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：\n\n1. 学习时间：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线：\n- 第1个月：Python基础语法、数据类型、函数、面向对象\n- 第2个月：常用库（NumPy、Pandas）、数据处理\n- 第3个月：实战项目、数据可视化\n\n3. 推荐资源：廖雪峰的Python教程（免费）、《Python编程从入门到实践》', likes: 256, dislikes: 3, comments: 23, time: '1小时前' },
  { id: 2, author: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', verified: false, adopted: false, title: '数据分析师 · 3年经验', content: '我也是文科转行的，现在在做数据分析。给你几点建议：\n\n1. 不要一开始就啃书，先跟着视频教程敲代码\n2. 多做项目，边学边练\n3. 加入一些学习群，有问题可以随时问', likes: 89, dislikes: 1, comments: 12, time: '30分钟前' },
  { id: 3, author: '编程新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer3', verified: false, adopted: false, title: '学生', content: '同问！我也想学Python，坐等大佬回答~', likes: 5, dislikes: 2, comments: 0, time: '10分钟前' },
];

const answerTabs = ['全部回答 (56)', '精选回答', '最新'];

export default function QuestionDetailScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('全部回答 (56)');
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState(false);
  const [hearted, setHearted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>问题详情</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity><Ionicons name="share-social-outline" size={22} color="#374151" /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}><Ionicons name="ellipsis-horizontal" size={22} color="#374151" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 问题内容 */}
        <View style={styles.questionSection}>
          <View style={styles.authorRow}>
            <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' }} style={styles.authorAvatar} />
            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorName}>张三丰</Text>
                <View style={styles.rewardTag}><Text style={styles.rewardTagText}>悬赏 $50</Text></View>
              </View>
              <Text style={styles.postTime}>2小时前 · 北京</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}><Text style={styles.followBtnText}>+ 关注</Text></TouchableOpacity>
          </View>

          <Text style={styles.questionTitle}>如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？</Text>
          <Text style={styles.questionContent}>本人是一名文科生，之前完全没有接触过编程。最近想转行做数据分析，听说Python是必备技能。{'\n\n'}想请教各位大神：{'\n'}1. 零基础学Python需要多长时间？{'\n'}2. 有没有推荐的学习路线或者教程？{'\n'}3. 需要买什么书或者报什么课程吗？</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop' }} style={styles.questionImage} />
          <View style={styles.topicTags}>
            <Text style={styles.topicTag}>#Python学习</Text>
            <Text style={styles.topicTag}>#编程入门</Text>
            <Text style={styles.topicTag}>#转行</Text>
          </View>

          {/* PK进度条 */}
          <View style={styles.pkSection}>
            <View style={styles.pkLabels}>
              <Text style={styles.pkSolved}>已解决 65%</Text>
              <Text style={styles.pkUnsolved}>未解决 35%</Text>
            </View>
            <View style={styles.pkBar}>
              <View style={[styles.pkSolvedBar, { width: '65%' }]} />
              <View style={[styles.pkUnsolvedBar, { width: '35%' }]} />
            </View>
            <View style={styles.voteButtons}>
              <TouchableOpacity style={styles.voteSolvedBtn}><Ionicons name="checkmark-circle" size={16} color="#ef4444" /><Text style={styles.voteSolvedText}>已解决</Text></TouchableOpacity>
              <TouchableOpacity style={styles.voteUnsolvedBtn}><Ionicons name="close-circle" size={16} color="#3b82f6" /><Text style={styles.voteUnsolvedText}>未解决</Text></TouchableOpacity>
            </View>
          </View>

          {/* 互动数据 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={styles.statValue}>128</Text><Text style={styles.statLabel}>点赞</Text></View>
            <View style={styles.statItem}><Text style={styles.statValue}>56</Text><Text style={styles.statLabel}>回答</Text></View>
            <View style={styles.statItem}><Text style={styles.statValue}>1.2k</Text><Text style={styles.statLabel}>浏览</Text></View>
            <View style={styles.statItem}><Text style={styles.statValue}>89</Text><Text style={styles.statLabel}>收藏</Text></View>
          </View>
        </View>

        {/* 回答区域 */}
        <View style={styles.answersSection}>
          <View style={styles.answerTabs}>
            {answerTabs.map(tab => (
              <TouchableOpacity key={tab} style={styles.answerTabItem} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.answerTabText, activeTab === tab && styles.answerTabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.answerTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {answers.map(answer => (
            <View key={answer.id} style={[styles.answerCard, answer.adopted && styles.answerCardAdopted]}>
              <View style={styles.answerHeader}>
                <Image source={{ uri: answer.avatar }} style={styles.answerAvatar} />
                <View style={styles.answerAuthorInfo}>
                  <View style={styles.answerAuthorRow}>
                    <Text style={styles.answerAuthor}>{answer.author}</Text>
                    {answer.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                    {answer.adopted && <View style={styles.adoptedTag}><Text style={styles.adoptedTagText}>已采纳</Text></View>}
                  </View>
                  <Text style={styles.answerAuthorTitle}>{answer.title}</Text>
                </View>
              </View>
              <Text style={styles.answerContent}>{answer.content}</Text>
              <View style={styles.answerFooter}>
                <View style={styles.answerActions}>
                  <TouchableOpacity style={styles.answerActionBtn} onPress={() => setLiked({ ...liked, [answer.id]: !liked[answer.id] })}>
                    <Ionicons name={liked[answer.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={liked[answer.id] ? "#ef4444" : "#6b7280"} />
                    <Text style={[styles.answerActionText, liked[answer.id] && { color: '#ef4444' }]}>{answer.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerActionBtn}><Ionicons name="thumbs-down-outline" size={16} color="#6b7280" /><Text style={styles.answerActionText}>{answer.dislikes}</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.answerActionBtn}><Ionicons name="chatbubble-outline" size={16} color="#6b7280" /><Text style={styles.answerActionText}>{answer.comments}</Text></TouchableOpacity>
                </View>
                <Text style={styles.answerTime}>{answer.time}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.loadMoreBtn}><Text style={styles.loadMoreText}>查看更多回答</Text><Ionicons name="chevron-down" size={16} color="#ef4444" /></TouchableOpacity>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="写回答..." value={inputText} onChangeText={setInputText} />
        </View>
        <TouchableOpacity style={styles.bottomAction} onPress={() => setHearted(!hearted)}>
          <Ionicons name={hearted ? "heart" : "heart-outline"} size={22} color={hearted ? "#ef4444" : "#6b7280"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomAction} onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={22} color={bookmarked ? "#f59e0b" : "#6b7280"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomAction}><Ionicons name="people-outline" size={22} color="#6b7280" /></TouchableOpacity>
        <TouchableOpacity style={styles.answerSubmitBtn}><Text style={styles.answerSubmitText}>回答</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  content: { flex: 1 },
  questionSection: { backgroundColor: '#fff', padding: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  authorAvatar: { width: 48, height: 48, borderRadius: 24 },
  authorInfo: { flex: 1, marginLeft: 12 },
  authorNameRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  rewardTag: { marginLeft: 8, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  rewardTagText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  postTime: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  followBtn: { paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#ef4444', borderRadius: 16 },
  followBtnText: { fontSize: 13, color: '#ef4444' },
  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', lineHeight: 26 },
  questionContent: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginTop: 12 },
  questionImage: { width: '100%', height: 180, borderRadius: 8, marginTop: 12 },
  topicTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  topicTag: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pkSection: { marginTop: 16 },
  pkLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  pkSolved: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  pkUnsolved: { fontSize: 12, color: '#3b82f6', fontWeight: '500' },
  pkBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  pkSolvedBar: { backgroundColor: '#ef4444', height: '100%' },
  pkUnsolvedBar: { backgroundColor: '#3b82f6', height: '100%' },
  voteButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 12 },
  voteSolvedBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, gap: 6 },
  voteSolvedText: { fontSize: 13, color: '#ef4444' },
  voteUnsolvedBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, gap: 6 },
  voteUnsolvedText: { fontSize: 13, color: '#3b82f6' },
  statsRow: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  statLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  answersSection: { marginTop: 8, backgroundColor: '#fff' },
  answerTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerTabItem: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  answerTabText: { fontSize: 14, color: '#6b7280' },
  answerTabTextActive: { color: '#ef4444', fontWeight: '600' },
  answerTabIndicator: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  answerCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerCardAdopted: { backgroundColor: '#fef2f210' },
  answerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  answerAvatar: { width: 40, height: 40, borderRadius: 20 },
  answerAuthorInfo: { flex: 1, marginLeft: 12 },
  answerAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answerAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  adoptedTag: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  adoptedTagText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  answerAuthorTitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  answerContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  answerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  answerActions: { flexDirection: 'row', gap: 20 },
  answerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerActionText: { fontSize: 13, color: '#6b7280' },
  answerTime: { fontSize: 12, color: '#9ca3af' },
  loadMoreBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 4 },
  loadMoreText: { fontSize: 14, color: '#ef4444' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  inputWrapper: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  input: { fontSize: 14 },
  bottomAction: { padding: 8 },
  answerSubmitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginLeft: 4 },
  answerSubmitText: { fontSize: 14, color: '#fff', fontWeight: '500' },
});
