import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 账号与安全页面
export function AccountSecurityScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账号与安全</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('修改密码', '请输入原密码和新密码')}>
            <Ionicons name="key-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>修改密码</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('绑定手机', '当前绑定：138****8888')}>
            <Ionicons name="phone-portrait-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>绑定手机</Text>
            <Text style={styles.menuValue}>138****8888</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('绑定邮箱', '未绑定邮箱')}>
            <Ionicons name="mail-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>绑定邮箱</Text>
            <Text style={styles.menuValue}>未绑定</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('微信', '已绑定')}>
            <Ionicons name="logo-wechat" size={20} color="#07c160" />
            <Text style={styles.menuLabel}>微信</Text>
            <Text style={styles.menuValue}>已绑定</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('QQ', '未绑定')}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#12b7f5" />
            <Text style={styles.menuLabel}>QQ</Text>
            <Text style={styles.menuValue}>未绑定</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Apple', '未绑定')}>
            <Ionicons name="logo-apple" size={20} color="#000" />
            <Text style={styles.menuLabel}>Apple</Text>
            <Text style={styles.menuValue}>未绑定</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('注销账号', '确定要注销账号吗？此操作不可恢复', [{ text: '取消' }, { text: '确定注销', style: 'destructive' }])}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={[styles.menuLabel, { color: '#ef4444' }]}>注销账号</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 隐私设置页面
export function PrivacySettingsScreen({ navigation }) {
  const [showOnline, setShowOnline] = useState(true);
  const [allowMessage, setAllowMessage] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showFollowing, setShowFollowing] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>隐私设置</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>在线状态</Text>
          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>显示在线状态</Text>
              <Text style={styles.switchDesc}>其他用户可以看到你是否在线</Text>
            </View>
            <Switch value={showOnline} onValueChange={setShowOnline} trackColor={{ true: '#ef4444' }} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>私信设置</Text>
          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>允许陌生人私信</Text>
              <Text style={styles.switchDesc}>关闭后只有互相关注的人可以私信你</Text>
            </View>
            <Switch value={allowMessage} onValueChange={setAllowMessage} trackColor={{ true: '#ef4444' }} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>个人主页</Text>
          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>展示我的动态</Text>
              <Text style={styles.switchDesc}>在个人主页展示我的提问和回答</Text>
            </View>
            <Switch value={showActivity} onValueChange={setShowActivity} trackColor={{ true: '#ef4444' }} />
          </View>
          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>展示我的关注</Text>
              <Text style={styles.switchDesc}>在个人主页展示我关注的人和话题</Text>
            </View>
            <Switch value={showFollowing} onValueChange={setShowFollowing} trackColor={{ true: '#ef4444' }} />
          </View>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('黑名单', '您的黑名单为空')}>
            <Ionicons name="ban-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>黑名单管理</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 帮助与反馈页面
