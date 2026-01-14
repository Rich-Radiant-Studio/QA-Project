import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stats = [
  { label: '关注', value: '128' },
  { label: '粉丝', value: '1.2k' },
  { label: '提问', value: '56' },
  { label: '回答', value: '234' },
  { label: '获赞', value: '8.9k' },
];

const menuItems = [
  { icon: 'star', label: '我的收藏', value: '89', color: '#eab308' },
  { icon: 'time', label: '浏览历史', value: '', color: '#3b82f6' },
  { icon: 'document-text', label: '我的草稿', value: '3', color: '#22c55e' },
  { icon: 'people', label: '我的群聊', value: '5', color: '#a855f7' },
];

const settingsItems = [
  { icon: 'shield-checkmark', label: '账号与安全', color: '#6b7280' },
  { icon: 'notifications', label: '消息通知', color: '#6b7280' },
  { icon: 'lock-closed', label: '隐私设置', color: '#6b7280' },
  { icon: 'help-circle', label: '帮助与反馈', color: '#6b7280' },
  { icon: 'information-circle', label: '关于我们', color: '#6b7280' },
];

const myQuestions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', type: 'reward', reward: 50, views: '1.2k', comments: 56, likes: 128, time: '2小时前' },
  { id: 2, title: '第一次养猫需要准备什么？', type: 'free', solved: true, views: '2.5k', comments: 89, likes: 256, time: '昨天' },
  { id: 3, title: '35岁程序员如何规划职业发展？', type: 'reward', reward: 100, views: '5.6k', comments: 456, likes: 1200, time: '3天前' },
];

const contentTabs = ['我的提问', '我的回答', '获得赞同'];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('我的提问');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顶部背景 */}
        <View style={styles.headerBg}>
          <View style={styles.headerActions}>
            <TouchableOpacity><Ionicons name="share-social-outline" size={22} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }}><Ionicons name="settings-outline" size={22} color="#fff" /></TouchableOpacity>
          </View>
        </View>

        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=myuser' }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>张三丰</Text>
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <View style={styles.levelTag}><Text style={styles.levelText}>Lv.5</Text></View>
              </View>
              <Text style={styles.userId}>ID: 12345678</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>编辑资料</Text></TouchableOpacity>
          </View>
          <Text style={styles.userBio}>热爱学习，乐于分享。专注Python、数据分析领域。</Text>
          <View style={styles.userMeta}>
            <View style={styles.metaItem}><Ionicons name="location-outline" size={14} color="#9ca3af" /><Text style={styles.metaText}>北京</Text></View>
            <View style={styles.metaItem}><Ionicons name="briefcase-outline" size={14} color="#9ca3af" /><Text style={styles.metaText}>数据分析师</Text></View>
          </View>
          <View style={styles.statsRow}>
            {stats.map((stat, idx) => (
              <TouchableOpacity key={idx} style={styles.statItem}>
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
              <TouchableOpacity style={styles.rechargeBtn}><Text style={styles.rechargeBtnText}>充值</Text></TouchableOpacity>
              <TouchableOpacity style={styles.withdrawBtn}><Text style={styles.withdrawBtnText}>提现</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.walletStats}>
            <View style={styles.walletStatItem}><Text style={styles.walletStatValue}>$150.00</Text><Text style={styles.walletStatLabel}>悬赏支出</Text></View>
            <View style={styles.walletStatItem}><Text style={[styles.walletStatValue, { color: '#22c55e' }]}>$320.00</Text><Text style={styles.walletStatLabel}>回答收入</Text></View>
            <View style={styles.walletStatItem}><Text style={styles.walletStatValue}>12</Text><Text style={styles.walletStatLabel}>待采纳</Text></View>
          </View>
        </View>

        {/* 功能菜单 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
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
          {myQuestions.map(q => (
            <TouchableOpacity key={q.id} style={styles.questionItem}>
              <View style={styles.questionHeader}>
                {q.type === 'reward' ? (
                  <View style={styles.rewardTag}><Text style={styles.rewardTagText}>悬赏 ${q.reward}</Text></View>
                ) : (
                  <View style={styles.freeTag}><Text style={styles.freeTagText}>免费</Text></View>
                )}
                {q.solved && <View style={styles.solvedTag}><Text style={styles.solvedTagText}>已解决</Text></View>}
                <Text style={styles.questionTime}>{q.time}</Text>
              </View>
              <Text style={styles.questionTitle}>{q.title}</Text>
              <View style={styles.questionStats}>
                <Text style={styles.questionStat}><Ionicons name="eye-outline" size={12} color="#9ca3af" /> {q.views}</Text>
                <Text style={styles.questionStat}><Ionicons name="chatbubble-outline" size={12} color="#9ca3af" /> {q.comments}</Text>
                <Text style={styles.questionStat}><Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" /> {q.likes}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllBtn}><Text style={styles.viewAllText}>查看全部</Text><Ionicons name="chevron-forward" size={16} color="#ef4444" /></TouchableOpacity>
        </View>

        {/* 更多设置 */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
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
  levelTag: { backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  levelText: { fontSize: 10, color: '#d97706', fontWeight: '500' },
  userId: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14 },
  editBtnText: { fontSize: 12, color: '#6b7280' },
  userBio: { fontSize: 13, color: '#4b5563', marginTop: 12, lineHeight: 18 },
  userMeta: { flexDirection: 'row', gap: 16, marginTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#9ca3af' },
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
  rewardTag: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  rewardTagText: { fontSize: 11, color: '#ef4444', fontWeight: '500' },
  freeTag: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  freeTagText: { fontSize: 11, color: '#22c55e', fontWeight: '500' },
  solvedTag: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 6 },
  solvedTagText: { fontSize: 11, color: '#16a34a', fontWeight: '500' },
  questionTime: { fontSize: 11, color: '#9ca3af', marginLeft: 'auto' },
  questionTitle: { fontSize: 14, color: '#1f2937', lineHeight: 20 },
  questionStats: { flexDirection: 'row', gap: 12, marginTop: 8 },
  questionStat: { fontSize: 12, color: '#9ca3af' },
  viewAllBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  viewAllText: { fontSize: 13, color: '#ef4444' },
  settingsSection: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 16, overflow: 'hidden' },
});
