/**
 * SuperLikeCreditService
 * 超级赞积分系统核心服务
 * 
 * 提供超级赞次数的购买、使用、余额查询和交易历史管理功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// 存储键常量
const STORAGE_KEYS = {
  BALANCE: '@superlike_balance',
  TRANSACTIONS: '@superlike_transactions',
  MIGRATION_FLAG: '@superlike_migrated'
};

// 价格常量
const PRICE_PER_CREDIT = 2; // 每次超级赞 $2

// 购买数量限制
const MIN_PURCHASE_AMOUNT = 1;
const MAX_PURCHASE_AMOUNT = 100;

/**
 * 生成唯一ID
 */
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * SuperLikeCreditService 类
 */
class SuperLikeCreditService {
  constructor() {
    this.balanceCache = null; // 内存缓存余额
    this.initialized = false;
  }

  /**
   * 初始化服务（应用启动时调用）
   */
  async initialize() {
    try {
      // 检查是否需要迁移
      const migrated = await AsyncStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG);
      if (!migrated) {
        await this.migrateOldData();
      }

      // 加载余额到缓存
      await this.getBalance();
      
      this.initialized = true;
      console.log('SuperLikeCreditService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SuperLikeCreditService:', error);
      throw error;
    }
  }

  /**
   * 获取当前余额
   * @returns {Promise<number>} 当前可用次数
   */
  async getBalance() {
    try {
      // 如果有缓存，直接返回
      if (this.balanceCache !== null) {
        return this.balanceCache;
      }

      // 从存储读取
      const balanceStr = await AsyncStorage.getItem(STORAGE_KEYS.BALANCE);
      
      if (balanceStr === null) {
        // 首次使用，初始化为0
        this.balanceCache = 0;
        await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, '0');
        return 0;
      }

      const balance = parseInt(balanceStr, 10);
      
      // 验证数据有效性
      if (isNaN(balance) || balance < 0) {
        console.error('Invalid balance data, resetting to 0');
        this.balanceCache = 0;
        await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, '0');
        return 0;
      }

      this.balanceCache = balance;
      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      // 发生错误时返回缓存值或0
      return this.balanceCache !== null ? this.balanceCache : 0;
    }
  }

  /**
   * 购买超级赞次数
   * @param {number} amount - 购买数量
   * @returns {Promise<PurchaseResult>} 购买结果
   */
  async purchase(amount) {
    try {
      // 验证购买数量
      if (!Number.isInteger(amount) || amount < MIN_PURCHASE_AMOUNT || amount > MAX_PURCHASE_AMOUNT) {
        return {
          success: false,
          error: `请输入有效的购买数量（${MIN_PURCHASE_AMOUNT}-${MAX_PURCHASE_AMOUNT}）`,
          newBalance: await this.getBalance()
        };
      }

      // 获取当前余额
      const currentBalance = await this.getBalance();
      const newBalance = currentBalance + amount;

      // 创建交易记录
      const transaction = {
        id: generateId(),
        type: 'purchase',
        amount: amount,
        timestamp: Date.now()
      };

      // 保存新余额和交易记录（事务性操作）
      try {
        await this._saveBalanceAndTransaction(newBalance, transaction);
        
        // 更新缓存
        this.balanceCache = newBalance;

        return {
          success: true,
          newBalance: newBalance,
          transaction: transaction
        };
      } catch (storageError) {
        console.error('Failed to save purchase:', storageError);
        return {
          success: false,
          error: '购买失败，请稍后重试',
          newBalance: currentBalance
        };
      }
    } catch (error) {
      console.error('Purchase error:', error);
      return {
        success: false,
        error: '购买失败，请稍后重试',
        newBalance: await this.getBalance()
      };
    }
  }

  /**
   * 使用超级赞
   * @param {string} answerId - 回答ID
   * @param {string} answerTitle - 回答标题（可选）
   * @returns {Promise<UseResult>} 使用结果
   */
  async use(answerId, answerTitle = '') {
    try {
      // 获取当前余额
      const currentBalance = await this.getBalance();

      // 检查余额是否充足
      if (currentBalance <= 0) {
        return {
          success: false,
          error: '超级赞次数不足，是否购买？',
          newBalance: 0,
          insufficientBalance: true
        };
      }

      // 验证answerId
      if (!answerId || typeof answerId !== 'string') {
        return {
          success: false,
          error: '无效的回答ID',
          newBalance: currentBalance
        };
      }

      const newBalance = currentBalance - 1;

      // 创建交易记录
      const transaction = {
        id: generateId(),
        type: 'use',
        amount: 1,
        timestamp: Date.now(),
        answerId: answerId,
        answerTitle: answerTitle
      };

      // 保存新余额和交易记录（事务性操作）
      try {
        await this._saveBalanceAndTransaction(newBalance, transaction);
        
        // 更新缓存
        this.balanceCache = newBalance;

        return {
          success: true,
          newBalance: newBalance,
          transaction: transaction
        };
      } catch (storageError) {
        console.error('Failed to save use:', storageError);
        return {
          success: false,
          error: '使用失败，请稍后重试',
          newBalance: currentBalance
        };
      }
    } catch (error) {
      console.error('Use error:', error);
      return {
        success: false,
        error: '使用失败，请稍后重试',
        newBalance: await this.getBalance()
      };
    }
  }

  /**
   * 获取交易历史
   * @returns {Promise<Transaction[]>} 交易记录数组（按时间倒序）
   */
  async getHistory() {
    try {
      const historyStr = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      
      if (historyStr === null) {
        return [];
      }

      const history = JSON.parse(historyStr);
      
      // 验证数据有效性
      if (!Array.isArray(history)) {
        console.error('Invalid history data, resetting to empty array');
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, '[]');
        return [];
      }

      // 按时间戳倒序排列（最新的在前）
      return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get history:', error);
      // 数据损坏时返回空数组
      return [];
    }
  }

  /**
   * 迁移旧数据（仅在升级时调用一次）
   */
  async migrateOldData() {
    try {
      console.log('Starting data migration...');
      
      // 检查是否已经迁移过
      const migrated = await AsyncStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG);
      if (migrated) {
        console.log('Data already migrated');
        return;
      }

      // 初始化余额为0（如果不存在）
      const existingBalance = await AsyncStorage.getItem(STORAGE_KEYS.BALANCE);
      if (existingBalance === null) {
        await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, '0');
      }

      // 初始化交易历史为空数组（如果不存在）
      const existingHistory = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (existingHistory === null) {
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, '[]');
      }

      // 设置迁移标志
      await AsyncStorage.setItem(STORAGE_KEYS.MIGRATION_FLAG, 'true');
      
      console.log('Data migration completed successfully');
    } catch (error) {
      console.error('Failed to migrate data:', error);
      throw error;
    }
  }

  /**
   * 保存余额和交易记录（内部方法，确保数据一致性）
   * @private
   */
  async _saveBalanceAndTransaction(newBalance, transaction) {
    try {
      // 获取当前交易历史
      const history = await this.getHistory();
      
      // 添加新交易记录
      history.unshift(transaction); // 添加到数组开头

      // 同时保存余额和交易历史
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.BALANCE, newBalance.toString()],
        [STORAGE_KEYS.TRANSACTIONS, JSON.stringify(history)]
      ]);
    } catch (error) {
      console.error('Failed to save balance and transaction:', error);
      throw error;
    }
  }

  /**
   * 计算购买价格
   * @param {number} amount - 购买数量
   * @returns {number} 总价格
   */
  calculatePrice(amount) {
    if (!Number.isInteger(amount) || amount < 0) {
      return 0;
    }
    return amount * PRICE_PER_CREDIT;
  }

  /**
   * 清空所有数据（仅用于测试）
   * @private
   */
  async _clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.BALANCE,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.MIGRATION_FLAG
      ]);
      this.balanceCache = null;
      this.initialized = false;
      console.log('All data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}

// 创建单例实例
const superLikeCreditService = new SuperLikeCreditService();

// 导出单例实例和类
export default superLikeCreditService;
export { SuperLikeCreditService, PRICE_PER_CREDIT };
