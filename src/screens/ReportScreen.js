import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { type = 'question' } = route?.params || {}; // question, answer, supplement, comment

  const reportReasons = [
    { id: 1, label: '垃圾广告', value: 'spam' },
    { id: 2, label: '违法违规', value: 'illegal' },
    { id: 3, label: '低俗色情', value: 'vulgar' },
    { id: 4, label: '侵权', value: 'infringement' },
    { id: 5, label: '不实信息', value: 'false_info' },
    { id: 6, label: '其他', value: 'other' },
  ];

  const handleReport = (reason) => {
    Alert.alert(
      '举报成功',
      `已提交举报：${reason.label}`,
      [
        {
          text: '确定',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const getTitle = () => {
    switch (type) {
      case 'answer': return '举报回答';
      case 'supplement': return '举报补充';
      case 'comment': return '举报评论';
      default: return '举报问题';
    }
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
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.subtitle}>请选择举报原因</Text>
        
        {reportReasons.map(reason => (
          <TouchableOpacity 
            key={reason.id}
            style={styles.reportItem} 
            onPress={() => handleReport(reason)}
            activeOpacity={0.7}
          >
            <Text style={styles.reportItemText}>{reason.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>取消</Text>
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
  subtitle: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginBottom: 16, 
    paddingHorizontal: 4 
  },
  reportItem: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb', 
    paddingVertical: 16, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    marginBottom: 10 
  },
  reportItemText: { 
    fontSize: 15, 
    color: '#1f2937', 
    fontWeight: '500' 
  },
  cancelBtn: { 
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 20 
  },
  cancelText: { 
    fontSize: 15, 
    color: '#6b7280', 
    fontWeight: '500' 
  },
});
