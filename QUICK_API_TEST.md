# 快速 API 测试指南

## 测试用户信息获取接口

### 方法1：在应用中测试

1. **启动应用**
   ```bash
   npx expo start
   ```

2. **查看控制台日志**
   应该看到：
   ```
   🚀 应用启动中...
   👤 加载用户信息...
   🔄 从服务器获取最新用户信息...
   ✅ 用户信息已更新: [昵称]
   ```

3. **进入设置页面**
   - 点击底部导航栏的"我的"
   - 点击右上角的设置图标
   - 查看用户信息是否正确显示

### 方法2：使用调试按钮

1. **点击调试按钮**（开发模式下右下角的浮动按钮）

2. **查看 Token 状态**
   ```
   Token 存在: true
   Token 长度: XXX
   ```

3. **测试 API 请求**
   调试按钮会自动测试 token 是否在请求头中

### 方法3：手动测试 API

在应用控制台执行：

```javascript
// 测试获取用户信息
import userApi from './src/services/api/userApi';

const response = await userApi.getProfile();
console.log('API 响应:', response);

if (response.code === 200) {
  console.log('✅ 获取成功');
  console.log('用户ID:', response.data.userId);
  console.log('昵称:', response.data.nickName);
  console.log('签名:', response.data.signature);
  console.log('职业:', response.data.profession);
  console.log('所在地:', response.data.location);
} else {
  console.log('❌ 获取失败:', response.msg);
}
```

## 预期结果

### 首次启动（无缓存）

```
🚀 应用启动中...
📊 完整设备信息对象: {...}
🔐 设备指纹: xxx
📋 检查本地存储:
   savedFingerprint: xxx
   savedToken: eyJhbGciOiJIUzUxMiJ9...
✅ 设备已注册，使用已保存的 token
✅ Services initialized successfully

👤 加载用户信息...
📦 从缓存读取用户信息: null
🔄 从服务器获取最新用户信息...
✅ 用户信息已更新: UserX7k2mP
✅ 用户信息已缓存
⚡ 从缓存加载用户信息: UserX7k2mP
```

### 再次启动（有缓存）

```
🚀 应用启动中...
✅ 设备已注册，使用已保存的 token
✅ Services initialized successfully

👤 加载用户信息...
📦 从缓存读取用户信息: UserX7k2mP
⚡ 从缓存加载用户信息: UserX7k2mP
🔄 从服务器获取最新用户信息...
✅ 数据无变化，无需刷新
```

### 设置页面

进入设置页面应该看到：
- 昵称：UserX7k2mP
- 个人简介：热爱编程
- 职业：Python开发
- 所在地：北京

## 常见问题

### Q1: 控制台显示 "❌ 获取用户信息失败"

**可能原因：**
1. Token 无效或过期
2. 网络连接问题
3. 服务器错误

**解决方法：**
```javascript
// 检查 Token
import AsyncStorage from '@react-native-async-storage/async-storage';
const token = await AsyncStorage.getItem('authToken');
console.log('Token:', token);

// 重新注册
import authApi from './src/services/api/authApi';
import DeviceInfo from './src/utils/deviceInfo';

const fingerprint = await DeviceInfo.generateFingerprintString();
const response = await authApi.registerByFingerprint(fingerprint);
console.log('注册响应:', response);
```

### Q2: 设置页面显示默认数据

**可能原因：**
1. API 请求失败
2. 缓存未加载
3. 字段映射错误

**解决方法：**
```javascript
// 检查缓存
import UserCacheService from './src/services/UserCacheService';
const cached = await UserCacheService.getUserProfile();
console.log('缓存数据:', cached);

// 强制刷新
const fresh = await UserCacheService.forceRefresh();
console.log('最新数据:', fresh);
```

### Q3: 控制台显示 403 或 401 错误

**可能原因：**
Token 无效或未添加到请求头

**解决方法：**
```javascript
// 使用调试工具检查
import DebugToken from './src/utils/debugToken';
await DebugToken.checkTokenStatus();
await DebugToken.testTokenInRequest();
```

## 测试清单

- [ ] 应用启动成功
- [ ] 控制台显示"用户信息已更新"
- [ ] 设置页面显示正确的用户信息
- [ ] 昵称显示正确
- [ ] 个人简介显示正确
- [ ] 职业显示正确
- [ ] 所在地显示正确
- [ ] 编辑昵称功能正常
- [ ] 编辑个人简介功能正常
- [ ] 编辑职业功能正常
- [ ] 再次启动应用，数据从缓存加载
- [ ] 后台刷新功能正常

## 下一步

测试通过后，可以：
1. 测试编辑用户信息功能
2. 测试缓存策略（关闭应用再打开）
3. 测试离线模式（关闭网络）
4. 测试数据更新（在其他设备修改信息）

## 快速命令

```bash
# 启动应用
npx expo start

# 清除缓存重新启动
npx expo start -c

# 在 Android 模拟器运行
npx expo start --android

# 在 iOS 模拟器运行
npx expo start --ios
```

## 调试技巧

### 查看完整 API 请求

在 `src/services/api/apiClient.js` 中已经添加了详细日志：
- 请求 URL
- 请求方法
- 请求头（包括 Token）
- 请求体
- 响应数据

### 查看缓存内容

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 查看用户信息缓存
const cache = await AsyncStorage.getItem('userProfileCache');
console.log('缓存:', JSON.parse(cache));

// 查看 Token
const token = await AsyncStorage.getItem('authToken');
console.log('Token:', token);

// 查看用户基本信息
const userInfo = await AsyncStorage.getItem('userInfo');
console.log('用户信息:', JSON.parse(userInfo));
```

## 总结

✅ API 接口：`GET /app/user/profile/me`
✅ Token 自动添加到请求头
✅ 缓存策略：启动时读缓存 + 后台刷新
✅ 错误处理：自动重试和降级
✅ 用户体验：秒开 + 无感更新

现在可以开始测试了！🚀