export function HelpFeedbackScreen({ navigation }) {
  const faqs = [
    { q: '如何发布问题？', a: '点击底部"发布"按钮，填写问题标题和描述即可发布。' },
    { q: '如何设置悬赏？', a: '发布问题时可以选择悬赏金额，被采纳的回答者将获得悬赏。' },
    { q: '如何提现收益？', a: '进入"我的"-"钱包"，点击提现按钮即可申请提现。' },
    { q: '如何举报违规内容？', a: '点击内容右上角的"..."按钮，选择举报即可。' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>帮助与反馈</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          {faqs.map((faq, idx) => (
            <TouchableOpacity key={idx} style={styles.faqItem} onPress={() => Alert.alert(faq.q, faq.a)}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>联系我们</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('在线客服', '客服工作时间：9:00-21:00')}>
            <Ionicons name="chatbubbles-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>在线客服</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('客服热线', '400-xxx-xxxx')}>
            <Ionicons name="call-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>客服热线</Text>
            <Text style={styles.menuValue}>400-xxx-xxxx</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('意见反馈', '感谢您的反馈！')}>
            <Ionicons name="create-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>意见反馈</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 关于我们页面
export function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>关于我们</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.aboutLogo}>
          <View style={styles.logoCircle}>
            <Ionicons name="help-circle" size={50} color="#ef4444" />
          </View>
          <Text style={styles.appName}>问答社区</Text>
          <Text style={styles.version}>版本 1.0.0</Text>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('检查更新', '当前已是最新版本')}>
            <Ionicons name="refresh-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>检查更新</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('用户协议', '查看用户协议内容')}>
            <Ionicons name="document-text-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>用户协议</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('隐私政策', '查看隐私政策内容')}>
            <Ionicons name="shield-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>隐私政策</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('开源许可', '查看开源许可信息')}>
            <Ionicons name="code-outline" size={20} color="#6b7280" />
            <Text style={styles.menuLabel}>开源许可</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
        <Text style={styles.copyright}>© 2026 问答社区 All Rights Reserved</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// 编辑资料页面
export function EditProfileScreen({ navigation }) {
  const [nickname, setNickname] = useState('张三丰');
  const [bio, setBio] = useState('热爱学习，乐于分享。专注Python、数据分析领域。');
  const [gender, setGender] = useState('男');
  const [location, setLocation] = useState('北京');
  const [job, setJob] = useState('数据分析师');

  const handleSave = () => {
    Alert.alert('保存成功', '资料已更新');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑资料</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>保存</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#9ca3af" />
            </View>
            <View style={styles.avatarEditIcon}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </View>
          <Text style={styles.avatarHint}>点击更换头像</Text>
        </TouchableOpacity>
        <View style={styles.section}>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>昵称</Text>
            <TextInput style={styles.formInput} value={nickname} onChangeText={setNickname} placeholder="请输入昵称" />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>简介</Text>
            <TextInput style={[styles.formInput, styles.formTextarea]} value={bio} onChangeText={setBio} placeholder="介绍一下自己" multiline />
          </View>
          <TouchableOpacity style={styles.formItem} onPress={() => Alert.alert('选择性别', '', [{ text: '男', onPress: () => setGender('男') }, { text: '女', onPress: () => setGender('女') }, { text: '取消' }])}>
            <Text style={styles.formLabel}>性别</Text>
            <View style={styles.formSelect}>
              <Text style={styles.formSelectText}>{gender}</Text>
              <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </View>
          </TouchableOpacity>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>所在地</Text>
            <TextInput style={styles.formInput} value={location} onChangeText={setLocation} placeholder="请输入所在地" />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>职业</Text>
            <TextInput style={styles.formInput} value={job} onChangeText={setJob} placeholder="请输入职业" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 粉丝列表页面
export function FansScreen({ navigation }) {
  const fans = [
    { id: 1, name: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan1', bio: 'Python爱好者', isFollowing: false },
    { id: 2, name: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan2', bio: '数据分析师', isFollowing: true },
    { id: 3, name: '小刚', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan3', bio: '前端开发', isFollowing: false },
    { id: 4, name: '小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan4', bio: '产品经理', isFollowing: true },
  ];
  const [followState, setFollowState] = useState({});

  const toggleFollow = (id) => {
    setFollowState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的粉丝</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content}>
        {fans.map(fan => (
          <View key={fan.id} style={styles.userItem}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={24} color="#9ca3af" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{fan.name}</Text>
              <Text style={styles.userBio}>{fan.bio}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.followBtn, (fan.isFollowing || followState[fan.id]) && styles.followingBtn]}
              onPress={() => toggleFollow(fan.id)}
            >
              <Text style={[styles.followBtnText, (fan.isFollowing || followState[fan.id]) && styles.followingBtnText]}>
                {(fan.isFollowing || followState[fan.id]) ? '互相关注' : '回关'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// 我的群聊列表页面
export function MyGroupsScreen({ navigation }) {
  const groups = [
    { id: 1, name: 'Python学习交流群', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group1', memberCount: 128, lastMessage: '有人知道怎么安装numpy吗？', time: '10分钟前' },
    { id: 2, name: '职业发展讨论群', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group2', memberCount: 256, lastMessage: '35岁转行真的来得及吗', time: '1小时前' },
    { id: 3, name: '养猫交流群', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group3', memberCount: 89, lastMessage: '我家猫今天又拆家了...', time: '昨天' },
    { id: 4, name: '数据分析学习群', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group4', memberCount: 167, lastMessage: 'SQL和Python哪个更重要？', time: '2天前' },
    { id: 5, name: '健康养生群', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group5', memberCount: 203, lastMessage: '失眠的朋友可以试试这个方法', time: '3天前' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的群聊</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content}>
        {groups.map(group => (
          <TouchableOpacity 
            key={group.id} 
            style={styles.groupItem}
            onPress={() => navigation.navigate('GroupChat', { question: { title: group.name, author: '群主', avatar: group.avatar, memberCount: group.memberCount } })}
          >
            <View style={styles.groupAvatar}>
              <Ionicons name="people" size={24} color="#a855f7" />
            </View>
            <View style={styles.groupInfo}>
              <View style={styles.groupNameRow}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupTime}>{group.time}</Text>
              </View>
              <View style={styles.groupMetaRow}>
                <Text style={styles.groupLastMsg} numberOfLines={1}>{group.lastMessage}</Text>
                <Text style={styles.groupMemberCount}>{group.memberCount}人</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  saveBtn: { fontSize: 15, color: '#ef4444', fontWeight: '500' },
  content: { flex: 1 },
  section: { backgroundColor: '#fff', marginTop: 12, borderRadius: 0 },
  sectionTitle: { fontSize: 13, color: '#9ca3af', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1f2937' },
  menuValue: { fontSize: 14, color: '#9ca3af', marginRight: 8 },
  switchItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  switchInfo: { flex: 1 },
  switchLabel: { fontSize: 15, color: '#1f2937' },
  switchDesc: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  faqItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  faqQuestion: { flex: 1, fontSize: 15, color: '#1f2937' },
  aboutLogo: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  appName: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  version: { fontSize: 14, color: '#9ca3af', marginTop: 4 },
  copyright: { textAlign: 'center', fontSize: 12, color: '#9ca3af', paddingVertical: 24 },
  avatarSection: { alignItems: 'center', paddingVertical: 24, backgroundColor: '#fff' },
  avatarWrapper: { position: 'relative' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  avatarEditIcon: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  avatarHint: { fontSize: 13, color: '#9ca3af', marginTop: 8 },
  formItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  formLabel: { width: 60, fontSize: 15, color: '#6b7280' },
  formInput: { flex: 1, fontSize: 15, color: '#1f2937', textAlign: 'right' },
  formTextarea: { minHeight: 60, textAlignVertical: 'top' },
  formSelect: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  formSelectText: { fontSize: 15, color: '#1f2937', marginRight: 4 },
  userItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  userBio: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  followBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: '#ef4444' },
  followingBtn: { backgroundColor: '#f3f4f6' },
  followBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  followingBtnText: { color: '#6b7280' },
  groupItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  groupAvatar: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center' },
  groupInfo: { flex: 1, marginLeft: 12 },
  groupNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  groupName: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  groupTime: { fontSize: 12, color: '#9ca3af' },
  groupMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  groupLastMsg: { flex: 1, fontSize: 13, color: '#6b7280' },
  groupMemberCount: { fontSize: 12, color: '#9ca3af', marginLeft: 8 },
});
