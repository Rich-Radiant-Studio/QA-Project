import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import superLikeCreditService from '../services/SuperLikeCreditService';

export default function UseSuperLikeButton({ 
  answerId, 
  answerTitle, 
  currentSuperLikes = 0,
  onSuccess,
  navigation,
  style 
}) {
  const [loading, setLoading] = useState(false);
  const [superLikes, setSuperLikes] = useState(currentSuperLikes);

  const handlePress = async () => {
    // 检查余额
    const balance = await superLikeCreditService.getBalance();
    
    if (balance <= 0) {
      // 余额不足，显示购买提示
      Alert.alert(
        '超级赞次数不足',
        '您的超级赞次数不足，是否购买？',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '去购买', 
            onPress: () => {
              if (navigation) {
                navigation.navigate('SuperLikePurchase');
              }
            }
          }
        ]
      );
      return;
    }

    // 显示确认对话框
    Alert.alert(
      '使用超级赞',
      '确认使用 1 次超级赞提升此回答的排名？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => performUse()
        }
      ]
    );
  };

  const performUse = async () => {
    setLoading(true);
    
    try {
      const result = await superLikeCreditService.use(answerId, answerTitle);
      
      if (result.success) {
        // 更新本地显示的超级赞数量
        setSuperLikes(prev => prev + 1);
        
        // 显示成功提示
        Alert.alert(
          '使用成功',
          `已使用 1 次超级赞！\n剩余：${result.newBalance} 次`,
          [{ text: '确定' }]
        );
        
        // 调用成功回调
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        Alert.alert('使用失败', result.error || '使用失败，请稍后重试');
      }
    } catch (error) {
      console.error('Use super like error:', error);
      Alert.alert('使用失败', '使用失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={loading ? "hourglass-outline" : "star"} 
        size={16} 
        color="#fff" 
      />
      <Text style={styles.buttonText}>
        {loading ? '处理中...' : `超级赞 x${superLikes}`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
