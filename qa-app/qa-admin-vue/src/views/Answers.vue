<template>
  <div>
    <div class="grid grid-cols-5 gap-4 mb-6">
      <StatCard title="回答总数" value="189,450" icon="fas fa-comment-dots" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="待审核" value="28" valueClass="text-yellow-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      <StatCard title="已采纳" value="35,680" valueClass="text-green-500" icon="fas fa-check-circle" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="精选回答" value="12,450" valueClass="text-blue-500" icon="fas fa-star" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="今日新增" value="1,256" valueClass="text-purple-500" icon="fas fa-plus" iconBg="bg-purple-100" iconColor="text-purple-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <div class="p-4 flex items-center justify-between border-b border-gray-100">
        <div class="flex items-center gap-4">
          <el-input v-model="searchQuery" placeholder="搜索回答内容、ID" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="statusFilter" placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已采纳" value="adopted" />
            <el-option label="精选" value="featured" />
          </el-select>
        </div>
        <el-button type="default"><i class="fas fa-download mr-2"></i>导出</el-button>
      </div>

      <div class="divide-y divide-gray-100">
        <div v-for="answer in answers" :key="answer.id" :class="['p-4', answer.reported ? 'bg-red-50' : '']">
          <div class="flex items-start">
            <img :src="answer.avatar" class="w-10 h-10 rounded-full">
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="font-medium">{{ answer.author }}</span>
                  <i v-if="answer.verified" class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>
                  <span v-for="tag in answer.tags" :key="tag.text" :class="['ml-2 px-2 py-0.5 text-xs rounded', tag.class]">{{ tag.text }}</span>
                </div>
                <span class="text-xs text-gray-400">{{ answer.time }}</span>
              </div>
              <div :class="['mt-2 p-3 rounded-lg', answer.reported ? 'bg-white border border-red-200' : 'bg-gray-50']">
                <div class="text-xs text-gray-500 mb-1">回答问题：{{ answer.question }}</div>
                <p class="text-sm text-gray-700 line-clamp-3">{{ answer.content }}</p>
              </div>
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span><i class="far fa-thumbs-up mr-1"></i>{{ answer.likes }}</span>
                  <span><i class="far fa-thumbs-down mr-1"></i>{{ answer.dislikes }}</span>
                  <span><i class="far fa-comment mr-1"></i>{{ answer.comments }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <el-button v-if="answer.status === 'pending'" type="success" size="small">通过</el-button>
                  <el-button v-if="answer.status === 'pending'" type="danger" size="small">拒绝</el-button>
                  <el-button type="default" size="small">查看</el-button>
                  <el-button type="danger" size="small">删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 189,450 条记录</span>
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const searchQuery = ref('')
const statusFilter = ref('')

const answers = ref([
  { id: 1, author: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', verified: true, status: 'adopted',
    tags: [{ text: '已采纳', class: 'bg-green-100 text-green-600' }, { text: '精选', class: 'bg-blue-100 text-blue-600' }],
    question: '如何在三个月内从零基础学会Python编程？', content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目...',
    likes: 256, dislikes: 3, comments: 23, time: '1小时前', reported: false },
  { id: 2, author: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', verified: false, status: 'pending',
    tags: [{ text: '待审核', class: 'bg-yellow-100 text-yellow-600' }],
    question: '如何在三个月内从零基础学会Python编程？', content: '我也是文科转行的，现在在做数据分析。给你几点建议：1. 不要一开始就啃书，先跟着视频教程敲代码 2. 多做项目，边学边练...',
    likes: 89, dislikes: 1, comments: 12, time: '30分钟前', reported: false },
  { id: 3, author: '可疑用户', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer4', verified: false, status: 'reported',
    tags: [{ text: '被举报 x3', class: 'bg-red-100 text-red-600' }],
    question: '第一次养猫需要准备什么？', content: '[内容包含广告/垃圾信息]',
    likes: 0, dislikes: 5, comments: 0, time: '2小时前', reported: true },
])
</script>
