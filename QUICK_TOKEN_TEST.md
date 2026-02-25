# 快速测试 Token 功能

## 🚀 立即测试修改密码功能

### 方法 1: 使用临时测试 token（推荐）

我已经在登录页面添加了临时测试功能：

1. **打开应用，进入登录页面**
2. **直接点击"登录"按钮**（不需要输入任何内容）
3. **会自动设置测试 token 并进入主页面**
4. **进入 设置 > 修改密码**
5. **测试修改密码功能**

### 方法 2: 手动设置真实 token

如果你有真实的 token，可以替换测试 token：

**编辑文件：** `src/screens/LoginScreen.js`

找到这一行：
```javascript
const testToken = 'test_token_please_replace_with_real_token';
```

替换为你的真实 token：
```javascript
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...你的真实token';
```

---

## 🔍 验证 Token 是否生效

### 1. 查看控制台日志

登录后，在开发服务器终端应该看到：
```
✅ Test token set: test_token_please_replace_with_real_token
```

### 2. 测试修改密码

进入修改密码页面，点击确认修改，查看请求日志：

```
📤 Request Headers: {
  Authorization: 'Bearer test_token_please_replace_with_real_token',
  Content-Type: 'application/json',
  ...
}
```

### 3. 检查请求是否带 token

在 Chrome DevTools 或 React Native Debugger 中：

```javascript
// 查看保存的 token
AsyncStorage.getItem('authToken').then(token => {
  console.log('Saved token:', token);
});
```

---

## 📝 获取真实 Token 的方法

### 方法 1: 使用 Postman 测试登录 API

```
POST http://27.8.143.201:30560/qa-hero-app-user/auth/login

Body (JSON):
{
  "phone": "你的手机号",
  "password": "你的密码"
}

Response:
{
  "code": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  ...
}
```

复制 response 中的 token，替换到代码中。

### 方法 2: 联系后端获取测试 token

向后端开发人员索要一个测试用的 token。

### 方法 3: 启用真实登录 API

在 `src/screens/LoginScreen.js` 中，取消注释真实登录逻辑：

1. 找到 `handleSubmit` 函数
2. 注释掉测试 token 部分
3. 取消注释真实登录逻辑
4. 输入真实的账号密码登录

---

## ⚡ 快速切换测试/生产模式

### 测试模式（当前）

```javascript
if (__DEV__) {
  // 设置测试 token
  const testToken = 'test_token_please_replace_with_real_token';
  await AsyncStorage.setItem('authToken', testToken);
  // ...
  return; // 直接返回，不调用真实 API
}
```

### 生产模式

注释掉测试代码，启用真实 API：

```javascript
// if (__DEV__) {
//   const testToken = 'test_token_please_replace_with_real_token';
//   await AsyncStorage.setItem('authToken', testToken);
//   return;
// }

// 真实登录逻辑
const response = await authApi.login({
  phone: email,
  password: password,
});
```

---

## 🧪 完整测试流程

### 1. 设置测试 token
```
打开应用 → 点击登录 → 自动设置 token → 进入主页面
```

### 2. 测试修改密码
```
设置 → 修改密码 → 输入密码 → 点击确认
```

### 3. 查看请求
```
开发服务器终端 → 查看 API Request 日志 → 确认有 Authorization 头
```

### 4. 预期结果

**如果 token 有效：**
- 返回 200 OK
- 密码修改成功

**如果 token 无效：**
- 返回 401 Unauthorized
- 提示 token 过期或无效

**如果没有权限：**
- 返回 403 Forbidden
- 检查 token 是否正确

---

## 🔧 调试命令

### 查看当前 token

在 React Native Debugger Console 中执行：

```javascript
AsyncStorage.getItem('authToken').then(token => {
  console.log('Current token:', token);
});
```

### 手动设置 token

```javascript
AsyncStorage.setItem('authToken', 'your_token_here').then(() => {
  console.log('Token set successfully');
});
```

### 清除 token

```javascript
AsyncStorage.removeItem('authToken').then(() => {
  console.log('Token removed');
});
```

### 查看所有存储的数据

```javascript
AsyncStorage.getAllKeys().then(keys => {
  AsyncStorage.multiGet(keys).then(stores => {
    console.log('All stored data:', stores);
  });
});
```

---

## ✅ 检查清单

测试前确认：

- [ ] 开发服务器正在运行
- [ ] 应用已连接到开发服务器
- [ ] 可以看到控制台日志
- [ ] 已设置测试 token 或真实 token

测试时检查：

- [ ] 登录成功，进入主页面
- [ ] 控制台显示 "Test token set"
- [ ] 进入修改密码页面
- [ ] 输入密码，点击确认
- [ ] 查看请求日志，确认有 Authorization 头
- [ ] 查看响应，确认请求成功或失败原因

---

## 🎯 下一步

### 当后端 API 准备好后

1. 在 `src/screens/LoginScreen.js` 中
2. 注释掉测试 token 代码
3. 取消注释真实登录逻辑
4. 测试真实登录流程
5. 确认 token 正确保存
6. 测试修改密码等需要认证的功能

### 当前可以做的

1. ✅ 使用测试 token 测试修改密码 UI
2. ✅ 测试键盘处理是否正常
3. ✅ 测试密码验证逻辑
4. ✅ 测试错误提示
5. ✅ 准备好真实 token 后立即切换

---

**现在就可以测试修改密码功能了！** 🚀
