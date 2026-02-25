import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 修改用户名弹窗组件
 * 
 * 规则：
 * - 仅允许大小写字母和数字
 * - 长度 6-20 位
 * - 每半年可修改一次
 */
export default function EditUsernameModal({ 
  visible, 
  onClose, 
  onSave, 
  currentUsername = '',
  lastModifiedDate = null, // 上次修改时间（时间戳或日期字符串）
  isLoading = false 
}) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setUsername(currentUsername);
      setError('');
    }
  }, [visible, currentUsername]);

  // 计算距离下次可修改的剩余天数
  const getRemainingDays = () => {
    console.log('🔍 检查用户名修改限制:');
    console.log('   lastModifiedDate:', lastModifiedDate);
    
    if (!lastModifiedDate) {
      console.log('   ✅ 从未修改过，可以修改');
      return 0; // 从未修改过，可以修改
    }
    
    const lastDate = new Date(lastModifiedDate);
    const now = new Date();
    const sixMonthsLater = new Date(lastDate);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    
    console.log('   上次修改时间:', lastDate.toISOString());
    console.log('   当前时间:', now.toISOString());
    console.log('   可再次修改时间:', sixMonthsLater.toISOString());
    
    const diffTime = sixMonthsLater - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('   剩余天数:', diffDays);
    console.log('   是否可修改:', diffDays <= 0 ? '✅ 是' : '❌ 否');
    
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays();
  const canModify = remainingDays === 0;

  // 验证用户名格式
  const validateUsername = (value) => {
    // 清除错误
    setError('');

    if (!value) {
      return '用户名不能为空';
    }

    if (value.length < 6) {
      return '用户名至少需要 6 个字符';
    }

    if (value.length > 20) {
      return '用户名不能超过 20 个字符';
    }

    // 只允许大小写字母和数字
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(value)) {
      return '用户名只能包含大小写字母和数字';
    }

    return '';
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    
    // 实时验证
    const errorMsg = validateUsername(value);
    setError(errorMsg);
  };

  const handleSave = () => {
    // 前端拦截：如果不可修改，直接返回，不触发接口
    if (!canModify) {
      return;
    }

    // 最终验证
    const errorMsg = validateUsername(username);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    // 检查是否有修改
    if (username === currentUsername) {
      setError('用户名未修改');
      return;
    }

    // 调用保存回调（触发接口）
    onSave(username);
  };

  const handleCancel = () => {
    setUsername(currentUsername);
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 标题 */}
          <Text style={styles.title}>修改用户名</Text>

          {/* 修改限制提示 */}
          {!canModify && (
            <View style={styles.warningBox}>
              <Ionicons name="time-outline" size={18} color="#f59e0b" />
              <Text style={styles.warningText}>
                用户名每半年可修改一次，还需等待 {remainingDays} 天后才能修改
              </Text>
            </View>
          )}

          {/* 输入框 */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
              <Ionicons name="at-outline" size={20} color="#9ca3af" />
              <TextInput
                style={styles.input}
                placeholder="请输入用户名"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                editable={!isLoading}
              />
              {username.length > 0 && !isLoading && (
                <TouchableOpacity
                  onPress={() => {
                    setUsername('');
                    setError('');
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            {/* 字符计数 */}
            <View style={styles.counterRow}>
              <Text style={styles.counterText}>{username.length}/20</Text>
            </View>

            {/* 错误提示 */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          {/* 规则说明 */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>用户名规则：</Text>
            <View style={styles.ruleItem}>
              <Ionicons 
                name={username.length >= 6 && username.length <= 20 ? 'checkmark-circle' : 'ellipse-outline'} 
                size={16} 
                color={username.length >= 6 && username.length <= 20 ? '#22c55e' : '#9ca3af'} 
              />
              <Text style={[
                styles.ruleText,
                username.length >= 6 && username.length <= 20 && styles.ruleTextActive
              ]}>
                6-20 个字符
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Ionicons 
                name={/^[a-zA-Z0-9]*$/.test(username) && username.length > 0 ? 'checkmark-circle' : 'ellipse-outline'} 
                size={16} 
                color={/^[a-zA-Z0-9]*$/.test(username) && username.length > 0 ? '#22c55e' : '#9ca3af'} 
              />
              <Text style={[
                styles.ruleText,
                /^[a-zA-Z0-9]*$/.test(username) && username.length > 0 && styles.ruleTextActive
              ]}>
                仅包含大小写字母和数字
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
              <Text style={styles.ruleText}>每半年可修改一次</Text>
            </View>
          </View>

          {/* 按钮组 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.confirmButton,
                (!canModify || isLoading || error || username === currentUsername || !username) && styles.confirmButtonDisabled
              ]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!canModify || isLoading || !!error || username === currentUsername || !username}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>保存</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  counterText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
    flex: 1,
  },
  rulesContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ruleText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ruleTextActive: {
    color: '#22c55e',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  confirmButtonDisabled: {
    backgroundColor: '#fca5a5',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
