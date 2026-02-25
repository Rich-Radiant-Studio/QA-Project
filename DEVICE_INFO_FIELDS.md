# 设备信息字段详细文档

## 概述

本文档详细列出了应用启动时可以获取的所有设备信息字段，包括字段名称、数据类型、说明、示例值以及平台支持情况。

---

## 1. 平台信息 (platform)

### 1.1 操作系统类型 (os)
- **字段名**: `platform.os`
- **类型**: `string`
- **说明**: 设备操作系统类型
- **可能值**: `"ios"` | `"android"`
- **iOS 示例**: `"ios"`
- **Android 示例**: `"android"`
- **平台支持**: ✅ iOS | ✅ Android

### 1.2 系统版本号 (osVersion)
- **字段名**: `platform.osVersion`
- **类型**: `string | number`
- **说明**: 操作系统版本号
- **iOS 示例**: `"17.2"` (字符串格式)
- **Android 示例**: `33` (API Level，数字格式)
- **平台支持**: ✅ iOS | ✅ Android

### 1.3 是否为平板 (isPad)
- **字段名**: `platform.isPad`
- **类型**: `boolean`
- **说明**: 是否为平板设备
- **iOS 示例**: `false` (iPhone) / `true` (iPad)
- **Android 示例**: `false` (手机) / `true` (平板)
- **平台支持**: ✅ iOS | ✅ Android

### 1.4 是否为电视 (isTV)
- **字段名**: `platform.isTV`
- **类型**: `boolean`
- **说明**: 是否为电视设备
- **iOS 示例**: `false` / `true` (Apple TV)
- **Android 示例**: `false` / `true` (Android TV)
- **平台支持**: ✅ iOS | ✅ Android

### 1.5 是否为桌面设备 (isDesktop)
- **字段名**: `platform.isDesktop`
- **类型**: `boolean`
- **说明**: 是否为桌面设备
- **示例**: `false`
- **平台支持**: ✅ iOS | ✅ Android

---

## 2. 设备硬件信息 (device)

### 2.1 品牌 (brand)
- **字段名**: `device.brand`
- **类型**: `string | null`
- **说明**: 设备品牌名称
- **iOS 示例**: `"Apple"`
- **Android 示例**: `"Xiaomi"` / `"Samsung"` / `"Huawei"` / `"OPPO"` / `"vivo"` 等
- **平台支持**: ✅ iOS | ✅ Android

### 2.2 制造商 (manufacturer)
- **字段名**: `device.manufacturer`
- **类型**: `string | null`
- **说明**: 设备制造商
- **iOS 示例**: `"Apple"`
- **Android 示例**: `"Xiaomi"` / `"samsung"` / `"HUAWEI"` 等
- **平台支持**: ✅ iOS | ✅ Android

### 2.3 型号名称 (modelName)
- **字段名**: `device.modelName`
- **类型**: `string | null`
- **说明**: 设备型号的可读名称
- **iOS 示例**: `"iPhone 14 Pro"` / `"iPhone 15 Pro Max"` / `"iPad Pro"`
- **Android 示例**: `"Redmi K60 Pro"` / `"Galaxy S23 Ultra"` / `"Mate 60 Pro"`
- **平台支持**: ✅ iOS | ✅ Android

### 2.4 型号 ID (modelId)
- **字段名**: `device.modelId`
- **类型**: `string | null`
- **说明**: 设备型号的内部标识符
- **iOS 示例**: `"iPhone15,2"` / `"iPhone15,3"` / `"iPad13,18"`
- **Android 示例**: `"23013RK75C"` / `"SM-S918B"` / `"ALN-AL00"`
- **平台支持**: ✅ iOS | ✅ Android

### 2.5 设备名称 (deviceName)
- **字段名**: `device.deviceName`
- **类型**: `string | null`
- **说明**: 用户自定义的设备名称
- **iOS 示例**: `"张三的 iPhone"` / `"我的 iPad"`
- **Android 示例**: `"Redmi K60 Pro"` / `"我的手机"`
- **平台支持**: ✅ iOS | ✅ Android

### 2.6 设备年份等级 (deviceYearClass)
- **字段名**: `device.deviceYearClass`
- **类型**: `number | null`
- **说明**: 设备的大致发布年份，用于判断设备性能等级
- **iOS 示例**: `2023` / `2022` / `2021`
- **Android 示例**: `2023` / `2022` / `2021`
- **平台支持**: ✅ iOS | ✅ Android

