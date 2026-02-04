import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
  { path: '/users', name: 'Users', component: () => import('@/views/Users.vue') },
  { path: '/occupations', name: 'Occupations', component: () => import('@/views/Occupations.vue') },
  { path: '/questions', name: 'Questions', component: () => import('@/views/Questions.vue') },
  { path: '/categories', name: 'Categories', component: () => import('@/views/Categories.vue') },
  { path: '/answers', name: 'Answers', component: () => import('@/views/Answers.vue') },
  { path: '/comments', name: 'Comments', component: () => import('@/views/Comments.vue') },
  { path: '/topics', name: 'Topics', component: () => import('@/views/Topics.vue') },
  { path: '/activities', name: 'Activities', component: () => import('@/views/Activities.vue') },
  { path: '/emergency', name: 'Emergency', component: () => import('@/views/Emergency.vue') },
  { path: '/groups', name: 'Groups', component: () => import('@/views/Groups.vue') },
  { path: '/hotlist', name: 'HotList', component: () => import('@/views/HotList.vue') },
  { path: '/hotlist-tags', name: 'HotListTags', component: () => import('@/views/HotListTags.vue') },
  { path: '/regions', name: 'Regions', component: () => import('@/views/Regions.vue') },
  { path: '/messages', name: 'Messages', component: () => import('@/views/Messages.vue') },
  { path: '/finance', name: 'Finance', component: () => import('@/views/Finance.vue') },
  { path: '/reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
  { path: '/permissions', name: 'Permissions', component: () => import('@/views/Permissions.vue') },
  { path: '/settings', name: 'Settings', component: () => import('@/views/Settings.vue') },
  { path: '/question-bank', name: 'QuestionBank', component: () => import('@/views/QuestionBank.vue') },
  { path: '/exam-management', name: 'ExamManagement', component: () => import('@/views/ExamManagement.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
