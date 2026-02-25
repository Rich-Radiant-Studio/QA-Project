# 通用文本编辑弹窗使用指南

## ✅ 已完成的更新

### 替换的组件
- ❌ 旧的底部抽屉（EditModal）
- ❌ 单独的昵称弹窗（EditNicknameModal）
- ✅ 新的通用弹窗（EditTextModal）

### 已更新的字段
1. **昵称** - 单行输入，2-20 字符
2. **个人简介** - 多行输入，0-100 字符
3. **所在地** - 单行输入，0-30 字符
4. **职业** - 单行输入，0-30 字符

---

## 🎯 使用方法

### 基本用法

```javascript
// 1. 导入组件
import EditTextModal from '../components/EditTextModal';

// 2. 添加状态
const [showTextModal, setShowTextModal] = useState(false);
const [textModalConfig, setTextModalConfig] = useState({
  title: '',
  field: '',
  currentValue: '',
  minLength: 0,
  maxLength: 100,
  multiline: false,
  hint: '',
});

// 3. 打开弹窗函数
const openTextModal = (field, title, currentValue, config = {}) => {
  setTextModalConfig({
    title,
    field,
    currentValue,
    minLength: config.minLength || 0,
    maxLength: config.maxLength || 100,
    multiline: config.multiline || false,
    hint: config.hint || '',
  });
  setShowTextModal(true);
};

// 4. 保存处理函数
const handleSaveText = (newValue) => {
  const field = textModalConfig.field;
  setUserProfile({ ...userProfile, [field]: newValue });
  Alert.alert('保存成功', `${textModalConfig.title}已更新`);
};

// 5. 使用弹窗组件
<EditTextModal
  visible={showTextModal}
  onClose={() => setShowTextModal(false)}
  title={textModalConfig.title}
  currentValue={textModalConfig.currentValue}
  onSave={handleSaveText}
  minLength={textModalConfig.minLength}
  maxLength={textModalConfig.maxLength}
  multiline={textModalConfig.multiline}
  hint={textModalConfig.hint}
/>
```

---

## 📋 配置示例

### 1. 昵称（必填，单行）

```javascript
openTextModal('name', '修改昵称', userProfile.name, {
  minLength: 2,
  maxLength: 20,
  hint: '2-20个字符，可包含中英文、数字',
});
```

### 2. 个人简介（选填，多行）

```javascript
openTextModal('bio', '修改个人简介', userProfile.bio, {
  minLength: 0,
  maxLength: 100,
  multiline: true,
  hint: '介绍一下自己吧',
});
```

### 3. 所在地（选填，单行）

```javascript
openTextModal('location', '修改所在地', userProfile.location, {
  minLength: 0,
  maxLength: 30,
  hint: '填写您的所在城市',
});
```

### 4. 职业（选填，单行）

```javascript
openTextModal('occupation', '修改职业', userProfile.occupation, {
  minLength: 0,
  maxLength: 30,
  hint: '填写您的职业或专业领域',
});
```

---

## 🎨 组件 Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `visible` | boolean | ✅ | - | 是否显示弹窗 |
| `onClose` | function | ✅ | - | 关闭弹窗的回调 |
| `title` | string | ❌ | '编辑' | 弹窗标题 |
| `currentValue` | string | ❌ | '' | 当前值 |
| `onSave` | function | ✅ | - | 保存回调，参数为新值 |
| `placeholder` | string | ❌ | '请输入内容' | 输入框占位符 |
| `minLength` | number | ❌ | 0 | 最小字符数（0 表示可选） |
| `maxLength` | number | ❌ | 100 | 最大字符数 |
| `multiline` | boolean | ❌ | false | 是否多行输入 |
| `hint` | string | ❌ | '' | 提示文字 |
| `keyboardType` | string | ❌ | 'default' | 键盘类型 |

---

## 🎯 特性对比

### 单行输入（昵称、所在地、职业）

```
┌─────────────────────────────────┐
│  修改昵称                    ✕  │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 张三丰                  ⊗ │  │ ← 单行 + 清空按钮
│  └───────────────────────────┘  │
│  2-20个字符...            3/20  │
├─────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐    │
│  │   取消   │  │   保存   │    │
│  └──────────┘  └──────────┘    │
└─────────────────────────────────┘
```

