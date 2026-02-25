# 真机连接问题排查

## 问题现象
真机无法连接到应用或无法访问后端服务

---

## 快速诊断

### 1. 运行诊断脚本
```bash
check-connection.bat
```

这个脚本会自动检查：
- ✅ 后端服务器连接状态
- ✅ 端口占用情况
- ✅ Node.js 和 npm 版本
- ✅ Expo CLI 状态
- ✅ 项目依赖安装情况

---

## 分步排查

### 第一步：确认后端服务器可访问

**在电脑上测试:**
```bash
# 使用 curl 测试
curl http://27.8.143.201:30560/qa-hero-app-user

# 或在浏览器打开
http://27.8.143.201:30560/qa-hero-app-user
```

**在真机上测试:**
1. 打开真机浏览器（Chrome/Safari）
2. 访问: `http://27.8.143.201:30560/qa-hero-app-user`
3. 观察结果：
   - ✅ 返回数据或 404 = 服务器可访问
   - ❌ 无法连接 = 网络问题

**如果真机无法访问:**
- 检查真机是否连接到互联网
- 尝试访问 `www.baidu.com` 确认网络正常
- 检查是否使用了 VPN 或代理
- 尝试切换 WiFi 或使用移动数据

---

### 第二步：确认使用正确的应用

**重要提示:**
本项目使用 **Development Client** 模式，不能使用 Expo Go！

**检查方法:**
1. 查看真机上安装的应用名称
2. 应该是 "Problem to Hero" 或自定义的开发版本
3. 不应该是 "Expo Go"

**如果安装的是 Expo Go:**
```bash
# 需要构建并安装 Development Build

# Android 真机
npm run android

# 或使用 EAS Build
npx eas build --profile development --platform android
```

---

### 第三步：使用 Tunnel 模式

Tunnel 模式通过 Expo 服务器中转，可以解决大部分网络问题。

**启动 Tunnel 模式:**
```bash
npm run start:tunnel
```

**等待 Tunnel 建立:**
```
› Opening tunnel...
› Tunnel ready.
› exp://xxx.xxx.xxx.xxx:19000
```

这个过程可能需要 1-2 分钟，请耐心等待。

**连接真机:**
1. 扫描终端显示的二维码
2. 或在 Development Build 应用中手动输入 exp:// 地址

---

### 第四步：检查开发服务器状态

**查看终端输出:**
```
✓ Metro waiting on exp://192.168.x.x:8082
✓ Scan the QR code above
✓ Using development build
```

**如果看到错误:**

**错误: Port 8082 is already in use**
```bash
# 查找占用端口的进程
netstat -ano | findstr :8082

# 杀死进程（替换 <PID> 为实际进程 ID）
taskkill /PID <PID> /F

# 或使用其他端口
expo start --dev-client --port 8083
```

**错误: Unable to start server**
```bash
# 清除缓存
npx expo start --clear

# 重新安装依赖
npm install
```

---

### 第五步：查看应用日志

**在开发服务器终端:**
- 应用启动时会显示日志
- 查找错误信息和警告

**应用正常启动的日志:**
```
🚀 应用启动，正在收集设备信息...
📊 完整设备信息对象: {...}
🔐 设备指纹: xxx-xxx-xxx
✅ Services initialized successfully
```

**如果没有看到这些日志:**
- 应用可能启动失败
- 检查是否有红屏错误
- 查看终端的错误信息

**Android 真机日志:**
```bash
# 连接真机后运行
adb devices
adb logcat | findstr "ReactNativeJS"
```

---

## 常见问题解决方案

### 问题 1: 扫码后无反应

**可能原因:**
- 使用了 Expo Go（应该使用 Development Build）
- 二维码已过期
- 网络连接问题

**解决方案:**
1. 确认使用的是 Development Build
2. 重新启动开发服务器
3. 使用 tunnel 模式
4. 手动输入 exp:// 地址

---

### 问题 2: 应用启动后白屏

**可能原因:**
- JavaScript 错误
- 依赖包问题
- 缓存问题

**解决方案:**
```bash
# 1. 清除缓存
npx expo start --clear

# 2. 重新安装依赖
rm -rf node_modules
npm install

# 3. 重新构建
npm run android
```

