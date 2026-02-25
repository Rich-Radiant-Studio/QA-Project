import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>测试应用</Text>
        <Text style={{ fontSize: 16, color: '#666' }}>如果你能看到这个，说明基础配置正常</Text>
        <ActivityIndicator size="large" color="#ef4444" style={{ marginTop: 20 }} />
      </View>
    </SafeAreaProvider>
  );
}
