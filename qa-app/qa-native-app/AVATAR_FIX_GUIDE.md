# 用户头像不显示问题修复指南

## 🔍 问题原因

用户头像不显示可能有以下几个原因：

### 1. 网络问题
- DiceBear API 可能被墙或访问慢
- Unsplash 图片可能加载失败
- 网络连接不稳定

### 2. 图片缓存问题
- Expo Go 的图片缓存可能有问题
- 需要清除缓存重新加载

### 3. HTTPS 证书问题
- 某些设备对 HTTPS 证书验证严格

## ✅ 解决方案

### 方案一：使用本地占位图（推荐）

为所有头像添加占位图和错误处理：

```javascript
<Image 
  source={{ uri: avatar }}
  style={styles.avatar}
  defaultSource={require('./assets/default-avatar.png')}
  onError={(e) => console.log('头像加载失败:', e.nativeEvent.error)}
/>
```

### 方案二：使用 React Native 的 Image 组件属性

添加缓存控制：

```javascript
<Image 
  source={{ 
    uri: avatar,
    cache: 'force-cache'
  }}
  style={styles.avatar}
/>
```

### 方案三：使用 Expo 的 Image 组件

Expo 提供了更好的图片加载组件：

```javascript
import { Image } from 'expo-image';

<Image 
  source={avatar}
  style={styles.avatar}
  placeholder={require('./assets/placeholder.png')}
  contentFit="cover"
  transition={200}
/>
```

## 🔧 快速修复

### 1. 清除 Expo Go 缓存

在 Expo Go 中：
1. 摇晃手机打开开发者菜单
2. 点击 "Clear cache and reload"

或在终端：
```bash
# 按 Shift + R 清除缓存并重新加载
```

### 2. 检查网络连接

确保：
- 手机连接到稳定的网络
- 可以访问外部图片服务
- 没有使用 VPN 或代理导致问题

### 3. 查看终端日志

在终端查看是否有图片加载错误：
```
LOG  头像加载失败: [错误信息]
```

## 🎯 临时解决方案

### 使用国内可访问的图片服务

替换 DiceBear API：

**之前：**
```javascript
avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
```

**之后（使用 UI Avatars）：**
```javascript
avatar: 'https://ui-avatars.com/api/?name=张三&background=random&size=128'
```

**或使用 Gravatar：**
```javascript
avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128&d=identicon'
```

## 📝 代码示例

### 创建一个通用的 Avatar 组件

```javascript
// src/components/Avatar.js
import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

export default function Avatar({ uri, name, size = 40, style }) {
  const [error, setError] = React.useState(false);
  
  if (error || !uri) {
    // 显示首字母作为占位符
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }, style]}>
        <Text style={[styles.initial, { fontSize: size / 2 }]}>{initial}</Text>
      </View>
    );
  }
  
  return (
    <Image
      source={{ uri }}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      onError={() => setError(true)}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#6b7280',
    fontWeight: '600',
  },
});
```

### 使用示例

```javascript
import Avatar from './components/Avatar';

<Avatar 
  uri="https://api.dicebear.com/7.x/avataaars/svg?seed=user1"
  name="张三"
  size={40}
/>
```

## 🚀 立即测试

### 1. 在浏览器测试图片 URL

打开浏览器，访问头像 URL：
```
https://api.dicebear.com/7.x/avataaars/svg?seed=user1
```

如果浏览器能显示，说明 URL 没问题。

### 2. 在 Expo Go 中测试

1. 重新加载应用
2. 查看头像是否显示
3. 如果不显示，查看终端日志

### 3. 使用备用图片服务

如果 DiceBear 不工作，可以临时使用：

```javascript
// 使用 UI Avatars（国内可访问）
const getAvatar = (name, seed) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
};

// 使用示例
avatar: getAvatar('张三', 'user1')
```

## 📊 常见问题

### Q: 为什么只有头像不显示，其他图片正常？

A: 可能是 DiceBear API 的问题。尝试：
1. 使用其他图片服务
2. 添加错误处理
3. 使用占位图

### Q: 清除缓存后还是不显示？

A: 可能是网络问题。尝试：
1. 切换到其他网络
2. 使用国内可访问的图片服务
3. 使用本地占位图

### Q: 有些头像显示，有些不显示？

A: 可能是：
1. 某些 URL 格式不正确
2. 某些图片加载超时
3. 添加统一的错误处理

## 🔍 调试步骤

### 1. 添加日志

```javascript
<Image
  source={{ uri: avatar }}
  style={styles.avatar}
  onLoadStart={() => console.log('开始加载头像:', avatar)}
  onLoad={() => console.log('头像加载成功')}
  onError={(e) => console.log('头像加载失败:', e.nativeEvent.error)}
/>
```

### 2. 查看终端输出

运行应用后，查看终端是否有错误信息。

### 3. 测试不同的图片 URL

尝试使用简单的图片 URL：
```javascript
avatar: 'https://picsum.photos/200'
```

如果这个能显示，说明是原 URL 的问题。

## 💡 建议

1. **使用 Avatar 组件**：创建统一的头像组件，处理加载失败
2. **添加占位图**：始终提供备用显示方案
3. **使用可靠的图片服务**：选择国内可访问的服务
4. **添加错误处理**：捕获并记录图片加载错误

---

**需要帮助？**

如果按照以上步骤仍然无法解决，请提供：
1. 终端的错误日志
2. 使用的头像 URL
3. 测试的设备型号和系统版本
