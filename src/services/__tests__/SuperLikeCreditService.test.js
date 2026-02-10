/**
 * SuperLikeCreditService Unit Tests
 * 测试超级赞积分服务的核心功能
 */

import superLikeCreditService, { SuperLikeCreditService, PRICE_PER_CREDIT } from '../SuperLikeCreditService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as fc from 'fast-check';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('SuperLikeCreditService', () => {
  let service;

  beforeEach(async () => {
    // 清除所有 mock
    jest.clearAllMocks();
    
    // 创建新的服务实例用于测试
    service = new SuperLikeCreditService();
    
    // 默认返回值
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);
    AsyncStorage.multiSet.mockResolvedValue(undefined);
    AsyncStorage.multiRemove.mockResolvedValue(undefined);
  });

  describe('initialize', () => {
    it('should initialize successfully and set migration flag', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null); // migration flag
      AsyncStorage.getItem.mockResolvedValueOnce(null); // balance
      
      await service.initialize();
      
      expect(service.initialized).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should skip migration if already migrated', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('true'); // migration flag
      AsyncStorage.getItem.mockResolvedValueOnce('10'); // balance
      
      await service.initialize();
      
      expect(service.initialized).toBe(true);
    });
  });

  describe('getBalance', () => {
    it('should return 0 for first time use', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const balance = await service.getBalance();
      
      expect(balance).toBe(0);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_balance', '0');
    });

    it('should return stored balance', async () => {
      AsyncStorage.getItem.mockResolvedValue('50');
      
      const balance = await service.getBalance();
      
      expect(balance).toBe(50);
    });

    it('should use cache on subsequent calls', async () => {
      AsyncStorage.getItem.mockResolvedValue('30');
      
      const balance1 = await service.getBalance();
      const balance2 = await service.getBalance();
      
      expect(balance1).toBe(30);
      expect(balance2).toBe(30);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should reset invalid balance to 0', async () => {
      AsyncStorage.getItem.mockResolvedValue('invalid');
      
      const balance = await service.getBalance();
      
      expect(balance).toBe(0);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_balance', '0');
    });

    it('should reset negative balance to 0', async () => {
      AsyncStorage.getItem.mockResolvedValue('-10');
      
      const balance = await service.getBalance();
      
      expect(balance).toBe(0);
    });
  });

  describe('purchase', () => {
    beforeEach(() => {
      AsyncStorage.getItem.mockResolvedValue('10'); // initial balance
      AsyncStorage.multiSet.mockResolvedValue(undefined);
    });

    it('should successfully purchase credits', async () => {
      const result = await service.purchase(5);
      
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(15);
      expect(result.transaction).toBeDefined();
      expect(result.transaction.type).toBe('purchase');
      expect(result.transaction.amount).toBe(5);
    });

    it('should reject purchase with amount less than 1', async () => {
      const result = await service.purchase(0);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('请输入有效的购买数量');
    });

    it('should reject purchase with amount greater than 100', async () => {
      const result = await service.purchase(101);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('请输入有效的购买数量');
    });

    it('should reject purchase with non-integer amount', async () => {
      const result = await service.purchase(5.5);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('请输入有效的购买数量');
    });

    it('should handle storage failure gracefully', async () => {
      AsyncStorage.multiSet.mockRejectedValue(new Error('Storage error'));
      
      const result = await service.purchase(5);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('购买失败');
    });

    it('should create transaction record with correct fields', async () => {
      const result = await service.purchase(10);
      
      expect(result.transaction).toMatchObject({
        type: 'purchase',
        amount: 10,
      });
      expect(result.transaction.id).toBeDefined();
      expect(result.transaction.timestamp).toBeDefined();
    });
  });

  describe('use', () => {
    beforeEach(() => {
      AsyncStorage.getItem.mockResolvedValue('5'); // initial balance
      AsyncStorage.multiSet.mockResolvedValue(undefined);
    });

    it('should successfully use a credit', async () => {
      const result = await service.use('answer123', 'Test Answer');
      
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(4);
      expect(result.transaction).toBeDefined();
      expect(result.transaction.type).toBe('use');
      expect(result.transaction.amount).toBe(1);
      expect(result.transaction.answerId).toBe('answer123');
      expect(result.transaction.answerTitle).toBe('Test Answer');
    });

    it('should reject use when balance is 0', async () => {
      AsyncStorage.getItem.mockResolvedValue('0');
      
      const result = await service.use('answer123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('超级赞次数不足');
      expect(result.insufficientBalance).toBe(true);
    });

    it('should reject use with invalid answerId', async () => {
      const result = await service.use('');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('无效的回答ID');
    });

    it('should handle storage failure gracefully', async () => {
      AsyncStorage.multiSet.mockRejectedValue(new Error('Storage error'));
      
      const result = await service.use('answer123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('使用失败');
    });

    it('should work without answerTitle', async () => {
      const result = await service.use('answer123');
      
      expect(result.success).toBe(true);
      expect(result.transaction.answerTitle).toBe('');
    });
  });

  describe('getHistory', () => {
    it('should return empty array for first time use', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const history = await service.getHistory();
      
      expect(history).toEqual([]);
    });

    it('should return transaction history sorted by timestamp', async () => {
      const mockHistory = [
        { id: '1', type: 'purchase', amount: 5, timestamp: 1000 },
        { id: '2', type: 'use', amount: 1, timestamp: 3000 },
        { id: '3', type: 'purchase', amount: 10, timestamp: 2000 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockHistory));
      
      const history = await service.getHistory();
      
      expect(history).toHaveLength(3);
      expect(history[0].timestamp).toBe(3000); // Most recent first
      expect(history[1].timestamp).toBe(2000);
      expect(history[2].timestamp).toBe(1000);
    });

    it('should handle corrupted data gracefully', async () => {
      AsyncStorage.getItem.mockResolvedValue('invalid json');
      
      const history = await service.getHistory();
      
      expect(history).toEqual([]);
    });

    it('should reset invalid history data', async () => {
      AsyncStorage.getItem.mockResolvedValue('{"not": "array"}');
      
      const history = await service.getHistory();
      
      expect(history).toEqual([]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_transactions', '[]');
    });
  });

  describe('calculatePrice', () => {
    it('should calculate correct price', () => {
      expect(service.calculatePrice(1)).toBe(2);
      expect(service.calculatePrice(5)).toBe(10);
      expect(service.calculatePrice(10)).toBe(20);
      expect(service.calculatePrice(100)).toBe(200);
    });

    it('should return 0 for invalid amounts', () => {
      expect(service.calculatePrice(-1)).toBe(0);
      expect(service.calculatePrice(0)).toBe(0);
      expect(service.calculatePrice(1.5)).toBe(0);
    });
  });

  describe('migrateOldData', () => {
    it('should initialize balance and history if not exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      await service.migrateOldData();
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_balance', '0');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_transactions', '[]');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_migrated', 'true');
    });

    it('should skip migration if already migrated', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('true'); // migration flag
      
      await service.migrateOldData();
      
      // Should only check migration flag, not set anything
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should preserve existing balance', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce(null) // migration flag
        .mockResolvedValueOnce('50'); // existing balance
      
      await service.migrateOldData();
      
      // Should not overwrite existing balance
      expect(AsyncStorage.setItem).not.toHaveBeenCalledWith('@superlike_balance', '0');
    });
  });

  describe('integration scenarios', () => {
    it('should maintain balance consistency through multiple operations', async () => {
      // Start with 0 balance
      AsyncStorage.getItem.mockResolvedValue('0');
      let balance = await service.getBalance();
      expect(balance).toBe(0);

      // Purchase 10 credits
      AsyncStorage.getItem.mockResolvedValue('0');
      AsyncStorage.multiSet.mockResolvedValue(undefined);
      let result = await service.purchase(10);
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(10);

      // Use 1 credit
      service.balanceCache = 10; // Simulate cache update
      AsyncStorage.getItem.mockResolvedValue('10');
      result = await service.use('answer1', 'Answer 1');
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(9);

      // Use another credit
      service.balanceCache = 9;
      AsyncStorage.getItem.mockResolvedValue('9');
      result = await service.use('answer2', 'Answer 2');
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(8);
    });
  });

  // Task 1.5: Additional Unit Tests for Boundary Cases and Error Handling
  describe('Boundary Cases - Task 1.5', () => {
    describe('Balance at zero', () => {
      it('should prevent using super like when balance is exactly 0', async () => {
        AsyncStorage.getItem.mockResolvedValue('0');
        
        const result = await service.use('answer123', 'Test Answer');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('超级赞次数不足');
        expect(result.insufficientBalance).toBe(true);
        expect(result.newBalance).toBe(0);
      });

      it('should allow purchasing when balance is 0', async () => {
        AsyncStorage.getItem.mockResolvedValue('0');
        AsyncStorage.multiSet.mockResolvedValue(undefined);
        
        const result = await service.purchase(5);
        
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(5);
      });

      it('should correctly transition from 1 to 0 balance', async () => {
        AsyncStorage.getItem.mockResolvedValue('1');
        AsyncStorage.multiSet.mockResolvedValue(undefined);
        
        const result = await service.use('answer123', 'Test Answer');
        
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(0);
      });

      it('should prevent using when balance becomes 0 after use', async () => {
        // First use: balance 1 -> 0
        service.balanceCache = null;
        AsyncStorage.getItem.mockResolvedValue('1');
        AsyncStorage.multiSet.mockResolvedValue(undefined);
        
        let result = await service.use('answer1', 'Answer 1');
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(0);
        
        // Second use: balance 0 -> should fail
        service.balanceCache = 0;
        AsyncStorage.getItem.mockResolvedValue('0');
        
        result = await service.use('answer2', 'Answer 2');
        expect(result.success).toBe(false);
        expect(result.insufficientBalance).toBe(true);
      });
    });

    describe('Invalid purchase amounts', () => {
      beforeEach(() => {
        AsyncStorage.getItem.mockResolvedValue('10');
      });

      it('should reject purchase with amount 0', async () => {
        const result = await service.purchase(0);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
        expect(result.error).toContain('1-100');
      });

      it('should reject purchase with negative amount', async () => {
        const result = await service.purchase(-5);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
      });

      it('should reject purchase with amount 101 (exceeds max)', async () => {
        const result = await service.purchase(101);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
      });

      it('should reject purchase with decimal amount', async () => {
        const result = await service.purchase(10.5);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
      });

      it('should reject purchase with NaN', async () => {
        const result = await service.purchase(NaN);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
      });

      it('should reject purchase with null', async () => {
        const result = await service.purchase(null);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
      });

      it('should reject purchase with undefined', async () => {
        const result = await service.purchase(undefined);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('请输入有效的购买数量');
      });

      it('should accept minimum valid amount (1)', async () => {
        AsyncStorage.multiSet.mockResolvedValue(undefined);
        
        const result = await service.purchase(1);
        
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(11);
      });

      it('should accept maximum valid amount (100)', async () => {
        AsyncStorage.multiSet.mockResolvedValue(undefined);
        
        const result = await service.purchase(100);
        
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(110);
      });
    });

    describe('Edge cases for use', () => {
      it('should reject use with null answerId', async () => {
        AsyncStorage.getItem.mockResolvedValue('5');
        
        const result = await service.use(null);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('无效的回答ID');
      });

      it('should reject use with undefined answerId', async () => {
        AsyncStorage.getItem.mockResolvedValue('5');
        
        const result = await service.use(undefined);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('无效的回答ID');
      });

      it('should reject use with empty string answerId', async () => {
        AsyncStorage.getItem.mockResolvedValue('5');
        
        const result = await service.use('');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('无效的回答ID');
      });

      it('should reject use with non-string answerId', async () => {
        AsyncStorage.getItem.mockResolvedValue('5');
        
        const result = await service.use(123);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('无效的回答ID');
      });
    });
  });

  describe('Error Handling - Task 1.5', () => {
    describe('Storage failures', () => {
      it('should handle AsyncStorage.getItem failure in getBalance', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('Storage read error'));
        
        const balance = await service.getBalance();
        
        // Should return cached value or 0 instead of throwing
        expect(balance).toBe(0);
      });

      it('should handle AsyncStorage.multiSet failure in purchase', async () => {
        AsyncStorage.getItem.mockResolvedValue('10');
        AsyncStorage.multiSet.mockRejectedValue(new Error('Storage write error'));
        
        const result = await service.purchase(5);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('购买失败');
        expect(result.newBalance).toBe(10); // Should return original balance
      });

      it('should handle AsyncStorage.multiSet failure in use', async () => {
        AsyncStorage.getItem.mockResolvedValue('5');
        AsyncStorage.multiSet.mockRejectedValue(new Error('Storage write error'));
        
        const result = await service.use('answer123', 'Test Answer');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('使用失败');
        expect(result.newBalance).toBe(5); // Should return original balance
      });

      it('should handle AsyncStorage.getItem failure in getHistory', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('Storage read error'));
        
        const history = await service.getHistory();
        
        // Should return empty array instead of throwing
        expect(history).toEqual([]);
      });

      it('should handle AsyncStorage failure in initialize', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
        
        await expect(service.initialize()).rejects.toThrow();
      });

      it('should handle AsyncStorage failure in migrateOldData', async () => {
        AsyncStorage.getItem.mockResolvedValue(null);
        AsyncStorage.setItem.mockRejectedValue(new Error('Storage write error'));
        
        await expect(service.migrateOldData()).rejects.toThrow();
      });

      it('should not update cache when storage fails during purchase', async () => {
        service.balanceCache = 10;
        AsyncStorage.getItem.mockResolvedValue('10');
        AsyncStorage.multiSet.mockRejectedValue(new Error('Storage error'));
        
        await service.purchase(5);
        
        // Cache should remain unchanged
        expect(service.balanceCache).toBe(10);
      });

      it('should not update cache when storage fails during use', async () => {
        service.balanceCache = 5;
        AsyncStorage.getItem.mockResolvedValue('5');
        AsyncStorage.multiSet.mockRejectedValue(new Error('Storage error'));
        
        await service.use('answer123');
        
        // Cache should remain unchanged
        expect(service.balanceCache).toBe(5);
      });
    });

    describe('Data corruption', () => {
      it('should handle corrupted balance data (non-numeric string)', async () => {
        AsyncStorage.getItem.mockResolvedValue('corrupted_data');
        
        const balance = await service.getBalance();
        
        expect(balance).toBe(0);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_balance', '0');
      });

      it('should handle corrupted balance data (negative number)', async () => {
        AsyncStorage.getItem.mockResolvedValue('-100');
        
        const balance = await service.getBalance();
        
        expect(balance).toBe(0);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_balance', '0');
      });

      it('should handle corrupted balance data (special characters)', async () => {
        AsyncStorage.getItem.mockResolvedValue('###');
        
        const balance = await service.getBalance();
        
        expect(balance).toBe(0);
      });

      it('should handle corrupted transaction history (invalid JSON)', async () => {
        AsyncStorage.getItem.mockResolvedValue('{ invalid json }');
        
        const history = await service.getHistory();
        
        expect(history).toEqual([]);
      });

      it('should handle corrupted transaction history (not an array)', async () => {
        AsyncStorage.getItem.mockResolvedValue('{"type": "object"}');
        
        const history = await service.getHistory();
        
        expect(history).toEqual([]);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@superlike_transactions', '[]');
      });

      it('should handle corrupted transaction history (null value)', async () => {
        AsyncStorage.getItem.mockResolvedValue('null');
        
        const history = await service.getHistory();
        
        expect(history).toEqual([]);
      });

      it('should handle partially corrupted transaction records', async () => {
        const mixedHistory = [
          { id: '1', type: 'purchase', amount: 5, timestamp: 1000 },
          { corrupted: 'data' }, // Missing required fields
          { id: '2', type: 'use', amount: 1, timestamp: 2000 }
        ];
        AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mixedHistory));
        
        const history = await service.getHistory();
        
        // Should still return the array, even with corrupted records
        expect(Array.isArray(history)).toBe(true);
        expect(history.length).toBe(3);
      });

      it('should handle empty string as balance', async () => {
        AsyncStorage.getItem.mockResolvedValue('');
        
        const balance = await service.getBalance();
        
        expect(balance).toBe(0);
      });

      it('should handle whitespace as balance', async () => {
        AsyncStorage.getItem.mockResolvedValue('   ');
        
        const balance = await service.getBalance();
        
        expect(balance).toBe(0);
      });
    });

    describe('Concurrent operations', () => {
      it('should handle concurrent getBalance calls', async () => {
        AsyncStorage.getItem.mockResolvedValue('50');
        
        const [balance1, balance2, balance3] = await Promise.all([
          service.getBalance(),
          service.getBalance(),
          service.getBalance()
        ]);
        
        expect(balance1).toBe(50);
        expect(balance2).toBe(50);
        expect(balance3).toBe(50);
      });

      it('should handle concurrent purchase operations', async () => {
        service.balanceCache = null;
        AsyncStorage.getItem.mockResolvedValue('10');
        AsyncStorage.multiSet.mockResolvedValue(undefined);
        
        const results = await Promise.all([
          service.purchase(5),
          service.purchase(10),
          service.purchase(3)
        ]);
        
        // All should succeed (though in real scenario, race conditions might occur)
        results.forEach(result => {
          expect(result.success).toBe(true);
        });
      });
    });

    describe('Recovery from errors', () => {
      it('should recover from temporary storage failure', async () => {
        // First call fails
        AsyncStorage.getItem.mockRejectedValueOnce(new Error('Temporary error'));
        let balance = await service.getBalance();
        expect(balance).toBe(0);
        
        // Second call succeeds
        service.balanceCache = null;
        AsyncStorage.getItem.mockResolvedValueOnce('20');
        balance = await service.getBalance();
        expect(balance).toBe(20);
      });

      it('should maintain data integrity after failed purchase', async () => {
        AsyncStorage.getItem.mockResolvedValue('10');
        AsyncStorage.multiSet.mockRejectedValueOnce(new Error('Storage error'));
        
        // Failed purchase
        let result = await service.purchase(5);
        expect(result.success).toBe(false);
        
        // Successful purchase after recovery
        AsyncStorage.multiSet.mockResolvedValueOnce(undefined);
        result = await service.purchase(5);
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(15);
      });

      it('should maintain data integrity after failed use', async () => {
        AsyncStorage.getItem.mockResolvedValue('5');
        AsyncStorage.multiSet.mockRejectedValueOnce(new Error('Storage error'));
        
        // Failed use
        let result = await service.use('answer1');
        expect(result.success).toBe(false);
        
        // Successful use after recovery
        AsyncStorage.multiSet.mockResolvedValueOnce(undefined);
        result = await service.use('answer1');
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(4);
      });
    });
  });

  // Property-Based Tests
  describe('Property-Based Tests', () => {
    describe('Property 2: Purchase increases balance', () => {
      /**
       * **Validates: Requirements 1.4**
       * 
       * Property: For any purchase amount n (1 ≤ n ≤ 100) and current balance b,
       * the new balance after a successful purchase should equal b + n
       */
      it('should increase balance by purchase amount for any valid inputs', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer({ min: 0, max: 1000 }), // Initial balance
            fc.integer({ min: 1, max: 100 }),  // Purchase amount (valid range)
            async (initialBalance, purchaseAmount) => {
              // Setup: Mock initial balance
              service.balanceCache = null; // Clear cache
              AsyncStorage.getItem.mockResolvedValue(initialBalance.toString());
              AsyncStorage.multiSet.mockResolvedValue(undefined);

              // Execute: Purchase credits
              const result = await service.purchase(purchaseAmount);

              // Verify: Purchase should succeed and balance should increase correctly
              expect(result.success).toBe(true);
              expect(result.newBalance).toBe(initialBalance + purchaseAmount);
              expect(result.transaction).toBeDefined();
              expect(result.transaction.type).toBe('purchase');
              expect(result.transaction.amount).toBe(purchaseAmount);
            }
          ),
          { numRuns: 100 } // Run at least 100 iterations as specified
        );
      });
    });

    describe('Property 3: Use decreases balance', () => {
      /**
       * **Validates: Requirements 2.4**
       * 
       * Property: For any balance b > 0, using a super like should decrease
       * the balance by exactly 1, resulting in a new balance of b - 1
       */
      it('should decrease balance by 1 for any valid balance > 0', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer({ min: 1, max: 1000 }), // Initial balance (must be > 0)
            fc.string({ minLength: 1, maxLength: 50 }), // Answer ID
            fc.string({ maxLength: 100 }), // Answer title (optional)
            async (initialBalance, answerId, answerTitle) => {
              // Setup: Mock initial balance
              service.balanceCache = null; // Clear cache
              AsyncStorage.getItem.mockResolvedValue(initialBalance.toString());
              AsyncStorage.multiSet.mockResolvedValue(undefined);

              // Execute: Use a super like
              const result = await service.use(answerId, answerTitle);

              // Verify: Use should succeed and balance should decrease by 1
              expect(result.success).toBe(true);
              expect(result.newBalance).toBe(initialBalance - 1);
              expect(result.transaction).toBeDefined();
              expect(result.transaction.type).toBe('use');
              expect(result.transaction.amount).toBe(1);
              expect(result.transaction.answerId).toBe(answerId);
              expect(result.transaction.answerTitle).toBe(answerTitle);
            }
          ),
          { numRuns: 100 } // Run at least 100 iterations as specified
        );
      });
    });

    describe('Property 8: Data persistence round-trip', () => {
      /**
       * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
       * 
       * Property: For any balance value and transaction history, saving to AsyncStorage
       * and then loading should return the same values. This ensures data persistence
       * works correctly across app restarts.
       */
      it('should preserve balance and transaction history through save/load cycle', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer({ min: 0, max: 10000 }), // Balance value
            fc.array(
              fc.record({
                id: fc.string({ minLength: 5, maxLength: 20 }),
                type: fc.constantFrom('purchase', 'use'),
                amount: fc.integer({ min: 1, max: 100 }),
                timestamp: fc.integer({ min: 1000000000000, max: 9999999999999 }),
                answerId: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
                answerTitle: fc.option(fc.string({ maxLength: 100 }), { nil: undefined })
              }),
              { maxLength: 50 } // Limit transaction history size for performance
            ),
            async (balance, transactions) => {
              // Setup: Create a storage mock that actually stores data
              const storage = new Map();
              
              AsyncStorage.setItem.mockImplementation(async (key, value) => {
                storage.set(key, value);
              });
              
              AsyncStorage.getItem.mockImplementation(async (key) => {
                return storage.get(key) || null;
              });
              
              AsyncStorage.multiSet.mockImplementation(async (pairs) => {
                pairs.forEach(([key, value]) => {
                  storage.set(key, value);
                });
              });

              // Clear service cache to force reading from storage
              service.balanceCache = null;

              // Execute: Save balance
              await AsyncStorage.setItem('@superlike_balance', balance.toString());
              
              // Execute: Save transaction history
              await AsyncStorage.setItem('@superlike_transactions', JSON.stringify(transactions));

              // Execute: Load balance
              const loadedBalance = await service.getBalance();
              
              // Execute: Load transaction history
              const loadedHistory = await service.getHistory();

              // Verify: Balance should match
              expect(loadedBalance).toBe(balance);
              
              // Verify: Transaction history should match (sorted by timestamp descending)
              const expectedHistory = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
              expect(loadedHistory).toHaveLength(expectedHistory.length);
              
              // Verify each transaction matches
              loadedHistory.forEach((loadedTx, index) => {
                const expectedTx = expectedHistory[index];
                expect(loadedTx.id).toBe(expectedTx.id);
                expect(loadedTx.type).toBe(expectedTx.type);
                expect(loadedTx.amount).toBe(expectedTx.amount);
                expect(loadedTx.timestamp).toBe(expectedTx.timestamp);
                
                // answerId and answerTitle should match if they exist
                if (expectedTx.answerId !== undefined) {
                  expect(loadedTx.answerId).toBe(expectedTx.answerId);
                }
                if (expectedTx.answerTitle !== undefined) {
                  expect(loadedTx.answerTitle).toBe(expectedTx.answerTitle);
                }
              });
            }
          ),
          { numRuns: 100 } // Run at least 100 iterations as specified
        );
      });

      it('should handle edge cases: zero balance and empty history', async () => {
        // Setup: Create a storage mock
        const storage = new Map();
        
        AsyncStorage.setItem.mockImplementation(async (key, value) => {
          storage.set(key, value);
        });
        
        AsyncStorage.getItem.mockImplementation(async (key) => {
          return storage.get(key) || null;
        });

        service.balanceCache = null;

        // Execute: Save zero balance and empty history
        await AsyncStorage.setItem('@superlike_balance', '0');
        await AsyncStorage.setItem('@superlike_transactions', '[]');

        // Execute: Load data
        const loadedBalance = await service.getBalance();
        const loadedHistory = await service.getHistory();

        // Verify: Should handle edge cases correctly
        expect(loadedBalance).toBe(0);
        expect(loadedHistory).toEqual([]);
      });

      it('should handle large balance values', async () => {
        // Setup: Create a storage mock
        const storage = new Map();
        
        AsyncStorage.setItem.mockImplementation(async (key, value) => {
          storage.set(key, value);
        });
        
        AsyncStorage.getItem.mockImplementation(async (key) => {
          return storage.get(key) || null;
        });

        service.balanceCache = null;

        // Execute: Save large balance
        const largeBalance = 999999;
        await AsyncStorage.setItem('@superlike_balance', largeBalance.toString());

        // Execute: Load balance
        const loadedBalance = await service.getBalance();

        // Verify: Large balance should be preserved
        expect(loadedBalance).toBe(largeBalance);
      });
    });
  });
});
