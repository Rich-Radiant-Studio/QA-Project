import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import superLikeCreditService from '../services/SuperLikeCreditService';

export default function SuperLikeHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await superLikeCreditService.getHistory();
      setTransactions(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) {
      return '刚刚';
    }
    
    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }
    
    // 小于24小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }
    
    // 小于7天
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }
    
    // 显示完整日期
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const renderTransaction = (transaction) => {
    const isPurchase = transaction.type === 'purchase';
    
    return (
      <View key={transaction.id} style={styles.transactionCard}>
        <View style={[
          styles.iconContainer,
          isPurchase ? styles.iconPurchase : styles.iconUse
        ]}>
          <Ionicons 
            name={isPurchase ? "add-circle" : "star"} 
            size={20} 
            color={isPurchase ? "#10b981" : "#f59e0b"} 
          />
        </View>
        
        <View style={styles.transactionContent}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionType}>
              {isPurchase ? '购买' : '使用'}
            </Text>
            <Text style={[
              styles.transactionAmount,
              isPurchase ? styles.amountPositive : styles.amountNegative
            ]}>
              {isPurchase ? '+' : '-'}{transaction.amount} 次
            </Text>
          </View>
          
          {!isPurchase && transaction.answerTitle && (
            <Text style={styles.answerTitle} numberOfLines={2}>
              用于回答：{transaction.answerTitle}
            </Text>
          )}
          
          <Text style={styles.transactionTime}>
            {formatDate(transaction.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>交易历史</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ 
          paddingBottom: Math.max(insets.bottom, 20),
          paddingHorizontal: 16,
          paddingTop: 16
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="hourglass-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>加载中...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>暂无交易记录</Text>
            <Text style={styles.emptyHint}>
              购买或使用超级赞后，记录将显示在这里
            </Text>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {transactions.map(renderTransaction)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  backBtn: { 
    padding: 8, 
    minWidth: 44, 
    minHeight: 44, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  content: { 
    flex: 1 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 80 
  },
  emptyText: { 
    fontSize: 16, 
    color: '#9ca3af', 
    marginTop: 16, 
    fontWeight: '500' 
  },
  emptyHint: { 
    fontSize: 14, 
    color: '#d1d5db', 
    marginTop: 8, 
    textAlign: 'center' 
  },
  transactionList: { 
    gap: 12 
  },
  transactionCard: { 
    flexDirection: 'row', 
    backgroundColor: '#f9fafb', 
    borderRadius: 12, 
    padding: 16, 
    gap: 12 
  },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  iconPurchase: { 
    backgroundColor: '#d1fae5' 
  },
  iconUse: { 
    backgroundColor: '#fef3c7' 
  },
  transactionContent: { 
    flex: 1 
  },
  transactionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  transactionType: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  transactionAmount: { 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  amountPositive: { 
    color: '#10b981' 
  },
  amountNegative: { 
    color: '#f59e0b' 
  },
  answerTitle: { 
    fontSize: 13, 
    color: '#6b7280', 
    marginBottom: 4, 
    lineHeight: 18 
  },
  transactionTime: { 
    fontSize: 12, 
    color: '#9ca3af' 
  },
});
