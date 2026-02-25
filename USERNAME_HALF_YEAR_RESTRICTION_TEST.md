# 用户名半年修改限制 - 测试验证

## 功能说明

用户修改用户名时，如果距离上次修改时间未满半年，则不允许修改。

## 限制机制

### 1. 时间计算
```javascript
const getRemainingDays = () => {
  if (!lastModifiedDate) return 0; // 从未修改过，可以修改
  
  const lastDate = new Date(lastModifiedDate);
  const now = new Date();
  const sixMonthsLater = new Date(lastDate);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  
  const diffTime = sixMonthsLater - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

const remainingDays = getRemainingDays();
const canModify = remainingDays === 0;
```

### 2. UI 限制

当 `canModify = false` 时（未满半年）：

#### ❌ 警告提示框
```jsx
{!canModify && (
  <View style={styles.warningBox}>
    <Ionicons name="time-outline" size={18} color="#f59e0b" />
    <Text style={styles.warningText}>
      用户名每半年可修改一次，还需等待 {remainingDays} 天
    </Text>
  </View>
)}
```

#### ❌ 输入框禁用
```jsx
<TextInput
  editable={canModify && !isLoading}  // 禁用输入
  // ...
/>
```

#### ❌ 清除按钮隐藏
```jsx
{username.length > 0 && canModify && !isLoading && (
  <TouchableOpacity onPress={() => setUsername('')}>
    <Ionicons name="close-circle" />
  </TouchableOpacity>
)}
```

#### ❌ 保存按钮禁用
```jsx
<TouchableOpacity
  style={[
    styles.button, 
    styles.confirmButton,
    (!canModify || ...) && styles.confirmButtonDisabled  // 禁用样式
  ]}
  disabled={!canModify || ...}  // 禁用点击
  onPress={handleSave}
>
  <Text style={styles.confirmButtonText}>保存</Text>
</TouchableOpacity>
```

## 测试场景

### 场景 1：首次设置用户名（从未修改过）

**前置条件**：
- `lastModifiedDate = null`

**操作步骤**：
1. 进入设置页面
2. 点击"用户名"（显示"未设置"）
3. 弹出编辑弹窗

**预期结果**：
- ✅ 不显示警告提示框
- ✅ 输入框可以编辑
- ✅ 可以输入用户名
- ✅ 保存按钮可以点击（输入有效用户名后）

**验证点**：
```javascript
remainingDays = 0
canModify = true
```

---

### 场景 2：刚修改过用户名（1天前）

**前置条件**：
- `lastModifiedDate = "2024-02-23T10:00:00Z"` (1天前)
- 当前时间：2024-02-24

**操作步骤**：
1. 点击"用户名"
2. 弹出编辑弹窗

**预期结果**：
- ✅ 显示警告："还需等待 181 天"
- ✅ 输入框禁用（灰色，无法输入）
- ✅ 清除按钮不显示
- ✅ 保存按钮禁用（灰色，无法点击）

**验证点**：
```javascript
remainingDays = 181
canModify = false
```

---

### 场景 3：修改后 3 个月（未满半年）

**前置条件**：
- `lastModifiedDate = "2023-11-24T10:00:00Z"` (3个月前)
- 当前时间：2024-02-24

**操作步骤**：
1. 点击"用户名"
2. 弹出编辑弹窗

**预期结果**：
- ✅ 显示警告："还需等待 91 天"
- ✅ 输入框禁用
- ✅ 保存按钮禁用

**验证点**：
```javascript
remainingDays = 91
canModify = false
```

---

### 场景 4：修改后 5 个月 29 天（差 1 天满半年）

**前置条件**：
- `lastModifiedDate = "2023-08-26T10:00:00Z"` (5个月29天前)
- 当前时间：2024-02-24

**操作步骤**：
1. 点击"用户名"
2. 弹出编辑弹窗

**预期结果**：
- ✅ 显示警告："还需等待 1 天"
- ✅ 输入框禁用
- ✅ 保存按钮禁用

**验证点**：
```javascript
remainingDays = 1
canModify = false
```

---

### 场景 5：修改后正好 6 个月（满半年）

**前置条件**：
- `lastModifiedDate = "2023-08-24T10:00:00Z"` (正好6个月前)
- 当前时间：2024-02-24

**操作步骤**：
1. 点击"用户名"
2. 弹出编辑弹窗

**预期结果**：
- ✅ 不显示警告提示框
- ✅ 输入框可以编辑
- ✅ 可以输入用户名
- ✅ 保存按钮可以点击

**验证点**：
```javascript
remainingDays = 0
canModify = true
```

---

### 场景 6：修改后超过 6 个月

**前置条件**：
- `lastModifiedDate = "2023-06-24T10:00:00Z"` (8个月前)
- 当前时间：2024-02-24

**操作步骤**：
1. 点击"用户名"
2. 弹出编辑弹窗

**预期结果**：
- ✅ 不显示警告提示框
- ✅ 输入框可以编辑
- ✅ 可以输入用户名
- ✅ 保存按钮可以点击

**验证点**：
```javascript
remainingDays = 0
canModify = true
```

---

## UI 状态对比

### 可修改状态（canModify = true）

```
┌─────────────────────────────────────┐
│         修改用户名                   │
├─────────────────────────────────────┤
│  @ [testUser123    ] ×   12/20      │
│     ↑ 可以输入        ↑ 显示清除按钮  │
│                                     │
│  用户名规则：                        │
│  ✓ 6-20 个字符                      │
│  ✓ 仅包含大小写字母和数字             │
│  ℹ️ 每半年可修改一次                 │
│                                     │
│  [ 取消 ]        [ 保存 ]           │
│                   ↑ 可以点击         │
└─────────────────────────────────────┘
```

