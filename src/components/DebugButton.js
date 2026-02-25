import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DebugToken from '../utils/debugToken';

/**
 * 调试按钮组件
 * 用于在应用中快速查看 Token 状态
 */
export default function DebugButton() {
  const handlePress = async () => {
    console.log('\n🔧 手动触发调试检查...\n');
    await DebugToken.checkTokenStatus();
    await DebugToken.testTokenInRequest();
  };

  // 仅在开发环境显示
  if (!__DEV__) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.debugButton}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <Ionicons name="bug" size={20} color="#fff" />
        <Text style={styles.buttonText}>检查 Token</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
