<template>
  <div>
    <!-- 待处理事项 -->
    <div class="bg-gradient-to-r from-red-50 to-purple-50 rounded-xl shadow-sm mb-6 border border-red-100">
      <div class="px-5 py-3 border-b border-red-100/50">
        <h2 class="font-semibold text-base flex items-center text-gray-800">
          <i class="fas fa-bell text-red-500 mr-2"></i>
          待处理事项
        </h2>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-3 gap-4">
          <router-link v-for="item in pendingItems" :key="item.title" :to="item.link"
            class="bg-white rounded-lg p-4 transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shadow-sm', item.iconBg]">
                <i :class="[item.icon, 'text-white text-lg']"></i>
              </div>
              <div :class="['text-3xl font-bold', item.countColor]">{{ item.count }}</div>
            </div>
            <div class="text-sm font-medium text-gray-700">{{ item.title }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ item.desc }}</div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 用户数据 -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fas fa-users text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">用户数据</h2>
            <p class="text-xs text-gray-500">User Statistics</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button 
            v-for="filter in timeFilters" 
            :key="filter.value"
            @click="selectedTimeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              selectedTimeFilter === filter.value 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <el-date-picker
            v-if="selectedTimeFilter === 'day'"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 240px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="selectedTimeFilter === 'month'"
            v-model="monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            size="small"
            style="width: 240px"
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
          <div v-else-if="selectedTimeFilter === 'year'" class="flex items-center gap-2">
            <el-date-picker
              v-model="yearRangeStart"
              type="year"
              placeholder="开始年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
            <span class="text-gray-400 text-xs">至</span>
            <el-date-picker
              v-model="yearRangeEnd"
              type="year"
              placeholder="结束年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="用户总数" value="125,680" :change="12.5" icon="fas fa-users" iconBg="bg-blue-100" iconColor="text-blue-500" />
        <StatCard title="今日新增" value="1,256" icon="fas fa-user-plus" iconBg="bg-blue-100" iconColor="text-blue-500" />
        <StatCard title="本月新增" value="15,680" icon="fas fa-user-friends" iconBg="bg-blue-100" iconColor="text-blue-500" />
        <StatCard title="今年新增" value="45,230" icon="fas fa-users-cog" iconBg="bg-blue-100" iconColor="text-blue-500" />
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">用户增长趋势</h3>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ getChartPeriodText() }}</span>
        </div>
        <div style="height: 200px; position: relative;">
          <canvas ref="userChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 问题数据 -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fas fa-question-circle text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">问题数据</h2>
            <p class="text-xs text-gray-500">Question Statistics</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button 
            v-for="filter in timeFilters" 
            :key="filter.value"
            @click="selectedTimeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              selectedTimeFilter === filter.value 
                ? 'bg-green-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <el-date-picker
            v-if="selectedTimeFilter === 'day'"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 240px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="selectedTimeFilter === 'month'"
            v-model="monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            size="small"
            style="width: 240px"
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
          <div v-else-if="selectedTimeFilter === 'year'" class="flex items-center gap-2">
            <el-date-picker
              v-model="yearRangeStart"
              type="year"
              placeholder="开始年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
            <span class="text-gray-400 text-xs">至</span>
            <el-date-picker
              v-model="yearRangeEnd"
              type="year"
              placeholder="结束年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="问题总数" value="45,230" :change="8.3" icon="fas fa-question" iconBg="bg-green-100" iconColor="text-green-500" />
        <StatCard title="今日新增" value="568" icon="fas fa-plus-circle" iconBg="bg-green-100" iconColor="text-green-500" />
        <StatCard title="本月新增" value="6,890" icon="fas fa-question-circle" iconBg="bg-green-100" iconColor="text-green-500" />
        <StatCard title="今年新增" value="18,450" icon="fas fa-clipboard-question" iconBg="bg-green-100" iconColor="text-green-500" />
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">问题增长趋势</h3>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ getChartPeriodText() }}</span>
        </div>
        <div style="height: 200px; position: relative;">
          <canvas ref="questionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 回答数据 -->
    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 mb-6 border border-purple-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fas fa-comment-dots text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">回答数据</h2>
            <p class="text-xs text-gray-500">Answer Statistics</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button 
            v-for="filter in timeFilters" 
            :key="filter.value"
            @click="selectedTimeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              selectedTimeFilter === filter.value 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <el-date-picker
            v-if="selectedTimeFilter === 'day'"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 240px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="selectedTimeFilter === 'month'"
            v-model="monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            size="small"
            style="width: 240px"
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
          <div v-else-if="selectedTimeFilter === 'year'" class="flex items-center gap-2">
            <el-date-picker
              v-model="yearRangeStart"
              type="year"
              placeholder="开始年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
            <span class="text-gray-400 text-xs">至</span>
            <el-date-picker
              v-model="yearRangeEnd"
              type="year"
              placeholder="结束年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="回答总数" value="189,450" :change="15.2" icon="fas fa-comment-dots" iconBg="bg-purple-100" iconColor="text-purple-500" />
        <StatCard title="今日新增" value="2,345" icon="fas fa-comment-medical" iconBg="bg-purple-100" iconColor="text-purple-500" />
        <StatCard title="本月新增" value="28,560" icon="fas fa-comments" iconBg="bg-purple-100" iconColor="text-purple-500" />
        <StatCard title="今年新增" value="76,890" icon="fas fa-comment-alt" iconBg="bg-purple-100" iconColor="text-purple-500" />
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">回答增长趋势</h3>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ getChartPeriodText() }}</span>
        </div>
        <div style="height: 200px; position: relative;">
          <canvas ref="answerChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 团队数据 -->
    <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fas fa-users-cog text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">团队数据</h2>
            <p class="text-xs text-gray-500">Team Statistics</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button 
            v-for="filter in timeFilters" 
            :key="filter.value"
            @click="selectedTimeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              selectedTimeFilter === filter.value 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <el-date-picker
            v-if="selectedTimeFilter === 'day'"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 240px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="selectedTimeFilter === 'month'"
            v-model="monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            size="small"
            style="width: 240px"
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
          <div v-else-if="selectedTimeFilter === 'year'" class="flex items-center gap-2">
            <el-date-picker
              v-model="yearRangeStart"
              type="year"
              placeholder="开始年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
            <span class="text-gray-400 text-xs">至</span>
            <el-date-picker
              v-model="yearRangeEnd"
              type="year"
              placeholder="结束年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="团队总数" value="3,458" :change="22.3" icon="fas fa-users-cog" iconBg="bg-indigo-100" iconColor="text-indigo-500" />
        <StatCard title="今日新增" value="89" icon="fas fa-user-friends" iconBg="bg-indigo-100" iconColor="text-indigo-500" />
        <StatCard title="本月新增" value="456" icon="fas fa-users" iconBg="bg-indigo-100" iconColor="text-indigo-500" />
        <StatCard title="今年新增" value="1,234" icon="fas fa-user-plus" iconBg="bg-indigo-100" iconColor="text-indigo-500" />
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">团队增长趋势</h3>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ getChartPeriodText() }}</span>
        </div>
        <div style="height: 200px; position: relative;">
          <canvas ref="teamChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 活动数据 -->
    <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 mb-6 border border-orange-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fas fa-calendar-alt text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">活动数据</h2>
            <p class="text-xs text-gray-500">Activity Statistics</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button 
            v-for="filter in timeFilters" 
            :key="filter.value"
            @click="selectedTimeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              selectedTimeFilter === filter.value 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <el-date-picker
            v-if="selectedTimeFilter === 'day'"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 240px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="selectedTimeFilter === 'month'"
            v-model="monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            size="small"
            style="width: 240px"
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
          <div v-else-if="selectedTimeFilter === 'year'" class="flex items-center gap-2">
            <el-date-picker
              v-model="yearRangeStart"
              type="year"
              placeholder="开始年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
            <span class="text-gray-400 text-xs">至</span>
            <el-date-picker
              v-model="yearRangeEnd"
              type="year"
              placeholder="结束年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="活动总数" value="1,256" :change="18.5" icon="fas fa-calendar-alt" iconBg="bg-orange-100" iconColor="text-orange-500" />
        <StatCard title="今日新增" value="45" icon="fas fa-calendar-plus" iconBg="bg-orange-100" iconColor="text-orange-500" />
        <StatCard title="本月新增" value="234" icon="fas fa-calendar-check" iconBg="bg-orange-100" iconColor="text-orange-500" />
        <StatCard title="今年新增" value="678" icon="fas fa-calendar-day" iconBg="bg-orange-100" iconColor="text-orange-500" />
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">活动增长趋势</h3>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ getChartPeriodText() }}</span>
        </div>
        <div style="height: 200px; position: relative;">
          <canvas ref="activityChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 悬赏数据 -->
    <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-6 mb-6 border border-yellow-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fas fa-coins text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">悬赏数据</h2>
            <p class="text-xs text-gray-500">Reward Statistics</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button 
            v-for="filter in timeFilters" 
            :key="filter.value"
            @click="selectedTimeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              selectedTimeFilter === filter.value 
                ? 'bg-yellow-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ filter.label }}
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <el-date-picker
            v-if="selectedTimeFilter === 'day'"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 240px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="selectedTimeFilter === 'month'"
            v-model="monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            size="small"
            style="width: 240px"
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
          <div v-else-if="selectedTimeFilter === 'year'" class="flex items-center gap-2">
            <el-date-picker
              v-model="yearRangeStart"
              type="year"
              placeholder="开始年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
            <span class="text-gray-400 text-xs">至</span>
            <el-date-picker
              v-model="yearRangeEnd"
              type="year"
              placeholder="结束年份"
              size="small"
              style="width: 110px"
              format="YYYY"
              value-format="YYYY"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="悬赏总额" value="$568,900" :change="6.8" icon="fas fa-coins" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
        <StatCard title="今日新增" value="$12,560" icon="fas fa-dollar-sign" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
        <StatCard title="本月新增" value="$156,780" icon="fas fa-money-bill-wave" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
        <StatCard title="今年新增" value="$423,450" icon="fas fa-hand-holding-usd" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">悬赏金额趋势</h3>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ getChartPeriodText() }}</span>
        </div>
        <div style="height: 200px; position: relative;">
          <canvas ref="rewardChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import Chart from 'chart.js/auto'

