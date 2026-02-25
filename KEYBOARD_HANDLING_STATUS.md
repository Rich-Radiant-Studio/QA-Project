# 键盘遮盖输入框问题处理状态

## ✅ 已配置的全局设置

### 1. app.json 配置
```json
"android": {
  "softwareKeyboardLayoutMode": "resize"
}
```
✅ 已正确配置 - 这会让 Android 在键盘弹起时自动调整布局

---

## 📋 页面检查清单

### ✅ 已正确处理的页面

1. **LoginScreen** ✅
   - 使用了 `KeyboardAvoidingView`
   - 使用了 `ScrollView`
   - 配置了 `keyboardShouldPersistTaps="handled"`

2. **ChangePasswordScreen** ✅
   - 使用了 `KeyboardAvoidingView`
   - 使用了 `ScrollView`
   - 配置了 `keyboardShouldPersistTaps="handled"`

3. **ReportScreen** ✅
   - 使用了 `KeyboardAvoidingView`
   - 使用了 `ScrollView`

### ⚠️ 需要检查/修复的页面

以下页面包含 `TextInput` 但可能没有正确的键盘处理：

1. **SearchScreen** ⚠️
   - 有 TextInput
   - 需要检查是否需要 KeyboardAvoidingView

2. **SettingsScreen** ⚠️
   - 有 TextInput（编辑资料弹窗）
   - Modal 中的输入框需要特殊处理

3. **QuestionDetailScreen** ⚠️
   - 有多个 TextInput（评论、回答）
   - 需要检查键盘处理

4. **SupplementDetailScreen** ⚠️
   - 有多个 TextInput（回答、评论）
   - Modal 中的输入框需要处理

5. **TeamDetailScreen** ⚠️
   - 有多个 TextInput（聊天、公告）
   - 需要检查键盘处理

6. **QuestionTeamsScreen** ⚠️
   - 有 TextInput（创建团队）
   - Modal 中的输入框需要处理

7. **UploadBankScreen** ⚠️
   - 有多个 TextInput
   - 需要检查键盘处理

8. **SuperLikePurchaseScreen** ⚠️
   - 有 TextInput
   - 需要检查键盘处理

9. **PublishScreen** ⚠️
   - 有 TextInput（发布问题）
   - 需要检查键盘处理

10. **GroupChatScreen** ⚠️
    - 有 TextInput（聊天输入）
    - 需要检查键盘处理

11. **MessagesScreen** ⚠️
    - 可能有 TextInput
    - 需要检查

12. **InviteAnswerScreen** ⚠️
    - 可能有 TextInput
    - 需要检查

13. **InviteTeamMemberScreen** ⚠️
    - 可能有 TextInput
    - 需要检查

14. **CreateActivityScreen** ⚠️
    - 可能有 TextInput
    - 需要检查

15. **AddRewardScreen** ⚠️
    - 可能有 TextInput
    - 需要检查

---

## 🛠️ 标准修复方案

### 方案 1: 使用 KeyboardAvoidingView（推荐）

适用于：整个页面需要避让键盘

```javascript
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

<SafeAreaView style={styles.container}>
  <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* 内容 */}
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

### 方案 2: 使用 react-native-keyboard-aware-scroll-view

适用于：复杂的表单页面

```bash
npm install react-native-keyboard-aware-scroll-view
```

```javascript
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

<KeyboardAwareScrollView
  enableOnAndroid={true}
  extraScrollHeight={20}
  keyboardShouldPersistTaps="handled"
>
  {/* 内容 */}
</KeyboardAwareScrollView>
```

### 方案 3: Modal 中的键盘处理

适用于：Modal 弹窗中的输入框

```javascript
<Modal visible={visible} animationType="slide">
  <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput />
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
</Modal>
```

### 方案 4: 底部固定输入框

适用于：聊天页面、评论输入框

```javascript
import { KeyboardAvoidingView, Platform } from 'react-native';

