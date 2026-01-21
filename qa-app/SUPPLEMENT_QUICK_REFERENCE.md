# 补充问题功能 - 快速参考

## 🎯 核心实现 (3步完成)

### 1️⃣ 定义数据 (QuestionDetailScreen.js)
```javascript
const supplementQuestions = [
  { 
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
];
```

### 2️⃣ 渲染列表并添加点击跳转
```javascript
{supplementQuestions.map(item => (
  <TouchableOpacity 
    key={item.id}
    onPress={() => navigation.navigate('SupplementDetail', { supplement: item })}
  >
    {/* 补充问题卡片UI */}
  </TouchableOpacity>
))}
```

### 3️⃣ 接收数据并显示 (SupplementDetailScreen.js)
```javascript
export default function SupplementDetailScreen({ navigation, route }) {
  const supplementQuestion = route?.params?.supplement || defaultData;
  
  return (
    <SafeAreaView>
      <Text>{supplementQuestion.content}</Text>
      {/* 其他UI */}
    </SafeAreaView>
  );
}
```

## 📋 必需字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | number | 唯一标识 | 1 |
| author | string | 作者名 | '学习者小李' |
| avatar | string | 头像URL | 'https://...' |
| location | string | 位置 | '上海' |
| content | string | 补充问题内容 | '请问学Python...' |
| likes | number | 点赞数 | 45 |
| comments | number | 评论数 | 8 |
| bookmarks | number | 收藏数 | 23 |

## 🔗 路由配置 (App.js)

```javascript
// 1. 导入
import SupplementDetailScreen from './src/screens/SupplementDetailScreen';

// 2. 配置路由
<Stack.Screen name="SupplementDetail" component={SupplementDetailScreen} />
```

## ⚡ 常见问题

### Q: 点击补充问题没有反应?
**A:** 检查路由是否配置,确保 App.js 中已添加 SupplementDetail 路由

### Q: 详情页显示空白?
**A:** 检查数据传递是否正确,确保 `route?.params?.supplement` 有值

### Q: 卡片内按钮点击会跳转?
**A:** 按钮需要添加 `e.stopPropagation()` 阻止事件冒泡

### Q: 如何添加更多字段?
**A:** 在数据对象中添加字段,然后在详情页中使用即可

## 🎨 样式参考

```javascript
// 补充问题卡片样式
suppCard: { 
  padding: 16, 
  borderBottomWidth: 1, 
  borderBottomColor: '#f3f4f6' 
}

// 补充问题内容样式
suppContent: { 
  fontSize: 15, 
  color: '#1f2937', 
  lineHeight: 22 
}
```

## 🔄 完整流程图

```
用户点击补充问题
    ↓
navigation.navigate('SupplementDetail', { supplement: item })
    ↓
SupplementDetailScreen 接收 route.params.supplement
    ↓
显示补充问题详情页
```

## ✅ 验证清单

- [ ] 数据结构完整
- [ ] 点击能跳转
- [ ] 详情页能显示
- [ ] 返回按钮正常
- [ ] 所有字段正确显示
- [ ] 路由已配置

## 📞 相关文件

- `qa-app/qa-native-app/src/screens/QuestionDetailScreen.js` - 问题详情页
- `qa-app/qa-native-app/src/screens/SupplementDetailScreen.js` - 补充问题详情页
- `qa-app/qa-native-app/App.js` - 路由配置
- `qa-app/SUPPLEMENT_QUESTION_FLOW.md` - 详细文档
- `qa-app/SUPPLEMENT_QUESTION_VISUAL_GUIDE.md` - 可视化指南
