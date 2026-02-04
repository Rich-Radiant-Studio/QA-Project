<template>
  <aside class="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <i class="fas fa-question-circle text-xl"></i>
        </div>
        <span class="ml-3 font-bold text-lg">问答管理后台</span>
      </div>
    </div>
    <nav class="flex-1 overflow-y-auto p-4">
      <!-- 首页 -->
      <router-link to="/" 
        :class="['flex items-center px-4 py-3 rounded-lg transition-colors mb-2', 
          isActive('/') ? 'nav-item active' : 'text-gray-300 hover:bg-gray-800']">
        <i class="fas fa-tachometer-alt w-5"></i>
        <span class="ml-3">数据概览</span>
      </router-link>

      <!-- 分组菜单 -->
      <div v-for="group in menuGroups" :key="group.name" class="mb-2">
        <div 
          class="flex items-center justify-between px-4 py-2 text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-300"
          @click="toggleGroup(group.name)"
        >
          <span>{{ group.name }}</span>
          <i :class="['fas text-xs transition-transform', expandedGroups[group.name] ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
        </div>
        <div v-show="expandedGroups[group.name]" class="space-y-1">
          <router-link 
            v-for="item in group.items" 
            :key="item.path"
            :to="item.path" 
            :class="['flex items-center px-4 py-2.5 rounded-lg transition-colors text-sm', 
              isActive(item.path) ? 'nav-item active' : 'text-gray-300 hover:bg-gray-800']"
          >
            <i :class="[item.icon, 'w-5 text-center']"></i>
            <span class="ml-3">{{ item.name }}</span>
            <span v-if="item.badge" class="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">{{ item.badge }}</span>
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- 底部用户信息 -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" class="w-9 h-9 rounded-full">
        <div class="ml-3 flex-1">
          <div class="text-sm font-medium">管理员</div>
          <div class="text-xs text-gray-400">超级管理员</div>
        </div>
        <button class="text-gray-400 hover:text-white">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path === path

const expandedGroups = reactive({
  '内容管理': true,
  '运营管理': true,
  '智慧系统': true,
  '系统管理': false,
})

const toggleGroup = (name) => {
  expandedGroups[name] = !expandedGroups[name]
}

const menuGroups = [
  {
    name: '内容管理',
    items: [
      { path: '/users', name: '用户管理', icon: 'fas fa-users' },
      { path: '/questions', name: '问题管理', icon: 'fas fa-question', badge: '15' },
      { path: '/categories', name: '问题类别', icon: 'fas fa-folder-tree' },
      { path: '/answers', name: '回答管理', icon: 'fas fa-comment-dots' },
      { path: '/comments', name: '评论管理', icon: 'fas fa-comments' },
      { path: '/topics', name: '话题管理', icon: 'fas fa-hashtag' },
    ]
  },
  {
    name: '运营管理',
    items: [
      { path: '/activities', name: '活动管理', icon: 'fas fa-calendar-alt' },
      { path: '/emergency', name: '紧急求助', icon: 'fas fa-exclamation-triangle', badge: '23' },
      { path: '/groups', name: '群聊管理', icon: 'fas fa-users-cog' },
      { path: '/hotlist', name: '热榜管理', icon: 'fas fa-fire' },
      { path: '/hotlist-tags', name: '热榜标签', icon: 'fas fa-tags' },
      { path: '/regions', name: '地区管理', icon: 'fas fa-map-marker-alt' },
      { path: '/messages', name: '消息推送', icon: 'fas fa-bell' },
      { path: '/reports', name: '举报管理', icon: 'fas fa-flag', badge: '8' },
    ]
  },
  {
    name: '智慧系统',
    items: [
      { path: '/question-bank', name: '题库管理', icon: 'fas fa-database', badge: '15' },
      { path: '/exam-management', name: '考核管理', icon: 'fas fa-clipboard-list' },
    ]
  },
  {
    name: '系统管理',
    items: [
      { path: '/finance', name: '财务管理', icon: 'fas fa-wallet' },
      { path: '/permissions', name: '权限管理', icon: 'fas fa-user-shield' },
      { path: '/settings', name: '系统设置', icon: 'fas fa-cog' },
    ]
  },
]
</script>

<style scoped>
.nav-item.active {
  background: linear-gradient(135deg, #D93A3A, #FF6B6B);
  color: white;
}

/* 自定义滚动条 */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
