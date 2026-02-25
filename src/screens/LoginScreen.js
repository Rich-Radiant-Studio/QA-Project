import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import authApi from '../services/api/authApi';
import DeviceInfo from '../utils/deviceInfo';
import { showToast } from '../utils/toast';

/**
 * 用户名密码登录页面
 * 标识：LoginScreen.js - 用户名密码登录（当前使用）
 * 对比：EmailLoginScreen.js - 邮箱验证码登录（暂时隐藏，后续迭代使用）
 */
export default function LoginScreen({ navigation, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  // 验证用户名
  const validateUsername = (value) => {
    if (!value.trim()) {
      return '请输入用户名';
    }
    if (value.length < 3) {
      return '用户名至少3个字符';
    }
    return '';
  };

  // 验证密码
  const validatePassword = (value) => {
    if (!value) {
      return '请输入密码';
    }
    if (value.length < 6) {
      return '密码至少6个字符';
    }
    return '';
  };

  // 处理登录
  const handleLogin = async () => {
    // 验证输入
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    setLoading(true);
    setErrors({ username: '', password: '' });

    try {
      console.log('\n🔐 开始登录...');
      console.log('   用户名:', username);
      
      // 调用登录 API
      const response = await authApi.login({
        username: username.trim(),
        password: password,
      });

      console.log('📥 登录响应:', JSON.stringify(response, null, 2));

      if (response.code === 200 && response.data) {
        console.log('✅ 登录成功！');
        console.log('   Token:', response.data.token);
        
        // 显示成功提示
        showToast('登录成功', 'success');
        
        // 调用父组件的 onLogin 回调
        if (onLogin) {
          onLogin();
        }
      } else {
        console.error('❌ 登录失败:', response.msg);
        showToast(response.msg || '用户名或密码错误', 'error');
      }
    } catch (error) {
      // 只记录错误类型，不显示详细信息
      console.error('❌ 登录异常');
      showToast(error.message || '网络错误，请检查连接后重试', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 清除用户名错误
  const handleUsernameChange = (value) => {
    setUsername(value);
    if (errors.username) {
      setErrors({ ...errors, username: '' });
    }
  };

  // 清除密码错误
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  // 使用设备指纹登录（带重试机制）
  const handleDeviceLogin = async () => {
    setDeviceLoading(true);

    // 重试函数
    const loginWithRetry = async (fingerprint, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          console.log(`🔄 尝试设备登录 (${i + 1}/${maxRetries})...`);
          const response = await authApi.registerByFingerprint(fingerprint);
          
          if (response.code === 200 && response.data) {
            console.log('✅ 设备登录成功！');
            return { success: true, data: response.data };
          } else {
            console.error(`⚠️ 第 ${i + 1} 次尝试返回错误:`, response.msg);
          }
        } catch (error) {
          console.error(`❌ 第 ${i + 1} 次尝试失败:`, error.message);
          
          if (i < maxRetries - 1) {
            const delay = Math.pow(2, i) * 1000;
            console.log(`⏳ 等待 ${delay}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      return { success: false };
    };

    try {
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('📱 用户点击"使用设备登录"按钮');
      console.log('⚙️  环境:', __DEV__ ? '开发环境' : '生产环境');
      console.log('═══════════════════════════════════════════════════════════════');
      
      // 生成设备指纹
      console.log('📱 步骤 1: 生成设备指纹');
      const fingerprint = await DeviceInfo.generateFingerprintString();
      console.log('   ✅ 设备指纹生成成功:', fingerprint);
      
      // 使用重试机制调用设备指纹注册接口
      console.log('\n📡 步骤 2: 调用设备指纹注册/登录接口（带重试）');
      const result = await loginWithRetry(fingerprint);
      
      console.log('\n📊 步骤 3: 处理响应');
      
      if (result.success && result.data) {
        console.log('\n✅ 设备登录成功！');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('👤 用户信息:');
        console.log('   用户名:', result.data.userBaseInfo?.username);
        console.log('   用户ID:', result.data.userBaseInfo?.userId);
        console.log('═══════════════════════════════════════════════════════════════');
        
        // 显示成功提示
        showToast(`登录成功！您的用户名是 ${result.data.userBaseInfo?.username}`, 'success');
        
        // 调用父组件的 onLogin 回调
        if (onLogin) {
          onLogin();
        }
      } else {
        console.error('\n❌ 设备登录失败（已重试3次）');
        console.error('═══════════════════════════════════════════════════════════════');
        
        showToast('设备登录失败，请检查网络后重试', 'error');
      }
    } catch (error) {
      console.error('\n❌ 设备登录异常');
      console.error('═══════════════════════════════════════════════════════════════');
      console.error('错误类型:', error.constructor.name);
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
      console.error('═══════════════════════════════════════════════════════════════');
      
      showToast(error.message || '网络错误，请检查连接后重试', 'error');
    } finally {
      setDeviceLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo 区域 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="help-circle" size={60} color="#ef4444" />
            </View>
            <Text style={styles.appName}>Problem to Hero</Text>
            <Text style={styles.appSlogan}>Turn problems into heroic solutions</Text>
          </View>

          {/* 登录表单 */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>登录</Text>

            {/* 用户名输入 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>用户名</Text>
              <View style={[
                styles.inputWrapper,
                errors.username && styles.inputWrapperError
              ]}>
                <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="请输入用户名"
                  placeholderTextColor="#9ca3af"
                  value={username}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {username.length > 0 && (
                  <TouchableOpacity onPress={() => setUsername('')}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
              {errors.username ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ef4444" />
                  <Text style={styles.errorText}>{errors.username}</Text>
                </View>
              ) : null}
            </View>

            {/* 密码输入 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>密码</Text>
              <View style={[
                styles.inputWrapper,
                errors.password && styles.inputWrapperError
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="请输入密码"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ef4444" />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              ) : null}
            </View>

            {/* 登录按钮 */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>登录</Text>
              )}
            </TouchableOpacity>

            {/* 分隔线 */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>或</Text>
              <View style={styles.divider} />
            </View>

            {/* 设备登录按钮 */}
            <TouchableOpacity
              style={[styles.deviceLoginButton, deviceLoading && styles.deviceLoginButtonDisabled]}
              onPress={handleDeviceLogin}
              disabled={deviceLoading}
              activeOpacity={0.8}
            >
              {deviceLoading ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <>
                  <Ionicons name="phone-portrait-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                  <Text style={styles.deviceLoginButtonText}>使用设备登录</Text>
                </>
              )}
            </TouchableOpacity>

            {/* 提示文本 */}
            <Text style={styles.hintText}>
              首次使用将自动创建账号，默认密码为 12345678
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  appSlogan: {
    fontSize: 14,
    color: '#6b7280',
  },
  formContainer: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 52,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
  },
  loginButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#fca5a5',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9ca3af',
  },
  deviceLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    height: 52,
  },
  deviceLoginButtonDisabled: {
    borderColor: '#fca5a5',
    opacity: 0.6,
  },
  deviceLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  hintText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});