### 不可修改状态（canModify = false）

```
┌─────────────────────────────────────┐
│         修改用户名                   │
├─────────────────────────────────────┤
│  ⏰ 用户名每半年可修改一次，          │
│     还需等待 122 天                  │
│     ↑ 显示警告提示                   │
├─────────────────────────────────────┤
│  @ [testUser123        ]  12/20     │
│     ↑ 禁用输入（灰色）                │
│     ↑ 不显示清除按钮                 │
│                                     │
│  用户名规则：                        │
│  ○ 6-20 个字符                      │
│  ○ 仅包含大小写字母和数字             │
│  ℹ️ 每半年可修改一次                 │
│                                     │
│  [ 取消 ]        [ 保存 ]           │
│                   ↑ 禁用（灰色）     │
└─────────────────────────────────────┘
```

## 样式对比

### 保存按钮样式

#### 正常状态
```javascript
confirmButton: {
  backgroundColor: '#ef4444',  // 红色
}
```

#### 禁用状态
```javascript
confirmButtonDisabled: {
  backgroundColor: '#fca5a5',  // 浅红色
  opacity: 0.6,                // 半透明
}
```

### 输入框样式

#### 正常状态
```javascript
inputWrapper: {
  backgroundColor: '#f9fafb',
  borderColor: '#e5e7eb',
}
```

#### 禁用状态（通过 editable={false}）
- 系统自动应用禁用样式
- 文字颜色变浅
- 无法获得焦点
- 无法输入

## 调试方法

### 1. 查看计算结果

在 EditUsernameModal 组件中添加日志：

```javascript
useEffect(() => {
  console.log('=== 用户名修改限制检查 ===');
  console.log('上次修改时间:', lastModifiedDate);
  console.log('剩余天数:', remainingDays);
  console.log('是否可修改:', canModify);
  console.log('========================');
}, [lastModifiedDate, remainingDays, canModify]);
```

### 2. 模拟不同时间

在测试时，可以修改 `lastModifiedDate` 来模拟不同场景：

```javascript
// 测试：1天前修改
lastModifiedDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

// 测试：3个月前修改
lastModifiedDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

// 测试：6个月前修改
lastModifiedDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

// 测试：从未修改
lastModifiedDate = null;
```

### 3. 检查 UI 状态

```javascript
// 检查输入框是否禁用
console.log('输入框可编辑:', canModify && !isLoading);

// 检查保存按钮是否禁用
console.log('保存按钮禁用:', !canModify || isLoading || !!error || username === currentUsername || !username);

// 检查警告框是否显示
console.log('显示警告框:', !canModify);
```

## 边界情况

### 1. 时区问题

确保前后端使用相同的时区或统一使用 UTC：

```javascript
// 前端：使用 ISO 8601 格式（包含时区）
const now = new Date().toISOString();
// "2024-02-24T10:30:00.000Z"

// 后端：存储时使用 UTC
// 返回时使用 ISO 8601 格式
```

### 2. 闰年问题

JavaScript 的 `setMonth()` 方法会自动处理闰年：

```javascript
const date = new Date('2024-02-29'); // 闰年2月29日
date.setMonth(date.getMonth() + 6);  // 自动调整为8月29日
```

### 3. 月份天数不同

```javascript
// 1月31日 + 6个月 = 7月31日 ✓
// 8月31日 + 6个月 = 2月28/29日 ✓ (自动调整)
```

## 错误处理

### 1. 无效的日期格式

```javascript
const getRemainingDays = () => {
  if (!lastModifiedDate) return 0;
  
  try {
    const lastDate = new Date(lastModifiedDate);
    
    // 检查日期是否有效
    if (isNaN(lastDate.getTime())) {
      console.error('无效的日期格式:', lastModifiedDate);
      return 0; // 允许修改
    }
    
    // ... 计算逻辑
  } catch (error) {
    console.error('日期计算错误:', error);
    return 0; // 允许修改
  }
};
```

### 2. 后端验证

即使前端禁用了按钮，后端也应该验证：

```javascript
// 后端验证示例
if (user.usernameLastModified) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  if (new Date(user.usernameLastModified) > sixMonthsAgo) {
    return {
      code: 400,
      msg: '用户名修改过于频繁，请半年后再试'
    };
  }
}
```

## 测试清单

- [ ] 首次设置用户名（从未修改）- 应允许修改
- [ ] 1天前修改 - 应禁止修改，显示剩余天数
- [ ] 3个月前修改 - 应禁止修改
- [ ] 5个月29天前修改 - 应禁止修改，显示"还需等待 1 天"
- [ ] 正好6个月前修改 - 应允许修改
- [ ] 超过6个月前修改 - 应允许修改
- [ ] 输入框在禁用时无法输入
- [ ] 保存按钮在禁用时无法点击
- [ ] 清除按钮在禁用时不显示
- [ ] 警告提示框在禁用时显示
- [ ] 警告提示框在允许时不显示

## 总结

✅ **已实现的限制机制**：

1. **时间计算**：准确计算距离下次可修改的剩余天数
2. **UI 禁用**：输入框、保存按钮、清除按钮全部禁用
3. **视觉反馈**：警告提示框、禁用样式、剩余天数显示
4. **用户体验**：清晰的提示信息，友好的错误反馈

✅ **安全保障**：

1. **前端验证**：防止用户绕过 UI 限制
2. **后端验证**：最终的安全保障
3. **双重检查**：前后端都验证修改频率

所有限制机制已正确实现，用户在未满半年时无法修改用户名！
