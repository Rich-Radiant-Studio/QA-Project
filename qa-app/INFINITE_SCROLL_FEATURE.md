# 无限滚动加载功能实现方案

## 功能需求

在问题详情页的四个列表标签页中实现无限滚动加载功能：
1. 补充列表
2. 回答列表
3. 评论列表
4. 邀请列表

## 交互流程

### 默认状态
- 显示前3-5条数据
- 显示推荐模块（如果有）
- 底部显示"查看更多XXX (N)"按钮

### 展开状态
- 点击"查看更多"按钮
- 隐藏推荐模块
- 显示所有已加载的数据
- 支持向上滚动加载更多数据
- 底部固定显示"收起"按钮

### 收起状态
- 点击"收起"按钮
- 恢复到默认状态
- 显示前3-5条数据
- 重新显示推荐模块

## 技术实现

### 1. 状态管理

需要为每个列表添加以下状态：

```javascript
// 补充列表
const [showAllSupplements, setShowAllSupplements] = useState(false);
const [supplementsPage, setSupplementsPage] = useState(1);
const [loadingSupplements, setLoadingSupplements] = useState(false);

// 回答列表
const [showAllAnswers, setShowAllAnswers] = useState(false);
const [answersPage, setAnswersPage] = useState(1);
const [loadingAnswers, setLoadingAnswers] = useState(false);

// 评论列表
const [showAllComments, setShowAllComments] = useState(false);
const [commentsPage, setCommentsPage] = useState(1);
const [loadingComments, setLoadingComments] = useState(false);

// 邀请列表
const [showAllInvited, setShowAllInvited] = useState(false);
const [invitedPage, setInvitedPage] = useState(1);
const [loadingInvited, setLoadingInvited] = useState(false);
```

### 2. 数据加载函数

```javascript
const loadMoreSupplements = () => {
  if (loadingSupplements) return;
  setLoadingSupplements(true);
  
  // 模拟API调用
  setTimeout(() => {
    // 添加新数据到列表
    setSupplementsPage(supplementsPage + 1);
    setLoadingSupplements(false);
  }, 1000);
};
```

### 3. ScrollView 配置

```javascript
<ScrollView
  onScroll={({nativeEvent}) => {
    if (showAllSupplements) {
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
      const paddingToBottom = 20;
      if (layoutMeasurement.height + contentOffset.y >= 
          contentSize.height - paddingToBottom) {
        loadMoreSupplements();
      }
    }
  }}
  scrollEventThrottle={400}
>
```

### 4. 按钮交互

```javascript
// 查看更多按钮
<TouchableOpacity 
  style={styles.loadMoreBtn}
  onPress={() => setShowAllSupplements(true)}
>
  <Text>查看更多补充 (N)</Text>
  <Ionicons name="chevron-down" size={16} color="#ef4444" />
</TouchableOpacity>

// 收起按钮（固定在底部）
{showAllSupplements && (
  <View style={styles.collapseButtonContainer}>
    <TouchableOpacity 
      style={styles.collapseBtn}
      onPress={() => {
        setShowAllSupplements(false);
        setSupplementsPage(1);
      }}
    >
      <Text>收起</Text>
      <Ionicons name="chevron-up" size={16} color="#ef4444" />
    </TouchableOpacity>
  </View>
)}
```

## 样式定义

```javascript
collapseButtonContainer: {
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderTopColor: '#f3f4f6',
  paddingVertical: 12,
  paddingHorizontal: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
},
collapseBtn: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  paddingVertical: 12,
  backgroundColor: '#fef2f2',
  borderRadius: 8,
},
```

## 实施步骤

1. ✅ 添加状态管理变量
2. ✅ 实现数据加载函数
3. ✅ 修改ScrollView添加滚动监听
4. ✅ 更新按钮交互逻辑
5. ✅ 添加加载指示器
6. ✅ 测试各个列表的展开/收起功能
7. ✅ 优化性能和用户体验

## 注意事项

1. 展开状态下隐藏推荐模块，避免干扰
2. 收起时重置页码，避免数据累积
3. 添加加载指示器，提升用户体验
4. 防止重复加载（loading状态控制）
5. 滚动到底部时自动加载下一页
6. 收起按钮需要固定在底部，不随内容滚动

## 预期效果

用户可以：
- 快速浏览前几条重要内容
- 需要时展开查看所有内容
- 无限滚动加载更多数据
- 随时收起回到简洁视图
- 在不同列表间切换时保持各自状态
