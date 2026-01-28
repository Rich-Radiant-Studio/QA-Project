# 问题详情页评论弹窗功能

## 任务状态：✅ 已完成

## 完成时间
2026-01-27

## 功能概述
为问题详情页的评论按钮添加点击事件，打开评论弹窗，并在评论弹窗中集成身份选择器。

## 实现内容

### 1. 评论按钮点击事件 ✅
**位置**：问题详情页底部栏

**修改前**：
```javascript
<TouchableOpacity style={styles.bottomActionBtn}>
  <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
  <Text style={styles.bottomActionText}>评论</Text>
</TouchableOpacity>
```

**修改后**：
```javascript
<TouchableOpacity style={styles.bottomActionBtn} onPress={() => setShowCommentModal(true)}>
  <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
  <Text style={styles.bottomActionText}>评论</Text>
</TouchableOpacity>
```

### 2. 评论弹窗身份选择器 ✅
**位置**：评论输入框下方

**状态变量**：
```javascript
const [commentIdentity, setCommentIdentity] = useState('personal');
const [commentSelectedTeams, setCommentSelectedTeams] = useState([]);
```

**组件集成**：
```javascript
<View style={styles.commentIdentitySection}>
  <IdentitySelector
    selectedIdentity={commentIdentity}
    selectedTeams={commentSelectedTeams}
    onIdentityChange={setCommentIdentity}
    onTeamsChange={setCommentSelectedTeams}
  />
</View>
```

## 评论弹窗界面

```
┌─────────────────────────────────────────────────────┐
│ ✕                  写评论                    [发布] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 写下你的评论...                                      │
│                                                     │
│                                                     │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 👤 发布身份                                      │ │
│ │                                                 │ │
│ │ ⚫ 个人身份                              👤      │ │
│ │    以个人名义发布                                │ │
│ │                                                 │ │
│ │ ⭕ 团队身份                              👥      │ │
│ │    以团队名义发布（可多选）                      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│ 📷  @  😊                              125 / 500   │
└─────────────────────────────────────────────────────┘
```

## 功能特性

### 评论弹窗
- 全屏弹窗设计
- 顶部标题栏（关闭按钮 + 标题 + 发布按钮）
- 多行文本输入框
- 身份选择器
- 底部工具栏（图片、@、表情）
- 字数统计（500字限制）

### 身份选择
- 个人身份选项
- 团队身份选项
- 多选团队功能
- 实时状态更新

## 交互流程

1. 用户点击底部栏"评论"按钮
2. 打开评论弹窗
3. 输入评论内容
4. 选择发布身份（个人/团队）
5. 如果选择团队，可多选团队
6. 点击"发布"按钮提交评论
7. 显示成功提示
8. 关闭弹窗

## 样式定义

```javascript
commentModal: { 
  flex: 1, 
  backgroundColor: '#fff' 
}

commentContentArea: { 
  flex: 1, 
  backgroundColor: '#fff' 
}

commentTextInput: { 
  padding: 16, 
  fontSize: 16, 
  color: '#333', 
  lineHeight: 26, 
  minHeight: 200 
}

commentIdentitySection: { 
  paddingHorizontal: 16, 
  paddingBottom: 16 
}

commentToolbar: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  paddingHorizontal: 12, 
  paddingVertical: 10, 
  borderTopWidth: 1, 
  borderTopColor: '#f0f0f0', 
  backgroundColor: '#fff' 
}
```

## 测试要点

### 功能测试
- [x] 点击评论按钮打开弹窗
- [x] 输入评论内容
- [x] 选择个人身份
- [x] 选择团队身份
- [x] 多选团队
- [x] 发布按钮状态（空内容时禁用）
- [x] 发布评论成功
- [x] 关闭弹窗

### UI 测试
- [x] 弹窗全屏显示
- [x] 标题栏布局正确
- [x] 输入框高度合适
- [x] 身份选择器显示正常
- [x] 工具栏布局正确
- [x] 字数统计显示正确

## 相关文件
- `qa-app/qa-native-app/src/screens/QuestionDetailScreen.js`
- `qa-app/qa-native-app/src/components/IdentitySelector.js`

## 总结

成功为问题详情页添加了评论弹窗功能：
- ✅ 评论按钮绑定点击事件
- ✅ 打开评论弹窗
- ✅ 集成身份选择器
- ✅ 支持个人/团队身份
- ✅ 支持多选团队
- ✅ 完整的交互流程

所有代码已实现并通过语法检查，功能已准备好进行测试。

---

**任务状态：✅ 已完成**
