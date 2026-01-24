# 🌐 公网访问指南

## 📱 应用访问地址

### 1. QA Native App (React Native + Expo)
**公网访问地址：**
```
exp://atllyxa-anonymous-8081.exp.direct
```

**访问方式：**
- 扫描二维码：`qa-app/qa-native-app/expo-qrcode.png`
- 使用 Expo Go 应用扫描
- 支持 Android 和 iOS

**本地访问：**
```
http://localhost:8081
```

---

### 2. QA Mobile React (移动端 Web)
**局域网访问地址：**
```
http://192.168.31.158:5173
```

**本地访问：**
```
http://localhost:5173
```

**访问方式：**
- 在同一局域网内的任何设备浏览器中打开
- 手机、平板、电脑都可以访问

---

### 3. QA Admin Vue (后台管理系统)
**局域网访问地址：**
```
http://192.168.31.158:5174
```

**本地访问：**
```
http://localhost:5174
```

**访问方式：**
- 在同一局域网内的任何设备浏览器中打开
- 推荐使用电脑浏览器访问

---

## 🚀 启动状态

### ✅ 已启动的服务

1. **Native App (Expo)** - 运行中
   - 端口：8081
   - 模式：Tunnel（公网可访问）
   - 状态：✅ 正常

2. **Mobile React** - 运行中
   - 端口：5173
   - 模式：Host（局域网可访问）
   - 状态：✅ 正常

3. **Admin Vue** - 运行中
   - 端口：5174
   - 模式：Host（局域网可访问）
   - 状态：✅ 正常

---

## 📱 移动端访问指南

### 方式一：Expo Go（推荐用于 Native App）

1. **安装 Expo Go**
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **扫描二维码**
   - 打开 Expo Go 应用
   - 点击 "Scan QR Code"
   - 扫描 `qa-app/qa-native-app/expo-qrcode.png`

3. **直接输入 URL**
   - 在 Expo Go 中输入：`exp://atllyxa-anonymous-8081.exp.direct`

### 方式二：浏览器访问（用于 Web 应用）

1. **确保设备在同一局域网**
   - 连接到相同的 WiFi 网络

2. **在手机浏览器中打开**
   - Mobile React: `http://192.168.31.158:5173`
   - Admin Vue: `http://192.168.31.158:5174`

---

## 🔧 管理命令

### 查看服务状态
```bash
# 查看所有运行的进程
netstat -ano | findstr "5173 5174 8081"
```

### 停止服务
- 关闭对应的命令行窗口
- 或按 `Ctrl+C` 停止服务

### 重启服务

**Native App:**
```bash
cd qa-app/qa-native-app
npm start -- --tunnel
```

**Mobile React:**
```bash
cd qa-app/qa-mobile-react
npm run dev -- --host
```

**Admin Vue:**
```bash
cd qa-app/qa-admin-vue
npm run dev -- --host
```

---

## 🌟 功能特性

### Native App
- ✅ 完整的原生应用体验
- ✅ 支持 iOS 和 Android
- ✅ 公网可访问（通过 Expo Tunnel）
- ✅ 热重载支持
- ✅ 头像组件已修复

### Mobile React
- ✅ 响应式移动端设计
- ✅ 基于 React + Vite
- ✅ Tailwind CSS 样式
- ✅ 局域网访问

### Admin Vue
- ✅ 完整的后台管理功能
- ✅ 基于 Vue 3 + Vite
- ✅ Element Plus UI
- ✅ 数据可视化

---

## 📝 注意事项

1. **网络要求**
   - Native App: 需要互联网连接（使用 Expo Tunnel）
   - Web 应用: 需要在同一局域网内

2. **防火墙设置**
   - 确保端口 5173、5174、8081 未被防火墙阻止
   - Windows 防火墙可能需要允许 Node.js

3. **IP 地址变化**
   - 如果重新连接网络，IP 地址可能会变化
   - 需要重新获取 IP 地址并更新访问链接

4. **性能优化**
   - 开发模式下性能可能较慢
   - 生产环境建议使用构建后的版本

---

## 🆘 故障排除

### 无法访问？

1. **检查服务是否运行**
   ```bash
   netstat -ano | findstr "5173 5174 8081"
   ```

2. **检查防火墙**
   - 临时关闭防火墙测试
   - 或添加端口例外规则

3. **检查 IP 地址**
   ```bash
   ipconfig
   ```

4. **重启服务**
   - 关闭所有服务
   - 重新启动

### Expo 二维码无法扫描？

1. 确保手机已安装 Expo Go
2. 检查网络连接
3. 尝试手动输入 URL
4. 重新生成二维码

---

## 📞 技术支持

如有问题，请检查：
1. 服务器日志输出
2. 浏览器控制台错误
3. 网络连接状态
4. 端口占用情况

---

**最后更新：** 2026-01-21 17:20
**文档版本：** 1.0.0
