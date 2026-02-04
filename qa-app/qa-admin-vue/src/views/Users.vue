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
        <el-table-column label="用户类型" width="140">
          <template #default="{ row }">
            <span v-if="row.userType === 'individual'" class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              <i class="fas fa-user mr-1"></i>
              Individual
            </span>
            <span v-else-if="row.userType === 'business'" class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              <i class="fas fa-building mr-1"></i>
              Business
            </span>
            <span v-else-if="row.userType === 'government'" class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
              <i class="fas fa-landmark mr-1"></i>
              Government
            </span>
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
    <el-dialog 
      v-model="showDetailDialog" 
      title="用户详情" 
      width="1000px" 
      :close-on-click-modal="false"
      :lock-scroll="true"
      top="5vh"
    >
      <div v-if="currentUser">
        <div class="space-y-2.5">
          <!-- 用户头部信息 -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2.5 border border-blue-100">
            <div class="flex items-start gap-2.5">
              <img :src="currentUser.avatar" class="w-14 h-14 rounded-lg shadow-lg border-2 border-white">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-0.5">
                  <h3 class="text-sm font-bold text-gray-800">{{ currentUser.name }}</h3>
                  <span v-if="currentUser.verified" class="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                    <i class="fas fa-check-circle mr-0.5"></i>已认证
                  </span>
                  <span :class="['inline-flex items-center px-1.5 py-0.5 text-xs rounded-full', 
                    currentUser.status === 'active' ? 'bg-green-500 text-white' : 
                    currentUser.status === 'banned' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white']">
                    {{ statusText[currentUser.status] }}
                  </span>
                </div>
                <div class="text-xs text-gray-600 mb-0.5">
                  <i class="fas fa-fingerprint mr-1"></i>ID: {{ currentUser.id }}
                </div>
                <div v-if="currentUser.bio" class="text-xs text-gray-700 bg-white/50 rounded p-1 mb-0.5">
                  <i class="fas fa-quote-left text-gray-400 mr-1"></i>
                  {{ currentUser.bio }}
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <div v-if="currentUser.gender" class="flex items-center">
                    <i :class="['mr-0.5', currentUser.gender === 'male' ? 'fas fa-mars text-blue-500' : currentUser.gender === 'female' ? 'fas fa-venus text-pink-500' : 'fas fa-genderless text-purple-500']"></i>
                    {{ currentUser.gender === 'male' ? '男' : currentUser.gender === 'female' ? '女' : '其他' }}
                  </div>
                  <div v-if="currentUser.birthday" class="flex items-center">
                    <i class="fas fa-birthday-cake text-orange-500 mr-0.5"></i>
                    {{ currentUser.birthday }}
                  </div>
                  <div v-if="currentUser.registerDate" class="flex items-center">
                    <i class="fas fa-calendar-plus text-green-500 mr-0.5"></i>
                    {{ currentUser.registerDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- 基本信息 -->
            <div class="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-semibold mb-1.5 flex items-center text-gray-800">
                <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-1.5">
                  <i class="fas fa-user text-blue-500 text-xs"></i>
                </div>
                基本信息
              </h3>
              <div class="space-y-1">
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">用户类型</span>
                  <span class="text-xs font-medium text-gray-800">
                    <span v-if="currentUser.userType === 'individual'" class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                      <i class="fas fa-user mr-1"></i>Individual
                    </span>
                    <span v-else-if="currentUser.userType === 'business'" class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      <i class="fas fa-building mr-1"></i>Business
                    </span>
                    <span v-else-if="currentUser.userType === 'government'" class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      <i class="fas fa-landmark mr-1"></i>Government
                    </span>
                  </span>
                </div>
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">职业</span>
                  <span class="text-xs font-medium text-gray-800">{{ currentUser.occupation || '-' }}</span>
                </div>
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">所在地</span>
                  <span class="text-xs font-medium text-gray-800">
                    <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>
                    {{ currentUser.location || '-' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">手机号</span>
                  <span class="text-xs font-medium text-gray-800">{{ currentUser.phone || '未绑定' }}</span>
                </div>
                <div class="flex items-center justify-between py-0.5">
                  <span class="text-xs text-gray-500">邮箱</span>
                  <span class="text-xs font-medium text-gray-800">{{ currentUser.email || '未绑定' }}</span>
                </div>
              </div>
            </div>

            <!-- 账号信息 -->
            <div class="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-semibold mb-1.5 flex items-center text-gray-800">
                <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-1.5">
                  <i class="fas fa-shield-alt text-purple-500 text-xs"></i>
                </div>
                账号信息
              </h3>
              <div class="space-y-1">
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">认证状态</span>
                  <span v-if="currentUser.verified" class="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                    <i class="fas fa-check-circle mr-0.5"></i>已认证
                  </span>
                  <span v-else class="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    <i class="fas fa-times-circle mr-0.5"></i>未认证
                  </span>
                </div>
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">第三方绑定</span>
                  <div class="flex items-center gap-1">
                    <span v-if="currentUser.wechatBound" class="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-600">
                      <i class="fab fa-weixin mr-0.5"></i>微信
                    </span>
                    <span v-if="currentUser.appleBound" class="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      <i class="fab fa-apple mr-0.5"></i>Apple
                    </span>
                    <span v-if="!currentUser.wechatBound && !currentUser.appleBound" class="text-xs text-gray-400">未绑定</span>
                  </div>
                </div>
                <div class="flex items-center justify-between py-0.5 border-b border-gray-100">
                  <span class="text-xs text-gray-500">账户状态</span>
                  <span :class="['status-badge', `status-${currentUser.status}`]">
                    {{ statusText[currentUser.status] }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-0.5">
                  <span class="text-xs text-gray-500">注册时间</span>
                  <span class="text-xs font-medium text-gray-800">{{ currentUser.registerDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 活动统计 -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2.5 border border-green-100">
            <h3 class="text-sm font-semibold mb-1.5 flex items-center text-gray-800">
              <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-1.5">
                <i class="fas fa-chart-bar text-white text-xs"></i>
              </div>
              活动统计
            </h3>
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-white rounded-lg p-1.5 text-center shadow-sm">
                <div class="text-lg font-bold text-blue-500">{{ currentUser.questions }}</div>
                <div class="text-xs text-gray-500">提问数</div>
              </div>
              <div class="bg-white rounded-lg p-1.5 text-center shadow-sm">
                <div class="text-lg font-bold text-green-500">{{ currentUser.answers }}</div>
                <div class="text-xs text-gray-500">回答数</div>
              </div>
              <div class="bg-white rounded-lg p-1.5 text-center shadow-sm">
                <div class="text-lg font-bold text-yellow-500">{{ currentUser.balance }}</div>
                <div class="text-xs text-gray-500">钱包余额</div>
              </div>
            </div>
          </div>

          <!-- 最近操作 -->
          <div class="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
            <h3 class="text-sm font-semibold mb-1.5 flex items-center text-gray-800">
              <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-1.5">
                <i class="fas fa-history text-orange-500 text-xs"></i>
              </div>
              最近操作
            </h3>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 border-b border-gray-100 hover:bg-gray-50 rounded px-1.5 transition-colors">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <i class="fas fa-question-circle text-blue-500 text-xs"></i>
                  </div>
                  <span class="text-xs text-gray-700">发布了问题《如何学习Vue3》</span>
                </div>
                <span class="text-xs text-gray-400">2小时前</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-gray-100 hover:bg-gray-50 rounded px-1.5 transition-colors">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <i class="fas fa-comment text-green-500 text-xs"></i>
                  </div>
                  <span class="text-xs text-gray-700">回答了问题《React和Vue的区别》</span>
                </div>
                <span class="text-xs text-gray-400">5小时前</span>
              </div>
              <div class="flex items-center justify-between py-1 hover:bg-gray-50 rounded px-1.5 transition-colors">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                    <i class="fas fa-heart text-red-500 text-xs"></i>
                  </div>
                  <span class="text-xs text-gray-700">点赞了回答</span>
                </div>
                <span class="text-xs text-gray-400">昨天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <el-button v-if="currentUser?.status !== 'banned'" type="warning" plain size="default" @click="banUser(currentUser)">
              <i class="fas fa-ban mr-1"></i>封禁用户
            </el-button>
            <el-button v-else type="success" plain size="default" @click="unbanUser(currentUser)">
              <i class="fas fa-check-circle mr-1"></i>解除封禁
            </el-button>
            <el-button type="danger" plain size="default" @click="deleteUser(currentUser)">
              <i class="fas fa-trash mr-1"></i>删除用户
            </el-button>
          </div>
          <div class="flex items-center gap-2">
            <el-button @click="showDetailDialog = false" size="default">关闭</el-button>
            <el-button type="primary" @click="editUser(currentUser)" size="default">
              <i class="fas fa-edit mr-1"></i>编辑用户
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog 
      v-model="showAddUserDialog" 
      :close-on-click-modal="false"
      :lock-scroll="true"
      width="950px"
      top="5vh"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shadow-lg', isEdit ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600']">
            <i :class="['text-white text-lg', isEdit ? 'fas fa-user-edit' : 'fas fa-user-plus']"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? '编辑用户' : '添加用户' }}</h3>
            <p class="text-xs text-gray-500">{{ isEdit ? '修改用户信息' : '创建新用户账号' }}</p>
          </div>
        </div>
      </template>

      <div class="max-h-[70vh] overflow-y-auto custom-scrollbar px-1">
        <el-form :model="userForm" label-width="90px" label-position="left">
          <div class="grid grid-cols-2 gap-x-6">
            <!-- 左列 - 基本信息 -->
            <div class="space-y-1">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 mb-3 border border-blue-100">
                <h4 class="text-sm font-semibold text-gray-700 flex items-center">
                  <i class="fas fa-user text-blue-500 mr-2 text-xs"></i>
                  基本信息
                </h4>
              </div>

              <el-form-item label="用户类型" class="mb-4">
                <el-select v-model="userForm.userType" placeholder="请选择用户类型" style="width: 100%">
                  <el-option 
                    v-for="type in userTypeOptions" 
                    :key="type.value" 
                    :label="type.label" 
                    :value="type.value"
                  >
                    <span class="flex items-center">
                      <i :class="[type.icon, 'mr-2']"></i>
                      <span>{{ type.label }}</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="用户名" class="mb-4">
                <el-input 
                  v-model="userForm.name" 
                  :placeholder="userForm.userType === 'individual' ? '请输入用户名' : userForm.userType === 'business' ? '请输入企业名称' : '请输入机构名称'" 
                  prefix-icon="User"
                  clearable
                />
              </el-form-item>

              <el-form-item label="性别" class="mb-4" v-if="userForm.userType === 'individual'">
                <el-radio-group v-model="userForm.gender" class="w-full">
                  <el-radio label="male" class="mr-4">
                    <i class="fas fa-mars text-blue-500 mr-1"></i>男
                  </el-radio>
                  <el-radio label="female" class="mr-4">
                    <i class="fas fa-venus text-pink-500 mr-1"></i>女
                  </el-radio>
                  <el-radio label="other">
                    <i class="fas fa-genderless text-purple-500 mr-1"></i>其他
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="生日" class="mb-4" v-if="userForm.userType === 'individual'">
                <el-date-picker
                  v-model="userForm.birthday"
                  type="date"
                  placeholder="选择生日"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  prefix-icon="Calendar"
                  clearable
                />
              </el-form-item>

              <el-form-item label="职业" class="mb-4">
                <el-input 
                  v-model="userForm.occupation" 
                  placeholder="请输入职业" 
                  prefix-icon="Briefcase"
                  clearable
                />
              </el-form-item>

              <el-form-item label="所在地" class="mb-4">
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
                <div v-if="userForm.location" class="text-xs text-gray-500 mt-1.5 bg-blue-50 rounded px-2 py-1 border border-blue-100">
                  <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>
                  已选择：<span class="font-medium text-gray-700">{{ userForm.location }}</span>
                </div>
              </el-form-item>

              <el-form-item label="手机号" class="mb-4">
                <el-input 
                  v-model="userForm.phone" 
                  placeholder="请输入手机号" 
                  maxlength="11"
                  prefix-icon="Phone"
                  clearable
                />
              </el-form-item>

              <el-form-item label="邮箱" class="mb-4">
                <el-input 
                  v-model="userForm.email" 
                  placeholder="请输入邮箱地址" 
                  type="email"
                  prefix-icon="Message"
                  clearable
                />
              </el-form-item>

              <el-form-item label="个人简介" class="mb-4">
                <el-input 
                  v-model="userForm.bio" 
                  type="textarea" 
                  :rows="3" 
                  placeholder="请输入个人简介，让大家更了解你..." 
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="密码" v-if="!isEdit" class="mb-4">
                <el-input 
                  v-model="userForm.password" 
                  type="password" 
                  placeholder="请输入密码" 
                  show-password
                  prefix-icon="Lock"
                />
              </el-form-item>

              <el-form-item label="重置密码" v-if="isEdit" class="mb-4">
                <el-input 
                  v-model="userForm.newPassword" 
                  type="password" 
                  placeholder="留空则不修改密码" 
                  show-password
                  prefix-icon="Lock"
                  clearable
                />
              </el-form-item>
            </div>

            <!-- 右列 - 账号设置 -->
            <div class="space-y-1">
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg px-3 py-2 mb-3 border border-purple-100">
                <h4 class="text-sm font-semibold text-gray-700 flex items-center">
                  <i class="fas fa-cog text-purple-500 mr-2 text-xs"></i>
                  账号设置
                </h4>
              </div>

              <el-form-item label="头像" class="mb-4">
                <div>
                  <el-upload
                    class="avatar-uploader-modern"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="handleAvatarUpload"
                    accept="image/*"
                  >
                    <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar-modern" />
                    <div v-else class="avatar-uploader-icon-modern">
                      <i class="fas fa-camera text-2xl text-gray-400 mb-1"></i>
                      <div class="text-xs text-gray-500 font-medium">点击上传</div>
                    </div>
                  </el-upload>
                  <div class="mt-3">
                    <div class="text-xs text-gray-600 mb-2 bg-gray-50 rounded px-2 py-1.5 border border-gray-200">
                      <i class="fas fa-info-circle text-blue-500 mr-1"></i>
                      支持 JPG、PNG、GIF，不超过 2MB
                    </div>
                    <el-button v-if="userForm.avatar" size="small" type="danger" plain @click="removeAvatar">
                      <i class="fas fa-trash mr-1"></i>删除头像
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="第三方账号" class="mb-4">
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div class="flex items-center gap-4 mb-2">
                    <el-checkbox v-model="userForm.wechatBound" disabled>
                      <i class="fab fa-weixin text-green-500 mr-1"></i>
                      <span class="text-sm">微信</span>
                    </el-checkbox>
                    <el-checkbox v-model="userForm.appleBound" disabled>
                      <i class="fab fa-apple mr-1"></i>
                      <span class="text-sm">Apple</span>
                    </el-checkbox>
                  </div>
                  <div class="text-xs text-gray-500">
                    <i class="fas fa-info-circle mr-1"></i>
                    需要用户在APP中绑定
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="认证状态" class="mb-4">
                <div class="flex items-center gap-3">
                  <el-switch 
                    v-model="userForm.verified" 
                    active-text="已认证" 
                    inactive-text="未认证"
                    :active-icon="Check"
                    :inactive-icon="Close"
                  />
                  <span v-if="userForm.verified" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <i class="fas fa-check-circle mr-1"></i>认证用户
                  </span>
                </div>
              </el-form-item>

              <!-- 认证信息部分 -->
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2 mb-3 mt-4 border border-green-100">
                <h4 class="text-sm font-semibold text-gray-700 flex items-center">
                  <i class="fas fa-id-card text-green-500 mr-2 text-xs"></i>
                  认证信息
                </h4>
              </div>

              <!-- Individual (个人) 认证 -->
              <div v-if="userForm.userType === 'individual'" class="space-y-3">
                <el-form-item label="证件类型" class="mb-4">
                  <el-select v-model="userForm.verification.idType" placeholder="请选择证件类型" style="width: 100%">
                    <el-option 
                      v-for="type in idTypeOptions" 
                      :key="type.value" 
                      :label="type.label" 
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="证件号码" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.idNumber" 
                    placeholder="请输入证件号码" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="证件照片" class="mb-4">
                  <div class="text-xs text-gray-500 mb-2">
                    <i class="fas fa-info-circle text-blue-500 mr-1"></i>
                    请上传证件正反面照片
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <el-input 
                      v-model="userForm.verification.idFrontImage" 
                      placeholder="正面照片URL" 
                      size="small"
                    />
                    <el-input 
                      v-model="userForm.verification.idBackImage" 
                      placeholder="反面照片URL" 
                      size="small"
                    />
                  </div>
                </el-form-item>
              </div>

              <!-- Business (企业) 认证 -->
              <div v-if="userForm.userType === 'business'" class="space-y-3">
                <el-form-item label="企业名称" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.businessName" 
                    placeholder="请输入企业全称" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="注册号" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.businessRegistrationNumber" 
                    placeholder="Business Registration Number" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="税号" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.taxId" 
                    placeholder="Tax ID / EIN" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="营业执照" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.businessLicense" 
                    placeholder="营业执照URL" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="企业地址" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.businessAddress" 
                    type="textarea"
                    :rows="2"
                    placeholder="请输入企业注册地址" 
                  />
                </el-form-item>
              </div>

              <!-- Government (政府机构) 认证 -->
              <div v-if="userForm.userType === 'government'" class="space-y-3">
                <el-form-item label="机构名称" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.agencyName" 
                    placeholder="请输入政府机构全称" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="机构ID" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.agencyId" 
                    placeholder="Agency Identification Number" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="部门名称" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.departmentName" 
                    placeholder="Department Name" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="官方文件" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.officialDocument" 
                    placeholder="官方授权文件URL" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="授权人" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.authorizedPersonName" 
                    placeholder="Authorized Person Name" 
                    clearable
                  />
                </el-form-item>

                <el-form-item label="职位" class="mb-4">
                  <el-input 
                    v-model="userForm.verification.authorizedPersonTitle" 
                    placeholder="Title/Position" 
                    clearable
                  />
                </el-form-item>
              </div>

              <el-form-item label="账户状态" class="mb-4">
                <el-select v-model="userForm.status" placeholder="请选择状态" style="width: 100%">
                  <el-option label="正常" value="active">
                    <span class="flex items-center">
                      <i class="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>正常</span>
                    </span>
                  </el-option>
                  <el-option label="已封禁" value="banned">
                    <span class="flex items-center">
                      <i class="fas fa-ban text-red-500 mr-2"></i>
                      <span>已封禁</span>
                    </span>
                  </el-option>
                  <el-option label="待审核" value="pending">
                    <span class="flex items-center">
                      <i class="fas fa-clock text-yellow-500 mr-2"></i>
                      <span>待审核</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <el-button @click="showAddUserDialog = false" size="default">
            <i class="fas fa-times mr-1"></i>取消
          </el-button>
          <el-button type="primary" @click="saveUser" size="default">
            <i class="fas fa-save mr-1"></i>{{ isEdit ? '保存修改' : '创建用户' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 封禁用户弹窗 -->
    <el-dialog 
      v-model="showBanDialog" 
      title="封禁用户" 
      width="500px"
      :lock-scroll="true"
    >
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
import { Check, Close } from '@element-plus/icons-vue'
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
  bio: '',
  gender: 'male',
  birthday: '',
  occupation: '',
  location: '',
  locationValues: [], // 级联选择器的值数组 [国家, 省份, 城市]
  phone: '',
  email: '',
  password: '',
  newPassword: '',
  wechatBound: false,
  appleBound: false,
  verified: false,
  status: 'active',
  // 新增字段
  userType: 'individual', // individual, business, government
  // 认证信息
  verification: {
    // Individual (个人) 认证
    idType: '', // passport, drivers_license, national_id
    idNumber: '',
    idFrontImage: '',
    idBackImage: '',
    // Business (企业) 认证
    businessName: '',
    businessRegistrationNumber: '',
    taxId: '',
    businessLicense: '',
    businessAddress: '',
    // Government (政府机构) 认证
    agencyName: '',
    agencyId: '',
    departmentName: '',
    officialDocument: '',
    authorizedPersonName: '',
    authorizedPersonTitle: ''
  }
})

// 用户类型选项
const userTypeOptions = [
  { value: 'individual', label: 'Individual (个人)', icon: 'fas fa-user' },
  { value: 'business', label: 'Business/Corporation (企业)', icon: 'fas fa-building' },
  { value: 'government', label: 'Government Agency (政府机构)', icon: 'fas fa-landmark' }
]

// 个人证件类型选项
const idTypeOptions = [
  { value: 'passport', label: 'Passport (护照)' },
  { value: 'drivers_license', label: 'Driver\'s License (驾驶执照)' },
  { value: 'national_id', label: 'National ID Card (身份证)' },
  { value: 'state_id', label: 'State ID (州身份证)' }
]

const banForm = ref({
  reason: '',
  duration: '',
  note: ''
})

const users = ref([
  { id: '12345678', name: '张三丰', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', bio: '热爱学习，乐于分享。专注于前端开发和用户体验设计。', gender: 'male', birthday: '1990-01-01', verified: true, verificationStatus: 'verified', occupation: '软件工程师', location: '北京市朝阳区', phone: '138****8888', email: 'zhangsan@example.com', wechatBound: true, appleBound: false, registerDate: '2024-01-15', questions: 56, answers: 234, balance: '$256.50', status: 'active' },
  { id: '12345679', name: '李小龙', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', bio: '产品思维，用户至上。', gender: 'male', birthday: '1988-05-20', verified: false, verificationStatus: 'unverified', occupation: '产品经理', location: '上海市浦东新区', phone: '139****6666', email: '', wechatBound: false, appleBound: true, registerDate: '2024-01-10', questions: 23, answers: 89, balance: '$128.00', status: 'active' },
  { id: '12345680', name: 'ABC科技公司', userType: 'business', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=company1', bio: '专注于企业级软件解决方案', gender: 'other', birthday: '', verified: true, verificationStatus: 'verified', occupation: '科技公司', location: '广州市天河区', phone: '136****9999', email: 'contact@abc-tech.com', wechatBound: true, appleBound: true, registerDate: '2023-12-20', questions: 12, answers: 456, balance: '$1,250.00', status: 'active' },
  { id: '12345681', name: '违规用户001', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', bio: '', gender: 'other', birthday: '', verified: false, verificationStatus: 'unverified', occupation: '自由职业', location: '深圳市南山区', phone: '', email: '', wechatBound: false, appleBound: false, registerDate: '2024-01-05', questions: 5, answers: 12, balance: '$0.00', status: 'banned' },
  { id: '12345682', name: '美食达人', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', bio: '探索美食，分享生活。', gender: 'female', birthday: '1995-08-08', verified: false, verificationStatus: 'pending', occupation: '美食博主', location: '成都市武侯区', phone: '137****7777', email: 'foodlover@example.com', wechatBound: true, appleBound: false, registerDate: '2024-01-12', questions: 45, answers: 178, balance: '$520.00', status: 'pending' },
  { id: '12345683', name: '市政府办公室', userType: 'government', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gov1', bio: '为人民服务', gender: 'other', birthday: '', verified: true, verificationStatus: 'verified', occupation: '政府机构', location: '杭州市西湖区', phone: '135****5555', email: 'office@hz-gov.cn', wechatBound: true, appleBound: true, registerDate: '2023-11-08', questions: 89, answers: 567, balance: '$2,340.00', status: 'active' },
  { id: '12345684', name: '设计师小红', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7', bio: '设计让生活更美好。', gender: 'female', birthday: '1993-06-18', verified: true, verificationStatus: 'verified', occupation: 'UI设计师', location: '南京市鼓楼区', phone: '134****4444', email: 'xiaohong@example.com', wechatBound: true, appleBound: false, registerDate: '2023-10-15', questions: 34, answers: 289, balance: '$890.00', status: 'active' },
  { id: '12345685', name: '教师张老师', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8', bio: '教书育人，传道授业。', gender: 'female', birthday: '1980-09-10', verified: true, verificationStatus: 'verified', occupation: '高中教师', location: '武汉市洪山区', phone: '133****3333', email: 'teacher.zhang@example.com', wechatBound: true, appleBound: false, registerDate: '2023-09-20', questions: 67, answers: 423, balance: '$1,560.00', status: 'active' },
  { id: '12345686', name: 'XYZ律师事务所', userType: 'business', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=company2', bio: '专业法律服务机构', gender: 'other', birthday: '', verified: true, verificationStatus: 'verified', occupation: '律师事务所', location: '重庆市渝中区', phone: '132****2222', email: 'contact@xyz-law.com', wechatBound: true, appleBound: true, registerDate: '2023-08-12', questions: 23, answers: 678, balance: '$3,200.00', status: 'active' },
  { id: '12345687', name: '学生小王', userType: 'individual', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user10', bio: '好好学习，天天向上。', gender: 'male', birthday: '2002-12-01', verified: false, verificationStatus: 'pending', occupation: '大学生', location: '西安市雁塔区', phone: '131****1111', email: 'student.wang@example.com', wechatBound: false, appleBound: false, registerDate: '2024-01-18', questions: 12, answers: 45, balance: '$50.00', status: 'active' },
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
    bio: user.bio || '',
    gender: user.gender || 'male',
    birthday: user.birthday || '',
    occupation: user.occupation,
    location: user.location,
    locationValues: user.locationValues || [],
    phone: user.phone || '',
    email: user.email || '',
    password: '',
    newPassword: '',
    wechatBound: user.wechatBound || false,
    appleBound: user.appleBound || false,
    verified: user.verified,
    status: user.status,
    userType: user.userType || 'individual',
    verification: user.verification || {
      idType: '',
      idNumber: '',
      idFrontImage: '',
      idBackImage: '',
      businessName: '',
      businessRegistrationNumber: '',
      taxId: '',
      businessLicense: '',
      businessAddress: '',
      agencyName: '',
      agencyId: '',
      departmentName: '',
      officialDocument: '',
      authorizedPersonName: '',
      authorizedPersonTitle: ''
    }
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
    bio: '',
    gender: 'male',
    birthday: '',
    occupation: '',
    location: '',
    locationValues: [],
    phone: '',
    email: '',
    password: '',
    newPassword: '',
    wechatBound: false,
    appleBound: false,
    verified: false,
    status: 'active',
    userType: 'individual',
    verification: {
      idType: '',
      idNumber: '',
      idFrontImage: '',
      idBackImage: '',
      businessName: '',
      businessRegistrationNumber: '',
      taxId: '',
      businessLicense: '',
      businessAddress: '',
      agencyName: '',
      agencyId: '',
      departmentName: '',
      officialDocument: '',
      authorizedPersonName: '',
      authorizedPersonTitle: ''
    }
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
/* 旧版头像上传器（保留兼容性） */
.avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 100px;
  height: 100px;
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
  width: 100px;
  height: 100px;
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

/* 现代化头像上传器 */
.avatar-uploader-modern {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-uploader-modern:hover {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.avatar-uploader-modern .avatar-modern {
  width: 110px;
  height: 110px;
  display: block;
  object-fit: cover;
  border-radius: 10px;
}

.avatar-uploader-icon-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 10px;
  transition: all 0.3s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
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

/* Element Plus 表单项间距优化 */
:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

/* 对话框头部样式优化 */
:deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  margin: 0;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  margin: 0;
}
</style>
