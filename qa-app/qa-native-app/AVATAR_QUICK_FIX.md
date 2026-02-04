# 头像不显示 - 快速修复方案

## 🎯 最可能的原因

DiceBear API (https://api.dicebear.com) 在某些网络环境下访问较慢或被阻止。

## ✅ 立即可用的解决方案

### 方案 1：清除缓存（最简单）

1. **在 Expo Go 中**：
   - 摇晃手机
   - 点击 "Clear cache and reload"

2. **在终端中**：
   ```bash
   # 按 Shift + R
   ```

### 方案 2：使用 Avatar 组件（推荐）

我已经创建了一个 `Avatar` 组件，自动处理加载失败：

**位置：** `src/components/Avatar.js`

**特点：**
- ✅ 自动处理加载失败
- ✅ 显示首字母占位符
- ✅ 彩色背景（根据名字生成）
- ✅ 加载状态显示

**使用示例：**

```javascript
import Avatar from '../components/Avatar';

// 替换原来的 Image 组件
<Avatar 
  uri="https://api.dicebear.com/7.x/avataaars/svg?seed=user1"
  name="张三"
  size={40}
/>
```

### 方案 3：添加错误处理（临时方案）

为现有的 Image 组件添加错误处理：

```javascript
<Image
  source={{ uri: avatar }}
  style={styles.avatar}
  defaultSource={require('./assets/default-avatar.png')} // 需要添加默认图片
  onError={(e) => {
    console.log('头像加载失败:', avatar);
    // 可以设置一个状态来显示占位符
  }}
/>
```

## 🔍 诊断步骤

### 1. 检查网络

在浏览器中打开：
```
https://api.dicebear.com/7.x/avataaars/svg?seed=user1
```

- ✅ 能打开：说明 API 可用，是应用问题
- ❌ 打不开：说明网络问题，需要换图片服务

### 2. 查看终端日志

重新加载应用后，查看终端是否有：
```
LOG  头像加载失败: https://...
```

### 3. 测试简单图片

临时修改一个头像 URL 为：
```javascript
avatar: 'https://picsum.photos/200'
```

如果这个能显示，说明是 DiceBear API 的问题。

## 🚀 推荐的修复顺序

### 第一步：清除缓存
```bash
# 在终端按 Shift + R
```

### 第二步：如果还不行，使用 Avatar 组件

在需要显示头像的地方：

```javascript
// 1. 导入组件
import Avatar from '../components/Avatar';

// 2. 替换 Image
// 之前：
<Image source={{ uri: item.avatar }} style={styles.avatar} />

// 之后：
<Avatar uri={item.avatar} name={item.author} size={40} />
```

### 第三步：如果还不行，换图片服务

使用国内可访问的服务：

```javascript
// 使用 UI Avatars
const getAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128&color=fff`;
};

// 使用
avatar: getAvatar('张三')
```

## 📝 需要修改的文件（如果使用 Avatar 组件）

主要的头像显示位置：

1. **HomeScreen.js** - 问题列表的作者头像
2. **QuestionDetailScreen.js** - 问题详情的作者头像
3. **ProfileScreen.js** - 个人中心的头像
4. **MessagesScreen.js** - 消息列表的头像
5. **GroupChatScreen.js** - 群聊的头像
6. **TeamDetailScreen.js** - 团队成员头像

## 💡 最佳实践

### 创建头像工具函数

```javascript
// src/utils/avatar.js
export const getAvatarUrl = (seed, name) => {
  // 优先使用 DiceBear
  const dicebear = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  
  // 备用方案：UI Avatars
  const uiAvatars = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128&color=fff`;
  
  return dicebear; // 或根据网络情况选择
};
```

## 🔧 如果需要我帮忙

请告诉我：

1. **清除缓存后是否有改善？**
2. **终端是否有错误日志？**
3. **浏览器能否打开 DiceBear URL？**
4. **是所有头像都不显示，还是部分不显示？**

根据您的反馈，我可以提供更具体的解决方案。

## 📊 快速检查清单

- [ ] 已清除 Expo Go 缓存
- [ ] 已查看终端日志
- [ ] 已测试 DiceBear URL 是否可访问
- [ ] 已尝试使用 Avatar 组件
- [ ] 已检查网络连接

---

**现在就试试：**

1. 在 Expo Go 中摇晃手机
2. 点击 "Clear cache and reload"
3. 查看头像是否显示

如果还不行，使用我创建的 `Avatar` 组件！