const userChart = ref(null)
const questionChart = ref(null)
const answerChart = ref(null)
const rewardChart = ref(null)
const activityChart = ref(null)
const teamChart = ref(null)

// 时间筛选器
const selectedTimeFilter = ref('day')
const timeFilters = [
  { label: '按日', value: 'day', icon: 'fas fa-calendar-day' },
  { label: '按月', value: 'month', icon: 'fas fa-calendar-alt' },
  { label: '按年', value: 'year', icon: 'fas fa-calendar' }
]

// 日期范围选择
const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

const dateRange = ref([
  thirtyDaysAgo.toISOString().split('T')[0],
  today.toISOString().split('T')[0]
])

const monthRange = ref([
  `${today.getFullYear()}-01`,
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
])

const yearRangeStart = ref((today.getFullYear() - 4).toString())
const yearRangeEnd = ref(today.getFullYear().toString())

const pendingItems = [
  { title: '举报待处理', desc: '需要审核', count: 23, icon: 'fas fa-flag', iconBg: 'bg-red-500', bgColor: 'bg-red-50', countColor: 'text-red-500', link: '/reports' },
  { title: '紧急求助', desc: '待处理', count: 8, icon: 'fas fa-exclamation-triangle', iconBg: 'bg-red-500', bgColor: 'bg-red-50', countColor: 'text-red-500', link: '/emergency' },
  { title: '提现申请', desc: '待处理', count: 6, icon: 'fas fa-money-bill', iconBg: 'bg-purple-500', bgColor: 'bg-purple-50', countColor: 'text-purple-500', link: '/finance' },
]

