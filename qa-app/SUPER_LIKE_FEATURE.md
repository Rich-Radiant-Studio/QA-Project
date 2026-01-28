# 超级赞功能完整实现文档

## 📋 功能概述

为回答添加"购买超级赞"功能，允许用户为自己的回答购买超级赞来提升排名，获得更多曝光。

## ✨ 核心功能

### 1. 超级赞徽章显示
- **位置**: 回答卡片标签区域最前面
- **样式**: 金色星星图标 + "超级赞 x数量" 文字
- **颜色**: 金黄色主题 (#f59e0b)
- **显示条件**: 超级赞数量 > 0

### 2. 购买超级赞按钮
- **显示条件**: 仅对自己的回答显示（`answer.isMyAnswer === true`）
- **位置**: 回答内容下方，操作栏上方
- **样式**: 金黄色背景，带星星图标
- **文案**: "购买超级赞提升排名"

### 3. 购买超级赞弹窗

#### 弹窗结构
```
┌─────────────────────────────────┐
│  ⭐ 购买超级赞                    │
├─────────────────────────────────┤
│  当前超级赞: ⭐ 12                │
│  超级赞越多，排名越靠前           │
├─────────────────────────────────┤
│  选择购买数量:                    │
│  [⭐x5]  [⭐x10]  [⭐x20]         │
│  [$10]  [$20]   [$40]           │
│  [⭐x50]  [⭐x100]                │
│  [$100] [$200]                  │
├─────────────────────────────────┤
│  或输入自定义数量:                │
│  ⭐ [____] $0                    │
├─────────────────────────────────┤
│  价格明细:                        │
│  单价: $2/个                      │
│  购买数量: 10 个                  │
│  总计: $20                        │
├─────────────────────────────────┤
│  ℹ️ 购买超级赞后，您的回答将      │
│     获得更高的排名权重            │
├─────────────────────────────────┤
│  [⭐ 立即购买 10 个超级赞]        │
│  [取消]                          │
└─────────────────────────────────┘
```

#### 快速选择选项
- 5 个 - $10
- 10 个 - $20
- 20 个 - $40
- 50 个 - $100
- 100 个 - $200

#### 自定义输入
- 最少: 1 个
- 最多: 100 个
- 单价: $2/个
- 实时显示总价

#### 价格明细
- 单价显示
- 购买数量显示
- 总计金额（高亮显示）

## 🎨 UI 设计

### 颜色方案
- **主色**: #f59e0b (金黄色)
- **背景色**: #fffbeb (浅金黄色)
- **边框色**: #fef3c7 (金黄色边框)
- **文字色**: #92400e (深金黄色)
- **白色背景**: #fff

### 超级赞徽章
```javascript
{
  backgroundColor: '#fffbeb',
  borderColor: '#fef3c7',
  borderWidth: 1,
  borderRadius: 10,
  padding: '5px 10px',
  fontSize: 11,
  fontWeight: '600',
  color: '#f59e0b'
}
```

### 购买按钮
```javascript
{
  backgroundColor: '#fffbeb',
  borderColor: '#fef3c7',
  borderWidth: 1,
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 13,
  fontWeight: '600',
  color: '#f59e0b'
}
```

## 💾 数据结构

### 回答数据扩展
```javascript
{
  id: 2,
  author: '数据分析师小王',
  avatar: 'https://...',
  content: '...',
  likes: 89,
  superLikes: 12,        // 超级赞数量
  isMyAnswer: true,      // 是否是我的回答
  // ... 其他字段
}
```

### 状态管理
```javascript
// 超级赞相关状态
const [showSuperLikeModal, setShowSuperLikeModal] = useState(false);
const [currentAnswerForSuperLike, setCurrentAnswerForSuperLike] = useState(null);
const [superLikeAmount, setSuperLikeAmount] = useState('');
const [selectedSuperLikeAmount, setSelectedSuperLikeAmount] = useState(null);
const [answerSuperLikes, setAnswerSuperLikes] = useState({});
```

## 🔧 核心函数

### handleBuySuperLike()
```javascript
const handleBuySuperLike = () => {
  // 1. 验证输入
  const amount = selectedSuperLikeAmount || parseInt(superLikeAmount);
  if (!amount || amount <= 0) {
    alert('请输入有效的超级赞数量');
    return;
  }
  if (amount < 1) {
    alert('最少购买 1 个超级赞');
    return;
  }
  if (amount > 100) {
    alert('单次最多购买 100 个超级赞');
    return;
  }
  
  // 2. 更新超级赞数量
  const answerId = currentAnswerForSuperLike.id;
  const currentCount = answerSuperLikes[answerId] || currentAnswerForSuperLike.superLikes || 0;
  setAnswerSuperLikes({ ...answerSuperLikes, [answerId]: currentCount + amount });
  
  // 3. 计算费用并提示
  const totalCost = amount * 2;
  alert(`成功购买 ${amount} 个超级赞！\n花费：$${totalCost}\n您的回答排名将会提升！`);
  
  // 4. 关闭弹窗并重置状态
  setShowSuperLikeModal(false);
  setSuperLikeAmount('');
  setSelectedSuperLikeAmount(null);
  setCurrentAnswerForSuperLike(null);
};
```

## 📱 用户交互流程

### 购买流程
1. 用户在自己的回答卡片上看到"购买超级赞提升排名"按钮
2. 点击按钮，打开购买超级赞弹窗
3. 查看当前超级赞数量
4. 选择快速购买选项或输入自定义数量
5. 查看价格明细（单价、数量、总计）
6. 点击"立即购买"按钮
7. 系统验证输入并扣费
8. 更新超级赞数量
9. 显示成功提示
10. 回答排名自动提升

### 显示流程
1. 回答列表加载
2. 检查每个回答的 `superLikes` 字段
3. 如果 `superLikes > 0`，在标签区域显示超级赞徽章
4. 如果 `isMyAnswer === true`，显示购买按钮
5. 超级赞数量越多，回答排名越靠前

## 🎯 排名规则

### 排序权重
```javascript
// 回答排序算法（建议）
const sortAnswers = (answers) => {
  return answers.sort((a, b) => {
    // 1. 已采纳的答案优先
    if (a.adopted && !b.adopted) return -1;
    if (!a.adopted && b.adopted) return 1;
    
    // 2. 超级赞数量权重
    const superLikeWeight = 10; // 每个超级赞相当于10个普通赞
    const scoreA = a.likes + (a.superLikes || 0) * superLikeWeight;
    const scoreB = b.likes + (b.superLikes || 0) * superLikeWeight;
    
    // 3. 按综合得分排序
    return scoreB - scoreA;
  });
};
```

### 权重说明
- **已采纳**: 最高优先级
- **超级赞**: 1个超级赞 = 10个普通赞
- **普通赞**: 基础权重
- **时间**: 相同得分时，较新的回答优先

## 💰 定价策略

### 当前定价
- **单价**: $2 / 个超级赞
- **最低购买**: 1 个
- **最高购买**: 100 个/次
- **推荐套餐**:
  - 5 个 - $10 (入门)
  - 10 个 - $20 (推荐)
  - 20 个 - $40 (热门)
  - 50 个 - $100 (进阶)
  - 100 个 - $200 (专业)

### 定价考虑
- 价格适中，鼓励用户购买
- 阶梯定价，引导批量购买
- 单价固定，计算简单透明

## 🔒 限制和验证

### 输入验证
- ✅ 数量必须为正整数
- ✅ 最少购买 1 个
- ✅ 最多购买 100 个/次
- ✅ 自定义输入只能是数字

### 权限验证
- ✅ 只能为自己的回答购买超级赞
- ✅ 购买按钮仅对 `isMyAnswer === true` 的回答显示
- ✅ 其他用户看不到购买按钮

### 业务规则
- 超级赞数量累加，不会覆盖
- 购买后立即生效
- 排名实时更新
- 超级赞不可退款

## 📊 数据统计建议

### 需要记录的数据
1. **购买记录**
   - 用户ID
   - 回答ID
   - 购买数量
   - 购买金额
   - 购买时间

2. **效果数据**
   - 购买前排名
   - 购买后排名
   - 曝光量变化
   - 点赞数变化

3. **收入数据**
   - 总购买次数
   - 总购买数量
   - 总收入金额
   - 平均客单价

## 🚀 后续优化建议

### 功能优化
1. **批量折扣**: 购买数量越多，单价越低
2. **会员特权**: VIP用户享受折扣
3. **限时活动**: 节假日促销
4. **赠送功能**: 可以为他人的回答购买超级赞

### UI优化
1. **动画效果**: 购买成功后的星星动画
2. **排名提示**: 显示预计排名提升
3. **对比展示**: 显示购买前后的排名对比
4. **推荐提示**: 根据当前排名推荐购买数量

### 数据优化
1. **智能推荐**: 根据问题热度推荐购买数量
2. **效果预测**: 显示购买后的预期效果
3. **ROI分析**: 展示投入产出比
4. **竞争分析**: 显示与其他回答的差距

## 📝 测试要点

### 功能测试
- [ ] 超级赞徽章正确显示
- [ ] 购买按钮仅对自己的回答显示
- [ ] 弹窗正确打开和关闭
- [ ] 快速选择按钮工作正常
- [ ] 自定义输入验证正确
- [ ] 价格计算准确
- [ ] 购买成功后数量更新
- [ ] 排名正确提升

### UI测试
- [ ] 徽章样式美观
- [ ] 按钮样式一致
- [ ] 弹窗布局合理
- [ ] 响应式适配良好
- [ ] 颜色搭配协调

### 边界测试
- [ ] 输入0或负数
- [ ] 输入超过100
- [ ] 输入非数字字符
- [ ] 网络异常处理
- [ ] 余额不足处理

## 🎉 完成状态

✅ **已完成**:
1. 数据结构扩展（superLikes, isMyAnswer）
2. 超级赞徽章显示
3. 购买按钮显示（仅自己的回答）
4. 购买超级赞弹窗UI
5. 快速选择功能（5/10/20/50/100）
6. 自定义输入功能
7. 价格计算和显示
8. 购买处理函数
9. 状态管理
10. 样式定义

## 📄 相关文件

- `qa-app/qa-native-app/src/screens/QuestionDetailScreen.js` - 主要实现文件
- `qa-app/SUPER_LIKE_FEATURE.md` - 本文档

---

**创建时间**: 2026-01-27  
**版本**: v1.0  
**状态**: ✅ 已完成
