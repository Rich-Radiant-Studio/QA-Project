import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Token 调试工具
 * 用于检查 token 是否正确保存和读取
 */
class DebugToken {
  /**
   * 检查 token 状态
   */
  static async checkTokenStatus() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    Token 状态检查                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    try {
      // 读取 token
      const authToken = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      const deviceFingerprint = await AsyncStorage.getItem('deviceFingerprint');

      console.log('📋 AsyncStorage 内容:');
      console.log('─────────────────────────────────────────────────────────────────');
      
      if (authToken) {
        console.log('✅ authToken 存在');
        console.log(`   长度: ${authToken.length} 字符`);
        console.log(`   完整 Token: ${authToken}`);
      } else {
        console.log('❌ authToken 不存在');
      }
      
      console.log('');
      
      if (refreshToken) {
        console.log('✅ refreshToken 存在');
        console.log(`   长度: ${refreshToken.length} 字符`);
      } else {
        console.log('⚠️  refreshToken 不存在');
      }
      
      console.log('');
      
      if (userInfo) {
        console.log('✅ userInfo 存在');
        try {
          const user = JSON.parse(userInfo);
          console.log(`   用户ID: ${user.userId || 'N/A'}`);
          console.log(`   用户名: ${user.username || 'N/A'}`);
          console.log(`   昵称: ${user.nickName || 'N/A'}`);
        } catch (e) {
          console.log('   ⚠️  解析失败');
        }
      } else {
        console.log('⚠️  userInfo 不存在');
      }
      
      console.log('');
      
      if (deviceFingerprint) {
        console.log('✅ deviceFingerprint 存在');
        console.log(`   指纹: ${deviceFingerprint}`);
      } else {
        console.log('⚠️  deviceFingerprint 不存在');
      }
      
      console.log('\n');
      console.log('═════════════════════════════════════════════════════════════════');
      console.log('\n');

      return {
        hasAuthToken: !!authToken,
        hasRefreshToken: !!refreshToken,
        hasUserInfo: !!userInfo,
        hasDeviceFingerprint: !!deviceFingerprint,
        authToken,
        refreshToken,
        userInfo,
        deviceFingerprint,
      };
    } catch (error) {
      console.error('❌ 检查 token 状态时出错:', error);
      return null;
    }
  }

  /**
   * 测试 token 是否能正确添加到请求头
   */
  static async testTokenInRequest() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  测试 Token 请求头                              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        console.log('✅ 从 AsyncStorage 读取到 token');
        console.log(`   Token (完整): ${token}`);
        console.log('');
        console.log('📤 模拟请求头:');
        console.log('   Authorization: Bearer ' + token);
        console.log('   Content-Type: application/json');
        console.log('');
        console.log('✅ Token 应该会被正确添加到请求头');
      } else {
        console.log('❌ 无法从 AsyncStorage 读取 token');
        console.log('');
        console.log('⚠️  可能的原因:');
        console.log('   1. 应用启动时注册失败');
        console.log('   2. Token 没有正确保存');
        console.log('   3. AsyncStorage 权限问题');
      }
      
      console.log('\n');
      console.log('═════════════════════════════════════════════════════════════════');
      console.log('\n');
    } catch (error) {
      console.error('❌ 测试 token 请求头时出错:', error);
    }
  }

  /**
   * 清除所有 token 数据
   */
  static async clearAllTokens() {
    console.log('🗑️  清除所有 token 数据...');
    try {
      await AsyncStorage.multiRemove([
        'authToken',
        'refreshToken',
        'userInfo',
        'deviceFingerprint',
      ]);
      console.log('✅ 所有 token 数据已清除');
    } catch (error) {
      console.error('❌ 清除 token 数据时出错:', error);
    }
  }

  /**
   * 手动设置测试 token
   */
  static async setTestToken(token = 'test_token_please_replace_with_real_token') {
    console.log('🔧 设置测试 token...');
    try {
      await AsyncStorage.setItem('authToken', token);
      console.log('✅ 测试 token 已设置:', token);
      
      // 验证是否设置成功
      const savedToken = await AsyncStorage.getItem('authToken');
      if (savedToken === token) {
        console.log('✅ 验证成功: token 已正确保存');
      } else {
        console.log('❌ 验证失败: token 保存不正确');
      }
    } catch (error) {
      console.error('❌ 设置测试 token 时出错:', error);
    }
  }
}

export default DebugToken;
