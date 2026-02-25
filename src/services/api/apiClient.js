import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// 请求拦截器
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // 从本地存储获取 token
      const token = await AsyncStorage.getItem('authToken');
      
      if (__DEV__) {
        console.log('\n🔍 请求拦截器 - 读取 token:');
        console.log('   Token 存在:', !!token);
        if (token) {
          console.log('   Token 长度:', token.length);
          console.log('   Token (完整):', token);
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (__DEV__) {
          console.log('✅ Authorization 头已添加');
        }
      } else {
        if (__DEV__) {
          console.log('⚠️  Token 不存在，未添加 Authorization 头');
        }
      }
      
      // 打印请求信息（开发环境）
      if (__DEV__) {
        console.log('\n📤 API Request:');
        console.log('   Method:', config.method?.toUpperCase());
        console.log('   URL:', config.url);
        console.log('   Base URL:', config.baseURL);
        console.log('   Full URL:', config.baseURL + config.url);
        console.log('   Headers:', JSON.stringify(config.headers, null, 2));
        if (config.data) {
          // 检查是否是 FormData
          if (config.data instanceof FormData) {
            console.log('   Data: [FormData]');
          } else {
            console.log('   Data:', JSON.stringify(config.data, null, 2));
          }
        }
        console.log('');
      }
      
      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 打印响应信息（开发环境）
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    
    // 处理嵌套的 data 结构
    // 如果返回的是 {data: {code: 200, data: {...}, msg: "..."}}
    // 则提取内层的 {code: 200, data: {...}, msg: "..."}
    if (response.data && response.data.data !== undefined && response.data.code !== undefined) {
      return response.data;
    }
    
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 打印错误信息
    if (__DEV__) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // 处理 401 未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 尝试刷新 token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          
          const { token } = response.data;
          await AsyncStorage.setItem('authToken', token);
          
          // 重试原始请求
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新 token 失败，清除本地存储并跳转到登录页
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userInfo']);
        // 这里可以触发全局登出事件
        console.log('Token refresh failed, user needs to login again');
      }
    }
    
    // 统一错误处理
    const errorMessage = getErrorMessage(error);
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// 获取错误信息
const getErrorMessage = (error) => {
  if (error.response) {
    // 服务器返回错误
    const { data, status } = error.response;
    
    if (data?.message) {
      return data.message;
    }
    
    switch (status) {
      case 400:
        return '请求参数错误';
      case 401:
        return '未授权，请重新登录';
      case 403:
        return '没有权限访问';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器错误，请稍后重试';
      case 502:
        return '网关错误';
      case 503:
        return '服务暂时不可用';
      default:
        return `请求失败 (${status})`;
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return '网络连接失败，请检查网络';
  } else {
    // 其他错误
    return error.message || '请求失败';
  }
};

export default apiClient;
