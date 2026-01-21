import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const answers = [
  { id: 1, author: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', verified: true, adopted: true, title: '资深Python开发 · 10年经验', content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：\n\n1. 学习时间：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线：\n- 第1个月：Python基础语法、数据类型、函数、面向对象\n- 第2个月：常用库（NumPy、Pandas）、数据处理\n- 第3个月：实战项目、数据可视化\n\n3. 推荐资源：廖雪峰的Python教程（免费）、《Python编程从入门到实践》', likes: 256, dislikes: 3, comments: 23, time: '1小时前' },
  { id: 2, author: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', verified: false, adopted: false, title: '数据分析师 · 3年经验', content: '我也是文科转行的，现在在做数据分析。给你几点建议：\n\n1. 不要一开始就啃书，先跟着视频教程敲代码\n2. 多做项目，边学边练\n3. 加入一些学习群，有问题可以随时问', likes: 89, dislikes: 1, comments: 12, time: '30分钟前' },
  { id: 3, author: '编程新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer3', verified: false, adopted: false, title: '学生', content: '同问！我也想学Python，坐等大佬回答~', likes: 5, dislikes: 2, comments: 0, time: '10分钟前' },
];

const answerTabs = ['补充 (4)', '回答 (56)', '评论 (4)', '邀请'];

// 评论数据
const commentsData = [
  { id: 1, author: '技术爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment1', content: '这个问题问得好，我也想知道答案！', likes: 23, time: '2小时前', replies: 3 },
  { id: 2, author: '编程小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment2', content: '同问，坐等大佬回复', likes: 15, time: '1小时前', replies: 1 },
  { id: 3, author: '数据分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment3', content: 'Python确实是入门数据分析的好选择，加油！', likes: 45, time: '30分钟前', replies: 5 },
  { id: 4, author: '前端开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment4', content: '建议先从基础语法开始，不要急于求成', likes: 32, time: '20分钟前', replies: 2 },
];

// 回复数据
const repliesData = {
  1: [
    { id: 101, author: '回复者A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply1', content: '我也是这么想的！', likes: 5, time: '1小时前' },
    { id: 102, author: '回复者B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply2', content: '确实是个好问题', likes: 3, time: '50分钟前' },
    { id: 103, author: '回复者C', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply3', content: '期待大佬解答', likes: 8, time: '40分钟前' },
  ],
  2: [
    { id: 201, author: '回复者D', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply4', content: '一起等', likes: 2, time: '30分钟前' },
  ],
  3: [
    { id: 301, author: '回复者E', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply5', content: '说得对！', likes: 10, time: '25分钟前' },
    { id: 302, author: '回复者F', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply6', content: '我也在学Python', likes: 7, time: '20分钟前' },
    { id: 303, author: '回复者G', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply7', content: '加油加油！', likes: 4, time: '15分钟前' },
    { id: 304, author: '回复者H', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply8', content: '一起进步', likes: 6, time: '10分钟前' },
    { id: 305, author: '回复者I', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply9', content: '有问题可以互相交流', likes: 9, time: '5分钟前' },
  ],
  4: [
    { id: 401, author: '回复者J', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply10', content: '同意这个观点', likes: 12, time: '15分钟前' },
    { id: 402, author: '回复者K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply11', content: '基础很重要', likes: 8, time: '10分钟前' },
  ],
};

// 活动数据
const activitiesData = [
  { id: 1, title: 'Python学习交流会', type: '线上活动', date: '2026-01-20', time: '19:00-21:00', location: '腾讯会议', participants: 45, maxParticipants: 100, organizer: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', status: '报名中' },
  { id: 2, title: 'Python实战项目分享', type: '线下活动', date: '2026-01-25', time: '14:00-17:00', location: '北京市海淀区中关村创业大街', participants: 28, maxParticipants: 50, organizer: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', status: '报名中' },
  { id: 3, title: '数据分析入门讲座', type: '线上活动', date: '2026-01-18', time: '20:00-21:30', location: 'Zoom会议', participants: 120, maxParticipants: 200, organizer: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', status: '即将开始' },
];

// 补充问题数据
const supplementQuestions = [
  { id: 1, author: '学习者小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp1', location: '上海', content: '请问学Python需要先学什么数学基础吗？我高中数学不太好，会不会影响学习？', likes: 45, dislikes: 2, comments: 8, shares: 12, bookmarks: 23 },
  { id: 2, author: '转行程序员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp2', location: '深圳', content: '想问一下，学完Python基础后，做数据分析还需要学哪些工具？比如SQL、Excel这些需要吗？', likes: 32, dislikes: 1, comments: 5, shares: 8, bookmarks: 15 },
  { id: 3, author: '大学生小张', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp3', location: '广州', content: '有没有推荐的Python练手项目？最好是那种能写进简历的', likes: 28, dislikes: 0, comments: 12, shares: 18, bookmarks: 34 },
  { id: 4, author: '职场新人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp4', location: '杭州', content: '自学和报班哪个更好？有没有性价比高的网课推荐？', likes: 19, dislikes: 3, comments: 6, shares: 5, bookmarks: 11 },
];

export default function QuestionDetailScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('回答 (56)');
  const [suppLiked, setSuppLiked] = useState({});
  const [suppDisliked, setSuppDisliked] = useState({});
  const [suppBookmarked, setSuppBookmarked] = useState({});
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '', maxParticipants: '', activityType: '线上活动' });
  const [commentLiked, setCommentLiked] = useState({});
  const [sortFilter, setSortFilter] = useState('精选'); // 精选 or 最新
  const [inviteTab, setInviteTab] = useState('本站'); // 本站, 推特, Facebook
  const [searchLocalUser, setSearchLocalUser] = useState('');
  const [searchTwitterUser, setSearchTwitterUser] = useState('');
  const [searchFacebookUser, setSearchFacebookUser] = useState('');
  const [showSuppMoreModal, setShowSuppMoreModal] = useState(false);
  const [currentSuppId, setCurrentSuppId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentAnswerId, setCurrentAnswerId] = useState(null);
  const [answerLiked, setAnswerLiked] = useState({});
  const [answerDisliked, setAnswerDisliked] = useState({});
  const [answerBookmarked, setAnswerBookmarked] = useState({});
  const [showAnswerCommentListModal, setShowAnswerCommentListModal] = useState(false);
  const [showSuppCommentListModal, setShowSuppCommentListModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [showCommentReplyModal, setShowCommentReplyModal] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false); // 是否已加入团队
  const [showProgressBar, setShowProgressBar] = useState(false); // 是否显示进度条
  const [solvedPercentage, setSolvedPercentage] = useState(65); // 已解决的百分比

  // 当前问题数据
  const currentQuestion = {
    id: route?.params?.id || 1,
    title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？',
    author: '张三丰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
  };

  const handleCreateActivity = () => {
    if (!activityForm.title.trim()) {
      alert('请输入活动标题');
      return;
    }
    if (activityForm.activityType === '线下活动' && !activityForm.location.trim()) {
      alert('线下活动请填写活动地址');
      return;
    }
    alert('活动创建成功！');
    setShowActivityModal(false);
    setActivityForm({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '', maxParticipants: '', activityType: '线上活动' });
  };

  // 检查是否需要打开回答弹窗
  useEffect(() => {
    if (route?.params?.openAnswerModal) {
      setShowAnswerModal(true);
    }
  }, [route?.params?.openAnswerModal]);

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    // 这里可以添加提交回答的逻辑
    alert('回答提交成功！');
    setAnswerText('');
    setShowAnswerModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>问题详情</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => alert('分享功能')}>
            <Ionicons name="arrow-redo-outline" size={22} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowReportModal(true)}>
            <Ionicons name="flag-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 问题内容 */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>
            <View style={styles.rewardTagInline}><Text style={styles.rewardTagText}>$50</Text></View>
            {' '}如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？
          </Text>
          
          {/* 作者信息和操作按钮行 - 紧跟标题 */}
          <View style={styles.authorActionsRow}>
            <View style={styles.authorInfoLeft}>
              <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' }} style={styles.smallAvatar} />
              <View style={styles.authorMetaInfo}>
                <View style={styles.authorNameRow}>
                  <Text style={styles.smallAuthorName}>张三丰</Text>
                  <TouchableOpacity style={styles.followBtnSmall}>
                    <Ionicons name="add" size={12} color="#ef4444" />
                    <Text style={styles.followBtnSmallText}>关注 (1.2k)</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.smallPostTime}>2小时前 · 北京</Text>
              </View>
            </View>
            <View style={styles.actionButtonsRight}>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => setShowInviteModal(true)}>
                <Ionicons name="mail-outline" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('GroupChat', { question: currentQuestion })}>
                <Ionicons name="chatbubbles-outline" size={16} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('TeamDetail', { 
                team: {
                  id: 1,
                  name: currentQuestion.title,
                  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=team1',
                  role: isTeamMember ? '成员' : null,
                  members: 12,
                  questions: 1,
                  description: '围绕这个问题组建的学习团队，一起讨论解决方案',
                  createdAt: '2026-01-20',
                  isActive: true
                }
              })}>
                <Ionicons name="people-circle-outline" size={16} color="#f59e0b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('QuestionActivityList', { questionId: currentQuestion.id, questionTitle: currentQuestion.title })}>
                <Ionicons name="calendar-outline" size={16} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.questionContent}>本人是一名文科生，之前完全没有接触过编程。最近想转行做数据分析，听说Python是必备技能。{'\n\n'}想请教各位大神：{'\n'}1. 零基础学Python需要多长时间？{'\n'}2. 有没有推荐的学习路线或者教程？{'\n'}3. 需要买什么书或者报什么课程吗？</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop' }} style={styles.questionImage} />
          <View style={styles.viewsAndTags}>
            <View style={styles.viewsRow}>
              <Ionicons name="eye-outline" size={14} color="#9ca3af" />
              <Text style={styles.viewsText}>1.2k 浏览</Text>
            </View>
            <View style={styles.topicTags}>
              <Text style={styles.topicTag}>#Python学习</Text>
              <Text style={styles.topicTag}>#编程入门</Text>
              <Text style={styles.topicTag}>#转行</Text>
            </View>
          </View>
          {/* PK进度条 */}
          <View style={styles.pkSection}>
            {!showProgressBar ? (
              // 初始按钮样式
              <View style={styles.pkRow}>
                <View style={styles.pkBarWrapper}>
                  <View style={styles.pkBar}>
                    <TouchableOpacity 
                      style={styles.pkSolvedBar}
                      onPress={() => {
                        setShowProgressBar(true);
                        setSolvedPercentage(65);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pkSolvedText}>已解决</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.pkUnsolvedBar}
                      onPress={() => {
                        setShowProgressBar(true);
                        setSolvedPercentage(35);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pkUnsolvedText}>未解决</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pkCenterBadge}>
                    <Text style={styles.pkCenterText}>PK</Text>
                  </View>
                </View>
              </View>
            ) : (
              // 点击后显示进度条样式
              <View style={styles.pkProgressRow}>
                <View style={styles.progressSolvedLabel}>
                  <Text style={styles.progressLabelText}>已解决</Text>
                </View>
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressSolvedFill, { width: `${solvedPercentage}%` }]} />
                    <View style={[styles.progressUnsolvedFill, { width: `${100 - solvedPercentage}%` }]} />
                  </View>
                  <View style={[styles.progressPercentLabel, { left: `${solvedPercentage}%` }]}>
                    <Text style={styles.progressPercentText}>{solvedPercentage}%</Text>
                  </View>
                </View>
                <View style={styles.progressUnsolvedLabel}>
                  <Text style={styles.progressLabelText}>未解决</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 回答区域 */}
        <View style={styles.answersSection}>
          <View style={styles.answerTabs}>
            {answerTabs.map(tab => (
              <TouchableOpacity key={tab} style={styles.answerTabItem} onPress={() => { setActiveTab(tab); setSortFilter('精选'); }}>
                <Text style={[styles.answerTabText, activeTab === tab && styles.answerTabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.answerTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* 筛选条 - 仅在补充、回答、评论时显示 */}
          <View style={[styles.sortFilterBar, { display: activeTab !== '邀请' ? 'flex' : 'none' }]}>
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
              {activeTab === '补充 (4)' ? '共 4 条补充' : activeTab === '回答 (56)' ? '共 56 条回答' : '共 4 条评论'}
            </Text>
          </View>

          {activeTab === '补充 (4)' ? (
            // 补充问题列表
            <>
              {supplementQuestions.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.suppCard}
                  onPress={() => {
                    console.log('=== 点击补充问题 ===');
                    console.log('补充问题ID:', item.id);
                    console.log('补充问题作者:', item.author);
                    console.log('导航对象存在:', !!navigation);
                    console.log('准备导航到 SupplementDetail');
                    navigation.navigate('SupplementDetail', { supplement: item });
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.suppHeader}>
                    <Image source={{ uri: item.avatar }} style={styles.suppAvatar} />
                    <View style={styles.suppAuthorInfo}>
                      <Text style={styles.suppAuthor}>{item.author}</Text>
                      <View style={styles.suppLocationRow}>
                        <Ionicons name="location-outline" size={12} color="#9ca3af" />
                        <Text style={styles.suppLocation}>{item.location}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.suppAnswerBtnTop} 
                      onPress={(e) => { e.stopPropagation(); navigation.navigate('AnswerDetail'); }}
                    >
                      <Ionicons name="create-outline" size={14} color="#fff" />
                      <Text style={styles.suppAnswerTextTop}>回答 (12)</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.suppContent}>{item.content}</Text>
                  <View style={styles.suppFooter}>
                    <View style={styles.suppFooterLeft}>
                      <TouchableOpacity 
                        style={styles.suppActionBtn} 
                        onPress={(e) => { e.stopPropagation(); setSuppLiked({ ...suppLiked, [item.id]: !suppLiked[item.id] }); }}
                      >
                        <Ionicons name={suppLiked[item.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={suppLiked[item.id] ? "#ef4444" : "#6b7280"} />
                        <Text style={[styles.suppActionText, suppLiked[item.id] && { color: '#ef4444' }]}>{item.likes + (suppLiked[item.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => { e.stopPropagation(); setCurrentSuppId(item.id); setShowSuppCommentListModal(true); }}
                      >
                        <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                        <Text style={styles.suppActionText}>{item.comments}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => e.stopPropagation()}
                      >
                        <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                        <Text style={styles.suppActionText}>{item.shares}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => { e.stopPropagation(); setSuppBookmarked({ ...suppBookmarked, [item.id]: !suppBookmarked[item.id] }); }}
                      >
                        <Ionicons name={suppBookmarked[item.id] ? "bookmark" : "bookmark-outline"} size={16} color={suppBookmarked[item.id] ? "#f59e0b" : "#6b7280"} />
                        <Text style={[styles.suppActionText, suppBookmarked[item.id] && { color: '#f59e0b' }]}>{item.bookmarks + (suppBookmarked[item.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => { e.stopPropagation(); navigation.navigate('GroupChat', { question: { title: '如何在三个月内从零基础学会Python编程？', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', memberCount: 128 } }); }}
                      >
                        <Ionicons name="chatbubbles-outline" size={16} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.suppFooterRight}>
                      <TouchableOpacity 
                        style={styles.suppMoreBtn} 
                        onPress={(e) => { e.stopPropagation(); setCurrentSuppId(item.id); setShowSuppMoreModal(true); }}
                      >
                        <Ionicons key={`more-${item.id}`} name="ellipsis-horizontal-outline" size={20} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.loadMoreBtn}>
                <Text style={styles.loadMoreText}>查看更多补充问题</Text>
                <Ionicons name="chevron-down" size={16} color="#ef4444" />
              </TouchableOpacity>
            </>
          ) : activeTab === '评论 (4)' ? (
            // 评论列表
            <>
              {commentsData.map(comment => (
                <View key={comment.id} style={styles.commentCard}>
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <View style={styles.commentFooter}>
                      <View style={styles.commentFooterLeft}>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                        >
                          <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                          <Text style={[styles.commentActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => { setCurrentCommentId(comment.id); setShowCommentReplyModal(true); }}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.replies} 回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="arrow-redo-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.shares || 5}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="bookmark-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.bookmarks || 8}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.commentFooterRight}>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="thumbs-down-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.dislikes || 2}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="flag-outline" size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.loadMoreBtn}>
                <Text style={styles.loadMoreText}>查看更多评论</Text>
                <Ionicons name="chevron-down" size={16} color="#ef4444" />
              </TouchableOpacity>
            </>
          ) : activeTab === '邀请' ? (
            // 邀请列表 - 二级tab标签
            <View style={styles.inviteContainer}>
              {/* 二级tab标签 */}
              <View style={styles.inviteSubTabs}>
                <TouchableOpacity 
                  style={[styles.inviteSubTabItem, inviteTab === '本站' && styles.inviteSubTabItemActive]}
                  onPress={() => setInviteTab('本站')}
                >
                  <Text style={[styles.inviteSubTabText, inviteTab === '本站' && styles.inviteSubTabTextActive]}>本站</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.inviteSubTabItem, inviteTab === '推特' && styles.inviteSubTabItemActive]}
                  onPress={() => setInviteTab('推特')}
                >
                  <Ionicons name="logo-twitter" size={14} color={inviteTab === '推特' ? '#1DA1F2' : '#9ca3af'} />
                  <Text style={[styles.inviteSubTabText, inviteTab === '推特' && styles.inviteSubTabTextActive]}>推特</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.inviteSubTabItem, inviteTab === 'Facebook' && styles.inviteSubTabItemActive]}
                  onPress={() => setInviteTab('Facebook')}
                >
                  <Ionicons name="logo-facebook" size={14} color={inviteTab === 'Facebook' ? '#4267B2' : '#9ca3af'} />
                  <Text style={[styles.inviteSubTabText, inviteTab === 'Facebook' && styles.inviteSubTabTextActive]}>Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* 搜索框 */}
              <View style={styles.inviteSearchContainer}>
                <View style={styles.inviteSearchBox}>
                  <Ionicons name="search" size={14} color="#9ca3af" />
                  <TextInput
                    style={styles.inviteSearchInput}
                    placeholder={inviteTab === '本站' ? '搜索用户' : inviteTab === '推特' ? '搜索推特用户' : '搜索Facebook用户'}
                    placeholderTextColor="#9ca3af"
                    value={inviteTab === '本站' ? searchLocalUser : inviteTab === '推特' ? searchTwitterUser : searchFacebookUser}
                    onChangeText={(text) => {
                      if (inviteTab === '本站') setSearchLocalUser(text);
                      else if (inviteTab === '推特') setSearchTwitterUser(text);
                      else setSearchFacebookUser(text);
                    }}
                  />
                </View>
              </View>

              {/* 本站用户内容 */}
              {inviteTab === '本站' && (
                <View style={styles.inviteTabContent}>
                  {/* 推荐邀请用户 - 横向滚动 */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View key={`rec-local-${i}`} style={styles.recommendUserCard}>
                        <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=reclocal${i}` }} style={styles.recommendUserAvatar} />
                        <View style={styles.recommendUserTextContainer}>
                          <Text style={styles.recommendUserName} numberOfLines={1}>推荐用户{i}</Text>
                          <Text style={styles.recommendUserDesc} numberOfLines={1}>{i * 20}回答</Text>
                        </View>
                        <TouchableOpacity style={styles.recommendInviteBtn}>
                          <Ionicons name="add" size={12} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  {/* 已邀请用户列表 */}
                  <Text style={styles.invitedListTitle}>已邀请</Text>
                  {[1, 2, 3, 4].map(i => (
                    <View key={`invited-local-${i}`} style={styles.inviteUserCard}>
                      <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=local${i}` }} style={styles.inviteUserAvatar} />
                      <View style={styles.inviteUserInfo}>
                        <Text style={styles.inviteUserName}>用户{i}</Text>
                        <Text style={styles.inviteUserDesc}>Python开发者 · 回答过 {i * 10} 个问题</Text>
                      </View>
                      <View style={styles.invitedTag}>
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text style={styles.invitedTagText}>已邀请</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* 推特用户内容 */}
              {inviteTab === '推特' && (
                <View style={styles.inviteTabContent}>
                  {/* 推荐邀请用户 - 横向滚动 */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View key={`rec-twitter-${i}`} style={styles.recommendUserCard}>
                        <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=rectwitter${i}` }} style={styles.recommendUserAvatar} />
                        <View style={styles.recommendUserTextContainer}>
                          <Text style={styles.recommendUserName} numberOfLines={1}>@user{i}</Text>
                          <Text style={styles.recommendUserDesc} numberOfLines={1}>{i}k粉丝</Text>
                        </View>
                        <TouchableOpacity style={[styles.recommendInviteBtn, styles.recommendInviteBtnTwitter]}>
                          <Ionicons name="logo-twitter" size={12} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  {/* 已邀请用户列表 */}
                  <Text style={styles.invitedListTitle}>已邀请</Text>
                  {[1, 2, 3].map(i => (
                    <View key={`invited-twitter-${i}`} style={styles.inviteUserCard}>
                      <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=twitter${i}` }} style={styles.inviteUserAvatar} />
                      <View style={styles.inviteUserInfo}>
                        <Text style={styles.inviteUserName}>@twitter_user{i}</Text>
                        <Text style={styles.inviteUserDesc}>{i * 1000} 关注者</Text>
                      </View>
                      <View style={styles.invitedTag}>
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text style={styles.invitedTagText}>已邀请</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Facebook用户内容 */}
              {inviteTab === 'Facebook' && (
                <View style={styles.inviteTabContent}>
                  {/* 推荐邀请用户 - 横向滚动 */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View key={`rec-facebook-${i}`} style={styles.recommendUserCard}>
                        <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=recfacebook${i}` }} style={styles.recommendUserAvatar} />
                        <View style={styles.recommendUserTextContainer}>
                          <Text style={styles.recommendUserName} numberOfLines={1}>FB User{i}</Text>
                          <Text style={styles.recommendUserDesc} numberOfLines={1}>{i * 500}好友</Text>
                        </View>
                        <TouchableOpacity style={[styles.recommendInviteBtn, styles.recommendInviteBtnFacebook]}>
                          <Ionicons name="logo-facebook" size={12} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  {/* 已邀请用户列表 */}
                  <Text style={styles.invitedListTitle}>已邀请</Text>
                  {[1, 2, 3].map(i => (
                    <View key={`invited-facebook-${i}`} style={styles.inviteUserCard}>
                      <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=facebook${i}` }} style={styles.inviteUserAvatar} />
                      <View style={styles.inviteUserInfo}>
                        <Text style={styles.inviteUserName}>Facebook User {i}</Text>
                        <Text style={styles.inviteUserDesc}>{i * 500} 好友</Text>
                      </View>
                      <View style={styles.invitedTag}>
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text style={styles.invitedTagText}>已邀请</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            // 回答列表
            <>
              {answers.map(answer => (
            <TouchableOpacity key={answer.id} style={[styles.answerCard, answer.adopted && styles.answerCardAdopted]} onPress={() => navigation.navigate('AnswerDetail', { answer })}>
              <View style={styles.answerHeader}>
                <Image source={{ uri: answer.avatar }} style={styles.answerAvatar} />
                <View style={styles.answerAuthorInfo}>
                  <View style={styles.answerAuthorRow}>
                    <Text style={styles.answerAuthor}>{answer.author}</Text>
                    {answer.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                  </View>
                  <Text style={styles.answerAuthorTitle}>{answer.title}</Text>
                </View>
                <TouchableOpacity style={styles.answerSupplementBtnTop} onPress={(e) => e.stopPropagation()}>
                  <Ionicons name="add-circle-outline" size={14} color="#fff" />
                  <Text style={styles.answerSupplementTextTop}>补充回答 (2)</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.answerContent}>{answer.content}</Text>
              <View style={styles.answerFooter}>
                <View style={styles.answerFooterLeft}>
                  <TouchableOpacity 
                    style={styles.answerActionBtn} 
                    onPress={(e) => { e.stopPropagation(); setAnswerLiked({ ...answerLiked, [answer.id]: !answerLiked[answer.id] }); }}
                  >
                    <Ionicons name={answerLiked[answer.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={answerLiked[answer.id] ? "#ef4444" : "#6b7280"} />
                    <Text style={[styles.answerActionText, answerLiked[answer.id] && { color: '#ef4444' }]}>{answer.likes + (answerLiked[answer.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerActionBtn} 
                    onPress={(e) => { e.stopPropagation(); setCurrentAnswerId(answer.id); setShowAnswerCommentListModal(true); }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                    <Text style={styles.answerActionText}>{answer.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerActionBtn} onPress={(e) => e.stopPropagation()}>
                    <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                    <Text style={styles.answerActionText}>34</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerActionBtn}
                    onPress={(e) => { e.stopPropagation(); setAnswerBookmarked({ ...answerBookmarked, [answer.id]: !answerBookmarked[answer.id] }); }}
                  >
                    <Ionicons name={answerBookmarked[answer.id] ? "bookmark" : "bookmark-outline"} size={16} color={answerBookmarked[answer.id] ? "#f59e0b" : "#6b7280"} />
                    <Text style={[styles.answerActionText, answerBookmarked[answer.id] && { color: '#f59e0b' }]}>89</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.answerFooterRight}>
                  <TouchableOpacity 
                    style={styles.answerActionBtn} 
                    onPress={(e) => { e.stopPropagation(); setAnswerDisliked({ ...answerDisliked, [answer.id]: !answerDisliked[answer.id] }); }}
                  >
                    <Ionicons name={answerDisliked[answer.id] ? "thumbs-down" : "thumbs-down-outline"} size={16} color={answerDisliked[answer.id] ? "#3b82f6" : "#6b7280"} />
                    <Text style={[styles.answerActionText, answerDisliked[answer.id] && { color: '#3b82f6' }]}>{answer.dislikes || 3}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerActionBtn} onPress={(e) => e.stopPropagation()}>
                    <Ionicons name="flag-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.loadMoreBtn}><Text style={styles.loadMoreText}>查看更多回答</Text><Ionicons name="chevron-down" size={16} color="#ef4444" /></TouchableOpacity>
            </>
          )}
        </View>

        {/* 推荐相关问题 */}
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedHeader}>
            <View style={styles.recommendedHeaderLeft}>
              <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
              <Text style={styles.recommendedTitle}>相关推荐</Text>
            </View>
            <Text style={styles.recommendedSubtitle}>继续浏览更多精彩内容</Text>
          </View>

          {/* 推荐问题卡片 */}
          <TouchableOpacity 
            style={styles.recommendedQuestionCard}
            onPress={() => navigation.push('QuestionDetail', { id: 2 })}
            activeOpacity={0.95}
          >
            <Text style={styles.recommendedQuestionTitle}>
              <View style={styles.rewardTagInline}>
                <Text style={styles.rewardTagText}>$30</Text>
              </View>
              {' '}
              <View style={styles.recommendedHotTagInline}>
                <Ionicons name="flame" size={10} color="#ef4444" />
                <Text style={styles.recommendedHotTextInline}>热门</Text>
              </View>
              {' '}React Native开发中如何优化长列表性能？FlatList和ScrollView该如何选择？
            </Text>
            
            <Text style={styles.recommendedQuestionContent} numberOfLines={3}>
              我在开发一个新闻类APP，列表有上千条数据，使用ScrollView会很卡顿。听说FlatList性能更好，但不知道具体该怎么优化。请问有经验的开发者能分享一下最佳实践吗？
            </Text>

            <View style={styles.recommendedQuestionMeta}>
              <View style={styles.recommendedAuthorInfo}>
                <Image 
                  source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' }} 
                  style={styles.recommendedAuthorAvatar} 
                />
                <Text style={styles.recommendedAuthorName}>前端小白</Text>
                <Text style={styles.recommendedQuestionTime}>· 3小时前</Text>
              </View>
              <View style={styles.recommendedQuestionStats}>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>89</Text>
                </View>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="eye-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>2.3k</Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendedTopicTags}>
              <Text style={styles.recommendedTopicTag}>#ReactNative</Text>
              <Text style={styles.recommendedTopicTag}>#性能优化</Text>
              <Text style={styles.recommendedTopicTag}>#移动开发</Text>
            </View>
          </TouchableOpacity>

          {/* 第二个推荐问题 */}
          <TouchableOpacity 
            style={styles.recommendedQuestionCard}
            onPress={() => navigation.push('QuestionDetail', { id: 3 })}
            activeOpacity={0.95}
          >
            <Text style={styles.recommendedQuestionTitle}>
              <View style={styles.rewardTagInline}>
                <Text style={styles.rewardTagText}>$20</Text>
              </View>
              {' '}如何系统学习JavaScript？从入门到精通需要掌握哪些核心知识点？
            </Text>
            
            <Text style={styles.recommendedQuestionContent} numberOfLines={3}>
              想转行做前端开发，JavaScript是必备技能。但是网上资料太多太杂，不知道该从哪里开始学。希望有经验的前辈能给一个系统的学习路线图。
            </Text>

            <View style={styles.recommendedQuestionMeta}>
              <View style={styles.recommendedAuthorInfo}>
                <Image 
                  source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3' }} 
                  style={styles.recommendedAuthorAvatar} 
                />
                <Text style={styles.recommendedAuthorName}>转行者</Text>
                <Text style={styles.recommendedQuestionTime}>· 5小时前</Text>
              </View>
              <View style={styles.recommendedQuestionStats}>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>156</Text>
                </View>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="eye-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>4.5k</Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendedTopicTags}>
              <Text style={styles.recommendedTopicTag}>#JavaScript</Text>
              <Text style={styles.recommendedTopicTag}>#前端开发</Text>
              <Text style={styles.recommendedTopicTag}>#学习路线</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 底部固定栏 - 主要互动按钮 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setLiked({ ...liked, main: !liked.main })}>
          <Ionicons name={liked.main ? "thumbs-up" : "thumbs-up-outline"} size={20} color={liked.main ? "#ef4444" : "#6b7280"} />
          <Text style={[styles.bottomActionText, liked.main && { color: '#ef4444' }]}>128</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={20} color={bookmarked ? "#f59e0b" : "#6b7280"} />
          <Text style={[styles.bottomActionText, bookmarked && { color: '#f59e0b' }]}>89</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn}>
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text style={styles.bottomActionText}>评论</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setShowAnswerModal(true)}>
          <Ionicons name="create-outline" size={20} color="#ef4444" />
          <Text style={[styles.bottomActionText, { color: '#ef4444' }]}>回答</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn}>
          <Ionicons name="add-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.bottomActionText}>补充</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setLiked({ ...liked, dislike: !liked.dislike })}>
          <Ionicons name={liked.dislike ? "thumbs-down" : "thumbs-down-outline"} size={20} color={liked.dislike ? "#6b7280" : "#9ca3af"} />
          <Text style={[styles.bottomActionText, liked.dislike && { color: '#6b7280' }]}>12</Text>
        </TouchableOpacity>
      </View>

      {/* 更多操作弹窗 */}
      <Modal visible={showActionModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionModal(false)}>
          <View style={styles.moreActionModal}>
            <View style={styles.moreActionModalHandle} />
            
            {/* 纵向操作按钮 */}
            <View style={styles.actionListSection}>
              <TouchableOpacity style={styles.moreActionItem}>
                <Ionicons name="thumbs-down-outline" size={22} color="#6b7280" />
                <Text style={styles.moreActionItemText}>踩一下 (12)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreActionItem} onPress={() => { setShowActionModal(false); setShowReportModal(true); }}>
                <Ionicons name="flag-outline" size={22} color="#ef4444" />
                <Text style={[styles.moreActionItemText, { color: '#ef4444' }]}>举报</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.moreActionCancelBtn} onPress={() => setShowActionModal(false)}>
              <Text style={styles.moreActionCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 举报弹窗 */}
      <Modal visible={showReportModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowReportModal(false)}>
          <View style={styles.reportModal}>
            <View style={styles.reportModalHandle} />
            <Text style={styles.reportModalTitle}>举报问题</Text>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：垃圾广告'); }}>
              <Text style={styles.reportItemText}>垃圾广告</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：违法违规'); }}>
              <Text style={styles.reportItemText}>违法违规</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：低俗色情'); }}>
              <Text style={styles.reportItemText}>低俗色情</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：侵权'); }}>
              <Text style={styles.reportItemText}>侵权</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：不实信息'); }}>
              <Text style={styles.reportItemText}>不实信息</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：其他'); }}>
              <Text style={styles.reportItemText}>其他</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCancelBtn} onPress={() => setShowReportModal(false)}>
              <Text style={styles.reportCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 补充问题评论列表弹窗 */}
      <Modal visible={showSuppCommentListModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSuppCommentListModal(false)}>
          <View style={styles.commentListModal}>
            <View style={styles.commentListModalHandle} />
            <View style={styles.commentListModalHeader}>
              <Text style={styles.commentListModalTitle}>全部评论</Text>
              <TouchableOpacity onPress={() => setShowSuppCommentListModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentListScroll} showsVerticalScrollIndicator={false}>
              {commentsData.map(comment => (
                <View key={comment.id}>
                  <View style={styles.commentListCard}>
                    <Image source={{ uri: comment.avatar }} style={styles.commentListAvatar} />
                    <View style={styles.commentListContent}>
                      <View style={styles.commentListHeader}>
                        <Text style={styles.commentListAuthor}>{comment.author}</Text>
                        <Text style={styles.commentListTime}>{comment.time}</Text>
                      </View>
                      <Text style={styles.commentListText}>{comment.content}</Text>
                      <View style={styles.commentListActions}>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                        >
                          <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                          <Text style={[styles.commentListActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setExpandedComments({ ...expandedComments, [comment.id]: !expandedComments[comment.id] })}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentListActionText}>{comment.replies} 回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentListActionBtn}>
                          <Text style={styles.commentListReplyBtn}>回复</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  {/* 回复列表 */}
                  {expandedComments[comment.id] && repliesData[comment.id] && (
                    <View style={styles.repliesContainer}>
                      {repliesData[comment.id].map(reply => (
                        <View key={reply.id} style={styles.replyCard}>
                          <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                          <View style={styles.replyContent}>
                            <View style={styles.replyHeader}>
                              <Text style={styles.replyAuthor}>{reply.author}</Text>
                              <Text style={styles.replyTime}>{reply.time}</Text>
                            </View>
                            <Text style={styles.replyText}>{reply.content}</Text>
                            <View style={styles.replyActions}>
                              <TouchableOpacity style={styles.replyActionBtn}>
                                <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                                <Text style={styles.replyActionText}>{reply.likes}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.replyActionBtn}>
                                <Text style={styles.replyReplyBtn}>回复</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentListBottomBar}>
              <TouchableOpacity 
                style={styles.commentListWriteBtn} 
                onPress={() => { setShowSuppCommentListModal(false); setShowCommentModal(true); }}
              >
                <Ionicons name="create-outline" size={18} color="#6b7280" />
                <Text style={styles.commentListWriteText}>写评论...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 补充问题更多操作弹窗 */}
      <Modal visible={showSuppMoreModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSuppMoreModal(false)}>
          <View style={styles.suppMoreModal}>
            <View style={styles.suppMoreModalHandle} />
            
            <View style={styles.suppMoreActionList}>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
                <Text style={styles.suppMoreActionText}>@推特用户</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="logo-facebook" size={22} color="#4267B2" />
                <Text style={styles.suppMoreActionText}>@Facebook用户</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="thumbs-down-outline" size={22} color="#6b7280" />
                <Text style={styles.suppMoreActionText}>踩一下 (12)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="flag-outline" size={22} color="#ef4444" />
                <Text style={[styles.suppMoreActionText, { color: '#ef4444' }]}>举报</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.suppMoreCancelBtn} onPress={() => setShowSuppMoreModal(false)}>
              <Text style={styles.suppMoreCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 评论弹窗 */}
      <Modal visible={showCommentModal} animationType="slide">
        <SafeAreaView style={styles.commentModal}>
          <View style={styles.commentModalHeader}>
            <TouchableOpacity onPress={() => { setShowCommentModal(false); setCommentText(''); }} style={styles.commentCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.commentHeaderCenter}>
              <Text style={styles.commentModalTitle}>写评论</Text>
            </View>
            <TouchableOpacity 
              style={[styles.commentPublishBtn, !commentText.trim() && styles.commentPublishBtnDisabled]}
              onPress={() => {
                if (commentText.trim()) {
                  alert('评论发布成功！');
                  setCommentText('');
                  setShowCommentModal(false);
                }
              }}
              disabled={!commentText.trim()}
            >
              <Text style={[styles.commentPublishText, !commentText.trim() && styles.commentPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentContentArea} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.commentTextInput}
              placeholder="写下你的评论..."
              placeholderTextColor="#bbb"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.commentToolbar}>
            <View style={styles.commentToolsLeft}>
              <TouchableOpacity style={styles.commentToolItem}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentToolItem}>
                <Ionicons name="at-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentToolItem}>
                <Ionicons name="happy-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.commentWordCount}>{commentText.length}/500</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 评论回复列表弹窗 */}
      <Modal visible={showCommentReplyModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCommentReplyModal(false)}>
          <View style={styles.commentListModal}>
            <View style={styles.commentListModalHandle} />
            <View style={styles.commentListModalHeader}>
              <Text style={styles.commentListModalTitle}>全部回复</Text>
              <TouchableOpacity onPress={() => setShowCommentReplyModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentListScroll} showsVerticalScrollIndicator={false}>
              {currentCommentId && repliesData[currentCommentId] && repliesData[currentCommentId].map(reply => (
                <View key={reply.id} style={styles.replyCard}>
                  <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                  <View style={styles.replyContent}>
                    <View style={styles.replyHeader}>
                      <Text style={styles.replyAuthor}>{reply.author}</Text>
                      <Text style={styles.replyTime}>{reply.time}</Text>
                    </View>
                    <Text style={styles.replyText}>{reply.content}</Text>
                    <View style={styles.replyActions}>
                      <TouchableOpacity style={styles.replyActionBtn}>
                        <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                        <Text style={styles.replyActionText}>{reply.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.replyActionBtn}>
                        <Text style={styles.replyReplyBtn}>回复</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentListBottomBar}>
              <TouchableOpacity 
                style={styles.commentListWriteBtn} 
                onPress={() => { setShowCommentReplyModal(false); setShowCommentModal(true); }}
              >
                <Ionicons name="create-outline" size={18} color="#6b7280" />
                <Text style={styles.commentListWriteText}>写回复...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 编写回答弹窗 - 今日头条风格 */}
      <Modal visible={showAnswerModal} animationType="slide">
        <SafeAreaView style={styles.answerModal}>
          <View style={styles.answerModalHeader}>
            <TouchableOpacity onPress={() => setShowAnswerModal(false)} style={styles.answerCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.answerHeaderCenter}>
              <Text style={styles.answerModalTitle}>写回答</Text>
            </View>
            <TouchableOpacity 
              style={[styles.answerPublishBtn, !answerText.trim() && styles.answerPublishBtnDisabled]}
              onPress={handleSubmitAnswer}
              disabled={!answerText.trim()}
            >
              <Text style={[styles.answerPublishText, !answerText.trim() && styles.answerPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.answerQuestionCard}>
            <View style={styles.answerQuestionIcon}>
              <Ionicons name="help-circle" size={20} color="#ef4444" />
            </View>
            <Text style={styles.answerQuestionText} numberOfLines={2}>如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？</Text>
          </View>

          <ScrollView style={styles.answerContentArea} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.answerTextInput}
              placeholder="写下你的回答，帮助有需要的人..."
              placeholderTextColor="#bbb"
              value={answerText}
              onChangeText={setAnswerText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.answerToolbar}>
            <View style={styles.answerToolsLeft}>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="videocam-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="at-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="pricetag-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.answerWordCount}>{answerText.length}/2000</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 回答评论列表弹窗 */}
      <Modal visible={showAnswerCommentListModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnswerCommentListModal(false)}>
          <View style={styles.commentListModal}>
            <View style={styles.commentListModalHandle} />
            <View style={styles.commentListModalHeader}>
              <Text style={styles.commentListModalTitle}>全部评论</Text>
              <TouchableOpacity onPress={() => setShowAnswerCommentListModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentListScroll} showsVerticalScrollIndicator={false}>
              {commentsData.map(comment => (
                <View key={comment.id}>
                  <View style={styles.commentListCard}>
                    <Image source={{ uri: comment.avatar }} style={styles.commentListAvatar} />
                    <View style={styles.commentListContent}>
                      <View style={styles.commentListHeader}>
                        <Text style={styles.commentListAuthor}>{comment.author}</Text>
                        <Text style={styles.commentListTime}>{comment.time}</Text>
                      </View>
                      <Text style={styles.commentListText}>{comment.content}</Text>
                      <View style={styles.commentListActions}>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                        >
                          <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                          <Text style={[styles.commentListActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setExpandedComments({ ...expandedComments, [comment.id]: !expandedComments[comment.id] })}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentListActionText}>{comment.replies} 回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentListActionBtn}>
                          <Text style={styles.commentListReplyBtn}>回复</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  {/* 回复列表 */}
                  {expandedComments[comment.id] && repliesData[comment.id] && (
                    <View style={styles.repliesContainer}>
                      {repliesData[comment.id].map(reply => (
                        <View key={reply.id} style={styles.replyCard}>
                          <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                          <View style={styles.replyContent}>
                            <View style={styles.replyHeader}>
                              <Text style={styles.replyAuthor}>{reply.author}</Text>
                              <Text style={styles.replyTime}>{reply.time}</Text>
                            </View>
                            <Text style={styles.replyText}>{reply.content}</Text>
                            <View style={styles.replyActions}>
                              <TouchableOpacity style={styles.replyActionBtn}>
                                <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                                <Text style={styles.replyActionText}>{reply.likes}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.replyActionBtn}>
                                <Text style={styles.replyReplyBtn}>回复</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentListBottomBar}>
              <TouchableOpacity 
                style={styles.commentListWriteBtn} 
                onPress={() => { setShowAnswerCommentListModal(false); setShowCommentModal(true); }}
              >
                <Ionicons name="create-outline" size={18} color="#6b7280" />
                <Text style={styles.commentListWriteText}>写评论...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 邀请回答弹窗 */}
      <Modal visible={showInviteModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowInviteModal(false)}>
          <View style={styles.inviteModal} onStartShouldSetResponder={() => true}>
            <View style={styles.inviteModalHandle} />
            <Text style={styles.inviteModalTitle}>邀请回答</Text>
            
            {/* 平台选择标签 */}
            <View style={styles.invitePlatformTabs}>
              <TouchableOpacity 
                style={[styles.invitePlatformTab, inviteTab === '本站' && styles.invitePlatformTabActive]}
                onPress={() => setInviteTab('本站')}
              >
                <Text style={[styles.invitePlatformTabText, inviteTab === '本站' && styles.invitePlatformTabTextActive]}>本站</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.invitePlatformTab, inviteTab === 'Facebook' && styles.invitePlatformTabActive]}
                onPress={() => setInviteTab('Facebook')}
              >
                <Ionicons name="logo-facebook" size={16} color={inviteTab === 'Facebook' ? '#4267B2' : '#9ca3af'} />
                <Text style={[styles.invitePlatformTabText, inviteTab === 'Facebook' && styles.invitePlatformTabTextActive]}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.invitePlatformTab, inviteTab === '推特' && styles.invitePlatformTabActive]}
                onPress={() => setInviteTab('推特')}
              >
                <Ionicons name="logo-twitter" size={16} color={inviteTab === '推特' ? '#1DA1F2' : '#9ca3af'} />
                <Text style={[styles.invitePlatformTabText, inviteTab === '推特' && styles.invitePlatformTabTextActive]}>推特</Text>
              </TouchableOpacity>
            </View>

            {/* 搜索框 */}
            <View style={styles.inviteSearchContainer}>
              <View style={styles.inviteSearchBox}>
                <Ionicons name="search" size={18} color="#9ca3af" />
                <TextInput
                  style={styles.inviteSearchInput}
                  placeholder={inviteTab === '本站' ? '搜索用户' : inviteTab === 'Facebook' ? '搜索Facebook用户' : '搜索推特用户'}
                  placeholderTextColor="#9ca3af"
                  value={inviteTab === '本站' ? searchLocalUser : inviteTab === 'Facebook' ? searchFacebookUser : searchTwitterUser}
                  onChangeText={(text) => {
                    if (inviteTab === '本站') setSearchLocalUser(text);
                    else if (inviteTab === 'Facebook') setSearchFacebookUser(text);
                    else setSearchTwitterUser(text);
                  }}
                />
              </View>
            </View>

            {/* 用户列表 */}
            <ScrollView style={styles.inviteUserList} showsVerticalScrollIndicator={false}>
              {inviteTab === '本站' && [1, 2, 3, 4, 5].map(i => (
                <View key={`local-${i}`} style={styles.inviteUserItem}>
                  <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=invite${i}` }} style={styles.inviteUserAvatar} />
                  <View style={styles.inviteUserInfo}>
                    <Text style={styles.inviteUserName}>用户{i}</Text>
                    <Text style={styles.inviteUserDesc}>Python开发者 · {i * 10}个回答</Text>
                  </View>
                  <TouchableOpacity style={styles.inviteUserBtn} onPress={() => alert(`已邀请用户${i}`)}>
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={styles.inviteUserBtnText}>邀请</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {inviteTab === 'Facebook' && [1, 2, 3, 4, 5].map(i => (
                <View key={`fb-${i}`} style={styles.inviteUserItem}>
                  <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=fb${i}` }} style={styles.inviteUserAvatar} />
                  <View style={styles.inviteUserInfo}>
                    <Text style={styles.inviteUserName}>Facebook User {i}</Text>
                    <Text style={styles.inviteUserDesc}>{i * 500} 好友</Text>
                  </View>
                  <TouchableOpacity style={[styles.inviteUserBtn, styles.inviteUserBtnFacebook]} onPress={() => alert(`已邀请Facebook用户${i}`)}>
                    <Ionicons name="logo-facebook" size={16} color="#fff" />
                    <Text style={styles.inviteUserBtnText}>邀请</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {inviteTab === '推特' && [1, 2, 3, 4, 5].map(i => (
                <View key={`tw-${i}`} style={styles.inviteUserItem}>
                  <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=tw${i}` }} style={styles.inviteUserAvatar} />
                  <View style={styles.inviteUserInfo}>
                    <Text style={styles.inviteUserName}>@twitter_user{i}</Text>
                    <Text style={styles.inviteUserDesc}>{i}k 关注者</Text>
                  </View>
                  <TouchableOpacity style={[styles.inviteUserBtn, styles.inviteUserBtnTwitter]} onPress={() => alert(`已邀请推特用户${i}`)}>
                    <Ionicons name="logo-twitter" size={16} color="#fff" />
                    <Text style={styles.inviteUserBtnText}>邀请</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 发起活动弹窗 */}
      <Modal visible={showActivityModal} animationType="slide">
        <SafeAreaView style={styles.activityModal}>
          <View style={styles.activityModalHeader}>
            <TouchableOpacity onPress={() => setShowActivityModal(false)} style={styles.activityCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.activityHeaderCenter}>
              <Text style={styles.activityModalTitle}>发起活动</Text>
            </View>
            <TouchableOpacity 
              style={[styles.activityPublishBtn, !activityForm.title.trim() && styles.activityPublishBtnDisabled]}
              onPress={handleCreateActivity}
              disabled={!activityForm.title.trim()}
            >
              <Text style={[styles.activityPublishText, !activityForm.title.trim() && styles.activityPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          {/* 绑定问题显示 */}
          <View style={styles.boundQuestionCard}>
            <View style={styles.boundQuestionHeader}>
              <Ionicons name="link" size={16} color="#22c55e" />
              <Text style={styles.boundQuestionLabel}>绑定问题</Text>
            </View>
            <Text style={styles.boundQuestionText} numberOfLines={2}>{currentQuestion.title}</Text>
          </View>

          <ScrollView style={styles.activityFormArea} keyboardShouldPersistTaps="handled">
            {/* 活动类型选择 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>活动类型 *</Text>
              <View style={styles.activityTypeSelector}>
                <TouchableOpacity 
                  style={[styles.activityTypeSelectorBtn, activityForm.activityType === '线上活动' && styles.activityTypeSelectorBtnActive]}
                  onPress={() => setActivityForm({...activityForm, activityType: '线上活动'})}
                >
                  <Ionicons name="videocam" size={18} color={activityForm.activityType === '线上活动' ? '#fff' : '#6b7280'} />
                  <Text style={[styles.activityTypeSelectorText, activityForm.activityType === '线上活动' && styles.activityTypeSelectorTextActive]}>线上活动</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.activityTypeSelectorBtn, activityForm.activityType === '线下活动' && styles.activityTypeSelectorBtnActive]}
                  onPress={() => setActivityForm({...activityForm, activityType: '线下活动'})}
                >
                  <Ionicons name="location" size={18} color={activityForm.activityType === '线下活动' ? '#fff' : '#6b7280'} />
                  <Text style={[styles.activityTypeSelectorText, activityForm.activityType === '线下活动' && styles.activityTypeSelectorTextActive]}>线下活动</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>活动标题 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入活动标题"
                placeholderTextColor="#bbb"
                value={activityForm.title}
                onChangeText={(text) => setActivityForm({...activityForm, title: text})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>活动描述</Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                placeholder="请输入活动描述..."
                placeholderTextColor="#bbb"
                value={activityForm.description}
                onChangeText={(text) => setActivityForm({...activityForm, description: text})}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* 开始日期时间 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>开始时间</Text>
              <View style={styles.formRow}>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginRight: 8 }]}>
                  <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.startDate || '选择日期'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginLeft: 8 }]}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.startTime || '选择时间'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 结束日期时间 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>结束时间</Text>
              <View style={styles.formRow}>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginRight: 8 }]}>
                  <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.endDate || '选择日期'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginLeft: 8 }]}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.endTime || '选择时间'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 活动地址 - 仅线下活动显示 */}
            <View style={[styles.formGroup, { display: activityForm.activityType === '线下活动' ? 'flex' : 'none' }]}>
              <Text style={styles.formLabel}>
                活动地址 <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              <View style={styles.formInputWithIcon}>
                <Ionicons name="location-outline" size={18} color="#6b7280" />
                <TextInput
                  style={styles.formInputInner}
                  placeholder="请输入详细地址（必填）"
                  placeholderTextColor="#bbb"
                  value={activityForm.location}
                  onChangeText={(text) => setActivityForm({...activityForm, location: text})}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>人数上限</Text>
              <View style={styles.formInputWithIcon}>
                <Ionicons name="people-outline" size={18} color="#6b7280" />
                <TextInput
                  style={styles.formInputInner}
                  placeholder="不限"
                  placeholderTextColor="#bbb"
                  value={activityForm.maxParticipants}
                  onChangeText={(text) => setActivityForm({...activityForm, maxParticipants: text})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  shareBtnText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  content: { flex: 1 },
  questionSection: { backgroundColor: '#fff', padding: 16 },
  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', lineHeight: 26, marginBottom: 8 },
  rewardTagInline: { backgroundColor: '#ef4444', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  rewardTagText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  questionContent: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginTop: 12, marginBottom: 12 },
  questionImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12 },
  viewsAndTags: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  viewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewsText: { fontSize: 12, color: '#9ca3af' },
  topicTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicTag: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  // 作者信息和操作按钮行
  authorActionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 12 },
  authorInfoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  smallAvatar: { width: 32, height: 32, borderRadius: 16 },
  authorMetaInfo: { marginLeft: 8, flex: 1 },
  authorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallAuthorName: { fontSize: 13, fontWeight: '500', color: '#1f2937' },
  followBtnSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, gap: 2 },
  followBtnSmallText: { fontSize: 10, color: '#ef4444', fontWeight: '500' },
  smallPostTime: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  actionButtonsRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  pkSection: { marginTop: 12, marginBottom: 12 },
  pkRow: { flexDirection: 'row', alignItems: 'center' },
  pkBarWrapper: { flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  pkBar: { flexDirection: 'row', height: 36, borderRadius: 18, overflow: 'hidden', width: '100%' },
  pkSolvedBar: { backgroundColor: '#3b82f6', flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 15 },
  pkUnsolvedBar: { backgroundColor: '#ef4444', flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 15 },
  pkSolvedText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  pkUnsolvedText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  pkCenterBadge: { position: 'absolute', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  pkCenterText: { fontSize: 12, color: '#ef4444', fontWeight: '700' },
  // 进度条样式
  pkProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressSolvedLabel: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe' },
  progressUnsolvedLabel: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca' },
  progressLabelText: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  progressBarWrapper: { flex: 1, position: 'relative' },
  progressBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  progressSolvedFill: { backgroundColor: '#3b82f6', height: '100%' },
  progressUnsolvedFill: { backgroundColor: '#ef4444', height: '100%' },
  progressPercentLabel: { position: 'absolute', top: -18, transform: [{ translateX: -12 }] },
  progressPercentText: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  // 底部固定栏样式
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  bottomActionBtn: { flexDirection: 'column', alignItems: 'center', gap: 4 },
  bottomActionText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  answersSection: { marginTop: 8, backgroundColor: '#fff' },
  answerTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerTabItem: { flex: 1, paddingVertical: 12, position: 'relative', alignItems: 'center' },
  answerTabText: { fontSize: 14, color: '#6b7280' },
  answerTabTextActive: { color: '#ef4444', fontWeight: '600' },
  answerTabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  // 筛选条样式
  sortFilterBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sortFilterLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  sortFilterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  sortFilterBtnActive: { backgroundColor: '#fef2f2' },
  sortFilterText: { fontSize: 13, color: '#9ca3af' },
  sortFilterTextActive: { color: '#ef4444', fontWeight: '500' },
  sortFilterCount: { fontSize: 12, color: '#9ca3af' },
  answerCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerCardAdopted: { backgroundColor: '#fef2f210' },
  answerHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  answerAvatar: { width: 40, height: 40, borderRadius: 20 },
  answerAuthorInfo: { flex: 1, marginLeft: 12 },
  answerAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answerAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  adoptedTag: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  adoptedTagText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  answerAuthorTitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  answerSupplementBtnTop: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  answerSupplementTextTop: { fontSize: 12, color: '#fff', fontWeight: '600' },
  answerContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  answerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  answerFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  answerFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  answerActions: { flexDirection: 'row', gap: 20 },
  answerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerActionText: { fontSize: 13, color: '#6b7280' },
  answerSupplementBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  answerSupplementText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  answerCommentBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  answerCommentText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  answerMoreBtn: { padding: 6 },
  answerTime: { fontSize: 12, color: '#9ca3af' },
  loadMoreBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 4 },
  loadMoreText: { fontSize: 14, color: '#ef4444' },
  // 补充问题样式
  suppCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  suppHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  suppAvatar: { width: 40, height: 40, borderRadius: 20 },
  suppAuthorInfo: { flex: 1, marginLeft: 12 },
  suppAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  suppLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 2 },
  suppLocation: { fontSize: 12, color: '#9ca3af' },
  suppAnswerBtnTop: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  suppAnswerTextTop: { fontSize: 11, color: '#fff', fontWeight: '500' },
  suppContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  suppFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  suppFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  suppFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  suppActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suppActionText: { fontSize: 13, color: '#6b7280' },
  suppAnswerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  suppAnswerText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  suppCommentBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  suppCommentText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  suppMoreBtn: { padding: 6 },
  // 补充问题更多弹窗
  suppMoreModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  suppMoreModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  suppMoreActionList: { paddingTop: 8 },
  suppMoreActionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  suppMoreActionText: { fontSize: 15, color: '#1f2937', marginLeft: 14 },
  suppMoreCancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  suppMoreCancelText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 更多操作弹窗样式
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  moreActionModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  moreActionModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  actionListSection: { paddingTop: 8 },
  moreActionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  moreActionItemText: { fontSize: 15, color: '#1f2937', marginLeft: 14 },
  moreActionCancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  moreActionCancelText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 评论弹窗样式
  commentModal: { flex: 1, backgroundColor: '#fff' },
  commentModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  commentCloseBtn: { padding: 4, zIndex: 10 },
  commentHeaderCenter: { flex: 1, alignItems: 'center' },
  commentModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  commentPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, zIndex: 1 },
  commentPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  commentPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  commentPublishTextDisabled: { color: '#fff' },
  commentContentArea: { flex: 1, backgroundColor: '#fff' },
  commentTextInput: { padding: 16, fontSize: 16, color: '#333', lineHeight: 26, minHeight: 200 },
  commentToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  commentToolsLeft: { flexDirection: 'row', alignItems: 'center' },
  commentToolItem: { padding: 10 },
  commentWordCount: { fontSize: 13, color: '#999' },
  // 评论列表弹窗样式
  commentListModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  commentListModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  commentListModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentListModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  commentListScroll: { maxHeight: 500 },
  commentListCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentListAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentListContent: { flex: 1, marginLeft: 12 },
  commentListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  commentListAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  commentListTime: { fontSize: 12, color: '#9ca3af' },
  commentListText: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 8 },
  commentListActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  commentListActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentListActionText: { fontSize: 12, color: '#9ca3af' },
  commentListReplyBtn: { fontSize: 12, color: '#ef4444' },
  commentListBottomBar: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  commentListWriteBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  commentListWriteText: { fontSize: 14, color: '#9ca3af' },
  // 今日头条风格回答弹窗
  answerModal: { flex: 1, backgroundColor: '#fff' },
  answerModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  answerCloseBtn: { padding: 4, zIndex: 10 },
  answerHeaderCenter: { flex: 1, alignItems: 'center' },
  answerModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  answerPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, zIndex: 1 },
  answerPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  answerPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  answerPublishTextDisabled: { color: '#fff' },
  answerQuestionCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  answerQuestionIcon: { marginRight: 8, marginTop: 2 },
  answerQuestionText: { flex: 1, fontSize: 15, color: '#333', lineHeight: 22, fontWeight: '500' },
  answerContentArea: { flex: 1, backgroundColor: '#fff' },
  answerTextInput: { padding: 16, fontSize: 16, color: '#333', lineHeight: 26, minHeight: 300 },
  answerToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  answerToolsLeft: { flexDirection: 'row', alignItems: 'center' },
  answerToolItem: { padding: 10 },
  answerWordCount: { fontSize: 13, color: '#999' },
  // 发起活动弹窗样式
  activityModal: { flex: 1, backgroundColor: '#fff' },
  activityModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  activityCloseBtn: { padding: 4, zIndex: 10 },
  activityHeaderCenter: { flex: 1, alignItems: 'center' },
  activityModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  activityPublishBtn: { backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, zIndex: 1 },
  activityPublishBtnDisabled: { backgroundColor: '#bbf7d0' },
  activityPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  activityPublishTextDisabled: { color: '#fff' },
  boundQuestionCard: { backgroundColor: '#f0fdf4', padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  boundQuestionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  boundQuestionLabel: { fontSize: 12, color: '#22c55e', fontWeight: '500', marginLeft: 6 },
  boundQuestionText: { fontSize: 14, color: '#166534', lineHeight: 20 },
  activityFormArea: { flex: 1, padding: 16 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  formInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  formTextarea: { minHeight: 100, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row' },
  formSelectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  formSelectText: { fontSize: 15, color: '#6b7280' },
  formInputWithIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  formInputInner: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  // 评论样式
  commentCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1, marginLeft: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  commentTime: { fontSize: 12, color: '#9ca3af' },
  commentText: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 8 },
  commentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  commentFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  commentFooterRight: { flexDirection: 'row', alignItems: 'center' },
  commentActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 20 },
  commentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12, color: '#9ca3af' },
  commentReplyBtn: { fontSize: 12, color: '#ef4444' },
  // 活动卡片样式
  activityCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  activityCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  activityTypeTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  onlineTag: { backgroundColor: '#3b82f6' },
  offlineTag: { backgroundColor: '#22c55e' },
  activityTypeText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  activityStatusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusOpen: { backgroundColor: '#fef3c7' },
  statusSoon: { backgroundColor: '#dbeafe' },
  activityStatusText: { fontSize: 11, color: '#92400e', fontWeight: '500' },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 10 },
  activityInfo: { gap: 6 },
  activityInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityInfoText: { fontSize: 13, color: '#6b7280', flex: 1 },
  activityCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  activityOrganizer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activityOrganizerAvatar: { width: 28, height: 28, borderRadius: 14 },
  activityOrganizerName: { fontSize: 13, color: '#6b7280' },
  activityJoinBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  activityJoinText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  // 活动类型选择器
  activityTypeSelector: { flexDirection: 'row', gap: 12 },
  activityTypeSelectorBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb', gap: 8 },
  activityTypeSelectorBtnActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  activityTypeSelectorText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  activityTypeSelectorTextActive: { color: '#fff' },
  // 举报弹窗样式
  reportModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  reportModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  reportModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', textAlign: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  reportItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  reportItemText: { fontSize: 15, color: '#1f2937', textAlign: 'center' },
  reportCancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  reportCancelText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 邀请列表样式
  inviteContainer: { backgroundColor: '#fff' },
  inviteSubTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingHorizontal: 16 },
  inviteSubTabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 3, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  inviteSubTabItemActive: { borderBottomColor: '#ef4444' },
  inviteSubTabText: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  inviteSubTabTextActive: { color: '#ef4444', fontWeight: '600' },
  inviteSearchContainer: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  inviteSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7, gap: 8 },
  inviteSearchInput: { flex: 1, fontSize: 13, color: '#1f2937', padding: 0 },
  inviteTabContent: { paddingHorizontal: 16, paddingTop: 16 },
  // 推荐用户横向滚动
  recommendScroll: { marginBottom: 16 },
  recommendUserCard: { flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: '#fafafa', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', gap: 8 },
  recommendUserAvatar: { width: 36, height: 36, borderRadius: 18 },
  recommendUserTextContainer: { flex: 1 },
  recommendUserName: { fontSize: 12, fontWeight: '500', color: '#1f2937', marginBottom: 2 },
  recommendUserDesc: { fontSize: 10, color: '#9ca3af' },
  recommendInviteBtn: { backgroundColor: '#ef4444', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recommendInviteBtnText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  recommendInviteBtnTwitter: { backgroundColor: '#1DA1F2' },
  recommendInviteBtnFacebook: { backgroundColor: '#4267B2' },
  // 已邀请列表
  invitedListTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 8, marginTop: 4 },
  inviteUserCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  inviteUserAvatar: { width: 44, height: 44, borderRadius: 22 },
  inviteUserInfo: { flex: 1, marginLeft: 12 },
  inviteUserName: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  inviteUserDesc: { fontSize: 12, color: '#9ca3af' },
  invitedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  invitedTagText: { fontSize: 12, color: '#22c55e', fontWeight: '500' },
  inviteBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 },
  inviteBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  inviteBtnTwitter: { backgroundColor: '#1DA1F2' },
  inviteBtnFacebook: { backgroundColor: '#4267B2' },
  // 邀请回答弹窗样式
  inviteModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', paddingBottom: 20 },
  inviteModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  inviteModalTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  invitePlatformTabs: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  invitePlatformTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', gap: 4 },
  invitePlatformTabActive: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
  invitePlatformTabText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  invitePlatformTabTextActive: { color: '#3b82f6', fontWeight: '600' },
  inviteSearchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  inviteSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  inviteSearchInput: { flex: 1, fontSize: 14, color: '#1f2937', padding: 0 },
  inviteUserList: { maxHeight: 400, paddingHorizontal: 16 },
  inviteUserItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  inviteUserAvatar: { width: 44, height: 44, borderRadius: 22 },
  inviteUserInfo: { flex: 1, marginLeft: 12 },
  inviteUserName: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  inviteUserDesc: { fontSize: 12, color: '#9ca3af' },
  inviteUserBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  inviteUserBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  inviteUserBtnFacebook: { backgroundColor: '#4267B2' },
  inviteUserBtnTwitter: { backgroundColor: '#1DA1F2' },
  // 团队弹窗样式
  teamModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', paddingBottom: 20 },
  teamModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  teamHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  teamTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  // 团队成员区域
  teamMembersSection: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  teamMembersTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', paddingHorizontal: 16, marginBottom: 12 },
  teamMembersScroll: { paddingHorizontal: 16 },
  teamMemberItem: { alignItems: 'center', marginRight: 16 },
  teamMemberAvatarWrapper: { position: 'relative', marginBottom: 6 },
  teamMemberAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#f59e0b' },
  teamLeaderBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f59e0b', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  teamMemberName: { fontSize: 12, color: '#1f2937', fontWeight: '500', marginBottom: 2 },
  teamMemberRole: { fontSize: 10, color: '#f59e0b', fontWeight: '600' },
  // 团队聊天区域
  teamChatSection: { flex: 1, paddingTop: 16 },
  teamChatTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', paddingHorizontal: 16, marginBottom: 12 },
  teamChatMessages: { maxHeight: 300, paddingHorizontal: 16 },
  teamChatMessage: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  teamChatAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  teamChatBubble: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 10 },
  teamChatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  teamChatUser: { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  teamChatTime: { fontSize: 11, color: '#9ca3af' },
  teamChatText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  teamChatInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  teamChatInput: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1f2937' },
  teamChatSendBtn: { backgroundColor: '#f59e0b', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  // 团队操作按钮
  teamActions: { paddingHorizontal: 16, paddingTop: 16 },
  teamJoinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 12, gap: 8 },
  teamJoinBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  teamLeaveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', paddingVertical: 14, borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#fecaca' },
  teamLeaveBtnText: { fontSize: 15, color: '#ef4444', fontWeight: '600' },
  // 回复样式
  repliesContainer: { paddingLeft: 48, backgroundColor: '#fafafa', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  replyCard: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  replyAvatar: { width: 28, height: 28, borderRadius: 14 },
  replyContent: { flex: 1, marginLeft: 10 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  replyAuthor: { fontSize: 13, fontWeight: '500', color: '#1f2937' },
  replyTime: { fontSize: 11, color: '#9ca3af' },
  replyText: { fontSize: 13, color: '#374151', lineHeight: 18, marginBottom: 6 },
  replyActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  replyActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  replyActionText: { fontSize: 11, color: '#9ca3af' },
  replyReplyBtn: { fontSize: 11, color: '#ef4444' },
  // 推荐问题样式
  recommendedSection: { backgroundColor: '#f9fafb', paddingTop: 16 },
  recommendedHeader: { paddingHorizontal: 16, marginBottom: 16 },
  recommendedHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  recommendedTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  recommendedSubtitle: { fontSize: 12, color: '#9ca3af', marginLeft: 28 },
  recommendedQuestionCard: { backgroundColor: '#fff', marginBottom: 8, padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  recommendedHotTagInline: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#fef2f2', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  recommendedHotTextInline: { fontSize: 10, color: '#ef4444', fontWeight: '600' },
  recommendedQuestionTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937', lineHeight: 26, marginBottom: 12 },
  recommendedQuestionContent: { fontSize: 14, color: '#6b7280', lineHeight: 22, marginBottom: 12 },
  recommendedQuestionMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  recommendedAuthorInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recommendedAuthorAvatar: { width: 24, height: 24, borderRadius: 12 },
  recommendedAuthorName: { fontSize: 13, fontWeight: '500', color: '#374151' },
  recommendedQuestionTime: { fontSize: 12, color: '#9ca3af' },
  recommendedQuestionStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recommendedStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recommendedStatText: { fontSize: 12, color: '#9ca3af' },
  recommendedTopicTags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  recommendedTopicTag: { fontSize: 12, color: '#3b82f6', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
});
