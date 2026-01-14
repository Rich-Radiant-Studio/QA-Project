<template>
  <aside class="w-64 bg-gray-900 text-white flex-shrink-0">
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <i class="fas fa-question-circle text-xl"></i>
        </div>
        <span class="ml-3 font-bold text-lg">问答管理后台</span>
      </div>
    </div>
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path" 
            :class="['flex items-center px-4 py-3 rounded-lg transition-colors', 
              isActive(item.path) ? 'nav-item active' : 'text-gray-300 hover:bg-gray-800']">
            <i :class="[item.icon, 'w-5']"></i>
            <span class="ml-3">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const isActive = (path) => route.path === path

const menuItems = [
  { path: '/', name: '数据概览', icon: 'fas fa-tachometer-alt' },
  { path: '/users', name: '用户管理', icon: 'fas fa-users' },
  { path: '/questions', name: '问题管理', icon: 'fas fa-question' },
  { path: '/answers', name: '回答管理', icon: 'fas fa-comment-dots' },
  { path: '/topics', name: '话题管理', icon: 'fas fa-hashtag' },
  { path: '/messages', name: '消息管理', icon: 'fas fa-bell' },
  { path: '/finance', name: '财务管理', icon: 'fas fa-wallet' },
  { path: '/reports', name: '举报管理', icon: 'fas fa-flag' },
  { path: '/settings', name: '系统设置', icon: 'fas fa-cog' },
]
</script>
