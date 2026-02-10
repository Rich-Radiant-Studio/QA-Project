import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';

export default function SettingsScreen({ navigation }) {
  // 通知设置状态
  const [pushEnabled, setPushEnabled] = useState(true);
  const [likeNotify, setLikeNotify] = useState(true);
  const [commentNotify, setCommentNotify] = useState(true);
  const [followNotify, setFollowNotify] = useState(true);
  const [systemNotify, setSystemNotify] = useState(true);

  // 隐私设置状态
  const [showOnline, setShowOnline] = useState(true);
  const [allowMessage, setAllowMessage] = useState(true);

  // 编辑资料弹窗状态
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // 用户资料数据
  const [userProfile, setUserProfile] = useState({
    name: '张三丰',
    bio: '热爱学习，乐于分享。专注Python、数据分析领域。',
    location: '北京',
    occupation: '数据分析师',
    gender: '男',
    birthday: '1990-01-01',
  });

  const handleEditProfile = (field, title, currentValue) => {
    setEditField(field);
    setEditTitle(title);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setUserProfile({ ...userProfile, [editField]: editValue });
    setShowEditModal(false);
    Alert.alert('保存成功', '资料已更新');
  };

  const handleChangeAvatar = () => {
    Alert.alert('更换头像', '选择头像来源', [
      { text: '拍照', onPress: () => Alert.alert('拍照', '打开相机') },
      { text: '从相册选择', onPress: () => Alert.alert('相册', '打开相册') },
      { text: '取消', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 账号信息 */}
        <View style={styles.accountSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleChangeAvatar}>
            <Avatar uri="https://api.dicebear.com/7.x/avataaars/svg?seed=myuser" name={userProfile.name} size={70} />
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.accountText}>
            <Text style={styles.accountName}>{userProfile.name}</Text>
            <Text style={styles.accountId}>ID: 123456789</Text>
          </View>
        </View>

        {/* 编辑资料 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>个人资料</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleEditProfile('name', '昵称', userProfile.name)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>昵称</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleEditProfile('bio', '个人简介', userProfile.bio)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>个人简介</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={[styles.menuValue, { maxWidth: 180 }]} numberOfLines={1}>{userProfile.bio}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('性别', '选择性别', [
                { text: '男', onPress: () => setUserProfile({ ...userProfile, gender: '男' }) },
                { text: '女', onPress: () => setUserProfile({ ...userProfile, gender: '女' }) },
                { text: '保密', onPress: () => setUserProfile({ ...userProfile, gender: '保密' }) },
                { text: '取消', style: 'cancel' }
              ])}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="male-female-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>性别</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.gender}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('生日', '选择生日日期')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="calendar-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>生日</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.birthday}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleEditProfile('location', '所在地', userProfile.location)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="location-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>所在地</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.location}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => handleEditProfile('occupation', '职业', userProfile.occupation)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="briefcase-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>职业</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.occupation}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 账号与安全 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>账号与安全</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('修改密码', '请输入原密码和新密码')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="key-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>修改密码</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('绑定手机', '当前绑定：138****8888')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="phone-portrait-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>绑定手机</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>138****8888</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert('绑定邮箱', '未绑定邮箱')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="mail-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>绑定邮箱</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>未绑定</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 消息通知 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>消息通知</Text>
          <View style={styles.section}>
            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="notifications-outline" size={22} color="#6b7280" />
                <View style={styles.switchInfo}>
                  <Text style={styles.menuLabel}>推送通知</Text>
                  <Text style={styles.switchDesc}>接收应用推送消息</Text>
                </View>
              </View>
              <Switch 
                value={pushEnabled} 
                onValueChange={setPushEnabled}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={pushEnabled ? '#ef4444' : '#f3f4f6'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="heart-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>点赞通知</Text>
              </View>
              <Switch 
                value={likeNotify} 
                onValueChange={setLikeNotify}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={likeNotify ? '#ef4444' : '#f3f4f6'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="chatbubble-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>评论通知</Text>
              </View>
              <Switch 
                value={commentNotify} 
                onValueChange={setCommentNotify}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={commentNotify ? '#ef4444' : '#f3f4f6'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="person-add-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>关注通知</Text>
              </View>
              <Switch 
                value={followNotify} 
                onValueChange={setFollowNotify}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={followNotify ? '#ef4444' : '#f3f4f6'}
              />
            </View>

            <View style={[styles.switchItem, styles.menuItemLast]}>
              <View style={styles.menuLeft}>
                <Ionicons name="megaphone-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>系统通知</Text>
              </View>
              <Switch 
                value={systemNotify} 
                onValueChange={setSystemNotify}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={systemNotify ? '#ef4444' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* 隐私设置 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>隐私设置</Text>
          <View style={styles.section}>
            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="eye-outline" size={22} color="#6b7280" />
                <View style={styles.switchInfo}>
                  <Text style={styles.menuLabel}>显示在线状态</Text>
                  <Text style={styles.switchDesc}>其他用户可以看到你是否在线</Text>
                </View>
              </View>
              <Switch 
                value={showOnline} 
                onValueChange={setShowOnline}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={showOnline ? '#ef4444' : '#f3f4f6'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="mail-open-outline" size={22} color="#6b7280" />
                <View style={styles.switchInfo}>
                  <Text style={styles.menuLabel}>允许陌生人私信</Text>
                  <Text style={styles.switchDesc}>关闭后只有互相关注的人可以私信</Text>
                </View>
              </View>
              <Switch 
                value={allowMessage} 
                onValueChange={setAllowMessage}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={allowMessage ? '#ef4444' : '#f3f4f6'}
              />
            </View>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert('黑名单', '您的黑名单为空')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="ban-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>黑名单管理</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 通用设置 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>通用</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('清除缓存', '确定要清除缓存吗？', [
                { text: '取消', style: 'cancel' },
                { text: '确定', onPress: () => Alert.alert('成功', '缓存已清除') }
              ])}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="trash-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>清除缓存</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>128.5 MB</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert('语言设置', '当前语言：简体中文')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="language-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>语言</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>简体中文</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 钱包与超级赞 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>钱包与超级赞</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('SuperLikePurchase')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="star" size={22} color="#f59e0b" />
                <Text style={styles.menuLabel}>购买超级赞</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigation.navigate('SuperLikeHistory')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="time-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>超级赞历史</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 帮助与反馈 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>帮助与反馈</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('常见问题', '查看常见问题解答')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>常见问题</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('在线客服', '客服工作时间：9:00-21:00')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="chatbubbles-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>在线客服</Text>
              </View>
              <View style={styles.menuRight}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>在线</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert('意见反馈', '感谢您的反馈！')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="create-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>意见反馈</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 关于我们 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>关于</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('检查更新', '当前已是最新版本 v1.0.0')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="refresh-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>检查更新</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>v1.0.0</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('用户协议', '查看用户协议内容')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>用户协议</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('隐私政策', '查看隐私政策内容')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="shield-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>隐私政策</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert('关于我们', '问答社区 v1.0.0\n\n© 2026 All Rights Reserved')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>关于我们</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 退出登录 */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => Alert.alert(
            '退出登录',
            '确定要退出登录吗？',
            [
              { text: '取消', style: 'cancel' },
              { text: '退出', style: 'destructive', onPress: () => navigation.navigate('Login') }
            ]
          )}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 编辑资料弹窗 */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.editModalHeader}>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.editModalCancel}>取消</Text>
              </TouchableOpacity>
              <Text style={styles.editModalTitle}>{editTitle}</Text>
              <TouchableOpacity onPress={handleSaveEdit}>
                <Text style={styles.editModalSave}>保存</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editModalContent}>
              <TextInput
                style={[styles.editInput, editField === 'bio' && styles.editInputMultiline]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`请输入${editTitle}`}
                placeholderTextColor="#9ca3af"
                multiline={editField === 'bio'}
                textAlignVertical={editField === 'bio' ? 'top' : 'center'}
                autoFocus
              />
              <Text style={styles.editHint}>
                {editField === 'name' && '昵称长度为2-20个字符'}
                {editField === 'bio' && '简介不超过100个字符，展示你的个性'}
                {editField === 'location' && '填写你的所在城市'}
                {editField === 'occupation' && '填写你的职业或身份'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  content: { flex: 1 },
  
  // 账号信息区域
  accountSection: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff', 
    padding: 20, 
    marginBottom: 12 
  },
  avatarContainer: { 
    position: 'relative',
    marginRight: 16
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  accountText: { flex: 1 },
  accountName: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  accountId: { fontSize: 13, color: '#9ca3af' },
  
  // 分组标题
  sectionGroup: { marginBottom: 12 },
  groupTitle: { 
    fontSize: 13, 
    color: '#9ca3af', 
    paddingHorizontal: 16, 
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: '500'
  },
  
  // 设置区块
  section: { backgroundColor: '#fff' },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuLabel: { fontSize: 15, color: '#1f2937', marginLeft: 12 },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuValue: { fontSize: 14, color: '#9ca3af', marginRight: 8 },
  
  // 开关项
  switchItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  switchInfo: { marginLeft: 12, flex: 1 },
  switchDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  
  // 社交图标
  socialIcons: { flexDirection: 'row', alignItems: 'center' },
  
  // 在线状态
  onlineDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#22c55e',
    marginRight: 4
  },
  onlineText: { fontSize: 12, color: '#22c55e', marginRight: 8 },
  
  // 退出登录按钮
  logoutBtn: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutText: { fontSize: 15, color: '#ef4444', fontWeight: '500' },

  // 编辑弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  editModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  editModalCancel: {
    fontSize: 15,
    color: '#6b7280'
  },
  editModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  editModalSave: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '600'
  },
  editModalContent: {
    padding: 16
  },
  editInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937'
  },
  editInputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  editHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8
  }
});
