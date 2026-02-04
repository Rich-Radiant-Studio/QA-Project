<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="角色总数" value="8" icon="fas fa-user-shield" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="管理员" value="12" valueClass="text-red-500" icon="fas fa-user-cog" iconBg="bg-red-100" iconColor="text-red-500" />
      <StatCard title="权限项" value="56" valueClass="text-purple-500" icon="fas fa-key" iconBg="bg-purple-100" iconColor="text-purple-500" />
      <StatCard title="操作日志" value="12,580" valueClass="text-green-500" icon="fas fa-history" iconBg="bg-green-100" iconColor="text-green-500" />
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 角色列表 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">角色管理</span>
          <el-button type="primary" size="small" @click="showAddRoleModal = true">
            <i class="fas fa-plus mr-1"></i>添加角色
          </el-button>
        </div>
        <div class="divide-y divide-gray-100">
          <div 
            v-for="role in roles" 
            :key="role.id"
            :class="['px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50', selectedRole?.id === role.id && 'bg-red-50']"
            @click="selectRole(role)"
          >
            <div class="flex items-center">
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', role.iconBg]">
                <i :class="[role.icon, role.iconColor]"></i>
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">{{ role.name }}</div>
                <div class="text-xs text-gray-400">{{ role.userCount }} 人</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <el-button v-if="!role.isSystem" link type="primary" size="small" @click.stop="editRole(role)">
                <i class="fas fa-edit"></i>
              </el-button>
              <el-button v-if="!role.isSystem" link type="danger" size="small" @click.stop="deleteRole(role)">
                <i class="fas fa-trash"></i>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限配置 -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">
            权限配置
            <span v-if="selectedRole" class="text-red-500 ml-2">- {{ selectedRole.name }}</span>
          </span>
          <el-button v-if="selectedRole && !selectedRole.isSystem" type="primary" size="small" @click="savePermissions">
            <i class="fas fa-save mr-1"></i>保存
          </el-button>
        </div>
        <div v-if="selectedRole" class="p-4">
          <div v-for="group in permissionGroups" :key="group.name" class="mb-6">
            <div class="flex items-center mb-3">
              <el-checkbox 
                v-model="group.checked" 
                :indeterminate="group.indeterminate"
                @change="toggleGroup(group)"
                :disabled="selectedRole.isSystem"
              >
                <span class="font-medium">{{ group.name }}</span>
              </el-checkbox>
            </div>
            <div class="grid grid-cols-4 gap-3 ml-6">
              <el-checkbox 
                v-for="perm in group.permissions" 
                :key="perm.key"
                v-model="perm.checked"
                @change="updateGroupStatus(group)"
                :disabled="selectedRole.isSystem"
              >
                {{ perm.name }}
              </el-checkbox>
            </div>
          </div>
        </div>
        <div v-else class="p-8 text-center text-gray-400">
          <i class="fas fa-hand-point-left text-4xl mb-4"></i>
          <div>请选择一个角色查看权限配置</div>
        </div>
      </div>
    </div>

    <!-- 管理员列表 -->
    <div class="mt-6 bg-white rounded-xl shadow-sm">
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span class="font-bold">管理员列表</span>
        <el-button type="primary" size="small" @click="showAddAdminModal = true">
          <i class="fas fa-plus mr-1"></i>添加管理员
        </el-button>
      </div>
      <el-table :data="admins" style="width: 100%">
        <el-table-column label="管理员" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <img :src="row.avatar" class="w-10 h-10 rounded-full">
              <div class="ml-3">
                <div class="font-medium">{{ row.name }}</div>
                <div class="text-xs text-gray-400">{{ row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <span :class="['px-2 py-1 text-xs rounded', row.roleClass]">{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="lastLogin" label="最后登录" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', row.status === 'active' ? 'status-approved' : 'status-banned']">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small"><i class="fas fa-edit"></i></el-button>
            <el-button link type="warning" size="small"><i class="fas fa-key"></i></el-button>
            <el-button v-if="!row.isSuper" link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加角色弹窗 -->
    <el-dialog v-model="showAddRoleModal" title="添加角色" width="400px">
      <el-form :model="newRole" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="newRole.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="newRole.desc" type="textarea" :rows="2" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="角色图标">
          <el-select v-model="newRole.icon" placeholder="选择图标">
            <el-option label="用户" value="fas fa-user" />
            <el-option label="审核" value="fas fa-check-circle" />
            <el-option label="财务" value="fas fa-dollar-sign" />
            <el-option label="运营" value="fas fa-chart-line" />
            <el-option label="客服" value="fas fa-headset" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddRoleModal = false">取消</el-button>
        <el-button type="primary" @click="addRole">添加</el-button>
      </template>
    </el-dialog>

    <!-- 添加管理员弹窗 -->
    <el-dialog v-model="showAddAdminModal" title="添加管理员" width="450px">
      <el-form :model="newAdmin" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="newAdmin.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newAdmin.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="newAdmin.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="newAdmin.roleId" placeholder="选择角色" style="width: 100%">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="newAdmin.password" type="password" placeholder="请输入初始密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddAdminModal = false">取消</el-button>
        <el-button type="primary" @click="addAdmin">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import StatCard from '@/components/StatCard.vue'

const selectedRole = ref(null)
const showAddRoleModal = ref(false)
const showAddAdminModal = ref(false)

const newRole = ref({ name: '', desc: '', icon: 'fas fa-user' })
const newAdmin = ref({ name: '', email: '', phone: '', roleId: '', password: '' })

const roles = ref([
  { id: 1, name: '超级管理员', icon: 'fas fa-crown', iconBg: 'bg-red-100', iconColor: 'text-red-500', userCount: 2, isSystem: true },
  { id: 2, name: '内容审核员', icon: 'fas fa-check-circle', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', userCount: 5, isSystem: false },
  { id: 3, name: '财务管理员', icon: 'fas fa-dollar-sign', iconBg: 'bg-green-100', iconColor: 'text-green-500', userCount: 2, isSystem: false },
  { id: 4, name: '运营管理员', icon: 'fas fa-chart-line', iconBg: 'bg-purple-100', iconColor: 'text-purple-500', userCount: 3, isSystem: false },
  { id: 5, name: '客服专员', icon: 'fas fa-headset', iconBg: 'bg-orange-100', iconColor: 'text-orange-500', userCount: 4, isSystem: false },
])

const permissionGroups = reactive([
  { 
    name: '用户管理', checked: false, indeterminate: false,
    permissions: [
      { key: 'user_view', name: '查看用户', checked: false },
      { key: 'user_edit', name: '编辑用户', checked: false },
      { key: 'user_ban', name: '封禁用户', checked: false },
      { key: 'user_delete', name: '删除用户', checked: false },
    ]
  },
  { 
    name: '问题管理', checked: false, indeterminate: false,
    permissions: [
      { key: 'question_view', name: '查看问题', checked: false },
      { key: 'question_audit', name: '审核问题', checked: false },
      { key: 'question_edit', name: '编辑问题', checked: false },
      { key: 'question_delete', name: '删除问题', checked: false },
    ]
  },
  { 
    name: '回答管理', checked: false, indeterminate: false,
    permissions: [
      { key: 'answer_view', name: '查看回答', checked: false },
      { key: 'answer_audit', name: '审核回答', checked: false },
      { key: 'answer_edit', name: '编辑回答', checked: false },
      { key: 'answer_delete', name: '删除回答', checked: false },
    ]
  },
  { 
    name: '活动管理', checked: false, indeterminate: false,
    permissions: [
      { key: 'activity_view', name: '查看活动', checked: false },
      { key: 'activity_create', name: '创建活动', checked: false },
      { key: 'activity_audit', name: '审核活动', checked: false },
      { key: 'activity_delete', name: '删除活动', checked: false },
    ]
  },
  { 
    name: '财务管理', checked: false, indeterminate: false,
    permissions: [
      { key: 'finance_view', name: '查看财务', checked: false },
      { key: 'finance_withdraw', name: '处理提现', checked: false },
      { key: 'finance_refund', name: '处理退款', checked: false },
      { key: 'finance_export', name: '导出报表', checked: false },
    ]
  },
  { 
    name: '系统设置', checked: false, indeterminate: false,
    permissions: [
      { key: 'setting_view', name: '查看设置', checked: false },
      { key: 'setting_edit', name: '修改设置', checked: false },
      { key: 'permission_manage', name: '权限管理', checked: false },
      { key: 'log_view', name: '查看日志', checked: false },
    ]
  },
])

const admins = ref([
  { id: 1, name: '超级管理员', email: 'admin@example.com', phone: '138****8888', role: '超级管理员', roleClass: 'bg-red-100 text-red-600', lastLogin: '2026-01-16 10:30', status: 'active', isSuper: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
  { id: 2, name: '张审核', email: 'reviewer@example.com', phone: '139****6666', role: '内容审核员', roleClass: 'bg-blue-100 text-blue-600', lastLogin: '2026-01-16 09:15', status: 'active', isSuper: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin2' },
  { id: 3, name: '李财务', email: 'finance@example.com', phone: '137****5555', role: '财务管理员', roleClass: 'bg-green-100 text-green-600', lastLogin: '2026-01-15 18:45', status: 'active', isSuper: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin3' },
  { id: 4, name: '王运营', email: 'operator@example.com', phone: '136****4444', role: '运营管理员', roleClass: 'bg-purple-100 text-purple-600', lastLogin: '2026-01-14 14:20', status: 'disabled', isSuper: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin4' },
])

const selectRole = (role) => {
  selectedRole.value = role
  // 模拟加载权限数据
  if (role.isSystem) {
    permissionGroups.forEach(g => {
      g.permissions.forEach(p => p.checked = true)
      g.checked = true
      g.indeterminate = false
    })
  } else {
    permissionGroups.forEach(g => {
      g.permissions.forEach(p => p.checked = Math.random() > 0.5)
      updateGroupStatus(g)
    })
  }
}

const toggleGroup = (group) => {
  group.permissions.forEach(p => p.checked = group.checked)
  group.indeterminate = false
}

const updateGroupStatus = (group) => {
  const checkedCount = group.permissions.filter(p => p.checked).length
  group.checked = checkedCount === group.permissions.length
  group.indeterminate = checkedCount > 0 && checkedCount < group.permissions.length
}

const savePermissions = () => {
  ElMessage.success('权限保存成功')
}

const addRole = () => {
  showAddRoleModal.value = false
  ElMessage.success('角色添加成功')
}

const editRole = (role) => {
  ElMessage.info('编辑角色: ' + role.name)
}

const deleteRole = (role) => {
  ElMessage.warning('删除角色: ' + role.name)
}

const addAdmin = () => {
  showAddAdminModal.value = false
  ElMessage.success('管理员添加成功')
}
</script>