<SafeAreaView style={{ flex: 1 }}>
  <ScrollView style={{ flex: 1 }}>
    {/* 内容 */}
  </ScrollView>
  
  <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
  >
    <View style={styles.inputContainer}>
      <TextInput />
      <TouchableOpacity>
        <Text>发送</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
```

---

## 🔍 测试清单

在真机上测试每个页面：

- [ ] 点击输入框，键盘弹起
- [ ] 输入框是否被键盘遮挡
- [ ] 能否看到输入的内容
- [ ] 能否滚动查看其他内容
- [ ] 点击键盘外部，键盘是否正常收起
- [ ] 切换输入框，键盘是否正常切换

---

## 📱 Android 特殊配置

### AndroidManifest.xml 配置

如果需要更精细的控制，可以在 `android/app/src/main/AndroidManifest.xml` 中配置：

```xml
<activity
  android:name=".MainActivity"
  android:windowSoftInputMode="adjustResize"
>
```

但由于使用 Expo，应该通过 `app.json` 配置：

```json
"android": {
  "softwareKeyboardLayoutMode": "resize"  // 或 "pan"
}
```

- **resize**: 调整整个布局大小（推荐）
- **pan**: 平移布局，不改变大小

---

## 🎯 优先修复建议

### 高优先级（用户常用）

1. **PublishScreen** - 发布问题页面
2. **QuestionDetailScreen** - 问题详情（评论、回答）
3. **GroupChatScreen** - 群聊页面
4. **MessagesScreen** - 私信页面

### 中优先级

5. **TeamDetailScreen** - 团队详情（讨论）
6. **SupplementDetailScreen** - 补充说明详情
7. **CreateActivityScreen** - 创建活动
8. **QuestionTeamsScreen** - 创建团队

### 低优先级

9. **SearchScreen** - 搜索（输入框在顶部，通常不会被遮挡）
10. **SettingsScreen** - 设置（Modal 中的编辑）
11. **其他页面**

---

## 🚀 批量修复脚本

可以创建一个工具函数来统一处理：

```javascript
// src/components/KeyboardAvoidingContainer.js
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function KeyboardAvoidingContainer({ 
  children, 
  scrollEnabled = true,
  style 
}) {
  const Container = scrollEnabled ? ScrollView : View;
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ flex: 1 }, style]}
    >
      <Container 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </KeyboardAvoidingView>
  );
}
```

使用方式：

```javascript
import KeyboardAvoidingContainer from '../components/KeyboardAvoidingContainer';

<SafeAreaView style={styles.container}>
  <KeyboardAvoidingContainer>
    {/* 内容 */}
  </KeyboardAvoidingContainer>
</SafeAreaView>
```

---

## 📊 当前状态总结

### 全局配置
- ✅ `app.json` 已配置 `softwareKeyboardLayoutMode: "resize"`

### 页面状态
- ✅ 已修复: 3 个页面
- ⚠️ 需要检查: 15+ 个页面

### 建议
1. 优先修复高频使用的页面
2. 创建统一的 KeyboardAvoidingContainer 组件
3. 在真机上逐个测试
4. 根据实际情况调整 behavior 和 keyboardVerticalOffset

---

## 🔧 快速修复命令

如果要安装 keyboard-aware-scroll-view：

```bash
npm install react-native-keyboard-aware-scroll-view
```

---

## 📝 注意事项

1. **iOS vs Android**: 
   - iOS 通常使用 `behavior="padding"`
   - Android 通常使用 `behavior="height"` 或不设置

2. **SafeAreaView**: 
   - 确保 KeyboardAvoidingView 在 SafeAreaView 内部

3. **Modal**: 
   - Modal 中的键盘处理需要单独配置

4. **keyboardVerticalOffset**: 
   - 如果有固定的头部，需要设置偏移量

5. **keyboardShouldPersistTaps**: 
   - 设置为 "handled" 允许点击 ScrollView 中的按钮

---

**需要我帮你修复特定的页面吗？请告诉我哪个页面最需要优先处理。**
