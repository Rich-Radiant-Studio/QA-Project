<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="评论总数" value="256,890" icon="fas fa-comments" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="今日新增" value="3,456" valueClass="text-green-500" icon="fas fa-plus" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="待审核" value="89" valueClass="text-yellow-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      <StatCard title="被举报" value="12" valueClass="text-red-500" icon="fas fa-flag" iconBg="bg-red-100" iconColor="text-red-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <el-tabs v-model="activeTab" class="px-4">
        <el-tab-pane label="全部评论" name="all" />
        <el-tab-pane label="待审核 (89)" name="pending" />
        <el-tab-pane label="被举报 (12)" name="reported" />
        <el-tab-pane label="已删除" name="deleted" />
      </el-tabs>

      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索评论内容、用户" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="typeFilter" placeholder="评论类型" clearable>
            <el-option label="问题评论" value="question" />
            <el-option label="回答评论" value="answer" />
            <el-option label="回复评论" value="reply" />
          </el-select>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <div class="flex gap-2">
          <el-button type="danger" :disabled="!selectedRows.length"><i class="fas fa-trash mr-2"></i>批量删除</el-button>
          <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
        </div>
      </div>

      <el-table :data="comments" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="评论内容" min-width="350">
          <template #default="{ row }">
            <div class="flex items-start">
              <img :src="row.avatar" class="w-10 h-10 rounded-full flex-shrink-0">
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <span class="font-medium text-sm">{{ row.author }}</span>
                  <span class="text-xs text-gray-400 ml-2">{{ row.time }}</span>
                </div>
                <div class="text-sm text-gray-700 mt-1">{{ row.content }}</div>
                <div class="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500">
                  <span class="text-gray-400">{{ row.targetType === 'question' ? '评论问题' : '评论回答' }}：</span>
                  {{ row.targetTitle }}
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-400 gap-4">
                  <span><i class="fas fa-thumbs-up mr-1"></i>{{ row.likes }}</span>
                  <span><i class="fas fa-thumbs-down mr-1"></i>{{ row.dislikes }}</span>
                  <span><i class="fas fa-reply mr-1"></i>{{ row.replies }} 回复</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
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
            <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 256,890 条记录</span>
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
const dateRange = ref([])
const selectedRows = ref([])
const statusText = { approved: '已通过', pending: '待审核', reported: '被举报', deleted: '已删除' }

const comments = ref([
  { id: 'C10001', author: '技术小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', content: '这个回答太棒了，解决了我的问题！感谢分享！', targetType: 'answer', targetTitle: '如何在三个月内从零基础学会Python编程？', likes: 56, dislikes: 2, replies: 3, status: 'approved', time: '10分钟前' },
  { id: 'C10002', author: 'Python爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', content: '我觉得3个月入门完全可以，关键是要坚持每天练习，不能三天打鱼两天晒网', targetType: 'question', targetTitle: '如何在三个月内从零基础学会Python编程？', likes: 128, dislikes: 5, replies: 12, status: 'approved', time: '25分钟前' },
  { id: 'C10003', author: '匿名用户', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3', content: '这个回答有问题，不建议采纳', targetType: 'answer', targetTitle: '第一次养猫需要准备什么？', likes: 3, dislikes: 15, replies: 5, status: 'reported', time: '1小时前' },
  { id: 'C10004', author: '新手程序员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4', content: '请问有没有推荐的学习资源？', targetType: 'question', targetTitle: '如何在三个月内从零基础学会Python编程？', likes: 23, dislikes: 0, replies: 8, status: 'pending', time: '2小时前' },
])

const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}
</script>
