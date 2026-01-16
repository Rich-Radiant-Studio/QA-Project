<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="一级类别" value="3" icon="fas fa-folder" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="二级类别" value="18" valueClass="text-green-500" icon="fas fa-folder-open" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="关联问题" value="45,230" valueClass="text-purple-500" icon="fas fa-question" iconBg="bg-purple-100" iconColor="text-purple-500" />
      <StatCard title="今日新增" value="568" valueClass="text-orange-500" icon="fas fa-plus" iconBg="bg-orange-100" iconColor="text-orange-500" />
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 一级类别 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">一级类别</span>
          <el-button type="primary" size="small" @click="showAddLevel1Modal = true">
            <i class="fas fa-plus mr-1"></i>添加
          </el-button>
        </div>
        <div class="divide-y divide-gray-100">
          <div 
            v-for="cat in level1Categories" 
            :key="cat.id"
            :class="['px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50', selectedLevel1?.id === cat.id && 'bg-red-50']"
            @click="selectLevel1(cat)"
          >
            <div class="flex items-center">
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', cat.iconBg]">
                <i :class="[cat.icon, cat.iconColor]"></i>
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">{{ cat.name }}</div>
                <div class="text-xs text-gray-400">{{ cat.subCount }} 个子类别 · {{ cat.questionCount }} 问题</div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <el-button link type="primary" size="small" @click.stop="editLevel1(cat)">
                <i class="fas fa-edit"></i>
              </el-button>
              <el-button link type="danger" size="small" @click.stop="deleteLevel1(cat)">
                <i class="fas fa-trash"></i>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 二级类别 -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">
            二级类别
            <span v-if="selectedLevel1" class="text-red-500 ml-2">- {{ selectedLevel1.name }}</span>
          </span>
          <el-button v-if="selectedLevel1" type="primary" size="small" @click="showAddLevel2Modal = true">
            <i class="fas fa-plus mr-1"></i>添加子类别
          </el-button>
        </div>
        <div v-if="selectedLevel1">
          <el-table :data="level2Categories" style="width: 100%">
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column label="类别信息" min-width="200">
              <template #default="{ row }">
                <div class="flex items-center">
                  <div :class="['w-8 h-8 rounded flex items-center justify-center', row.iconBg]">
                    <i :class="[row.icon, row.iconColor, 'text-sm']"></i>
                  </div>
                  <div class="ml-3">
                    <div class="font-medium text-sm">{{ row.name }}</div>
                    <div class="text-xs text-gray-400">{{ row.desc }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="questionCount" label="问题数" width="100" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" size="small" @change="toggleCategory(row)" />
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="editLevel2(row)"><i class="fas fa-edit"></i></el-button>
                <el-button link size="small" @click="moveUp(row)"><i class="fas fa-arrow-up"></i></el-button>
                <el-button link size="small" @click="moveDown(row)"><i class="fas fa-arrow-down"></i></el-button>
                <el-button link type="danger" size="small" @click="deleteLevel2(row)"><i class="fas fa-trash"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="p-8 text-center text-gray-400">
          <i class="fas fa-hand-point-left text-4xl mb-4"></i>
          <div>请选择一个一级类别查看子类别</div>
        </div>
      </div>
    </div>

    <!-- 类别统计 -->
    <div class="mt-6 bg-white rounded-xl shadow-sm p-6">
      <h3 class="font-bold mb-4">类别问题统计</h3>
      <div class="grid grid-cols-3 gap-6">
        <div v-for="cat in level1Categories" :key="cat.id" class="border border-gray-100 rounded-lg p-4">
          <div class="flex items-center mb-4">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', cat.iconBg]">
              <i :class="[cat.icon, cat.iconColor]"></i>
            </div>
            <div class="ml-3">
              <div class="font-bold">{{ cat.name }}</div>
              <div class="text-sm text-gray-500">{{ cat.questionCount }} 个问题</div>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="sub in getSubCategories(cat.id)" :key="sub.id" class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ sub.name }}</span>
              <div class="flex items-center">
                <span class="text-gray-400 mr-2">{{ sub.questionCount }}</span>
                <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', cat.barColor]" :style="{ width: getPercent(sub.questionCount, cat.questionCount) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加一级类别弹窗 -->
    <el-dialog v-model="showAddLevel1Modal" title="添加一级类别" width="450px">
      <el-form :model="newLevel1" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="newLevel1.name" placeholder="如：国家、行业、个人" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input v-model="newLevel1.desc" type="textarea" :rows="2" placeholder="请输入类别描述" />
        </el-form-item>
        <el-form-item label="类别图标">
          <el-select v-model="newLevel1.icon" placeholder="选择图标" style="width: 100%">
            <el-option label="🏛️ 国家/政府" value="fas fa-landmark" />
            <el-option label="🏢 行业/企业" value="fas fa-industry" />
            <el-option label="👤 个人/生活" value="fas fa-user" />
            <el-option label="📚 教育/学习" value="fas fa-graduation-cap" />
            <el-option label="💼 职场/工作" value="fas fa-briefcase" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标颜色">
          <el-select v-model="newLevel1.color" placeholder="选择颜色" style="width: 100%">
            <el-option label="红色" value="red" />
            <el-option label="蓝色" value="blue" />
            <el-option label="绿色" value="green" />
            <el-option label="紫色" value="purple" />
            <el-option label="橙色" value="orange" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddLevel1Modal = false">取消</el-button>
        <el-button type="primary" @click="addLevel1">添加</el-button>
      </template>
    </el-dialog>

    <!-- 添加二级类别弹窗 -->
    <el-dialog v-model="showAddLevel2Modal" :title="'添加子类别 - ' + (selectedLevel1?.name || '')" width="450px">
      <el-form :model="newLevel2" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="newLevel2.name" placeholder="请输入类别名称" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input v-model="newLevel2.desc" type="textarea" :rows="2" placeholder="请输入类别描述" />
        </el-form-item>
        <el-form-item label="类别图标">
          <el-select v-model="newLevel2.icon" placeholder="选择图标" style="width: 100%">
            <el-option label="📋 政策法规" value="fas fa-file-alt" />
            <el-option label="👥 社会民生" value="fas fa-users" />
            <el-option label="💰 经济发展" value="fas fa-chart-line" />
            <el-option label="🏥 医疗健康" value="fas fa-heartbeat" />
            <el-option label="🎓 教育培训" value="fas fa-graduation-cap" />
            <el-option label="💻 互联网" value="fas fa-laptop-code" />
            <el-option label="🏦 金融" value="fas fa-university" />
            <el-option label="🏭 制造业" value="fas fa-cogs" />
            <el-option label="💼 职业发展" value="fas fa-briefcase" />
            <el-option label="❤️ 情感生活" value="fas fa-heart" />
            <el-option label="🏠 家庭关系" value="fas fa-home" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="newLevel2.sort" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="newLevel2.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddLevel2Modal = false">取消</el-button>
        <el-button type="primary" @click="addLevel2">添加</el-button>
      </template>
    </el-dialog>

    <!-- 编辑二级类别弹窗 -->
    <el-dialog v-model="showEditLevel2Modal" title="编辑子类别" width="450px">
      <el-form v-if="editingLevel2" :model="editingLevel2" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="editingLevel2.name" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input v-model="editingLevel2.desc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editingLevel2.sort" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="editingLevel2.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditLevel2Modal = false">取消</el-button>
        <el-button type="primary" @click="saveLevel2">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatCard from '@/components/StatCard.vue'

