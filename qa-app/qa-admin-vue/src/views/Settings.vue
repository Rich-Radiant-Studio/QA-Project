<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2 space-y-6">
      <!-- 网站设置 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100"><h2 class="font-bold">网站设置</h2></div>
        <div class="p-6 space-y-4">
          <el-form label-position="top">
            <el-form-item label="网站名称"><el-input v-model="settings.siteName" /></el-form-item>
            <el-form-item label="网站描述"><el-input v-model="settings.siteDesc" type="textarea" :rows="2" /></el-form-item>
            <el-form-item label="网站Logo">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-question-circle text-white text-2xl"></i>
                </div>
                <el-button>更换Logo</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 悬赏设置 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100"><h2 class="font-bold">悬赏设置</h2></div>
        <div class="p-6">
          <el-form label-position="top">
            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="最低悬赏金额">
                <el-input v-model="settings.minReward" type="number"><template #prepend>$</template></el-input>
              </el-form-item>
              <el-form-item label="最高悬赏金额">
                <el-input v-model="settings.maxReward" type="number"><template #prepend>$</template></el-input>
              </el-form-item>
              <el-form-item label="悬赏有效期（天）">
                <el-input v-model="settings.rewardDays" type="number" />
              </el-form-item>
              <el-form-item label="平台抽成比例">
                <el-input v-model="settings.commission" type="number"><template #append>%</template></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 提现设置 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100"><h2 class="font-bold">提现设置</h2></div>
        <div class="p-6">
          <el-form label-position="top">
            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="最低提现金额">
                <el-input v-model="settings.minWithdraw" type="number"><template #prepend>$</template></el-input>
              </el-form-item>
              <el-form-item label="单次最高提现">
                <el-input v-model="settings.maxWithdraw" type="number"><template #prepend>$</template></el-input>
              </el-form-item>
            </div>
            <el-form-item label="提现方式">
              <el-checkbox-group v-model="settings.withdrawMethods">
                <el-checkbox label="银行卡" value="bank" />
                <el-checkbox label="支付宝" value="alipay" />
                <el-checkbox label="微信" value="wechat" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 内容审核 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100"><h2 class="font-bold">内容审核</h2></div>
        <div class="p-6 space-y-4">
          <div v-for="item in auditSettings" :key="item.key" class="flex items-center justify-between py-2">
            <div>
              <div class="font-medium text-sm">{{ item.title }}</div>
              <div class="text-xs text-gray-500">{{ item.desc }}</div>
            </div>
            <el-switch v-model="settings[item.key]" active-color="#ef4444" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <el-button type="primary" @click="saveSettings"><i class="fas fa-save mr-2"></i>保存设置</el-button>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="space-y-6">
      <!-- 系统信息 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100"><h2 class="font-bold">系统信息</h2></div>
        <div class="p-4 space-y-3">
          <div v-for="info in systemInfo" :key="info.label" class="flex items-center justify-between text-sm">
            <span class="text-gray-500">{{ info.label }}</span>
            <span :class="info.class">{{ info.icon ? '' : '' }}<i v-if="info.icon" :class="[info.icon, 'mr-1']"></i>{{ info.value }}</span>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100"><h2 class="font-bold">快捷操作</h2></div>
        <div class="p-4 space-y-2">
          <el-button class="w-full justify-start"><i class="fas fa-sync-alt mr-2"></i>清除缓存</el-button>
          <el-button class="w-full justify-start"><i class="fas fa-database mr-2"></i>备份数据</el-button>
          <el-button class="w-full justify-start"><i class="fas fa-file-alt mr-2"></i>查看日志</el-button>
          <el-button class="w-full justify-start"><i class="fas fa-shield-alt mr-2"></i>安全检测</el-button>
        </div>
      </div>

      <!-- 管理员列表 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold">管理员</h2>
          <el-button type="primary" link>+ 添加</el-button>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="admin in admins" :key="admin.email" class="p-4 flex items-center">
            <img :src="admin.avatar" class="w-10 h-10 rounded-full">
            <div class="ml-3 flex-1">
              <div class="font-medium text-sm">{{ admin.name }}</div>
              <div class="text-xs text-gray-400">{{ admin.email }}</div>
            </div>
            <span :class="['px-2 py-1 text-xs rounded', admin.roleClass]">{{ admin.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const settings = reactive({
  siteName: '问答APP', siteDesc: '专业的问答社区，分享知识，解决问题',
  minReward: 10, maxReward: 10000, rewardDays: 7, commission: 10,
  minWithdraw: 50, maxWithdraw: 5000, withdrawMethods: ['bank', 'alipay', 'wechat'],
  questionAudit: false, answerAudit: false, sensitiveFilter: true, imageAudit: true
})

const auditSettings = [
  { key: 'questionAudit', title: '问题发布审核', desc: '开启后，新发布的问题需要审核后才能显示' },
  { key: 'answerAudit', title: '回答发布审核', desc: '开启后，新发布的回答需要审核后才能显示' },
  { key: 'sensitiveFilter', title: '敏感词过滤', desc: '自动过滤包含敏感词的内容' },
  { key: 'imageAudit', title: '图片审核', desc: '自动审核上传的图片内容' },
]

const systemInfo = [
  { label: '系统版本', value: 'v2.1.0' },
  { label: '服务器状态', value: '正常', icon: 'fas fa-circle text-xs', class: 'text-green-500' },
  { label: '数据库状态', value: '正常', icon: 'fas fa-circle text-xs', class: 'text-green-500' },
  { label: '缓存状态', value: '正常', icon: 'fas fa-circle text-xs', class: 'text-green-500' },
  { label: '最后更新', value: '2024-01-10' },
]

const admins = [
  { name: '超级管理员', email: 'admin@example.com', role: '超管', roleClass: 'bg-red-100 text-red-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
  { name: '内容审核员', email: 'reviewer@example.com', role: '审核', roleClass: 'bg-blue-100 text-blue-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin2' },
  { name: '财务管理员', email: 'finance@example.com', role: '财务', roleClass: 'bg-green-100 text-green-600', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin3' },
]

const saveSettings = () => ElMessage.success('设置保存成功')
</script>
