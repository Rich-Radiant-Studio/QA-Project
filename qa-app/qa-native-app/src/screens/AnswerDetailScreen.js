import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 评论数据
const initialComments = [
  { id: 1, author: '学习者小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt1', content: '写得太好了！我正好在学Python，这个学习路线很清晰，收藏了！', likes: 89, dislikes: 2, shares: 12, bookmarks: 34, time: '30分钟前' },
  { id: 2, author: '数据分析新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt2', content: '请问NumPy和Pandas哪个应该先学？', likes: 45, dislikes: 1, shares: 5, bookmarks: 18, time: '1小时前' },
  { id: 3, author: '转行成功', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt3', content: '我就是按照类似的路线学的，现在已经入职数据分析岗位了，感谢分享！', likes: 156, dislikes: 3, shares: 28, bookmarks: 67, time: '2小时前' },
  { id: 4, author: '编程小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt4', content: '廖雪峰的教程确实不错，我也在看', likes: 23, dislikes: 0, shares: 3, bookmarks: 8, time: '3小时前' },
];

// 补充回答数据
const supplementAnswers = [
  { id: 1, author: '资深开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sup1', location: '北京', content: '补充一点：学Python的时候一定要多动手写代码，光看不练是学不会的。建议每天至少写100行代码。', likes: 67, dislikes: 1, shares: 15, bookmarks: 28 },
  { id: 2, author: '培训讲师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sup2', location: '上海', content: '关于学习资源，除了廖雪峰的教程，还推荐B站上的黑马程序员Python教程，讲得很详细。', likes: 45, dislikes: 2, shares: 22, bookmarks: 56 },
];

const answerTabs = ['补充回答', '全部评论 (128)', '精选评论', '最新'];

export default function AnswerDetailScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('全部评论 (128)');
  const [liked, setLiked] = useState({});
  const [disliked, setDisliked] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [answerLiked, setAnswerLiked] = useState(false);
  const [answerBookmarked, setAnswerBookmarked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [following, setFollowing] = useState(false);

  // 回答信息（实际应从route.params获取）
  const answer = route?.params?.answer || {
    author: 'Python老司机',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1',
    verified: true,
    title: '资深Python开发 · 10年经验',
    content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：\n\n1. 学习时间：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线：\n- 第1个月：Python基础语法、数据类型、函数、面向对象\n- 第2个月：常用库（NumPy、Pandas）、数据处理\n- 第3个月：实战项目、数据可视化\n\n3. 推荐资源：廖雪峰的Python教程（免费）、《Python编程从入门到实践》',
    likes: 256,
    dislikes: 3,
    shares: 45,
    bookmarks: 89,
    comments: 128,
    time: '1小时前',
    adopted: true
  };

  const handleSendComment = () => {
    if (!inputText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      content: inputText,
      likes: 0, dislikes: 0, shares: 0, bookmarks: 0,
      time: '刚刚'
    };
    setComments([newComment, ...comments]);
    setInputText('');
  };

  const openReplyModal = (item) => {
    setReplyTarget(item);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      content: `回复 @${replyTarget.author}：${replyText}`,
      likes: 0, dislikes: 0, shares: 0, bookmarks: 0,
      time: '刚刚'
    };
    setComments([newComment, ...comments]);
    setReplyText('');
    setShowReplyModal(false);
  };

  const handleReport = (item) => {
    Alert.alert('举报', '确定要举报该内容吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => Alert.alert('提示', '举报已提交，我们会尽快处理') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>回答详情</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity><Ionicons name="arrow-redo-outline" size={22} color="#374151" /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}><Ionicons name="ellipsis-horizontal" size={22} color="#374151" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 回答内容 */}
        <View style={styles.answerSection}>
          <View style={styles.authorRow}>
            <Image source={{ uri: answer.avatar }} style={styles.authorAvatar} />
            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorName}>{answer.author}</Text>
                {answer.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" style={{ marginLeft: 4 }} />}
                {answer.adopted && <View style={styles.adoptedTag}><Text style={styles.adoptedTagText}>已采纳</Text></View>}
              </View>
              <Text style={styles.authorTitle}>{answer.title}</Text>
            </View>
            <TouchableOpacity style={styles.followBtn} onPress={() => setFollowing(!following)}>
              <Text style={[styles.followBtnText, following && { color: '#6b7280' }]}>{following ? '已关注' : '+ 关注'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.answerContent}>{answer.content}</Text>
          <Text style={styles.postTime}>{answer.time}</Text>

          {/* 互动数据 */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => setAnswerLiked(!answerLiked)}>
              <Ionicons name={answerLiked ? "thumbs-up" : "thumbs-up-outline"} size={18} color={answerLiked ? "#ef4444" : "#6b7280"} />
              <Text style={[styles.statValue, answerLiked && { color: '#ef4444' }]}>{answer.likes + (answerLiked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Ionicons name="thumbs-down-outline" size={18} color="#6b7280" />
              <Text style={styles.statValue}>{answer.dislikes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={18} color="#6b7280" />
              <Text style={styles.statValue}>{answer.comments}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="arrow-redo-outline" size={18} color="#6b7280" />
              <Text style={styles.statValue}>{answer.shares}</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={() => setAnswerBookmarked(!answerBookmarked)}>
              <Ionicons name={answerBookmarked ? "bookmark" : "bookmark-outline"} size={18} color={answerBookmarked ? "#f59e0b" : "#6b7280"} />
              <Text style={[styles.statValue, answerBookmarked && { color: '#f59e0b' }]}>{answer.bookmarks + (answerBookmarked ? 1 : 0)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 评论区域 */}
        <View style={styles.commentsSection}>
          <View style={styles.commentTabs}>
            {answerTabs.map(tab => (
              <TouchableOpacity key={tab} style={styles.commentTabItem} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.commentTabText, activeTab === tab && styles.commentTabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.commentTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === '补充回答' ? (
            <>
              {supplementAnswers.map(item => (
                <View key={item.id} style={styles.suppCard}>
                  <View style={styles.suppHeader}>
                    <Image source={{ uri: item.avatar }} style={styles.suppAvatar} />
                    <View style={styles.suppAuthorInfo}>
                      <Text style={styles.suppAuthor}>{item.author}</Text>
                      <View style={styles.suppLocationRow}>
                        <Ionicons name="location-outline" size={12} color="#9ca3af" />
                        <Text style={styles.suppLocation}>{item.location}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.suppContent}>{item.content}</Text>
                  <View style={styles.suppFooter}>
                    <TouchableOpacity style={styles.suppActionBtn} onPress={() => setLiked({ ...liked, [`s${item.id}`]: !liked[`s${item.id}`] })}>
                      <Ionicons name={liked[`s${item.id}`] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={liked[`s${item.id}`] ? "#ef4444" : "#6b7280"} />
                      <Text style={[styles.suppActionText, liked[`s${item.id}`] && { color: '#ef4444' }]}>{item.likes + (liked[`s${item.id}`] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppActionBtn} onPress={() => setDisliked({ ...disliked, [`s${item.id}`]: !disliked[`s${item.id}`] })}>
                      <Ionicons name={disliked[`s${item.id}`] ? "thumbs-down" : "thumbs-down-outline"} size={16} color={disliked[`s${item.id}`] ? "#3b82f6" : "#6b7280"} />
                      <Text style={[styles.suppActionText, disliked[`s${item.id}`] && { color: '#3b82f6' }]}>{item.dislikes + (disliked[`s${item.id}`] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppActionBtn}>
                      <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                      <Text style={styles.suppActionText}>{item.shares}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppActionBtn} onPress={() => setBookmarked({ ...bookmarked, [`s${item.id}`]: !bookmarked[`s${item.id}`] })}>
                      <Ionicons name={bookmarked[`s${item.id}`] ? "bookmark" : "bookmark-outline"} size={16} color={bookmarked[`s${item.id}`] ? "#f59e0b" : "#6b7280"} />
                      <Text style={[styles.suppActionText, bookmarked[`s${item.id}`] && { color: '#f59e0b' }]}>{item.bookmarks + (bookmarked[`s${item.id}`] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppActionBtn} onPress={() => handleReport(item)}>
                      <Ionicons name="flag-outline" size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.replyBtn} onPress={() => openReplyModal(item)}>
                      <Ionicons name="return-down-back-outline" size={14} color="#ef4444" />
                      <Text style={styles.replyBtnText}>回复</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              {comments.map(comment => (
                <View key={comment.id} style={styles.commentCard}>
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <View style={styles.commentFooter}>
                      <TouchableOpacity style={styles.commentActionBtn} onPress={() => setLiked({ ...liked, [comment.id]: !liked[comment.id] })}>
                        <Ionicons name={liked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={liked[comment.id] ? "#ef4444" : "#6b7280"} />
                        <Text style={[styles.commentActionText, liked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (liked[comment.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionBtn} onPress={() => setDisliked({ ...disliked, [comment.id]: !disliked[comment.id] })}>
                        <Ionicons name={disliked[comment.id] ? "thumbs-down" : "thumbs-down-outline"} size={14} color={disliked[comment.id] ? "#3b82f6" : "#6b7280"} />
                        <Text style={[styles.commentActionText, disliked[comment.id] && { color: '#3b82f6' }]}>{comment.dislikes + (disliked[comment.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionBtn}>
                        <Ionicons name="arrow-redo-outline" size={14} color="#6b7280" />
                        <Text style={styles.commentActionText}>{comment.shares}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionBtn} onPress={() => setBookmarked({ ...bookmarked, [comment.id]: !bookmarked[comment.id] })}>
                        <Ionicons name={bookmarked[comment.id] ? "bookmark" : "bookmark-outline"} size={14} color={bookmarked[comment.id] ? "#f59e0b" : "#6b7280"} />
                        <Text style={[styles.commentActionText, bookmarked[comment.id] && { color: '#f59e0b' }]}>{comment.bookmarks + (bookmarked[comment.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleReport(comment)}>
                        <Ionicons name="flag-outline" size={14} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.replyBtn} onPress={() => openReplyModal(comment)}>
                        <Ionicons name="return-down-back-outline" size={14} color="#ef4444" />
                        <Text style={styles.replyBtnText}>回复</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.loadMoreBtn}>
                <Text style={styles.loadMoreText}>查看更多评论</Text>
                <Ionicons name="chevron-down" size={16} color="#ef4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* 底部输入框 */}
      <View style={styles.bottomBar}>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="写评论..." value={inputText} onChangeText={setInputText} />
        </View>
        <TouchableOpacity style={styles.bottomAction} onPress={() => setAnswerLiked(!answerLiked)}>
          <Ionicons name={answerLiked ? "heart" : "heart-outline"} size={22} color={answerLiked ? "#ef4444" : "#6b7280"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomAction} onPress={() => setAnswerBookmarked(!answerBookmarked)}>
          <Ionicons name={answerBookmarked ? "bookmark" : "bookmark-outline"} size={22} color={answerBookmarked ? "#f59e0b" : "#6b7280"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSendComment}><Text style={styles.submitBtnText}>发送</Text></TouchableOpacity>
      </View>

      {/* 回复弹窗 */}
      <Modal visible={showReplyModal} transparent animationType="slide">
        <TouchableOpacity style={styles.replyModalOverlay} activeOpacity={1} onPress={() => setShowReplyModal(false)}>
          <View style={styles.replyModalContent}>
            <View style={styles.replyModalHandle} />
            <Text style={styles.replyModalTitle}>回复 @{replyTarget?.author}</Text>
            <TextInput
              style={styles.replyModalInput}
              placeholder="写下你的回复..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
              autoFocus
            />
            <View style={styles.replyModalActions}>
              <TouchableOpacity style={styles.replyModalCancel} onPress={() => setShowReplyModal(false)}>
                <Text style={styles.replyModalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.replyModalSubmit} onPress={handleReply}>
                <Text style={styles.replyModalSubmitText}>发送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  answerSection: { backgroundColor: '#fff', padding: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  authorAvatar: { width: 48, height: 48, borderRadius: 24 },
  authorInfo: { flex: 1, marginLeft: 12 },
  authorNameRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  adoptedTag: { marginLeft: 8, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  adoptedTagText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  authorTitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  followBtn: { paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#ef4444', borderRadius: 16 },
  followBtnText: { fontSize: 13, color: '#ef4444' },
  answerContent: { fontSize: 15, color: '#374151', lineHeight: 24 },
  postTime: { fontSize: 12, color: '#9ca3af', marginTop: 12 },
  statsRow: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 24 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontSize: 14, color: '#6b7280' },
  commentsSection: { marginTop: 8, backgroundColor: '#fff' },
  commentTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentTabItem: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  commentTabText: { fontSize: 14, color: '#6b7280' },
  commentTabTextActive: { color: '#ef4444', fontWeight: '600' },
  commentTabIndicator: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  suppCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  suppHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  suppAvatar: { width: 36, height: 36, borderRadius: 18 },
  suppAuthorInfo: { flex: 1, marginLeft: 10 },
  suppAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  suppLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 2 },
  suppLocation: { fontSize: 12, color: '#9ca3af' },
  suppContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  suppFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 12 },
  suppActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suppActionText: { fontSize: 13, color: '#6b7280' },
  commentCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1, marginLeft: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  commentAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  commentTime: { fontSize: 12, color: '#9ca3af' },
  commentText: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  commentFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 12 },
  commentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12, color: '#6b7280' },
  replyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  replyBtnText: { fontSize: 13, color: '#ef4444', fontWeight: '500' },
  loadMoreBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 4 },
  loadMoreText: { fontSize: 14, color: '#ef4444' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  inputWrapper: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  input: { fontSize: 14 },
  bottomAction: { padding: 8 },
  submitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginLeft: 4 },
  submitBtnText: { fontSize: 14, color: '#fff', fontWeight: '500' },
  // 回复弹窗样式
  replyModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  replyModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  replyModalHandle: { width: 40, height: 4, backgroundColor: '#d1d5db', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  replyModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  replyModalInput: { backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
  replyModalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
  replyModalCancel: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  replyModalCancelText: { fontSize: 14, color: '#6b7280' },
  replyModalSubmit: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#ef4444' },
  replyModalSubmitText: { fontSize: 14, color: '#fff', fontWeight: '500' },
});
