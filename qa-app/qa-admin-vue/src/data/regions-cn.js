// 使用 country-state-city 和 i18n-iso-countries 包获取全球完整地区数据（中文版）
import { Country, State, City } from 'country-state-city'
import countries from 'i18n-iso-countries'
import zhLocale from 'i18n-iso-countries/langs/zh.json'
import enLocale from 'i18n-iso-countries/langs/en.json'

// 注册中文和英文语言包
countries.registerLocale(zhLocale)
countries.registerLocale(enLocale)

/**
 * 生成完整的三级地区数据（中文版）
 * 结构：国家（中文） -> 州/省 -> 城市
 */
export function generateRegionData() {
  const allCountries = Country.getAllCountries()
  
  return allCountries.map(country => {
    // 获取国家的中文名称
    const countryNameCN = countries.getName(country.isoCode, 'zh', { select: 'official' }) 
                       || countries.getName(country.isoCode, 'zh') 
                       || country.name
    
    const states = State.getStatesOfCountry(country.isoCode)
    
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
    // 中国排第一，其他按中文名称排序
    if (a.value === 'CN') return -1
    if (b.value === 'CN') return 1
    return a.labelCN.localeCompare(b.labelCN, 'zh-CN')
  })
}

// 导出完整的地区数据（中文版）
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
  // 中国排第一
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

// 获取所有支持的语言
export function getSupportedLanguages() {
  return countries.getSupportedLanguages()
}
