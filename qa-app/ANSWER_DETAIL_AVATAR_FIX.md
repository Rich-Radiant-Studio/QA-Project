# 回答详情页头像显示修复

## 问题描述
回答详情页的头像显示为空白。

## 问题原因
在修改标签布局时，错误地将 `Image` 组件替换为 `Avatar` 组件，导致头像无法正常显示。

## 修复内容

### 1. 回答作者头像 ✅
**位置**：回答详情页顶部，作者信息区域

**修复前**：
```javascript
<Avatar uri={answer.avatar} name={answer.author} size={48} />
```

**修复后**：
```javascript
<Image source={{ uri: answer.avatar }} style={styles.answerAvatar} />
```

**样式**：
```javascript
answerAvatar: { width: 48, height: 48, borderRadius: 24 }
```

### 2. 邀请者头像 ✅
**位置**：标签区域，邀请者标签内

**修复前**：
```javascript
<Avatar uri={answer.invitedBy.avatar} name={answer.invitedBy.name} size={14} />
```

**修复后**：
```javascript
<Image source={{ uri: answer.invitedBy.avatar }} style={styles.inviterAvatarCompact} />
```

**样式**：
```javascript
inviterAvatarCompact: { width: 14, height: 14, borderRadius: 7 }
```

### 3. 专家头像 ✅
**位置**：仲裁申请弹窗，专家列表

**修复前**：
```javascript
<Avatar uri={expert.avatar} name={expert.name} size={40} />
```

**修复后**：
```javascript
<Image source={{ uri: expert.avatar }} style={styles.expertAvatar} />
```

**样式**：
```javascript
expertAvatar: { width: 40, height: 40, borderRadius: 20 }
```

## 技术说明

### Image vs Avatar 组件

**Image 组件**（React Native 原生）：
- 使用 `source={{ uri: url }}` 属性
- 需要在样式中定义宽度、高度、圆角
- 更轻量，性能更好
- 适合简单的头像显示

**Avatar 组件**（自定义组件）：
- 使用 `uri` 和 `name` 属性
- 使用 `size` 属性控制大小
- 可能包含额外的功能（如默认头像、首字母显示等）
- 适合需要统一样式和功能的场景

### 为什么使用 Image 而不是 Avatar？

1. **一致性**：页面其他部分（补充回答、评论）都使用 `Image` 组件
2. **简单性**：头像显示不需要额外功能
3. **性能**：`Image` 组件更轻量
4. **兼容性**：避免自定义组件可能的兼容性问题

## 修复验证

### 测试要点
- [x] 回答作者头像正常显示
- [x] 邀请者标签中的小头像正常显示
- [x] 仲裁弹窗中的专家头像正常显示
- [x] 补充回答作者头像正常显示（未修改）
- [x] 评论作者头像正常显示（未修改）

### 测试步骤
1. 打开回答详情页
2. 检查顶部作者头像是否显示
3. 检查邀请者标签中的小头像是否显示
4. 点击仲裁按钮
5. 检查专家列表中的头像是否显示
6. 滚动到补充回答和评论区域
7. 检查所有头像是否正常显示

## 相关文件
- `qa-app/qa-native-app/src/screens/AnswerDetailScreen.js`

## 修复时间
2026-01-27

## 状态
✅ 已修复并验证

## 总结
成功修复了回答详情页的头像显示问题，将错误使用的 `Avatar` 组件改回 `Image` 组件，并添加了相应的样式定义。所有头像现在都能正常显示。
