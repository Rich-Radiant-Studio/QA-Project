# 地区数据中文化说明

## 概述

本项目已完成中国地区数据的完全中文化，用户在选择所在地时，中国的省份和城市都会显示为中文。

## 文件结构

### 1. `src/data/china-cities-map.js`
包含中国所有地级市及主要城市的中英文映射表，共约300+个城市，包括：
- 4个直辖市（北京、上海、天津、重庆）及其区县
- 23个省的所有地级市
- 5个自治区的主要城市
- 2个特别行政区（香港、澳门）及其区域
- 台湾省的主要城市

### 2. `src/data/regions-full-cn.js`
完全中文化的全球地区数据生成器，特点：
- 导入并使用 `china-cities-map.js` 中的城市映射
- 使用 `i18n-iso-countries` 包获取国家的中文名称
- 使用 `country-state-city` 包获取完整的地区层级数据
- 中国排在国家列表第一位
- 对于中国的城市，优先使用中文映射，未映射的保持原样

### 3. `src/views/Users.vue`
用户管理页面，使用 `regions-full-cn.js` 中的数据：
```javascript
import { regionData, getRegionLabel, getRegionStats } from '@/data/regions-full-cn.js'
```

## 使用方式

### 在添加/编辑用户时选择所在地

1. 打开用户管理页面
2. 点击"添加用户"或编辑现有用户
3. 在"所在地"字段使用级联选择器
4. 选择：国家 → 省份/州 → 城市

示例：
- 🇨🇳 中国 → 北京市 → 朝阳区
- 🇨🇳 中国 → 广东省 → 广州市
- 🇨🇳 中国 → 四川省 → 成都市

### 地区数据统计

```javascript
import { getRegionStats } from '@/data/regions-full-cn.js'

const stats = getRegionStats()
console.log(stats)
// {
//   countries: 250,  // 国家数量
//   states: 5000+,   // 省份/州数量
//   cities: 150000+, // 城市数量
//   total: 155000+   // 总数
// }
```

### 获取地区完整名称

```javascript
import { getRegionLabel } from '@/data/regions-full-cn.js'

// 根据选中的值数组获取完整地区名称
const values = ['CN', 'BJ', 'Chaoyang']
const label = getRegionLabel(values)
console.log(label) // "中国 北京市 朝阳区"
```

## 覆盖范围

### 已完全中文化
- ✅ 所有中国省级行政区（34个）
- ✅ 所有地级市（约300个）
- ✅ 直辖市的所有区县
- ✅ 香港、澳门的所有区域
- ✅ 台湾的主要城市

### 部分中文化
- ⚠️ 县级市和小城镇（约1000+个）：由于数量庞大，未全部映射，保持原英文名称

### 其他国家
- 🌍 国家名称：使用 `i18n-iso-countries` 包的中文翻译
- 🌍 城市名称：保持原英文名称

## 扩展映射

如需添加更多城市的中文映射，请编辑 `src/data/china-cities-map.js` 文件：

```javascript
export const chinaCityMap = {
  // ... 现有映射
  
  // 添加新的城市映射
  'YourCityEnglishName': '你的城市中文名',
}
```

## 测试

### 测试页面
- `test-china-regions.html` - 测试中国地区中文化的完整性
- `test-regions.html` - 测试全球地区数据
- `test-regions-cn.html` - 测试中文版全球地区数据

### 运行测试
```bash
# 启动开发服务器
npm run dev

# 访问测试页面
http://localhost:3002/test-china-regions.html
```

## 依赖包

- `country-state-city` - 提供全球地区数据
- `i18n-iso-countries` - 提供国家名称的多语言翻译

## 注意事项

1. 地区数据来自 `country-state-city` 包，可能不是最新的
2. 部分小城镇和县级市未完全中文化
3. 如发现城市名称错误或缺失，请更新 `china-cities-map.js` 文件
4. 修改映射文件后，Vite 会自动热更新，无需重启服务器

## 更新日志

### 2024-02-03
- ✅ 创建独立的 `china-cities-map.js` 文件
- ✅ 完成所有中国地级市的中文映射（约300+个）
- ✅ 更新 `regions-full-cn.js` 使用新的映射表
- ✅ 修复用户管理页面地区选择的中文化问题
