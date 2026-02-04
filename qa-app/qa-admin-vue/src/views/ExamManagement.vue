<template>
  <div>
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">考核管理</h1>
        <p class="text-sm text-gray-500 mt-1">查看和管理用户考核记录</p>
      </div>
      <button @click="exportData" class="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-shadow">
        <i class="fas fa-download mr-2"></i>导出数据
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-5 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总考核次数</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalExams }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-clipboard-list text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">通过率</p>
            <p class="text-2xl font-bold text-green-500 mt-1">{{ stats.passRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-check-circle text-green-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">平均分</p>
            <p class="text-2xl font-bold text-yellow-500 mt-1">{{ stats.avgScore }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-star text-yellow-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">今日考核</p>
            <p class="text-2xl font-bold text-purple-500 mt-1">{{ stats.todayExams }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-calendar-day text-purple-500 text-xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">参与用户</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-users text-red-500 text-xl"></i>
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
            <input v-model="searchQuery" type="text" placeholder="搜索用户名、题库名称..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
          </div>
        </div>
        <select v-model="filterRank" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="">全部等级</option>
          <option value="优秀">优秀</option>
          <option value="良好">良好</option>
          <option value="及格">及格</option>
          <option value="不及格">不及格</option>
        </select>
        <input v-model="filterDate" type="date" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
      </div>
    </div>

    <!-- 考核记录列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户信息</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题库名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分数</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">等级</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">答题情况</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用时</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">考核时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="exam in filteredExams" :key="exam.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img :src="exam.userAvatar" class="w-10 h-10 rounded-full">
                <div class="ml-3">
                  <div class="font-medium text-gray-800">{{ exam.userName }}</div>
                  <div class="text-xs text-gray-500">ID: {{ exam.userId }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-800">{{ exam.bankName }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="['text-lg font-bold', getScoreColor(exam.score)]">{{ exam.score }}</span>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getRankClass(exam.rank)]">
                {{ exam.rank }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm">
                <span class="text-green-600">{{ exam.correctCount }}</span> / 
                <span class="text-gray-600">{{ exam.totalQuestions }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ exam.duration }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ exam.examDate }}</td>
            <td class="px-6 py-4">
              <button @click="viewDetail(exam)" class="text-blue-500 hover:text-blue-700" title="查看详情">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-500">
        显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredExams.length) }} 条，共 {{ filteredExams.length }} 条
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
  totalExams: 3580,
  passRate: 78.5,
  avgScore: 76.8,
  todayExams: 156,
  totalUsers: 1256
})

// 筛选条件
const searchQuery = ref('')
const filterRank = ref('')
const filterDate = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟考核记录数据
const exams = ref([
  { id: 1, userId: 1001, userName: '张三丰', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', bankName: 'React Native基础知识', score: 95, rank: '优秀', correctCount: 9, totalQuestions: 10, duration: '05:23', examDate: '2026-01-25 14:30' },
  { id: 2, userId: 1002, userName: '李小龙', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', bankName: 'JavaScript高级特性', score: 85, rank: '良好', correctCount: 8, totalQuestions: 10, duration: '07:45', examDate: '2026-01-25 10:15' },
  { id: 3, userId: 1003, userName: '王医生', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', bankName: 'React Hooks实战', score: 90, rank: '优秀', correctCount: 9, totalQuestions: 10, duration: '06:12', examDate: '2026-01-24 16:20' },
  { id: 4, userId: 1004, userName: '程序员小明', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', bankName: 'TypeScript入门', score: 75, rank: '及格', correctCount: 7, totalQuestions: 10, duration: '08:30', examDate: '2026-01-24 09:30' },
  { id: 5, userId: 1001, userName: '张三丰', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', bankName: 'Node.js后端开发', score: 80, rank: '良好', correctCount: 8, totalQuestions: 10, duration: '07:00', examDate: '2026-01-23 15:45' },
  { id: 6, userId: 1005, userName: '赵六', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', bankName: 'CSS布局技巧', score: 55, rank: '不及格', correctCount: 5, totalQuestions: 10, duration: '09:15', examDate: '2026-01-23 11:20' },
  { id: 7, userId: 1006, userName: '孙七', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6', bankName: 'Python数据分析', score: 92, rank: '优秀', correctCount: 9, totalQuestions: 10, duration: '05:50', examDate: '2026-01-22 14:10' },
  { id: 8, userId: 1007, userName: '周八', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7', bankName: '中国历史知识', score: 88, rank: '良好', correctCount: 8, totalQuestions: 10, duration: '06:30', examDate: '2026-01-22 10:00' },
  { id: 9, userId: 1008, userName: '吴九', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8', bankName: '法律基础知识', score: 70, rank: '及格', correctCount: 7, totalQuestions: 10, duration: '08:00', examDate: '2026-01-21 16:30' },
  { id: 10, userId: 1009, userName: '郑十', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user9', bankName: '金融行业知识', score: 95, rank: '优秀', correctCount: 9, totalQuestions: 10, duration: '05:15', examDate: '2026-01-21 13:45' },
])

// 筛选后的考核记录
const filteredExams = computed(() => {
  return exams.value.filter(exam => {
    const matchSearch = !searchQuery.value || 
      exam.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exam.bankName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRank = !filterRank.value || exam.rank === filterRank.value
    const matchDate = !filterDate.value || exam.examDate.startsWith(filterDate.value)
    return matchSearch && matchRank && matchDate
  })
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredExams.value.length / pageSize.value))

// 分数颜色
const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-500'
  if (score >= 80) return 'text-blue-500'
  if (score >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

// 等级样式
const getRankClass = (rank) => {
  const classes = {
    '优秀': 'bg-green-100 text-green-600',
    '良好': 'bg-blue-100 text-blue-600',
    '及格': 'bg-yellow-100 text-yellow-600',
    '不及格': 'bg-red-100 text-red-600'
  }
  return classes[rank] || 'bg-gray-100 text-gray-600'
}

// 操作方法
const viewDetail = (exam) => {
  alert(`查看考核详情：\n用户：${exam.userName}\n题库：${exam.bankName}\n分数：${exam.score}`)
}

const exportData = () => {
  alert('导出考核数据功能开发中...')
}
</script>