const selectedLevel1 = ref(null)
const showAddLevel1Modal = ref(false)
const showAddLevel2Modal = ref(false)
const showEditLevel2Modal = ref(false)
const editingLevel2 = ref(null)

const newLevel1 = ref({ name: '', desc: '', icon: 'fas fa-landmark', color: 'blue' })
const newLevel2 = ref({ name: '', desc: '', icon: 'fas fa-file-alt', sort: 1, enabled: true })

const level1Categories = ref([
  { id: 1, name: '国家', desc: '国家政策、社会民生相关问题', icon: 'fas fa-landmark', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', barColor: 'bg-blue-500', subCount: 6, questionCount: 15680 },
  { id: 2, name: '行业', desc: '各行业专业问题', icon: 'fas fa-industry', iconBg: 'bg-green-100', iconColor: 'text-green-500', barColor: 'bg-green-500', subCount: 7, questionCount: 18950 },
  { id: 3, name: '个人', desc: '个人生活、成长相关问题', icon: 'fas fa-user', iconBg: 'bg-purple-100', iconColor: 'text-purple-500', barColor: 'bg-purple-500', subCount: 6, questionCount: 10600 },
])

const allLevel2Categories = ref([
  // 国家类别
  { id: 101, parentId: 1, name: '政策法规', desc: '国家政策、法律法规解读', icon: 'fas fa-file-alt', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', questionCount: 3560, sort: 1, enabled: true },
  { id: 102, parentId: 1, name: '社会民生', desc: '社会热点、民生问题', icon: 'fas fa-users', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', questionCount: 4230, sort: 2, enabled: true },
  { id: 103, parentId: 1, name: '经济发展', desc: '宏观经济、发展趋势', icon: 'fas fa-chart-line', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', questionCount: 2890, sort: 3, enabled: true },
  { id: 104, parentId: 1, name: '教育医疗', desc: '教育改革、医疗政策', icon: 'fas fa-graduation-cap', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', questionCount: 2100, sort: 4, enabled: true },
  { id: 105, parentId: 1, name: '环境保护', desc: '环保政策、生态建设', icon: 'fas fa-leaf', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', questionCount: 1560, sort: 5, enabled: true },
  { id: 106, parentId: 1, name: '基础设施', desc: '交通、通信等基建', icon: 'fas fa-road', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', questionCount: 1340, sort: 6, enabled: true },
  // 行业类别
  { id: 201, parentId: 2, name: '互联网', desc: '互联网技术、产品', icon: 'fas fa-laptop-code', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 5680, sort: 1, enabled: true },
  { id: 202, parentId: 2, name: '金融', desc: '银行、证券、保险', icon: 'fas fa-university', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 3450, sort: 2, enabled: true },
  { id: 203, parentId: 2, name: '医疗健康', desc: '医疗行业、健康产业', icon: 'fas fa-heartbeat', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 2890, sort: 3, enabled: true },
  { id: 204, parentId: 2, name: '教育培训', desc: '教育机构、培训行业', icon: 'fas fa-chalkboard-teacher', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 2340, sort: 4, enabled: true },
  { id: 205, parentId: 2, name: '房地产', desc: '房产开发、物业管理', icon: 'fas fa-building', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 1890, sort: 5, enabled: true },
  { id: 206, parentId: 2, name: '制造业', desc: '工业制造、智能制造', icon: 'fas fa-cogs', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 1560, sort: 6, enabled: true },
  { id: 207, parentId: 2, name: '餐饮服务', desc: '餐饮、酒店、旅游', icon: 'fas fa-utensils', iconBg: 'bg-green-50', iconColor: 'text-green-500', questionCount: 1140, sort: 7, enabled: true },
  // 个人类别
  { id: 301, parentId: 3, name: '职业发展', desc: '求职、晋升、转行', icon: 'fas fa-briefcase', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', questionCount: 3200, sort: 1, enabled: true },
  { id: 302, parentId: 3, name: '情感生活', desc: '恋爱、婚姻、人际', icon: 'fas fa-heart', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', questionCount: 2560, sort: 2, enabled: true },
  { id: 303, parentId: 3, name: '健康养生', desc: '身体健康、养生保健', icon: 'fas fa-heartbeat', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', questionCount: 1890, sort: 3, enabled: true },
  { id: 304, parentId: 3, name: '理财投资', desc: '个人理财、投资规划', icon: 'fas fa-piggy-bank', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', questionCount: 1450, sort: 4, enabled: true },
  { id: 305, parentId: 3, name: '学习成长', desc: '技能学习、自我提升', icon: 'fas fa-book', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', questionCount: 980, sort: 5, enabled: true },
  { id: 306, parentId: 3, name: '家庭关系', desc: '亲子、婆媳、家庭', icon: 'fas fa-home', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', questionCount: 520, sort: 6, enabled: true },
])

const level2Categories = computed(() => {
  if (!selectedLevel1.value) return []
  return allLevel2Categories.value
    .filter(c => c.parentId === selectedLevel1.value.id)
    .sort((a, b) => a.sort - b.sort)
})

const getSubCategories = (parentId) => {
  return allLevel2Categories.value.filter(c => c.parentId === parentId)
}

const getPercent = (value, total) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

const selectLevel1 = (cat) => {
  selectedLevel1.value = cat
}

const editLevel1 = (cat) => {
  ElMessage.info('编辑类别: ' + cat.name)
}

const deleteLevel1 = (cat) => {
  ElMessageBox.confirm(`确定要删除类别"${cat.name}"吗？删除后该类别下的所有子类别也将被删除。`, '删除确认', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const addLevel1 = () => {
  if (!newLevel1.value.name) {
    ElMessage.warning('请输入类别名称')
    return
  }
  showAddLevel1Modal.value = false
  ElMessage.success('添加成功')
  newLevel1.value = { name: '', desc: '', icon: 'fas fa-landmark', color: 'blue' }
}

const editLevel2 = (row) => {
  editingLevel2.value = { ...row }
  showEditLevel2Modal.value = true
}

const saveLevel2 = () => {
  showEditLevel2Modal.value = false
  ElMessage.success('保存成功')
}

const deleteLevel2 = (row) => {
  ElMessageBox.confirm(`确定要删除子类别"${row.name}"吗？`, '删除确认', {
    type: 'warning'
  }).then(() => {
    const idx = allLevel2Categories.value.findIndex(c => c.id === row.id)
    if (idx > -1) {
      allLevel2Categories.value.splice(idx, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const addLevel2 = () => {
  if (!newLevel2.value.name) {
    ElMessage.warning('请输入类别名称')
    return
  }
  const newCat = {
    id: Date.now(),
    parentId: selectedLevel1.value.id,
    name: newLevel2.value.name,
    desc: newLevel2.value.desc,
    icon: newLevel2.value.icon,
    iconBg: selectedLevel1.value.iconBg.replace('100', '50'),
    iconColor: selectedLevel1.value.iconColor,
    questionCount: 0,
    sort: newLevel2.value.sort,
    enabled: newLevel2.value.enabled
  }
  allLevel2Categories.value.push(newCat)
  showAddLevel2Modal.value = false
  ElMessage.success('添加成功')
  newLevel2.value = { name: '', desc: '', icon: 'fas fa-file-alt', sort: 1, enabled: true }
}

const toggleCategory = (row) => {
  ElMessage.success(row.enabled ? '已启用' : '已禁用')
}

const moveUp = (row) => {
  const list = level2Categories.value
  const idx = list.findIndex(c => c.id === row.id)
  if (idx > 0) {
    const prevSort = list[idx - 1].sort
    list[idx - 1].sort = row.sort
    row.sort = prevSort
    ElMessage.success('上移成功')
  }
}

const moveDown = (row) => {
  const list = level2Categories.value
  const idx = list.findIndex(c => c.id === row.id)
  if (idx < list.length - 1) {
    const nextSort = list[idx + 1].sort
    list[idx + 1].sort = row.sort
    row.sort = nextSort
    ElMessage.success('下移成功')
  }
}
</script>
