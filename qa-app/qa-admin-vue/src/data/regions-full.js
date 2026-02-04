// 使用 country-state-city 包获取全球完整地区数据
import { Country, State, City } from 'country-state-city'

/**
 * 生成完整的三级地区数据
 * 结构：国家 -> 州/省 -> 城市
 */
export function generateRegionData() {
  const allCountries = Country.getAllCountries()
  
  return allCountries.map(country => {
    const states = State.getStatesOfCountry(country.isoCode)
    
    return {
      value: country.isoCode,
      label: `${country.flag} ${country.name}`,
      labelCN: country.name, // 保留原始名称
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
                : [{ value: state.name, label: state.name }] // 如果没有城市，使用州名作为城市
            }
          })
        : [{ 
            value: country.name, 
            label: country.name,
            children: [{ value: country.name, label: country.name }]
          }] // 如果没有州，使用国家名
    }
  })
}

// 导出完整的地区数据
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
      
      if (label.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({
          value: item.value,
          label: currentPath.map(p => p.label.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim()).join(' / '),
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

// 导出国家列表（用于快速访问）
export const countries = Country.getAllCountries().map(country => ({
  code: country.isoCode,
  name: country.name,
  flag: country.flag,
  phonecode: country.phonecode,
  currency: country.currency
}))

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
