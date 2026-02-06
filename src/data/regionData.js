/**
 * Region Data with Multi-language Support
 * 支持多语言的区域数据
 */

import * as Localization from 'expo-localization';

// 获取当前语言
const getCurrentLanguage = () => {
  try {
    // 使用与 i18n 相同的方式检测语言
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    console.log('🌍 Localization.getLocales():', Localization.getLocales());
    console.log('🌍 Device language code:', deviceLanguage);
    
    // 如果是中文，返回 'zh'，否则返回 'en'
    const result = deviceLanguage === 'zh' ? 'zh' : 'en';
    console.log('🌍 Using language:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error detecting language:', error);
    return 'en'; // 默认返回英文
  }
};

// 国家名称（多语言）
const countryNames = {
  zh: ['美国', '英国', '法国', '德国', '意大利', '西班牙', '荷兰', '瑞士', '瑞典', '挪威', '丹麦', '芬兰', '比利时', '奥地利', '葡萄牙', '希腊', '波兰', '捷克', '爱尔兰', '匈牙利', '罗马尼亚'],
  en: ['United States', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Belgium', 'Austria', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Ireland', 'Hungary', 'Romania']
};

// 城市/州名称（多语言）
const cityNames = {
  // 美国 / United States
  '美国': {
    zh: ['纽约州', '加利福尼亚州', '德克萨斯州', '佛罗里达州', '伊利诺伊州', '宾夕法尼亚州', '俄亥俄州', '华盛顿州', '马萨诸塞州', '亚利桑那州'],
    en: ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Washington', 'Massachusetts', 'Arizona']
  },
  'United States': {
    zh: ['纽约州', '加利福尼亚州', '德克萨斯州', '佛罗里达州', '伊利诺伊州', '宾夕法尼亚州', '俄亥俄州', '华盛顿州', '马萨诸塞州', '亚利桑那州'],
    en: ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Washington', 'Massachusetts', 'Arizona']
  },
  
  // 英国 / United Kingdom
  '英国': {
    zh: ['伦敦', '曼彻斯特', '伯明翰', '利物浦', '爱丁堡', '格拉斯哥', '布里斯托', '利兹', '谢菲尔德', '纽卡斯尔'],
    en: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Glasgow', 'Bristol', 'Leeds', 'Sheffield', 'Newcastle']
  },
  'United Kingdom': {
    zh: ['伦敦', '曼彻斯特', '伯明翰', '利物浦', '爱丁堡', '格拉斯哥', '布里斯托', '利兹', '谢菲尔德', '纽卡斯尔'],
    en: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Glasgow', 'Bristol', 'Leeds', 'Sheffield', 'Newcastle']
  },
  
  // 法国 / France
  '法国': {
    zh: ['巴黎', '马赛', '里昂', '图卢兹', '尼斯', '南特', '斯特拉斯堡', '蒙彼利埃', '波尔多', '里尔'],
    en: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']
  },
  'France': {
    zh: ['巴黎', '马赛', '里昂', '图卢兹', '尼斯', '南特', '斯特拉斯堡', '蒙彼利埃', '波尔多', '里尔'],
    en: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']
  },
  
  // 德国 / Germany
  '德国': {
    zh: ['柏林', '慕尼黑', '汉堡', '法兰克福', '科隆', '斯图加特', '杜塞尔多夫', '多特蒙德', '埃森', '莱比锡'],
    en: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']
  },
  'Germany': {
    zh: ['柏林', '慕尼黑', '汉堡', '法兰克福', '科隆', '斯图加特', '杜塞尔多夫', '多特蒙德', '埃森', '莱比锡'],
    en: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']
  },
  
  // 意大利 / Italy
  '意大利': {
    zh: ['罗马', '米兰', '那不勒斯', '都灵', '佛罗伦萨', '威尼斯', '博洛尼亚', '热那亚', '巴勒莫', '维罗纳'],
    en: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna', 'Genoa', 'Palermo', 'Verona']
  },
  'Italy': {
    zh: ['罗马', '米兰', '那不勒斯', '都灵', '佛罗伦萨', '威尼斯', '博洛尼亚', '热那亚', '巴勒莫', '维罗纳'],
    en: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna', 'Genoa', 'Palermo', 'Verona']
  },
  
  // 西班牙 / Spain
  '西班牙': {
    zh: ['马德里', '巴塞罗那', '瓦伦西亚', '塞维利亚', '萨拉戈萨', '马拉加', '毕尔巴鄂', '格拉纳达', '阿利坎特', '科尔多瓦'],
    en: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Bilbao', 'Granada', 'Alicante', 'Córdoba']
  },
  'Spain': {
    zh: ['马德里', '巴塞罗那', '瓦伦西亚', '塞维利亚', '萨拉戈萨', '马拉加', '毕尔巴鄂', '格拉纳达', '阿利坎特', '科尔多瓦'],
    en: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Bilbao', 'Granada', 'Alicante', 'Córdoba']
  },
  
  // 荷兰 / Netherlands
  '荷兰': {
    zh: ['阿姆斯特丹', '鹿特丹', '海牙', '乌得勒支', '埃因霍温', '蒂尔堡', '格罗宁根', '阿尔梅勒', '布雷达', '奈梅亨'],
    en: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen']
  },
  'Netherlands': {
    zh: ['阿姆斯特丹', '鹿特丹', '海牙', '乌得勒支', '埃因霍温', '蒂尔堡', '格罗宁根', '阿尔梅勒', '布雷达', '奈梅亨'],
    en: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen']
  },
  
  // 瑞士 / Switzerland
  '瑞士': {
    zh: ['苏黎世', '日内瓦', '巴塞尔', '伯尔尼', '洛桑', '卢塞恩', '圣加仑', '卢加诺', '比尔', '图恩'],
    en: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun']
  },
  'Switzerland': {
    zh: ['苏黎世', '日内瓦', '巴塞尔', '伯尔尼', '洛桑', '卢塞恩', '圣加仑', '卢加诺', '比尔', '图恩'],
    en: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun']
  },
  
  // 瑞典 / Sweden
  '瑞典': {
    zh: ['斯德哥尔摩', '哥德堡', '马尔默', '乌普萨拉', '韦斯特罗斯', '厄勒布鲁', '林雪平', '赫尔辛堡', '延雪平', '诺尔雪平'],
    en: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping']
  },
  'Sweden': {
    zh: ['斯德哥尔摩', '哥德堡', '马尔默', '乌普萨拉', '韦斯特罗斯', '厄勒布鲁', '林雪平', '赫尔辛堡', '延雪平', '诺尔雪平'],
    en: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping']
  },
  
  // 挪威 / Norway
  '挪威': {
    zh: ['奥斯陆', '卑尔根', '特隆赫姆', '斯塔万格', '克里斯蒂安桑', '腓特烈斯塔', '特罗姆瑟', '桑内斯', '德拉门', '阿伦达尔'],
    en: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Fredrikstad', 'Tromsø', 'Sandnes', 'Drammen', 'Arendal']
  },
  'Norway': {
    zh: ['奥斯陆', '卑尔根', '特隆赫姆', '斯塔万格', '克里斯蒂安桑', '腓特烈斯塔', '特罗姆瑟', '桑内斯', '德拉门', '阿伦达尔'],
    en: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Fredrikstad', 'Tromsø', 'Sandnes', 'Drammen', 'Arendal']
  },
  
  // 其他国家类似...（为了简洁，这里只列出部分）
};

