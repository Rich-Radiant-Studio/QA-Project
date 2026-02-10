# 企业认证联系方式验证规则

## 概述

企业认证新增了联系人和联系方式字段，确保平台能够有效联系到企业负责人。

## 字段说明

### 1. 企业联系人（必填）

**字段名**: `contactPerson`

**验证规则**:
- ✅ 必填项
- ✅ 不能为空字符串
- ✅ 不能只包含空格

**错误提示**: "请填写企业联系人"

**示例**:
```javascript
✅ 正确: "张三"
✅ 正确: "李经理"
❌ 错误: ""
❌ 错误: "   "
```

### 2. 联系电话（可选）

**字段名**: `contactPhone`

**验证规则**:
- ⚠️ 与邮箱二选一（至少填一项）
- ✅ 如果填写，必须符合手机号格式
- ✅ 11位数字
- ✅ 以1开头
- ✅ 第二位为3-9

**正则表达式**: `/^1[3-9]\d{9}$/`

**错误提示**: 
- "请至少填写一种联系方式（电话或邮箱）"
- "请输入正确的手机号码格式"

**示例**:
```javascript
✅ 正确: "13812345678"
✅ 正确: "15987654321"
✅ 正确: "19123456789"
❌ 错误: "12345678901" (第二位不是3-9)
❌ 错误: "1381234567" (不足11位)
❌ 错误: "138123456789" (超过11位)
❌ 错误: "23812345678" (不以1开头)
```

### 3. 联系邮箱（可选）

**字段名**: `contactEmail`

**验证规则**:
- ⚠️ 与电话二选一（至少填一项）
- ✅ 如果填写，必须符合邮箱格式
- ✅ 包含 @ 符号
- ✅ @ 前后都有内容
- ✅ 包含域名后缀

**正则表达式**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**错误提示**: 
- "请至少填写一种联系方式（电话或邮箱）"
- "请输入正确的邮箱格式"

**示例**:
```javascript
✅ 正确: "contact@company.com"
✅ 正确: "zhang.san@example.com.cn"
✅ 正确: "info123@test-domain.org"
❌ 错误: "contact" (缺少@和域名)
❌ 错误: "@company.com" (缺少用户名)
❌ 错误: "contact@" (缺少域名)
❌ 错误: "contact @company.com" (包含空格)
❌ 错误: "contact@company" (缺少域名后缀)
```

## 验证流程

### 步骤1: 检查联系人
```javascript
if (!data.contactPerson || data.contactPerson.trim() === '') {
  Alert.alert('提示', '请填写企业联系人');
  return;
}
```

### 步骤2: 检查联系方式是否至少填一项
```javascript
if ((!data.contactPhone || data.contactPhone.trim() === '') && 
    (!data.contactEmail || data.contactEmail.trim() === '')) {
  Alert.alert('提示', '请至少填写一种联系方式（电话或邮箱）');
  return;
}
```

### 步骤3: 验证电话格式（如果填写了）
```javascript
if (data.contactPhone && data.contactPhone.trim() !== '') {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(data.contactPhone.trim())) {
    Alert.alert('提示', '请输入正确的手机号码格式');
    return;
  }
}
```

### 步骤4: 验证邮箱格式（如果填写了）
```javascript
if (data.contactEmail && data.contactEmail.trim() !== '') {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactEmail.trim())) {
    Alert.alert('提示', '请输入正确的邮箱格式');
    return;
  }
}
```

## 验证场景

### 场景1: 只填写电话
```javascript
{
  contactPerson: "张三",
  contactPhone: "13812345678",
  contactEmail: ""
}
// ✅ 验证通过
```

### 场景2: 只填写邮箱
```javascript
{
  contactPerson: "李四",
  contactPhone: "",
  contactEmail: "lisi@company.com"
}
// ✅ 验证通过
```

### 场景3: 同时填写电话和邮箱
```javascript
{
  contactPerson: "王五",
  contactPhone: "13912345678",
  contactEmail: "wangwu@company.com"
}
// ✅ 验证通过
```

### 场景4: 都不填写
```javascript
{
  contactPerson: "赵六",
  contactPhone: "",
  contactEmail: ""
}
// ❌ 验证失败: "请至少填写一种联系方式（电话或邮箱）"
```

### 场景5: 电话格式错误
```javascript
{
  contactPerson: "孙七",
  contactPhone: "12345678901",
  contactEmail: ""
}
// ❌ 验证失败: "请输入正确的手机号码格式"
```

### 场景6: 邮箱格式错误
```javascript
{
  contactPerson: "周八",
  contactPhone: "",
  contactEmail: "invalid-email"
}
// ❌ 验证失败: "请输入正确的邮箱格式"
```

### 场景7: 未填写联系人
```javascript
{
  contactPerson: "",
  contactPhone: "13812345678",
  contactEmail: "contact@company.com"
}
// ❌ 验证失败: "请填写企业联系人"
```

## UI 交互

### 输入框配置

#### 联系电话
```javascript
<TextInput
  style={styles.fieldInput}
  placeholder="请输入手机号码"
  placeholderTextColor="#9ca3af"
  keyboardType="phone-pad"      // 数字键盘
  maxLength={11}                 // 限制11位
  value={verificationData.enterprise.contactPhone}
  onChangeText={(text) => updateVerificationField('contactPhone', text)}
/>
```

#### 联系邮箱
```javascript
<TextInput
  style={styles.fieldInput}
  placeholder="请输入邮箱地址"
  placeholderTextColor="#9ca3af"
  keyboardType="email-address"   // 邮箱键盘
  autoCapitalize="none"          // 禁用自动大写
  value={verificationData.enterprise.contactEmail}
  onChangeText={(text) => updateVerificationField('contactEmail', text)}
/>
```

### 提示文案

在联系方式区域显示：
```
联系方式 *
请至少填写一种联系方式
```

## 最佳实践

### 1. 用户体验优化
- ✅ 使用合适的键盘类型（数字键盘、邮箱键盘）
- ✅ 限制电话号码输入长度（11位）
- ✅ 禁用邮箱输入的自动大写
- ✅ 提供清晰的错误提示

### 2. 数据清理
- ✅ 使用 `trim()` 去除首尾空格
- ✅ 验证前检查是否为空字符串
- ✅ 统一处理空值和空字符串

### 3. 错误提示
- ✅ 按顺序验证（先必填，再格式）
- ✅ 一次只显示一个错误
- ✅ 错误提示清晰明确

## 常见问题

### Q1: 为什么电话和邮箱不都是必填？
A: 考虑到不同企业的实际情况，有些企业可能更倾向于使用邮箱联系，有些则更倾向于电话。至少填一项既保证了联系方式的可用性，又提供了灵活性。

### Q2: 为什么只支持手机号，不支持座机？
A: 手机号更便于快速联系和验证，且格式统一易于验证。如需座机联系，可以在后续沟通中补充。

### Q3: 邮箱验证是否支持国际域名？
A: 当前的正则表达式支持基本的国际域名格式，包括多级域名和各种后缀。

### Q4: 如果用户填写了错误格式后修改，会重新验证吗？
A: 验证只在提交时进行。用户可以随时修改输入内容，提交时会重新验证所有字段。

## 安全考虑

1. **数据脱敏**: 在日志和错误报告中不应包含完整的联系方式
2. **防止注入**: 输入内容应进行适当的转义和清理
3. **隐私保护**: 联系方式仅用于认证和必要的业务沟通

---

**文档版本**: v1.0.0
**更新时间**: 2026-02-10
**适用版本**: 企业认证 v1.3.0+
