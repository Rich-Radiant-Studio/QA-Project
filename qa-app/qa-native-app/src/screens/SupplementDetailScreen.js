import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const supplementAnswers = [
  { id: 1, author: '数学老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=matht1', verified: true, title: '高中数学教师 · 8年经验', content: '学Python其实不需要太高深的数学基础。基础的加减乘除、简单的逻辑思维就够了。如果要做数据分析,了解一些统计学知识会更好,但这些都可以边学边补。', likes: 89, bookmarks: 34, shares: 18, comments: 12, time: '1小时前' },
  { id: 2, author: '自学成才者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=self2', verified: false, title: '程序员 · 自学转行', content: '我高中数学也不好,但照样学会了Python。编程更多的是逻辑思维,不是数学计算。放心学吧!', likes: 45, bookmarks: 21, shares: 9, comments: 5, time: '30分钟前' },
];

const supplementComments = [
  { id: 1, author: '学习者A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=learnerA', content: '我也担心这个问题,看来可以放心学了', likes: 15, dislikes: 2, shares: 5, bookmarks: 8, time: '45分钟前', replies: 2 },
  { id: 2, author: '学习者B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=learnerB', content: '数学不好也能学编程,这个我可以证明', likes: 8, dislikes: 1, shares: 3, bookmarks: 4, time: '20分钟前', replies: 1 },
];

