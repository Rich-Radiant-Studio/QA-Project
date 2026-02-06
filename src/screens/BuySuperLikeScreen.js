import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BuySuperLikeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { answerId, currentSuperLikes = 0 } = route?.params || {};
  
  const [superLikeAmount, setSuperLikeAmount] = useState('');
  const [selectedSuperLikeAmount, setSelectedSuperLikeAmount] = useState(null);

  const handleBuySuperLike = () => {
    const amount = selectedSuperLikeAmount || parseInt(superLikeAmount);
    if (!amount || amount <= 0) {
      Alert.alert('提示', '请输入有效的超级赞数量');
      return;
    }
    if (amount < 1) {
      Alert.alert('提示', '最少购买 1 个超级赞');
      return;
    }
    if (amount > 100) {
      Alert.alert('提示', '单次最多购买 100 个超级赞');
      return;
    }
    
    const totalCost = amount * 2;
    Alert.alert(
      '购买成功',
      `成功购买 ${amount} 个超级赞！\n花费：$${totalCost}\n您的回答排名将会提升！`,
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
        <View style={styles.headerCenter}>
          <Ionicons name="star" size={20} color="#f59e0b" />
          <Text style={styles.headerTitle}>购买超级赞</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
        showsVerticalScrollIndicator={false}
      >
        {/* 当前超级赞信息 */}
        <View style={styles.currentInfo}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>当前超级赞</Text>
              <View style={styles.countBadge}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.countText}>{currentSuperLikes}</Text>
              </View>
            </View>
            <Text style={styles.infoDesc}>
              超级赞越多，您的回答排名越靠前，获得更多曝光
            </Text>
          </View>
        </View>

        {/* 快速选择数量 */}
        <Text style={styles.sectionTitle}>选择购买数量</Text>
        <View style={styles.quickGrid}>
          {[5, 10, 20, 50, 100].map(amount => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.quickBtn,
                selectedSuperLikeAmount === amount && styles.quickBtnActive
              ]}
              onPress={() => {
                setSelectedSuperLikeAmount(amount);
                setSuperLikeAmount('');
              }}
            >
              <Ionicons name="star" size={18} color={selectedSuperLikeAmount === amount ? "#fff" : "#f59e0b"} />
              <Text style={[
                styles.quickText,
                selectedSuperLikeAmount === amount && styles.quickTextActive
              ]}>x{amount}</Text>
              <Text style={[
                styles.quickPrice,
                selectedSuperLikeAmount === amount && styles.quickPriceActive
              ]}>${amount * 2}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 自定义数量 */}
        <Text style={styles.sectionTitle}>或输入自定义数量</Text>
        <View style={styles.customInput}>
          <Ionicons name="star-outline" size={20} color="#f59e0b" />
          <TextInput
            style={styles.customField}
            placeholder="最少 1 个"
            placeholderTextColor="#9ca3af"
            value={superLikeAmount}
            onChangeText={(text) => {
              setSuperLikeAmount(text);
              setSelectedSuperLikeAmount(null);
            }}
            keyboardType="numeric"
          />
          <Text style={styles.priceHint}>
            ${(parseInt(superLikeAmount) || 0) * 2}
          </Text>
        </View>

        {/* 价格说明 */}
        <View style={styles.priceInfo}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>单价</Text>
            <Text style={styles.priceValue}>$2 / 个</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>购买数量</Text>
            <Text style={styles.priceValue}>
              {selectedSuperLikeAmount || superLikeAmount || 0} 个
            </Text>
          </View>
          <View style={[styles.priceRow, styles.priceTotal]}>
            <Text style={styles.priceTotalLabel}>总计</Text>
            <Text style={styles.priceTotalValue}>
              ${(selectedSuperLikeAmount || parseInt(superLikeAmount) || 0) * 2}
            </Text>
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.tips}>
          <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
          <Text style={styles.tipsText}>
            购买超级赞后，您的回答将获得更高的排名权重，增加曝光机会
          </Text>
        </View>

        {/* 确认按钮 */}
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!selectedSuperLikeAmount && !superLikeAmount) && styles.confirmBtnDisabled
          ]}
          onPress={handleBuySuperLike}
          disabled={!selectedSuperLikeAmount && !superLikeAmount}
        >
          <Ionicons name="star" size={18} color="#fff" />
          <Text style={styles.confirmBtnText}>
            立即购买 {selectedSuperLikeAmount || superLikeAmount || 0} 个超级赞
          </Text>
        </TouchableOpacity>

        {/* 取消按钮 */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>取消</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerCenter: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  currentInfo: { marginBottom: 24 },
  infoCard: { 
    backgroundColor: '#fffbeb', 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#fef3c7' 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  infoLabel: { fontSize: 14, color: '#92400e', fontWeight: '500' },
  countBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fef3c7', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    gap: 4 
  },
  countText: { fontSize: 16, fontWeight: 'bold', color: '#f59e0b' },
  infoDesc: { fontSize: 12, color: '#92400e', lineHeight: 18 },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1f2937', 
    marginBottom: 12 
  },
  quickGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginBottom: 24 
  },
  quickBtn: { 
    width: '30%', 
    paddingVertical: 12, 
    borderRadius: 12, 
    backgroundColor: '#fffbeb', 
    borderWidth: 2, 
    borderColor: '#fef3c7', 
    alignItems: 'center', 
    gap: 4 
  },
  quickBtnActive: { 
    backgroundColor: '#f59e0b', 
    borderColor: '#f59e0b' 
  },
  quickText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#f59e0b' 
  },
  quickTextActive: { color: '#fff' },
  quickPrice: { 
    fontSize: 12, 
    color: '#92400e' 
  },
  quickPriceActive: { color: '#fff', opacity: 0.9 },
  customInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 2, 
    borderColor: '#e5e7eb', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    marginBottom: 16, 
    gap: 8 
  },
  customField: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1f2937', 
    paddingVertical: 14 
  },
  priceHint: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#f59e0b' 
  },
  priceInfo: { 
    backgroundColor: '#f9fafb', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16 
  },
  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  priceLabel: { fontSize: 14, color: '#6b7280' },
  priceValue: { fontSize: 14, color: '#1f2937', fontWeight: '500' },
  priceTotal: { 
    borderTopWidth: 1, 
    borderTopColor: '#e5e7eb', 
    paddingTop: 12, 
    marginTop: 4, 
    marginBottom: 0 
  },
  priceTotalLabel: { fontSize: 15, color: '#1f2937', fontWeight: '600' },
  priceTotalValue: { 
    fontSize: 18, 
    color: '#f59e0b', 
    fontWeight: 'bold' 
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
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f59e0b', 
    paddingVertical: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    gap: 8 
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
