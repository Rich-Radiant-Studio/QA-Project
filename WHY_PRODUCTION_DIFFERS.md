# 为什么生产版本逻辑会改变？

## 🎯 核心问题

你的代码在开发环境运行正常，但构建生产版本后逻辑改变了。这不是 bug，而是 React Native 的**编译时优化机制**。

## 📊 技术原理

### 1. `__DEV__` 是编译时常量，不是运行时变量

```javascript
// 你的代码
if (__DEV__) {
  console.log('这是开发环境');
  DebugToken.checkTokenStatus();
}
```

**开发模式编译后：**
```javascript
if (true) {  // __DEV__ 被替换为 true
  console.log('这是开发环境');
  DebugToken.checkTokenStatus();
}
```

**生产模式编译后：**
```javascript
if (false) {  // __DEV__ 被替换为 false
  // 这段代码被完全删除！不会出现在最终的 APK 中
}
```

### 2. Dead Code Elimination（死代码消除）

Metro Bundler（React Native 的打包工具）会在生产构建时：
1. 将 `__DEV__` 替换为 `false`
2. 识别 `if (false)` 块
3. 完全删除这些代码（减小包体积）

**结果**：生产版本的 APK 中根本不包含这些代码！

## 🔍 你的代码中受影响的地方

### 影响 1：日志被完全删除

```javascript
// App.js
if (__DEV__) {
  DebugToken.checkTokenStatus();  // ❌ 生产版本不执行
  DebugToken.testTokenInRequest(); // ❌ 生产版本不执行
}
```

**生产版本**：这两行代码不存在

### 影响 2：自动重新注册逻辑被删除

```javascript
// App.js
if (__DEV__) {
  console.log('🔧 开发模式：自动清除过期 Token 并重新注册');
  // ... 重新注册逻辑
} else {
  // 生产模式直接退出登录
  setIsLoggedIn(false);
  showToast('登录状态已过期，请重新登录', 'error');
}
```

**开发版本**：Token 过期时自动重新注册
**生产版本**：Token 过期时直接退出登录

### 影响 3：详细日志不可见

```javascript
// apiClient.js
if (__DEV__) {
  console.log('📤 API Request:', config.url);
  console.log('📥 API Response:', response.data);
}
```

**生产版本**：看不到任何 API 请求/响应日志

## ⚠️ 这导致的问题

### 问题 1：无法诊断生产环境问题
- 用户反馈"登录失败"
- 你无法看到日志
- 不知道是网络问题、服务器问题还是代码问题

### 问题 2：开发环境和生产环境行为不一致
- 开发环境：自动重试、详细日志、友好提示
- 生产环境：静默失败、无日志、用户困惑

### 问题 3：需要重新调试生产版本
- 开发环境测试通过 ≠ 生产环境正常
- 必须构建生产版本测试
- 增加开发和测试成本

## 💡 解决方案

### 方案 1：移除 `__DEV__` 限制（推荐）

**关键日志不要用 `__DEV__` 包裹**：

```javascript
// ❌ 错误做法
if (__DEV__) {
  console.log('📱 设备指纹:', fingerprint);
  console.log('📡 注册响应:', response);
}

// ✅ 正确做法
console.log('📱 设备指纹:', fingerprint);
console.log('📡 注册响应:', response);

// 仅详细调试信息用 __DEV__
if (__DEV__) {
  console.log('🔍 详细请求头:', JSON.stringify(headers, null, 2));
}
```

### 方案 2：使用自定义日志级别

创建一个日志工具，可以控制日志级别：

```javascript
// src/utils/logger.js
const LOG_LEVEL = {
  ERROR: 0,   // 生产环境也显示
  WARN: 1,    // 生产环境也显示
  INFO: 2,    // 生产环境也显示
  DEBUG: 3,   // 仅开发环境
};

const CURRENT_LEVEL = __DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO;

export const logger = {
  error: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVEL.ERROR) {
      console.error('❌', ...args);
    }
  },
  warn: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVEL.WARN) {
      console.warn('⚠️', ...args);
    }
  },
  info: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVEL.INFO) {
      console.log('ℹ️', ...args);
    }
  },
  debug: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVEL.DEBUG) {
      console.log('🔍', ...args);
    }
  },
};

// 使用
logger.info('设备指纹:', fingerprint);  // 生产环境也显示
logger.debug('详细请求数据:', data);     // 仅开发环境
```

### 方案 3：统一开发和生产逻辑

**不要让关键逻辑依赖 `__DEV__`**：

```javascript
// ❌ 错误做法
if (__DEV__) {
  // 开发环境自动重试
  await retryRegister();
} else {
  // 生产环境直接失败
  showError();
}

// ✅ 正确做法
// 开发和生产环境都自动重试
try {
  await retryRegister();
} catch (error) {
  logger.error('注册失败:', error);
  showError();
}
```

