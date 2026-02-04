<template>
  <div>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="国家/地区" value="195" icon="fas fa-globe" iconBg="bg-blue-100" iconColor="text-blue-500" />
      <StatCard title="州/省" value="3,456" valueClass="text-green-500" icon="fas fa-map" iconBg="bg-green-100" iconColor="text-green-500" />
      <StatCard title="城市" value="45,678" valueClass="text-purple-500" icon="fas fa-city" iconBg="bg-purple-100" iconColor="text-purple-500" />
      <StatCard title="已开通同城" value="1,256" valueClass="text-orange-500" icon="fas fa-map-marker-alt" iconBg="bg-orange-100" iconColor="text-orange-500" />
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 国家列表 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">国家/地区</span>
          <el-button type="primary" size="small" @click="showAddCountryModal = true">
            <i class="fas fa-plus mr-1"></i>添加
          </el-button>
        </div>
        <div class="p-3">
          <el-input v-model="countrySearch" placeholder="搜索国家" prefix-icon="Search" size="small" class="mb-3" />
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div 
            v-for="country in filteredCountries" 
            :key="country.code"
            :class="['px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50', selectedCountry === country.code && 'bg-red-50']"
            @click="selectCountry(country)"
          >
            <div class="flex items-center">
              <span class="text-xl mr-2">{{ country.flag }}</span>
              <span class="text-sm">{{ country.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">{{ country.stateCount }} 州/省</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 州/省列表 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">州/省</span>
          <el-button type="primary" size="small" :disabled="!selectedCountry" @click="showAddStateModal = true">
            <i class="fas fa-plus mr-1"></i>添加
          </el-button>
        </div>
        <div class="p-3">
          <el-input v-model="stateSearch" placeholder="搜索州/省" prefix-icon="Search" size="small" class="mb-3" />
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div v-if="!selectedCountry" class="p-8 text-center text-gray-400">
            <i class="fas fa-hand-point-left text-3xl mb-2"></i>
            <div class="text-sm">请先选择国家</div>
          </div>
          <div 
            v-else
            v-for="state in filteredStates" 
            :key="state.code"
            :class="['px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50', selectedState === state.code && 'bg-red-50']"
            @click="selectState(state)"
          >
            <span class="text-sm">{{ state.name }}</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">{{ state.cityCount }} 城市</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市列表 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span class="font-bold">城市</span>
          <el-button type="primary" size="small" :disabled="!selectedState" @click="showAddCityModal = true">
            <i class="fas fa-plus mr-1"></i>添加
          </el-button>
        </div>
        <div class="p-3">
          <el-input v-model="citySearch" placeholder="搜索城市" prefix-icon="Search" size="small" class="mb-3" />
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div v-if="!selectedState" class="p-8 text-center text-gray-400">
            <i class="fas fa-hand-point-left text-3xl mb-2"></i>
            <div class="text-sm">请先选择州/省</div>
          </div>
          <div 
            v-else
            v-for="city in filteredCities" 
            :key="city.code"
            class="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div>
              <span class="text-sm">{{ city.name }}</span>
              <span v-if="city.localEnabled" class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded">同城已开通</span>
            </div>
            <div class="flex items-center gap-2">
              <el-switch v-model="city.localEnabled" size="small" @change="toggleLocalService(city)" />
              <el-button link type="primary" size="small"><i class="fas fa-edit"></i></el-button>
              <el-button link type="danger" size="small"><i class="fas fa-trash"></i></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 同城服务统计 -->
    <div class="mt-6 bg-white rounded-xl shadow-sm p-6">
      <h3 class="font-bold mb-4">同城服务统计</h3>
      <div class="grid grid-cols-5 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-red-500">北京</div>
          <div class="text-sm text-gray-500 mt-1">12,580 用户</div>
          <div class="text-xs text-gray-400">3,456 问题</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-orange-500">上海</div>
          <div class="text-sm text-gray-500 mt-1">10,234 用户</div>
          <div class="text-xs text-gray-400">2,890 问题</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-yellow-500">广州</div>
          <div class="text-sm text-gray-500 mt-1">8,567 用户</div>
          <div class="text-xs text-gray-400">2,345 问题</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-500">深圳</div>
          <div class="text-sm text-gray-500 mt-1">7,890 用户</div>
          <div class="text-xs text-gray-400">2,123 问题</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-500">纽约</div>
          <div class="text-sm text-gray-500 mt-1">5,678 用户</div>
          <div class="text-xs text-gray-400">1,567 问题</div>
        </div>
      </div>
    </div>

    <!-- 添加国家弹窗 -->
    <el-dialog v-model="showAddCountryModal" title="添加国家/地区" width="400px">
      <el-form :model="newCountry" label-width="80px">
        <el-form-item label="国家名称">
          <el-input v-model="newCountry.name" placeholder="请输入国家名称" />
        </el-form-item>
        <el-form-item label="国家代码">
          <el-input v-model="newCountry.code" placeholder="如 CN, US, JP" />
        </el-form-item>
        <el-form-item label="国旗">
          <el-input v-model="newCountry.flag" placeholder="国旗emoji" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCountryModal = false">取消</el-button>
        <el-button type="primary">添加</el-button>
      </template>
    </el-dialog>

    <!-- 添加州/省弹窗 -->
    <el-dialog v-model="showAddStateModal" title="添加州/省" width="400px">
      <el-form :model="newState" label-width="80px">
        <el-form-item label="州/省名称">
          <el-input v-model="newState.name" placeholder="请输入州/省名称" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="newState.code" placeholder="如 BJ, NY" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddStateModal = false">取消</el-button>
        <el-button type="primary">添加</el-button>
      </template>
    </el-dialog>

    <!-- 添加城市弹窗 -->
    <el-dialog v-model="showAddCityModal" title="添加城市" width="400px">
      <el-form :model="newCity" label-width="100px">
        <el-form-item label="城市名称">
          <el-input v-model="newCity.name" placeholder="请输入城市名称" />
        </el-form-item>
        <el-form-item label="城市代码">
          <el-input v-model="newCity.code" placeholder="如 beijing, newyork" />
        </el-form-item>
        <el-form-item label="开通同城服务">
          <el-switch v-model="newCity.localEnabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCityModal = false">取消</el-button>
        <el-button type="primary">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatCard from '@/components/StatCard.vue'

const countrySearch = ref('')
const stateSearch = ref('')
const citySearch = ref('')
const selectedCountry = ref('')
const selectedState = ref('')
const showAddCountryModal = ref(false)
const showAddStateModal = ref(false)
const showAddCityModal = ref(false)

const newCountry = ref({ name: '', code: '', flag: '' })
const newState = ref({ name: '', code: '' })
const newCity = ref({ name: '', code: '', localEnabled: false })

const countries = ref([
  { code: 'CN', name: '中国', flag: '🇨🇳', stateCount: 34 },
  { code: 'US', name: '美国', flag: '🇺🇸', stateCount: 50 },
  { code: 'JP', name: '日本', flag: '🇯🇵', stateCount: 47 },
  { code: 'GB', name: '英国', flag: '🇬🇧', stateCount: 4 },
  { code: 'KR', name: '韩国', flag: '🇰🇷', stateCount: 17 },
  { code: 'AU', name: '澳大利亚', flag: '🇦🇺', stateCount: 8 },
  { code: 'CA', name: '加拿大', flag: '🇨🇦', stateCount: 13 },
])

const states = ref({
  'CN': [
    { code: 'BJ', name: '北京市', cityCount: 16 },
    { code: 'SH', name: '上海市', cityCount: 16 },
    { code: 'GD', name: '广东省', cityCount: 21 },
    { code: 'ZJ', name: '浙江省', cityCount: 11 },
    { code: 'JS', name: '江苏省', cityCount: 13 },
  ],
  'US': [
    { code: 'CA', name: '加利福尼亚州', cityCount: 482 },
    { code: 'NY', name: '纽约州', cityCount: 62 },
    { code: 'TX', name: '德克萨斯州', cityCount: 254 },
  ],
  'JP': [
    { code: 'TK', name: '东京都', cityCount: 23 },
    { code: 'OS', name: '大阪府', cityCount: 43 },
  ]
})

const cities = ref({
  'BJ': [
    { code: 'beijing', name: '北京', localEnabled: true },
  ],
  'SH': [
    { code: 'shanghai', name: '上海', localEnabled: true },
  ],
  'GD': [
    { code: 'guangzhou', name: '广州', localEnabled: true },
    { code: 'shenzhen', name: '深圳', localEnabled: true },
    { code: 'dongguan', name: '东莞', localEnabled: false },
    { code: 'foshan', name: '佛山', localEnabled: false },
  ],
  'CA': [
    { code: 'losangeles', name: '洛杉矶', localEnabled: true },
    { code: 'sanfrancisco', name: '旧金山', localEnabled: true },
    { code: 'sandiego', name: '圣地亚哥', localEnabled: false },
  ],
  'NY': [
    { code: 'newyork', name: '纽约', localEnabled: true },
    { code: 'buffalo', name: '布法罗', localEnabled: false },
  ],
  'TK': [
    { code: 'tokyo', name: '东京', localEnabled: true },
  ]
})

const filteredCountries = computed(() => {
  if (!countrySearch.value) return countries.value
  return countries.value.filter(c => c.name.includes(countrySearch.value))
})

const filteredStates = computed(() => {
  if (!selectedCountry.value) return []
  const list = states.value[selectedCountry.value] || []
  if (!stateSearch.value) return list
  return list.filter(s => s.name.includes(stateSearch.value))
})

const filteredCities = computed(() => {
  if (!selectedState.value) return []
  const list = cities.value[selectedState.value] || []
  if (!citySearch.value) return list
  return list.filter(c => c.name.includes(citySearch.value))
})

const selectCountry = (country) => {
  selectedCountry.value = country.code
  selectedState.value = ''
}

const selectState = (state) => {
  selectedState.value = state.code
}

const toggleLocalService = (city) => {
  console.log('Toggle local service for', city.name, city.localEnabled)
}
</script>
