<template>
  <div>
    <div class="grid grid-cols-5 gap-4 mb-6">
      <StatCard title="问题总数" value="45,230" icon="fas fa-question" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="待审核" value="15" valueClass="text-yellow-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      <StatCard title="悬赏问题" value="8,560" valueClass="text-orange-500" icon="fas fa-coins" iconBg="bg-orange-100" iconColor="text-orange-500" />
      <StatCard title="已解决" value="35,480" valueClass="text-green-500" icon="fas fa-check" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="今日新增" value="568" valueClass="text-blue-500" icon="fas fa-plus" iconBg="bg-blue-100" iconColor="text-blue-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <el-tabs v-model="activeTab" class="px-4">
        <el-tab-pane label="全部问题" name="all" />
        <el-tab-pane label="待审核 (15)" name="pending" />
        <el-tab-pane label="悬赏问题" name="reward" />
        <el-tab-pane label="被举报" name="reported" />
      </el-tabs>

      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索问题标题、ID" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="typeFilter" placeholder="问题类型" clearable>
            <el-option label="公开" value="free" />
            <el-option label="悬赏" value="reward" />
            <el-option label="定向" value="targeted" />
          </el-select>
        </div>
        <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
      </div>

      <el-table :data="questions" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="问题信息" min-width="300">
          <template #default="{ row }">
            <div class="font-medium text-sm truncate">{{ row.title }}</div>
            <div class="text-xs text-gray-400 mt-1">ID: {{ row.id }} · {{ row.time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布者" width="150">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.avatar" class="w-8 h-8 rounded-full">
              <span class="ml-2 text-sm">{{ row.author }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <span :class="['px-2 py-1 text-xs rounded-full', row.typeClass]">{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="answerCount" label="回答数" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', `status-${row.status}`]">{{ statusText[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" link type="success" size="small"><i class="fas fa-check"></i></el-button>
            <el-button v-if="row.status === 'pending'" link type="danger" size="small"><i class="fas fa-times"></i></el-button>
            <el-button link type="primary" size="small"><i class="fas fa-eye"></i></el-button>
            <el-button link type="warning" size="small"><i class="fas fa-edit"></i></el-button>
            <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 45,230 条记录</span>
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const activeTab = ref('all')
const searchQuery = ref('')
const typeFilter = ref('')
const statusText = { approved: '已通过', pending: '待审核', rejected: '已拒绝' }

const questions = ref([
  { id: 'Q10001', title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', type: '悬赏 $50', typeClass: 'type-reward', answerCount: 56, status: 'approved', time: '2小时前' },
  { id: 'Q10002', title: '第一次养猫需要准备什么？有哪些新手容易踩的坑？', author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', type: '公开', typeClass: 'type-free', answerCount: 89, status: 'approved', time: '5小时前' },
  { id: 'Q10003', title: '长期失眠应该怎么调理？吃褪黑素有用吗？求专业医生解答', author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', type: '定向', typeClass: 'type-targeted', answerCount: 234, status: 'approved', time: '昨天' },
  { id: 'Q10004', title: '35岁程序员如何规划职业发展？是继续技术深耕还是转管理？', author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', type: '悬赏 $100', typeClass: 'type-reward', answerCount: 456, status: 'pending', time: '3小时前' },
])
</script>