const repliesData = {
  1: [
    { id: 101, author: '回复者A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=replyA1', content: '确实是这样!', likes: 3, time: '30分钟前' },
    { id: 102, author: '回复者B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=replyB1', content: '我也是这么想的', likes: 2, time: '25分钟前' },
  ],
  2: [
    { id: 201, author: '回复者C', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=replyC1', content: '加油!', likes: 1, time: '15分钟前' },
  ],
};

export default function SupplementDetailScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('全部回答');
  const [sortFilter, setSortFilter] = useState('精选');
  const [liked, setLiked] = useState({});
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [answerLiked, setAnswerLiked] = useState({});
  const [answerBookmarked, setAnswerBookmarked] = useState({});
  const [commentLiked, setCommentLiked] = useState({});
  const [commentDisliked, setCommentDisliked] = useState({});
  const [commentBookmarked, setCommentBookmarked] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentAnswerId, setCurrentAnswerId] = useState(null);
  const [showAnswerCommentModal, setShowAnswerCommentModal] = useState(false);
  const [answerCommentText, setAnswerCommentText] = useState('');
  const [inviteTab, setInviteTab] = useState('本站');
  const [searchLocalUser, setSearchLocalUser] = useState('');
  const [searchTwitterUser, setSearchTwitterUser] = useState('');
  const [searchFacebookUser, setSearchFacebookUser] = useState('');

  const originalQuestion = {
    title: '如何在三个月内从零基础学会Python编程?有没有系统的学习路线推荐?',
    author: '张三丰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    content: '本人是一名文科生,之前完全没有接触过编程。最近想转行做数据分析,听说Python是必备技能。',
    time: '2小时前',
    location: '北京'
  };

  const supplementQuestion = route?.params?.supplement || {
    id: 1,
    author: '学习者小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp1',
    location: '上海',
    content: '请问学Python需要先学什么数学基础吗?我高中数学不太好,会不会影响学习?',
    likes: 45,
    shares: 12,
    bookmarks: 23,
    comments: 8,
    time: '1小时前'
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    alert('回答提交成功!');
    setAnswerText('');
    setShowAnswerModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>补充问题详情</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareBtn} onPress={() => alert('分享功能')}>
            <Ionicons name="arrow-redo-outline" size={22} color="#6b7280" />
            <Text style={styles.shareBtnText}>{supplementQuestion.shares}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} onPress={() => alert('举报功能')}>
            <Ionicons name="flag-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.supplementSection}>
          <View style={styles.supplementHeader}>
            <Image source={{ uri: supplementQuestion.avatar }} style={styles.supplementAvatar} />
            <View style={styles.supplementAuthorInfo}>
              <View style={styles.supplementAuthorRow}>
                <Text style={styles.supplementAuthor}>{supplementQuestion.author}</Text>
                <TouchableOpacity style={styles.followBtnSmall}>
                  <Ionicons name="add" size={12} color="#ef4444" />
                  <Text style={styles.followBtnSmallText}>关注</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.supplementMetaRow}>
                <Ionicons name="location-outline" size={12} color="#9ca3af" />
                <Text style={styles.supplementLocation}>{supplementQuestion.location}</Text>
                <Text style={styles.supplementTime}>· {supplementQuestion.time}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.supplementContent}>{supplementQuestion.content}</Text>
          <View style={styles.supplementViewsRow}>
            <Ionicons name="eye-outline" size={14} color="#9ca3af" />
            <Text style={styles.supplementViewsText}>1.2k 浏览</Text>
          </View>
        </View>

        <View style={styles.originalQuestionCard}>
          <View style={styles.originalQuestionHeader}>
            <Ionicons name="link-outline" size={14} color="#9ca3af" />
            <Text style={styles.originalQuestionLabel}>原问题</Text>
          </View>
          <Text style={styles.originalQuestionTitle} numberOfLines={2}>{originalQuestion.title}</Text>
          <View style={styles.originalQuestionFooter}>
            <Image source={{ uri: originalQuestion.avatar }} style={styles.originalQuestionAvatar} />
            <Text style={styles.originalQuestionAuthor}>{originalQuestion.author}</Text>
            <Text style={styles.originalQuestionTime}>· {originalQuestion.time}</Text>
          </View>
        </View>

        <View style={styles.tabsSection}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab('全部回答'); setSortFilter('精选'); }}>
              <Text style={[styles.tabText, activeTab === '全部回答' && styles.tabTextActive]}>全部回答</Text>
              {activeTab === '全部回答' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab('全部评论'); setSortFilter('精选'); }}>
              <Text style={[styles.tabText, activeTab === '全部评论' && styles.tabTextActive]}>全部评论</Text>
              {activeTab === '全部评论' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('邀请')}>
              <Text style={[styles.tabText, activeTab === '邀请' && styles.tabTextActive]}>邀请</Text>
              {activeTab === '邀请' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>

          {(activeTab === '全部回答' || activeTab === '全部评论') && (
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
                {activeTab === '全部回答' ? '共 2 条回答' : '共 2 条评论'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.contentSection}>
          {activeTab === '全部回答' ? (
            <>
              {supplementAnswers.map(answer => (
                <TouchableOpacity 
                  key={answer.id} 
                  style={styles.answerCard}
                  onPress={() => navigation.navigate('AnswerDetail', { answer })}
                  activeOpacity={0.7}
                >
                  <View style={styles.answerHeader}>
                    <Image source={{ uri: answer.avatar }} style={styles.answerAvatar} />
                    <View style={styles.answerAuthorInfo}>
                      <View style={styles.answerAuthorRow}>
                        <Text style={styles.answerAuthor}>{answer.author}</Text>
                        {answer.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                      </View>
                      <Text style={styles.answerAuthorTitle}>{answer.title}</Text>
                    </View>
                  </View>
                  <Text style={styles.answerContent}>{answer.content}</Text>
                  <View style={styles.answerFooter}>
                    <View style={styles.answerFooterLeft}>
                      <TouchableOpacity 
                        style={styles.answerActionBtn} 
                        onPress={() => setAnswerLiked({ ...answerLiked, [answer.id]: !answerLiked[answer.id] })}
                      >
                        <Ionicons name={answerLiked[answer.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={answerLiked[answer.id] ? "#ef4444" : "#6b7280"} />
                        <Text style={[styles.answerActionText, answerLiked[answer.id] && { color: '#ef4444' }]}>{answer.likes + (answerLiked[answer.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.answerActionBtn}
                        onPress={() => { setCurrentAnswerId(answer.id); setShowAnswerCommentModal(true); }}
                      >
                        <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                        <Text style={styles.answerActionText}>{answer.comments}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.answerActionBtn}>
                        <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                        <Text style={styles.answerActionText}>{answer.shares}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.answerActionBtn}
                        onPress={() => setAnswerBookmarked({ ...answerBookmarked, [answer.id]: !answerBookmarked[answer.id] })}
                      >
                        <Ionicons name={answerBookmarked[answer.id] ? "bookmark" : "star-outline"} size={16} color={answerBookmarked[answer.id] ? "#f59e0b" : "#6b7280"} />
                        <Text style={[styles.answerActionText, answerBookmarked[answer.id] && { color: '#f59e0b' }]}>{answer.bookmarks + (answerBookmarked[answer.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.answerFooterRight}>
                      <TouchableOpacity style={styles.answerActionBtn}>
                        <Ionicons name="thumbs-down-outline" size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.answerActionBtn}>
                        <Ionicons name="flag-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
            <>
              {supplementComments.map(comment => (
                <View key={comment.id}>
                  <View style={styles.commentCard}>
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
                            onPress={() => setExpandedComments({ ...expandedComments, [comment.id]: !expandedComments[comment.id] })}
                          >
                            <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                            <Text style={styles.commentActionText}>{comment.replies} 回复</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.commentActionBtn}
                            onPress={() => alert('转发功能')}
                          >
                            <Ionicons name="arrow-redo-outline" size={14} color="#9ca3af" />
                            <Text style={styles.commentActionText}>{comment.shares}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.commentActionBtn}
                            onPress={() => setCommentBookmarked({ ...commentBookmarked, [comment.id]: !commentBookmarked[comment.id] })}
                          >
                            <Ionicons name={commentBookmarked[comment.id] ? "bookmark" : "bookmark-outline"} size={14} color={commentBookmarked[comment.id] ? "#f59e0b" : "#9ca3af"} />
                            <Text style={[styles.commentActionText, commentBookmarked[comment.id] && { color: '#f59e0b' }]}>{comment.bookmarks + (commentBookmarked[comment.id] ? 1 : 0)}</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.commentFooterRight}>
                          <TouchableOpacity 
                            style={styles.commentActionBtn}
                            onPress={() => setCommentDisliked({ ...commentDisliked, [comment.id]: !commentDisliked[comment.id] })}
                          >
                            <Ionicons name={commentDisliked[comment.id] ? "thumbs-down" : "thumbs-down-outline"} size={14} color="#9ca3af" />
                            <Text style={styles.commentActionText}>{comment.dislikes + (commentDisliked[comment.id] ? 1 : 0)}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.commentActionBtn}>
                            <Ionicons name="flag-outline" size={14} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                  
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
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <TouchableOpacity 
            style={styles.bottomIconBtn}
            onPress={() => setLiked({ ...liked, main: !liked.main })}
          >
            <Ionicons name={liked.main ? "thumbs-up" : "thumbs-up-outline"} size={20} color={liked.main ? "#ef4444" : "#6b7280"} />
            <Text style={[styles.bottomIconText, liked.main && { color: '#ef4444' }]}>{supplementQuestion.likes + (liked.main ? 1 : 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomIconBtn}
            onPress={() => setBookmarked(!bookmarked)}
          >
            <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={20} color={bookmarked ? "#f59e0b" : "#6b7280"} />
            <Text style={[styles.bottomIconText, bookmarked && { color: '#f59e0b' }]}>{supplementQuestion.bookmarks + (bookmarked ? 1 : 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomIconBtn}
            onPress={() => setDisliked(!disliked)}
          >
            <Ionicons name={disliked ? "thumbs-down" : "thumbs-down-outline"} size={20} color={disliked ? "#6b7280" : "#6b7280"} />
            <Text style={[styles.bottomIconText, disliked && { color: '#6b7280' }]}>12</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBarRight}>
          <TouchableOpacity 
            style={styles.bottomCommentInput}
            onPress={() => setShowCommentModal(true)}
          >
            <Text style={styles.bottomCommentPlaceholder}>写评论...</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomAnswerBtn}
            onPress={() => setShowAnswerModal(true)}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.bottomAnswerText}>回答</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showAnswerModal} animationType="slide">
        <SafeAreaView style={styles.answerModal}>
          <View style={styles.answerModalHeader}>
            <TouchableOpacity onPress={() => setShowAnswerModal(false)} style={styles.answerCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.answerModalTitle}>写回答</Text>
            <TouchableOpacity 
              style={[styles.answerPublishBtn, !answerText.trim() && styles.answerPublishBtnDisabled]}
              onPress={handleSubmitAnswer}
              disabled={!answerText.trim()}
            >
              <Text style={styles.answerPublishText}>发布</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.answerContentArea}>
            <TextInput
              style={styles.answerTextInput}
              placeholder="写下你的回答..."
              placeholderTextColor="#bbb"
              value={answerText}
              onChangeText={setAnswerText}
              multiline
              autoFocus
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showCommentModal} animationType="slide">
        <SafeAreaView style={styles.commentModal}>
          <View style={styles.commentModalHeader}>
            <TouchableOpacity onPress={() => { setShowCommentModal(false); setCommentText(''); }} style={styles.commentCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.commentModalTitle}>写评论</Text>
            <TouchableOpacity 
              style={[styles.commentPublishBtn, !commentText.trim() && styles.commentPublishBtnDisabled]}
              onPress={() => {
                if (commentText.trim()) {
                  alert('评论发布成功!');
                  setCommentText('');
                  setShowCommentModal(false);
                }
              }}
              disabled={!commentText.trim()}
            >
              <Text style={styles.commentPublishText}>发布</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.commentContentArea}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="写下你的评论..."
              placeholderTextColor="#bbb"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              autoFocus
            />
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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, width: 80, justifyContent: 'flex-end' },
  shareBtn: { padding: 4, flexDirection: 'row', alignItems: 'center', gap: 2 },
  shareBtnText: { fontSize: 12, color: '#6b7280' },
  content: { flex: 1 },
  supplementSection: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  supplementHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  supplementAvatar: { width: 44, height: 44, borderRadius: 22 },
  supplementAuthorInfo: { flex: 1, marginLeft: 12 },
  supplementAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  supplementAuthor: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  followBtnSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, gap: 2 },
  followBtnSmallText: { fontSize: 10, color: '#ef4444', fontWeight: '500' },
  supplementMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  supplementLocation: { fontSize: 12, color: '#9ca3af' },
  supplementTime: { fontSize: 12, color: '#9ca3af' },
  supplementContent: { fontSize: 16, color: '#1f2937', lineHeight: 26, fontWeight: '400', marginBottom: 12 },
  supplementViewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  supplementViewsText: { fontSize: 12, color: '#9ca3af' },
  originalQuestionCard: { backgroundColor: '#fafafa', padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
  originalQuestionHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  originalQuestionLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  originalQuestionTitle: { fontSize: 13, fontWeight: '500', color: '#6b7280', lineHeight: 20, marginBottom: 8 },
  originalQuestionFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  originalQuestionAvatar: { width: 20, height: 20, borderRadius: 10 },
  originalQuestionAuthor: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  originalQuestionTime: { fontSize: 11, color: '#9ca3af' },
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
  answerCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  answerAvatar: { width: 40, height: 40, borderRadius: 20 },
  answerAuthorInfo: { flex: 1, marginLeft: 12 },
  answerAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answerAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  answerAuthorTitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  answerContent: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 12 },
  answerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  answerFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  answerFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  answerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerActionText: { fontSize: 13, color: '#6b7280' },
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
  recommendScroll: { marginBottom: 16 },
  recommendUserCard: { flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: '#fafafa', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', gap: 8 },
  recommendUserAvatar: { width: 36, height: 36, borderRadius: 18 },
  recommendUserTextContainer: { flex: 1 },
  recommendUserName: { fontSize: 12, fontWeight: '500', color: '#1f2937', marginBottom: 2 },
  recommendUserDesc: { fontSize: 10, color: '#9ca3af' },
  recommendInviteBtn: { backgroundColor: '#ef4444', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recommendInviteBtnTwitter: { backgroundColor: '#1DA1F2' },
  recommendInviteBtnFacebook: { backgroundColor: '#4267B2' },
  invitedListTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 8, marginTop: 4 },
  inviteUserCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  inviteUserAvatar: { width: 44, height: 44, borderRadius: 22 },
  inviteUserInfo: { flex: 1, marginLeft: 12 },
  inviteUserName: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  inviteUserDesc: { fontSize: 12, color: '#9ca3af' },
  invitedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  invitedTagText: { fontSize: 12, color: '#22c55e', fontWeight: '500' },
  commentCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1, marginLeft: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  commentTime: { fontSize: 12, color: '#9ca3af' },
  commentText: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 8 },
  commentFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  commentFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  commentFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  commentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12, color: '#9ca3af' },
  repliesContainer: { paddingLeft: 48, backgroundColor: '#fafafa', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  replyCard: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  replyAvatar: { width: 28, height: 28, borderRadius: 14 },
  replyContent: { flex: 1, marginLeft: 10 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  replyAuthor: { fontSize: 13, fontWeight: '500', color: '#1f2937' },
  replyTime: { fontSize: 11, color: '#9ca3af' },
  replyText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  bottomBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bottomBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginLeft: 16 },
  bottomIconBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  bottomIconText: { fontSize: 12, color: '#6b7280' },
  bottomCommentInput: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  bottomCommentPlaceholder: { fontSize: 13, color: '#9ca3af' },
  bottomAnswerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  bottomAnswerText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  answerModal: { flex: 1, backgroundColor: '#fff' },
  answerModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  answerCloseBtn: { padding: 4 },
  answerModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  answerPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  answerPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  answerPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  answerContentArea: { flex: 1, backgroundColor: '#fff' },
  answerTextInput: { padding: 16, fontSize: 16, color: '#333', lineHeight: 26, minHeight: 300 },
  commentModal: { flex: 1, backgroundColor: '#fff' },
  commentModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  commentCloseBtn: { padding: 4 },
  commentModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  commentPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  commentPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  commentPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  commentContentArea: { flex: 1, backgroundColor: '#fff' },
  commentTextInput: { padding: 16, fontSize: 16, color: '#333', lineHeight: 26, minHeight: 200 },
});
