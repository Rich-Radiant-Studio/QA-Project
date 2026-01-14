<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="系统消息" value="256" icon="fas fa-envelope" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="紧急消息" value="12" valueClass="text-red-500" icon="fas fa-exclamation-circle" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="今日发送" value="1,568" valueClass="text-green-500" icon="fas fa-paper-plane" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="待发送" value="5" valueClass="text-yellow-500" icon="fas fa-clock" iconBg="bg-yellow-100" iconColor="text-yellow-500" />
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 发送系统消息 -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="font-bold">发送系统消息</h2>
        </div>
        <div class="p-6 space-y-4">
          <el-form label-position="top">
            <el-form-item label="消息标题">
              <el-input v-model="msgForm.title" placeholder="请输入消息标题" />
            </el-form-item>
            <el-form-item label="消息内容">
              <el-input v-model="msgForm.content" type="textarea" :rows="5" placeholder="请输入消息内容" />
            </el-form-item>
            <el-form-item label="发送对象">
              <el-select v-model="msgForm.target" style="width: 100%">
                <el-option label="全部用户" value="all" />
                <el-option label="活跃用户" value="active" />
                <el-option label="新用户（7天内）" value="new" />
                <el-option label="认证用户" value="verified" />
              </el-select>
            </el-form-item>
            <el-form-item label="消息优先级">
              <el-radio-group v-model="msgForm.priority">
                <el-radio value="high"><span class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">紧急</span></el-radio>
                <el-radio value="medium"><span class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">重要</span></el-radio>
                <el-radio value="low"><span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">普通</span></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"><i class="fas fa-paper-plane mr-2"></i>立即发送</el-button>
              <el-button><i class="fas fa-clock mr-2"></i>定时发送</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 消息模板 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold">消息模板</h2>
          <el-button type="primary" link>+ 新建</el-button>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="tpl in templates" :key="tpl.title" class="p-4 hover:bg-gray-50 cursor-pointer">
            <div class="font-medium text-sm">{{ tpl.title }}</div>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ tpl.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 已发送消息 -->
    <div class="bg-white rounded-xl shadow-sm mt-6">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 class="font-bold">已发送消息</h2>
        <el-select v-model="typeFilter" placeholder="全部类型" clearable style="width: 150px">
          <el-option label="系统通知" value="system" />
          <el-option label="紧急消息" value="urgent" />
          <el-option label="活动通知" value="activity" />
        </el-select>
      </div>
      <el-table :data="sentMessages" style="width: 100%">
        <el-table-column label="消息标题" min-width="250">
          <template #default="{ row }">
            <div class="font-medium text-sm">{{ row.title }}</div>
            <div class="text-xs text-gray-400">{{ row.preview }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="发送对象" width="120" />
        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <span :class="['px-2 py-1 text-xs rounded', priorityClass[row.priority]]">{{ priorityText[row.priority] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="160" />
        <el-table-column label="送达率" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.deliveryRate" :stroke-width="6" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default><el-button link type="primary" size="small">查看详情</el-button></template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import StatCard from '@/components/StatCard.vue'

const typeFilter = ref('')
const msgForm = reactive({ title: '', content: '', target: 'all', priority: 'low' })
const priorityText = { high: '紧急', medium: '重要', low: '普通' }
const priorityClass = { high: 'bg-red-100 text-red-600', medium: 'bg-yellow-100 text-yellow-600', low: 'bg-blue-100 text-blue-600' }

const templates = [
  { title: '悬赏问题过期提醒', content: '您发布的悬赏问题「{问题标题}」将在{时间}后过期...' },
  { title: '回答被采纳通知', content: '恭喜！您在问题「{问题标题}」的回答被采纳...' },
  { title: '账户余额不足提醒', content: '您的账户余额不足 ${金额}，可能影响悬赏问题...' },
  { title: '新粉丝通知', content: '{用户名} 关注了您' },
  { title: '系统维护通知', content: '系统将于{时间}进行维护升级...' },
]

const sentMessages = ref([
  { title: '系统维护通知', preview: '系统将于今晚22:00进行维护升级...', target: '全部用户', priority: 'high', sendTime: '2024-01-14 10:00', deliveryRate: 98 },
  { title: '新功能上线通知', preview: '问答APP新增群聊功能，快来体验...', target: '活跃用户', priority: 'medium', sendTime: '2024-01-13 15:30', deliveryRate: 95 },
  { title: '春节活动预告', preview: '春节期间回答问题双倍积分...', target: '全部用户', priority: 'low', sendTime: '2024-01-12 09:00', deliveryRate: 92 },
])
</script>
