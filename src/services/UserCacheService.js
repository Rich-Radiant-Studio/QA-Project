import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from './api/userApi';

/**
 * 用户信息缓存服务
 * 实现大厂级别的缓存策略：启动时读缓存立即显示 + 后台静默刷新更新
 */
class UserCacheService {
  // 缓存键名
  static CACHE_KEY = 'userProfileCache';
  
  // 缓存过期时间（30分钟）
  static CACHE_EXPIRY = 30 * 60 * 1000;
  
  // 缓存版本（用于数据结构变更时清除旧缓存）
  static CACHE_VERSION = '1.0';

  /**
   * 获取用户信息（优先从缓存读取）
   * @returns {Promise<Object|null>} 用户信息
   */
  static async getUserProfile() {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      
      if (cachedData) {
        const cache = JSON.parse(cachedData);
        
        // 检查缓存版本
        if (cache.version === this.CACHE_VERSION) {
          console.log('📦 从缓存读取用户信息:', cache.data);
          return cache.data;
        } else {
          console.log('⚠️ 缓存版本不匹配，清除旧缓存');
          await this.clearCache();
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ 读取用户缓存失败:', error);
      return null;
    }
  }

  /**
   * 保存用户信息到缓存
   * @param {Object} userProfile - 用户信息
   * @returns {Promise<void>}
   */
  static async saveUserProfile(userProfile) {
    try {
      const cache = {
        version: this.CACHE_VERSION,
        timestamp: Date.now(),
        data: userProfile,
      };
      
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
      console.log('✅ 用户信息已缓存');
    } catch (error) {
      console.error('❌ 保存用户缓存失败:', error);
    }
  }

  /**
   * 从服务器获取最新用户信息并更新缓存
   * @param {boolean} silent - 是否静默刷新（不抛出错误）
   * @returns {Promise<Object|null>} 最新用户信息
   */
  static async fetchAndCacheUserProfile(silent = false) {
    try {
      if (!silent) {
        console.log('🔄 从服务器获取最新用户信息...');
      }
      
      const response = await userApi.getProfile();
      
      if (response.code === 200 && response.data) {
        const userProfile = response.data;
        
        // 保存到缓存
        await this.saveUserProfile(userProfile);
        
        if (!silent) {
          console.log('✅ 用户信息已更新:', userProfile);
        }
        return userProfile;
      } else {
        // 静默模式下不打印错误
        if (!silent) {
          console.error('❌ 获取用户信息失败:', response.msg);
        }
        if (!silent) {
          throw new Error(response.msg || '获取用户信息失败');
        }
        return null;
      }
    } catch (error) {
      // 静默模式下不打印错误（除非是网络错误）
      if (!silent || (error.message && !error.message.includes('登录状态已过期') && !error.message.includes('未授权'))) {
        console.error('❌ 获取用户信息出错:', error);
      }
      if (!silent) {
        throw error;
      }
      return null;
    }
  }

  /**
   * 检查缓存是否过期
   * @returns {Promise<boolean>} 是否过期
   */
  static async isCacheExpired() {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      
      if (!cachedData) {
        return true;
      }
      
      const cache = JSON.parse(cachedData);
      const now = Date.now();
      const age = now - cache.timestamp;
      
      return age > this.CACHE_EXPIRY;
    } catch (error) {
      console.error('❌ 检查缓存过期失败:', error);
      return true;
    }
  }

  /**
   * 清除用户信息缓存
   * @returns {Promise<void>}
   */
  static async clearCache() {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
      console.log('🗑️ 用户缓存已清除');
    } catch (error) {
      console.error('❌ 清除用户缓存失败:', error);
    }
  }

  /**
   * 大厂级别策略：启动时读缓存 + 后台刷新
   * @param {Function} onCacheLoaded - 缓存加载完成回调
   * @param {Function} onFreshDataLoaded - 最新数据加载完成回调
   * @returns {Promise<void>}
   */
  static async loadUserProfileWithCache(onCacheLoaded, onFreshDataLoaded) {
    try {
      // 1. 立即从缓存读取并显示（秒开）
      const cachedProfile = await this.getUserProfile();
      if (cachedProfile && onCacheLoaded) {
        onCacheLoaded(cachedProfile);
      }
      
      // 2. 后台静默刷新最新数据
      const freshProfile = await this.fetchAndCacheUserProfile(true);
      
      if (freshProfile && onFreshDataLoaded) {
        // 检查数据是否有变化
        const hasChanged = JSON.stringify(cachedProfile) !== JSON.stringify(freshProfile);
        
        if (hasChanged) {
          onFreshDataLoaded(freshProfile);
        }
      }
    } catch (error) {
      // 静默失败，不影响用户体验
    }
  }

  /**
   * 更新用户信息（同时更新缓存和服务器）
   * @param {Object} updates - 要更新的字段
   * @returns {Promise<Object>} 更新后的用户信息
   */
  static async updateUserProfile(updates) {
    try {
      console.log('📝 更新用户信息:', updates);
      
      // 1. 调用 API 更新服务器
      const response = await userApi.updateProfile(updates);
      
      if (response.code === 200) {
        // 2. 获取最新的完整用户信息
        const freshProfile = await this.fetchAndCacheUserProfile(false);
        
        return freshProfile;
      } else {
        throw new Error(response.msg || '更新失败');
      }
    } catch (error) {
      // 只记录错误类型，不显示后端详细错误
      console.error('❌ 更新用户信息失败');
      throw error;
    }
  }

  /**
   * 更新用户名（调用专用 API）
   * @param {string} username - 新用户名
   * @returns {Promise<Object>} 更新后的用户信息
   */
  static async updateUsername(username) {
    try {
      console.log('📝 更新用户名:', username);
      
      // 1. 调用专用 API 更新用户名
      const response = await userApi.updateUsername(username);
      
      if (response.code === 200) {
        // 2. 获取最新的完整用户信息
        const freshProfile = await this.fetchAndCacheUserProfile(false);
        
        return freshProfile;
      } else {
        throw new Error(response.msg || '更新用户名失败');
      }
    } catch (error) {
      // 只记录错误类型，不显示后端详细错误
      console.error('❌ 更新用户名失败');
      throw error;
    }
  }

  /**
   * 强制刷新用户信息（用于下拉刷新等场景）
   * @returns {Promise<Object|null>} 最新用户信息
   */
  static async forceRefresh() {
    console.log('🔄 强制刷新用户信息...');
    return await this.fetchAndCacheUserProfile(false);
  }
}

export default UserCacheService;
