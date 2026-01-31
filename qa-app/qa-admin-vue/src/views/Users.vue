<template>
  <div>
    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="总用户" value="125,680" icon="fas fa-users" iconBg="bg-blue-100" iconColor="text-blue-500" @click="handleStatClick('all')" class="cursor-pointer" />
      <StatCard title="今日新增" value="+1,256" valueClass="text-green-500" icon="fas fa-user-plus" iconBg="bg-green-100" iconColor="text-green-500" @click="handleStatClick('today')" class="cursor-pointer" />
      <StatCard title="认证用户" value="3,450" valueClass="text-blue-500" icon="fas fa-user-check" iconBg="bg-blue-100" iconColor="text-blue-500" @click="handleStatClick('verified')" class="cursor-pointer" />
      <StatCard title="封禁用户" value="156" valueClass="text-red-500" icon="fas fa-user-slash" iconBg="bg-red-100" iconColor="text-red-500" @click="handleStatClick('banned')" class="cursor-pointer" />
    </div>

    <!-- 用户列表 -->
    <div class="bg-white rounded-xl shadow-sm">
      <div class="p-4 flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4 flex-wrap">
          <el-input v-model="searchQuery" placeholder="搜索用户名、ID、手机号" prefix-icon="Search" style="width: 250px" />
          <el-select v-model="statusFilter" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="正常" value="active" />
            <el-option label="已封禁" value="banned" />
            <el-option label="待审核" value="pending" />
          </el-select>
          <el-select v-model="verifiedFilter" placeholder="认证状态" clearable style="width: 120px">
            <el-option label="已认证" value="verified" />
            <el-option label="审核中" value="pending" />
            <el-option label="未认证" value="unverified" />
          </el-select>
          <el-select v-model="occupationFilter" placeholder="职业" clearable style="width: 140px">
            <el-option label="软件工程师" value="软件工程师" />
            <el-option label="产品经理" value="产品经理" />
            <el-option label="医生" value="医生" />
            <el-option label="教师" value="教师" />
            <el-option label="律师" value="律师" />
            <el-option label="设计师" value="设计师" />
            <el-option label="学生" value="学生" />
          </el-select>
          <el-select v-model="locationFilter" placeholder="所在地" clearable style="width: 140px">
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
            <el-option label="杭州" value="杭州" />
            <el-option label="成都" value="成都" />
          </el-select>
        </div>
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="showAddUserDialog = true"><i class="fas fa-plus mr-2"></i>添加用户</el-button>
          <el-button type="default" @click="handleExport"><i class="fas fa-download mr-2"></i>导出</el-button>
          <el-button type="danger" plain @click="handleBatchDelete"><i class="fas fa-trash mr-2"></i>批量删除</el-button>
        </div>
      </div>

      <el-table :data="users" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.avatar" class="w-10 h-10 rounded-full">
              <div class="ml-3">
                <div class="flex items-center">
                  <span class="font-medium">{{ row.name }}</span>
                  <i v-if="row.verified" class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>
                </div>
                <div class="text-xs text-gray-400">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="职业" width="120">
          <template #default="{ row }">
            <div class="text-sm text-gray-700">{{ row.occupation || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所在地" width="140">
          <template #default="{ row }">
            <div class="flex items-center text-sm text-gray-700">
              <i class="fas fa-map-marker-alt text-gray-400 text-xs mr-1"></i>
              {{ row.location || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="认证状态" width="120">
          <template #default="{ row }">
            <span v-if="row.verified" class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-check-circle mr-1"></i>
              已认证
            </span>
            <span v-else-if="row.verificationStatus === 'pending'" class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
              <i class="fas fa-clock mr-1"></i>
              审核中
            </span>
            <span v-else class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              <i class="fas fa-times-circle mr-1"></i>
              未认证
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册时间" width="120" />
        <el-table-column label="提问/回答" width="100">
          <template #default="{ row }">{{ row.questions }} / {{ row.answers }}</template>
        </el-table-column>
        <el-table-column prop="balance" label="钱包余额" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', `status-${row.status}`]">{{ statusText[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewUserDetail(row)" title="查看详情">
              <i class="fas fa-eye"></i>
            </el-button>
            <el-button link type="success" size="small" @click="editUser(row)" title="编辑">
              <i class="fas fa-edit"></i>
            </el-button>
            <el-button v-if="row.status !== 'banned'" link type="warning" size="small" @click="banUser(row)" title="封禁">
              <i class="fas fa-ban"></i>
            </el-button>
            <el-button v-else link type="success" size="small" @click="unbanUser(row)" title="解封">
              <i class="fas fa-check-circle"></i>
            </el-button>
            <el-button link type="danger" size="small" @click="deleteUser(row)" title="删除">
              <i class="fas fa-trash"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex items-center justify-between border-t border-gray-100">
        <span class="text-sm text-gray-500">共 125,680 条记录，已选择 {{ selectedUsers.length }} 条</span>
        <el-pagination 
          layout="prev, pager, next, jumper, total" 
          :total="125680" 
          :page-size="10"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="用户详情" width="800px">
      <div v-if="currentUser" class="space-y-4">
        <!-- 基本信息 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <i class="fas fa-user mr-2 text-blue-500"></i>
            基本信息
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <img :src="currentUser.avatar" class="w-16 h-16 rounded-full mr-4">
              <div>
                <div class="font-medium text-lg">{{ currentUser.name }}</div>
                <div class="text-sm text-gray-500">ID: {{ currentUser.id }}</div>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">认证状态</div>
              <div class="mt-1">
                <span v-if="currentUser.verified" class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
                  <i class="fas fa-check-circle mr-1"></i>已认证
                </span>
                <span v-else class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
                  <i class="fas fa-times-circle mr-1"></i>未认证
                </span>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">职业</div>
              <div class="mt-1 font-medium">{{ currentUser.occupation || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">所在地</div>
              <div class="mt-1 font-medium">
                <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                {{ currentUser.location || '-' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">注册时间</div>
              <div class="mt-1 font-medium">{{ currentUser.registerDate }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">账户状态</div>
              <div class="mt-1">
                <span :class="['status-badge', `status-${currentUser.status}`]">
                  {{ statusText[currentUser.status] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 活动统计 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <i class="fas fa-chart-bar mr-2 text-green-500"></i>
            活动统计
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-500">{{ currentUser.questions }}</div>
              <div class="text-sm text-gray-500 mt-1">提问数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-500">{{ currentUser.answers }}</div>
              <div class="text-sm text-gray-500 mt-1">回答数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-500">{{ currentUser.balance }}</div>
              <div class="text-sm text-gray-500 mt-1">钱包余额</div>
            </div>
          </div>
        </div>

        <!-- 操作记录 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <i class="fas fa-history mr-2 text-purple-500"></i>
            最近操作
          </h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between py-2 border-b border-gray-200">
              <div class="flex items-center">
                <i class="fas fa-question-circle text-blue-500 mr-2"></i>
                <span class="text-sm">发布了问题《如何学习Vue3》</span>
              </div>
              <span class="text-xs text-gray-400">2小时前</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-200">
              <div class="flex items-center">
                <i class="fas fa-comment text-green-500 mr-2"></i>
                <span class="text-sm">回答了问题《React和Vue的区别》</span>
              </div>
              <span class="text-xs text-gray-400">5小时前</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <i class="fas fa-heart text-red-500 mr-2"></i>
                <span class="text-sm">点赞了回答</span>
              </div>
              <span class="text-xs text-gray-400">昨天</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="primary" @click="editUser(currentUser)">编辑用户</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog v-model="showAddUserDialog" :title="isEdit ? '编辑用户' : '添加用户'" width="600px">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="头像">
          <div class="flex items-center gap-4">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
              accept="image/*"
            >
              <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
              <div v-else class="avatar-uploader-icon">
                <i class="fas fa-plus text-2xl text-gray-400"></i>
                <div class="text-xs text-gray-400 mt-2">上传头像</div>
              </div>
            </el-upload>
            <div class="flex-1">
              <div class="text-sm text-gray-600 mb-2">
                <i class="fas fa-info-circle text-blue-500 mr-1"></i>
                支持 JPG、PNG、GIF 格式，大小不超过 2MB
              </div>
              <el-button v-if="userForm.avatar" size="small" type="danger" plain @click="removeAvatar">
                <i class="fas fa-trash mr-1"></i>删除头像
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="职业">
          <el-input v-model="userForm.occupation" placeholder="请输入职业" />
        </el-form-item>
        <el-form-item label="所在地">
          <el-cascader
            v-model="userForm.locationValues"
            :options="regionData"
            :props="{ expandTrigger: 'hover', value: 'value', label: 'label', children: 'children' }"
            placeholder="请选择国家/省份/城市"
            clearable
            filterable
            style="width: 100%"
            @change="handleLocationChange"
          />
          <div v-if="userForm.location" class="text-xs text-gray-500 mt-1">
            <i class="fas fa-map-marker-alt mr-1"></i>
            已选择：{{ userForm.location }}
          </div>
        </el-form-item>
        <el-form-item label="认证状态">
          <el-switch v-model="userForm.verified" active-text="已认证" inactive-text="未认证" />
        </el-form-item>
        <el-form-item label="账户状态">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="正常" value="active" />
            <el-option label="已封禁" value="banned" />
            <el-option label="待审核" value="pending" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddUserDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>

    <!-- 封禁用户弹窗 -->
    <el-dialog v-model="showBanDialog" title="封禁用户" width="500px">
      <div class="mb-4">
        <p class="text-gray-700 mb-2">确定要封禁用户 <strong>{{ currentUser?.name }}</strong> 吗？</p>
        <el-form :model="banForm" label-width="100px">
          <el-form-item label="封禁原因">
            <el-select v-model="banForm.reason" placeholder="请选择封禁原因">
              <el-option label="发布违规内容" value="违规内容" />
              <el-option label="恶意刷屏" value="恶意刷屏" />
              <el-option label="辱骂他人" value="辱骂他人" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="封禁时长">
            <el-select v-model="banForm.duration" placeholder="请选择封禁时长">
              <el-option label="1天" value="1" />
              <el-option label="3天" value="3" />
              <el-option label="7天" value="7" />
              <el-option label="30天" value="30" />
              <el-option label="永久" value="forever" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="banForm.note" type="textarea" :rows="3" placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showBanDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmBan">确认封禁</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatCard from '@/components/StatCard.vue'
import { regionData, getRegionLabel, getRegionStats } from '@/data/regions-full-cn.js'

// 获取地区数据统计
const regionStats = getRegionStats()
console.log('📊 全球地区数据统计（完全中文版）:', regionStats)
console.log('🇨🇳 中国示例:', regionData.find(c => c.value === 'CN')?.children?.slice(0, 5).map(s => s.label))

const searchQuery = ref('')
const statusFilter = ref('')
const verifiedFilter = ref('')
const occupationFilter = ref('')
const locationFilter = ref('')
const currentPage = ref(1)
const selectedUsers = ref([])

const statusText = { active: '正常', banned: '已封禁', pending: '待认证' }

// 弹窗控制
const showDetailDialog = ref(false)
const showAddUserDialog = ref(false)
const showBanDialog = ref(false)
const isEdit = ref(false)
const currentUser = ref(null)

// 表单数据
const userForm = ref({
  name: '',
  avatar: '',
  occupation: '',
  location: '',
  locationValues: [], // 级联选择器的值数组 [国家, 省份, 城市]
  verified: false,
  status: 'active'
})

const banForm = ref({
  reason: '',
  duration: '',
  note: ''
})

const users = ref([
  { id: '12345678', name: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', verified: true, verificationStatus: 'verified', occupation: '软件工程师', location: '北京市朝阳区', registerDate: '2024-01-15', questions: 56, answers: 234, balance: '$256.50', status: 'active' },
  { id: '12345679', name: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', verified: false, verificationStatus: 'unverified', occupation: '产品经理', location: '上海市浦东新区', registerDate: '2024-01-10', questions: 23, answers: 89, balance: '$128.00', status: 'active' },
  { id: '12345680', name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', verified: true, verificationStatus: 'verified', occupation: '医生', location: '广州市天河区', registerDate: '2023-12-20', questions: 12, answers: 456, balance: '$1,250.00', status: 'active' },
  { id: '12345681', name: '违规用户001', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', verified: false, verificationStatus: 'unverified', occupation: '自由职业', location: '深圳市南山区', registerDate: '2024-01-05', questions: 5, answers: 12, balance: '$0.00', status: 'banned' },
  { id: '12345682', name: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', verified: false, verificationStatus: 'pending', occupation: '美食博主', location: '成都市武侯区', registerDate: '2024-01-12', questions: 45, answers: 178, balance: '$520.00', status: 'pending' },
  { id: '12345683', name: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6', verified: true, verificationStatus: 'verified', occupation: '前端开发', location: '杭州市西湖区', registerDate: '2023-11-08', questions: 89, answers: 567, balance: '$2,340.00', status: 'active' },
  { id: '12345684', name: '设计师小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7', verified: true, verificationStatus: 'verified', occupation: 'UI设计师', location: '南京市鼓楼区', registerDate: '2023-10-15', questions: 34, answers: 289, balance: '$890.00', status: 'active' },
  { id: '12345685', name: '教师张老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8', verified: true, verificationStatus: 'verified', occupation: '高中教师', location: '武汉市洪山区', registerDate: '2023-09-20', questions: 67, answers: 423, balance: '$1,560.00', status: 'active' },
  { id: '12345686', name: '律师李律', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user9', verified: true, verificationStatus: 'verified', occupation: '律师', location: '重庆市渝中区', registerDate: '2023-08-12', questions: 23, answers: 678, balance: '$3,200.00', status: 'active' },
  { id: '12345687', name: '学生小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user10', verified: false, verificationStatus: 'pending', occupation: '大学生', location: '西安市雁塔区', registerDate: '2024-01-18', questions: 12, answers: 45, balance: '$50.00', status: 'active' },
])

// 统计卡片点击
const handleStatClick = (type) => {
  switch (type) {
    case 'all':
      statusFilter.value = ''
      verifiedFilter.value = ''
      break
    case 'today':
      ElMessage.info('显示今日新增用户')
      break
    case 'verified':
      verifiedFilter.value = 'verified'
      break
    case 'banned':
      statusFilter.value = 'banned'
      break
  }
}

// 查看用户详情
const viewUserDetail = (user) => {
  currentUser.value = user
  showDetailDialog.value = true
}

// 编辑用户
const editUser = (user) => {
  isEdit.value = true
  currentUser.value = user
  userForm.value = {
    name: user.name,
    avatar: user.avatar,
    occupation: user.occupation,
    location: user.location,
    locationValues: user.locationValues || [], // 如果有保存的值数组就使用
    verified: user.verified,
    status: user.status
  }
  showDetailDialog.value = false
  showAddUserDialog.value = true
}

// 保存用户
const saveUser = () => {
  // 验证必填字段
  if (!userForm.value.name) {
    ElMessage.warning('请输入用户名')
    return
  }
  
  if (isEdit.value) {
    // 更新用户
    Object.assign(currentUser.value, {
      ...userForm.value,
      locationValues: userForm.value.locationValues // 保存级联选择器的值
    })
    ElMessage.success('用户信息更新成功')
  } else {
    // 添加新用户
    const newUser = {
      id: Date.now().toString(),
      ...userForm.value,
      avatar: userForm.value.avatar || defaultAvatar, // 使用默认头像
      verificationStatus: userForm.value.verified ? 'verified' : 'unverified',
      registerDate: new Date().toISOString().split('T')[0],
      questions: 0,
      answers: 0,
      balance: '$0.00'
    }
    users.value.unshift(newUser)
    ElMessage.success('用户添加成功')
  }
  showAddUserDialog.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  userForm.value = {
    name: '',
    avatar: '',
    occupation: '',
    location: '',
    locationValues: [],
    verified: false,
    status: 'active'
  }
  isEdit.value = false
  currentUser.value = null
}

// 处理地区选择变化
const handleLocationChange = (values) => {
  if (values && values.length > 0) {
    userForm.value.location = getRegionLabel(values)
  } else {
    userForm.value.location = ''
  }
}

// 封禁用户
const banUser = (user) => {
  currentUser.value = user
  banForm.value = {
    reason: '',
    duration: '',
    note: ''
  }
  showBanDialog.value = true
}

// 确认封禁
const confirmBan = () => {
  if (!banForm.value.reason || !banForm.value.duration) {
    ElMessage.warning('请填写完整的封禁信息')
    return
  }
  currentUser.value.status = 'banned'
  showBanDialog.value = false
  ElMessage.success(`用户 ${currentUser.value.name} 已被封禁`)
}

// 解封用户
const unbanUser = (user) => {
  ElMessageBox.confirm(
    `确定要解封用户 ${user.name} 吗？`,
    '解封确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    user.status = 'active'
    ElMessage.success('用户已解封')
  }).catch(() => {
    ElMessage.info('已取消解封')
  })
}

// 删除用户
const deleteUser = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${user.name} 吗？此操作不可恢复！`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(() => {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
      ElMessage.success('用户已删除')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择要删除的用户')
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？此操作不可恢复！`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(() => {
    const ids = selectedUsers.value.map(u => u.id)
    users.value = users.value.filter(u => !ids.includes(u.id))
    selectedUsers.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 导出数据
const handleExport = () => {
  ElMessage.success('数据导出功能开发中...')
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  ElMessage.info(`切换到第 ${page} 页`)
}

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = (options) => {
  const { file } = options
  
  // 创建 FileReader 读取图片
  const reader = new FileReader()
  reader.onload = (e) => {
    // 将图片转换为 base64 或上传到服务器
    // 这里演示使用 base64
    userForm.value.avatar = e.target.result
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(file)
  
  // 实际项目中应该上传到服务器
  // 示例：
  // const formData = new FormData()
  // formData.append('file', file)
  // axios.post('/api/upload', formData).then(res => {
  //   userForm.value.avatar = res.data.url
  //   ElMessage.success('头像上传成功')
  // })
}

// 删除头像
const removeAvatar = () => {
  userForm.value.avatar = ''
  ElMessage.success('头像已删除')
}

// 默认头像
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
</script>

<style scoped>
.avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.avatar-uploader:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-uploader-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #f0fdf4;
  color: #22c55e;
}

.status-banned {
  background-color: #fee2e2;
  color: #ef4444;
}

.status-pending {
  background-color: #fef3c7;
  color: #f59e0b;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>
