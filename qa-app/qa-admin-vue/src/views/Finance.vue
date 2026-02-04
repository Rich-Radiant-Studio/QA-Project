<template>
  <div>
    <!-- 财务统计 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div class="text-sm opacity-80">平台总收入</div>
        <div class="text-3xl font-bold mt-2">$1,256,890</div>
        <div class="text-sm mt-2 opacity-80"><i class="fas fa-arrow-up"></i> 12.5% 较上月</div>
      </div>
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="text-sm opacity-80">悬赏总额</div>
        <div class="text-3xl font-bold mt-2">$568,900</div>
        <div class="text-sm mt-2 opacity-80"><i class="fas fa-arrow-up"></i> 8.3% 较上月</div>
      </div>
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div class="text-sm opacity-80">待提现</div>
        <div class="text-3xl font-bold mt-2">$89,560</div>
        <div class="text-sm mt-2 opacity-80">12 笔待处理</div>
      </div>
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div class="text-sm opacity-80">今日交易</div>
        <div class="text-3xl font-bold mt-2">$12,580</div>
        <div class="text-sm mt-2 opacity-80">256 笔交易</div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <el-tabs v-model="activeTab" class="px-4">
        <el-tab-pane label="提现申请" name="withdraw" />
        <el-tab-pane label="充值记录" name="recharge" />
        <el-tab-pane label="悬赏流水" name="reward" />
        <el-tab-pane label="结算记录" name="settle" />
      </el-tabs>

      <div v-if="activeTab === 'withdraw'">
        <div class="p-4 flex items-center justify-between">
          <el-select v-model="statusFilter" placeholder="全部状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
          <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
        </div>

        <el-table :data="withdrawals" style="width: 100%">
          <el-table-column label="申请人" width="180">
            <template #default="{ row }">
              <div class="flex items-center">
                <img :src="row.avatar" class="w-8 h-8 rounded-full">
                <div class="ml-2">
                  <div class="font-medium text-sm">{{ row.name }}</div>
                  <div class="text-xs text-gray-400">ID: {{ row.userId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="提现金额" width="120">
            <template #default="{ row }"><span class="font-bold text-green-500">{{ row.amount }}</span></template>
          </el-table-column>
          <el-table-column prop="method" label="提现方式" width="100" />
          <el-table-column prop="account" label="账户信息" width="180" />
          <el-table-column prop="applyTime" label="申请时间" width="160" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <span :class="['status-badge', `status-${row.status}`]">{{ statusText[row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <template v-if="row.status === 'pending'">
                <el-button type="success" size="small">通过</el-button>
                <el-button type="danger" size="small">拒绝</el-button>
              </template>
              <el-button v-else link type="primary" size="small">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="p-4 flex items-center justify-between border-t border-gray-100">
          <span class="text-sm text-gray-500">共 156 条记录</span>
          <el-pagination layout="prev, pager, next" :total="100" />
        </div>
      </div>

      <div v-else class="p-8 text-center text-gray-500">
        <i :class="[tabIcons[activeTab], 'text-4xl mb-4']"></i>
        <p>{{ tabPlaceholders[activeTab] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('withdraw')
const statusFilter = ref('')
const statusText = { pending: '待处理', approved: '已通过', rejected: '已拒绝' }
const tabIcons = { recharge: 'fas fa-credit-card', reward: 'fas fa-coins', settle: 'fas fa-file-invoice-dollar' }
const tabPlaceholders = { recharge: '充值记录列表', reward: '悬赏流水记录', settle: '结算记录列表' }

const withdrawals = ref([
  { userId: '12345678', name: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', amount: '$500.00', method: '银行卡', account: '招商银行 **** 8888', applyTime: '2024-01-14 10:30', status: 'pending' },
  { userId: '12345680', name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', amount: '$1,200.00', method: '支付宝', account: '138****8888', applyTime: '2024-01-14 09:15', status: 'pending' },
  { userId: '12345682', name: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', amount: '$320.00', method: '微信', account: '微信号: foodie***', applyTime: '2024-01-13 18:45', status: 'approved' },
  { userId: '12345681', name: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', amount: '$50.00', method: '银行卡', account: '工商银行 **** 6666', applyTime: '2024-01-12 14:20', status: 'rejected' },
])
</script>
