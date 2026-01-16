import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['全部', '回复我的', '@我的', '系统'];
const urgencyFilters = [
  { key: 'all', label: '全部', color: null },
  { key: 'urgent', label: '紧急', color: '#ef4444' },
  { key: 'important', label: '重要', color: '#f59e0b' },
  { key: 'normal', label: '普通', color: '#3b82f6' },
];

const messages = [
  { id: 1, type: 'system', urgency: 'urgent', icon: 'alert-circle', iconBg: '#fef2f2', iconColor: '#ef4444', title: '悬赏问题即将过期', content: '您发布的悬赏问题「如何在三个月内从零基础学会Python编程？」将在2小时后过期，目前有3个待采纳回答。', time: '5分钟前', actions: ['立即处理', '延长时间'] },
  { id: 2, type: 'user', urgency: 'urgent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg1', name: 'Python老司机', verified: true, content: '回答了您的悬赏问题，并请求您尽快采纳：「作为一个从零开始学Python的过来人，我来分享一下我的经验...」', time: '10分钟前', actions: ['查看回答', '采纳'] },
  { id: 3, type: 'system', urgency: 'important', icon: 'notifications', iconBg: '#fef3c7', iconColor: '#f59e0b', title: '账户余额提醒', content: '您的账户余额不足 $20，可能影响悬赏问题的发布。建议及时充值。', time: '30分钟前', actions: ['立即充值'] },
  { id: 4, type: 'user', urgency: 'normal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg2', name: '数据分析师小王', content: '回复了您的评论：「谢谢分享！我也是文科转行的，你的建议很有帮助~」', time: '1小时前' },
  { id: 5, type: 'user', urgency: 'normal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg3', name: '编程新手', content: '赞了您的回答：「如何在三个月内从零基础学会Python编程？」', time: '2小时前' },
  { id: 6, type: 'system', urgency: null, icon: 'settings', iconBg: '#f3f4f6', iconColor: '#6b7280', title: '系统通知', content: '您关注的话题「#Python学习」有5个新问题，点击查看。', time: '3小时前' },
  { id: 7, type: 'user', urgency: null, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg4', name: '美食达人', content: '关注了您', time: '5小时前', actions: ['回关'] },
  { id: 8, type: 'system', urgency: null, icon: 'checkmark-circle', iconBg: '#dcfce7', iconColor: '#22c55e', title: '回答被采纳', content: '恭喜！您在问题「第一次养猫需要准备什么？」的回答被采纳，获得 $20 奖励。', time: '昨天' },
];

export default function MessagesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('全部');
  const [activeFilter, setActiveFilter] = useState('all');

  const getUrgencyStyle = (urgency) => {
    if (urgency === 'urgent') return { borderLeftColor: '#ef4444', borderLeftWidth: 4 };
    if (urgency === 'important') return { borderLeftColor: '#f59e0b', borderLeftWidth: 4 };
    if (urgency === 'normal') return { borderLeftColor: '#3b82f6', borderLeftWidth: 4 };
    return {};
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>消息</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity><Text style={styles.markAllRead}>全部已读</Text></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 12 }}><Ionicons name="settings-outline" size={22} color="#4b5563" /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* 紧急程度筛选 */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {urgencyFilters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterBtn, activeFilter === filter.key && styles.filterBtnActive]}
              onPress={() => setActiveFilter(filter.key)}
            >
              {filter.color && <View style={[styles.filterDot, { backgroundColor: filter.color }]} />}
              <Text style={[styles.filterText, activeFilter === filter.key && styles.filterTextActive]}>{filter.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {messages.map(item => (
          <View key={item.id} style={[styles.messageCard, getUrgencyStyle(item.urgency)]}>
            <View style={styles.messageHeader}>
              {item.type === 'system' ? (
                <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
              ) : (
                <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
              )}
              <View style={styles.messageInfo}>
                <View style={styles.messageNameRow}>
                  <Text style={styles.messageName}>{item.type === 'system' ? item.title : item.name}</Text>
                  {item.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                  {item.urgency === 'urgent' && <View style={styles.urgentTag}><Text style={styles.urgentTagText}>紧急</Text></View>}
                  {item.urgency === 'important' && <View style={styles.importantTag}><Text style={styles.importantTagText}>重要</Text></View>}
                </View>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
            </View>
            <Text style={styles.messageContent}>{item.content}</Text>
            {item.actions && (
              <View style={styles.messageActions}>
                {item.actions.map((action, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.actionBtn, idx === 0 && item.urgency && styles.actionBtnPrimary]}
                  >
                    <Text style={[styles.actionBtnText, idx === 0 && item.urgency && styles.actionBtnTextPrimary]}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  markAllRead: { fontSize: 13, color: '#6b7280' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 30, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  filterSection: { backgroundColor: '#fff', marginTop: 8, paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 16 },
  filterBtnActive: { backgroundColor: '#ef4444' },
  filterDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  filterText: { fontSize: 12, color: '#6b7280' },
  filterTextActive: { color: '#fff' },
  content: { flex: 1 },
  messageCard: { backgroundColor: '#fff', marginTop: 8, padding: 12 },
  messageHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrapper: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  messageAvatar: { width: 40, height: 40, borderRadius: 20 },
  messageInfo: { flex: 1, marginLeft: 10 },
  messageNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  messageName: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  urgentTag: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  urgentTagText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  importantTag: { backgroundColor: '#f59e0b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  importantTagText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  messageTime: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  messageContent: { fontSize: 14, color: '#4b5563', lineHeight: 20, marginTop: 8 },
  messageActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14 },
  actionBtnPrimary: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  actionBtnText: { fontSize: 12, color: '#6b7280' },
  actionBtnTextPrimary: { color: '#fff' },
});
