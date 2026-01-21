import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

const initialMessages = [
  { id: 1, author: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member1', content: '大家好，欢迎加入Python学习团队！', time: '2小时前', likes: 15, dislikes: 0, shares: 3, bookmarks: 8 },
  { id: 2, author: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member2', content: '请问有人知道装饰器怎么用吗？', time: '1小时前', likes: 8, dislikes: 0, shares: 2, bookmarks: 5 },
  { id: 3, author: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member3', content: '我可以分享一下装饰器的用法，等会发个教程', time: '30分钟前', likes: 23, dislikes: 0, shares: 6, bookmarks: 12 },
];

// 团队公告数据
const announcements = [
  { id: 1, title: '本周学习主题：Python装饰器', content: '欢迎大家加入团队！本周我们将重点学习Python装饰器的使用方法和应用场景。', author: '张三', time: '2天前', isPinned: true },
  { id: 2, title: '团队学习计划', content: '每周三晚上8点进行线上讨论，欢迎大家积极参与。', author: '张三', time: '5天前', isPinned: false },
  { id: 3, title: '资源分享', content: '推荐大家看一下廖雪峰的Python教程，非常适合入门学习。', author: '李四', time: '1周前', isPinned: false },
];

// 团队成员数据
const teamMembers = [
  { id: 1, name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member1', role: '队长' },
  { id: 2, name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member2', role: '成员' },
  { id: 3, name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member3', role: '成员' },
  { id: 4, name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member4', role: '成员' },
  { id: 5, name: '孙七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member5', role: '成员' },
  { id: 6, name: '周八', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member6', role: '成员' },
  { id: 7, name: '吴九', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member7', role: '成员' },
  { id: 8, name: '郑十', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member8', role: '成员' },
  { id: 9, name: '钱十一', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member9', role: '成员' },
  { id: 10, name: '陈十二', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member10', role: '成员' },
  { id: 11, name: '林十三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member11', role: '成员' },
  { id: 12, name: '黄十四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member12', role: '成员' },
];

const tabs = ['团队讨论', '团队公告'];

export default function TeamDetailScreen({ navigation, route }) {
  const team = route?.params?.team || {
    id: 1,
    name: 'Python学习互助团队',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=team1',
    role: '队长',
    members: 12,
    questions: 45,
    description: '专注Python学习，互帮互助，共同进步',
    createdAt: '2025-12-15',
    isActive: true
  };

  const [activeTab, setActiveTab] = useState('团队讨论');
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [liked, setLiked] = useState({});
  const [disliked, setDisliked] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [isJoined, setIsJoined] = useState(team.role === '队长' || team.role === '成员');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showMembersModal, setShowMembersModal] = useState(false);

  const [showPublishAnnouncementModal, setShowPublishAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const maxVisibleMembers = 10; // 最多显示10个成员（两行）
  const visibleMembers = teamMembers.slice(0, maxVisibleMembers);
  const hasMoreMembers = teamMembers.length > maxVisibleMembers;

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

  const handleExitTeam = () => {
    Alert.alert(
      '退出团队',
      '确定要退出该团队吗？退出后将无法查看团队消息',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定退出', style: 'destructive', onPress: () => {
          setIsJoined(false);
          navigation.goBack();
        }}
      ]
    );
  };

  const handleJoinTeam = () => {
    Alert.alert('加入团队', '确定要加入这个团队吗？', [
      { text: '取消', style: 'cancel' },
      { text: '加入', onPress: () => {
        setIsJoined(true);
        Alert.alert('成功', '已加入团队');
      }}
    ]);
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

  const handlePublishAnnouncement = () => {
    if (!announcementTitle.trim()) {
      Alert.alert('提示', '请输入公告标题');
      return;
    }
    if (!announcementContent.trim()) {
      Alert.alert('提示', '请输入公告内容');
      return;
    }
    Alert.alert('成功', '公告发布成功！');
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setIsPinned(false);
    setShowPublishAnnouncementModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>团队详情页</Text>
        </View>
        <TouchableOpacity 
          style={styles.publishBtn}
          onPress={() => setShowPublishAnnouncementModal(true)}
        >
          <Ionicons name="megaphone" size={18} color="#f59e0b" />
          <Text style={styles.publishBtnText}>发布公告</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 团队信息卡片 - 不显示图标 */}
        <View style={styles.teamInfoCard}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamDesc} numberOfLines={2}>{team.description}</Text>
          <View style={styles.teamStats}>
            <View style={styles.teamStatItem}>
              <Ionicons name="people" size={14} color="#9ca3af" />
              <Text style={styles.teamStatText}>{team.members} 成员</Text>
            </View>
            <View style={styles.teamStatItem}>
              <Ionicons name="chatbubbles" size={14} color="#9ca3af" />
              <Text style={styles.teamStatText}>{team.questions} 问题</Text>
            </View>
          </View>
        </View>

        {/* 团队成员区域 */}
        <View style={styles.teamMembersSection}>
          <View style={styles.membersSectionHeader}>
            <Text style={styles.teamMembersTitle}>团队成员 ({teamMembers.length})</Text>
            {hasMoreMembers && (
              <TouchableOpacity onPress={() => setShowMembersModal(true)}>
                <Text style={styles.viewAllText}>查看全部</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamMembersScroll}>
            {visibleMembers.map(member => (
              <View key={member.id} style={styles.teamMemberItem}>
                <View style={styles.teamMemberAvatarWrapper}>
                  <Image source={{ uri: member.avatar }} style={styles.teamMemberAvatar} />
                  {member.role === '队长' && (
                    <View style={styles.teamLeaderBadge}>
                      <Ionicons name="star" size={10} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={styles.teamMemberName} numberOfLines={1}>{member.name}</Text>
                {member.role === '队长' && <Text style={styles.teamMemberRole}>队长</Text>}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tab标签 */}
        <View style={styles.tabsSection}>
          <View style={styles.tabs}>
            {tabs.map(tab => (
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
        </View>

        {/* 内容区域 */}
        {activeTab === '团队讨论' ? (
          <View style={styles.teamChatSection}>
            {messages.map(msg => (
              <View key={msg.id} style={styles.teamChatMessage}>
                <View style={styles.teamChatBubble}>
                  <View style={styles.teamChatHeader}>
                    <Image source={{ uri: msg.avatar }} style={styles.teamChatAvatar} />
                    <Text style={styles.teamChatUser}>{msg.author}</Text>
                    <Text style={styles.teamChatTime}>{msg.time}</Text>
                  </View>
                  <Text style={styles.teamChatText}>{msg.content}</Text>
                  <View style={styles.messageActions}>
                    <View style={styles.messageActionsLeft}>
                      <TouchableOpacity 
                        style={styles.messageActionBtn}
                        onPress={() => setLiked({ ...liked, [msg.id]: !liked[msg.id] })}
                      >
                        <Ionicons 
                          name={liked[msg.id] ? "thumbs-up" : "thumbs-up-outline"} 
                          size={14} 
                          color={liked[msg.id] ? "#f59e0b" : "#9ca3af"} 
                        />
                        <Text style={[styles.messageActionText, liked[msg.id] && { color: '#f59e0b' }]}>
                          {msg.likes + (liked[msg.id] ? 1 : 0)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.messageActionBtn}
                        onPress={() => openReplyModal(msg)}
                      >
                        <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                        <Text style={styles.messageActionText}>回复</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.messageActionsRight}>
                      <TouchableOpacity 
                        style={styles.messageActionBtn}
                        onPress={() => setDisliked({ ...disliked, [msg.id]: !disliked[msg.id] })}
                      >
                        <Ionicons 
                          name={disliked[msg.id] ? "thumbs-down" : "thumbs-down-outline"} 
                          size={14} 
                          color="#9ca3af" 
                        />
                        <Text style={styles.messageActionText}>{msg.dislikes + (disliked[msg.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.messageActionBtn}
                        onPress={() => handleReport(msg)}
                      >
                        <Ionicons name="flag-outline" size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* 团队公告列表 */
          <View style={styles.announcementList}>
            {announcements.map(announcement => (
              <View key={announcement.id} style={styles.announcementItem}>
                {announcement.isPinned && (
                  <View style={styles.pinnedBadge}>
                    <Ionicons name="pin" size={12} color="#ef4444" />
                    <Text style={styles.pinnedText}>置顶</Text>
                  </View>
                )}
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementContent}>{announcement.content}</Text>
                <View style={styles.announcementFooter}>
                  <View style={styles.announcementAuthor}>
                    <Ionicons name="person-circle-outline" size={14} color="#9ca3af" />
                    <Text style={styles.announcementAuthorText}>{announcement.author}</Text>
                  </View>
                  <Text style={styles.announcementTime}>{announcement.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 底部输入栏 */}
      {isJoined && activeTab === '团队讨论' && (
        <View style={styles.teamChatInputContainer}>
          <TextInput
            style={styles.teamChatInput}
            placeholder="说点什么..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={styles.teamChatSendBtn}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* 加入/退出团队按钮 */}
      {!isJoined && (
        <View style={styles.teamActions}>
          <TouchableOpacity style={styles.teamJoinBtn} onPress={handleJoinTeam}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.teamJoinBtnText}>加入团队</Text>
          </TouchableOpacity>
        </View>
      )}

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
              onPress={handleReply}
              disabled={!replyText.trim()}
            >
              <Text style={styles.replySubmitText}>发布</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 成员列表弹窗 */}
      <Modal visible={showMembersModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.membersModal}>
            <View style={styles.membersModalHeader}>
              <Text style={styles.membersModalTitle}>全部成员 ({teamMembers.length})</Text>
              <TouchableOpacity onPress={() => setShowMembersModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.membersModalList} showsVerticalScrollIndicator={false}>
              {teamMembers.map(member => (
                <View key={member.id} style={styles.memberModalItem}>
                  <Image source={{ uri: member.avatar }} style={styles.memberModalAvatar} />
                  <View style={styles.memberModalInfo}>
                    <View style={styles.memberModalNameRow}>
                      <Text style={styles.memberModalName}>{member.name}</Text>
                      {member.role === '队长' && (
                        <View style={styles.leaderBadgeLarge}>
                          <Ionicons name="star" size={10} color="#f59e0b" />
                          <Text style={styles.leaderBadgeText}>队长</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.memberModalRole}>{member.role}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 发布公告弹窗 */}
      <Modal visible={showPublishAnnouncementModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.publishAnnouncementModal}>
            <View style={styles.publishAnnouncementHeader}>
              <Text style={styles.publishAnnouncementTitle}>发布公告</Text>
              <TouchableOpacity onPress={() => setShowPublishAnnouncementModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.publishAnnouncementForm}>
                <Text style={styles.formLabel}>公告标题</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入公告标题"
                  placeholderTextColor="#9ca3af"
                  value={announcementTitle}
                  onChangeText={setAnnouncementTitle}
                />
                <Text style={styles.formLabel}>公告内容</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="请输入公告内容"
                  placeholderTextColor="#9ca3af"
                  value={announcementContent}
                  onChangeText={setAnnouncementContent}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <TouchableOpacity 
                  style={styles.pinnedCheckbox}
                  onPress={() => setIsPinned(!isPinned)}
                >
                  <Ionicons 
                    name={isPinned ? "checkbox" : "square-outline"} 
                    size={20} 
                    color={isPinned ? "#f59e0b" : "#9ca3af"} 
                  />
                  <Text style={styles.pinnedCheckboxText}>置顶公告</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity 
              style={styles.publishAnnouncementSubmitBtn}
              onPress={handlePublishAnnouncement}
            >
              <Text style={styles.publishAnnouncementSubmitText}>发布</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  headerCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  publishBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fef3c7', borderRadius: 8, zIndex: 10 },
  publishBtnText: { fontSize: 13, color: '#f59e0b', fontWeight: '600' },
  content: { flex: 1 },
  teamInfoCard: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  teamName: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
  teamDesc: { fontSize: 13, color: '#6b7280', lineHeight: 18, marginBottom: 8 },
  teamStats: { flexDirection: 'row', gap: 16 },
  teamStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teamStatText: { fontSize: 12, color: '#9ca3af' },
  // 团队成员区域 - 参照团队弹窗样式
  teamMembersSection: { paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  membersSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  teamMembersTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  viewAllText: { fontSize: 13, color: '#f59e0b', fontWeight: '500' },
  teamMembersScroll: { paddingHorizontal: 16 },
  teamMemberItem: { alignItems: 'center', marginRight: 16, width: 64 },
  teamMemberAvatarWrapper: { position: 'relative', marginBottom: 6 },
  teamMemberAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#f59e0b' },
  teamLeaderBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f59e0b', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  teamMemberName: { fontSize: 12, color: '#1f2937', fontWeight: '500', marginBottom: 2, textAlign: 'center', width: '100%' },
  teamMemberRole: { fontSize: 10, color: '#f59e0b', fontWeight: '600' },
  // Tab标签
  tabsSection: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabs: { flexDirection: 'row' },
  tabItem: { flex: 1, paddingVertical: 12, position: 'relative', alignItems: 'center' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#f59e0b', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#f59e0b' },
  // 团队聊天区域 - 参照团队弹窗样式
  teamChatSection: { flex: 1, paddingTop: 16, paddingHorizontal: 16, backgroundColor: '#fff' },
  teamChatMessage: { marginBottom: 16 },
  teamChatBubble: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
  teamChatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  teamChatAvatar: { width: 32, height: 32, borderRadius: 16 },
  teamChatUser: { fontSize: 13, fontWeight: '600', color: '#1f2937', flex: 1 },
  teamChatTime: { fontSize: 11, color: '#9ca3af' },
  teamChatText: { fontSize: 13, color: '#374151', lineHeight: 18, marginBottom: 8, paddingLeft: 40 },
  messageActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 40 },
  messageActionsLeft: { flexDirection: 'row', gap: 16, flex: 1 },
  messageActionsRight: { flexDirection: 'row', gap: 12 },
  messageActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  messageActionText: { fontSize: 12, color: '#9ca3af' },
  // 团队聊天输入栏 - 参照团队弹窗样式
  teamChatInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 8 },
  teamChatInput: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1f2937', maxHeight: 100 },
  teamChatSendBtn: { backgroundColor: '#f59e0b', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  // 团队操作按钮 - 参照团队弹窗样式
  teamActions: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  teamJoinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 12, gap: 8 },
  teamJoinBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  teamLeaveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', paddingVertical: 14, borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#fecaca' },
  teamLeaveBtnText: { fontSize: 15, color: '#ef4444', fontWeight: '600' },
  // 公告列表
  announcementList: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12 },
  announcementItem: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  pinnedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
  pinnedText: { fontSize: 11, color: '#ef4444', fontWeight: '600' },
  announcementTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8, lineHeight: 22 },
  announcementContent: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 },
  announcementFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  announcementAuthor: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  announcementAuthorText: { fontSize: 12, color: '#9ca3af' },
  announcementTime: { fontSize: 12, color: '#9ca3af' },
  // 回复弹窗
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  replyModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '60%' },
  replyModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  replyModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  replyInput: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, fontSize: 14, color: '#1f2937', minHeight: 100, textAlignVertical: 'top', marginBottom: 16 },
  replySubmitBtn: { backgroundColor: '#f59e0b', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  replySubmitBtnDisabled: { backgroundColor: '#fcd34d' },
  replySubmitText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  // 成员列表弹窗
  membersModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '70%' },
  membersModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  membersModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  membersModalList: { flex: 1 },
  memberModalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  memberModalAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3f4f6' },
  memberModalInfo: { flex: 1, marginLeft: 12 },
  memberModalNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  memberModalName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  memberModalRole: { fontSize: 13, color: '#9ca3af' },
  leaderBadgeLarge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  leaderBadgeText: { fontSize: 11, color: '#f59e0b', fontWeight: '600' },
  // 发布公告弹窗
  publishAnnouncementModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '80%' },
  publishAnnouncementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  publishAnnouncementTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  publishAnnouncementForm: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  formInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1f2937', marginBottom: 16 },
  formTextarea: { minHeight: 120, textAlignVertical: 'top' },
  pinnedCheckbox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pinnedCheckboxText: { fontSize: 14, color: '#374151' },
  publishAnnouncementSubmitBtn: { backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  publishAnnouncementSubmitText: { fontSize: 15, color: '#fff', fontWeight: '600' },
});
