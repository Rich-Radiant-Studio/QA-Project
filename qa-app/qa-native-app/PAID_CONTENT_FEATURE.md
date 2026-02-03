# 付费查看功能说明

## 功能概述

在首页问题列表中增加了付费查看功能，允许用户发布付费内容，其他用户需要支付一定金额才能查看完整内容。

## 功能特点

### 1. 付费问题标识

付费问题在标题前会显示一个橙色的"付费"标签：
- 背景色：橙色 (#f59e0b)
- 图标：锁图标
- 文字：白色"付费"文字

### 2. 付费查看按钮

未付费的用户会看到一个付费查看按钮，显示在问题标题和图片之间：

**按钮样式：**
- 背景色：浅黄色 (#fffbeb)
- 边框：虚线边框，黄色 (#fef3c7)
- 圆角：8px
- 内边距：16px 水平，12px 垂直

**按钮内容：**
- 左侧：锁图标 + "付费查看完整内容"文字
- 右侧：金额显示 + 右箭头图标
- 金额：橙色粗体显示（如 $9.9）

### 3. 数据结构

付费问题的数据结构：

```javascript
{
  id: 2,
  title: '问题标题',
  type: 'paid',           // 类型标记为 'paid'
  paidAmount: 9.9,        // 付费金额
  isPaid: false,          // 当前用户是否已付费
  // ... 其他字段
}
```

### 4. 交互逻辑

- **未付费状态**：显示付费查看按钮，点击后弹出支付提示
- **已付费状态**：不显示付费按钮，可以正常查看完整内容
- **点击事件**：使用 `e.stopPropagation()` 阻止事件冒泡，避免触发问题卡片的点击事件

## 使用场景

1. **知识付费**：专业人士分享高价值内容
2. **独家资讯**：提供独家信息或内幕消息
3. **深度教程**：详细的技术教程或学习资料
4. **咨询服务**：专业咨询和建议

## 测试数据

第二条问题数据已设置为付费内容：
- 标题：第一次养猫需要准备什么?有哪些新手容易踩的坑?
- 付费金额：$9.9
- 付费状态：未付费

## 样式说明

### 付费标签样式
```javascript
paidTagInline: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
  backgroundColor: '#f59e0b',
  paddingHorizontal: 4,
  paddingVertical: 1,
  borderRadius: 2,
  marginRight: 6,
  marginTop: 2
}
```

### 付费按钮样式
```javascript
paidViewButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fffbeb',
  borderWidth: 1,
  borderColor: '#fef3c7',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  marginBottom: 12,
  borderStyle: 'dashed'
}
```

## 后续扩展

可以进一步扩展的功能：
1. 集成真实的支付系统
2. 添加付费记录和订单管理
3. 支持不同的付费模式（单次付费、订阅制等）
4. 添加付费内容预览功能
5. 支持作者设置不同的价格档位
6. 添加退款机制
7. 统计付费转化率
