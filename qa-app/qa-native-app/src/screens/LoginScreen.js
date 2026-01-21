import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function LoginScreen({ navigation, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendCode = () => {
    if (!email || !validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    alert('Verification code sent to your email');
  };

  const handleSubmit = () => {
    if (!email || !validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!verifyCode || verifyCode.length < 6) {
      alert('Please enter the 6-digit verification code');
      return;
    }
    if (!isLogin && !agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    // 模拟登录/注册成功
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="help-circle" size={60} color="#ef4444" />
            </View>
            <Text style={styles.appName}>Q&A Community</Text>
            <Text style={styles.slogan}>Share knowledge, find answers</Text>
          </View>

          {/* 切换标签 */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tab, isLogin && styles.tabActive]} onPress={() => setIsLogin(true)}>
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, !isLogin && styles.tabActive]} onPress={() => setIsLogin(false)}>
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* 表单 */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#9ca3af" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#9ca3af"
                  value={verifyCode}
                  onChangeText={setVerifyCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity 
                  style={[styles.codeBtn, countdown > 0 && styles.codeBtnDisabled]} 
                  onPress={handleSendCode}
                  disabled={countdown > 0}
                >
                  <Text style={[styles.codeBtnText, countdown > 0 && styles.codeBtnTextDisabled]}>
                    {countdown > 0 ? `${countdown}s` : 'Send Code'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <TouchableOpacity style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)}>
                <Ionicons name={agreeTerms ? "checkbox" : "square-outline"} size={20} color={agreeTerms ? "#ef4444" : "#9ca3af"} />
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

          {/* 第三方登录 */}
          <View style={styles.thirdPartySection}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialBtns}>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome5 name="google" size={24} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome5 name="facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome5 name="apple" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 24 },
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  slogan: { fontSize: 14, color: '#9ca3af' },
  tabBar: { flexDirection: 'row', marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#f3f4f6' },
  tabActive: { borderBottomColor: '#ef4444' },
  tabText: { fontSize: 16, color: '#9ca3af' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  form: { marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1f2937' },
  codeBtn: { backgroundColor: '#ef4444', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  codeBtnDisabled: { backgroundColor: '#fecaca' },
  codeBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  codeBtnTextDisabled: { color: '#fff' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  termsText: { flex: 1, marginLeft: 8, fontSize: 13, color: '#6b7280', lineHeight: 18 },
  termsLink: { color: '#ef4444' },
  submitBtn: { backgroundColor: '#ef4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  thirdPartySection: { marginTop: 'auto' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: '#9ca3af' },
  socialBtns: { flexDirection: 'row', justifyContent: 'center', gap: 32 },
  socialBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
});
