<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">热榜标签管理</h1>
      <p class="text-gray-600 mt-1">管理各个热榜下的分类标签</p>
    </div>

    <!-- 热榜类型选择 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center gap-4 mb-4">
        <label class="text-sm font-medium text-gray-700">选择热榜类型：</label>
        <div class="flex gap-2">
          <button
            v-for="tab in hotTabs"
            :key="tab"
            @click="selectedTab = tab"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedTab === tab
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>
      <div class="text-sm text-gray-500">
        当前管理：<span class="font-medium text-gray-700">{{ selectedTab }}</span>
      </div>
    </div>

    <!-- 标签列表 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">标签列表</h2>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          添加标签
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(tag, index) in currentTags"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-tag text-red-500"></i>
              <span class="font-medium text-gray-800">{{ tag }}</span>
            </div>
            <div class="flex gap-2">
              <button
                @click="editTag(index, tag)"
                class="text-blue-500 hover:text-blue-700"
                title="编辑"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteTag(index)"
                class="text-red-500 hover:text-red-700"
                title="删除"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            排序：{{ index + 1 }}
          </div>
        </div>
      </div>

      <div v-if="currentTags.length === 0" class="text-center py-12 text-gray-400">
        <i class="fas fa-inbox text-4xl mb-3"></i>
        <p>暂无标签，点击右上角添加标签</p>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <i class="fas fa-info-circle text-blue-500 mt-1"></i>
        <div class="flex-1">
          <h3 class="font-medium text-blue-900 mb-2">使用说明</h3>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• 每个热榜类型可以配置多个分类标签</li>
            <li>• 标签会在移动端热榜页面显示，用户可以点击筛选</li>
            <li>• 所有热榜都会自动包含"全部"标签，无需手动添加</li>
            <li>• 标签顺序可以通过拖拽调整（暂未实现）</li>
            <li>• 删除标签不会影响已有的热榜数据</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 添加/编辑标签弹窗 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ editingIndex !== null ? '编辑标签' : '添加标签' }}
        </h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">标签名称</label>
          <input
            v-model="newTagName"
            type="text"
            placeholder="请输入标签名称"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            @keyup.enter="saveTag"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveTag"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const hotTabs = ['全站热榜', '国家热榜', '行业热榜', '个人热榜']
const selectedTab = ref('全站热榜')

// 标签数据
const tagsData = ref({
  '全站热榜': ['科技数码', 'Python编程', '职场发展', '健康养生', '美食烹饪', '旅游出行'],
  '国家热榜': ['政策法规', '社会民生', '经济发展', '教育医疗', '环境保护', '基础设施'],
  '行业热榜': ['互联网', '金融', '医疗健康', '教育培训', '房地产', '制造业', '餐饮服务'],
  '个人热榜': ['职业发展', '情感生活', '健康养生', '理财投资', '学习成长', '家庭关系'],
})

const currentTags = computed(() => tagsData.value[selectedTab.value] || [])

// 弹窗相关
const showAddModal = ref(false)
const newTagName = ref('')
const editingIndex = ref(null)

const closeModal = () => {
  showAddModal.value = false
  newTagName.value = ''
  editingIndex.value = null
}

const saveTag = () => {
  if (!newTagName.value.trim()) {
    alert('请输入标签名称')
    return
  }

  if (editingIndex.value !== null) {
    // 编辑
    tagsData.value[selectedTab.value][editingIndex.value] = newTagName.value.trim()
  } else {
    // 添加
    if (!tagsData.value[selectedTab.value]) {
      tagsData.value[selectedTab.value] = []
    }
    tagsData.value[selectedTab.value].push(newTagName.value.trim())
  }

  closeModal()
}

const editTag = (index, tag) => {
  editingIndex.value = index
  newTagName.value = tag
  showAddModal.value = true
}

const deleteTag = (index) => {
  if (confirm('确定要删除这个标签吗？')) {
    tagsData.value[selectedTab.value].splice(index, 1)
  }
}
</script>

<style scoped>
/* 添加一些过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
