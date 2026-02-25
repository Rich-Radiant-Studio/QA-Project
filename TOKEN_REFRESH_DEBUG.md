# Token 一直变化问题排查指南

## 问题描述

每次刷新应用，Token 都在变化，导致重复注册。

## 正常流程

```
首次启动：
  生成设备指纹 → 调用注册接口 → 保存 Token 和设备指纹

再次启动：
  生成设备指纹 → 检查本地存储 → 设备指纹匹配 → 使用已保存的 Token ✅
```

## 排查步骤

### 步骤1：检查控制台日志

启动应用，查看控制台输出：

```
🔐 设备指纹: abc123...
📋 检查本地存储:
   savedFingerprint: abc123...  <- 应该和上面相同
   savedToken: eyJhbGciOiJIUzUxMiJ9...
```

**判断：**
- ✅ 如果 `savedFingerprint` 和当前设备指纹相同 → 进入步骤2
- ❌ 如果不同或为 null → 设备指纹问题，进入步骤3

### 步骤2：检查是否使用已保存的 Token

查看控制台是否显示：

```
✅ 设备已注册，使用已保存的 token
```

**如果显示：**
- ✅ `✅ 设备已注册，使用已保存的 token` → Token 正常，不会重新注册
- ❌ `📝 首次启动，正在进行设备指纹注册...` → 进入步骤4

### 步骤3：设备指纹不一致问题

**可能原因：**
1. 设备信息获取不稳定
2. AsyncStorage 存储失败
3. 设备指纹生成算法有问题

**解决方法：**

在控制台执行以下代码，检查设备指纹是否稳定：

```javascript
import DeviceInfo from './src/utils/deviceInfo';

// 多次生成设备指纹，看是否一致
const fp1 = await DeviceInfo.generateFingerprintString();
console.log('第1次:', fp1);

const fp2 = await DeviceInfo.generateFingerprintString();
console.log('第2次:', fp2);

const fp3 = await DeviceInfo.generateFingerprintString();
console.log('第3次:', fp3);

// 应该完全相同
console.log('是否一致:', fp1 === fp2 && fp2 === fp3);
```

**如果不一致：**
设备指纹生成有问题，需要修复 `src/utils/deviceInfo.js`

### 步骤4：Token 保存失败问题

**检查 Token 是否正确保存：**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 检查保存的数据
const token = await AsyncStorage.getItem('authToken');
const fingerprint = await AsyncStorage.getItem('deviceFingerprint');
const userInfo = await AsyncStorage.getItem('userInfo');

console.log('Token:', token);
console.log('设备指纹:', fingerprint);
console.log('用户信息:', userInfo);
```

**如果都是 null：**
AsyncStorage 保存失败，可能是权限问题

### 步骤5：检查后端是否每次都返回新 Token

**可能原因：**
后端设计是每次调用注册接口都返回新 Token

**验证方法：**

1. 手动调用注册接口两次，看 Token 是否相同：

```javascript
import authApi from './src/services/api/authApi';
import DeviceInfo from './src/utils/deviceInfo';

const fingerprint = await DeviceInfo.generateFingerprintString();

// 第一次注册
const response1 = await authApi.registerByFingerprint(fingerprint);
console.log('第1次 Token:', response1.data.token);

// 第二次注册（相同设备指纹）
const response2 = await authApi.registerByFingerprint(fingerprint);
console.log('第2次 Token:', response2.data.token);

// 比较
console.log('Token 是否相同:', response1.data.token === response2.data.token);
```

**如果不同：**
这是后端的设计，每次注册都返回新 Token。这种情况下，应该避免重复注册。

## 解决方案

### 方案1：确保设备指纹稳定（推荐）

如果设备指纹不稳定，修改 `src/utils/deviceInfo.js`，使用更稳定的字段：

```javascript
static async generateFingerprintString() {
  const info = await this.getDeviceInfo();
  
  // 只使用稳定的字段
  const stableFields = [
    info.brand,           // 品牌
    info.model,           // 型号
    info.systemName,      // 系统名称
    info.systemVersion,   // 系统版本
    // 不使用 uniqueId（可能变化）
  ];
  
  const fingerprintString = stableFields.join('|');
  return fingerprintString;
}
```

### 方案2：添加 Token 有效期检查

修改 App.js，检查 Token 是否过期：

```javascript
if (savedFingerprint === fingerprint && savedToken) {
  // 检查 Token 是否过期
  const tokenExpiry = await AsyncStorage.getItem('tokenExpiry');
  const now = Date.now();
  
  if (tokenExpiry && now < parseInt(tokenExpiry)) {
    // Token 未过期，使用已保存的 token
    console.log('✅ 设备已注册，使用已保存的 token');
    setIsLoggedIn(true);
  } else {
    // Token 已过期，重新注册
    console.log('⚠️ Token 已过期，重新注册');
    // 重新注册...
  }
}
```

### 方案3：添加注册时间戳检查

避免短时间内重复注册：

```javascript
// 检查上次注册时间
const lastRegisterTime = await AsyncStorage.getItem('lastRegisterTime');
const now = Date.now();
const timeSinceLastRegister = now - parseInt(lastRegisterTime || 0);

// 如果距离上次注册不到 1 小时，不重新注册
if (timeSinceLastRegister < 60 * 60 * 1000) {
  console.log('✅ 最近刚注册过，使用已保存的 token');
  setIsLoggedIn(true);
  return;
}
```

## 快速修复

如果你想立即解决问题，可以在 App.js 中添加更严格的检查：

<function_calls>
<invoke name="strReplace">
<parameter name="newStr">        if (savedFingerprint === fingerprint && savedToken) {
          // 已经注册过，直接使用保存的 token
          console.log('✅ 设备已注册，使用已保存的 token');
          console.log('   当前设备指纹:', fingerprint);
          console.log('   保存的设备指纹:', savedFingerprint);
          console.log('   Token 前30位:', savedToken.substring(0, 30) + '...');
          
          // 调试：检查 token 状态
          await DebugToken.checkTokenStatus();
          await DebugToken.testTokenInRequest();
          
          setIsLoggedIn(true);
        } else {
          // 首次启动或设备变更，进行设备指纹注册
          console.log('📝 需要注册，原因:');
          console.log('   设备指纹匹配:', savedFingerprint === fingerprint);
          console.log('   Token 存在:', !!savedToken);
          console.log('   当前设备指纹:', fingerprint);
          console.log('   保存的设备指纹:', savedFingerprint);
          
          try {