// 存储图表实例
const chartInstances = ref({})

// 获取图表周期文本
const getChartPeriodText = () => {
  if (selectedTimeFilter.value === 'day') {
    if (dateRange.value && dateRange.value.length === 2) {
      return `日期：${dateRange.value[0]} 至 ${dateRange.value[1]}`
    }
    return '日期：未选择'
  } else if (selectedTimeFilter.value === 'month') {
    if (monthRange.value && monthRange.value.length === 2) {
      const [startYear, startMonth] = monthRange.value[0].split('-')
      const [endYear, endMonth] = monthRange.value[1].split('-')
      return `月份：${startYear}年${startMonth}月 至 ${endYear}年${endMonth}月`
    }
    return '月份：未选择'
  } else {
    if (yearRangeStart.value && yearRangeEnd.value) {
      return `年份：${yearRangeStart.value}年 至 ${yearRangeEnd.value}年`
    }
    return '年份：未选择'
  }
}

// 生成日期标签
const generateLabels = (type) => {
  const labels = []
  
  if (type === 'day') {
    // 显示选中日期范围内的所有日期
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = new Date(dateRange.value[0])
      const endDate = new Date(dateRange.value[1])
      const currentDate = new Date(startDate)
      
      while (currentDate <= endDate) {
        labels.push(`${currentDate.getMonth() + 1}/${currentDate.getDate()}`)
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
  } else if (type === 'month') {
    // 显示选中月份范围内的所有月份
    if (monthRange.value && monthRange.value.length === 2) {
      const [startYear, startMonth] = monthRange.value[0].split('-').map(Number)
      const [endYear, endMonth] = monthRange.value[1].split('-').map(Number)
      
      let year = startYear
      let month = startMonth
      
      while (year < endYear || (year === endYear && month <= endMonth)) {
        labels.push(`${year}年${month}月`)
        month++
        if (month > 12) {
          month = 1
          year++
        }
      }
    }
  } else if (type === 'year') {
    // 显示选中年份范围内的所有年份
    if (yearRangeStart.value && yearRangeEnd.value) {
      const startYear = parseInt(yearRangeStart.value)
      const endYear = parseInt(yearRangeEnd.value)
      
      for (let year = startYear; year <= endYear; year++) {
        labels.push(`${year}年`)
      }
    }
  }
  
  return labels
}

// 生成模拟数据
const generateData = (base, variance, type) => {
  const data = []
  const count = type === 'day' ? 30 : type === 'month' ? 12 : 5
  
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(base + Math.random() * variance))
  }
  return data
}

