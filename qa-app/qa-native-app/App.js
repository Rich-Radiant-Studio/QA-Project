import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import PublishScreen from './src/screens/PublishScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuestionDetailScreen from './src/screens/QuestionDetailScreen';
import FollowScreen from './src/screens/FollowScreen';
import HotListScreen from './src/screens/HotListScreen';
import GroupChatScreen from './src/screens/GroupChatScreen';
import AnswerDetailScreen from './src/screens/AnswerDetailScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import LoginScreen from './src/screens/LoginScreen';
import { AccountSecurityScreen, PrivacySettingsScreen, HelpFeedbackScreen, AboutScreen, EditProfileScreen, FansScreen, MyGroupsScreen } from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 紧急求助弹窗组件
function EmergencyModal({ visible, onClose, onSubmit }) {
  const [emergencyForm, setEmergencyForm] = useState({ title: '', description: '', location: '北京市朝阳区', contact: '' });
  const freeCount = 3; // 每日免费次数
  const usedCount = 0; // 已使用次数
  const remainingFree = freeCount - usedCount;

  const handleSubmit = () => {
    if (!emergencyForm.title.trim()) {
      alert('请输入求助标题');
      return;
    }
    alert('紧急求助已发布，附近用户将收到通知！');
    onClose();
    setEmergencyForm({ title: '', description: '', location: '北京市朝阳区', contact: '' });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={modalStyles.emergencyModal}>
        <View style={modalStyles.emergencyHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          <View style={modalStyles.emergencyHeaderCenter}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={modalStyles.emergencyHeaderTitle}>紧急求助</Text>
          </View>
          <TouchableOpacity 
            style={[modalStyles.emergencySubmitBtn, !emergencyForm.title.trim() && modalStyles.emergencySubmitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!emergencyForm.title.trim()}
          >
            <Text style={[modalStyles.emergencySubmitText, !emergencyForm.title.trim() && modalStyles.emergencySubmitTextDisabled]}>发布</Text>
          </TouchableOpacity>
        </View>

        <View style={modalStyles.emergencyWarning}>
          <Ionicons name="warning" size={18} color="#f59e0b" />
          <Text style={modalStyles.emergencyWarningText}>紧急求助将通知附近用户，请确保情况紧急真实</Text>
        </View>

        {/* 免费次数显示 */}
        <View style={modalStyles.freeCountBanner}>
          <View style={modalStyles.freeCountLeft}>
            <Ionicons name="gift" size={20} color="#22c55e" />
            <Text style={modalStyles.freeCountText}>今日剩余免费次数：</Text>
            <Text style={modalStyles.freeCountNumber}>{remainingFree}/{freeCount}</Text>
          </View>
          {remainingFree <= 0 && (
            <View style={modalStyles.needPayTag}>
              <Text style={modalStyles.needPayText}>需付费 ¥5</Text>
            </View>
          )}
        </View>

        <ScrollView style={modalStyles.emergencyFormArea} keyboardShouldPersistTaps="handled">
          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>求助标题 <Text style={{ color: '#ef4444' }}>*</Text></Text>
            <TextInput
              style={modalStyles.emergencyFormInput}
              placeholder="简要描述您遇到的紧急情况"
              placeholderTextColor="#bbb"
              value={emergencyForm.title}
              onChangeText={(text) => setEmergencyForm({...emergencyForm, title: text})}
            />
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>详细描述</Text>
            <TextInput
              style={[modalStyles.emergencyFormInput, modalStyles.emergencyFormTextarea]}
              placeholder="请详细描述您的情况，以便他人更好地帮助您..."
              placeholderTextColor="#bbb"
              value={emergencyForm.description}
              onChangeText={(text) => setEmergencyForm({...emergencyForm, description: text})}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>当前位置</Text>
            <View style={modalStyles.emergencyLocationRow}>
              <View style={modalStyles.emergencyLocationInput}>
                <Ionicons name="location" size={18} color="#ef4444" />
                <TextInput
                  style={modalStyles.emergencyLocationText}
                  placeholder="输入或获取当前位置"
                  placeholderTextColor="#bbb"
                  value={emergencyForm.location}
                  onChangeText={(text) => setEmergencyForm({...emergencyForm, location: text})}
                />
              </View>
              <TouchableOpacity style={modalStyles.emergencyLocationBtn}>
                <Ionicons name="navigate" size={18} color="#3b82f6" />
                <Text style={modalStyles.emergencyLocationBtnText}>定位</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={modalStyles.emergencyFormGroup}>
            <Text style={modalStyles.emergencyFormLabel}>联系方式</Text>
            <View style={modalStyles.emergencyContactInput}>
              <Ionicons name="call" size={18} color="#6b7280" />
              <TextInput
                style={modalStyles.emergencyContactText}
                placeholder="请留下您的联系电话"
                placeholderTextColor="#bbb"
                value={emergencyForm.contact}
                onChangeText={(text) => setEmergencyForm({...emergencyForm, contact: text})}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={modalStyles.emergencyTips}>
            <Text style={modalStyles.emergencyTipsTitle}>温馨提示</Text>
            <Text style={modalStyles.emergencyTipsText}>• 紧急求助将推送给附近 5km 内的用户</Text>
            <Text style={modalStyles.emergencyTipsText}>• 请确保描述真实准确，虚假求助将被处罚</Text>
            <Text style={modalStyles.emergencyTipsText}>• 如遇生命危险，请优先拨打急救电话</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
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
  needPayTag: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  needPayText: { fontSize: 12, color: '#92400e', fontWeight: '500' },
  emergencyFormArea: { flex: 1, padding: 16 },
  emergencyFormGroup: { marginBottom: 16 },
  emergencyFormLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  emergencyFormInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyFormTextarea: { minHeight: 100, textAlignVertical: 'top' },
  emergencyLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emergencyLocationInput: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  emergencyLocationText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyLocationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, gap: 4 },
  emergencyLocationBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  emergencyContactInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  emergencyContactText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  emergencyTips: { backgroundColor: '#fef2f2', borderRadius: 8, padding: 12, marginTop: 8 },
  emergencyTipsTitle: { fontSize: 13, fontWeight: '500', color: '#991b1b', marginBottom: 8 },
  emergencyTipsText: { fontSize: 12, color: '#b91c1c', lineHeight: 20 },
});

function MainTabs({ showEmergencyModal, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '首页') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === '活动') iconName = focused ? 'gift' : 'gift-outline';
          else if (route.name === '发布') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === '紧急求助') iconName = focused ? 'warning' : 'warning-outline';
          else if (route.name === '我的') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="活动" component={ActivityScreen} />
      <Tab.Screen name="发布" component={PublishScreen} />
      <Tab.Screen 
        name="紧急求助" 
        component={EmptyScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            showEmergencyModal();
          },
        }}
      />
      <Tab.Screen name="我的">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// 空屏幕组件（紧急求助不需要实际页面）
function EmptyScreen() {
  return <View />;
}

export default function App() {
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEmergencySubmit = (data) => {
    console.log('紧急求助提交:', data);
    alert('求助已发送！附近的人将会收到您的求助信息。');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => <MainTabs showEmergencyModal={() => setEmergencyModalVisible(true)} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
        <Stack.Screen name="Follow" component={FollowScreen} />
        <Stack.Screen name="HotList" component={HotListScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
        <Stack.Screen name="AnswerDetail" component={AnswerDetailScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        {/* 设置相关页面 */}
        <Stack.Screen name="AccountSecurity" component={AccountSecurityScreen} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
        <Stack.Screen name="HelpFeedback" component={HelpFeedbackScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Fans" component={FansScreen} />
        <Stack.Screen name="MyGroups" component={MyGroupsScreen} />
      </Stack.Navigator>
      <EmergencyModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
        onSubmit={handleEmergencySubmit}
      />
    </NavigationContainer>
  );
}
