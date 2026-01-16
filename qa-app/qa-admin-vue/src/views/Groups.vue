<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="群组总数" value="8,560" icon="fas fa-users-cog" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="活跃群组" value="3,245" valueClass="text-green-500" icon="fas fa-comments" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="今日新建" value="156" valueClass="text-blue-500" icon="fas fa-plus-circle" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="待审核" value="23" valueClass="text-yellow-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <el-tabs v-model="activeTab" class="px-4">
        <el-tab-pane label="全部群组" name="all" />
        <el-tab-pane label="活跃群组" name="active" />
        <el-tab-pane label="待审核 (23)" name="pending" />
        <el-tab-pane label="被举报" name="reported" />
      </el-tabs>

      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索群组名称、ID" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="typeFilter" placeholder="群组类型" clearable>
            <el-option label="问题群组" value="question" />
            <el-option label="话题群组" value="topic" />
            <el-option label="兴趣群组" value="interest" />
          </el-select>
        </div>
        <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
      </div>

      <el-table :data="groups" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="群组信息" min-width="300">
          <template #default="{ row }">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                {{ row.name.charAt(0) }}
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">{{ row.name }}</div>
                <div class="text-xs text-gray-500 mt-1 line-clamp-1">{{ row.question }}</div>
                <div class="text-xs text-gray-400 mt-1">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="群主" width="150">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.ownerAvatar" class="w-8 h-8 rounded-full">
              <span class="ml-2 text-sm">{{ row.owner }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="memberCount" label="成员数" width="100" />
        <el-table-column prop="messageCount" label="消息数" width="100" />
        <el-table-column label="创建时间" width="120">
          <template #default="{ row }">
            <span class="text-sm text-gray-500">{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', `status-${row.status}`]">{{ statusText[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewGroup(row)"><i class="fas fa-eye"></i></el-button>
            <el-button link type="warning" size="small"><i class="fas fa-user-cog"></i></el-button>
            <el-button link type="danger" size="small"><i class="fas fa-ban"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 8,560 条记录</span>
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div>
    </div>

    <!-- 群组详情弹窗 -->
    <el-dialog v-model="showDetailModal" title="群组详情" width="700px">
      <div v-if="currentGroup">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
            {{ currentGroup.name.charAt(0) }}
          </div>
          <div class="ml-4">
            <div class="text-lg font-bold">{{ currentGroup.name }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ currentGroup.memberCount }} 成员 · {{ currentGroup.messageCount }} 条消息</div>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="text-sm font-medium text-gray-700 mb-2">关联问题</div>
          <div class="p-3 bg-gray-50 rounded-lg text-sm">{{ currentGroup.question }}</div>
        </div>

        <div class="mb-4">
          <div class="text-sm font-medium text-gray-700 mb-2">群主信息</div>
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <img :src="currentGroup.ownerAvatar" class="w-10 h-10 rounded-full">
            <div class="ml-3">
              <div class="font-medium">{{ currentGroup.owner }}</div>
              <div class="text-xs text-gray-400">创建于 {{ currentGroup.createTime }}</div>
            </div>
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">最近消息</div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="msg in recentMessages" :key="msg.id" class="flex items-start p-2 hover:bg-gray-50 rounded">
              <img :src="msg.avatar" class="w-8 h-8 rounded-full">
              <div class="ml-2 flex-1">
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ msg.author }}</span>
                  <span class="text-xs text-gray-400 ml-2">{{ msg.time }}</span>
                </div>
                <div class="text-sm text-gray-600">{{ msg.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const activeTab = ref('all')
const searchQuery = ref('')
const typeFilter = ref('')
const showDetailModal = ref(false)
const currentGroup = ref(null)
const statusText = { active: '正常', pending: '待审核', banned: '已封禁' }

const groups = ref([
  { id: 'G10001', name: 'Python学习交流群', question: '如何在三个月内从零基础学会Python编程？', owner: '张三丰', ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', memberCount: 128, messageCount: 2456, createTime: '2026-01-05', status: 'active' },
  { id: 'G10002', name: '养猫新手群', question: '第一次养猫需要准备什么？', owner: '李小龙', ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', memberCount: 256, messageCount: 5678, createTime: '2026-01-03', status: 'active' },
  { id: 'G10003', name: '失眠调理交流', question: '长期失眠应该怎么调理？', owner: '王医生', ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', memberCount: 89, messageCount: 1234, createTime: '2026-01-08', status: 'pending' },
  { id: 'G10004', name: '程序员职业发展', question: '35岁程序员如何规划职业发展？', owner: '程序员小明', ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', memberCount: 456, messageCount: 8901, createTime: '2025-12-20', status: 'active' },
])

const recentMessages = ref([
  { id: 1, author: '技术小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg1', content: '这个问题我也很想知道答案，关注了！', time: '10分钟前' },
  { id: 2, author: 'Python爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg2', content: '我觉得3个月入门完全可以，关键是要坚持每天练习', time: '25分钟前' },
  { id: 3, author: '数据分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg3', content: '推荐先从基础语法开始，然后学pandas和numpy', time: '1小时前' },
])

const viewGroup = (row) => {
  currentGroup.value = row
  showDetailModal.value = true
}
</script>
