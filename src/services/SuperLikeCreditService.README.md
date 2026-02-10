# SuperLikeCreditService

超级赞积分系统核心服务

## 概述

SuperLikeCreditService 是超级赞积分系统的核心服务类，提供超级赞次数的购买、使用、余额查询和交易历史管理功能。

## 功能特性

### 1. 余额管理
- `getBalance()`: 获取当前超级赞次数余额
- 支持内存缓存，减少 AsyncStorage 读取
- 自动处理数据损坏和无效值

### 2. 购买功能
- `purchase(amount)`: 购买指定数量的超级赞次数
- 价格: 每次 $2 (PRICE_PER_CREDIT)
- 购买数量限制: 1-100
- 自动创建购买交易记录
- 事务性操作，确保数据一致性

### 3. 使用功能
- `use(answerId, answerTitle)`: 在指定回答上使用超级赞
- 自动检查余额是否充足
- 自动创建使用交易记录
- 事务性操作，确保数据一致性

### 4. 交易历史
- `getHistory()`: 获取所有交易记录
- 自动按时间倒序排列（最新的在前）
- 支持购买和使用两种交易类型

### 5. 数据持久化
- 使用 AsyncStorage 进行本地数据存储
- 存储键:
  - `@superlike_balance`: 余额
  - `@superlike_transactions`: 交易历史
  - `@superlike_migrated`: 迁移标志

### 6. 初始化和迁移
- `initialize()`: 应用启动时调用，初始化服务
- `migrateOldData()`: 数据迁移（仅在首次使用时执行）

### 7. 辅助功能
- `calculatePrice(amount)`: 计算购买价格
- `_saveBalanceAndTransaction()`: 内部方法，保存余额和交易记录
- `_clearAllData()`: 清空所有数据（仅用于测试）

## 使用示例

```javascript
import superLikeCreditService from './services/SuperLikeCreditService';

// 1. 应用启动时初始化
await superLikeCreditService.initialize();

// 2. 获取余额
const balance = await superLikeCreditService.getBalance();
console.log(`当前余额: ${balance}`);

// 3. 购买超级赞次数
const purchaseResult = await superLikeCreditService.purchase(10);
if (purchaseResult.success) {
  console.log(`购买成功！新余额: ${purchaseResult.newBalance}`);
} else {
  console.error(`购买失败: ${purchaseResult.error}`);
}

// 4. 使用超级赞
const useResult = await superLikeCreditService.use('answer123', '这是一个很棒的回答');
if (useResult.success) {
  console.log(`使用成功！剩余: ${useResult.newBalance}`);
} else {
  console.error(`使用失败: ${useResult.error}`);
}

// 5. 查看交易历史
const history = await superLikeCreditService.getHistory();
history.forEach(transaction => {
  console.log(`${transaction.type}: ${transaction.amount} 次 - ${new Date(transaction.timestamp).toLocaleString()}`);
});

// 6. 计算价格
const price = superLikeCreditService.calculatePrice(5);
console.log(`购买 5 次的价格: $${price}`);
```

## 数据结构

### PurchaseResult
```javascript
{
  success: boolean,
  newBalance: number,
  transaction: Transaction,
  error?: string
}
```

### UseResult
```javascript
{
  success: boolean,
  newBalance: number,
  transaction: Transaction,
  error?: string,
  insufficientBalance?: boolean
}
```

### Transaction
```javascript
{
  id: string,
  type: 'purchase' | 'use',
  amount: number,
  timestamp: number,
  answerId?: string,      // 仅在 type='use' 时存在
  answerTitle?: string    // 仅在 type='use' 时存在
}
```

## 错误处理

### 购买错误
- 无效数量 (< 1 或 > 100): 返回错误消息
- 存储失败: 回滚操作，返回错误消息

### 使用错误
- 余额不足: 返回 `insufficientBalance: true`
- 无效的 answerId: 返回错误消息
- 存储失败: 回滚操作，返回错误消息

### 数据加载错误
- 数据损坏: 使用默认值（余额=0，交易历史=[]）
- 存储不可用: 使用内存缓存

## 性能优化

1. **内存缓存**: 余额使用内存缓存，减少 AsyncStorage 读取
2. **事务性操作**: 使用 `multiSet` 同时保存余额和交易记录
3. **数据验证**: 自动验证和修复损坏的数据

## 测试

单元测试文件: `src/services/__tests__/SuperLikeCreditService.test.js`

测试覆盖:
- ✅ 初始化和迁移
- ✅ 余额查询和缓存
- ✅ 购买功能（有效和无效数量）
- ✅ 使用功能（余额充足和不足）
- ✅ 交易历史查询和排序
- ✅ 价格计算
- ✅ 错误处理
- ✅ 数据持久化

## 需求覆盖

该服务实现了以下需求:
- 需求 1.1, 1.2, 1.3, 1.4, 1.5: 超级赞次数购买
- 需求 2.1, 2.2, 2.3, 2.4, 2.5, 2.6: 超级赞次数使用
- 需求 5.1, 5.2, 5.3: 交易历史
- 需求 6.1, 6.2, 6.3, 6.4: 数据持久化

## 注意事项

1. 必须在应用启动时调用 `initialize()` 方法
2. 服务使用单例模式，导出的是实例而不是类
3. 所有方法都是异步的，需要使用 `await` 或 `.then()`
4. 余额和交易记录会自动同步保存，确保数据一致性
5. `_clearAllData()` 方法仅用于测试，不应在生产环境使用
