# 退出登录默认密码显示流程图

## 用户场景流程

```
┌─────────────────────────────────────────────────────────────┐
│                      用户登录应用                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          调用 API: /app/user/profile/me                      │
│          获取用户信息（包括 passwordChanged 字段）              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  passwordChanged?     │
                └───────────────────────┘
                    ↓               ↓
            false (未修改)      true (已修改)
                    ↓               ↓
        ┌──────────────────┐  ┌──────────────────┐
        │ 显示默认密码      │  │ 不显示默认密码    │
        │ 12345678         │  │                  │
        └──────────────────┘  └──────────────────┘
```

## 修改密码流程

```
┌─────────────────────────────────────────────────────────────┐
│              用户进入"设置" → "修改密码"                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              输入当前密码、新密码、确认密码                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          调用 API: /app/user/auth/changePassword             │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │  修改成功？    │
                    └───────────────┘
                    ↓           ↓
                  成功         失败
                    ↓           ↓
        ┌──────────────────┐  ┌──────────────────┐
        │ 更新本地缓存      │  │ 显示错误提示      │
        │ passwordChanged  │  │                  │
        │ = true           │  │                  │
        └──────────────────┘  └──────────────────┘
                    ↓
        ┌──────────────────┐
        │ 下次退出登录时    │
        │ 不显示默认密码    │
        └──────────────────┘
```

## 退出登录弹窗显示逻辑

```
用户点击"退出登录"
        ↓
读取 userProfile.passwordChanged
        ↓
    ┌───────────────────────┐
    │ passwordChanged?      │
    └───────────────────────┘
        ↓           ↓
    false       true
        ↓           ↓
┌──────────────┐  ┌──────────────┐
│ 弹窗显示：    │  │ 弹窗显示：    │
│              │  │              │
│ 用户名：xxx  │  │ 用户名：xxx  │
│ 默认密码：   │  │              │
│ 12345678     │  │ (无密码显示) │
└──────────────┘  └──────────────┘
```

## 数据流向

```
┌─────────────────────────────────────────────────────────────┐
│                         后端 API                             │
│                                                              │
│  /app/user/profile/me                                       │
│  返回: { passwordChanged: false/true }                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    UserCacheService                          │
│                                                              │
│  缓存用户信息到 AsyncStorage                                  │
│  key: 'userProfile'                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     ProfileScreen                            │
│                                                              │
│  userProfile.passwordChanged                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  LogoutConfirmModal                          │
│                                                              │
│  showDefaultPassword={!userProfile.passwordChanged}         │
│                                                              │
│  显示/隐藏默认密码 12345678                                   │
└─────────────────────────────────────────────────────────────┘
```

## 本地缓存更新流程

```
┌─────────────────────────────────────────────────────────────┐
│              ChangePasswordScreen                            │
│              修改密码成功                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  1. 读取 AsyncStorage.getItem('userProfile')                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. 解析 JSON                                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. 更新 profile.passwordChanged = true                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. 保存 AsyncStorage.setItem('userProfile', JSON)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ✅ 本地缓存已更新                                            │
│  下次退出登录时不显示默认密码                                   │
└─────────────────────────────────────────────────────────────┘
```

## 关键代码位置

### 1. LogoutConfirmModal.js (第 10-12 行)
```javascript
export default function LogoutConfirmModal({ 
  visible, 
  onClose, 
  onConfirm, 
  username, 
  isLoading = false,
  showDefaultPassword = false // 是否显示默认密码
})
```

### 2. LogoutConfirmModal.js (第 38-48 行)
```javascript
{/* 默认密码（仅在未修改密码时显示） */}
{showDefaultPassword && (
  <View style={styles.infoBox}>
    <View style={styles.infoRow}>
      <Ionicons name="lock-closed-outline" size={16} color="#6b7280" />
      <Text style={styles.infoLabel}>默认密码：</Text>
    </View>
    <Text style={styles.infoValue}>{defaultPassword}</Text>
  </View>
)}
```

### 3. ProfileScreen.js (第 1608 行)
```javascript
<LogoutConfirmModal
  visible={showLogoutModal}
  onClose={() => setShowLogoutModal(false)}
  onConfirm={handleConfirmLogout}
  username={userProfile.username || userProfile.nickname}
  isLoading={isLoggingOut}
  showDefaultPassword={!userProfile.passwordChanged}  // 关键逻辑
/>
```

### 4. ChangePasswordScreen.js (第 122-132 行)
```javascript
// 更新本地缓存：标记密码已修改
try {
  const cachedProfile = await AsyncStorage.getItem('userProfile');
  if (cachedProfile) {
    const profile = JSON.parse(cachedProfile);
    profile.passwordChanged = true;
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    console.log('✅ 已更新本地缓存：passwordChanged = true');
  }
} catch (error) {
  console.error('❌ 更新本地缓存失败:', error);
}
```

## 测试检查清单

- [ ] 新用户登录后，点击退出登录，弹窗显示默认密码 `12345678`
- [ ] 修改密码成功后，终端显示 `✅ 已更新本地缓存：passwordChanged = true`
- [ ] 修改密码后，点击退出登录，弹窗不显示默认密码
- [ ] 退出登录后重新登录，点击退出登录，弹窗仍然不显示默认密码
- [ ] API 日志中显示 `passwordChanged: false (是否修改过密码)`

## 兼容性说明

### 如果后端未返回 passwordChanged 字段

```javascript
// ProfileScreen.js 中的处理
passwordChanged: freshProfile.passwordChanged === true
```

- `undefined === true` → `false` → 显示默认密码 ✅
- `null === true` → `false` → 显示默认密码 ✅
- `false === true` → `false` → 显示默认密码 ✅
- `true === true` → `true` → 不显示默认密码 ✅

**结论**：只有当后端明确返回 `true` 时，才不显示默认密码。其他所有情况都显示默认密码，这对新用户更友好。
