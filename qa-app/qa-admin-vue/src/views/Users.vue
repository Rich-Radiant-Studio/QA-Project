<template>
  <div>
    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="总用户" value="125,680" icon="fas fa-users" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="今日新增" value="+1,256" valueClass="text-green-500" icon="fas fa-user-plus" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="认证用户" value="3,450" valueClass="text-blue-500" icon="fas fa-user-check" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="封禁用户" value="156" valueClass="text-red-500" icon="fas fa-user-slash" iconBg="bg-red-100" iconColor="text-red-500" />
    </div>

    <!-- 用户列表 -->
    <div class="bg-white rounded-xl shadow-sm">
      <div class="p-4 flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索用户名、ID、手机号" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="statusFilter" placeholder="全部状态" clearable>
            <el-option label="正常" value="active" />
            <el-option label="已封禁" value="banned" />
            <el-option label="待审核" value="pending" />
          </el-select>
          <el-select v-model="verifiedFilter" placeholder="认证状态" clearable>
            <el-option label="已认证" value="verified" />
            <el-option label="未认证" value="unverified" />
          </el-select>
        </div>
        <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
      </div>

      <el-table :data="users" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.avatar" class="w-10 h-10 rounded-full">
              <div class="ml-3">
                <div class="flex items-center">
                  <span class="font-medium">{{ row.name }}</span>
                  <i v-if="row.verified" class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>
                </div>
                <div class="text-xs text-gray-400">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册时间" width="120" />
        <el-table-column label="提问/回答" width="100">
          <template #default="{ row }">{{ row.questions }} / {{ row.answers }}</template>
        </el-table-column>
        <el-table-column prop="balance" label="钱包余额" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', `status-${row.status}`]">{{ statusText[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small"><i class="fas fa-eye"></i></el-button>
            <el-button link type="warning" size="small"><i class="fas fa-ban"></i></el-button>
            <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 125,680 条记录</span>
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const searchQuery = ref('')
const statusFilter = ref('')
const verifiedFilter = ref('')
const statusText = { active: '正常', banned: '已封禁', pending: '待认证' }

const users = ref([
  { id: '12345678', name: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', verified: true, registerDate: '2024-01-15', questions: 56, answers: 234, balance: '$256.50', status: 'active' },
  { id: '12345679', name: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', verified: false, registerDate: '2024-01-10', questions: 23, answers: 89, balance: '$128.00', status: 'active' },
  { id: '12345680', name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', verified: true, registerDate: '2023-12-20', questions: 12, answers: 456, balance: '$1,250.00', status: 'active' },
  { id: '12345681', name: '违规用户001', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', verified: false, registerDate: '2024-01-05', questions: 5, answers: 12, balance: '$0.00', status: 'banned' },
  { id: '12345682', name: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', verified: false, registerDate: '2024-01-12', questions: 45, answers: 178, balance: '$520.00', status: 'pending' },
])
</script>
