const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 优化配置以提高真机连接稳定性
config.server = {
  ...config.server,
  // 允许所有来源访问（用于真机连接）
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // 添加 CORS 头
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return middleware(req, res, next);
    };
  },
};

// 优化 transformer 配置
config.transformer = {
  ...config.transformer,
  // 启用内联 requires 以提高性能
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// 优化 resolver 配置
config.resolver = {
  ...config.resolver,
  // 添加常用的文件扩展名
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
};

module.exports = config;
