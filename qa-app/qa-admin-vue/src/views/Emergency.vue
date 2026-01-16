<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="紧急求助总数" value="568" icon="fas fa-exclamation-triangle" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="待处理" value="23" valueClass="text-red-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      <StatCard title="处理中" value="15" valueClass="text-blue-500" icon="fas fa-spinner" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="已解决" value="530" valueClass="text-green-500" icon="fas fa-check-circle" iconBg="bg-green-100" iconColor="text-green-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <el-tabs v-model="activeTab" class="px-4">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待处理 (23)" name="pending" />
        <el-tab-pane label="处理中 (15)" name="processing" />
        <el-tab-pane label="已解决" name="resolved" />
      </el-tabs>

      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索求助标题、用户" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="urgencyFilter" placeholder="紧急程度" clearable>
            <el-option label="紧急" value="urgent" />
            <el-option label="一般" value="normal" />
          </el-select>
          <el-select v-model="regionFilter" placeholder="地区" clearable>
            <el-option label="北京" value="beijing" />
            <el-option label="上海" value="shanghai" />
            <el-option label="广州" value="guangzhou" />
          </el-select>
        </div>
        <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
      </div>

      <el-table :data="emergencies" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="求助信息" min-width="300">
          <template #default="{ row }">
            <div class="flex items-start">
              <div :class="['w-2 h-2 rounded-full mt-2 mr-3', row.urgency === 'urgent' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500']"></div>
              <div>
                <div class="font-medium text-sm">{{ row.title }}</div>
                <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ row.description }}</div>
                <div class="text-xs text-gray-400 mt-1">ID: {{ row.id }} · {{ row.time }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="求助人" width="150">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.avatar" class="w-8 h-8 rounded-full">
              <div class="ml-2">
                <div class="text-sm">{{ row.author }}</div>
                <div class="text-xs text-gray-400">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="位置" width="150">
          <template #default="{ row }">
            <div class="flex items-center text-sm">
              <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>
              {{ row.location }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="紧急程度" width="100">
          <template #default="{ row }">
            <span :class="['px-2 py-1 text-xs rounded-full', row.urgency === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600']">
              {{ row.urgency === 'urgent' ? '紧急' : '一般' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', `status-${row.status}`]">{{ statusText[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" link type="primary" size="small" @click="handleEmergency(row)">
              <i class="fas fa-hand-holding-heart mr-1"></i>处理
            </el-button>
            <el-button link type="success" size="small"><i class="fas fa-eye"></i></el-button>
            <el-button link type="warning" size="small"><i class="fas fa-phone"></i></el-button>
            <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 568 条记录</span>
        <el-pagination layout="prev, pager, next" :total="500" />
      </div>
    </div>

    <!-- 处理弹窗 -->
    <el-dialog v-model="showHandleModal" title="处理紧急求助" width="500px">
      <div v-if="currentEmergency" class="mb-4 p-4 bg-red-50 rounded-lg">
        <div class="font-medium text-red-600">{{ currentEmergency.title }}</div>
        <div class="text-sm text-gray-600 mt-2">{{ currentEmergency.description }}</div>
        <div class="text-sm text-gray-500 mt-2">
          <i class="fas fa-map-marker-alt mr-1"></i>{{ currentEmergency.location }}
          <span class="ml-4"><i class="fas fa-phone mr-1"></i>{{ currentEmergency.phone }}</span>
        </div>
      </div>
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="handleForm.method">
            <el-radio label="contact">联系求助人</el-radio>
            <el-radio label="dispatch">派遣人员</el-radio>
            <el-radio label="transfer">转交相关部门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="handleForm.note" type="textarea" :rows="3" placeholder="请输入处理备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showHandleModal = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const activeTab = ref('all')
const searchQuery = ref('')
const urgencyFilter = ref('')
const regionFilter = ref('')
const showHandleModal = ref(false)
const currentEmergency = ref(null)
const statusText = { pending: '待处理', processing: '处理中', resolved: '已解决' }

const handleForm = ref({
  method: 'contact',
  note: ''
})

const emergencies = ref([
  { id: 'E10001', title: '老人走失急寻', description: '我父亲今天下午2点从家里出门后一直没有回来，患有轻度老年痴呆，穿着蓝色外套...', author: '李明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=e1', phone: '138****5678', location: '北京市朝阳区', urgency: 'urgent', status: 'pending', time: '10分钟前' },
  { id: 'E10002', title: '宠物猫走丢', description: '橘猫，3岁，名叫咪咪，今天早上从窗户跑出去了，附近有看到的请联系我...', author: '王小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=e2', phone: '139****1234', location: '上海市浦东新区', urgency: 'normal', status: 'processing', time: '2小时前' },
  { id: 'E10003', title: '急需O型血', description: '家人手术急需O型血，医院血库告急，希望有爱心人士能够帮助...', author: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=e3', phone: '137****9876', location: '广州市天河区', urgency: 'urgent', status: 'pending', time: '30分钟前' },
  { id: 'E10004', title: '寻找目击证人', description: '1月10日下午3点在XX路口发生交通事故，寻找当时的目击证人...', author: '刘强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=e4', phone: '136****5432', location: '深圳市南山区', urgency: 'normal', status: 'resolved', time: '3天前' },
])

const handleEmergency = (row) => {
  currentEmergency.value = row
  showHandleModal.value = true
}

const submitHandle = () => {
  showHandleModal.value = false
}
</script>
