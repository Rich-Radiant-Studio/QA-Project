import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, Share, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

const stats = [
  { label: '点赞', value: '3.5k', screen: 'Likes' },
  { label: '粉丝', value: '1.2k', screen: 'Fans' },
  { label: '关注', value: '128', screen: 'Follow' },
  { label: '朋友', value: '56', screen: 'Friends' },
];

const menuItems = [
  { icon: 'document-text', label: '我的草稿', value: '3', color: '#22c55e' },
  { icon: 'people', label: '我的群聊', value: '5', color: '#a855f7' },
  { icon: 'people-circle', label: '我的团队', value: '2', color: '#f59e0b' },
  { icon: 'calendar', label: '我的活动', value: '2', color: '#ef4444' },
];

const myQuestions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', type: 'reward', reward: 50, views: '1.2k', comments: 56, likes: 128, time: '2小时前' },
  { id: 2, title: '第一次养猫需要准备什么？', type: 'free', solved: true, views: '2.5k', comments: 89, likes: 256, time: '昨天' },
  { id: 3, title: '35岁程序员如何规划职业发展？', type: 'reward', reward: 100, views: '5.6k', comments: 456, likes: 1200, time: '3天前' },
];

const myAnswers = [
  { id: 1, questionTitle: '如何高效学习一门新技能？', content: '作为一个自学了多门技能的人，我来分享一下我的经验...', likes: 256, comments: 23, adopted: true, time: '1小时前' },
  { id: 2, questionTitle: 'Python数据分析入门需要学什么？', content: '首先需要掌握Python基础语法，然后学习NumPy和Pandas...', likes: 189, comments: 15, adopted: false, time: '3小时前' },
  { id: 3, questionTitle: '35岁转行做程序员还来得及吗？', content: '完全来得及！我就是35岁转行的，现在已经工作2年了...', likes: 512, comments: 45, adopted: true, time: '昨天' },
  { id: 4, questionTitle: '如何克服拖延症？', content: '拖延症的根本原因是对任务的恐惧，可以尝试番茄工作法...', likes: 98, comments: 8, adopted: false, time: '2天前' },
];

const contentTabs = ['提问 (56)', '回答 (234)', '收藏 (892)', '浏览历史 (156)'];

// 收藏数据
const favoritesData = {
  questions: [
    { id: 1, title: '如何高效学习一门新技能？', author: '学习达人', time: '收藏于2天前' },
    { id: 2, title: 'Python数据分析入门指南', author: '数据分析师', time: '收藏于3天前' },
  ],
  answers: [
    { id: 1, title: '关于职场新人如何快速成长的回答', author: '职场导师', time: '收藏于1周前' },
    { id: 2, title: '关于如何克服拖延症的回答', author: '心理咨询师', time: '收藏于2周前' },
  ],
  comments: [
    { id: 1, title: '"这个方法真的很有用！"', author: '小明', time: '收藏于3天前' },
    { id: 2, title: '"感谢分享，学到了很多"', author: '小红', time: '收藏于5天前' },
  ],
};

// 浏览历史数据
const historyList = [
  { id: 1, title: 'AI大模型会取代程序员吗？', author: 'AI研究员', time: '1小时前' },
  { id: 2, title: '2026年最值得学习的编程语言', author: '技术博主', time: '3小时前' },
  { id: 3, title: '如何克服社交恐惧症？', author: '心理咨询师', time: '昨天' },
];

// 草稿数据
const draftsList = [
  { id: 1, title: '关于远程办公的一些思考...', time: '保存于1小时前', type: 'question' },
  { id: 2, title: '我对Python学习的建议是...', time: '保存于昨天', type: 'answer' },
  { id: 3, title: '新手养猫注意事项', time: '保存于3天前', type: 'question' },
];

