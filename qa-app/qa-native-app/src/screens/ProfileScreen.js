import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stats = [
  { label: '提问', value: '12' },
  { label: '回答', value: '56' },
  { label: '获赞', value: '1.2k' },
  { label: '粉丝', value: '368' },
];

const menuItems = [
  { icon: 'wallet-outline', label: '我的钱包', value: '$256.50', color: '#f97316' },
  { icon: 'star-outline', label: '我的收藏', value: '23', color: '#eab308' },
  { icon: 'time-outline', label: '浏览历史', value: '', color: '#3b82f6' },
  { icon: 'document-text-outline', label: '我的草稿', value: '3', color: '#22c55e' },
  { icon: 'shield-checkmark-outline', label: '账号安全', value: '', color: '#a855f7' },
  { icon: 'settings-outline', label: '设置', value: '', color: '#6b7280' },
];

const myQuestions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', type: 'reward', reward: 50, answers: 56, status: 'active' },
  { id: 2, title: 'React和Vue哪个更适合新手？', type: 'free', answers: 23, status: 'solved' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile' }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>我的昵称</Text>
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
              </View>
              <Text style={styles.userBio}>热爱学习，乐于分享</Text>
              <Text style={styles.userId}>ID: 12345678</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* 统计数据 */}
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <TouchableOpacity key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 功能菜单 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 我的问题 */}
        <View style={styles.questionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的问题</Text>
            <TouchableOpacity><Text style={styles.viewAll}>查看全部</Text></TouchableOpacity>
          </View>
          {myQuestions.map(q => (
            <TouchableOpacity key={q.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                {q.type === 'reward' ? (
                  <View style={styles.rewardTag}><Text style={styles.rewardTagText}>悬赏 ${q.reward}</Text></View>
                ) : (
                  <View style={styles.freeTag}><Text style={styles.freeTagText}>免费</Text></View>
                )}
                {q.status === 'solved' && (
                  <View style={styles.solvedTag}><Text style={styles.solvedTagText}>已解决</Text></View>
                )}
              </View>
              <Text style={styles.questionTitle} numberOfLines={2}>{q.title}</Text>
              <Text style={styles.questionStats}>{q.answers} 回答</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 退出登录 */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  profileCard: { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  userBio: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  userId: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  editBtn: { padding: 8 },
  statsRow: { flexDirection: 'row', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  menuSection: { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1f2937' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuValue: { fontSize: 14, color: '#6b7280', marginRight: 4 },
  questionsSection: { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  viewAll: { fontSize: 13, color: '#ef4444' },
  questionCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  questionHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  rewardTag: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  rewardTagText: { fontSize: 11, color: '#ef4444', fontWeight: '500' },
  freeTag: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  freeTagText: { fontSize: 11, color: '#22c55e', fontWeight: '500' },
  solvedTag: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  solvedTagText: { fontSize: 11, color: '#3b82f6', fontWeight: '500' },
  questionTitle: { fontSize: 14, color: '#1f2937', lineHeight: 20 },
  questionStats: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
  logoutBtn: { marginHorizontal: 12, marginVertical: 20, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  logoutText: { fontSize: 15, color: '#ef4444' },
});
