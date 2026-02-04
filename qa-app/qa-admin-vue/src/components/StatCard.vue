<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-500">{{ title }}</div>
        <div class="text-2xl font-bold mt-1" :class="valueClass">{{ value }}</div>
        <div v-if="change" class="text-xs mt-1" :class="change > 0 ? 'text-green-500' : 'text-red-500'">
          <i :class="change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          {{ Math.abs(change) }}% 较昨日
        </div>
      </div>
      <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="iconBg">
        <i :class="[icon, 'text-xl', iconColor]"></i>
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
  valueClass: String
})
</script>