### 多行输入（个人简介）

```
┌─────────────────────────────────┐
│  修改个人简介                ✕  │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 热爱学习，乐于分享。      │  │
│  │ 专注Python、数据分析      │  │ ← 多行文本框
│  │ 领域。                    │  │
│  │                           │  │
│  └───────────────────────────┘  │
│  介绍一下自己吧          35/100 │
├─────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐    │
│  │   取消   │  │   保存   │    │
│  └──────────┘  └──────────┘    │
└─────────────────────────────────┘
```

---

## ✨ 功能特性

### 1. 智能验证
- ✅ 最小/最大长度验证
- ✅ 实时字数统计
- ✅ 错误提示高亮
- ✅ 按钮自动禁用

### 2. 用户体验
- ✅ 自动聚焦输入框
- ✅ 单行输入支持一键清空
- ✅ 多行输入自动扩展
- ✅ 点击遮罩关闭
- ✅ 键盘自动避让

### 3. 视觉反馈
- ✅ 错误状态红色高亮
- ✅ 字数超限提示
- ✅ 按钮禁用状态
- ✅ 平滑动画效果

---

## 🔧 自定义扩展

### 添加手机号验证

```javascript
openTextModal('phone', '修改手机号', userProfile.phone, {
  minLength: 11,
  maxLength: 11,
  hint: '请输入11位手机号',
  keyboardType: 'phone-pad',
});
```

### 添加邮箱验证

```javascript
openTextModal('email', '修改邮箱', userProfile.email, {
  minLength: 5,
  maxLength: 50,
  hint: '请输入有效的邮箱地址',
  keyboardType: 'email-address',
});
```

### 添加网址验证

```javascript
openTextModal('website', '修改个人网站', userProfile.website, {
  minLength: 0,
  maxLength: 100,
  hint: '请输入完整的网址',
  keyboardType: 'url',
});
```

---

## 🎨 样式定制

### 修改主题色

编辑 `EditTextModal.js`：

```javascript
// 修改主色调
saveButton: {
  backgroundColor: '#ef4444',  // 改为你的主题色
},

// 修改错误色
inputError: {
  borderColor: '#ef4444',      // 改为你的错误色
  backgroundColor: '#fef2f2',
},
```

### 修改弹窗大小

```javascript
modalContainer: {
  width: '85%',      // 改为你想要的宽度
  maxWidth: 400,     // 改为你想要的最大宽度
},
```

---

## 📊 与旧方案对比

### 旧方案（底部抽屉）
- ❌ 占用整个底部空间
- ❌ 单字段显得笨重
- ❌ 需要滑动关闭
- ❌ 不符合主流习惯

### 新方案（居中弹窗）✅
- ✅ 视觉焦点集中
- ✅ 简洁优雅
- ✅ 点击遮罩关闭
- ✅ 符合微信、QQ 设计
- ✅ 一个组件多种用途

---

## 🚀 性能优化

### 1. 状态管理
- 使用单一配置对象
- 避免多个弹窗状态
- 减少重复渲染

### 2. 组件复用
- 一个组件处理所有单字段编辑
- 配置化使用
- 易于维护

### 3. 内存优化
- 弹窗关闭时清理状态
- 避免内存泄漏
- 优化动画性能

---

## ✅ 总结

**已完成：**
- ✅ 创建通用文本编辑弹窗组件
- ✅ 替换昵称编辑为居中弹窗
- ✅ 替换个人简介编辑为居中弹窗
- ✅ 替换所在地编辑为居中弹窗
- ✅ 替换职业编辑为居中弹窗
- ✅ 支持单行/多行输入
- ✅ 支持必填/选填验证
- ✅ 完整的错误处理

**优势：**
- 🎯 一个组件，多种用途
- 🎨 符合主流 APP 设计
- ⚡ 操作快捷高效
- 🔧 易于扩展定制

---

**现在设置页面的所有单字段编辑都使用优雅的居中弹窗了！** 🎉
