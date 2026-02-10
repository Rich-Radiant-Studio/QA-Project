import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from './src/i18n';
import superLikeCreditService from './src/services/SuperLikeCreditService';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import PublishScreen from './src/screens/PublishScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuestionDetailScreen from './src/screens/QuestionDetailScreen';
import FollowScreen from './src/screens/FollowScreen';
import HotListScreen from './src/screens/HotListScreen';
import IncomeRankingScreen from './src/screens/IncomeRankingScreen';
import GroupChatScreen from './src/screens/GroupChatScreen';
import AnswerDetailScreen from './src/screens/AnswerDetailScreen';
import SupplementDetailScreen from './src/screens/SupplementDetailScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import LoginScreen from './src/screens/LoginScreen';
import QuestionActivityListScreen from './src/screens/QuestionActivityListScreen';
import MyTeamsScreen from './src/screens/MyTeamsScreen';
import TeamDetailScreen from './src/screens/TeamDetailScreen';
import QuestionTeamsScreen from './src/screens/QuestionTeamsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WisdomIndexScreen from './src/screens/WisdomIndexScreen';
import WisdomExamScreen from './src/screens/WisdomExamScreen';
import ExamHistoryScreen from './src/screens/ExamHistoryScreen';
import ExamDetailScreen from './src/screens/ExamDetailScreen';
import QuestionBankScreen from './src/screens/QuestionBankScreen';
import UploadBankScreen from './src/screens/UploadBankScreen';
import ChannelManageScreen from './src/screens/ChannelManageScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import CreateActivityScreen from './src/screens/CreateActivityScreen';
import InviteAnswerScreen from './src/screens/InviteAnswerScreen';
import InviteTeamMemberScreen from './src/screens/InviteTeamMemberScreen';
import ReportScreen from './src/screens/ReportScreen';
import AddRewardScreen from './src/screens/AddRewardScreen';
import SuperLikePurchaseScreen from './src/screens/SuperLikePurchaseScreen';
import SuperLikeHistoryScreen from './src/screens/SuperLikeHistoryScreen';
import ContributorsScreen from './src/screens/ContributorsScreen';
import PublicProfileScreen from './src/screens/PublicProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Emergency Help Modal Component
function EmergencyModal({ visible, onClose, onSubmit }) {
  const t = (key) => i18n.t(key);
  const insets = useSafeAreaInsets();
  const [emergencyForm, setEmergencyForm] = useState({ title: '', description: '', location: '', contact: '', rescuerCount: 1 });
  const freeCount = 1;
  const usedCount = 0;
  const remainingFree = freeCount - usedCount;

  const freeRescuerLimit = 5;
  const extraRescuerFee = 2;
  
  const calculateRescuerFee = (count) => {
    if (count <= freeRescuerLimit) return 0;
    return (count - freeRescuerLimit) * extraRescuerFee;
  };

  const rescuerFee = calculateRescuerFee(emergencyForm.rescuerCount || 1);

  const quickTitles = [
    t('emergency.quickTitle1'),
    t('emergency.quickTitle2'),
    t('emergency.quickTitle3')
  ];

  const handleSubmit = () => {
    if (!emergencyForm.title.trim()) {
      alert(t('emergency.enterTitle'));
      return;
    }
    const feeInfo = rescuerFee > 0 ? `\n${t('emergency.needPay')}：$${rescuerFee}` : '';
    alert(`${t('emergency.published')}\n${t('emergency.rescuersNeeded')}${emergencyForm.rescuerCount}${t('emergency.rescuerUnit')}${feeInfo}\n${t('emergency.nearbyNotified')}`);
    onClose();
    setEmergencyForm({ title: '', description: '', location: '', contact: '', rescuerCount: 1 });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={modalStyles.emergencyModal} edges={['top']}>
        <View style={modalStyles.emergencyHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          <View style={modalStyles.emergencyHeaderCenter}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={modalStyles.emergencyHeaderTitle}>{t('emergency.title')}</Text>
          </View>
          <TouchableOpacity 
            style={[modalStyles.emergencySubmitBtn, !emergencyForm.title.trim() && modalStyles.emergencySubmitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!emergencyForm.title.trim()}
          >
            <Text style={[modalStyles.emergencySubmitText, !emergencyForm.title.trim() && modalStyles.emergencySubmitTextDisabled]}>{t('emergency.publish')}</Text>
          </TouchableOpacity>
        </View>

        <View style={modalStyles.emergencyWarning}>
          <Ionicons name="warning" size={18} color="#f59e0b" />
          <Text style={modalStyles.emergencyWarningText}>{t('emergency.warning')}</Text>
        </View>

        <View style={modalStyles.freeCountBanner}>
          <View style={modalStyles.freeCountLeft}>
            <Ionicons name="gift" size={20} color={remainingFree > 0 ? "#22c55e" : "#9ca3af"} />
            <Text style={modalStyles.freeCountText}>{t('emergency.freeCount')}</Text>
            <Text style={[modalStyles.freeCountNumber, remainingFree <= 0 && { color: '#9ca3af' }]}>{remainingFree}/{freeCount}</Text>
          </View>
          {remainingFree <= 0 && (
            <TouchableOpacity 
              style={modalStyles.monthlyPayButton}
              onPress={() => alert(t('emergency.monthlyUnlock'))}
            >
              <Text style={modalStyles.monthlyPayButtonText}>{t('emergency.payAmount')}</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={modalStyles.emergencyFormArea} keyboardShouldPersistTaps="handled">
          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>{t('emergency.formTitle')} <Text style={{ color: '#ef4444' }}>*</Text></Text>
            <TextInput
              style={modalStyles.emergencyFormInput}
              placeholder={t('emergency.formTitlePlaceholder')}
              placeholderTextColor="#bbb"
              value={emergencyForm.title}
              onChangeText={(text) => setEmergencyForm({...emergencyForm, title: text})}
            />
            <View style={modalStyles.quickTitlesContainer}>
              <Text style={modalStyles.quickTitlesLabel}>{t('emergency.quickTitles')}</Text>
              <View style={modalStyles.quickTitlesRow}>
                {quickTitles.map((title, index) => (
                  <TouchableOpacity
                    key={index}
                    style={modalStyles.quickTitleTag}
                    onPress={() => setEmergencyForm({...emergencyForm, title: title})}
                  >
                    <Text style={modalStyles.quickTitleText}>{title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>{t('emergency.description')}</Text>
            <TextInput
              style={[modalStyles.emergencyFormInput, modalStyles.emergencyFormTextarea]}
              placeholder={t('emergency.descriptionPlaceholder')}
              placeholderTextColor="#bbb"
              value={emergencyForm.description}
              onChangeText={(text) => setEmergencyForm({...emergencyForm, description: text})}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>{t('emergency.location')}</Text>
            <View style={modalStyles.emergencyLocationRow}>
              <View style={modalStyles.emergencyLocationInput}>
                <Ionicons name="location" size={18} color="#ef4444" />
                <TextInput
                  style={modalStyles.emergencyLocationText}
                  placeholder={t('emergency.locationPlaceholder')}
                  placeholderTextColor="#bbb"
                  value={emergencyForm.location}
                  onChangeText={(text) => setEmergencyForm({...emergencyForm, location: text})}
                />
              </View>
              <TouchableOpacity style={modalStyles.emergencyLocationBtn}>
                <Ionicons name="navigate" size={18} color="#3b82f6" />
                <Text style={modalStyles.emergencyLocationBtnText}>{t('emergency.locate')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>{t('emergency.contact')}</Text>
            <View style={modalStyles.emergencyContactInput}>
              <Ionicons name="call" size={18} color="#6b7280" />
              <TextInput
                style={modalStyles.emergencyContactText}
                placeholder={t('emergency.contactPlaceholder')}
                placeholderTextColor="#bbb"
                value={emergencyForm.contact}
                onChangeText={(text) => setEmergencyForm({...emergencyForm, contact: text})}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <View style={modalStyles.rescuerCountHeader}>
              <Text style={modalStyles.emergencyFormLabel}>{t('emergency.rescuerCount')}</Text>
              <View style={modalStyles.rescuerFreeTag}>
                <Ionicons name="information-circle" size={14} color="#22c55e" />
                <Text style={modalStyles.rescuerFreeText}>{t('emergency.rescuerFree')}</Text>
              </View>
            </View>
            
            <View style={modalStyles.rescuerCountInputWrapper}>
              <TextInput
                style={modalStyles.rescuerCountInput}
                placeholder={t('emergency.rescuerPlaceholder')}
                placeholderTextColor="#bbb"
                value={emergencyForm.rescuerCount === 0 ? '' : emergencyForm.rescuerCount.toString()}
                onChangeText={(text) => {
                  if (text === '') {
                    setEmergencyForm({...emergencyForm, rescuerCount: 0});
                    return;
                  }
                  const num = parseInt(text);
                  if (!isNaN(num)) {
                    const validNum = Math.max(1, Math.min(20, num));
                    setEmergencyForm({...emergencyForm, rescuerCount: validNum});
                  }
                }}
                onBlur={() => {
                  if (emergencyForm.rescuerCount === 0) {
                    setEmergencyForm({...emergencyForm, rescuerCount: 1});
                  }
                }}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={modalStyles.rescuerCountUnit}>{t('emergency.rescuerUnit')}</Text>
            </View>

            <View style={modalStyles.rescuerFeeInfo}>
              {rescuerFee === 0 ? (
                <View style={modalStyles.rescuerFeeRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={modalStyles.rescuerFeeTextFree}>{t('emergency.rescuerFeeTextFree')}</Text>
                </View>
              ) : (
                <View style={modalStyles.rescuerFeeCard}>
                  <View style={modalStyles.rescuerFeeRow}>
                    <View style={modalStyles.rescuerFeeLeft}>
                      <Text style={modalStyles.rescuerFeeLabel}>{t('emergency.rescuerFeeLabel')}</Text>
                      <Text style={modalStyles.rescuerFeeExtra}>{emergencyForm.rescuerCount - freeRescuerLimit}{t('emergency.rescuerUnit')} × ${extraRescuerFee}</Text>
                    </View>
                    <View style={modalStyles.rescuerFeeRight}>
                      <Text style={modalStyles.rescuerFeeTotalLabel}>{t('emergency.needPay')}</Text>
                      <Text style={modalStyles.rescuerFeeTotal}>${rescuerFee}</Text>
                    </View>
                  </View>
                  <Text style={modalStyles.rescuerFeeNote}>{t('emergency.rescuerFeeNote')}</Text>
                  <TouchableOpacity 
                    style={modalStyles.payButton}
                    onPress={() => alert(`${t('emergency.pay')} $${rescuerFee}\n\n${t('emergency.paymentMethods')}`)}
                  >
                    <Ionicons name="card" size={18} color="#fff" />
                    <Text style={modalStyles.payButtonText}>{t('emergency.payNow')} ${rescuerFee}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={modalStyles.emergencyTips}>
            <Text style={modalStyles.emergencyTipsTitle}>{t('emergency.tips')}</Text>
            <Text style={modalStyles.emergencyTipsText}>{t('emergency.tip1')}</Text>
            <Text style={modalStyles.emergencyTipsText}>{t('emergency.tip2')}</Text>
            <Text style={modalStyles.emergencyTipsText}>{t('emergency.tip3')}</Text>
          </View>

          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  emergencyModal: { flex: 1, backgroundColor: '#fff' },
  emergencyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  emergencyHeaderCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  emergencyHeaderTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  emergencySubmitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  emergencySubmitBtnDisabled: { backgroundColor: '#fecaca' },
  emergencySubmitText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  emergencySubmitTextDisabled: { color: '#fff' },
  emergencyWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  emergencyWarningText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 18 },
  freeCountBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  freeCountLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  freeCountText: { fontSize: 14, color: '#374151' },
  freeCountNumber: { fontSize: 16, fontWeight: 'bold', color: '#22c55e' },
  monthlyPayButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ef4444', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 2 },
  monthlyPayButtonText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  needPayTag: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  needPayText: { fontSize: 12, color: '#92400e', fontWeight: '500' },
  emergencyFormArea: { flex: 1, padding: 16 },
  emergencyFormGroup: { marginBottom: 16 },
  emergencyFormLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  emergencyFormInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  quickTitlesContainer: { marginTop: 12 },
  quickTitlesLabel: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  quickTitlesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickTitleTag: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  quickTitleText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  emergencyFormTextarea: { minHeight: 100, textAlignVertical: 'top' },
  emergencyLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emergencyLocationInput: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  emergencyLocationText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyLocationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, gap: 4 },
  emergencyLocationBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  emergencyContactInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  emergencyContactText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  rescuerCountHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  rescuerFreeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0' },
  rescuerFreeText: { fontSize: 12, color: '#16a34a', fontWeight: '500' },
  rescuerCountInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  rescuerCountInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  rescuerCountUnit: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  rescuerFeeInfo: { marginTop: 12 },
  rescuerFeeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rescuerFeeTextFree: { fontSize: 14, color: '#22c55e', fontWeight: '500' },
  rescuerFeeCard: { backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fed7aa', borderRadius: 8, padding: 12 },
  rescuerFeeLeft: { flex: 1 },
  rescuerFeeLabel: { fontSize: 13, color: '#92400e', marginBottom: 4 },
  rescuerFeeExtra: { fontSize: 15, color: '#ea580c', fontWeight: '600' },
  rescuerFeeRight: { alignItems: 'flex-end' },
  rescuerFeeTotalLabel: { fontSize: 12, color: '#92400e', marginBottom: 2 },
  rescuerFeeTotal: { fontSize: 24, fontWeight: 'bold', color: '#ef4444' },
  rescuerFeeNote: { fontSize: 12, color: '#92400e', marginTop: 8 },
  payButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef4444', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginTop: 12, gap: 8, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  payButtonText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  emergencyTips: { backgroundColor: '#fef2f2', borderRadius: 8, padding: 12, marginTop: 8 },
  emergencyTipsTitle: { fontSize: 13, fontWeight: '500', color: '#991b1b', marginBottom: 8 },
  emergencyTipsText: { fontSize: 12, color: '#b91c1c', lineHeight: 20 },
});

function MainTabs({ onLogout }) {
  const t = (key) => i18n.t(key);
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === t('tabs.home')) iconName = focused ? 'home' : 'home-outline';
          else if (route.name === t('tabs.activity')) iconName = focused ? 'gift' : 'gift-outline';
          else if (route.name === t('tabs.publish')) iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === t('tabs.emergency')) iconName = focused ? 'warning' : 'warning-outline';
          else if (route.name === t('tabs.profile')) iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#f04444',
        tabBarInactiveTintColor: '#8a8a8a',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#e8e8e8',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name={t('tabs.home')} component={HomeScreen} />
      <Tab.Screen name={t('tabs.activity')} component={ActivityScreen} />
      <Tab.Screen name={t('tabs.publish')} component={PublishScreen} />
      <Tab.Screen name={t('tabs.emergency')} component={EmergencyScreen} />
      <Tab.Screen name={t('tabs.profile')}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 初始化超级赞积分系统
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await superLikeCreditService.initialize();
        console.log('Services initialized successfully');
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <LoginScreen onLogin={handleLogin} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {() => <MainTabs onLogout={handleLogout} />}
            </Stack.Screen>
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
          <Stack.Screen name="SupplementDetail" component={SupplementDetailScreen} />
          <Stack.Screen name="QuestionActivityList" component={QuestionActivityListScreen} />
        <Stack.Screen name="Follow" component={FollowScreen} />
        <Stack.Screen name="HotList" component={HotListScreen} />
        <Stack.Screen name="IncomeRanking" component={IncomeRankingScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
        <Stack.Screen name="AnswerDetail" component={AnswerDetailScreen} />
        <Stack.Screen name="MyTeams" component={MyTeamsScreen} />
        <Stack.Screen name="QuestionTeams" component={QuestionTeamsScreen} />
        <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ChannelManage" component={ChannelManageScreen} />
        <Stack.Screen name="WisdomIndex" component={WisdomIndexScreen} />
        <Stack.Screen name="WisdomExam" component={WisdomExamScreen} />
        <Stack.Screen name="ExamHistory" component={ExamHistoryScreen} />
        <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
        <Stack.Screen name="QuestionBank" component={QuestionBankScreen} />
        <Stack.Screen name="UploadBank" component={UploadBankScreen} />
        <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
        <Stack.Screen name="InviteAnswer" component={InviteAnswerScreen} />
        <Stack.Screen name="InviteTeamMember" component={InviteTeamMemberScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="AddReward" component={AddRewardScreen} />
        <Stack.Screen name="SuperLikePurchase" component={SuperLikePurchaseScreen} />
        <Stack.Screen name="SuperLikeHistory" component={SuperLikeHistoryScreen} />
        <Stack.Screen name="Contributors" component={ContributorsScreen} />
        <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
