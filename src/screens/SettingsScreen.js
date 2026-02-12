import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import { useTranslation } from '../i18n/withTranslation';

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
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
    Alert.alert(t('screens.settings.alerts.saveSuccess.title'), t('screens.settings.alerts.saveSuccess.message'));
  };

  const handleChangeAvatar = () => {
    Alert.alert(t('screens.settings.alerts.changeAvatar.title'), t('screens.settings.alerts.changeAvatar.message'), [
      { text: t('screens.settings.alerts.changeAvatar.takePhoto'), onPress: () => Alert.alert(t('screens.settings.alerts.changeAvatar.takePhoto'), t('screens.settings.alerts.changeAvatar.openCamera')) },
      { text: t('screens.settings.alerts.changeAvatar.chooseFromAlbum'), onPress: () => Alert.alert(t('screens.settings.alerts.changeAvatar.chooseFromAlbum'), t('screens.settings.alerts.changeAvatar.openAlbum')) },
      { text: t('common.cancel'), style: 'cancel' }
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
        <Text style={styles.headerTitle}>{t('screens.settings.title')}</Text>
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
            <Text style={styles.accountId}>{t('screens.settings.profile.userId')}: 123456789</Text>
          </View>
        </View>

        {/* 编辑资料 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>{t('screens.settings.profile.groupTitle')}</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleEditProfile('name', t('screens.settings.profile.nickname'), userProfile.name)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.profile.nickname')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleEditProfile('bio', t('screens.settings.profile.bio'), userProfile.bio)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.profile.bio')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={[styles.menuValue, { maxWidth: 180 }]} numberOfLines={1}>{userProfile.bio}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.gender.title'), t('screens.settings.alerts.gender.message'), [
                { text: t('screens.settings.alerts.gender.male'), onPress: () => setUserProfile({ ...userProfile, gender: t('screens.settings.alerts.gender.male') }) },
                { text: t('screens.settings.alerts.gender.female'), onPress: () => setUserProfile({ ...userProfile, gender: t('screens.settings.alerts.gender.female') }) },
                { text: t('screens.settings.alerts.gender.secret'), onPress: () => setUserProfile({ ...userProfile, gender: t('screens.settings.alerts.gender.secret') }) },
                { text: t('common.cancel'), style: 'cancel' }
              ])}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="male-female-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.profile.gender')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.gender}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.birthday.title'), t('screens.settings.alerts.birthday.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="calendar-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.profile.birthday')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.birthday}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleEditProfile('location', t('screens.settings.profile.location'), userProfile.location)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="location-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.profile.location')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{userProfile.location}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => handleEditProfile('occupation', t('screens.settings.profile.occupation'), userProfile.occupation)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="briefcase-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.profile.occupation')}</Text>
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
          <Text style={styles.groupTitle}>{t('screens.settings.account.groupTitle')}</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.changePassword.title'), t('screens.settings.alerts.changePassword.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="key-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.account.changePassword')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.bindPhone.title'), t('screens.settings.alerts.bindPhone.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="phone-portrait-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.account.bindPhone')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>138****8888</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert(t('screens.settings.alerts.bindEmail.title'), t('screens.settings.alerts.bindEmail.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="mail-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.account.bindEmail')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{t('screens.settings.account.notBound')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 消息通知 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>{t('screens.settings.notifications.groupTitle')}</Text>
          <View style={styles.section}>
            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="notifications-outline" size={22} color="#6b7280" />
                <View style={styles.switchInfo}>
                  <Text style={styles.menuLabel}>{t('screens.settings.notifications.push')}</Text>
                  <Text style={styles.switchDesc}>{t('screens.settings.notifications.pushDesc')}</Text>
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
                <Text style={styles.menuLabel}>{t('screens.settings.notifications.like')}</Text>
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
                <Text style={styles.menuLabel}>{t('screens.settings.notifications.comment')}</Text>
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
                <Text style={styles.menuLabel}>{t('screens.settings.notifications.follow')}</Text>
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
                <Text style={styles.menuLabel}>{t('screens.settings.notifications.system')}</Text>
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
          <Text style={styles.groupTitle}>{t('screens.settings.privacy.groupTitle')}</Text>
          <View style={styles.section}>
            <View style={styles.switchItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="eye-outline" size={22} color="#6b7280" />
                <View style={styles.switchInfo}>
                  <Text style={styles.menuLabel}>{t('screens.settings.privacy.showOnline')}</Text>
                  <Text style={styles.switchDesc}>{t('screens.settings.privacy.showOnlineDesc')}</Text>
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
                  <Text style={styles.menuLabel}>{t('screens.settings.privacy.allowMessage')}</Text>
                  <Text style={styles.switchDesc}>{t('screens.settings.privacy.allowMessageDesc')}</Text>
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
              onPress={() => Alert.alert(t('screens.settings.alerts.blacklist.title'), t('screens.settings.alerts.blacklist.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="ban-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.privacy.blacklist')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 通用设置 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>{t('screens.settings.general.groupTitle')}</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.clearCache.title'), t('screens.settings.alerts.clearCache.message'), [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.confirm'), onPress: () => Alert.alert(t('common.ok'), t('screens.settings.alerts.clearCache.success')) }
              ])}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="trash-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.general.clearCache')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>128.5 MB</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert(t('screens.settings.alerts.language.title'), t('screens.settings.alerts.language.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="language-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.general.language')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{t('screens.settings.general.languageChinese')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 钱包与超级赞 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>{t('screens.settings.wallet.groupTitle')}</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('SuperLikePurchase')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="star" size={22} color="#f59e0b" />
                <Text style={styles.menuLabel}>{t('screens.settings.wallet.purchaseSuperLike')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigation.navigate('SuperLikeHistory')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="time-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.wallet.superLikeHistory')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 帮助与反馈 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>{t('screens.settings.help.groupTitle')}</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.faq.title'), t('screens.settings.alerts.faq.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.help.faq')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.customerService.title'), t('screens.settings.alerts.customerService.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="chatbubbles-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.help.customerService')}</Text>
              </View>
              <View style={styles.menuRight}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>{t('screens.settings.help.online')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert(t('screens.settings.alerts.feedback.title'), t('screens.settings.alerts.feedback.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="create-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.help.feedback')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 关于我们 */}
        <View style={styles.sectionGroup}>
          <Text style={styles.groupTitle}>{t('screens.settings.about.groupTitle')}</Text>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.checkUpdate.title'), t('screens.settings.alerts.checkUpdate.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="refresh-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.about.checkUpdate')}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>v1.0.0</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.userAgreement.title'), t('screens.settings.alerts.userAgreement.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.about.userAgreement')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('screens.settings.alerts.privacyPolicy.title'), t('screens.settings.alerts.privacyPolicy.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="shield-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.about.privacyPolicy')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => Alert.alert(t('screens.settings.alerts.aboutUs.title'), t('screens.settings.alerts.aboutUs.message'))}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
                <Text style={styles.menuLabel}>{t('screens.settings.about.aboutUs')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 退出登录 */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => Alert.alert(
            t('screens.settings.alerts.logout.title'),
            t('screens.settings.alerts.logout.message'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('screens.settings.alerts.logout.button'), style: 'destructive', onPress: () => navigation.navigate('Login') }
            ]
          )}
        >
          <Text style={styles.logoutText}>{t('screens.settings.logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 编辑资料弹窗 */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.editModalHeader}>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.editModalCancel}>{t('screens.settings.editModal.cancel')}</Text>
              </TouchableOpacity>
              <Text style={styles.editModalTitle}>{editTitle}</Text>
              <TouchableOpacity onPress={handleSaveEdit}>
                <Text style={styles.editModalSave}>{t('screens.settings.editModal.save')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editModalContent}>
              <TextInput
                style={[styles.editInput, editField === 'bio' && styles.editInputMultiline]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`${t('screens.settings.editModal.placeholder')}${editTitle}`}
                placeholderTextColor="#9ca3af"
                multiline={editField === 'bio'}
                textAlignVertical={editField === 'bio' ? 'top' : 'center'}
                autoFocus
              />
              <Text style={styles.editHint}>
                {editField === 'name' && t('screens.settings.editModal.hints.nickname')}
                {editField === 'bio' && t('screens.settings.editModal.hints.bio')}
                {editField === 'location' && t('screens.settings.editModal.hints.location')}
                {editField === 'occupation' && t('screens.settings.editModal.hints.occupation')}
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
