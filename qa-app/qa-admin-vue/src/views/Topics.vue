<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="话题总数" value="1,256" icon="fas fa-hashtag" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="热门话题" value="50" valueClass="text-red-500" icon="fas fa-fire" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="今日新增" value="+23" valueClass="text-green-500" icon="fas fa-plus" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="总关注数" value="5.6M" valueClass="text-blue-500" icon="fas fa-users" iconBg="bg-blue-100" iconColor="text-blue-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <div class="p-4 flex items-center justify-between border-b border-gray-100">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索话题名称" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="categoryFilter" placeholder="全部分类" clearable>
            <el-option label="科技" value="tech" />
            <el-option label="生活" value="life" />
            <el-option label="职场" value="career" />
            <el-option label="健康" value="health" />
          </el-select>
        </div>
        <el-button type="primary"><i class="fas fa-plus mr-2"></i>添加话题</el-button>
      </div>

      <el-table :data="topics" style="width: 100%">
        <el-table-column label="话题" min-width="250">
          <template #default="{ row }">
            <div class="flex items-center">
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', row.iconBg]">
                <i :class="[row.icon, row.iconColor]"></i>
              </div>
              <div class="ml-3">
                <div class="font-medium">{{ row.name }}</div>
                <div class="text-xs text-gray-400">{{ row.desc }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            <span :class="['px-2 py-1 text-xs rounded', row.categoryClass]">{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followers" label="关注数" width="100" />
        <el-table-column prop="questions" label="问题数" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span v-if="row.hot" class="flex items-center text-red-500 text-sm"><i class="fas fa-fire mr-1"></i>热门</span>
            <span v-else class="text-sm text-gray-500">普通</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="120" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small"><i class="fas fa-edit"></i></el-button>
            <el-button link type="warning" size="small"><i class="fas fa-fire"></i></el-button>
            <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 1,256 条记录</span>
        <el-pagination layout="prev, pager, next" :total="100" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const searchQuery = ref('')
const categoryFilter = ref('')

const topics = ref([
  { name: '#Python学习', desc: '编程入门首选语言', icon: 'fas fa-code', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', category: '科技', categoryClass: 'bg-blue-100 text-blue-600', followers: '85,000', questions: '32,000', hot: true, createDate: '2023-01-15' },
  { name: '#职场', desc: '职场经验分享', icon: 'fas fa-briefcase', iconBg: 'bg-green-100', iconColor: 'text-green-500', category: '职场', categoryClass: 'bg-green-100 text-green-600', followers: '125,000', questions: '45,000', hot: true, createDate: '2023-01-10' },
  { name: '#健康', desc: '健康生活方式', icon: 'fas fa-heartbeat', iconBg: 'bg-red-100', iconColor: 'text-red-500', category: '健康', categoryClass: 'bg-red-100 text-red-600', followers: '98,000', questions: '28,000', hot: true, createDate: '2023-02-01' },
  { name: '#美食', desc: '美食分享与推荐', icon: 'fas fa-utensils', iconBg: 'bg-orange-100', iconColor: 'text-orange-500', category: '生活', categoryClass: 'bg-orange-100 text-orange-600', followers: '76,000', questions: '22,000', hot: false, createDate: '2023-03-15' },
  { name: '#教育', desc: '教育学习交流', icon: 'fas fa-graduation-cap', iconBg: 'bg-purple-100', iconColor: 'text-purple-500', category: '教育', categoryClass: 'bg-purple-100 text-purple-600', followers: '65,000', questions: '18,000', hot: false, createDate: '2023-04-01' },
  { name: '#情感', desc: '情感问题咨询', icon: 'fas fa-heart', iconBg: 'bg-pink-100', iconColor: 'text-pink-500', category: '生活', categoryClass: 'bg-pink-100 text-pink-600', followers: '89,000', questions: '35,000', hot: false, createDate: '2023-02-20' },
])
</script>
