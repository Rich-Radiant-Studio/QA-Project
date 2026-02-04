// 完全中文化的全球地区数据（包括中国省市区）
import { Country, State, City } from 'country-state-city'
import countries from 'i18n-iso-countries'
import zhLocale from 'i18n-iso-countries/langs/zh.json'
import { chinaCityMap } from './china-cities-map.js'

// 注册中文语言包
countries.registerLocale(zhLocale)

// 中国省份英文到中文的映射
const chinaProvinceMap = {
  'Beijing': '北京市',
  'Shanghai': '上海市',
  'Tianjin': '天津市',
  'Chongqing': '重庆市',
  'Hebei': '河北省',
  'Shanxi': '山西省',
  'Liaoning': '辽宁省',
  'Jilin': '吉林省',
  'Heilongjiang': '黑龙江省',
  'Jiangsu': '江苏省',
  'Zhejiang': '浙江省',
  'Anhui': '安徽省',
  'Fujian': '福建省',
  'Jiangxi': '江西省',
  'Shandong': '山东省',
  'Henan': '河南省',
  'Hubei': '湖北省',
  'Hunan': '湖南省',
  'Guangdong': '广东省',
  'Hainan': '海南省',
  'Sichuan': '四川省',
  'Guizhou': '贵州省',
  'Yunnan': '云南省',
  'Shaanxi': '陕西省',
  'Gansu': '甘肃省',
  'Qinghai': '青海省',
  'Taiwan': '台湾省',
  'Inner Mongolia': '内蒙古自治区',
  'Guangxi': '广西壮族自治区',
  'Tibet': '西藏自治区',
  'Ningxia': '宁夏回族自治区',
  'Xinjiang': '新疆维吾尔自治区',
  'Hong Kong': '香港特别行政区',
  'Macao': '澳门特别行政区'
}

/**
 * 生成完全中文化的三级地区数据
 */
export function generateRegionData() {
  const allCountries = Country.getAllCountries()
  
  return allCountries.map(country => {
    // 获取国家的中文名称
    const countryNameCN = countries.getName(country.isoCode, 'zh', { select: 'official' }) 
                       || countries.getName(country.isoCode, 'zh') 
                       || country.name
    
    const states = State.getStatesOfCountry(country.isoCode)
    
    // 特殊处理中国
    if (country.isoCode === 'CN') {
      return {
        value: country.isoCode,
        label: `${country.flag} ${countryNameCN}`,
        labelEN: country.name,
        labelCN: countryNameCN,
        children: states.map(state => {
          // 获取省份的中文名称
          const stateName = chinaProvinceMap[state.name] || state.name
          const cities = City.getCitiesOfState(country.isoCode, state.isoCode)
          
          return {
            value: state.isoCode,
            label: stateName,
            labelEN: state.name,
            children: cities.length > 0
              ? cities.map(city => {
                  // 获取城市的中文名称 - 智能匹配
                  let cityName = chinaCityMap[city.name]
                  
                  // 如果没有映射，尝试去掉 " Shi" 后缀再查找
                  if (!cityName && city.name.endsWith(' Shi')) {
                    const nameWithoutShi = city.name.replace(' Shi', '')
                    cityName = chinaCityMap[nameWithoutShi]
                  }
                  
                  // 如果还是没有映射，尝试去掉 " City" 后缀再查找
                  if (!cityName && city.name.endsWith(' City')) {
                    const nameWithoutCity = city.name.replace(' City', '')
                    cityName = chinaCityMap[nameWithoutCity]
                  }
                  
                  // 如果还是没有映射，尝试去掉 " District" 后缀再查找
                  if (!cityName && city.name.endsWith(' District')) {
                    const nameWithoutDistrict = city.name.replace(' District', '')
                    cityName = chinaCityMap[nameWithoutDistrict]
                  }
                  
                  // 最后的回退：保持原名
                  if (!cityName) {
                    cityName = city.name
                  }
                  
                  return {
                    value: city.name,
                    label: cityName,
                    labelEN: city.name
                  }
                })
              : [{ value: stateName, label: stateName }]
          }
        })
      }
    }
    
    // 其他国家保持原样
    return {
      value: country.isoCode,
      label: `${country.flag} ${countryNameCN}`,
      labelEN: country.name,
      labelCN: countryNameCN,
      children: states.length > 0 
        ? states.map(state => {
            const cities = City.getCitiesOfState(country.isoCode, state.isoCode)
            
            return {
              value: state.isoCode,
              label: state.name,
              children: cities.length > 0
                ? cities.map(city => ({
                    value: city.name,
                    label: city.name
                  }))
                : [{ value: state.name, label: state.name }]
            }
          })
        : [{ 
            value: country.name, 
            label: country.name,
            children: [{ value: country.name, label: country.name }]
          }]
    }
  }).sort((a, b) => {
    // 中国排第一
    if (a.value === 'CN') return -1
    if (b.value === 'CN') return 1
    return a.labelCN.localeCompare(b.labelCN, 'zh-CN')
  })
}

