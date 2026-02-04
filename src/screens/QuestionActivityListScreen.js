import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const activitiesData = [
  { id: 1, title: 'Python学习交流会', type: '线上活动', date: '2026-01-20', time: '19:00-21:00', location: '腾讯会议', participants: 45, maxParticipants: 100, organizer: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', status: '报名中', description: '本次活动将邀请多位Python专家分享学习经验和实战技巧,适合零基础和有一定基础的学习者参加。' },
  { id: 2, title: 'Python实战项目分享', type: '线下活动', date: '2026-01-25', time: '14:00-17:00', location: '北京市海淀区中关村创业大街', participants: 28, maxParticipants: 50, organizer: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', status: '报名中', description: '分享真实的Python项目开发经验,包括数据分析、Web开发等多个方向。' },
  { id: 3, title: '数据分析入门讲座', type: '线上活动', date: '2026-01-18', time: '20:00-21:30', location: 'Zoom会议', participants: 120, maxParticipants: 200, organizer: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', status: '即将开始', description: '从零开始学习数据分析,掌握Python数据分析的核心技能。' },
];

export default function QuestionActivityListScreen({ navigation, route }) {
  const { questionId, questionTitle } = route?.params || {};
  const [joinedActivities, setJoinedActivities] = useState({});
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ 
    title: '', 
    description: '', 
    startDate: '', 
    startTime: '', 
    endDate: '', 
    endTime: '', 
    location: '', 
    maxParticipants: '', 
    activityType: '线上活动' 
  });

  const handleJoinActivity = (activityId) => {
    setJoinedActivities({ ...joinedActivities, [activityId]: !joinedActivities[activityId] });
    if (!joinedActivities[activityId]) {
      alert('报名成功!');
    } else {
      alert('已取消报名');
    }
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
    setActivityForm({ 
      title: '', 
      description: '', 
      startDate: '', 
      startTime: '', 
      endDate: '', 
      endTime: '', 
      location: '', 
      maxParticipants: '', 
      activityType: '线上活动' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>相关活动</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{questionTitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.publishBtn} 
          onPress={() => setShowActivityModal(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Text style={styles.publishBtnText}>发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activitiesData.length}</Text>
            <Text style={styles.statLabel}>活动总数</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activitiesData.filter(a => a.status === '报名中').length}</Text>
            <Text style={styles.statLabel}>报名中</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activitiesData.reduce((sum, a) => sum + a.participants, 0)}</Text>
            <Text style={styles.statLabel}>参与人数</Text>
          </View>
        </View>

        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>活动列表</Text>
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="filter-outline" size={16} color="#6b7280" />
              <Text style={styles.filterText}>筛选</Text>
            </TouchableOpacity>
          </View>

          {activitiesData.map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              activeOpacity={0.7}
            >
              <View style={styles.activityHeader}>
                <View style={styles.activityTypeTag}>
                  <Ionicons 
                    name={activity.type === '线上活动' ? 'videocam' : 'location'} 
                    size={12} 
                    color={activity.type === '线上活动' ? '#3b82f6' : '#22c55e'} 
                  />
                  <Text style={[styles.activityTypeText, { color: activity.type === '线上活动' ? '#3b82f6' : '#22c55e' }]}>
                    {activity.type}
                  </Text>
                </View>
                <View style={[styles.activityStatusTag, activity.status === '即将开始' && styles.activityStatusTagUrgent]}>
                  <Text style={[styles.activityStatusText, activity.status === '即将开始' && styles.activityStatusTextUrgent]}>
                    {activity.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription} numberOfLines={2}>{activity.description}</Text>

              <View style={styles.activityInfo}>
                <View style={styles.activityInfoRow}>
                  <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                  <Text style={styles.activityInfoText}>{activity.date} {activity.time}</Text>
                </View>
                <View style={styles.activityInfoRow}>
                  <Ionicons name={activity.type === '线上活动' ? 'videocam-outline' : 'location-outline'} size={14} color="#9ca3af" />
                  <Text style={styles.activityInfoText} numberOfLines={1}>{activity.location}</Text>
                </View>
              </View>

              <View style={styles.activityFooter}>
                <View style={styles.activityOrganizer}>
                  <Image source={{ uri: activity.avatar }} style={styles.organizerAvatar} />
                  <View style={styles.organizerInfo}>
                    <Text style={styles.organizerLabel}>发起人</Text>
                    <Text style={styles.organizerName}>{activity.organizer}</Text>
                  </View>
                </View>
                <View style={styles.activityActions}>
                  <View style={styles.participantsInfo}>
                    <Ionicons name="people" size={14} color="#6b7280" />
                    <Text style={styles.participantsText}>{activity.participants}/{activity.maxParticipants}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.joinBtn, joinedActivities[activity.id] && styles.joinBtnActive]}
                    onPress={() => handleJoinActivity(activity.id)}
                  >
                    <Ionicons 
                      name={joinedActivities[activity.id] ? "checkmark-circle" : "add-circle-outline"} 
                      size={16} 
                      color={joinedActivities[activity.id] ? "#22c55e" : "#fff"} 
                    />
                    <Text style={[styles.joinBtnText, joinedActivities[activity.id] && styles.joinBtnTextActive]}>
                      {joinedActivities[activity.id] ? '已报名' : '立即报名'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>

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
            <Text style={styles.boundQuestionText} numberOfLines={2}>{questionTitle}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, marginHorizontal: 12 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  headerSubtitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  publishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  publishBtnText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  content: { flex: 1 },
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 16, marginBottom: 8 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#9ca3af' },
  statDivider: { width: 1, height: 30, backgroundColor: '#e5e7eb' },
  activitiesSection: { backgroundColor: '#fff', paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' },
  filterText: { fontSize: 13, color: '#6b7280' },
  activityCard: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  activityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  activityTypeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f0f9ff' },
  activityTypeText: { fontSize: 11, fontWeight: '500' },
  activityStatusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f0fdf4' },
  activityStatusTagUrgent: { backgroundColor: '#fef3c7' },
  activityStatusText: { fontSize: 11, fontWeight: '500', color: '#22c55e' },
  activityStatusTextUrgent: { color: '#f59e0b' },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
  activityDescription: { fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 12 },
  activityInfo: { gap: 8, marginBottom: 12 },
  activityInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityInfoText: { fontSize: 13, color: '#6b7280', flex: 1 },
  activityFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  activityOrganizer: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  organizerAvatar: { width: 32, height: 32, borderRadius: 16 },
  organizerInfo: { flex: 1 },
  organizerLabel: { fontSize: 10, color: '#9ca3af' },
  organizerName: { fontSize: 13, fontWeight: '500', color: '#374151' },
  activityActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  participantsInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  participantsText: { fontSize: 12, color: '#6b7280' },
  joinBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  joinBtnActive: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#22c55e' },
  joinBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  joinBtnTextActive: { color: '#22c55e' },
  emptySpace: { height: 20 },
  // 发起活动弹窗样式
  activityModal: { flex: 1, backgroundColor: '#fff' },
  activityModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  activityCloseBtn: { padding: 4 },
  activityHeaderCenter: { flex: 1, alignItems: 'center' },
  activityModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  activityPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  activityPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  activityPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  activityPublishTextDisabled: { color: '#fff' },
  boundQuestionCard: { backgroundColor: '#f0fdf4', padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#22c55e' },
  boundQuestionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  boundQuestionLabel: { fontSize: 12, fontWeight: '500', color: '#22c55e' },
  boundQuestionText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  activityFormArea: { flex: 1, padding: 16 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  formInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  formTextarea: { minHeight: 100, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row', alignItems: 'center' },
  formSelectBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
  formSelectText: { fontSize: 15, color: '#6b7280', flex: 1 },
  formInputWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12 },
  formInputInner: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  activityTypeSelector: { flexDirection: 'row', gap: 12 },
  activityTypeSelectorBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb', gap: 8 },
  activityTypeSelectorBtnActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  activityTypeSelectorText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  activityTypeSelectorTextActive: { color: '#fff' },
});