// 州/区名称（多语言）
const stateNames = {
  // 纽约州 / New York
  '纽约州': {
    zh: ['纽约市', '布法罗', '罗切斯特', '扬克斯', '锡拉丘兹', '奥尔巴尼', '新罗谢尔', '弗农山', '斯克内克塔迪', '尤蒂卡'],
    en: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica']
  },
  'New York': {
    zh: ['纽约市', '布法罗', '罗切斯特', '扬克斯', '锡拉丘兹', '奥尔巴尼', '新罗谢尔', '弗农山', '斯克内克塔迪', '尤蒂卡'],
    en: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica']
  },
  
  // 加利福尼亚州 / California
  '加利福尼亚州': {
    zh: ['洛杉矶', '圣地亚哥', '圣何塞', '旧金山', '弗雷斯诺', '萨克拉门托', '长滩', '奥克兰', '贝克斯菲尔德', '阿纳海姆'],
    en: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim']
  },
  'California': {
    zh: ['洛杉矶', '圣地亚哥', '圣何塞', '旧金山', '弗雷斯诺', '萨克拉门托', '长滩', '奥克兰', '贝克斯菲尔德', '阿纳海姆'],
    en: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim']
  },
  
  // 伦敦 / London
  '伦敦': {
    zh: ['威斯敏斯特', '肯辛顿', '切尔西', '卡姆登', '伊斯灵顿', '哈克尼', '陶尔哈姆莱茨', '格林威治', '刘易舍姆', '南华克'],
    en: ['Westminster', 'Kensington', 'Chelsea', 'Camden', 'Islington', 'Hackney', 'Tower Hamlets', 'Greenwich', 'Lewisham', 'Southwark']
  },
  'London': {
    zh: ['威斯敏斯特', '肯辛顿', '切尔西', '卡姆登', '伊斯灵顿', '哈克尼', '陶尔哈姆莱茨', '格林威治', '刘易舍姆', '南华克'],
    en: ['Westminster', 'Kensington', 'Chelsea', 'Camden', 'Islington', 'Hackney', 'Tower Hamlets', 'Greenwich', 'Lewisham', 'Southwark']
  },
  
  // 巴黎 / Paris
  '巴黎': {
    zh: ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区'],
    en: ['1st Arrondissement', '2nd Arrondissement', '3rd Arrondissement', '4th Arrondissement', '5th Arrondissement', '6th Arrondissement', '7th Arrondissement', '8th Arrondissement', '9th Arrondissement', '10th Arrondissement']
  },
  'Paris': {
    zh: ['第1区', '第2区', '第3区', '第4区', '第5区', '第6区', '第7区', '第8区', '第9区', '第10区'],
    en: ['1st Arrondissement', '2nd Arrondissement', '3rd Arrondissement', '4th Arrondissement', '5th Arrondissement', '6th Arrondissement', '7th Arrondissement', '8th Arrondissement', '9th Arrondissement', '10th Arrondissement']
  },
};

