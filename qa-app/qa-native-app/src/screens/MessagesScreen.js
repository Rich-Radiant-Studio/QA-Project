import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['通知', '私信'];

const notifications = [
  { id: 1, type: 'answer', user: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=python', content: '回答了你的问题', question: '如何在三个月内从零基础学会Python编程？', time: '1小时前', unread: true },
  { id: 2, type: 'like', user: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst', content: '赞了你的回答', question: 'Python和Java哪个更适合初学者？', time: '2小时前', unread: true },
  { id: 3, type: 'adopt', user: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', content: '采纳了你的回答', question: '如何在三个月内从零基础学会Python编程？', reward: 50, time: '3小时前', unread: false },
  { id: 4, type: 'follow', user: '职场导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=career', content: '关注了你', time: '昨天', unread: false },
  { id: 5, type: 'comment', user: '编程新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newbie', content: '评论了你的回答', question: '学Python需要什么基础？', time: '昨天', unread: false },
];

const messages = [
  { id: 1, user: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=python', lastMsg: '好的，我稍后给你发一份学习资料', time: '10分钟前', unread: 2 },
  { id: 2, user: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', lastMsg: '非常感谢你的回答！', time: '1小时前', unread: 0 },
  { id: 3, user: '系统消息', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=system', lastMsg: '你的提现申请已通过', time: '昨天', unread: 1, isSystem: true },
];

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState('通知');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer': return { name: 'chatbubble', color: '#3b82f6', bg: '#eff6ff' };
      case 'like': return { name: 'heart', color: '#ef4444', bg: '#fef2f2' };
      case 'adopt': return { name: 'checkmark-circle', color: '#22c55e', bg: '#f0fdf4' };
      case 'follow': return { name: 'person-add', color: '#a855f7', bg: '#faf5ff' };
      case 'comment': return { name: 'chatbubbles', color: '#f97316', bg: '#fff7ed' };
      default: return { name: 'notifications', color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>消息</Text>
        <TouchableOpacity><Text style={styles.markAllRead}>全部已读</Text></TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === '通知' ? (
          <View>
            {notifications.map(item => {
              const icon = getNotificationIcon(item.type);
              return (
                <TouchableOpacity key={item.id} style={[styles.notificationCard, item.unread && styles.unreadCard]}>
                  <View style={styles.notificationLeft}>
                    <Image source={{ uri: item.avatar }} style={styles.notificationAvatar} />
                    <View style={[styles.notificationIcon, { backgroundColor: icon.bg }]}>
                      <Ionicons name={icon.name} size={12} color={icon.color} />
                    </View>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationText}>
                      <Text style={styles.notificationUser}>{item.user}</Text> {item.content}
                    </Text>
                    {item.question && <Text style={styles.notificationQuestion} numberOfLines={1}>{item.question}</Text>}
                    {item.reward && <Text style={styles.rewardText}>+${item.reward}</Text>}
                    <Text style={styles.notificationTime}>{item.time}</Text>
                  </View>
                  {item.unread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View>
            {messages.map(item => (
              <TouchableOpacity key={item.id} style={styles.messageCard}>
                <View style={styles.messageAvatarWrapper}>
                  <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>{item.unread}</Text></View>
                  )}
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageUser}>{item.user}</Text>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.messagePreview} numberOfLines={1}>{item.lastMsg}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  markAllRead: { fontSize: 13, color: '#ef4444' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 30, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  content: { flex: 1 },
  notificationCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  unreadCard: { backgroundColor: '#fef2f2' },
  notificationLeft: { position: 'relative' },
  notificationAvatar: { width: 44, height: 44, borderRadius: 22 },
  notificationIcon: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  notificationContent: { flex: 1, marginLeft: 12 },
  notificationText: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  notificationUser: { fontWeight: '600', color: '#1f2937' },
  notificationQuestion: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  rewardText: { fontSize: 14, color: '#22c55e', fontWeight: '600', marginTop: 4 },
  notificationTime: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginTop: 6 },
  messageCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  messageAvatarWrapper: { position: 'relative' },
  messageAvatar: { width: 50, height: 50, borderRadius: 25 },
  unreadBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  unreadBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  messageContent: { flex: 1, marginLeft: 12 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  messageUser: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  messageTime: { fontSize: 12, color: '#9ca3af' },
  messagePreview: { fontSize: 13, color: '#6b7280', marginTop: 4 },
});
