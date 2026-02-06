import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AddRewardScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { currentReward = 50, rewardContributors = 3 } = route?.params || {};
  
  const [addRewardAmount, setAddRewardAmount] = useState('');
  const [selectedAddRewardAmount, setSelectedAddRewardAmount] = useState(null);

  const handleAddReward = () => {
    const amount = selectedAddRewardAmount || parseFloat(addRewardAmount);
    if (!amount || amount <= 0) {
      Alert.alert('提示', '请输入有效的悬赏金额');
      return;
    }
    if (amount < 5) {
      Alert.alert('提示', '最低追加金额为 $5');
      return;
    }
    if (amount > 1000) {
      Alert.alert('提示', '单次追加金额不能超过 $1000');
      return;
    }
    
    Alert.alert(
      '追加成功',
      `成功追加 $${amount} 悬赏！`,
      [
        {
          text: '确定',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>追加悬赏</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* 当前悬赏信息 */}
        <View style={styles.currentRewardInfo}>
          <View style={styles.currentRewardRow}>
            <Text style={styles.currentRewardLabel}>当前悬赏</Text>
            <Text style={styles.currentRewardAmount}>${currentReward}</Text>
          </View>
          <View style={styles.currentRewardRow}>
            <Text style={styles.currentRewardDesc}>已有 {rewardContributors} 人追加悬赏</Text>
          </View>
        </View>

        {/* 快速选择金额 */}
        <Text style={styles.sectionTitle}>选择追加金额</Text>
        <View style={styles.quickAmountGrid}>
          {[10, 20, 50, 100, 200, 500].map(amount => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.quickAmountBtn,
                selectedAddRewardAmount === amount && styles.quickAmountBtnActive
              ]}
              onPress={() => {
                setSelectedAddRewardAmount(amount);
                setAddRewardAmount('');
              }}
            >
              <Text style={[
                styles.quickAmountText,
                selectedAddRewardAmount === amount && styles.quickAmountTextActive
              ]}>${amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 自定义金额 */}
        <Text style={styles.sectionTitle}>或输入自定义金额</Text>
        <View style={styles.customAmountInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.customAmountField}
            placeholder="最低 $5"
            placeholderTextColor="#9ca3af"
            value={addRewardAmount}
            onChangeText={(text) => {
              setAddRewardAmount(text);
              setSelectedAddRewardAmount(null);
            }}
            keyboardType="numeric"
          />
        </View>

        {/* 提示信息 */}
        <View style={styles.tips}>
          <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
          <Text style={styles.tipsText}>
            追加的悬赏将与原悬赏合并，吸引更多优质回答
          </Text>
        </View>

        {/* 确认按钮 */}
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!selectedAddRewardAmount && !addRewardAmount) && styles.confirmBtnDisabled
          ]}
          onPress={handleAddReward}
          disabled={!selectedAddRewardAmount && !addRewardAmount}
        >
          <Text style={styles.confirmBtnText}>
            确认追加 ${selectedAddRewardAmount || addRewardAmount || 0}
          </Text>
        </TouchableOpacity>

        {/* 取消按钮 */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>取消</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  closeBtn: { 
    padding: 8, 
    minWidth: 44, 
    minHeight: 44, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1f2937', 
    flex: 1, 
    textAlign: 'center' 
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  currentRewardInfo: { 
    backgroundColor: '#fef3c7', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 24 
  },
  currentRewardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  currentRewardLabel: { fontSize: 14, color: '#92400e' },
  currentRewardAmount: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#f59e0b' 
  },
  currentRewardDesc: { fontSize: 12, color: '#92400e' },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1f2937', 
    marginBottom: 12 
  },
  quickAmountGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginBottom: 24 
  },
  quickAmountBtn: { 
    width: '30%', 
    paddingVertical: 14, 
    borderRadius: 12, 
    backgroundColor: '#f9fafb', 
    borderWidth: 2, 
    borderColor: '#e5e7eb', 
    alignItems: 'center' 
  },
  quickAmountBtnActive: { 
    backgroundColor: '#fef3c7', 
    borderColor: '#f59e0b' 
  },
  quickAmountText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#6b7280' 
  },
  quickAmountTextActive: { color: '#f59e0b' },
  customAmountInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 2, 
    borderColor: '#e5e7eb', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    marginBottom: 16 
  },
  currencySymbol: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#6b7280', 
    marginRight: 8 
  },
  customAmountField: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1f2937', 
    paddingVertical: 14 
  },
  tips: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    padding: 12, 
    borderRadius: 8, 
    gap: 8, 
    marginBottom: 24 
  },
  tipsText: { 
    flex: 1, 
    fontSize: 13, 
    color: '#6b7280', 
    lineHeight: 18 
  },
  confirmBtn: { 
    backgroundColor: '#f59e0b', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 12 
  },
  confirmBtnDisabled: { 
    backgroundColor: '#fcd34d', 
    opacity: 0.5 
  },
  confirmBtnText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#fff' 
  },
  cancelBtn: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  cancelBtnText: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#6b7280' 
  },
});
