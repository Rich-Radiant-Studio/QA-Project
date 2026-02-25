# 已安装的原生库清单

## ✅ 安装完成时间
2026-02-11

## 📦 已安装的库

### 1. 底部抽屉
- **库名**: `@gorhom/bottom-sheet` (v5.2.8)
- **用途**: 解决底部抽屉弹窗、键盘避让问题
- **依赖**: react-native-reanimated, react-native-gesture-handler

### 2. 地图
- **库名**: `react-native-maps` (v1.27.1)
- **用途**: 显示地图（Google Maps / Apple Maps）
- **需要配置**: Google Maps API Key

### 3. 定位
- **库名**: `expo-location` (v19.0.8)
- **用途**: 获取用户GPS位置
- **需要权限**: 位置权限

### 4. 支付
- **库名**: `@stripe/stripe-react-native` (v0.58.0)
- **用途**: 国际支付（信用卡、Apple Pay、Google Pay）
- **需要配置**: Stripe API Key

### 5. 网络状态
- **库名**: `@react-native-community/netinfo` (v11.5.2)
- **用途**: 检测网络连接状态（WiFi/蜂窝/离线）

### 6. 相机
- **库名**: `expo-camera` (v17.0.10)
- **用途**: 相机功能（拍照、扫码）
- **需要权限**: 相机权限

### 7. 设备信息
- **库名**: `expo-constants` (v18.0.13) + `expo-device` (v8.0.10)
- **用途**: 获取设备信息（型号、系统版本、应用版本等）

### 8. 推送通知
- **库名**: `expo-notifications`
- **用途**: 本地通知和远程推送通知
- **需要配置**: Firebase Cloud Messaging (FCM) 或 APNs

## 📋 已有的依赖（无需重新安装）

- ✅ `react-native-gesture-handler` (v2.28.0) - 手势处理
- ✅ `react-native-reanimated` (v4.1.1) - 原生动画
- ✅ `react-native-safe-area-context` (v5.6.0) - 安全区域
- ✅ `react-native-screens` (v4.16.0) - 原生屏幕
- ✅ `expo-image-picker` (v17.0.10) - 图片选择器

## 🔧 需要配置的项目

### 1. Google Maps API Key
在 `app.json` 中添加：
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    }
  }
}
```

### 2. Stripe 配置
在 `app.json` 中添加：
```json
{
  "expo": {
    "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.yourapp",
          "enableGooglePay": true
        }
      ]
    ]
  }
}
```

### 3. 权限配置
在 `app.json` 中添加：
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "我们需要您的位置来显示附近的服务",
        "NSCameraUsageDescription": "我们需要访问相机来拍照"
      }
    },
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "POST_NOTIFICATIONS"
      ]
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

## 📊 构建配额使用

- **安装库**: 0次配额 ✅
- **构建 Android**: 1次配额（待执行）
- **构建 iOS**: 1次配额（待执行）
- **总计**: 2次配额

## 🚀 下一步

### 选项 1: EAS Build（推荐）
```bash
# 登录 Expo 账号
npx eas login

# 构建 Android Development Build
npx eas build --profile development --platform android

# 构建 iOS Development Build
npx eas build --profile development --platform ios
```

### 选项 2: 本地构建 Android
```bash
# 继续解决本地构建问题
# 或者先用 EAS Build，之后再解决本地构建
```

## 📝 注意事项

1. 所有库已使用 `--legacy-peer-deps` 安装，避免依赖冲突
2. 修改 JS 代码不需要重新构建，使用热更新即可
3. 只有添加/删除原生库时才需要重新构建
4. 配置 API Key 后需要重新构建才能生效

## 🎯 开发流程

1. ✅ 安装所有原生库（已完成）
2. ⏳ 构建 Development Build（Android + iOS）
3. ⏳ 配置 API Keys（Google Maps, Stripe）
4. ⏳ 开始开发（使用热更新，不消耗配额）
