# 需求文档

## 简介

本文档定义了"超级赞积分系统"功能的需求。该功能将当前的"超级赞"从绑定特定回答的购买模式，重构为基于积分的通用系统，用户可以购买超级赞次数（积分），然后在任意回答上使用这些积分。

## 术语表

- **System**: 超级赞积分系统
- **User**: 使用应用的用户
- **Super_Like_Credit**: 超级赞次数/积分，用户购买后可用于任意回答
- **Answer**: 用户发布的回答
- **Purchase_Entry**: 购买入口，用户可以访问购买超级赞次数的界面
- **Credit_Balance**: 用户当前拥有的超级赞次数余额
- **Credit_Transaction**: 超级赞次数的交易记录（购买或使用）

## 需求

### 需求 1: 超级赞次数购买

**用户故事:** 作为用户，我想要购买超级赞次数，以便我可以在任意回答上使用它们来提升排名。

#### 验收标准

1. THE System SHALL 提供统一的购买入口，不绑定特定回答
2. WHEN 用户访问购买页面 THEN THE System SHALL 显示当前的超级赞次数余额
3. WHEN 用户选择购买数量 THEN THE System SHALL 显示对应的价格（每次 $2）
4. WHEN 用户完成购买 THEN THE System SHALL 增加用户的超级赞次数余额
5. WHEN 购买成功 THEN THE System SHALL 记录购买交易历史

### 需求 2: 超级赞次数使用

**用户故事:** 作为用户，我想要在任意回答上使用我的超级赞次数，以便提升该回答的排名。

#### 验收标准

1. WHEN 用户在回答上点击使用超级赞 THEN THE System SHALL 检查用户的超级赞次数余额
2. IF 用户超级赞次数余额大于 0 THEN THE System SHALL 允许用户使用超级赞
3. IF 用户超级赞次数余额等于 0 THEN THE System SHALL 提示用户购买超级赞次数
4. WHEN 用户使用超级赞 THEN THE System SHALL 减少用户的超级赞次数余额 1 次
5. WHEN 用户使用超级赞 THEN THE System SHALL 增加该回答的超级赞计数
6. WHEN 用户使用超级赞 THEN THE System SHALL 记录使用交易历史

### 需求 3: 余额显示

**用户故事:** 作为用户，我想要随时查看我的超级赞次数余额，以便我知道还有多少次可用。

#### 验收标准

1. WHEN 用户访问个人中心 THEN THE System SHALL 显示当前的超级赞次数余额
2. WHEN 用户访问购买页面 THEN THE System SHALL 显示当前的超级赞次数余额
3. WHEN 用户在回答页面 THEN THE System SHALL 在使用超级赞按钮附近显示当前余额
4. WHEN 用户的超级赞次数余额变化 THEN THE System SHALL 实时更新显示的余额

### 需求 4: 购买入口调整

**用户故事:** 作为用户，我想要从多个位置访问购买超级赞次数的功能，以便我可以方便地充值。

#### 验收标准

1. THE System SHALL 在个人中心提供购买超级赞次数的入口
2. WHEN 用户尝试使用超级赞但余额为 0 THEN THE System SHALL 显示购买提示并提供快速购买入口
3. THE System SHALL 在设置页面提供购买超级赞次数的入口
4. WHEN 用户访问任何购买入口 THEN THE System SHALL 导航到统一的购买页面

### 需求 5: 交易历史

**用户故事:** 作为用户，我想要查看我的超级赞次数交易历史，以便我可以追踪我的购买和使用记录。

#### 验收标准

1. THE System SHALL 记录所有超级赞次数的购买交易
2. THE System SHALL 记录所有超级赞次数的使用交易
3. WHEN 用户访问交易历史页面 THEN THE System SHALL 显示所有交易记录
4. WHEN 显示交易记录 THEN THE System SHALL 包含交易类型（购买/使用）、数量、时间和相关回答（如果是使用）
5. WHEN 显示交易记录 THEN THE System SHALL 按时间倒序排列

### 需求 6: 数据持久化

**用户故事:** 作为用户，我想要我的超级赞次数余额和交易历史被持久化存储，以便我在重新打开应用后仍然可以看到我的数据。

#### 验收标准

1. WHEN 用户购买超级赞次数 THEN THE System SHALL 将余额保存到本地存储
2. WHEN 用户使用超级赞次数 THEN THE System SHALL 将余额保存到本地存储
3. WHEN 用户打开应用 THEN THE System SHALL 从本地存储加载超级赞次数余额
4. WHEN 用户打开应用 THEN THE System SHALL 从本地存储加载交易历史
5. THE System SHALL 使用 AsyncStorage 进行本地数据持久化

### 需求 7: 国际化支持

**用户故事:** 作为用户，我想要超级赞积分系统支持多语言，以便我可以使用我熟悉的语言。

#### 验收标准

1. THE System SHALL 使用 i18n 库进行文本国际化
2. THE System SHALL 支持中文和英文界面
3. WHEN 用户切换语言 THEN THE System SHALL 更新所有超级赞相关的文本
4. THE System SHALL 为所有用户可见的文本提供翻译键

### 需求 8: 向后兼容

**用户故事:** 作为开发者，我想要确保新系统与现有数据兼容，以便现有用户的超级赞数据不会丢失。

#### 验收标准

1. WHEN 系统升级 THEN THE System SHALL 迁移现有的回答超级赞数据
2. WHEN 系统升级 THEN THE System SHALL 保留所有回答的超级赞计数
3. THE System SHALL 移除旧的购买页面（BuySuperLikeScreen）
4. THE System SHALL 移除回答详情页面中绑定特定回答的购买按钮
5. THE System SHALL 更新所有导航引用指向新的购买页面
