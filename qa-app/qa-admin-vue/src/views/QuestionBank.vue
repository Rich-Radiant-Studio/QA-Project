<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">题库管理</h1>
        <p class="text-sm text-gray-500 mt-1">管理平台题库和用户上传的题库</p>
      </div>
      <button @click="showAddModal = true" class="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
        <i class="fas fa-plus mr-2"></i>创建题库
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-5 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">题库总数</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalBanks }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-database text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">平台题库</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.platformBanks }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-shield-alt text-green-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">用户题库</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.userBanks }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-users text-purple-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">待审核</p>
            <p class="text-2xl font-bold text-red-500 mt-1">{{ stats.pendingBanks }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-clock text-red-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">题目总数</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalQuestions }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-list-alt text-yellow-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="searchQuery" type="text" placeholder="搜索题库名称、作者..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
          </div>
        </div>
        <select v-model="filterType" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="">全部类型</option>
          <option value="platform">平台题库</option>
          <option value="user">用户题库</option>
        </select>
        <select v-model="filterCategory" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="">全部分类</option>
          <option value="国家">国家</option>
          <option value="行业">行业</option>
          <option value="个人">个人</option>
        </select>
        <select v-model="filterStatus" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="">全部状态</option>
          <option value="approved">已通过</option>
          <option value="pending">待审核</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
    </div>

    <!-- 题库列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题库信息</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题目数</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作者</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="bank in filteredBanks" :key="bank.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {{ bank.name.charAt(0) }}
                </div>
                <div class="ml-3">
                  <div class="font-medium text-gray-800">{{ bank.name }}</div>
                  <div class="text-xs text-gray-500">ID: {{ bank.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', bank.type === 'platform' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600']">
                <i :class="['mr-1', bank.type === 'platform' ? 'fas fa-shield-alt' : 'fas fa-user']"></i>
                {{ bank.type === 'platform' ? '平台' : '用户' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-800">{{ bank.mainCategory }}</div>
              <div class="text-xs text-gray-500">{{ bank.subCategory }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm font-medium text-gray-800">{{ bank.questionCount }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-800">{{ bank.author }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusClass(bank.status)]">
                {{ getStatusText(bank.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ bank.createdAt }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button @click="viewBank(bank)" class="text-blue-500 hover:text-blue-700" title="查看详情">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editBank(bank)" class="text-green-500 hover:text-green-700" title="编辑">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="bank.status === 'pending'" @click="approveBank(bank)" class="text-green-500 hover:text-green-700" title="通过审核">
                  <i class="fas fa-check-circle"></i>
                </button>
                <button v-if="bank.status === 'pending'" @click="rejectBank(bank)" class="text-red-500 hover:text-red-700" title="拒绝">
                  <i class="fas fa-times-circle"></i>
                </button>
                <button @click="deleteBank(bank)" class="text-red-500 hover:text-red-700" title="删除">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-500">
        显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredBanks.length) }} 条，共 {{ filteredBanks.length }} 条
      </div>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" 
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          上一页
        </button>
        <button v-for="page in totalPages" :key="page" @click="currentPage = page"
          :class="['px-3 py-1 border rounded', currentPage === page ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 hover:bg-gray-50']">
          {{ page }}
        </button>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 统计数据
const stats = ref({
  totalBanks: 127,
  platformBanks: 45,
  userBanks: 82,
  pendingBanks: 15,
  totalQuestions: 3580
})

// 筛选条件
const searchQuery = ref('')
const filterType = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟题库数据
const banks = ref([
  { id: 1, name: 'React Native基础知识', type: 'platform', mainCategory: '行业', subCategory: '互联网', questionCount: 50, author: '平台管理员', status: 'approved', createdAt: '2026-01-20 10:30' },
  { id: 2, name: 'JavaScript高级特性', type: 'platform', mainCategory: '行业', subCategory: '互联网', questionCount: 40, author: '平台管理员', status: 'approved', createdAt: '2026-01-18 14:20' },
  { id: 3, name: 'React Hooks实战', type: 'platform', mainCategory: '行业', subCategory: '互联网', questionCount: 35, author: '平台管理员', status: 'approved', createdAt: '2026-01-15 09:15' },
  { id: 4, name: 'TypeScript入门', type: 'platform', mainCategory: '行业', subCategory: '互联网', questionCount: 45, author: '平台管理员', status: 'approved', createdAt: '2026-01-12 16:45' },
  { id: 5, name: 'Node.js后端开发', type: 'user', mainCategory: '行业', subCategory: '互联网', questionCount: 30, author: '张三', status: 'approved', createdAt: '2026-01-25 11:20' },
  { id: 6, name: 'CSS布局技巧', type: 'user', mainCategory: '个人', subCategory: '职业发展', questionCount: 25, author: '李四', status: 'pending', createdAt: '2026-01-28 15:30' },
  { id: 7, name: 'Python数据分析', type: 'user', mainCategory: '个人', subCategory: '兴趣爱好', questionCount: 20, author: '王五', status: 'approved', createdAt: '2026-01-22 13:10' },
  { id: 8, name: '中国历史知识', type: 'platform', mainCategory: '国家', subCategory: '历史', questionCount: 60, author: '平台管理员', status: 'approved', createdAt: '2026-01-10 10:00' },
  { id: 9, name: '法律基础知识', type: 'platform', mainCategory: '国家', subCategory: '法律', questionCount: 55, author: '平台管理员', status: 'approved', createdAt: '2026-01-08 14:30' },
  { id: 10, name: '金融行业知识', type: 'user', mainCategory: '行业', subCategory: '金融', questionCount: 40, author: '赵六', status: 'pending', createdAt: '2026-01-29 09:45' },
])

// 筛选后的题库列表
const filteredBanks = computed(() => {
  return banks.value.filter(bank => {
    const matchSearch = !searchQuery.value || 
      bank.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bank.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = !filterType.value || bank.type === filterType.value
    const matchCategory = !filterCategory.value || bank.mainCategory === filterCategory.value
    const matchStatus = !filterStatus.value || bank.status === filterStatus.value
    return matchSearch && matchType && matchCategory && matchStatus
  })
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredBanks.value.length / pageSize.value))

// 状态样式
const getStatusClass = (status) => {
  const classes = {
    approved: 'bg-green-100 text-green-600',
    pending: 'bg-yellow-100 text-yellow-600',
    rejected: 'bg-red-100 text-red-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

// 状态文本
const getStatusText = (status) => {
  const texts = {
    approved: '已通过',
    pending: '待审核',
    rejected: '已拒绝'
  }
  return texts[status] || '未知'
}

// 操作方法
const viewBank = (bank) => {
  alert(`查看题库：${bank.name}`)
}

const editBank = (bank) => {
  alert(`编辑题库：${bank.name}`)
}

const approveBank = (bank) => {
  if (confirm(`确定通过题库"${bank.name}"的审核吗？`)) {
    bank.status = 'approved'
    stats.value.pendingBanks--
  }
}

const rejectBank = (bank) => {
  if (confirm(`确定拒绝题库"${bank.name}"吗？`)) {
    bank.status = 'rejected'
    stats.value.pendingBanks--
  }
}

const deleteBank = (bank) => {
  if (confirm(`确定删除题库"${bank.name}"吗？此操作不可恢复！`)) {
    const index = banks.value.findIndex(b => b.id === bank.id)
    if (index > -1) {
      banks.value.splice(index, 1)
      stats.value.totalBanks--
      if (bank.type === 'platform') stats.value.platformBanks--
      else stats.value.userBanks--
      if (bank.status === 'pending') stats.value.pendingBanks--
    }
  }
}

const showAddModal = ref(false)
</script>