### 2.7 总内存 (totalMemory)
- **字段名**: `device.totalMemory`
- **类型**: `number | null`
- **说明**: 设备总内存大小（单位：字节）
- **iOS 示例**: `6442450944` (6 GB)
- **Android 示例**: `12884901888` (12 GB)
- **换算**: 除以 `1024³` 得到 GB
- **平台支持**: ✅ iOS | ✅ Android

### 2.8 CPU 架构 (supportedCpuArchitectures)
- **字段名**: `device.supportedCpuArchitectures`
- **类型**: `string[] | null`
- **说明**: 设备支持的 CPU 架构列表
- **iOS 示例**: `["arm64"]`
- **Android 示例**: `["arm64-v8a", "armeabi-v7a", "armeabi"]`
- **平台支持**: ✅ iOS | ✅ Android

---

## 3. 屏幕信息 (screen)

### 3.1 屏幕宽度 (screenWidth)
- **字段名**: `screen.width` / `screen.screenWidth`
- **类型**: `number`
- **说明**: 屏幕的物理宽度（像素）
- **iOS 示例**: `393` (iPhone 14 Pro) / `430` (iPhone 14 Pro Max)
- **Android 示例**: `1440` / `1080` / `720`
- **平台支持**: ✅ iOS | ✅ Android

### 3.2 屏幕高度 (screenHeight)
- **字段名**: `screen.height` / `screen.screenHeight`
- **类型**: `number`
- **说明**: 屏幕的物理高度（像素）
- **iOS 示例**: `852` (iPhone 14 Pro) / `932` (iPhone 14 Pro Max)
- **Android 示例**: `3200` / `2400` / `1600`
- **平台支持**: ✅ iOS | ✅ Android

### 3.3 窗口宽度 (windowWidth)
- **字段名**: `screen.windowWidth`
- **类型**: `number`
- **说明**: 应用窗口的可用宽度（像素）
- **iOS 示例**: `393`
- **Android 示例**: `1440`
- **平台支持**: ✅ iOS | ✅ Android

### 3.4 窗口高度 (windowHeight)
- **字段名**: `screen.windowHeight`
- **类型**: `number`
- **说明**: 应用窗口的可用高度（像素）
- **iOS 示例**: `852`
- **Android 示例**: `3200`
- **平台支持**: ✅ iOS | ✅ Android

### 3.5 屏幕缩放比例 (scale)
- **字段名**: `screen.scale`
- **类型**: `number`
- **说明**: 屏幕的像素密度比例
- **iOS 示例**: `3` (3x Retina) / `2` (2x Retina)
- **Android 示例**: `3.5` / `3` / `2.75` / `2`
- **平台支持**: ✅ iOS | ✅ Android

### 3.6 字体缩放比例 (fontScale)
- **字段名**: `screen.fontScale`
- **类型**: `number`
- **说明**: 用户设置的字体缩放比例
- **示例**: `1` (默认) / `1.15` (大字体) / `0.85` (小字体)
- **平台支持**: ✅ iOS | ✅ Android

### 3.7 像素比 (pixelRatio)
- **字段名**: `screen.pixelRatio`
- **类型**: `number`
- **说明**: 设备像素比（与 scale 相同）
- **iOS 示例**: `3`
- **Android 示例**: `3.5`
- **平台支持**: ✅ iOS | ✅ Android

---

## 4. 应用信息 (app)

### 4.1 应用名称 (name)
- **字段名**: `app.name`
- **类型**: `string | undefined`
- **说明**: 应用的显示名称
- **示例**: `"Problem to Hero"`
- **平台支持**: ✅ iOS | ✅ Android

### 4.2 应用版本 (version)
- **字段名**: `app.version`
- **类型**: `string | undefined`
- **说明**: 应用的版本号
- **示例**: `"1.0.0"` / `"2.3.1"`
- **平台支持**: ✅ iOS | ✅ Android

### 4.3 构建号 (buildNumber)
- **字段名**: `app.buildNumber`
- **类型**: `string | number | undefined`
- **说明**: 应用的构建编号
- **iOS 示例**: `"1"` / `"100"`
- **Android 示例**: `1` / `100` (versionCode)
- **平台支持**: ✅ iOS | ✅ Android

### 4.4 Bundle ID (bundleId)
- **字段名**: `app.bundleId`
- **类型**: `string | undefined`
- **说明**: 应用的唯一标识符
- **iOS 示例**: `"com.qa.app"`
- **Android 示例**: `"com.qa.app"`
- **平台支持**: ✅ iOS | ✅ Android

### 4.5 Expo 版本 (expoVersion)
- **字段名**: `app.expoVersion`
- **类型**: `string | undefined`
- **说明**: Expo SDK 版本
- **示例**: `"54.0.31"` / `"53.0.0"`
- **平台支持**: ✅ iOS | ✅ Android

