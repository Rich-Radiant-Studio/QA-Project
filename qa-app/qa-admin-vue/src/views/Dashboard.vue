<template>
  <div>
    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-6 mb-6">
      <StatCard title="总用户数" value="125,680" :change="12.5" icon="fas fa-users" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="问题总数" value="45,230" :change="8.3" icon="fas fa-question" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="回答总数" value="189,450" :change="15.2" icon="fas fa-comment-dots" iconBg="bg-purple-100" iconColor="text-purple-500" />
      <StatCard title="悬赏总额" value="$568,900" :change="-3.1" icon="fas fa-coins" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
    </div>
    <div class="grid grid-cols-5 gap-6 mb-6">
      <StatCard title="今日新增用户" value="1,256" icon="fas fa-user-plus" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="今日新增问题" value="568" icon="fas fa-plus-circle" iconBg="bg-indigo-100" iconColor="text-indigo-500" />
      <StatCard title="活动进行中" value="45" valueClass="text-green-500" icon="fas fa-calendar-alt" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="紧急求助待处理" value="23" valueClass="text-red-500" icon="fas fa-exclamation-triangle" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="问题解决率" value="78.5%" icon="fas fa-check-circle" iconBg="bg-teal-100" iconColor="text-teal-500" />
    </div>

    <div class="grid grid-cols-3 gap-6 mb-6">
      <!-- 最新问题 -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold">最新问题</h2>
          <router-link to="/questions" class="text-red-500 text-sm">查看全部</router-link>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="q in latestQuestions" :key="q.id" class="px-6 py-4 flex items-center">
            <img :src="q.avatar" class="w-10 h-10 rounded-full">
            <div class="ml-4 flex-1">
              <div class="flex items-center">
                <span class="font-medium text-sm">{{ q.title }}</span>
                <span :class="['ml-2 px-2 py-0.5 text-white text-xs rounded-full', q.typeClass]">{{ q.type }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ q.author }} · {{ q.time }}</div>
            </div>
            <span :class="['px-2 py-1 text-xs rounded', q.statusClass]">{{ q.status }}</span>
          </div>
        </div>
      </div>

      <!-- 待处理事项 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="font-bold">待处理事项</h2>
        </div>
        <div class="p-4 space-y-3">
          <router-link v-for="item in pendingItems" :key="item.title" :to="item.link"
            :class="['flex items-center p-3 rounded-lg', item.bgColor]">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center', item.iconBg]">
              <i :class="[item.icon, 'text-white text-sm']"></i>
            </div>
            <div class="ml-3 flex-1">
              <div class="text-sm font-medium">{{ item.title }}</div>
              <div class="text-xs text-gray-500">{{ item.desc }}</div>
            </div>
            <span :class="['font-bold', item.countColor]">{{ item.count }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 热门活动 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold">热门活动</h2>
          <router-link to="/activities" class="text-red-500 text-sm">查看全部</router-link>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="activity in hotActivities" :key="activity.id" class="flex items-center">
            <img :src="activity.image" class="w-16 h-10 rounded object-cover">
            <div class="ml-3 flex-1">
              <div class="text-sm font-medium line-clamp-1">{{ activity.title }}</div>
              <div class="text-xs text-gray-400">{{ activity.participants }} 人参与</div>
            </div>
            <span :class="['px-2 py-0.5 text-xs rounded', activity.type === 'online' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600']">
              {{ activity.type === 'online' ? '线上' : '线下' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 紧急求助 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold text-red-500"><i class="fas fa-exclamation-triangle mr-2"></i>紧急求助</h2>
          <router-link to="/emergency" class="text-red-500 text-sm">查看全部</router-link>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="emergency in emergencyList" :key="emergency.id" class="p-3 bg-red-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span class="ml-2 text-sm font-medium">{{ emergency.title }}</span>
            </div>
            <div class="text-xs text-gray-500 mt-1 line-clamp-1">{{ emergency.description }}</div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-gray-400"><i class="fas fa-map-marker-alt mr-1"></i>{{ emergency.location }}</span>
              <span class="text-xs text-red-500">{{ emergency.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 热榜概览 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold"><i class="fas fa-fire text-red-500 mr-2"></i>热榜 TOP5</h2>
          <router-link to="/hotlist" class="text-red-500 text-sm">查看全部</router-link>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(item, idx) in hotList" :key="item.id" class="px-4 py-3 flex items-start">
            <div :class="['w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold', getRankBg(idx + 1)]">
              {{ idx + 1 }}
            </div>
            <div class="ml-3 flex-1">
              <div class="text-sm line-clamp-1">{{ item.title }}</div>
              <div class="text-xs text-red-500 mt-1">{{ item.hot }} 热度</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'

const getRankBg = (rank) => {
  if (rank === 1) return 'bg-red-500'
  if (rank === 2) return 'bg-orange-500'
  if (rank === 3) return 'bg-yellow-500'
  return 'bg-gray-400'
}

const latestQuestions = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', type: '悬赏 $50', typeClass: 'bg-gradient-to-r from-red-500 to-orange-500',
    author: '张三丰', time: '2小时前', status: '待审核', statusClass: 'bg-yellow-100 text-yellow-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
  { id: 2, title: '第一次养猫需要准备什么？', type: '公开', typeClass: 'bg-gradient-to-r from-green-500 to-teal-500',
    author: '李小龙', time: '5小时前', status: '已通过', statusClass: 'bg-green-100 text-green-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' },
  { id: 3, title: '长期失眠应该怎么调理？', type: '定向', typeClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    author: '王医生', time: '昨天', status: '已通过', statusClass: 'bg-green-100 text-green-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3' },
  { id: 4, title: '35岁程序员如何规划职业发展？', type: '悬赏 $100', typeClass: 'bg-gradient-to-r from-red-500 to-orange-500',
    author: '程序员小明', time: '3小时前', status: '已拒绝', statusClass: 'bg-red-100 text-red-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4' },
]

const pendingItems = [
  { title: '举报待处理', desc: '23条举报需要审核', count: 23, icon: 'fas fa-flag', iconBg: 'bg-red-500', bgColor: 'bg-red-50', countColor: 'text-red-500', link: '/reports' },
  { title: '问题待审核', desc: '15个问题等待审核', count: 15, icon: 'fas fa-question', iconBg: 'bg-yellow-500', bgColor: 'bg-yellow-50', countColor: 'text-yellow-500', link: '/questions' },
  { title: '紧急求助', desc: '8个紧急求助待处理', count: 8, icon: 'fas fa-exclamation-triangle', iconBg: 'bg-red-500', bgColor: 'bg-red-50', countColor: 'text-red-500', link: '/emergency' },
  { title: '活动待审核', desc: '12个活动待审核', count: 12, icon: 'fas fa-calendar-alt', iconBg: 'bg-blue-500', bgColor: 'bg-blue-50', countColor: 'text-blue-500', link: '/activities' },
  { title: '提现申请', desc: '6个提现待处理', count: 6, icon: 'fas fa-money-bill', iconBg: 'bg-purple-500', bgColor: 'bg-purple-50', countColor: 'text-purple-500', link: '/finance' },
]

const hotActivities = [
  { id: 1, title: '新人答题挑战赛', participants: 12580, type: 'online', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=120&fit=crop' },
  { id: 2, title: 'Python学习打卡活动', participants: 8956, type: 'online', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=120&fit=crop' },
  { id: 3, title: '程序员线下交流会', participants: 156, type: 'offline', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=120&fit=crop' },
]

const emergencyList = [
  { id: 1, title: '老人走失急寻', description: '我父亲今天下午2点从家里出门后一直没有回来...', location: '北京市朝阳区', time: '10分钟前' },
  { id: 2, title: '急需O型血', description: '家人手术急需O型血，医院血库告急...', location: '广州市天河区', time: '30分钟前' },
]

const hotList = [
  { id: 1, title: '如何在三个月内从零基础学会Python编程？', hot: '1856万' },
  { id: 2, title: '35岁程序员如何规划职业发展？', hot: '1523万' },
  { id: 3, title: '2026年最值得学习的编程语言是什么？', hot: '1245万' },
  { id: 4, title: '第一次养猫需要准备什么？', hot: '986万' },
  { id: 5, title: '长期失眠应该怎么调理？', hot: '876万' },
]
</script>
