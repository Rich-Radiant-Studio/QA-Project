<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="热榜问题" value="500" icon="fas fa-fire" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="全站热榜" value="50" valueClass="text-red-500" icon="fas fa-globe" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="行业热榜" value="200" valueClass="text-orange-500" icon="fas fa-industry" iconBg="bg-orange-100" iconColor="text-orange-500" />
      <StatCard title="个人热榜" value="250" valueClass="text-purple-500" icon="fas fa-user" iconBg="bg-purple-100" iconColor="text-purple-500" />
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 全站热榜 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-fire text-red-500 mr-2"></i>
            <span class="font-bold">全站热榜</span>
          </div>
          <el-button link type="primary" size="small">管理</el-button>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(item, idx) in globalHotList" :key="item.id" class="px-4 py-3 flex items-start hover:bg-gray-50">
            <div :class="['w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold', getRankBg(idx + 1)]">
              {{ idx + 1 }}
            </div>
            <div class="ml-3 flex-1">
              <div class="text-sm font-medium line-clamp-2">{{ item.title }}</div>
              <div class="flex items-center mt-1 text-xs text-gray-400">
                <span class="text-red-500 font-medium">{{ item.hot }}</span>
                <span class="ml-2">热度</span>
                <i :class="['ml-1', item.isUp ? 'fas fa-arrow-up text-green-500' : 'fas fa-arrow-down text-red-500']"></i>
              </div>
            </div>
            <el-dropdown trigger="click">
              <el-button link size="small"><i class="fas fa-ellipsis-v text-gray-400"></i></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>置顶</el-dropdown-item>
                  <el-dropdown-item>移除</el-dropdown-item>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 国家热榜 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-flag text-blue-500 mr-2"></i>
            <span class="font-bold">国家热榜</span>
          </div>
          <el-select v-model="selectedCountryCategory" size="small" style="width: 100px">
            <el-option label="政策法规" value="policy" />
            <el-option label="社会民生" value="society" />
            <el-option label="经济发展" value="economy" />
          </el-select>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(item, idx) in countryHotList" :key="item.id" class="px-4 py-3 flex items-start hover:bg-gray-50">
            <div :class="['w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold', getRankBg(idx + 1)]">
              {{ idx + 1 }}
            </div>
            <div class="ml-3 flex-1">
              <div class="text-sm font-medium line-clamp-2">{{ item.title }}</div>
              <div class="flex items-center mt-1 text-xs text-gray-400">
                <span class="text-red-500 font-medium">{{ item.hot }}</span>
                <span class="ml-2">热度</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 行业热榜 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-industry text-orange-500 mr-2"></i>
            <span class="font-bold">行业热榜</span>
          </div>
          <el-select v-model="selectedIndustry" size="small" style="width: 100px">
            <el-option label="互联网" value="internet" />
            <el-option label="金融" value="finance" />
            <el-option label="医疗健康" value="health" />
          </el-select>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(item, idx) in industryHotList" :key="item.id" class="px-4 py-3 flex items-start hover:bg-gray-50">
            <div :class="['w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold', getRankBg(idx + 1)]">
              {{ idx + 1 }}
            </div>
            <div class="ml-3 flex-1">
              <div class="text-sm font-medium line-clamp-2">{{ item.title }}</div>
              <div class="flex items-center mt-1 text-xs text-gray-400">
                <span class="text-red-500 font-medium">{{ item.hot }}</span>
                <span class="ml-2">热度</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热榜配置 -->
    <div class="mt-6 bg-white rounded-xl shadow-sm p-6">
      <h3 class="font-bold mb-4">热榜配置</h3>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">热度计算规则</div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">浏览量权重</span>
              <el-input-number v-model="hotConfig.viewWeight" :min="0" :max="10" size="small" />
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">点赞量权重</span>
              <el-input-number v-model="hotConfig.likeWeight" :min="0" :max="10" size="small" />
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">回答量权重</span>
              <el-input-number v-model="hotConfig.answerWeight" :min="0" :max="10" size="small" />
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">分享量权重</span>
              <el-input-number v-model="hotConfig.shareWeight" :min="0" :max="10" size="small" />
            </div>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">更新设置</div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">更新频率</span>
              <el-select v-model="hotConfig.updateFrequency" size="small" style="width: 120px">
                <el-option label="5分钟" value="5" />
                <el-option label="10分钟" value="10" />
                <el-option label="30分钟" value="30" />
                <el-option label="1小时" value="60" />
              </el-select>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">热榜数量</span>
              <el-input-number v-model="hotConfig.listSize" :min="10" :max="100" size="small" />
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm">时间衰减系数</span>
              <el-input-number v-model="hotConfig.decayFactor" :min="0" :max="1" :step="0.1" size="small" />
            </div>
          </div>
          <el-button type="primary" class="mt-4 w-full">保存配置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const selectedCountryCategory = ref('policy')
const selectedIndustry = ref('internet')

const hotConfig = ref({
  viewWeight: 1,
  likeWeight: 3,
  answerWeight: 5,
  shareWeight: 2,
  updateFrequency: '5',
  listSize: 50,
  decayFactor: 0.8
})

const getRankBg = (rank) => {
  if (rank === 1) return 'bg-red-500'
  if (rank === 2) return 'bg-orange-500'
  if (rank === 3) return 'bg-yellow-500'
  return 'bg-gray-400'
}

const globalHotList = ref([
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', hot: '1856万', isUp: true },
  { id: 2, title: '35岁程序员如何规划职业发展？', hot: '1523万', isUp: true },
  { id: 3, title: '2026年最值得学习的编程语言是什么？', hot: '1245万', isUp: false },
  { id: 4, title: '第一次养猫需要准备什么？', hot: '986万', isUp: true },
  { id: 5, title: '长期失眠应该怎么调理？', hot: '876万', isUp: false },
])

const countryHotList = ref([
  { id: 1, title: '2026年新能源汽车补贴政策有哪些变化？', hot: '2156万' },
  { id: 2, title: '医保改革后个人账户怎么用更划算？', hot: '1823万' },
  { id: 3, title: '房产税试点城市有哪些新动态？', hot: '1567万' },
  { id: 4, title: '延迟退休政策对80后影响有多大？', hot: '1234万' },
  { id: 5, title: '教育双减政策实施效果如何？', hot: '1098万' },
])

const industryHotList = ref([
  { id: 1, title: 'AI大模型会取代程序员吗？', hot: '2567万' },
  { id: 2, title: '新能源行业未来5年发展趋势？', hot: '2134万' },
  { id: 3, title: '医疗健康行业有哪些创业机会？', hot: '1876万' },
  { id: 4, title: '金融科技如何改变传统银行？', hot: '1543万' },
  { id: 5, title: '教育培训行业转型方向在哪？', hot: '1234万' },
])
</script>
