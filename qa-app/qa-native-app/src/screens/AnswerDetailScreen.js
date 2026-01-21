import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

// 评论数据
const initialComments = [
  { id: 1, author: '学习者小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt1', content: '写得太好了!我正好在学Python,这个学习路线很清晰,收藏了!', likes: 89, dislikes: 2, shares: 12, bookmarks: 34, time: '30分钟前' },
  { id: 2, author: '数据分析新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt2', content: '请问NumPy和Pandas哪个应该先学?', likes: 45, dislikes: 1, shares: 5, bookmarks: 18, time: '1小时前' },
  { id: 3, author: '转行成功', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt3', content: '我就是按照类似的路线学的,现在已经入职数据分析岗位了,感谢分享!', likes: 156, dislikes: 3, shares: 28, bookmarks: 67, time: '2小时前' },
  { id: 4, author: '编程小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cmt4', content: '廖雪峰的教程确实不错,我也在看', likes: 23, dislikes: 0, shares: 3, bookmarks: 8, time: '3小时前' },
];

// 补充回答数据
const supplementAnswers = [
  { id: 1, author: '资深开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sup1', location: '北京', content: '补充一点:学Python的时候一定要多动手写代码,光看不练是学不会的。建议每天至少写100行代码。', likes: 67, dislikes: 1, comments: 8, shares: 15, bookmarks: 28 },
  { id: 2, author: '培训讲师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sup2', location: '上海', content: '关于学习资源,除了廖雪峰的教程,还推荐B站上的黑马程序员Python教程,讲得很详细。', likes: 45, dislikes: 2, comments: 12, shares: 22, bookmarks: 56 },
];

const answerTabs = ['补充回答 (2)', '全部评论 (128)'];

export default function AnswerDetailScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('全部评论 (128)');
  const [sortFilter, setSortFilter] = useState('精选'); // 精选 or 最新
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

  // 回答信息(实际应从route.params获取)
  const answer = route?.params?.answer || {
    author: 'Python老司机',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1',
    verified: true,
    title: '资深Python开发 · 10年经验',
    content: '作为一个从零开始学Python的过来人,我来分享一下我的经验:\n\n1. 学习时间:如果每天能保证2-3小时的学习时间,3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线:\n- 第1个月:Python基础语法、数据类型、函数、面向对象\n- 第2个月:常用库(NumPy、Pandas)、数据处理\n- 第3个月:实战项目、数据可视化\n\n3. 推荐资源:廖雪峰的Python教程(免费)、《Python编程从入门到实践》',
    likes: 256,
    dislikes: 3,
    shares: 45,
    bookmarks: 89,
    comments: 128,
    views: 1234,
    time: '1小时前',
    adopted: true
  };

  const handleReply = (comment) => {
    setReplyTarget(comment);
    setShowReplyModal(true);
  };

  const submitReply = () => {
    if (replyText.trim()) {
      Alert.alert('成功', '回复已发布');
      setReplyText('');
      setShowReplyModal(false);
    }
  };

  const handleComment = () => {
    if (inputText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: '我',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
        content: inputText,
        likes: 0,
        dislikes: 0,
        shares: 0,
        bookmarks: 0,
        time: '刚刚'
      };
      setComments([newComment, ...comments]);
      setInputText('');
      Alert.alert('成功', '评论已发布');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>回答详情</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="arrow-redo-outline" size={22} color="#6b7280" />
            <Text style={styles.shareBtnText}>{answer.shares}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="flag-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 回答内容 */}
        <View style={styles.answerSection}>
          <View style={styles.answerHeader}>
            <Image source={{ uri: answer.avatar }} style={styles.answerAvatar} />
            <View style={styles.answerAuthorInfo}>
              <View style={styles.answerAuthorRow}>
                <Text style={styles.answerAuthor}>{answer.author}</Text>
                {answer.verified && <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />}
              </View>
              <Text style={styles.answerAuthorTitle}>{answer.title}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.followBtn, following && styles.followBtnActive]}
              onPress={() => setFollowing(!following)}
            >
              <Text style={[styles.followBtnText, following && styles.followBtnTextActive]}>
                {following ? '已关注' : '关注'}
              </Text>
            </TouchableOpacity>
          </View>

          {answer.adopted && (
            <View style={styles.adoptedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.adoptedText}>已采纳</Text>
            </View>
          )}

          <Text style={styles.answerContent}>{answer.content}</Text>

          <View style={styles.answerMeta}>
            <View style={styles.answerMetaRow}>
              <Ionicons name="eye-outline" size={14} color="#9ca3af" />
              <Text style={styles.answerViews}>{answer.views || 0} 浏览</Text>
              <Text style={styles.answerMetaSeparator}>·</Text>
              <Text style={styles.answerTime}>{answer.time}</Text>
            </View>
          </View>
        </View>

        {/* Tab标签 */}
        <View style={styles.tabsSection}>
          <View style={styles.tabs}>
            {answerTabs.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={styles.tabItem}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* 筛选条 */}
          {(activeTab === '补充回答 (2)' || activeTab === '全部评论 (128)') && (
            <View style={styles.sortFilterBar}>
              <View style={styles.sortFilterLeft}>
                <TouchableOpacity 
                  style={[styles.sortFilterBtn, sortFilter === '精选' && styles.sortFilterBtnActive]}
                  onPress={() => setSortFilter('精选')}
                >
                  <Ionicons name="star" size={14} color={sortFilter === '精选' ? '#ef4444' : '#9ca3af'} />
                  <Text style={[styles.sortFilterText, sortFilter === '精选' && styles.sortFilterTextActive]}>精选</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortFilterBtn, sortFilter === '最新' && styles.sortFilterBtnActive]}
                  onPress={() => setSortFilter('最新')}
                >
                  <Ionicons name="time" size={14} color={sortFilter === '最新' ? '#ef4444' : '#9ca3af'} />
                  <Text style={[styles.sortFilterText, sortFilter === '最新' && styles.sortFilterTextActive]}>最新</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sortFilterCount}>
                {activeTab === '补充回答 (2)' ? `共 ${supplementAnswers.length} 条补充回答` : `共 ${comments.length} 条评论`}
              </Text>
            </View>
          )}
        </View>

        {/* 内容区域 */}
        <View style={styles.contentSection}>
          {activeTab === '补充回答 (2)' ? (
            // 补充回答列表
            <>
              {supplementAnswers.map(supplement => (
                <View key={supplement.id} style={styles.supplementCard}>
                  <View style={styles.supplementHeader}>
                    <Image source={{ uri: supplement.avatar }} style={styles.supplementAvatar} />
                    <View style={styles.supplementAuthorInfo}>
                      <Text style={styles.supplementAuthor}>{supplement.author}</Text>
                      <View style={styles.supplementMeta}>
                        <Ionicons name="location-outline" size={12} color="#9ca3af" />
                        <Text style={styles.supplementLocation}>{supplement.location}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.supplementContent}>{supplement.content}</Text>
                  <View style={styles.supplementActions}>
                    <View style={styles.supplementActionsLeft}>
                      <TouchableOpacity style={styles.supplementActionBtn}>
                        <Ionicons name="thumbs-up-outline" size={16} color="#6b7280" />
                        <Text style={styles.supplementActionText}>{supplement.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.supplementActionBtn}>
                        <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                        <Text style={styles.supplementActionText}>{supplement.comments}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.supplementActionBtn}>
                        <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                        <Text style={styles.supplementActionText}>{supplement.shares}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.supplementActionBtn}>
                        <Ionicons name="bookmark-outline" size={16} color="#6b7280" />
                        <Text style={styles.supplementActionText}>{supplement.bookmarks}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.supplementActionsRight}>
                      <TouchableOpacity style={styles.supplementActionBtn}>
                        <Ionicons name="thumbs-down-outline" size={16} color="#6b7280" />
                        <Text style={styles.supplementActionText}>{supplement.dislikes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.supplementActionBtn}>
                        <Ionicons name="flag-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            // 评论列表
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
                    <View style={styles.commentActions}>
                      <View style={styles.commentActionsLeft}>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => setLiked({ ...liked, [comment.id]: !liked[comment.id] })}
                        >
                          <Ionicons 
                            name={liked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} 
                            size={14} 
                            color={liked[comment.id] ? "#ef4444" : "#9ca3af"} 
                          />
                          <Text style={[styles.commentActionText, liked[comment.id] && { color: '#ef4444' }]}>
                            {comment.likes + (liked[comment.id] ? 1 : 0)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => handleReply(comment)}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="arrow-redo-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.shares}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => setBookmarked({ ...bookmarked, [comment.id]: !bookmarked[comment.id] })}
                        >
                          <Ionicons 
                            name={bookmarked[comment.id] ? "bookmark" : "bookmark-outline"} 
                            size={14} 
                            color={bookmarked[comment.id] ? "#f59e0b" : "#9ca3af"} 
                          />
                          <Text style={[styles.commentActionText, bookmarked[comment.id] && { color: '#f59e0b' }]}>
                            {comment.bookmarks + (bookmarked[comment.id] ? 1 : 0)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.commentActionsRight}>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => setDisliked({ ...disliked, [comment.id]: !disliked[comment.id] })}
                        >
                          <Ionicons 
                            name={disliked[comment.id] ? "thumbs-down" : "thumbs-down-outline"} 
                            size={14} 
                            color="#9ca3af" 
                          />
                          <Text style={styles.commentActionText}>{comment.dislikes + (disliked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="flag-outline" size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* 底部栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <TouchableOpacity 
            style={styles.bottomIconBtn}
            onPress={() => setAnswerLiked(!answerLiked)}
          >
            <Ionicons 
              name={answerLiked ? "thumbs-up" : "thumbs-up-outline"} 
              size={20} 
              color={answerLiked ? "#ef4444" : "#6b7280"} 
            />
            <Text style={[styles.bottomIconText, answerLiked && { color: '#ef4444' }]}>
              {answer.likes + (answerLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomIconBtn}
            onPress={() => setAnswerBookmarked(!answerBookmarked)}
          >
            <Ionicons 
              name={answerBookmarked ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={answerBookmarked ? "#f59e0b" : "#6b7280"} 
            />
            <Text style={[styles.bottomIconText, answerBookmarked && { color: '#f59e0b' }]}>
              {(answer.bookmarks || 0) + (answerBookmarked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIconBtn}>
            <Ionicons name="thumbs-down-outline" size={20} color="#6b7280" />
            <Text style={styles.bottomIconText}>{answer.dislikes || 0}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBarRight}>
          <TouchableOpacity 
            style={styles.bottomCommentInput}
            onPress={() => {
              // 可以打开评论输入弹窗或聚焦输入框
            }}
          >
            <Text style={styles.bottomCommentPlaceholder}>写评论...</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomSupplementBtn}
            onPress={() => {
              Alert.alert('补充回答', '打开补充回答编辑页面');
              // 实际应该导航到补充回答编辑页面
              // navigation.navigate('SupplementAnswer', { answerId: answer.id });
            }}
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.bottomSupplementBtnText}>补充回答</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 回复弹窗 */}
      <Modal visible={showReplyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.replyModal}>
            <View style={styles.replyModalHeader}>
              <Text style={styles.replyModalTitle}>回复 {replyTarget?.author}</Text>
              <TouchableOpacity onPress={() => setShowReplyModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.replyInput}
              placeholder="写下你的回复..."
              placeholderTextColor="#9ca3af"
              value={replyText}
              onChangeText={setReplyText}
              multiline
              autoFocus
            />
            <TouchableOpacity 
              style={[styles.replySubmitBtn, !replyText.trim() && styles.replySubmitBtnDisabled]}
              onPress={submitReply}
              disabled={!replyText.trim()}
            >
              <Text style={styles.replySubmitText}>发布</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, width: 80, justifyContent: 'flex-end' },
  shareBtn: { padding: 4, flexDirection: 'row', alignItems: 'center', gap: 2 },
  shareBtnText: { fontSize: 12, color: '#6b7280' },
  content: { flex: 1 },
  answerSection: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  answerHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  answerAvatar: { width: 48, height: 48, borderRadius: 24 },
  answerAuthorInfo: { flex: 1, marginLeft: 12 },
  answerAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  answerAuthor: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  answerAuthorTitle: { fontSize: 13, color: '#9ca3af' },
  followBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  followBtnActive: { backgroundColor: '#f3f4f6' },
  followBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  followBtnTextActive: { color: '#6b7280' },
  adoptedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  adoptedText: { fontSize: 13, color: '#22c55e', fontWeight: '500' },
  answerContent: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 12 },
  answerMeta: { marginBottom: 12 },
  answerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answerViews: { fontSize: 13, color: '#9ca3af' },
  answerMetaSeparator: { fontSize: 13, color: '#d1d5db', marginHorizontal: 2 },
  answerTime: { fontSize: 13, color: '#9ca3af' },
  tabsSection: { backgroundColor: '#fff', marginBottom: 8 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabItem: { flex: 1, paddingVertical: 12, position: 'relative', alignItems: 'center' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  sortFilterBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sortFilterLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  sortFilterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  sortFilterBtnActive: { backgroundColor: '#fef2f2' },
  sortFilterText: { fontSize: 13, color: '#9ca3af' },
  sortFilterTextActive: { color: '#ef4444', fontWeight: '500' },
  sortFilterCount: { fontSize: 12, color: '#9ca3af' },
  contentSection: { backgroundColor: '#fff' },
  supplementCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  supplementHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  supplementAvatar: { width: 40, height: 40, borderRadius: 20 },
  supplementAuthorInfo: { flex: 1, marginLeft: 12 },
  supplementAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  supplementMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  supplementLocation: { fontSize: 12, color: '#9ca3af' },
  supplementContent: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 12 },
  supplementActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  supplementActionsLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  supplementActionsRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  supplementActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  supplementActionText: { fontSize: 13, color: '#6b7280' },
  commentCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1, marginLeft: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  commentTime: { fontSize: 12, color: '#9ca3af' },
  commentText: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 8 },
  commentActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  commentActionsLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  commentActionsRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  commentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12, color: '#9ca3af' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  bottomBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bottomBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginLeft: 16 },
  bottomIconBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  bottomIconText: { fontSize: 12, color: '#6b7280' },
  bottomCommentInput: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  bottomCommentPlaceholder: { fontSize: 13, color: '#9ca3af' },
  bottomSupplementBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, justifyContent: 'center' },
  bottomSupplementBtnText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  replyModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '60%' },
  replyModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  replyModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  replyInput: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, fontSize: 14, color: '#1f2937', minHeight: 100, textAlignVertical: 'top', marginBottom: 16 },
  replySubmitBtn: { backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  replySubmitBtnDisabled: { backgroundColor: '#fca5a5' },
  replySubmitText: { fontSize: 15, color: '#fff', fontWeight: '600' },
});
