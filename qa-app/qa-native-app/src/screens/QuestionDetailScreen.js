import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const answers = [
  { id: 1, author: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', verified: true, adopted: true, title: '资深Python开发 · 10年经验', content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：\n\n1. 学习时间：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线：\n- 第1个月：Python基础语法、数据类型、函数、面向对象\n- 第2个月：常用库（NumPy、Pandas）、数据处理\n- 第3个月：实战项目、数据可视化\n\n3. 推荐资源：廖雪峰的Python教程（免费）、《Python编程从入门到实践》', likes: 256, dislikes: 3, comments: 23, time: '1小时前' },
  { id: 2, author: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', verified: false, adopted: false, title: '数据分析师 · 3年经验', content: '我也是文科转行的，现在在做数据分析。给你几点建议：\n\n1. 不要一开始就啃书，先跟着视频教程敲代码\n2. 多做项目，边学边练\n3. 加入一些学习群，有问题可以随时问', likes: 89, dislikes: 1, comments: 12, time: '30分钟前' },
  { id: 3, author: '编程新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer3', verified: false, adopted: false, title: '学生', content: '同问！我也想学Python，坐等大佬回答~', likes: 5, dislikes: 2, comments: 0, time: '10分钟前' },
];

const answerTabs = ['补充问题', '全部回答 (56)', '全部评论', '活动'];

// 评论数据
const commentsData = [
  { id: 1, author: '技术爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment1', content: '这个问题问得好，我也想知道答案！', likes: 23, time: '2小时前', replies: 3 },
  { id: 2, author: '编程小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment2', content: '同问，坐等大佬回复', likes: 15, time: '1小时前', replies: 1 },
  { id: 3, author: '数据分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment3', content: 'Python确实是入门数据分析的好选择，加油！', likes: 45, time: '30分钟前', replies: 5 },
  { id: 4, author: '前端开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment4', content: '建议先从基础语法开始，不要急于求成', likes: 32, time: '20分钟前', replies: 2 },
];

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
  const [activeTab, setActiveTab] = useState('全部回答 (56)');
  const [suppLiked, setSuppLiked] = useState({});
  const [suppDisliked, setSuppDisliked] = useState({});
  const [suppBookmarked, setSuppBookmarked] = useState({});
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '', maxParticipants: '', activityType: '线上活动' });
  const [commentLiked, setCommentLiked] = useState({});
  const [sortFilter, setSortFilter] = useState('精选'); // 精选 or 最新

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
            <TouchableOpacity style={styles.activityBtn} onPress={() => setShowActivityModal(true)}>
              <Ionicons name="calendar-outline" size={16} color="#22c55e" />
              <Text style={styles.activityBtnText}>发起活动</Text>
            </TouchableOpacity>
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
            <View style={styles.pkRow}>
              <TouchableOpacity style={styles.voteSolvedBtn}>
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text style={styles.voteSolvedText}>已解决</Text>
              </TouchableOpacity>
              <View style={styles.pkBarWrapper}>
                <View style={styles.pkBar}>
                  <View style={[styles.pkSolvedBar, { width: '65%' }]} />
                  <View style={[styles.pkUnsolvedBar, { width: '35%' }]} />
                </View>
                <View style={[styles.pkPercentLabel, { left: '65%' }]}>
                  <Text style={styles.pkPercentText}>65%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.voteUnsolvedBtn}>
                <Ionicons name="close-circle" size={16} color="#ef4444" />
                <Text style={styles.voteUnsolvedText}>未解决</Text>
              </TouchableOpacity>
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
              <TouchableOpacity key={tab} style={styles.answerTabItem} onPress={() => { setActiveTab(tab); setSortFilter('精选'); }}>
                <Text style={[styles.answerTabText, activeTab === tab && styles.answerTabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.answerTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* 筛选条 - 仅在补充问题、全部回答、全部评论时显示 */}
          <View style={[styles.sortFilterBar, { display: activeTab !== '活动' ? 'flex' : 'none' }]}>
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
              {activeTab === '补充问题' ? '共 4 条补充' : activeTab === '全部回答 (56)' ? '共 56 条回答' : '共 4 条评论'}
            </Text>
          </View>

          {activeTab === '补充问题' ? (
            // 补充问题列表
            <>
              {supplementQuestions.map(item => (
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
                    <TouchableOpacity 
                      style={styles.suppActionBtn} 
                      onPress={() => setSuppLiked({ ...suppLiked, [item.id]: !suppLiked[item.id] })}
                    >
                      <Ionicons name={suppLiked[item.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={suppLiked[item.id] ? "#ef4444" : "#6b7280"} />
                      <Text style={[styles.suppActionText, suppLiked[item.id] && { color: '#ef4444' }]}>{item.likes + (suppLiked[item.id] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.suppActionBtn}
                      onPress={() => setSuppDisliked({ ...suppDisliked, [item.id]: !suppDisliked[item.id] })}
                    >
                      <Ionicons name={suppDisliked[item.id] ? "thumbs-down" : "thumbs-down-outline"} size={16} color={suppDisliked[item.id] ? "#3b82f6" : "#6b7280"} />
                      <Text style={[styles.suppActionText, suppDisliked[item.id] && { color: '#3b82f6' }]}>{item.dislikes + (suppDisliked[item.id] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppActionBtn}>
                      <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                      <Text style={styles.suppActionText}>{item.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppActionBtn}>
                      <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                      <Text style={styles.suppActionText}>{item.shares}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.suppActionBtn}
                      onPress={() => setSuppBookmarked({ ...suppBookmarked, [item.id]: !suppBookmarked[item.id] })}
                    >
                      <Ionicons name={suppBookmarked[item.id] ? "bookmark" : "bookmark-outline"} size={16} color={suppBookmarked[item.id] ? "#f59e0b" : "#6b7280"} />
                      <Text style={[styles.suppActionText, suppBookmarked[item.id] && { color: '#f59e0b' }]}>{item.bookmarks + (suppBookmarked[item.id] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppIconBtn} onPress={() => navigation.navigate('GroupChat', { question: { title: '如何在三个月内从零基础学会Python编程？', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', memberCount: 128 } })}>
                      <Ionicons name="people-outline" size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppIconBtn}>
                      <Ionicons name="logo-twitter" size={16} color="#1DA1F2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppIconBtn}>
                      <Ionicons name="logo-facebook" size={16} color="#4267B2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suppAnswerBtn} onPress={() => navigation.navigate('AnswerDetail')}>
                      <Ionicons name="create-outline" size={14} color="#fff" />
                      <Text style={styles.suppAnswerText}>回答</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.loadMoreBtn}>
                <Text style={styles.loadMoreText}>查看更多补充问题</Text>
                <Ionicons name="chevron-down" size={16} color="#ef4444" />
              </TouchableOpacity>
            </>
          ) : activeTab === '全部评论' ? (
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
                    <View style={styles.commentActions}>
                      <TouchableOpacity 
                        style={styles.commentActionBtn}
                        onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                      >
                        <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                        <Text style={[styles.commentActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionBtn}>
                        <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                        <Text style={styles.commentActionText}>{comment.replies} 回复</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionBtn}>
                        <Text style={styles.commentReplyBtn}>回复</Text>
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
          ) : activeTab === '活动' ? (
            // 活动列表
            <>
              {activitiesData.map(activity => (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityCardHeader}>
                    <View style={[styles.activityTypeTag, activity.type === '线上活动' ? styles.onlineTag : styles.offlineTag]}>
                      <Ionicons name={activity.type === '线上活动' ? "videocam" : "location"} size={12} color="#fff" />
                      <Text style={styles.activityTypeText}>{activity.type}</Text>
                    </View>
                    <View style={[styles.activityStatusTag, activity.status === '报名中' ? styles.statusOpen : styles.statusSoon]}>
                      <Text style={styles.activityStatusText}>{activity.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <View style={styles.activityInfo}>
                    <View style={styles.activityInfoRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                      <Text style={styles.activityInfoText}>{activity.date} {activity.time}</Text>
                    </View>
                    <View style={styles.activityInfoRow}>
                      <Ionicons name="location-outline" size={14} color="#6b7280" />
                      <Text style={styles.activityInfoText} numberOfLines={1}>{activity.location}</Text>
                    </View>
                    <View style={styles.activityInfoRow}>
                      <Ionicons name="people-outline" size={14} color="#6b7280" />
                      <Text style={styles.activityInfoText}>{activity.participants}/{activity.maxParticipants} 人已报名</Text>
                    </View>
                  </View>
                  <View style={styles.activityCardFooter}>
                    <View style={styles.activityOrganizer}>
                      <Image source={{ uri: activity.avatar }} style={styles.activityOrganizerAvatar} />
                      <Text style={styles.activityOrganizerName}>{activity.organizer}</Text>
                    </View>
                    <TouchableOpacity style={styles.activityJoinBtn}>
                      <Text style={styles.activityJoinText}>立即报名</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.loadMoreBtn}>
                <Text style={styles.loadMoreText}>查看更多活动</Text>
                <Ionicons name="chevron-down" size={16} color="#ef4444" />
              </TouchableOpacity>
            </>
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
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.loadMoreBtn}><Text style={styles.loadMoreText}>查看更多回答</Text><Ionicons name="chevron-down" size={16} color="#ef4444" /></TouchableOpacity>
            </>
          )}
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
        <TouchableOpacity style={styles.bottomAction} onPress={() => navigation.navigate('GroupChat', { question: { title: '如何在三个月内从零基础学会Python编程？', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', memberCount: 128 } })}><Ionicons name="people-outline" size={22} color="#6b7280" /></TouchableOpacity>
        <TouchableOpacity style={styles.answerSubmitBtn} onPress={() => setShowAnswerModal(true)}><Text style={styles.answerSubmitText}>回答</Text></TouchableOpacity>
      </View>

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
  activityBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#22c55e', borderRadius: 16, gap: 4 },
  activityBtnText: { fontSize: 12, color: '#22c55e' },
  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', lineHeight: 26 },
  questionContent: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginTop: 12 },
  questionImage: { width: '100%', height: 180, borderRadius: 8, marginTop: 12 },
  topicTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  topicTag: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pkSection: { marginTop: 16 },
  pkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pkBarWrapper: { flex: 1, position: 'relative' },
  pkBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  pkSolvedBar: { backgroundColor: '#3b82f6', height: '100%' },
  pkUnsolvedBar: { backgroundColor: '#ef4444', height: '100%' },
  pkPercentLabel: { position: 'absolute', top: 12, transform: [{ translateX: -15 }] },
  pkPercentText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  voteSolvedBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, gap: 4 },
  voteSolvedText: { fontSize: 12, color: '#3b82f6', fontWeight: '500' },
  voteUnsolvedBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, gap: 4 },
  voteUnsolvedText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
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
  // 补充问题样式
  suppCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  suppHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  suppAvatar: { width: 40, height: 40, borderRadius: 20 },
  suppAuthorInfo: { flex: 1, marginLeft: 12 },
  suppAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  suppLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 2 },
  suppLocation: { fontSize: 12, color: '#9ca3af' },
  suppContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  suppFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 12 },
  suppActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suppActionText: { fontSize: 13, color: '#6b7280' },
  suppIconBtn: { padding: 4 },
  suppAnswerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  suppAnswerText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  inputWrapper: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  input: { fontSize: 14 },
  bottomAction: { padding: 8 },
  answerSubmitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginLeft: 4 },
  answerSubmitText: { fontSize: 14, color: '#fff', fontWeight: '500' },
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
  commentText: { fontSize: 14, color: '#374151', lineHeight: 20 },
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
});