// 导出完整的地区数据（完全中文版）
export const regionData = generateRegionData()

// 辅助函数：根据选中的值数组获取完整的地区名称
export function getRegionLabel(values) {
  if (!values || values.length === 0) return ''
  
  let result = []
  let currentLevel = regionData
  
  for (let i = 0; i < values.length; i++) {
    const item = currentLevel.find(region => region.value === values[i])
    if (item) {
      // 移除 emoji 标志，只保留文字
      const label = item.label.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim()
      result.push(label)
      currentLevel = item.children || []
    }
  }
  
  return result.join(' ')
}

// 辅助函数：搜索地区（用于筛选）
export function searchRegion(keyword) {
  const results = []
  
  function search(data, path = []) {
    data.forEach(item => {
      const currentPath = [...path, item]
      const label = item.label.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim()
      const labelCN = item.labelCN || label
      const labelEN = item.labelEN || label
      
      // 支持中英文搜索
      if (label.toLowerCase().includes(keyword.toLowerCase()) ||
          labelCN.toLowerCase().includes(keyword.toLowerCase()) ||
          labelEN.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({
          value: item.value,
          label: currentPath.map(p => {
            const l = p.label.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim()
            return l
          }).join(' / '),
          path: currentPath.map(p => p.value)
        })
      }
      if (item.children) {
        search(item.children, currentPath)
      }
    })
  }
  
  search(regionData)
  return results
}

// 获取统计信息
export function getRegionStats() {
  let countryCount = 0
  let stateCount = 0
  let cityCount = 0
  
  regionData.forEach(country => {
    countryCount++
    if (country.children) {
      country.children.forEach(state => {
        stateCount++
        if (state.children) {
          cityCount += state.children.length
        }
      })
    }
  })
  
  return {
    countries: countryCount,
    states: stateCount,
    cities: cityCount,
    total: countryCount + stateCount + cityCount
  }
}

// 导出国家列表（中文版）
export const countriesList = Country.getAllCountries().map(country => {
  const countryNameCN = countries.getName(country.isoCode, 'zh', { select: 'official' }) 
                     || countries.getName(country.isoCode, 'zh') 
                     || country.name
  
  return {
    code: country.isoCode,
    name: country.name,
    nameCN: countryNameCN,
    flag: country.flag,
    phonecode: country.phonecode,
    currency: country.currency
  }
}).sort((a, b) => {
  if (a.code === 'CN') return -1
  if (b.code === 'CN') return 1
  return a.nameCN.localeCompare(b.nameCN, 'zh-CN')
})

// 根据国家代码获取州/省列表
export function getStatesByCountry(countryCode) {
  return State.getStatesOfCountry(countryCode).map(state => ({
    code: state.isoCode,
    name: state.name,
    countryCode: state.countryCode
  }))
}

// 根据国家和州代码获取城市列表
export function getCitiesByState(countryCode, stateCode) {
  return City.getCitiesOfState(countryCode, stateCode).map(city => ({
    name: city.name,
    stateCode: city.stateCode,
    countryCode: city.countryCode,
    latitude: city.latitude,
    longitude: city.longitude
  }))
}

// 根据国家代码获取中文名称
export function getCountryNameCN(countryCode) {
  return countries.getName(countryCode, 'zh', { select: 'official' }) 
      || countries.getName(countryCode, 'zh')
      || countryCode
}

// 根据国家代码获取英文名称
export function getCountryNameEN(countryCode) {
  return countries.getName(countryCode, 'en') || countryCode
}
