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

  // 仲裁相关状态
  const [showArbitrationModal, setShowArbitrationModal] = useState(false);
  const [arbitrationReason, setArbitrationReason] = useState('');
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [expertSearchText, setExpertSearchText] = useState('');

  // 可邀请的专家列表
  const expertsList = [
    { id: 1, name: '李明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert1', title: 'Python架构师', verified: true, expertise: 'Python开发' },
    { id: 2, name: '王芳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert2', title: '数据科学家', verified: true, expertise: '数据分析' },
    { id: 3, name: '赵强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert3', title: '技术总监', verified: true, expertise: '技术管理' },
    { id: 4, name: '刘洋', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert4', title: 'AI工程师', verified: true, expertise: '机器学习' },
    { id: 5, name: '陈静', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert5', title: '全栈开发', verified: true, expertise: 'Web开发' },
  ];

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
    adopted: true,
    invitedBy: { name: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=inviter1' }
  };

  // 处理仲裁申请
  const handleSubmitArbitration = () => {
    if (!arbitrationReason.trim()) {
      Alert.alert('提示', '请说明申请仲裁的理由');
      return;
    }
    if (selectedExperts.length < 3) {
      Alert.alert('提示', '至少需要邀请 3 位专家参与仲裁');
      return;
    }
    if (selectedExperts.length > 5) {
      Alert.alert('提示', '最多只能邀请 5 位专家');
      return;
    }

    Alert.alert('成功', '仲裁申请已提交，等待专家投票中...');
    setShowArbitrationModal(false);
    setArbitrationReason('');
    setSelectedExperts([]);
  };

  // 切换专家选择
  const toggleExpertSelection = (expertId) => {
    if (selectedExperts.includes(expertId)) {
      setSelectedExperts(selectedExperts.filter(id => id !== expertId));
    } else {
      if (selectedExperts.length >= 5) {
        Alert.alert('提示', '最多只能邀请 5 位专家');
        return;
      }
      setSelectedExperts([...selectedExperts, expertId]);
    }
  };

  // 过滤专家列表
  const filteredExperts = expertsList.filter(expert =>
    expert.name.toLowerCase().includes(expertSearchText.toLowerCase()) ||
    expert.title.toLowerCase().includes(expertSearchText.toLowerCase()) ||
    expert.expertise.toLowerCase().includes(expertSearchText.toLowerCase())
  );

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

          <Text style={styles.answerContent}>{answer.content}</Text>

          {/* 时间和标签区域 - 合并在一行 */}
          <View style={styles.answerMetaWithBadges}>
            <View style={styles.answerMetaLeft}>
              <Ionicons name="eye-outline" size={14} color="#9ca3af" />
              <Text style={styles.answerViews}>{answer.views || 0} 浏览</Text>
              <Text style={styles.answerMetaSeparator}>·</Text>
              <Text style={styles.answerTime}>{answer.time}</Text>
            </View>
            
            {/* 标签区域 - 放在右侧 */}
            <View style={styles.badgesSectionRight}>
              {/* 已采纳标签 */}
              {answer.adopted && (
                <View style={styles.adoptedBadgeCompact}>
                  <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                  <Text style={styles.adoptedBadgeCompactText}>已采纳</Text>
                </View>
              )}
              
              {/* 邀请者标签 */}
              {answer.invitedBy && (
                <View style={styles.inviterBadgeCompact}>
                  <Image source={{ uri: answer.invitedBy.avatar }} style={styles.inviterAvatarCompact} />
                  <Text style={styles.inviterTextCompact}>由 {answer.invitedBy.name} 邀请</Text>
                </View>
              )}

              {/* 仲裁按钮 */}
              {answer.adopted && (
                <TouchableOpacity 
                  style={styles.arbitrationBtnCompact}
                  onPress={() => setShowArbitrationModal(true)}
                >
                  <Ionicons name="gavel-outline" size={12} color="#6b7280" />
                  <Text style={styles.arbitrationBtnTextCompact}>仲裁</Text>
                </TouchableOpacity>
              )}
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

      {/* 仲裁申请弹窗 - 完善版 */}
      <Modal visible={showArbitrationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.arbitrationModal}>
            <View style={styles.arbitrationModalHandle} />
            
            {/* 标题和说明 */}
            <View style={styles.arbitrationModalHeader}>
              <Text style={styles.arbitrationModalTitle}>申请仲裁</Text>
              <Text style={styles.arbitrationModalSubtitle}>
                对已采纳的答案提出异议，邀请专家进行投票裁决
              </Text>
            </View>
            
            <ScrollView style={styles.arbitrationModalContent} showsVerticalScrollIndicator={false}>
              {/* 问题信息卡片 */}
              <View style={styles.arbitrationQuestionCard}>
                <View style={styles.arbitrationQuestionHeader}>
                  <Ionicons name="document-text" size={18} color="#6b7280" />
                  <Text style={styles.arbitrationQuestionTitle}>当前答案</Text>
                </View>
                <View style={styles.arbitrationAnswerInfo}>
                  <Image source={{ uri: answer.avatar }} style={styles.arbitrationAnswerAvatar} />
                  <View style={styles.arbitrationAnswerMeta}>
                    <Text style={styles.arbitrationAnswerAuthor}>{answer.author}</Text>
                    <Text style={styles.arbitrationAnswerTitle}>{answer.title}</Text>
                  </View>
                </View>
                <Text style={styles.arbitrationAnswerPreview} numberOfLines={3}>
                  {answer.content}
                </Text>
              </View>

              {/* 仲裁理由 */}
              <View style={styles.arbitrationSection}>
                <View style={styles.arbitrationSectionHeader}>
                  <Text style={styles.arbitrationLabel}>仲裁理由</Text>
                  <Text style={styles.arbitrationRequired}>*必填</Text>
                </View>
                <TextInput
                  style={styles.arbitrationReasonInput}
                  placeholder="请详细说明申请仲裁的理由，例如：答案存在事实错误、逻辑不严谨、缺少关键信息等..."
                  placeholderTextColor="#9ca3af"
                  value={arbitrationReason}
                  onChangeText={setArbitrationReason}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                <Text style={styles.arbitrationCharCount}>
                  {arbitrationReason.length} / 500 字
                </Text>
              </View>

              {/* 专家邀请 */}
              <View style={styles.arbitrationSection}>
                <View style={styles.arbitrationSectionHeader}>
                  <Text style={styles.arbitrationLabel}>邀请专家</Text>
                  <View style={styles.expertCountBadge}>
                    <Text style={styles.expertCountText}>
                      已选 {selectedExperts.length}/5 位
                    </Text>
                  </View>
                </View>
                <Text style={styles.arbitrationHint}>
                  至少邀请 3 位专家，最多 5 位。超过 50% 专家同意则推翻原答案。
                </Text>
                
                {/* 专家搜索 */}
                <View style={styles.expertSearchBox}>
                  <Ionicons name="search" size={16} color="#9ca3af" />
                  <TextInput
                    style={styles.expertSearchInput}
                    placeholder="搜索专家姓名、职称、领域..."
                    placeholderTextColor="#9ca3af"
                    value={expertSearchText}
                    onChangeText={setExpertSearchText}
                  />
                  {expertSearchText.length > 0 && (
                    <TouchableOpacity onPress={() => setExpertSearchText('')}>
                      <Ionicons name="close-circle" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* 推荐专家标题 */}
                <View style={styles.recommendExpertsHeader}>
                  <Ionicons name="star" size={16} color="#f59e0b" />
                  <Text style={styles.recommendExpertsTitle}>推荐专家</Text>
                  <Text style={styles.recommendExpertsCount}>
                    ({filteredExperts.length} 位)
                  </Text>
                </View>

                {/* 专家列表 */}
                <View style={styles.expertsList}>
                  {filteredExperts.length > 0 ? (
                    filteredExperts.map(expert => (
                      <TouchableOpacity
                        key={expert.id}
                        style={[
                          styles.expertItem,
                          selectedExperts.includes(expert.id) && styles.expertItemSelected
                        ]}
                        onPress={() => toggleExpertSelection(expert.id)}
                        activeOpacity={0.7}
                      >
                        <Image source={{ uri: expert.avatar }} style={styles.expertAvatar} />
                        <View style={styles.expertInfo}>
                          <View style={styles.expertNameRow}>
                            <Text style={styles.expertName}>{expert.name}</Text>
                            {expert.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                          </View>
                          <Text style={styles.expertTitle}>{expert.title}</Text>
                          <View style={styles.expertExpertiseRow}>
                            <Ionicons name="briefcase-outline" size={11} color="#9ca3af" />
                            <Text style={styles.expertExpertise}>{expert.expertise}</Text>
                          </View>
                        </View>
                        <View style={[
                          styles.expertCheckbox,
                          selectedExperts.includes(expert.id) && styles.expertCheckboxSelected
                        ]}>
                          {selectedExperts.includes(expert.id) && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyExpertsList}>
                      <Ionicons name="search-outline" size={32} color="#d1d5db" />
                      <Text style={styles.emptyExpertsText}>未找到匹配的专家</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* 底部操作栏 */}
            <View style={styles.arbitrationModalFooter}>
              <View style={styles.arbitrationFooterInfo}>
                <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                <Text style={styles.arbitrationFooterInfoText}>
                  提交后将通知专家进行投票，预计 24 小时内完成
                </Text>
              </View>
              <View style={styles.arbitrationFooterButtons}>
                <TouchableOpacity
                  style={styles.cancelArbitrationBtn}
                  onPress={() => {
                    setShowArbitrationModal(false);
                    setArbitrationReason('');
                    setSelectedExperts([]);
                    setExpertSearchText('');
                  }}
                >
                  <Text style={styles.cancelArbitrationBtnText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitArbitrationBtn,
                    (!arbitrationReason.trim() || selectedExperts.length < 3) && styles.submitArbitrationBtnDisabled
                  ]}
                  onPress={handleSubmitArbitration}
                  disabled={!arbitrationReason.trim() || selectedExperts.length < 3}
                >
                  <Ionicons name="paper-plane" size={16} color="#fff" />
                  <Text style={styles.submitArbitrationBtnText}>提交申请</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  // 时间和标签合并区域
  answerMetaWithBadges: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  answerMetaLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgesSectionRight: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  // 标签区域样式 - 紧凑版
  badgesSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  adoptedBadgeCompact: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  adoptedBadgeCompactText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  inviterBadgeCompact: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  inviterAvatarCompact: { width: 14, height: 14, borderRadius: 7 },
  inviterTextCompact: { fontSize: 10, color: '#3b82f6', fontWeight: '500' },
  arbitrationBtnCompact: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f9fafb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  arbitrationBtnTextCompact: { fontSize: 10, color: '#6b7280', fontWeight: '500' },
  inviterBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 12, alignSelf: 'flex-start' },
  inviterAvatar: { width: 16, height: 16, borderRadius: 8 },
  inviterText: { fontSize: 12, color: '#3b82f6', fontWeight: '500' },
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
  // 仲裁弹窗样式 - 完善版
  arbitrationModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%', paddingBottom: 0 },
  arbitrationModalHandle: { width: 40, height: 4, backgroundColor: '#d1d5db', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  arbitrationModalHeader: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  arbitrationModalTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937', textAlign: 'center', marginBottom: 6 },
  arbitrationModalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
  arbitrationModalContent: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  
  // 问题信息卡片
  arbitrationQuestionCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  arbitrationQuestionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  arbitrationQuestionTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  arbitrationAnswerInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  arbitrationAnswerAvatar: { width: 32, height: 32, borderRadius: 16 },
  arbitrationAnswerMeta: { flex: 1, marginLeft: 10 },
  arbitrationAnswerAuthor: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 2 },
  arbitrationAnswerTitle: { fontSize: 12, color: '#6b7280' },
  arbitrationAnswerPreview: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  
  // 仲裁区块
  arbitrationSection: { marginBottom: 20 },
  arbitrationSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  arbitrationLabel: { fontSize: 15, fontWeight: '600', color: '#374151' },
  arbitrationRequired: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  arbitrationHint: { fontSize: 12, color: '#9ca3af', marginBottom: 12, lineHeight: 16 },
  arbitrationReasonInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, fontSize: 14, color: '#1f2937', minHeight: 120, textAlignVertical: 'top', marginBottom: 6 },
  arbitrationCharCount: { fontSize: 11, color: '#9ca3af', textAlign: 'right' },
  
  // 专家计数徽章
  expertCountBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  expertCountText: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  
  expertSearchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16 },
  expertSearchInput: { flex: 1, fontSize: 14, color: '#1f2937' },
  recommendExpertsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  recommendExpertsTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
  recommendExpertsCount: { fontSize: 12, color: '#9ca3af' },
  expertsList: { gap: 10 },
  expertItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f9fafb', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  expertItemSelected: { backgroundColor: '#fef2f2', borderColor: '#ef4444', borderWidth: 2 },
  expertAvatar: { width: 44, height: 44, borderRadius: 22 },
  expertInfo: { flex: 1, marginLeft: 12 },
  expertNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  expertName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  expertTitle: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  expertExpertiseRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expertExpertise: { fontSize: 12, color: '#9ca3af' },
  expertCheckbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  expertCheckboxSelected: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  
  // 空状态
  emptyExpertsList: { alignItems: 'center', paddingVertical: 40 },
  emptyExpertsText: { fontSize: 14, color: '#9ca3af', marginTop: 12 },
  
  // 底部操作栏
  arbitrationModalFooter: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff' },
  arbitrationFooterInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fffbeb', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 12 },
  arbitrationFooterInfoText: { flex: 1, fontSize: 12, color: '#92400e', lineHeight: 16 },
  arbitrationFooterButtons: { flexDirection: 'row', gap: 10 },
  submitArbitrationBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 12 },
  submitArbitrationBtnDisabled: { backgroundColor: '#fca5a5', opacity: 0.6 },
  submitArbitrationBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  cancelArbitrationBtn: { flex: 1, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelArbitrationBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '600' },
});
