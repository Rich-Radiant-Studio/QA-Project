import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
  { path: '/users', name: 'Users', component: () => import('@/views/Users.vue') },
  { path: '/questions', name: 'Questions', component: () => import('@/views/Questions.vue') },
  { path: '/answers', name: 'Answers', component: () => import('@/views/Answers.vue') },
  { path: '/topics', name: 'Topics', component: () => import('@/views/Topics.vue') },
  { path: '/messages', name: 'Messages', component: () => import('@/views/Messages.vue') },
  { path: '/finance', name: 'Finance', component: () => import('@/views/Finance.vue') },
  { path: '/reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
  { path: '/settings', name: 'Settings', component: () => import('@/views/Settings.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
