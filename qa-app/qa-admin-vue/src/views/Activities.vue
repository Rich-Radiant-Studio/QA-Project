<template>
  <div>
    <div class="grid grid-cols-5 gap-4 mb-6">
      <StatCard title="活动总数" value="1,256" icon="fas fa-calendar-alt" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="进行中" value="45" valueClass="text-green-500" icon="fas fa-play-circle" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="待审核" value="12" valueClass="text-yellow-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      <StatCard title="线上活动" value="856" valueClass="text-purple-500" icon="fas fa-globe" iconBg="bg-purple-100" iconColor="text-purple-500" />
      <StatCard title="线下活动" value="400" valueClass="text-orange-500" icon="fas fa-map-marker-alt" iconBg="bg-orange-100" iconColor="text-orange-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <el-tabs v-model="activeTab" class="px-4">
        <el-tab-pane label="全部活动" name="all" />
        <el-tab-pane label="进行中" name="active" />
        <el-tab-pane label="待审核 (12)" name="pending" />
        <el-tab-pane label="已结束" name="ended" />
      </el-tabs>

      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索活动标题" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="typeFilter" placeholder="活动类型" clearable>
            <el-option label="线上活动" value="online" />
            <el-option label="线下活动" value="offline" />
          </el-select>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <el-button type="primary" @click="showCreateModal = true"><i class="fas fa-plus mr-2"></i>创建活动</el-button>
      </div>

      <el-table :data="activities" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="活动信息" min-width="300">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.image" class="w-20 h-12 rounded object-cover">
              <div class="ml-3">
                <div class="font-medium text-sm">{{ row.title }}</div>
                <div class="text-xs text-gray-400 mt-1">ID: {{ row.id }} · {{ row.time }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <span :class="['px-2 py-1 text-xs rounded-full', row.type === 'online' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600']">
              {{ row.type === 'online' ? '线上' : '线下' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发起人" width="120">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.avatar" class="w-6 h-6 rounded-full">
              <span class="ml-2 text-sm">{{ row.author }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参与人数" width="100" />
        <el-table-column label="活动时间" width="180">
          <template #default="{ row }">
            <div class="text-xs">{{ row.startTime }}</div>
            <div class="text-xs text-gray-400">至 {{ row.endTime }}</div>
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
            <el-button link type="warning" size="small"><i class="fas fa-edit"></i></el-button>
            <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 1,256 条记录</span>
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div>
    </div>

    <!-- 创建活动弹窗 -->
    <el-dialog v-model="showCreateModal" title="创建活动" width="600px">
      <el-form :model="newActivity" label-width="100px">
        <el-form-item label="活动类型">
          <el-radio-group v-model="newActivity.type">
            <el-radio label="online">线上活动</el-radio>
            <el-radio label="offline">线下活动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动标题">
          <el-input v-model="newActivity.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="newActivity.desc" type="textarea" :rows="4" placeholder="请输入活动描述" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="newActivity.startTime" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="newActivity.endTime" type="datetime" placeholder="选择结束时间" />
        </el-form-item>
        <el-form-item v-if="newActivity.type === 'offline'" label="活动地址">
          <el-input v-model="newActivity.address" placeholder="请输入活动地址" />
        </el-form-item>
        <el-form-item label="活动封面">
          <el-upload action="#" :auto-upload="false" :show-file-list="false">
            <el-button type="default">上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateModal = false">取消</el-button>
        <el-button type="primary" @click="createActivity">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const activeTab = ref('all')
const searchQuery = ref('')
const typeFilter = ref('')
const dateRange = ref([])
const showCreateModal = ref(false)
const statusText = { active: '进行中', pending: '待审核', ended: '已结束' }

const newActivity = ref({
  type: 'online',
  title: '',
  desc: '',
  startTime: '',
  endTime: '',
  address: ''
})

const activities = ref([
  { id: 'A10001', title: '新人答题挑战赛', type: 'online', author: '官方', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', participants: 12580, startTime: '2026-01-10', endTime: '2026-01-20', status: 'active', time: '5天前', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=120&fit=crop' },
  { id: 'A10002', title: 'Python学习打卡活动', type: 'online', author: '技术社区', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', participants: 8956, startTime: '2026-01-05', endTime: '2026-01-26', status: 'active', time: '10天前', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=120&fit=crop' },
  { id: 'A10003', title: '程序员线下交流会', type: 'offline', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', participants: 156, startTime: '2026-01-25', endTime: '2026-01-25', status: 'pending', time: '2天前', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=120&fit=crop' },
  { id: 'A10004', title: '优质回答评选', type: 'online', author: '官方', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', participants: 5623, startTime: '2026-01-01', endTime: '2026-01-10', status: 'ended', time: '15天前', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=120&fit=crop' },
])

const createActivity = () => {
  showCreateModal.value = false
}
</script>