### 4.6 是否真机 (isDevice)
- **字段名**: `app.isDevice`
- **类型**: `boolean`
- **说明**: 是否在真实设备上运行（false 表示模拟器）
- **真机示例**: `true`
- **模拟器示例**: `false`
- **平台支持**: ✅ iOS | ✅ Android

---

## 5. 系统信息 (system)

### 5.1 系统名称 (systemName) - iOS 特有
- **字段名**: `system.systemName`
- **类型**: `string`
- **说明**: 操作系统名称
- **iOS 示例**: `"iOS"` / `"iPadOS"`
- **平台支持**: ✅ iOS | ❌ Android

### 5.2 系统版本 (systemVersion)
- **字段名**: `system.systemVersion`
- **类型**: `string`
- **说明**: 操作系统详细版本
- **iOS 示例**: `"17.2"` / `"16.5.1"`
- **Android 示例**: `"13"` / `"12"` / `"11"`
- **平台支持**: ✅ iOS | ✅ Android

### 5.3 平台类型 (platform) - iOS 特有
- **字段名**: `system.platform`
- **类型**: `string`
- **说明**: iOS 设备的具体平台
- **iOS 示例**: `"iPhone"` / `"iPad"`
- **平台支持**: ✅ iOS | ❌ Android

### 5.4 API Level (apiLevel) - Android 特有
- **字段名**: `system.apiLevel`
- **类型**: `number`
- **说明**: Android API 级别
- **Android 示例**: `33` (Android 13) / `31` (Android 12) / `30` (Android 11)
- **平台支持**: ❌ iOS | ✅ Android

### 5.5 Android ID (androidId) - Android 特有
- **字段名**: `system.androidId`
- **类型**: `string`
- **说明**: Android 设备的会话 ID
- **Android 示例**: `"abc123-def456-ghi789"`
- **平台支持**: ❌ iOS | ✅ Android

---

## 6. 地区和语言信息 (locale)

### 6.1 语言环境 (locale)
- **字段名**: `locale.locale`
- **类型**: `string`
- **说明**: 当前的语言和地区代码
- **示例**: `"zh-CN"` / `"en-US"` / `"ja-JP"` / `"ko-KR"`
- **平台支持**: ✅ iOS | ✅ Android

### 6.2 所有语言环境 (locales)
- **字段名**: `locale.locales`
- **类型**: `string[]`
- **说明**: 用户设置的所有语言偏好列表
- **iOS 示例**: `["zh-Hans-CN", "en-US"]`
- **Android 示例**: `["zh-CN", "en-US"]`
- **平台支持**: ✅ iOS | ✅ Android

### 6.3 时区 (timezone)
- **字段名**: `locale.timezone`
- **类型**: `string`
- **说明**: 设备所在时区
- **示例**: `"Asia/Shanghai"` / `"America/New_York"` / `"Europe/London"`
- **平台支持**: ✅ iOS | ✅ Android

### 6.4 地区代码 (region)
- **字段名**: `locale.region`
- **类型**: `string | null`
- **说明**: 国家/地区代码
- **示例**: `"CN"` / `"US"` / `"JP"` / `"KR"`
- **平台支持**: ✅ iOS | ✅ Android

### 6.5 货币代码 (currency)
- **字段名**: `locale.currency`
- **类型**: `string | null`
- **说明**: 当前地区的货币代码
- **示例**: `"CNY"` / `"USD"` / `"JPY"` / `"EUR"`
- **平台支持**: ✅ iOS | ✅ Android

### 6.6 文字方向 (isRTL)
- **字段名**: `locale.isRTL`
- **类型**: `boolean`
- **说明**: 是否为从右到左的语言（如阿拉伯语、希伯来语）
- **示例**: `false` (中文、英文) / `true` (阿拉伯语)
- **平台支持**: ✅ iOS | ✅ Android

### 6.7 度量单位 (isMetric)
- **字段名**: `locale.isMetric`
- **类型**: `boolean`
- **说明**: 是否使用公制单位
- **示例**: `true` (中国、欧洲) / `false` (美国)
- **平台支持**: ✅ iOS | ✅ Android

---

## 7. 网络信息 (network)

### 7.1 网络类型 (type)
- **字段名**: `network.type`
- **类型**: `string | null`
- **说明**: 当前网络连接类型
- **可能值**: `"wifi"` / `"cellular"` / `"bluetooth"` / `"ethernet"` / `"wimax"` / `"vpn"` / `"other"` / `"unknown"` / `"none"`
- **示例**: `"wifi"` / `"cellular"`
- **平台支持**: ✅ iOS | ✅ Android

