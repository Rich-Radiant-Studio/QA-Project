// 完全中文化的全球地区数据（包括中国省市区）
import { Country, State, City } from 'country-state-city'
import countries from 'i18n-iso-countries'
import zhLocale from 'i18n-iso-countries/langs/zh.json'

// 注册中文语言包
countries.registerLocale(zhLocale)

// 中国省份英文到中文的映射（补充映射）
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

// 中国城市英文到中文的映射（全面覆盖）
const chinaCityMap = {
  // 北京市
  'Dongcheng': '东城区',
  'Xicheng': '西城区',
  'Chaoyang': '朝阳区',
  'Fengtai': '丰台区',
  'Shijingshan': '石景山区',
  'Haidian': '海淀区',
  'Mentougou': '门头沟区',
  'Fangshan': '房山区',
  'Tongzhou': '通州区',
  'Shunyi': '顺义区',
  'Changping': '昌平区',
  'Daxing': '大兴区',
  'Huairou': '怀柔区',
  'Pinggu': '平谷区',
  'Miyun': '密云区',
  'Yanqing': '延庆区',
  
  // 上海市
  'Huangpu': '黄浦区',
  'Xuhui': '徐汇区',
  'Changning': '长宁区',
  'Jingan': '静安区',
  'Putuo': '普陀区',
  'Hongkou': '虹口区',
  'Yangpu': '杨浦区',
  'Minhang': '闵行区',
  'Baoshan': '宝山区',
  'Jiading': '嘉定区',
  'Pudong': '浦东新区',
  'Jinshan': '金山区',
  'Songjiang': '松江区',
  'Qingpu': '青浦区',
  'Fengxian': '奉贤区',
  'Chongming': '崇明区',
  
  // 天津市
  'Heping': '和平区',
  'Hedong': '河东区',
  'Hexi': '河西区',
  'Nankai': '南开区',
  'Hebei': '河北区',
  'Hongqiao': '红桥区',
  'Dongli': '东丽区',
  'Xiqing': '西青区',
  'Jinnan': '津南区',
  'Beichen': '北辰区',
  'Wuqing': '武清区',
  'Baodi': '宝坻区',
  'Binhai': '滨海新区',
  'Ninghe': '宁河区',
  'Jinghai': '静海区',
  'Jizhou': '蓟州区',
  
  // 重庆市
  'Wanzhou': '万州区',
  'Fuling': '涪陵区',
  'Yuzhong': '渝中区',
  'Dadukou': '大渡口区',
  'Jiangbei': '江北区',
  'Shapingba': '沙坪坝区',
  'Jiulongpo': '九龙坡区',
  'Nanan': '南岸区',
  'Beibei': '北碚区',
  'Qijiang': '綦江区',
  'Dazu': '大足区',
  'Yubei': '渝北区',
  'Banan': '巴南区',
  'Qianjiang': '黔江区',
  'Changshou': '长寿区',
  'Jiangjin': '江津区',
  'Hechuan': '合川区',
  'Yongchuan': '永川区',
  'Nanchuan': '南川区',
  'Bishan': '璧山区',
  'Tongliang': '铜梁区',
  'Tongnan': '潼南区',
  'Rongchang': '荣昌区',
  'Kaizhou': '开州区',
  'Liangping': '梁平区',
  'Wulong': '武隆区',
  
  // 海南省
  'Haikou': '海口市',
  'Sanya': '三亚市',
  'Sansha': '三沙市',
  'Danzhou': '儋州市',
  'Wuzhishan': '五指山市',
  'Qionghai': '琼海市',
  'Wenchang': '文昌市',
  'Wanning': '万宁市',
  'Dongfang': '东方市',
  'Ding\'an': '定安县',
  'Tunchang': '屯昌县',
  'Chengmai': '澄迈县',
  'Lingao': '临高县',
  'Baisha': '白沙黎族自治县',
  'Changjiang': '昌江黎族自治县',
  'Ledong': '乐东黎族自治县',
  'Lingshui': '陵水黎族自治县',
  'Baoting': '保亭黎族苗族自治县',
  'Qiongzhong': '琼中黎族苗族自治县',
  'Basuo': '八所',
  'Chongshan': '崇山',
  
  // 广东省
  'Guangzhou': '广州市',
  'Shenzhen': '深圳市',
  'Zhuhai': '珠海市',
  'Shantou': '汕头市',
  'Foshan': '佛山市',
  'Shaoguan': '韶关市',
  'Zhanjiang': '湛江市',
  'Zhaoqing': '肇庆市',
  'Jiangmen': '江门市',
  'Maoming': '茂名市',
  'Huizhou': '惠州市',
  'Meizhou': '梅州市',
  'Shanwei': '汕尾市',
  'Heyuan': '河源市',
  'Yangjiang': '阳江市',
  'Qingyuan': '清远市',
  'Dongguan': '东莞市',
  'Zhongshan': '中山市',
  'Chaozhou': '潮州市',
  'Jieyang': '揭阳市',
  'Yunfu': '云浮市',
  
  // 广西壮族自治区
  'Nanning': '南宁市',
  'Liuzhou': '柳州市',
  'Guilin': '桂林市',
  'Wuzhou': '梧州市',
  'Beihai': '北海市',
  'Fangchenggang': '防城港市',
  'Qinzhou': '钦州市',
  'Guigang': '贵港市',
  'Yulin': '玉林市',
  'Baise': '百色市',
  'Hezhou': '贺州市',
  'Hechi': '河池市',
  'Laibin': '来宾市',
  'Chongzuo': '崇左市',
  'Guangxi Zhuang': '广西壮族自治区',
  
  // 浙江省
  'Hangzhou': '杭州市',
  'Ningbo': '宁波市',
  'Wenzhou': '温州市',
  'Jiaxing': '嘉兴市',
  'Huzhou': '湖州市',
  'Shaoxing': '绍兴市',
  'Jinhua': '金华市',
  'Quzhou': '衢州市',
  'Zhoushan': '舟山市',
  'Taizhou': '台州市',
  'Lishui': '丽水市',
  
  // 江苏省
  'Nanjing': '南京市',
  'Suzhou': '苏州市',
  'Wuxi': '无锡市',
  'Changzhou': '常州市',
  'Zhenjiang': '镇江市',
  'Nantong': '南通市',
  'Yangzhou': '扬州市',
  'Yancheng': '盐城市',
  'Xuzhou': '徐州市',
  'Huai\'an': '淮安市',
  'Lianyungang': '连云港市',
  'Suqian': '宿迁市',
  'Taizhou': '泰州市',
  
  // 四川省
  'Chengdu': '成都市',
  'Zigong': '自贡市',
  'Panzhihua': '攀枝花市',
  'Luzhou': '泸州市',
  'Deyang': '德阳市',
  'Mianyang': '绵阳市',
  'Guangyuan': '广元市',
  'Suining': '遂宁市',
  'Neijiang': '内江市',
  'Leshan': '乐山市',
  'Nanchong': '南充市',
  'Meishan': '眉山市',
  'Yibin': '宜宾市',
  'Guang\'an': '广安市',
  'Dazhou': '达州市',
  'Ya\'an': '雅安市',
  'Bazhong': '巴中市',
  'Ziyang': '资阳市',
  
  // 湖北省
  'Wuhan': '武汉市',
  'Huangshi': '黄石市',
  'Shiyan': '十堰市',
  'Yichang': '宜昌市',
  'Xiangyang': '襄阳市',
  'Ezhou': '鄂州市',
  'Jingmen': '荆门市',
  'Xiaogan': '孝感市',
  'Jingzhou': '荆州市',
  'Huanggang': '黄冈市',
  'Xianning': '咸宁市',
  'Suizhou': '随州市',
  
  // 湖南省
  'Changsha': '长沙市',
  'Zhuzhou': '株洲市',
  'Xiangtan': '湘潭市',
  'Hengyang': '衡阳市',
  'Shaoyang': '邵阳市',
  'Yueyang': '岳阳市',
  'Changde': '常德市',
  'Zhangjiajie': '张家界市',
  'Yiyang': '益阳市',
  'Chenzhou': '郴州市',
  'Yongzhou': '永州市',
  'Huaihua': '怀化市',
  'Loudi': '娄底市',
  
  // 河北省
  'Shijiazhuang': '石家庄市',
  'Tangshan': '唐山市',
  'Qinhuangdao': '秦皇岛市',
  'Handan': '邯郸市',
  'Xingtai': '邢台市',
  'Baoding': '保定市',
  'Zhangjiakou': '张家口市',
  'Chengde': '承德市',
  'Cangzhou': '沧州市',
  'Langfang': '廊坊市',
  'Hengshui': '衡水市',
  
  // 山西省
  'Taiyuan': '太原市',
  'Datong': '大同市',
  'Yangquan': '阳泉市',
  'Changzhi': '长治市',
  'Jincheng': '晋城市',
  'Shuozhou': '朔州市',
  'Jinzhong': '晋中市',
  'Yuncheng': '运城市',
  'Xinzhou': '忻州市',
  'Linfen': '临汾市',
  'Lüliang': '吕梁市',
  
  // 辽宁省
  'Shenyang': '沈阳市',
  'Dalian': '大连市',
  'Anshan': '鞍山市',
  'Fushun': '抚顺市',
  'Benxi': '本溪市',
  'Dandong': '丹东市',
  'Jinzhou': '锦州市',
  'Yingkou': '营口市',
  'Fuxin': '阜新市',
  'Liaoyang': '辽阳市',
  'Panjin': '盘锦市',
  'Tieling': '铁岭市',
  'Chaoyang': '朝阳市',
  'Huludao': '葫芦岛市',
  
  // 吉林省
  'Changchun': '长春市',
  'Jilin': '吉林市',
  'Siping': '四平市',
  'Liaoyuan': '辽源市',
  'Tonghua': '通化市',
  'Baishan': '白山市',
  'Songyuan': '松原市',
  'Baicheng': '白城市',
  
  // 黑龙江省
  'Harbin': '哈尔滨市',
  'Qiqihar': '齐齐哈尔市',
  'Jixi': '鸡西市',
  'Hegang': '鹤岗市',
  'Shuangyashan': '双鸭山市',
  'Daqing': '大庆市',
  'Yichun': '伊春市',
  'Jiamusi': '佳木斯市',
  'Qitaihe': '七台河市',
  'Mudanjiang': '牡丹江市',
  'Heihe': '黑河市',
  'Suihua': '绥化市',
  
  // 山东省
  'Jinan': '济南市',
  'Qingdao': '青岛市',
  'Zibo': '淄博市',
  'Zaozhuang': '枣庄市',
  'Dongying': '东营市',
  'Yantai': '烟台市',
  'Weifang': '潍坊市',
  'Jining': '济宁市',
  'Tai\'an': '泰安市',
  'Weihai': '威海市',
  'Rizhao': '日照市',
  'Linyi': '临沂市',
  'Dezhou': '德州市',
  'Liaocheng': '聊城市',
  'Binzhou': '滨州市',
  'Heze': '菏泽市',
  
  // 河南省
  'Zhengzhou': '郑州市',
  'Kaifeng': '开封市',
  'Luoyang': '洛阳市',
  'Pingdingshan': '平顶山市',
  'Anyang': '安阳市',
  'Hebi': '鹤壁市',
  'Xinxiang': '新乡市',
  'Jiaozuo': '焦作市',
  'Puyang': '濮阳市',
  'Xuchang': '许昌市',
  'Luohe': '漯河市',
  'Sanmenxia': '三门峡市',
  'Nanyang': '南阳市',
  'Shangqiu': '商丘市',
  'Xinyang': '信阳市',
  'Zhoukou': '周口市',
  'Zhumadian': '驻马店市',
  
  // 安徽省
  'Hefei': '合肥市',
  'Wuhu': '芜湖市',
  'Bengbu': '蚌埠市',
  'Huainan': '淮南市',
  'Ma\'anshan': '马鞍山市',
  'Huaibei': '淮北市',
  'Tongling': '铜陵市',
  'Anqing': '安庆市',
  'Huangshan': '黄山市',
  'Chuzhou': '滁州市',
  'Fuyang': '阜阳市',
  'Suzhou': '宿州市',
  'Lu\'an': '六安市',
  'Bozhou': '亳州市',
  'Chizhou': '池州市',
  'Xuancheng': '宣城市',
  
  // 福建省
  'Fuzhou': '福州市',
  'Xiamen': '厦门市',
  'Putian': '莆田市',
  'Sanming': '三明市',
  'Quanzhou': '泉州市',
  'Zhangzhou': '漳州市',
  'Nanping': '南平市',
  'Longyan': '龙岩市',
  'Ningde': '宁德市',
  
  // 江西省
  'Nanchang': '南昌市',
  'Jingdezhen': '景德镇市',
  'Pingxiang': '萍乡市',
  'Jiujiang': '九江市',
  'Xinyu': '新余市',
  'Yingtan': '鹰潭市',
  'Ganzhou': '赣州市',
  'Ji\'an': '吉安市',
  'Yichun': '宜春市',
  'Fuzhou': '抚州市',
  'Shangrao': '上饶市',
  
  // 陕西省
  'Xi\'an': '西安市',
  'Tongchuan': '铜川市',
  'Baoji': '宝鸡市',
  'Xianyang': '咸阳市',
  'Weinan': '渭南市',
  'Yan\'an': '延安市',
  'Hanzhong': '汉中市',
  'Yulin': '榆林市',
  'Ankang': '安康市',
  'Shangluo': '商洛市',
  
  // 甘肃省
  'Lanzhou': '兰州市',
  'Jiayuguan': '嘉峪关市',
  'Jinchang': '金昌市',
  'Baiyin': '白银市',
  'Tianshui': '天水市',
  'Wuwei': '武威市',
  'Zhangye': '张掖市',
  'Pingliang': '平凉市',
  'Jiuquan': '酒泉市',
  'Qingyang': '庆阳市',
  'Dingxi': '定西市',
  'Longnan': '陇南市',
  
  // 青海省
  'Xining': '西宁市',
  'Haidong': '海东市',
  
  // 内蒙古自治区
  'Hohhot': '呼和浩特市',
  'Baotou': '包头市',
  'Wuhai': '乌海市',
  'Chifeng': '赤峰市',
  'Tongliao': '通辽市',
  'Ordos': '鄂尔多斯市',
  'Hulunbuir': '呼伦贝尔市',
  'Bayannur': '巴彦淖尔市',
  'Ulanqab': '乌兰察布市',
  
  // 新疆维吾尔自治区
  'Urumqi': '乌鲁木齐市',
  'Karamay': '克拉玛依市',
  'Turpan': '吐鲁番市',
  'Hami': '哈密市',
  
  // 宁夏回族自治区
  'Yinchuan': '银川市',
  'Shizuishan': '石嘴山市',
  'Wuzhong': '吴忠市',
  'Guyuan': '固原市',
  'Zhongwei': '中卫市',
  
  // 西藏自治区
  'Lhasa': '拉萨市',
  'Shigatse': '日喀则市',
  'Chamdo': '昌都市',
  'Nyingchi': '林芝市',
  'Shannan': '山南市',
  'Nagqu': '那曲市',
  
  // 云南省
  'Kunming': '昆明市',
  'Qujing': '曲靖市',
  'Yuxi': '玉溪市',
  'Baoshan': '保山市',
  'Zhaotong': '昭通市',
  'Lijiang': '丽江市',
  'Pu\'er': '普洱市',
  'Lincang': '临沧市',
  
  // 贵州省
  'Guiyang': '贵阳市',
  'Liupanshui': '六盘水市',
  'Zunyi': '遵义市',
  'Anshun': '安顺市',
  'Bijie': '毕节市',
  'Tongren': '铜仁市',
  
  // 香港特别行政区
  'Hong Kong': '香港',
  'Central and Western': '中西区',
  'Eastern': '东区',
  'Southern': '南区',
  'Wan Chai': '湾仔区',
  'Kowloon City': '九龙城区',
  'Kwun Tong': '观塘区',
  'Sham Shui Po': '深水埗区',
  'Wong Tai Sin': '黄大仙区',
  'Yau Tsim Mong': '油尖旺区',
  'Islands': '离岛区',
  'Kwai Tsing': '葵青区',
  'North': '北区',
  'Sai Kung': '西贡区',
  'Sha Tin': '沙田区',
  'Tai Po': '大埔区',
  'Tsuen Wan': '荃湾区',
  'Tuen Mun': '屯门区',
  'Yuen Long': '元朗区',
  
  // 澳门特别行政区
  'Macao': '澳门',
  'Nossa Senhora de Fátima': '花地玛堂区',
  'Santo António': '圣安多尼堂区',
  'São Lázaro': '望德堂区',
  'São Lourenço': '风顺堂区',
  'Sé': '大堂区',
  'Cotai': '路氹填海区',
  'Coloane': '路环岛',
  'Taipa': '氹仔岛'
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
                  // 获取城市的中文名称
                  const cityName = chinaCityMap[city.name] || city.name
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