// 创建图表
const createChart = (canvas, label, baseValue, variance, color) => {
  if (!canvas) {
    console.error('Canvas element not found for', label)
    return null
  }
  
  try {
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: generateLabels(selectedTimeFilter.value),
        datasets: [{
          label: label,
          data: generateData(baseValue, variance, selectedTimeFilter.value),
          borderColor: color,
          backgroundColor: color + '20',
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: color,
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 10,
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    })
    
    console.log('Chart created successfully:', label)
    return chart
  } catch (error) {
    console.error('Error creating chart:', label, error)
    return null
  }
}

// 更新所有图表
const updateAllCharts = () => {
  Object.values(chartInstances.value).forEach(chart => {
    if (chart) chart.destroy()
  })
  
  chartInstances.value = {
    user: createChart(userChart.value, '每日新增用户', 800, 600, '#3b82f6'),
    question: createChart(questionChart.value, '每日新增问题', 300, 200, '#10b981'),
    answer: createChart(answerChart.value, '每日新增回答', 1200, 800, '#8b5cf6'),
    reward: createChart(rewardChart.value, '每日悬赏金额 ($)', 15000, 10000, '#f59e0b'),
    activity: createChart(activityChart.value, '每日新增活动', 30, 20, '#f97316'),
    team: createChart(teamChart.value, '每日新增团队', 80, 50, '#6366f1')
  }
}

// 监听筛选条件变化
watch(selectedTimeFilter, () => {
  updateAllCharts()
})

watch(dateRange, () => {
  if (selectedTimeFilter.value === 'day') {
    updateAllCharts()
  }
}, { deep: true })

watch(monthRange, () => {
  if (selectedTimeFilter.value === 'month') {
    updateAllCharts()
  }
}, { deep: true })

watch([yearRangeStart, yearRangeEnd], () => {
  if (selectedTimeFilter.value === 'year') {
    updateAllCharts()
  }
})

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    console.log('Initializing charts...')
    updateAllCharts()
    console.log('All charts initialized')
  }, 100)
})
</script>
