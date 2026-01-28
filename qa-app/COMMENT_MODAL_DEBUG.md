# 评论弹窗调试指南

## 问题描述
手机端的评论弹窗点击后无法弹出。

## 已添加的调试代码

### 1. 评论按钮点击事件（QuestionDetailScreen.js 第 1368 行附近）
```javascript
<TouchableOpacity style={styles.bottomActionBtn} onPress={() => {
  console.log('评论按钮被点击');
  console.log('当前 showCommentModal 状态:', showCommentModal);
  setShowCommentModal(true);
  console.log('设置 showCommentModal 为 true');
}}>
  <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
  <Text style={styles.bottomActionText}>评论</Text>
</TouchableOpacity>
```

### 2. Modal 组件（QuestionDetailScreen.js 第 1563 行附近）
```javascript
<Modal 
  visible={showCommentModal} 
  animationType="slide"
  onShow={() => console.log('评论弹窗已显示')}
  onRequestClose={() => {
    console.log('评论弹窗请求关闭');
    setShowCommentModal(false);
  }}
>
```

## 调试步骤

1. **启动应用**
   ```bash
   cd qa-app/qa-native-app
   npm start
   ```

2. **打开开发者工具**
   - 在 Expo Go 应用中，摇动手机打开开发菜单
   - 选择 "Debug Remote JS"
   - 在浏览器中打开 Chrome DevTools (F12)

3. **查看控制台输出**
   - 点击评论按钮
   - 查看控制台是否输出以下信息：
     - "评论按钮被点击"
     - "当前 showCommentModal 状态: false"
     - "设置 showCommentModal 为 true"
     - "评论弹窗已显示"

## 可能的问题和解决方案

### 问题 1: 按钮点击事件没有触发
**症状**: 控制台没有任何输出
**解决方案**: 
- 检查按钮是否被其他元素遮挡
- 检查 TouchableOpacity 的 zIndex 和 position 样式

### 问题 2: 状态更新但 Modal 不显示
**症状**: 控制台显示状态已更新，但弹窗不出现
**解决方案**:
- 检查 Modal 是否被其他 Modal 覆盖
- 检查 Modal 的 zIndex 样式
- 尝试添加 `transparent={false}` 属性

### 问题 3: Modal 组件渲染位置错误
**症状**: 弹窗显示但位置不对或被遮挡
**解决方案**:
- 检查 Modal 的父组件结构
- 确保 Modal 在所有其他组件之后渲染
- 检查 SafeAreaView 的样式设置

## 临时解决方案

如果问题仍然存在，可以尝试以下临时方案：

### 方案 1: 使用 transparent Modal
```javascript
<Modal 
  visible={showCommentModal} 
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowCommentModal(false)}
>
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <SafeAreaView style={styles.commentModal}>
      {/* 内容 */}
    </SafeAreaView>
  </View>
</Modal>
```

### 方案 2: 使用 presentationStyle
```javascript
<Modal 
  visible={showCommentModal} 
  animationType="slide"
  presentationStyle="fullScreen"
  onRequestClose={() => setShowCommentModal(false)}
>
```

### 方案 3: 检查是否有多个 Modal 同时打开
确保其他 Modal 的状态都是 false：
- showAnswerModal
- showActionModal
- showReportModal
- showActivityModal
- 等等

## 下一步

请运行应用并查看控制台输出，然后告诉我看到了什么信息，我会根据具体情况进一步诊断问题。
