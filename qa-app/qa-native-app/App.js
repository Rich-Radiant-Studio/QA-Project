import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import PublishScreen from './src/screens/PublishScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuestionDetailScreen from './src/screens/QuestionDetailScreen';
import FollowScreen from './src/screens/FollowScreen';
import HotListScreen from './src/screens/HotListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 紧急求助弹窗组件
function EmergencyModal({ visible, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const freeCount = 1;
  const usedCount = 0;
  const remainingFree = freeCount - usedCount;
  const needPay = remainingFree <= 0;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('请输入紧急求助标题');
      return;
    }
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.headerTitle}>紧急求助</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.content}>
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>求助标题 <Text style={modalStyles.required}>*</Text></Text>
              <TextInput
                style={modalStyles.input}
                placeholder="请输入紧急求助标题"
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>求助描述</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                placeholder="请输入详细描述（选填）"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>

            <View style={modalStyles.infoRow}>
              <Ionicons name="location" size={18} color="#ef4444" />
              <Text style={modalStyles.infoText}>当前位置：北京市朝阳区</Text>
            </View>

            <View style={modalStyles.freeInfo}>
              <Ionicons name="gift" size={18} color="#22c55e" />
              <Text style={modalStyles.freeText}>
                当日免费次数：<Text style={modalStyles.freeCount}>{remainingFree}次</Text>
              </Text>
            </View>

            {needPay && (
              <View style={modalStyles.payInfo}>
                <Ionicons name="warning" size={18} color="#f59e0b" />
                <Text style={modalStyles.payText}>免费次数已用完，发送求助需支付 ¥5</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={modalStyles.submitBtn} onPress={handleSubmit}>
            <Text style={modalStyles.submitText}>
              {needPay ? '支付并发送求助' : '发送求助'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 34 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  content: { padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  required: { color: '#ef4444' },
  input: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  textArea: { height: 100, textAlignVertical: 'top' },
  infoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 12 },
  infoText: { fontSize: 14, color: '#374151', marginLeft: 8 },
  freeInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 8, marginBottom: 12 },
  freeText: { fontSize: 14, color: '#374151', marginLeft: 8 },
  freeCount: { color: '#22c55e', fontWeight: 'bold' },
  payInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', padding: 12, borderRadius: 8 },
  payText: { fontSize: 14, color: '#92400e', marginLeft: 8 },
  submitBtn: { backgroundColor: '#ef4444', marginHorizontal: 16, padding: 14, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

function MainTabs({ showEmergencyModal }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '首页') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === '发布') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === '紧急求助？') iconName = focused ? 'warning' : 'warning-outline';
          else if (route.name === '我的') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="发布" component={PublishScreen} />
      <Tab.Screen 
        name="紧急求助？" 
        component={EmptyScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            showEmergencyModal();
          },
        }}
      />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 空屏幕组件（紧急求助不需要实际页面）
function EmptyScreen() {
  return <View />;
}

export default function App() {
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  const handleEmergencySubmit = (data) => {
    console.log('紧急求助提交:', data);
    alert('求助已发送！附近的人将会收到您的求助信息。');
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => <MainTabs showEmergencyModal={() => setEmergencyModalVisible(true)} />}
        </Stack.Screen>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
        <Stack.Screen name="Follow" component={FollowScreen} />
        <Stack.Screen name="HotList" component={HotListScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
      </Stack.Navigator>
      <EmergencyModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
        onSubmit={handleEmergencySubmit}
      />
    </NavigationContainer>
  );
}
