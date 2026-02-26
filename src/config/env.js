import Constants from 'expo-constants';
import { SIMULATE_PRODUCTION } from './debugMode';

// 环境配置
const ENV = {
  dev: {
    apiUrl: 'http://123.144.100.10:30560/qa-hero-app-user',
  },
  staging: {
    apiUrl: 'http://123.144.100.10:30560/qa-hero-app-user',
  },
  prod: {
    apiUrl: 'http://123.144.100.10:30560/qa-hero-app-user',
  }
};

// 自动判断环境
const getEnvVars = () => {
  // 如果开启了模拟生产环境，返回生产配置
  if (SIMULATE_PRODUCTION) {
    console.log('🎭 使用生产环境配置（模拟模式）');
    return ENV.prod;
  }
  
  // 通过 __DEV__ 判断是否为开发环境
  if (__DEV__) {
    return ENV.dev;
  }
  
  // 通过 releaseChannel 判断环境
  const releaseChannel = Constants.expoConfig?.releaseChannel;
  
  if (releaseChannel === 'staging') {
    return ENV.staging;
  }
  
  if (releaseChannel === 'production') {
    return ENV.prod;
  }
  
  // 默认返回生产环境（生产构建时）
  return ENV.prod;
};

export default getEnvVars();
