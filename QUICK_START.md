# 快速开始指南

## 🚀 立即测试修改密码功能

### 1. 启动开发服务器

```bash
npx expo start --dev-client --tunnel --port 8082
```

或使用快捷脚本：
```bash
start-tunnel.bat
```

---

### 2. 在真机上打开应用

- 扫描二维码或输入服务器地址
- 等待应用加载完成

---

### 3. 登录（自动设置测试 Token）

1. 应用打开后会显示登录页面
2. **直接点击"登录"按钮**（不需要输入任何内容）
3. 应用会自动设置测试 token 并进入主页面
4. 控制台会显示：`✅ Test token set: test_token_please_replace_with_real_token`

---

### 4. 测试修改密码

1. 点击底部导航栏的"我的"（Profile）
2. 点击"设置"（Settings）
3. 点击"修改密码"（Change Password）
4. 输入密码：
   - 当前密码：任意输入
   - 新密码：8-20 字符
   - 确认新密码：与新密码相同
5. 点击"确认修改"

---

### 5. 查看请求日志

在开发服务器终端查看：

```
📤 API Request: {
  method: 'PUT',
  url: '/app/user/auth/password',
  data: { oldPassword: '***', newPassword: '***' }
}

Request Headers: {
  Authorization: 'Bearer test_token_please_replace_with_real_token',
  Content-Type: 'application/json'
}
```

**✅ 如果看到 `Authorization` 头，说明 token 已正确添加！**

---

## 🔧 使用真实 Token

### 选项 1: 替换测试 Token（最简单）

编辑 `src/screens/LoginScreen.js`，找到第 48 行：

```javascript
const testToken = 'test_token_please_replace_with_real_token';
```

替换为你的真实 token：

```javascript
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

保存后重新加载应用，点击登录即可。

---

### 选项 2: 启用真实登录 API

编辑 `src/screens/LoginScreen.js`：

1. **注释掉测试 token 代码**（第 46-60 行）：
```javascript
/*
if (__DEV__) {
  try {
    const testToken = 'test_token_please_replace_with_real_token';
    await AsyncStorage.setItem('authToken', testToken);
    // ...
    return;
  } catch (error) {
    console.error('Failed to set test token:', error);
  }
}
*/
```

2. **取消注释真实登录逻辑**（第 62-110 行）：
```javascript
// 基本验证
if (!email || !email.trim()) {
  Alert.alert('提示', '请输入邮箱或手机号');
  return;
}

if (!password || !password.trim()) {
  Alert.alert('提示', '请输入密码');
  return;
}

setLoading(true);

try {
  // 调用登录 API
  const response = await authApi.login({
    phone: email,
    password: password,
  });

  setLoading(false);

  if (response.code === 200 || response.token) {
    Alert.alert('登录成功', '欢迎回来！', [
      {
        text: '确定',
        onPress: () => {
          if (onLogin) {
            onLogin();
          }
        },
      },
    ]);
  } else {
    Alert.alert('登录失败', response.msg || '登录失败，请检查账号密码');
  }
} catch (error) {
  setLoading(false);
  
  let errorMessage = '登录失败，请稍后重试';
  
  if (error.data && error.data.msg) {
    errorMessage = error.data.msg;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  Alert.alert('登录失败', errorMessage);
  console.error('Login error:', error);
}
```

3. 保存后重新加载应用
4. 输入真实的账号密码登录

---

### 选项 3: 手动设置 Token（调试用）

在 React Native Debugger Console 中执行：

```javascript
AsyncStorage.setItem('authToken', 'your_real_token_here').then(() => {
  console.log('Token set successfully');
});
```

然后重新加载应用。

---

## 🔍 验证 Token 是否生效

### 方法 1: 查看控制台日志

修改密码时，查看请求日志中是否有 `Authorization` 头。

### 方法 2: 使用 Debugger

在 React Native Debugger Console 中：

```javascript
// 查看当前 token
AsyncStorage.getItem('authToken').then(token => {
  console.log('Current token:', token);
});

// 查看所有存储数据
AsyncStorage.getAllKeys().then(keys => {
  AsyncStorage.multiGet(keys).then(stores => {
    console.log('All stored data:', stores);
  });
});
```

---

## 📊 预期结果

### 使用测试 Token

**请求会发送，但可能返回：**
- `401 Unauthorized` - Token 无效
- `403 Forbidden` - 没有权限
- `200 OK` - 如果测试 token 恰好有效（不太可能）

**这是正常的！** 测试 token 只是用来验证请求头是否正确添加。

### 使用真实 Token

**应该返回：**
- `200 OK` - 密码修改成功
- `400 Bad Request` - 参数错误（如旧密码错误）
- `401 Unauthorized` - Token 过期
- `403 Forbidden` - 权限不足

---

## ⚠️ 常见问题

### Q1: 点击登录后没有进入主页面

**检查：**
1. 控制台是否有错误
2. 是否显示了 Alert 弹窗
3. `onLogin` 函数是否被调用

**解决：**
查看控制台日志，确认 token 是否设置成功。

---

### Q2: 修改密码时返回 403

**原因：**
- 测试 token 无效
- 真实 token 过期
- 没有修改密码的权限

**解决：**
1. 使用真实 token
2. 检查 token 是否过期
3. 联系后端确认权限配置

---

### Q3: 请求没有 Authorization 头

**检查：**
1. Token 是否保存到 AsyncStorage
2. 是否使用了 `apiClient` 发送请求
3. 请求拦截器是否正常工作

**解决：**
```javascript
// 检查 token
AsyncStorage.getItem('authToken').then(token => {
  console.log('Token:', token);
});

// 检查拦截器
// 在 src/services/api/apiClient.js 中添加日志
console.log('Token from storage:', token);
console.log('Request headers:', config.headers);
```

---

### Q4: 键盘遮挡输入框

**已修复！** 使用了 `react-native-keyboard-aware-scroll-view`。

如果仍有问题，调整参数：
- iOS: `extraScrollHeight={20}`
- Android: `extraHeight={100}`

---

## 📁 关键文件

```
src/
├── screens/
│   ├── LoginScreen.js           # 登录页面（修改这里设置 token）
│   └── ChangePasswordScreen.js  # 修改密码页面
├── services/
│   └── api/
│       ├── apiClient.js         # Token 自动添加（请求拦截器）
│       └── authApi.js           # 认证 API（changePassword 方法）
└── config/
    ├── env.js                   # 环境配置（服务器地址）
    └── api.js                   # API 端点配置
```

---

## 🎯 测试检查清单

- [ ] 开发服务器已启动
- [ ] 应用已连接到服务器
- [ ] 点击登录，进入主页面
- [ ] 控制台显示 "Test token set"
- [ ] 进入修改密码页面
- [ ] 输入密码，点击确认
- [ ] 查看请求日志
- [ ] 确认有 `Authorization: Bearer {token}` 头
- [ ] 查看响应结果

---

## 📚 更多文档

- `CONTEXT_SUMMARY.md` - 项目完整状态总结
- `TOKEN_AUTHENTICATION_GUIDE.md` - Token 认证详细说明
- `API_USAGE_GUIDE.md` - API 使用指南
- `QUICK_TOKEN_TEST.md` - 快速测试指南

---

**现在就可以开始测试了！** 🚀

**所有 API 请求都会自动带上 `Authorization: Bearer {token}`！** ✅
