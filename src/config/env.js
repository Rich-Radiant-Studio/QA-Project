import Constants from 'expo-constants';

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
  
  // 默认返回开发环境
  return ENV.dev;
};

export default getEnvVars();
