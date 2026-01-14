<template>
  <div>
    <div class="grid grid-cols-5 gap-4 mb-6">
      <StatCard title="待处理" value="23" valueClass="text-red-500" icon="fas fa-clock" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="今日新增" value="8" valueClass="text-yellow-500" icon="fas fa-plus" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
      <StatCard title="已处理" value="1,256" valueClass="text-green-500" icon="fas fa-check" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="有效举报" value="856" valueClass="text-blue-500" icon="fas fa-flag" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="处理率" value="98.2%" icon="fas fa-chart-line" iconBg="bg-purple-100" iconColor="text-purple-500" />
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <div class="p-4 flex items-center gap-4 border-b border-gray-100">
        <el-select v-model="statusFilter" placeholder="全部状态" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="有效" value="valid" />
          <el-option label="无效" value="invalid" />
        </el-select>
        <el-select v-model="typeFilter" placeholder="举报类型" clearable>
          <el-option label="垃圾广告" value="spam" />
          <el-option label="辱骂攻击" value="abuse" />
          <el-option label="违法信息" value="illegal" />
          <el-option label="色情内容" value="porn" />
          <el-option label="其他" value="other" />
        </el-select>
        <el-select v-model="contentFilter" placeholder="内容类型" clearable>
          <el-option label="问题" value="question" />
          <el-option label="回答" value="answer" />
          <el-option label="评论" value="comment" />
          <el-option label="用户" value="user" />
        </el-select>
      </div>

      <div class="divide-y divide-gray-100">
        <div v-for="report in reports" :key="report.id" :class="['p-4', report.status === 'pending' ? 'bg-red-50' : '']">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span :class="['px-2 py-1 text-white text-xs rounded', statusClass[report.status]]">{{ statusText[report.status] }}</span>
                <span class="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">{{ report.type }}</span>
                <span :class="['px-2 py-1 text-xs rounded', contentClass[report.contentType]]">{{ report.contentType }}</span>
                <span v-if="report.count > 1" class="text-xs text-gray-400">举报次数: {{ report.count }}</span>
              </div>
              <div :class="['p-3 rounded-lg mb-3', report.status === 'pending' ? 'bg-white border border-red-200' : 'bg-gray-50']">
                <div class="text-xs text-gray-500 mb-1">{{ report.status === 'pending' ? '被举报内容：' : '举报原因：' }}</div>
                <p class="text-sm text-gray-700">{{ report.content }}</p>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span v-if="report.status === 'pending'">被举报用户：<span class="text-gray-700">{{ report.reportedUser }}</span></span>
                <span v-if="report.status === 'pending'">举报人：<span class="text-gray-700">{{ report.reporter }}</span></span>
                <span v-if="report.result">处理结果：<span :class="report.result.includes('有效') ? 'text-green-500' : 'text-gray-500'">{{ report.result }}</span></span>
                <span>{{ report.status === 'pending' ? '举报时间' : '处理时间' }}：{{ report.time }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <template v-if="report.status === 'pending'">
                <el-button type="success" size="small"><i class="fas fa-check mr-1"></i>有效</el-button>
                <el-button size="small"><i class="fas fa-times mr-1"></i>忽略</el-button>
              </template>
              <el-button size="small"><i class="fas fa-eye mr-1"></i>查看</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 1,279 条记录</span>
        <el-pagination layout="prev, pager, next" :total="100" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const statusFilter = ref('')
const typeFilter = ref('')
const contentFilter = ref('')
const statusText = { pending: '待处理', valid: '已处理', invalid: '已忽略' }
const statusClass = { pending: 'bg-red-500', valid: 'bg-green-500', invalid: 'bg-gray-400' }
const contentClass = { '回答': 'bg-blue-100 text-blue-600', '评论': 'bg-purple-100 text-purple-600', '问题': 'bg-green-100 text-green-600', '用户': 'bg-orange-100 text-orange-600' }

const reports = ref([
  { id: 1, status: 'pending', type: '垃圾广告', contentType: '回答', count: 5, content: '[广告内容] 加微信xxx，免费领取Python学习资料...', reportedUser: '广告用户001', reporter: '张三丰 等5人', time: '2024-01-14 11:30' },
  { id: 2, status: 'pending', type: '辱骂攻击', contentType: '评论', count: 3, content: '[不当言论] 你这个***，根本不懂...', reportedUser: '暴躁用户', reporter: '李小龙 等3人', time: '2024-01-14 10:15' },
  { id: 3, status: 'valid', type: '内容不相关', contentType: '问题', count: 1, content: '这个问题和话题不相关...', result: '有效 - 已删除内容', time: '2024-01-13 16:30' },
  { id: 4, status: 'invalid', type: '其他', contentType: '用户', count: 1, content: '该用户头像不好看（无效举报）', result: '无效 - 已忽略', time: '2024-01-12 09:00' },
])
</script>
