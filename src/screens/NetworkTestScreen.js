import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api/apiClient';
import { API_ENDPOINTS } from '../config/api';
import ENV from '../config/env';

export default function NetworkTestScreen({ navigation }) {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (test, status, message, details = null) => {
    setResults(prev => [...prev, { test, status, message, details, time: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // 测试 1: 基础连接
    addResult('基础连接', 'testing', '正在测试...');
    try {
      const response = await fetch(ENV.apiUrl, { method: 'GET' });
      addResult('基础连接', 'success', `服务器可访问 (${response.status})`);
    } catch (error) {
      addResult('基础连接', 'error', '无法连接到服务器', error.message);
    }

    // 测试 2: 注册接口（不需要 token）
    addResult('注册接口', 'testing', '正在测试...');
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        fingerprint: 'test-' + Date.now(),
      });
      addResult('注册接口', 'success', '接口正常', JSON.stringify(response, null, 2));
    } catch (error) {
      addResult('注册接口', 'error', '接口异常', error.message);
    }

    // 测试 3: 用户资料接口（需要 token）
    addResult('用户资料接口', 'testing', '正在测试...');
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE_ME);
      addResult('用户资料接口', 'success', '接口正常', JSON.stringify(response, null, 2));
    } catch (error) {
      if (error.status === 401) {
        addResult('用户资料接口', 'success', '接口正常（需要 token）');
      } else {
        addResult('用户资料接口', 'error', '接口异常', error.message);
      }
    }

    // 测试 4: 头像上传接口
    addResult('头像上传接口', 'testing', '正在测试...');
    try {
      const formData = new FormData();
      formData.append('avatarfile', 'test-base64-data');
      
      const response = await apiClient.post(API_ENDPOINTS.USER.AVATAR, formData, {
        headers: {
          'Content-Type': undefined,
        },
        transformRequest: [(data) => data],
      });
      addResult('头像上传接口', 'success', '接口正常', JSON.stringify(response, null, 2));
    } catch (error) {
      if (error.status === 401) {
        addResult('头像上传接口', 'success', '接口正常（需要 token）');
      } else {
        addResult('头像上传接口', 'error', '接口异常', error.message);
      }
    }

    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'testing':
        return <ActivityIndicator size="small" color="#3b82f6" />;
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#10b981" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="#ef4444" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>网络测试</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* 配置信息 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>当前配置</Text>
          <Text style={styles.infoText}>后端地址: {ENV.apiUrl}</Text>
          <Text style={styles.infoText}>测试时间: {new Date().toLocaleString('zh-CN')}</Text>
        </View>

        {/* 测试按钮 */}
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runTests}
          disabled={testing}
        >
          {testing ? (
            <>
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.testButtonText}>测试中...</Text>
            </>
          ) : (
            <>
              <Ionicons name="play-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.testButtonText}>开始测试</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 测试结果 */}
        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>测试结果</Text>
            {results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  {getStatusIcon(result.status)}
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTest}>{result.test}</Text>
                    <Text style={styles.resultTime}>{result.time}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.resultMessage,
                  result.status === 'error' && styles.resultMessageError
                ]}>
                  {result.message}
                </Text>
                {result.details && (
                  <Text style={styles.resultDetails}>{result.details}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  testButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  testButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultInfo: {
    marginLeft: 12,
    flex: 1,
  },
  resultTest: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  resultMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 36,
  },
  resultMessageError: {
    color: '#ef4444',
  },
  resultDetails: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 36,
    marginTop: 4,
    fontFamily: 'monospace',
  },
});
