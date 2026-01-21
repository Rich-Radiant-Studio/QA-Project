# 补充问题功能实现说明

## 功能概述
用户可以在问题详情页查看补充问题列表,点击任意补充问题后跳转到该补充问题的详情页。

## 实现流程

### 1. 问题详情页 (QuestionDetailScreen.js)

#### 数据结构
```javascript
const supplementQuestions = [
  { 
    id: 1, 
    author: '学习者小李', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp1', 
    location: '上海', 
    content: '请问学Python需要先学什么数学基础吗？我高中数学不太好，会不会影响学习？', 
    likes: 45, 
    dislikes: 2, 
    comments: 8, 
    shares: 12, 
    bookmarks: 23 
  },
  // ... 更多补充问题
];
```

#### UI展示
- 位置: "补充 (4)" 标签页下
- 每个补充问题显示为一个卡片
- 卡片包含:
  - 作者头像、姓名、位置
  - 补充问题内容
  - 互动按钮(点赞、回答、收藏、分享、评论、群聊)
  - 更多操作按钮

#### 点击跳转
```javascript
<TouchableOpacity 
  key={item.id} 
  style={styles.suppCard}
  onPress={() => navigation.navigate('SupplementDetail', { supplement: item })}
  activeOpacity={0.7}
>
  {/* 补充问题卡片内容 */}
</TouchableOpacity>
```

### 2. 补充问题详情页 (SupplementDetailScreen.js)

#### 接收数据
```javascript
const supplementQuestion = route?.params?.supplement || {
  id: 1,
  author: '学习者小李',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp1',
  location: '上海',
  content: '请问学Python需要先学什么数学基础吗?我高中数学不太好,会不会影响学习?',
  likes: 45,
  bookmarks: 23,
  comments: 8,
  time: '1小时前'
};
```

#### 页面结构
1. **顶部导航栏**
   - 返回按钮
   - 标题: "补充问题详情"
   - 分享和举报按钮

2. **补充问题详情区域**
   - 作者信息(头像、姓名、位置)
   - 补充问题内容
   - 浏览量
   - 互动按钮(点赞、踩、分享、收藏、举报)

3. **原问题引用**
   - 显示原问题的标题和作者
   - 可点击跳转回原问题

4. **四个圆形按钮**
   - 邀请回答
   - 群聊
   - 团队
   - 活动

5. **三个Tab标签**
   - 全部回答
   - 补充回答
   - 全部评论

6. **筛选条**
   - 精选/最新切换

7. **内容列表**
   - 根据选中的Tab显示对应内容
   - 回答列表或评论列表

8. **底部固定栏**
   - 评论输入框
   - 回答按钮

#### 功能模块
- ✅ 点赞/踩功能
- ✅ 收藏功能
- ✅ 分享功能
- ✅ 举报功能
- ✅ 邀请回答(本站/推特/Facebook)
- ✅ 群聊功能
- ✅ 团队功能
- ✅ 活动功能
- ✅ 回答列表展示
- ✅ 评论列表展示
- ✅ 回复功能
- ✅ 更多操作菜单

## 导航配置

确保在 App.js 中已配置路由:

```javascript
<Stack.Screen 
  name="SupplementDetail" 
  component={SupplementDetailScreen} 
  options={{ headerShown: false }} 
/>
```

## 数据传递示例

### 从问题详情页跳转
```javascript
navigation.navigate('SupplementDetail', { 
  supplement: {
    id: 1,
    author: '学习者小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp1',
    location: '上海',
    content: '请问学Python需要先学什么数学基础吗？',
    likes: 45,
    dislikes: 2,
    comments: 8,
    shares: 12,
    bookmarks: 23
  }
});
```

### 在补充问题详情页接收
```javascript
const supplementQuestion = route?.params?.supplement;
```

## 样式特点

### 补充问题卡片样式
- 白色背景
- 底部边框分隔
- 点击时有透明度变化(activeOpacity={0.7})
- 包含完整的互动按钮组

### 补充问题详情页样式
- 顶部导航栏固定
- 内容区域可滚动
- 底部输入栏固定
- 使用模态框展示各种弹窗

## 注意事项

1. **数据完整性**: 确保传递的补充问题数据包含所有必要字段
2. **默认值**: SupplementDetailScreen 提供了默认数据,防止数据缺失
3. **事件冒泡**: 卡片内的按钮使用 `e.stopPropagation()` 防止触发卡片点击
4. **导航栈**: 从补充问题详情页可以返回到问题详情页

## 扩展功能

可以进一步添加:
- 补充问题的编辑功能
- 补充问题的删除功能
- 补充问题的置顶功能
- 补充问题的关闭功能
- 补充问题的最佳回答标记

## 测试建议

1. 测试从问题详情页点击不同的补充问题
2. 测试补充问题详情页的所有互动功能
3. 测试返回导航是否正常
4. 测试数据传递是否完整
5. 测试各种弹窗的打开和关闭
