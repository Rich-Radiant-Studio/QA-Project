<template>
  <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
    <div class="flex items-center">
      <h1 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <el-badge :value="5" class="cursor-pointer">
        <i class="fas fa-bell text-xl text-gray-500"></i>
      </el-badge>
      <el-dropdown>
        <div class="flex items-center gap-3 cursor-pointer">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" class="w-10 h-10 rounded-full">
          <div>
            <div class="text-sm font-medium">管理员</div>
            <div class="text-xs text-gray-500">超级管理员</div>
          </div>
          <i class="fas fa-chevron-down text-gray-400"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const titles = { 
  '/': '数据概览', 
  '/users': '用户管理', 
  '/questions': '问题管理', 
  '/answers': '回答管理',
  '/topics': '话题管理', 
  '/messages': '消息管理', 
  '/finance': '财务管理', 
  '/reports': '举报管理', 
  '/settings': '系统设置',
  '/occupations': '职业管理'
}
const pageTitle = computed(() => titles[route.path] || '后台管理')
</script>