---

### 问题 3: API 请求失败

**检查点:**
1. 后端服务器是否运行
2. 真机能否访问服务器地址
3. API 配置是否正确

**查看 API 配置:**
文件: `src/config/env.js`
```javascript
apiUrl: 'http://27.8.143.201:30560/qa-hero-app-user'
```

**测试 API:**
在应用中打开设置 > 设备信息，查看设备信息是否正常显示。

---

### 问题 4: 真机和电脑不在同一网络

**症状:**
- 无法扫码连接
- 显示网络错误
- 无法访问开发服务器

**解决方案:**
使用 Tunnel 模式（推荐）
```bash
npm run start:tunnel
```

Tunnel 模式不要求真机和电脑在同一网络。

---

## 网络环境要求

### 开发机（电脑）
- ✅ 可以访问互联网
- ✅ 可以访问后端服务器 `http://27.8.143.201:30560`
- ✅ 端口 8082 未被占用

### 真机
- ✅ 可以访问互联网
- ✅ 可以访问后端服务器 `http://27.8.143.201:30560`
- ✅ 已安装 Development Build（不是 Expo Go）

### 网络连接
- **LAN 模式**: 真机和电脑必须在同一 WiFi 网络
- **Tunnel 模式**: 不要求在同一网络（推荐）

---

## 推荐的开发流程

### 首次设置（一次性）

```bash
# 1. 安装依赖
npm install

# 2. 构建 Development Build
npm run android

# 3. 在真机上安装生成的 APK
# APK 位置: android/app/build/outputs/apk/debug/app-debug.apk
```

### 日常开发

```bash
# 1. 启动开发服务器（tunnel 模式）
npm run start:tunnel

# 2. 等待 tunnel 建立（1-2 分钟）

# 3. 在真机上打开 Development Build 应用

# 4. 扫描二维码或手动输入地址

# 5. 等待应用加载
```

### 测试 API 连接

```bash
# 应用启动后，在终端查看日志
# 应该看到设备信息收集的日志

# 在应用中测试
# 1. 打开设置页面
# 2. 点击"设备信息"
# 3. 查看设备信息是否正常显示
```

---

## 调试技巧

### 1. 使用 React Native Debugger
```bash
# 在应用中摇晃手机
# 选择 "Debug" 或 "Open Debugger"
```

### 2. 查看网络请求
```bash
# 在应用中摇晃手机
# 选择 "Toggle Inspector"
# 查看 Network 标签
```

### 3. 查看控制台日志
```bash
# 开发服务器终端会显示所有 console.log 输出
# 包括设备信息、API 请求等
```

---

## 性能优化建议

### 1. 使用 Tunnel 模式
- 更稳定的连接
- 不受网络环境限制
- 适合远程开发

### 2. 启用 Fast Refresh
```javascript
// 已在项目中启用
// 修改代码后自动刷新
```

### 3. 优化 Metro 配置
```javascript
// metro.config.js 已优化
// 包括 CORS、内联 requires 等
```

---

## 获取帮助

如果以上方案都无法解决问题，请提供：

### 1. 环境信息
```bash
# 运行诊断脚本
check-connection.bat

# 复制输出结果
```

### 2. 错误日志
- 开发服务器终端的完整输出
- 真机上的错误截图
- adb logcat 日志（Android）

### 3. 测试结果
- [ ] 电脑能否访问后端服务器
- [ ] 真机浏览器能否访问后端服务器
- [ ] 使用的是 Development Build 还是 Expo Go
- [ ] 使用的启动模式（LAN/Tunnel）
- [ ] 真机和电脑是否在同一网络

---

## 相关文档

- [SERVICE_CONNECTION_GUIDE.md](./SERVICE_CONNECTION_GUIDE.md) - 详细的服务连接指南
- [DEVELOPMENT_BUILD_GUIDE.md](./DEVELOPMENT_BUILD_GUIDE.md) - Development Build 构建指南
- [API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md) - API 使用指南
- [DEVICE_INFO_GUIDE.md](./DEVICE_INFO_GUIDE.md) - 设备信息收集指南