// 区名称（多语言）
const districtNames = {
  // 纽约市 / New York City
  '纽约市': {
    zh: ['曼哈顿', '布鲁克林', '皇后区', '布朗克斯', '史坦顿岛'],
    en: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
  },
  'New York City': {
    zh: ['曼哈顿', '布鲁克林', '皇后区', '布朗克斯', '史坦顿岛'],
    en: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
  },
  
  // 洛杉矶 / Los Angeles
  '洛杉矶': {
    zh: ['好莱坞', '比佛利山庄', '圣莫尼卡', '威尼斯', '市中心', '银湖', '回声公园', '韦斯特伍德', '布伦特伍德', '帕萨迪纳'],
    en: ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'Downtown', 'Silver Lake', 'Echo Park', 'Westwood', 'Brentwood', 'Pasadena']
  },
  'Los Angeles': {
    zh: ['好莱坞', '比佛利山庄', '圣莫尼卡', '威尼斯', '市中心', '银湖', '回声公园', '韦斯特伍德', '布伦特伍德', '帕萨迪纳'],
    en: ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'Downtown', 'Silver Lake', 'Echo Park', 'Westwood', 'Brentwood', 'Pasadena']
  },
  
  // 威斯敏斯特 / Westminster
  '威斯敏斯特': {
    zh: ['科文特花园', '梅费尔', '圣詹姆斯', '贝尔格拉维亚', '皮姆利科', '帕丁顿', '马里波恩'],
    en: ['Covent Garden', 'Mayfair', 'St James\'s', 'Belgravia', 'Pimlico', 'Paddington', 'Marylebone']
  },
  'Westminster': {
    zh: ['科文特花园', '梅费尔', '圣詹姆斯', '贝尔格拉维亚', '皮姆利科', '帕丁顿', '马里波恩'],
    en: ['Covent Garden', 'Mayfair', 'St James\'s', 'Belgravia', 'Pimlico', 'Paddington', 'Marylebone']
  },
};

/**
 * 获取区域数据（根据当前语言）
 */
export const getRegionData = () => {
  const lang = getCurrentLanguage();
  console.log('🗺️ getRegionData called, language:', lang);
  console.log('🗺️ Available countries:', countryNames[lang]);
  console.log('🗺️ First 3 countries:', countryNames[lang]?.slice(0, 3));
  
  const data = {
    countries: countryNames[lang],
    cities: Object.keys(cityNames).reduce((acc, key) => {
      // 使用当前语言的国家名作为键
      const countryIndex = countryNames.zh.indexOf(key);
      const countryKey = countryIndex >= 0 ? countryNames[lang][countryIndex] : key;
      acc[countryKey] = cityNames[key][lang];
      return acc;
    }, {}),
    states: Object.keys(stateNames).reduce((acc, key) => {
      // 查找对应的翻译键
      const stateKey = stateNames[key] ? key : key;
      if (stateNames[stateKey]) {
        acc[stateKey] = stateNames[stateKey][lang];
      }
      return acc;
    }, {}),
    districts: Object.keys(districtNames).reduce((acc, key) => {
      const districtKey = districtNames[key] ? key : key;
      if (districtNames[districtKey]) {
        acc[districtKey] = districtNames[districtKey][lang];
      }
      return acc;
    }, {}),
  };
  
  console.log('🗺️ Returning data with', data.countries?.length, 'countries');
  return data;
};

/**
 * 翻译区域名称
 * @param {string} name - 区域名称
 * @param {string} type - 类型 (country, city, state, district)
 * @returns {string} - 翻译后的名称
 */
export const translateRegionName = (name, type = 'country') => {
  const lang = getCurrentLanguage();
  
  switch (type) {
    case 'country':
      const countryIndex = countryNames.zh.indexOf(name);
      if (countryIndex >= 0) return countryNames[lang][countryIndex];
      const enCountryIndex = countryNames.en.indexOf(name);
      if (enCountryIndex >= 0) return countryNames[lang][enCountryIndex];
      break;
    // 可以添加其他类型的翻译逻辑
  }
  
  return name; // 如果找不到翻译，返回原名称
};

export default {
  getRegionData,
  translateRegionName,
  countryNames,
  cityNames,
  stateNames,
  districtNames,
};