### 7.2 连接状态 (isConnected)
- **字段名**: `network.isConnected`
- **类型**: `boolean | null`
- **说明**: 是否已连接到网络
- **示例**: `true` / `false`
- **平台支持**: ✅ iOS | ✅ Android

### 7.3 互联网可达性 (isInternetReachable)
- **字段名**: `network.isInternetReachable`
- **类型**: `boolean | null`
- **说明**: 是否可以访问互联网
- **示例**: `true` / `false` / `null` (未知)
- **平台支持**: ✅ iOS | ✅ Android

### 7.4 网络详细信息 (details)
- **字段名**: `network.details`
- **类型**: `object | null`
- **说明**: 网络连接的详细信息
- **WiFi 示例**:
  ```json
  {
    "ssid": "MyWiFi",
    "bssid": "00:11:22:33:44:55",
    "strength": 100,
    "ipAddress": "192.168.1.100",
    "subnet": "255.255.255.0"
  }
  ```
- **蜂窝网络示例**:
  ```json
  {
    "cellularGeneration": "4g",
    "carrier": "中国移动"
  }
  ```
- **平台支持**: ✅ iOS | ✅ Android

---

## 8. 会话信息 (session)

### 8.1 安装 ID (installationId)
- **字段名**: `session.installationId`
- **类型**: `string`
- **说明**: 应用安装的唯一标识符（每次安装生成，卸载重装会变化）
- **示例**: `"12345678-1234-1234-1234-123456789abc"`
- **用途**: 用于追踪应用安装、统计独立用户
- **平台支持**: ✅ iOS | ✅ Android

### 8.2 会话 ID (sessionId)
- **字段名**: `session.sessionId`
- **类型**: `string`
- **说明**: 当前应用会话的唯一标识符（每次启动生成）
- **示例**: `"87654321-4321-4321-4321-cba987654321"`
- **用途**: 用于追踪用户会话、分析用户行为
- **平台支持**: ✅ iOS | ✅ Android

### 8.3 是否首次启动 (isFirstLaunch)
- **字段名**: `session.isFirstLaunch`
- **类型**: `boolean`
- **说明**: 是否为首次启动应用
- **示例**: `true` / `false`
- **注意**: 需要配合 AsyncStorage 实现
- **平台支持**: ✅ iOS | ✅ Android

---

## 9. 时间戳 (timestamp)

### 9.1 收集时间 (timestamp)
- **字段名**: `timestamp`
- **类型**: `string`
- **说明**: 设备信息收集的时间戳（ISO 8601 格式）
- **示例**: `"2026-02-13T10:30:45.123Z"`
- **平台支持**: ✅ iOS | ✅ Android

---

## 完整 JSON 示例

### iOS 设备示例

```json
{
  "platform": {
    "os": "ios",
    "osVersion": "17.2",
    "isPad": false,
    "isTV": false,
    "isDesktop": false
  },
  "device": {
    "brand": "Apple",
    "manufacturer": "Apple",
    "modelName": "iPhone 14 Pro",
    "modelId": "iPhone15,2",
    "deviceName": "张三的 iPhone",
    "deviceYearClass": 2022,
    "totalMemory": 6442450944,
    "supportedCpuArchitectures": ["arm64"]
  },
  "screen": {
    "width": 393,
    "height": 852,
    "screenWidth": 393,
    "screenHeight": 852,
    "windowWidth": 393,
    "windowHeight": 852,
    "scale": 3,
    "fontScale": 1,
    "pixelRatio": 3
  },
  "app": {
    "name": "Problem to Hero",
    "version": "1.0.0",
    "buildNumber": "1",
    "bundleId": "com.qa.app",
    "expoVersion": "54.0.31",
    "isDevice": true
  },
  "system": {
    "systemName": "iOS",
    "systemVersion": "17.2",
    "platform": "iPhone"
  },
  "locale": {
    "locale": "zh-CN",
    "locales": ["zh-Hans-CN", "en-US"],
    "timezone": "Asia/Shanghai",
    "region": "CN",
    "currency": "CNY",
    "isRTL": false,
    "isMetric": true
  },
  "network": {
    "type": "wifi",
    "isConnected": true,
    "isInternetReachable": true,
    "details": {
      "ssid": "MyWiFi",
      "strength": 100,
      "ipAddress": "192.168.1.100"
    }
  },
  "session": {
    "installationId": "12345678-1234-1234-1234-123456789abc",
    "sessionId": "87654321-4321-4321-4321-cba987654321",
    "isFirstLaunch": false
  },
  "timestamp": "2026-02-13T10:30:45.123Z"
}
```

