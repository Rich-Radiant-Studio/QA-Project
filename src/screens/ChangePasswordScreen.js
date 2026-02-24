import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import DebugToken from '../utils/debugToken';

/**
 * 修改密码页面
 */
export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // 密码强度计算
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '#d1d5db' };
    
    let strength = 0;
    
    // 长度检查
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // 包含数字
    if (/\d/.test(password)) strength += 1;
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 1;
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 1;
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    if (strength <= 2) {
      return { level: 1, text: '弱', color: '#ef4444' };
    } else if (strength <= 4) {
      return { level: 2, text: '中', color: '#f59e0b' };
    } else {
      return { level: 3, text: '强', color: '#22c55e' };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // 验证密码格式
  const validatePassword = () => {
    if (!oldPassword.trim()) {
      Alert.alert('提示', '请输入当前密码');
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert('提示', '请输入新密码');
      return false;
    }

    if (newPassword.length < 8) {
      Alert.alert('提示', '新密码长度不能少于8位');
      return false;
    }

    if (newPassword.length > 20) {
      Alert.alert('提示', '新密码长度不能超过20位');
      return false;
    }

    if (newPassword === oldPassword) {
      Alert.alert('提示', '新密码不能与当前密码相同');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的新密码不一致');
      return false;
    }

    return true;
  };

  // 提交修改
  const handleSubmit = async () => {
    if (!validatePassword()) return;

    // 调试：在发送请求前检查 token 状态
    console.log('\n🔍 准备修改密码，检查 token 状态...');
    await DebugToken.checkTokenStatus();
    await DebugToken.testTokenInRequest();

    setLoading(true);

    try {
      // 调用修改密码API
      const response = await authApi.changePassword({
        oldPassword,
        newPassword,
      });

      setLoading(false);

      // 检查返回的code
      if (response.code === 200) {
        // 更新本地缓存：标记密码已修改
        try {
          const cachedProfile = await AsyncStorage.getItem('userProfile');
          if (cachedProfile) {
            const profile = JSON.parse(cachedProfile);
            profile.passwordChanged = true;
            await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
            console.log('✅ 已更新本地缓存：passwordChanged = true');
          }
        } catch (error) {
          console.error('❌ 更新本地缓存失败:', error);
        }

        Alert.alert(
          '修改成功',
          response.msg || '密码修改成功',
          [
            {
              text: '确定',
              onPress: () => {
                // 清空表单
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // 返回上一页
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('修改失败', response.msg || '密码修改失败，请稍后重试');
      }
    } catch (error) {
      setLoading(false);
      
      // 处理错误信息
      let errorMessage = '密码修改失败，请稍后重试';
      
      if (error.data && error.data.msg) {
        errorMessage = error.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('❌ 修改密码错误:', error);
      Alert.alert('修改失败', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>修改密码</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
        extraHeight={Platform.OS === 'android' ? 100 : 0}
      >
          {/* 安全提示 */}
          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
            <Text style={styles.tipText}>
              为了您的账号安全，请定期更换密码，并设置强密码
            </Text>
          </View>

          {/* 当前密码 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>当前密码</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                style={styles.input}
                placeholder="请输入当前密码"
                placeholderTextColor="#9ca3af"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showOldPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 新密码 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>新密码</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                style={styles.input}
                placeholder="请输入新密码（8-20位字符）"
                placeholderTextColor="#9ca3af"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* 密码强度指示器 */}
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength.level >= 1 && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength.level >= 2 && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength.level >= 3 && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  密码强度：{passwordStrength.text}
                </Text>
              </View>
            )}

            {/* 密码要求提示 */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>密码要求：</Text>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={newPassword.length >= 8 && newPassword.length <= 20 ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={newPassword.length >= 8 && newPassword.length <= 20 ? '#22c55e' : '#9ca3af'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    newPassword.length >= 8 && newPassword.length <= 20 && styles.requirementTextActive,
                  ]}
                >
                  8-20个字符
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={/\d/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/\d/.test(newPassword) ? '#22c55e' : '#9ca3af'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    /\d/.test(newPassword) && styles.requirementTextActive,
                  ]}
                >
                  包含数字
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={/[a-zA-Z]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/[a-zA-Z]/.test(newPassword) ? '#22c55e' : '#9ca3af'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    /[a-zA-Z]/.test(newPassword) && styles.requirementTextActive,
                  ]}
                >
                  包含字母
                </Text>
              </View>
            </View>
          </View>

          {/* 确认新密码 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>确认新密码</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                style={styles.input}
                placeholder="请再次输入新密码"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* 密码匹配提示 */}
            {confirmPassword.length > 0 && (
              <View style={styles.matchContainer}>
                {newPassword === confirmPassword ? (
                  <View style={styles.matchItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                    <Text style={styles.matchTextSuccess}>两次密码输入一致</Text>
                  </View>
                ) : (
                  <View style={styles.matchItem}>
                    <Ionicons name="close-circle" size={16} color="#ef4444" />
                    <Text style={styles.matchTextError}>两次密码输入不一致</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              loading && styles.submitBtnDisabled,
              (!oldPassword || !newPassword || !confirmPassword) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || !oldPassword || !newPassword || !confirmPassword}
          >
            <Text style={styles.submitBtnText}>
              {loading ? '提交中...' : '确认修改'}
            </Text>
          </TouchableOpacity>

          {/* 安全建议 */}
          <View style={styles.securityTips}>
            <Text style={styles.securityTipsTitle}>💡 安全建议</Text>
            <Text style={styles.securityTipItem}>• 密码长度8-20位字符</Text>
            <Text style={styles.securityTipItem}>• 包含大小写字母、数字和特殊字符</Text>
            <Text style={styles.securityTipItem}>• 不要使用生日、电话号码等容易被猜到的密码</Text>
            <Text style={styles.securityTipItem}>• 定期更换密码，建议3-6个月更换一次</Text>
            <Text style={styles.securityTipItem}>• 不要在多个平台使用相同密码</Text>
          </View>
      </KeyboardAwareScrollView>
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
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  requirementsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  requirementTextActive: {
    color: '#22c55e',
  },
  matchContainer: {
    marginTop: 8,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchTextSuccess: {
    fontSize: 12,
    color: '#22c55e',
  },
  matchTextError: {
    fontSize: 12,
    color: '#ef4444',
  },
  submitBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#fca5a5',
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  securityTips: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  securityTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  securityTipItem: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 22,
  },
});