export default function ProfileScreen({ navigation, onLogout }) {
  const [activeTab, setActiveTab] = useState('提问 (56)');
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [favoritesTab, setFavoritesTab] = useState('questions');

  const handleShare = async () => {
    try {
      await Share.share({ message: '来看看我在问答社区的主页吧！https://qa-app.com/user/12345678', title: '分享个人主页' });
    } catch (error) {
      Alert.alert('分享失败', error.message);
    }
  };

  const handleStatPress = (stat) => {
    switch (stat.label) {
      case '粉丝':
        navigation.navigate('Fans');
        break;
      case '关注':
        navigation.navigate('Follow');
        break;
      case '点赞':
        Alert.alert('获赞统计', '您的内容共获得 3.5k 个赞');
        break;
      case '朋友':
        Alert.alert('我的朋友', '您有 56 位朋友');
        break;
      default:
        break;
    }
  };

  const handleMenuPress = (item) => {
    switch (item.label) {
      case '浏览历史':
        setShowHistoryModal(true);
        break;
      case '我的草稿':
        setShowDraftsModal(true);
        break;
      case '我的群聊':
        navigation.navigate('MyGroups');
        break;
      case '我的团队':
        navigation.navigate('MyTeams');
        break;
      case '我的活动':
        // 使用jumpTo跳转到活动Tab
        navigation.navigate('活动', { fromProfile: true });
        break;
      default:
        break;
    }
  };

  const handleQuestionPress = (question) => {
    navigation.navigate('QuestionDetail', { id: question.id });
  };

  const handleWalletAction = (action) => {
    switch (action) {
      case 'recharge':
        Alert.alert('充值', '请选择充值金额', [
          { text: '$10', onPress: () => Alert.alert('充值成功', '已充值$10') },
          { text: '$50', onPress: () => Alert.alert('充值成功', '已充值$50') },
          { text: '$100', onPress: () => Alert.alert('充值成功', '已充值$100') },
          { text: '取消', style: 'cancel' }
        ]);
        break;
      case 'withdraw':
        Alert.alert('提现', '可提现金额：$256.50', [
          { text: '全部提现', onPress: () => Alert.alert('提现申请', '提现申请已提交，预计1-3个工作日到账') },
          { text: '取消', style: 'cancel' }
        ]);
        break;
      case 'expense':
        Alert.alert('悬赏支出明细', '本月悬赏支出：$150.00\n\n- Python学习问题：$50\n- 职业规划问题：$100');
        break;
      case 'income':
        Alert.alert('回答收入明细', '本月回答收入：$320.00\n\n- 被采纳回答 x 8：$280\n- 优质回答奖励：$40');
        break;
      case 'pending':
        Alert.alert('待采纳回答', '您有12个回答等待被采纳');
        break;
      default:
        break;
    }
  };

  const handleFavoritePress = (item) => {
    setShowFavoritesModal(false);
    navigation.navigate('QuestionDetail', { id: item.id });
  };

  const handleHistoryPress = (item) => {
    setShowHistoryModal(false);
    navigation.navigate('QuestionDetail', { id: item.id });
  };

  const handleDraftPress = (item) => {
    setShowDraftsModal(false);
    if (item.type === 'question') {
      navigation.navigate('Publish');
    } else {
      Alert.alert('编辑回答', '继续编辑您的回答草稿');
    }
  };

  const handleDeleteDraft = (item) => {
    Alert.alert('删除草稿', '确定要删除这个草稿吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => Alert.alert('已删除', '草稿已删除') }
    ]);
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '退出', style: 'destructive', onPress: () => { if (onLogout) onLogout(); } }
    ]);
  };

  const getFavoritesData = () => {
    switch (favoritesTab) {
      case 'questions': return favoritesData.questions;
      case 'answers': return favoritesData.answers;
      case 'comments': return favoritesData.comments;
      default: return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顶部背景 */}
        <View style={styles.headerBg}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ marginLeft: 16 }} 
              onPress={() => navigation.navigate('Settings')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar uri="https://api.dicebear.com/7.x/avataaars/svg?seed=myuser" name="我的账号" size={64} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>张三</Text>
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
              </View>
              <Text style={styles.userId}>ID: 12345678</Text>
            </View>
          </View>
          <Text style={styles.userBio}>热爱学习，乐于分享。专注Python、数据分析领域。</Text>
          <View style={styles.userMeta}>
            <View style={styles.metaItem}><Ionicons name="location-outline" size={14} color="#9ca3af" /><Text style={styles.metaText}>北京</Text></View>
            <View style={styles.metaItem}><Ionicons name="briefcase-outline" size={14} color="#9ca3af" /><Text style={styles.metaText}>数据分析师</Text></View>
          </View>
          
          {/* 影响力和智慧指数 */}
          <View style={styles.indexRow}>
            <View style={styles.indexItem}>
              <View style={styles.indexIconWrapper}>
                <Ionicons name="flame" size={18} color="#ef4444" />
              </View>
              <View style={styles.indexInfo}>
                <Text style={styles.indexLabel}>影响力</Text>
                <Text style={styles.indexValue}>8,567</Text>
              </View>
            </View>
            <View style={styles.indexDivider} />
            <TouchableOpacity 
              style={styles.indexItem}
              onPress={() => navigation.navigate('WisdomIndex')}
            >
              <View style={styles.indexIconWrapper}>
                <Ionicons name="bulb" size={18} color="#f59e0b" />
              </View>
              <View style={styles.indexInfo}>
                <Text style={styles.indexLabel}>智慧指数</Text>
                <Text style={styles.indexValue}>92.5</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            {stats.map((stat, idx) => (
              <TouchableOpacity key={idx} style={styles.statItem} onPress={() => handleStatPress(stat)}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 钱包卡片 */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIcon}><Ionicons name="wallet" size={20} color="#f59e0b" /></View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>我的钱包</Text>
              <Text style={styles.walletBalance}>$256.50</Text>
            </View>
            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.rechargeBtn} onPress={() => handleWalletAction('recharge')}><Text style={styles.rechargeBtnText}>充值</Text></TouchableOpacity>
              <TouchableOpacity style={styles.withdrawBtn} onPress={() => handleWalletAction('withdraw')}><Text style={styles.withdrawBtnText}>提现</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.walletStats}>
            <TouchableOpacity style={styles.walletStatItem} onPress={() => handleWalletAction('income')}>
              <Text style={[styles.walletStatValue, { color: '#22c55e' }]}>$320.00</Text>
              <Text style={styles.walletStatLabel}>回答收入</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletStatItem} onPress={() => handleWalletAction('expense')}>
              <Text style={styles.walletStatValue}>$150.00</Text>
              <Text style={styles.walletStatLabel}>悬赏支出</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletStatItem} onPress={() => handleWalletAction('pending')}>
              <Text style={styles.walletStatValue}>12</Text>
              <Text style={styles.walletStatLabel}>待采纳</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 功能菜单 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem} onPress={() => handleMenuPress(item)}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 我的内容 */}
        <View style={styles.contentSection}>
          <View style={styles.contentTabs}>
            {contentTabs.map(tab => (
              <TouchableOpacity key={tab} style={styles.contentTabItem} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.contentTabText, activeTab === tab && styles.contentTabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.contentTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
          
          {/* 提问列表 */}
          <View style={{ display: activeTab === '提问 (56)' ? 'flex' : 'none' }}>
            {myQuestions.map(q => (
              <TouchableOpacity key={q.id} style={styles.questionItem} onPress={() => handleQuestionPress(q)}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionTime}>{q.time}</Text>
                </View>
                <Text style={styles.questionTitle}>
                  {q.type === 'reward' && (
                    <View style={styles.rewardTagInline}>
                      <Text style={styles.rewardTagInlineText}>${q.reward}</Text>
                    </View>
                  )}
                  {q.solved && (
                    <View style={styles.solvedTagInline}>
                      <Text style={styles.solvedTagInlineText}>已解决</Text>
                    </View>
                  )}
                  {' '}{q.title}
                </Text>
                <View style={styles.questionStats}>
                  <View style={styles.questionStatItem}>
                    <Ionicons name="eye-outline" size={12} color="#9ca3af" />
                    <Text style={styles.questionStatText}>{q.views}</Text>
                  </View>
                  <View style={styles.questionStatItem}>
                    <Ionicons name="chatbubble-outline" size={12} color="#9ca3af" />
                    <Text style={styles.questionStatText}>{q.comments}</Text>
                  </View>
                  <View style={styles.questionStatItem}>
                    <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                    <Text style={styles.questionStatText}>{q.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 回答列表 */}
          <View style={{ display: activeTab === '回答 (234)' ? 'flex' : 'none' }}>
            {myAnswers.map(a => (
              <TouchableOpacity key={a.id} style={styles.answerItem} onPress={() => navigation.navigate('AnswerDetail', { answer: a })}>
                <View style={styles.answerHeader}>
                  <Text style={styles.answerTime}>{a.time}</Text>
                </View>
                <Text style={styles.answerQuestion} numberOfLines={1}>
                  {a.adopted && (
                    <View style={styles.adoptedTagInline}>
                      <Text style={styles.adoptedTagInlineText}>已采纳</Text>
                    </View>
                  )}
                  {' '}{a.questionTitle}
                </Text>
                <Text style={styles.answerContent} numberOfLines={2}>{a.content}</Text>
                <View style={styles.answerStats}>
                  <View style={styles.questionStatItem}>
                    <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                    <Text style={styles.questionStatText}>{a.likes}</Text>
                  </View>
                  <View style={styles.questionStatItem}>
                    <Ionicons name="chatbubble-outline" size={12} color="#9ca3af" />
                    <Text style={styles.questionStatText}>{a.comments}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 收藏列表 */}
          <View style={{ display: activeTab === '收藏 (892)' ? 'flex' : 'none' }}>
            {/* 收藏分类标签 */}
            <View style={styles.favoriteTabsInline}>
              <TouchableOpacity 
                style={[styles.favoriteTabInline, favoritesTab === 'questions' && styles.favoriteTabInlineActive]} 
                onPress={() => setFavoritesTab('questions')}
              >
                <Text style={[styles.favoriteTabInlineText, favoritesTab === 'questions' && styles.favoriteTabInlineTextActive]}>
                  问题 ({favoritesData.questions.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.favoriteTabInline, favoritesTab === 'answers' && styles.favoriteTabInlineActive]} 
                onPress={() => setFavoritesTab('answers')}
              >
                <Text style={[styles.favoriteTabInlineText, favoritesTab === 'answers' && styles.favoriteTabInlineTextActive]}>
                  回答 ({favoritesData.answers.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.favoriteTabInline, favoritesTab === 'comments' && styles.favoriteTabInlineActive]} 
                onPress={() => setFavoritesTab('comments')}
              >
                <Text style={[styles.favoriteTabInlineText, favoritesTab === 'comments' && styles.favoriteTabInlineTextActive]}>
                  评论 ({favoritesData.comments.length})
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* 收藏内容列表 */}
            {getFavoritesData().map(item => (
              <TouchableOpacity key={item.id} style={styles.favoriteItem} onPress={() => handleFavoritePress(item)}>
                <View style={styles.favoriteItemContent}>
                  <Text style={styles.favoriteItemTitle}>{item.title}</Text>
                  <View style={styles.favoriteItemMeta}>
                    <Text style={styles.favoriteItemAuthor}>{item.author}</Text>
                    <Text style={styles.favoriteItemTime}>{item.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>

          {/* 浏览历史列表 */}
          <View style={{ display: activeTab === '浏览历史 (156)' ? 'flex' : 'none' }}>
            {historyList.map(item => (
              <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => handleHistoryPress(item)}>
                <View style={styles.historyItemContent}>
                  <Text style={styles.historyItemTitle}>{item.title}</Text>
                  <View style={styles.historyItemMeta}>
                    <Text style={styles.historyItemAuthor}>{item.author}</Text>
                    <Text style={styles.historyItemTime}>浏览于 {item.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => Alert.alert('查看全部', `查看全部${activeTab}`)}><Text style={styles.viewAllText}>查看全部</Text><Ionicons name="chevron-forward" size={16} color="#ef4444" /></TouchableOpacity>
        </View>

        {/* 退出登录 */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 我的收藏弹窗 */}
      <Modal visible={showFavoritesModal} animationType="slide">
        <SafeAreaView style={styles.listModal}>
          <View style={styles.listModalHeader}>
            <TouchableOpacity onPress={() => setShowFavoritesModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.listModalTitle}>我的收藏</Text>
            <View style={{ width: 24 }} />
          </View>
          {/* 收藏分类标签 */}
          <View style={styles.favoriteTabs}>
            <TouchableOpacity style={[styles.favoriteTab, favoritesTab === 'questions' && styles.favoriteTabActive]} onPress={() => setFavoritesTab('questions')}>
              <Text style={[styles.favoriteTabText, favoritesTab === 'questions' && styles.favoriteTabTextActive]}>收藏问题</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favoriteTab, favoritesTab === 'answers' && styles.favoriteTabActive]} onPress={() => setFavoritesTab('answers')}>
              <Text style={[styles.favoriteTabText, favoritesTab === 'answers' && styles.favoriteTabTextActive]}>收藏回答</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favoriteTab, favoritesTab === 'comments' && styles.favoriteTabActive]} onPress={() => setFavoritesTab('comments')}>
              <Text style={[styles.favoriteTabText, favoritesTab === 'comments' && styles.favoriteTabTextActive]}>收藏评论</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.listModalContent}>
            {getFavoritesData().map(item => (
              <TouchableOpacity key={item.id} style={styles.listItem} onPress={() => handleFavoritePress(item)}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <View style={styles.listItemMeta}>
                    <Text style={styles.listItemAuthor}>{item.author}</Text>
                    <Text style={styles.listItemTime}>{item.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 浏览历史弹窗 */}
      <Modal visible={showHistoryModal} animationType="slide">
        <SafeAreaView style={styles.listModal}>
          <View style={styles.listModalHeader}>
            <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.listModalTitle}>浏览历史</Text>
            <TouchableOpacity onPress={() => Alert.alert('清空历史', '确定要清空浏览历史吗？', [{ text: '取消', style: 'cancel' }, { text: '清空', style: 'destructive' }])}>
              <Text style={styles.clearText}>清空</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.listModalContent}>
            {historyList.map(item => (
              <TouchableOpacity key={item.id} style={styles.listItem} onPress={() => handleHistoryPress(item)}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <View style={styles.listItemMeta}>
                    <Text style={styles.listItemAuthor}>{item.author}</Text>
                    <Text style={styles.listItemTime}>{item.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 我的草稿弹窗 */}
      <Modal visible={showDraftsModal} animationType="slide">
        <SafeAreaView style={styles.listModal}>
          <View style={styles.listModalHeader}>
            <TouchableOpacity onPress={() => setShowDraftsModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.listModalTitle}>我的草稿</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.listModalContent}>
            {draftsList.map(item => (
              <View key={item.id} style={styles.draftItem}>
                <TouchableOpacity style={styles.draftContent} onPress={() => handleDraftPress(item)}>
                  <View style={styles.draftTypeTag}>
                    <Text style={styles.draftTypeText}>{item.type === 'question' ? '提问' : '回答'}</Text>
                  </View>
                  <View style={styles.draftInfo}>
                    <Text style={styles.draftTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.draftTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.draftDeleteBtn} onPress={() => handleDeleteDraft(item)}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  headerBg: { height: 120, backgroundColor: '#ef4444', paddingTop: 40 },
  headerActions: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16 },
  profileCard: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: -60, borderRadius: 16, padding: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', marginTop: -40 },
  profileInfo: { flex: 1, marginLeft: 12, marginTop: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },

  userId: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  userBio: { fontSize: 13, color: '#4b5563', marginTop: 12, lineHeight: 18 },
  userMeta: { flexDirection: 'row', gap: 16, marginTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#9ca3af' },
  indexRow: { flexDirection: 'row', marginTop: 16, backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, gap: 16 },
  indexItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  indexIconWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  indexInfo: { flex: 1 },
  indexLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 2 },
  indexValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  indexDivider: { width: 1, height: '100%', backgroundColor: '#e5e7eb' },
  statsRow: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  statLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  walletCard: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 16, padding: 16 },
  walletHeader: { flexDirection: 'row', alignItems: 'center' },
  walletIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  walletInfo: { flex: 1, marginLeft: 12 },
  walletLabel: { fontSize: 12, color: '#9ca3af' },
  walletBalance: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  walletActions: { flexDirection: 'row', gap: 8 },
  rechargeBtn: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  rechargeBtnText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  withdrawBtn: { borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  withdrawBtnText: { fontSize: 12, color: '#6b7280' },
  walletStats: { flexDirection: 'row', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  walletStatItem: { flex: 1, alignItems: 'center' },
  walletStatValue: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  walletStatLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  menuSection: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 14, color: '#1f2937' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuValue: { fontSize: 13, color: '#9ca3af', marginRight: 4 },
  contentSection: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 16 },
  contentTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  contentTabItem: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  contentTabText: { fontSize: 14, color: '#6b7280' },
  contentTabTextActive: { color: '#ef4444', fontWeight: '600' },
  contentTabIndicator: { position: 'absolute', bottom: 0, width: 40, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  questionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  questionTime: { fontSize: 11, color: '#9ca3af', marginLeft: 'auto' },
  rewardTagInline: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  rewardTagInlineText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  solvedTagInline: { backgroundColor: '#22c55e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  solvedTagInlineText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  questionTitle: { fontSize: 14, color: '#1f2937', lineHeight: 20 },
  questionStats: { flexDirection: 'row', gap: 12, marginTop: 8 },
  questionStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  questionStatText: { fontSize: 12, color: '#9ca3af' },
  viewAllBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  viewAllText: { fontSize: 13, color: '#ef4444' },
  answerItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  adoptedTagInline: { backgroundColor: '#22c55e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  adoptedTagInlineText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  answerTime: { fontSize: 11, color: '#9ca3af', marginLeft: 'auto' },
  answerQuestion: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  answerContent: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  answerStats: { flexDirection: 'row', gap: 12, marginTop: 8 },
  logoutBtn: { marginHorizontal: 12, marginTop: 12, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  logoutText: { fontSize: 15, color: '#ef4444', fontWeight: '500' },
  listModal: { flex: 1, backgroundColor: '#fff' },
  listModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  listModalTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  clearText: { fontSize: 14, color: '#ef4444' },
  listModalContent: { flex: 1 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  listItemContent: { flex: 1 },
  listItemTitle: { fontSize: 15, color: '#1f2937', lineHeight: 22 },
  listItemMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 12 },
  listItemAuthor: { fontSize: 12, color: '#6b7280' },
  listItemTime: { fontSize: 12, color: '#9ca3af' },
  favoriteTabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  favoriteTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  favoriteTabActive: { borderBottomColor: '#ef4444' },
  favoriteTabText: { fontSize: 14, color: '#6b7280' },
  favoriteTabTextActive: { color: '#ef4444', fontWeight: '600' },
  draftItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  draftContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  draftTypeTag: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  draftTypeText: { fontSize: 11, color: '#ef4444', fontWeight: '500' },
  draftInfo: { flex: 1, marginLeft: 12 },
  draftTitle: { fontSize: 14, color: '#1f2937', marginBottom: 4 },
  draftTime: { fontSize: 12, color: '#9ca3af' },
  draftDeleteBtn: { padding: 8 },
  // 内嵌收藏标签样式
  favoriteTabsInline: { flexDirection: 'row', backgroundColor: '#f9fafb', borderRadius: 8, padding: 4, margin: 12 },
  favoriteTabInline: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  favoriteTabInlineActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  favoriteTabInlineText: { fontSize: 13, color: '#6b7280' },
  favoriteTabInlineTextActive: { color: '#ef4444', fontWeight: '600' },
  favoriteItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  favoriteItemContent: { flex: 1 },
  favoriteItemTitle: { fontSize: 14, color: '#1f2937', lineHeight: 20, marginBottom: 6 },
  favoriteItemMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  favoriteItemAuthor: { fontSize: 12, color: '#9ca3af' },
  favoriteItemTime: { fontSize: 12, color: '#9ca3af' },
  // 浏览历史样式
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  historyItemContent: { flex: 1 },
  historyItemTitle: { fontSize: 14, color: '#1f2937', lineHeight: 20, marginBottom: 6 },
  historyItemMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyItemAuthor: { fontSize: 12, color: '#9ca3af' },
  historyItemTime: { fontSize: 12, color: '#9ca3af' },
  favoriteItemAuthor: { fontSize: 12, color: '#6b7280' },
  favoriteItemTime: { fontSize: 12, color: '#9ca3af' },
});