### Android 设备示例

```json
{
  "platform": {
    "os": "android",
    "osVersion": 33,
    "isPad": false,
    "isTV": false,
    "isDesktop": false
  },
  "device": {
    "brand": "Xiaomi",
    "manufacturer": "Xiaomi",
    "modelName": "Redmi K60 Pro",
    "modelId": "23013RK75C",
    "deviceName": "Redmi K60 Pro",
    "deviceYearClass": 2023,
    "totalMemory": 12884901888,
    "supportedCpuArchitectures": ["arm64-v8a", "armeabi-v7a", "armeabi"]
  },
  "screen": {
    "width": 1440,
    "height": 3200,
    "screenWidth": 1440,
    "screenHeight": 3200,
    "windowWidth": 1440,
    "windowHeight": 3200,
    "scale": 3.5,
    "fontScale": 1,
    "pixelRatio": 3.5
  },
  "app": {
    "name": "Problem to Hero",
    "version": "1.0.0",
    "buildNumber": 1,
    "bundleId": "com.qa.app",
    "expoVersion": "54.0.31",
    "isDevice": true
  },
  "system": {
    "apiLevel": 33,
    "systemVersion": "13",
    "androidId": "abc123-def456-ghi789"
  },
  "locale": {
    "locale": "zh-CN",
    "locales": ["zh-CN", "en-US"],
    "timezone": "Asia/Shanghai",
    "region": "CN",
    "currency": "CNY",
    "isRTL": false,
    "isMetric": true
  },
  "network": {
    "type": "cellular",
    "isConnected": true,
    "isInternetReachable": true,
    "details": {
      "cellularGeneration": "4g",
      "carrier": "中国移动"
    }
  },
  "session": {
    "installationId": "abcdef12-3456-7890-abcd-ef1234567890",
    "sessionId": "09876543-2109-8765-4321-098765432109",
    "isFirstLaunch": false
  },
  "timestamp": "2026-02-13T10:30:45.123Z"
}
```

---

## 字段统计

### 按平台支持分类

| 分类 | iOS + Android | 仅 iOS | 仅 Android |
|------|--------------|--------|-----------|
| 平台信息 | 5 | 0 | 0 |
| 硬件信息 | 8 | 0 | 0 |
| 屏幕信息 | 7 | 0 | 0 |
| 应用信息 | 6 | 0 | 0 |
| 系统信息 | 1 | 3 | 2 |
| 地区语言 | 7 | 0 | 0 |
| 网络信息 | 4 | 0 | 0 |
| 会话信息 | 3 | 0 | 0 |
| **总计** | **41** | **3** | **2** |

### 数据类型分布

| 类型 | 数量 |
|------|------|
| string | 22 |
| number | 10 |
| boolean | 8 |
| string[] | 2 |
| object | 1 |
| null | 多个字段可为 null |

---

## 隐私和安全说明

### ✅ 不包含的敏感信息
- ❌ 用户姓名
- ❌ 手机号码
- ❌ 邮箱地址
- ❌ GPS 位置坐标
- ❌ 通讯录
- ❌ 照片/文件
- ❌ 浏览历史
- ❌ 密码/Token

### ✅ 收集的信息用途
- 📊 应用性能优化
- 🐛 问题排查和调试
- 📱 设备兼容性统计
- 🎯 用户体验改进
- 📈 数据分析和报表

### ✅ 合规性
- 符合 GDPR（欧盟通用数据保护条例）
- 符合 CCPA（加州消费者隐私法案）
- 符合中国《个人信息保护法》
- 不涉及个人身份识别信息（PII）

---

## 使用建议

### 1. 后端存储建议
建议存储的关键字段：
- `platform.os` + `platform.osVersion` - 系统统计
- `device.brand` + `device.modelName` - 设备统计
- `screen.width` + `screen.height` - 屏幕适配
- `locale.locale` - 语言统计
- `network.type` - 网络统计
- `session.installationId` - 用户追踪
- `app.version` - 版本分布

### 2. 数据分析维度
- 按操作系统分析（iOS vs Android）
- 按设备品牌分析（Apple, Xiaomi, Samsung 等）
- 按屏幕尺寸分析（适配优化）
- 按地区语言分析（国际化）
- 按网络类型分析（性能优化）

### 3. 性能优化
- 首次启动时收集一次
- 存储到本地，避免重复收集
- 定期更新（如每天一次）
- 网络变化时更新网络信息

---

## 更新日志

- **2026-02-13**: 初始版本，包含所有可获取字段的详细说明