### 方案 4：使用环境配置文件

```javascript
// src/config/env.js
const ENV = {
  dev: {
    apiUrl: 'http://...',
    enableDebugLogs: true,    // 开发环境详细日志
    autoRetry: true,
  },
  prod: {
    apiUrl: 'http://...',
    enableDebugLogs: false,   // 生产环境关键日志
    autoRetry: true,          // 生产环境也重试
  }
};

// 使用
if (ENV.enableDebugLogs) {
  console.log('详细调试信息');
}
```

## 🎯 最佳实践

### 1. 日志分类

```javascript
// ✅ 关键日志 - 生产环境也需要
console.log('📱 应用启动');
console.log('✅ 注册成功');
console.error('❌ 注册失败:', error);

// ✅ 调试日志 - 仅开发环境
if (__DEV__) {
  console.log('🔍 请求头:', headers);
  console.log('🔍 响应体:', JSON.stringify(response, null, 2));
}
```

### 2. 错误处理统一

```javascript
// ✅ 开发和生产环境都有完善的错误处理
try {
  const result = await someOperation();
  console.log('✅ 操作成功');
  return result;
} catch (error) {
  console.error('❌ 操作失败:', error.message);
  
  // 开发环境显示详细堆栈
  if (__DEV__) {
    console.error('堆栈:', error.stack);
  }
  
  // 生产环境也要有友好提示
  showToast('操作失败，请重试', 'error');
  throw error;
}
```

### 3. 功能开关

```javascript
// ✅ 使用配置控制功能，而不是 __DEV__
const FEATURES = {
  autoRetry: true,           // 开发和生产都启用
  detailedLogs: __DEV__,     // 仅开发环境
  debugPanel: __DEV__,       // 仅开发环境
};

if (FEATURES.autoRetry) {
  await retryOperation();
}
```

## 📝 你需要做的修改

### 修改 1：移除关键日志的 `__DEV__` 限制

```javascript
// src/services/api/authApi.js
// ❌ 删除这个
if (__DEV__) {
  console.log('📱 设备指纹注册/登录');
}

// ✅ 改为这个
console.log('📱 设备指纹注册/登录');
console.log('⚙️  环境:', __DEV__ ? '开发' : '生产');
```

### 修改 2：统一重试逻辑

```javascript
// App.js
// ❌ 删除这个
if (__DEV__) {
  // 开发模式自动重新注册
} else {
  // 生产模式直接退出
}

// ✅ 改为这个
// 开发和生产都自动重试
try {
  await autoRetryRegister();
} catch (error) {
  console.error('❌ 重试失败:', error);
  setIsLoggedIn(false);
}
```

### 修改 3：添加重试机制

```javascript
// 开发和生产环境都使用重试机制
const autoRegisterWithRetry = async (fingerprint, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 尝试注册 (${i + 1}/${maxRetries})`);
      const response = await authApi.registerByFingerprint(fingerprint);
      
      if (response.code === 200) {
        console.log('✅ 注册成功');
        return response;
      }
    } catch (error) {
      console.error(`❌ 第 ${i + 1} 次失败:`, error.message);
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`⏳ ${delay}ms 后重试`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error('注册失败，已重试 ' + maxRetries + ' 次');
};
```

## ✅ 修改后的效果

### 开发环境
- ✅ 关键日志可见
- ✅ 详细调试信息可见
- ✅ 自动重试
- ✅ 友好错误提示

### 生产环境
- ✅ 关键日志可见（通过 adb logcat）
- ❌ 详细调试信息不可见（减小包体积）
- ✅ 自动重试（与开发环境一致）
- ✅ 友好错误提示（与开发环境一致）

## 🚀 是否需要重新调试生产版本？

### 修改前：需要 ❌
- 开发环境和生产环境逻辑不同
- 必须构建生产版本测试
- 发现问题后修改代码，再次构建测试

### 修改后：不需要 ✅
- 开发环境和生产环境逻辑一致
- 开发环境测试通过 = 生产环境正常
- 只需在发布前构建一次验证即可

## 📚 总结

1. **`__DEV__` 是编译时常量**，不是运行时变量
2. **生产构建会删除 `if (__DEV__)` 块中的代码**
3. **关键逻辑不要依赖 `__DEV__`**
4. **关键日志不要用 `__DEV__` 包裹**
5. **开发和生产环境应该有一致的核心逻辑**
6. **只有详细调试信息才用 `__DEV__` 限制**

遵循这些原则，你就不需要每次都重新调试生产版本了！
