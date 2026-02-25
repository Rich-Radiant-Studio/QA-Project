# 用户信息缓存服务使用示例

## 快速开始

### 1. 应用启动时加载用户信息

```javascript
// App.js
import UserCacheService from './src/services/UserCacheService';

useEffect(() => {
  const initializeApp = async () => {
    // ... 其他初始化代码
    
    // 加载用户信息（缓存策略）
    await UserCacheService.loadUserProfileWithCache(
      // 缓存加载完成回调（立即显示）
      (cachedProfile) => {
        console.log('⚡ 从缓存加载:', cachedProfile.nickName);
        // 可以在这里更新全局状态
      },
      // 最新数据加载完成回调（静默更新）
      (freshProfile) => {
        console.log('🔄 数据已更新:', freshProfile.nickName);
        // 可以在这里更新全局状态
      }
    );
  };
  
  initializeApp();
}, []);
```

### 2. 页面中使用缓存数据

```javascript
// SettingsScreen.js 或其他页面
import UserCacheService from '../services/UserCacheService';

export default function SettingsScreen() {
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      await UserCacheService.loadUserProfileWithCache(
        // 立即显示缓存
        (cachedProfile) => {
          setUserProfile(cachedProfile);
        },
        // 静默更新最新数据
        (freshProfile) => {
          setUserProfile(freshProfile);
        }
      );
    };
    
    loadUserProfile();
  }, []);
  
  return (
    <View>
      <Text>{userProfile?.nickName}</Text>
      <Text>{userProfile?.signature}</Text>
    </View>
  );
}
```

### 3. 更新用户信息

```javascript
// 编辑昵称
const handleUpdateNickname = async (newNickname) => {
  try {
    const updatedProfile = await UserCacheService.updateUserProfile({
      nickName: newNickname,
      signature: null,
      profession: null,
    });
    
    // 自动更新缓存和服务器
    console.log('✅ 更新成功:', updatedProfile);
    
    // 更新本地状态
    setUserProfile(updatedProfile);
  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
};
```

### 4. 强制刷新（下拉刷新）

```javascript
const handleRefresh = async () => {
  try {
    setRefreshing(true);
    
    const freshProfile = await UserCacheService.forceRefresh();
    
    if (freshProfile) {
      setUserProfile(freshProfile);
      console.log('✅ 刷新成功');
    }
  } catch (error) {
    console.error('❌ 刷新失败:', error);
  } finally {
    setRefreshing(false);
  }
};
```

### 5. 退出登录时清除缓存

```javascript
const handleLogout = async () => {
  try {
    // 清除用户信息缓存
    await UserCacheService.clearCache();
    
    // 清除其他数据
    await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userInfo']);
    
    console.log('✅ 已退出登录');
  } catch (error) {
    console.error('❌ 退出失败:', error);
  }
};
```

## 完整示例

### 个人中心页面

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native';
import UserCacheService from '../services/UserCacheService';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // 页面加载时使用缓存策略
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    await UserCacheService.loadUserProfileWithCache(
      // 立即显示缓存（秒开）
      (cachedProfile) => {
        setUserProfile(cachedProfile);
      },
      // 后台刷新最新数据
      (freshProfile) => {
        setUserProfile(freshProfile);
      }
    );
  };
  
  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const freshProfile = await UserCacheService.forceRefresh();
      if (freshProfile) {
        setUserProfile(freshProfile);
      }
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View>
        <Text>昵称: {userProfile?.nickName}</Text>
        <Text>签名: {userProfile?.signature}</Text>
        <Text>职业: {userProfile?.profession}</Text>
        <Text>所在地: {userProfile?.location}</Text>
      </View>
    </ScrollView>
  );
}
```

### 编辑资料页面

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import UserCacheService from '../services/UserCacheService';

export default function EditProfileScreen() {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }
    
    setLoading(true);
    
    try {
      // 更新用户信息（自动更新缓存和服务器）
      const updatedProfile = await UserCacheService.updateUserProfile({
        nickName: nickname.trim(),
        signature: null,
        profession: null,
      });
      
      Alert.alert('成功', '昵称已更新');
      console.log('✅ 更新成功:', updatedProfile);
    } catch (error) {
      Alert.alert('失败', error.message || '更新失败，请重试');
      console.error('❌ 更新失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View>
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder="输入新昵称"
      />
      <Button
        title={loading ? '保存中...' : '保存'}
        onPress={handleSave}
        disabled={loading}
      />
    </View>
  );
}
```

## API 参考

### UserCacheService 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getUserProfile()` | 无 | `Promise<Object\|null>` | 从缓存读取用户信息 |
| `saveUserProfile(profile)` | `profile: Object` | `Promise<void>` | 保存用户信息到缓存 |
| `fetchAndCacheUserProfile(silent)` | `silent: boolean` | `Promise<Object\|null>` | 从服务器获取并缓存 |
| `loadUserProfileWithCache(onCache, onFresh)` | `onCache: Function`<br>`onFresh: Function` | `Promise<void>` | 大厂策略核心方法 |
| `updateUserProfile(updates)` | `updates: Object` | `Promise<Object>` | 更新用户信息 |
| `forceRefresh()` | 无 | `Promise<Object\|null>` | 强制刷新 |
| `isCacheExpired()` | 无 | `Promise<boolean>` | 检查缓存是否过期 |
| `clearCache()` | 无 | `Promise<void>` | 清除缓存 |

### 用户信息字段映射

| 前端字段 | API字段 | 说明 |
|---------|---------|------|
| `name` | `nickName` | 昵称 |
| `bio` | `signature` | 个人简介 |
| `occupation` | `profession` | 职业 |
| `location` | `location` | 所在地 |

## 常见问题

### Q1: 缓存多久过期？
A: 默认30分钟。可以在 `UserCacheService.js` 中修改 `CACHE_EXPIRY` 常量。

### Q2: 如何清除缓存？
A: 调用 `UserCacheService.clearCache()` 或在退出登录时自动清除。

### Q3: 缓存失败会怎样？
A: 静默处理，继续从服务器获取数据，不影响用户使用。

### Q4: 如何强制刷新？
A: 调用 `UserCacheService.forceRefresh()` 方法。

### Q5: 数据结构变更怎么办？
A: 更新 `CACHE_VERSION` 常量，旧缓存会自动清除。

## 最佳实践

1. **应用启动时**：使用 `loadUserProfileWithCache` 加载用户信息
2. **页面进入时**：使用 `loadUserProfileWithCache` 确保数据最新
3. **编辑资料时**：使用 `updateUserProfile` 自动更新缓存和服务器
4. **下拉刷新时**：使用 `forceRefresh` 强制获取最新数据
5. **退出登录时**：使用 `clearCache` 清除所有缓存

## 性能监控

```javascript
// 监控缓存命中率
const startTime = Date.now();

await UserCacheService.loadUserProfileWithCache(
  (cachedProfile) => {
    const cacheTime = Date.now() - startTime;
    console.log(`⚡ 缓存加载耗时: ${cacheTime}ms`);
  },
  (freshProfile) => {
    const networkTime = Date.now() - startTime;
    console.log(`🌐 网络请求耗时: ${networkTime}ms`);
  }
);
```

## 总结

使用 `UserCacheService` 可以轻松实现大厂级别的用户信息缓存策略，提升应用启动速度和用户体验。记住核心原则：

- ✅ 启动时立即显示缓存
- ✅ 后台静默刷新最新数据
- ✅ 编辑后立即更新缓存
- ✅ 退出登录时清除缓存
