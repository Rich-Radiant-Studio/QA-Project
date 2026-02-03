<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <div class="text-sm text-gray-500 mb-1">{{ title }}</div>
        <div class="text-3xl font-bold" :class="valueClass">{{ value }}</div>
        <div v-if="change" class="text-xs mt-1" :class="change > 0 ? 'text-green-500' : 'text-red-500'">
          <i :class="change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          {{ Math.abs(change) }}% 较上期
        </div>
      </div>
      <div class="w-14 h-14 rounded-lg flex items-center justify-center" :class="iconBg">
        <i :class="[icon, 'text-2xl', iconColor]"></i>
      </div>
    </div>
    
    <!-- 时间维度数据 -->
    <div class="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
      <div class="text-center">
        <div class="text-xs text-gray-400 mb-1">今日</div>
        <div class="text-lg font-semibold text-gray-700">{{ dailyValue }}</div>
      </div>
      <div class="text-center border-l border-r border-gray-100">
        <div class="text-xs text-gray-400 mb-1">本月</div>
        <div class="text-lg font-semibold text-gray-700">{{ monthlyValue }}</div>
      </div>
      <div class="text-center">
        <div class="text-xs text-gray-400 mb-1">今年</div>
        <div class="text-lg font-semibold text-gray-700">{{ yearlyValue }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  change: Number,
  icon: String,
  iconBg: { type: String, default: 'bg-blue-100' },
  iconColor: { type: String, default: 'text-blue-500' },
  valueClass: String,
  dailyValue: [String, Number],
  monthlyValue: [String, Number],
  yearlyValue: [String, Number]
})
</script>
