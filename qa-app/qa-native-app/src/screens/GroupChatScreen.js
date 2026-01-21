import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

const initialMessages = [
  { id: 1, author: '技术小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg1', content: '这个问题我也很想知道答案，关注了！', time: '10分钟前', likes: 12, dislikes: 1, shares: 3, bookmarks: 5 },
  { id: 2, author: 'Python爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg2', content: '我觉得3个月入门完全可以，关键是要坚持每天练习', time: '25分钟前', likes: 28, dislikes: 2, shares: 8, bookmarks: 15 },
  { id: 3, author: '数据分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg3', content: '推荐先从基础语法开始，然后学pandas和numpy，这两个库在数据分析中用得最多', time: '1小时前', likes: 45, dislikes: 3, shares: 12, bookmarks: 28 },
  { id: 4, author: '转行成功', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg4', content: '我就是文科转行的，现在已经做了2年数据分析了，加油！', time: '2小时前', likes: 67, dislikes: 1, shares: 18, bookmarks: 34 },
  { id: 5, author: '编程导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg5', content: '建议找一个实际项目来练手，比如爬虫或者数据可视化，这样学得更快', time: '3小时前', likes: 89, dislikes: 2, shares: 25, bookmarks: 56 },
];

export default function GroupChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [liked, setLiked] = useState({});
  const [disliked, setDisliked] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [isJoined, setIsJoined] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');

  const question = route?.params?.question || {
    title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？',
    author: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    memberCount: 128
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now(),
      author: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      content: inputText,
      time: '刚刚',
      likes: 0,
      dislikes: 0,
      shares: 0,
      bookmarks: 0
    };
    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  const handleExitGroup = () => {
    Alert.alert(
      '退出群组',
      '确定要退出该群组吗？退出后将无法查看群组消息',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定退出', style: 'destructive', onPress: () => {
          setIsJoined(false);
          navigation.goBack();
        }}
      ]
    );
  };

  const openReplyModal = (msg) => {
    setReplyTarget(msg);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newMessage = {
      id: Date.now(),
      author: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      content: `回复 @${replyTarget.author}：${replyText}`,
      time: '刚刚',
      likes: 0,
      dislikes: 0,
      shares: 0,
      bookmarks: 0
    };
    setMessages([newMessage, ...messages]);
    setReplyText('');
    setShowReplyModal(false);
    setReplyTarget(null);
  };

  const handleReport = (msg) => {
    Alert.alert('举报', '确定要举报该内容吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => Alert.alert('提示', '举报已提交，我们会尽快处理') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>问题群组</Text>
          <Text style={styles.memberCount}>{question.memberCount} 人已加入</Text>
        </View>
        <TouchableOpacity onPress={handleExitGroup} style={styles.exitBtn}>
          <Ionicons name="exit-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 问题卡片 */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Image source={{ uri: question.avatar }} style={styles.questionAvatar} />
            <Text style={styles.questionAuthor}>{question.author}</Text>
            <View style={styles.questionTag}>
              <Text style={styles.questionTagText}>提问者</Text>
            </View>
          </View>
          <Text style={styles.questionTitle}>{question.title}</Text>
        </View>

        {/* 留言列表 */}
        <View style={styles.messagesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>群组留言</Text>
            <Text style={styles.messageCount}>{messages.length} 条留言</Text>
          </View>

          {messages.map(msg => (
            <View key={msg.id} style={styles.messageCard}>
              <Image source={{ uri: msg.avatar }} style={styles.msgAvatar} />
              <View style={styles.msgContent}>
                <View style={styles.msgHeader}>
                  <Text style={styles.msgAuthor}>{msg.author}</Text>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
                <Text style={styles.msgText}>{msg.content}</Text>
                <View style={styles.msgActions}>
                  <TouchableOpacity style={styles.msgActionBtn} onPress={() => setLiked({ ...liked, [msg.id]: !liked[msg.id] })}>
                    <Ionicons name={liked[msg.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={liked[msg.id] ? "#ef4444" : "#6b7280"} />
                    <Text style={[styles.msgActionText, liked[msg.id] && { color: '#ef4444' }]}>{msg.likes + (liked[msg.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.msgActionBtn} onPress={() => setDisliked({ ...disliked, [msg.id]: !disliked[msg.id] })}>
                    <Ionicons name={disliked[msg.id] ? "thumbs-down" : "thumbs-down-outline"} size={14} color={disliked[msg.id] ? "#3b82f6" : "#6b7280"} />
                    <Text style={[styles.msgActionText, disliked[msg.id] && { color: '#3b82f6' }]}>{msg.dislikes + (disliked[msg.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.msgActionBtn}>
                    <Ionicons name="arrow-redo-outline" size={14} color="#6b7280" />
                    <Text style={styles.msgActionText}>{msg.shares}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.msgActionBtn} onPress={() => setBookmarked({ ...bookmarked, [msg.id]: !bookmarked[msg.id] })}>
                    <Ionicons name={bookmarked[msg.id] ? "bookmark" : "star-outline"} size={14} color={bookmarked[msg.id] ? "#f59e0b" : "#6b7280"} />
                    <Text style={[styles.msgActionText, bookmarked[msg.id] && { color: '#f59e0b' }]}>{msg.bookmarks + (bookmarked[msg.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.msgActionBtn} onPress={() => handleReport(msg)}>
                    <Ionicons name="flag-outline" size={14} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replyBtn} onPress={() => openReplyModal(msg)}>
                    <Ionicons name="return-down-back-outline" size={14} color="#ef4444" />
                    <Text style={styles.replyBtnText}>回复</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 回复弹窗 */}
      <Modal visible={showReplyModal} transparent animationType="slide">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowReplyModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.replyModal}>
            <View style={styles.replyModalHeader}>
              <Text style={styles.replyModalTitle}>回复</Text>
              <TouchableOpacity onPress={() => setShowReplyModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            {replyTarget && (
              <View style={styles.replyTargetCard}>
                <Image source={{ uri: replyTarget.avatar }} style={styles.replyTargetAvatar} />
                <View style={styles.replyTargetInfo}>
                  <Text style={styles.replyTargetAuthor}>{replyTarget.author}</Text>
                  <Text style={styles.replyTargetContent} numberOfLines={2}>{replyTarget.content}</Text>
                </View>
              </View>
            )}

            <View style={styles.replyInputWrapper}>
              <TextInput
                style={styles.replyInput}
                placeholder={`回复 @${replyTarget?.author || ''}...`}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                autoFocus
              />
            </View>

            <View style={styles.replyModalFooter}>
              <TouchableOpacity style={styles.replyCancelBtn} onPress={() => setShowReplyModal(false)}>
                <Text style={styles.replyCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.replySubmitBtn, !replyText.trim() && styles.replySubmitBtnDisabled]} 
                onPress={handleReply}
                disabled={!replyText.trim()}
              >
                <Text style={styles.replySubmitText}>发送</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 底部输入栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="发表留言..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>
        <TouchableOpacity 
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { padding: 4 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  memberCount: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  exitBtn: { padding: 4 },
  content: { flex: 1 },
  questionCard: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  questionAvatar: { width: 36, height: 36, borderRadius: 18 },
  questionAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginLeft: 10 },
  questionTag: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  questionTagText: { fontSize: 11, color: '#ef4444' },
  questionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', lineHeight: 24 },
  messagesSection: { backgroundColor: '#fff', paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  messageCount: { fontSize: 13, color: '#9ca3af' },
  messageCard: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  msgAvatar: { width: 36, height: 36, borderRadius: 18 },
  msgContent: { flex: 1, marginLeft: 12 },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  msgAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  msgTime: { fontSize: 12, color: '#9ca3af' },
  msgText: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  msgActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 12 },
  msgActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  msgActionText: { fontSize: 12, color: '#6b7280' },
  replyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  replyBtnText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  replyModal: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 34 },
  replyModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  replyModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  replyTargetCard: { flexDirection: 'row', padding: 16, backgroundColor: '#f9fafb', margin: 16, marginBottom: 0, borderRadius: 8 },
  replyTargetAvatar: { width: 32, height: 32, borderRadius: 16 },
  replyTargetInfo: { flex: 1, marginLeft: 10 },
  replyTargetAuthor: { fontSize: 13, fontWeight: '500', color: '#1f2937' },
  replyTargetContent: { fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 18 },
  replyInputWrapper: { margin: 16, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, minHeight: 100 },
  replyInput: { fontSize: 14, color: '#1f2937', textAlignVertical: 'top' },
  replyModalFooter: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, gap: 12 },
  replyCancelBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  replyCancelText: { fontSize: 14, color: '#6b7280' },
  replySubmitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  replySubmitBtnDisabled: { backgroundColor: '#fca5a5' },
  replySubmitText: { fontSize: 14, color: '#fff', fontWeight: '500' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  inputWrapper: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100 },
  input: { fontSize: 14, color: '#1f2937' },
  sendBtn: { backgroundColor: '#ef4444', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnDisabled: { backgroundColor: '#fca5a5' },
});
