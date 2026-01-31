// 全球国家-省份-城市三级数据
export const regionData = [
  {
    value: 'CN',
    label: '中国',
    children: [
      {
        value: 'BJ',
        label: '北京市',
        children: [
          { value: 'dongcheng', label: '东城区' },
          { value: 'xicheng', label: '西城区' },
          { value: 'chaoyang', label: '朝阳区' },
          { value: 'haidian', label: '海淀区' },
          { value: 'fengtai', label: '丰台区' },
          { value: 'shijingshan', label: '石景山区' },
          { value: 'tongzhou', label: '通州区' },
          { value: 'shunyi', label: '顺义区' },
          { value: 'changping', label: '昌平区' },
          { value: 'daxing', label: '大兴区' }
        ]
      },
      {
        value: 'SH',
        label: '上海市',
        children: [
          { value: 'huangpu', label: '黄浦区' },
          { value: 'xuhui', label: '徐汇区' },
          { value: 'changning', label: '长宁区' },
          { value: 'jingan', label: '静安区' },
          { value: 'putuo', label: '普陀区' },
          { value: 'hongkou', label: '虹口区' },
          { value: 'yangpu', label: '杨浦区' },
          { value: 'pudong', label: '浦东新区' },
          { value: 'minhang', label: '闵行区' },
          { value: 'baoshan', label: '宝山区' }
        ]
      },
      {
        value: 'GD',
        label: '广东省',
        children: [
          { value: 'guangzhou', label: '广州市' },
          { value: 'shenzhen', label: '深圳市' },
          { value: 'zhuhai', label: '珠海市' },
          { value: 'shantou', label: '汕头市' },
          { value: 'foshan', label: '佛山市' },
          { value: 'dongguan', label: '东莞市' },
          { value: 'zhongshan', label: '中山市' },
          { value: 'huizhou', label: '惠州市' }
        ]
      },
      {
        value: 'ZJ',
        label: '浙江省',
        children: [
          { value: 'hangzhou', label: '杭州市' },
          { value: 'ningbo', label: '宁波市' },
          { value: 'wenzhou', label: '温州市' },
          { value: 'jiaxing', label: '嘉兴市' },
          { value: 'huzhou', label: '湖州市' },
          { value: 'shaoxing', label: '绍兴市' },
          { value: 'jinhua', label: '金华市' }
        ]
      },
      {
        value: 'JS',
        label: '江苏省',
        children: [
          { value: 'nanjing', label: '南京市' },
          { value: 'suzhou', label: '苏州市' },
          { value: 'wuxi', label: '无锡市' },
          { value: 'changzhou', label: '常州市' },
          { value: 'nantong', label: '南通市' },
          { value: 'yangzhou', label: '扬州市' }
        ]
      },
      {
        value: 'SC',
        label: '四川省',
        children: [
          { value: 'chengdu', label: '成都市' },
          { value: 'mianyang', label: '绵阳市' },
          { value: 'deyang', label: '德阳市' },
          { value: 'nanchong', label: '南充市' },
          { value: 'yibin', label: '宜宾市' }
        ]
      },
      {
        value: 'HB',
        label: '湖北省',
        children: [
          { value: 'wuhan', label: '武汉市' },
          { value: 'huangshi', label: '黄石市' },
          { value: 'xiangyang', label: '襄阳市' },
          { value: 'yichang', label: '宜昌市' }
        ]
      },
      {
        value: 'HN',
        label: '湖南省',
        children: [
          { value: 'changsha', label: '长沙市' },
          { value: 'zhuzhou', label: '株洲市' },
          { value: 'xiangtan', label: '湘潭市' },
          { value: 'hengyang', label: '衡阳市' }
        ]
      },
      {
        value: 'SX',
        label: '陕西省',
        children: [
          { value: 'xian', label: '西安市' },
          { value: 'baoji', label: '宝鸡市' },
          { value: 'xianyang', label: '咸阳市' },
          { value: 'weinan', label: '渭南市' }
        ]
      },
      {
        value: 'CQ',
        label: '重庆市',
        children: [
          { value: 'yuzhong', label: '渝中区' },
          { value: 'jiangbei', label: '江北区' },
          { value: 'shapingba', label: '沙坪坝区' },
          { value: 'jiulongpo', label: '九龙坡区' }
        ]
      }
    ]
  },
  {
    value: 'US',
    label: '美国',
    children: [
      {
        value: 'CA',
        label: '加利福尼亚州',
        children: [
          { value: 'los-angeles', label: '洛杉矶' },
          { value: 'san-francisco', label: '旧金山' },
          { value: 'san-diego', label: '圣地亚哥' },
          { value: 'san-jose', label: '圣何塞' },
          { value: 'sacramento', label: '萨克拉门托' }
        ]
      },
      {
        value: 'NY',
        label: '纽约州',
        children: [
          { value: 'new-york-city', label: '纽约市' },
          { value: 'buffalo', label: '布法罗' },
          { value: 'rochester', label: '罗切斯特' },
          { value: 'albany', label: '奥尔巴尼' }
        ]
      },
      {
        value: 'TX',
        label: '德克萨斯州',
        children: [
          { value: 'houston', label: '休斯顿' },
          { value: 'dallas', label: '达拉斯' },
          { value: 'austin', label: '奥斯汀' },
          { value: 'san-antonio', label: '圣安东尼奥' }
        ]
      },
      {
        value: 'WA',
        label: '华盛顿州',
        children: [
          { value: 'seattle', label: '西雅图' },
          { value: 'spokane', label: '斯波坎' },
          { value: 'tacoma', label: '塔科马' }
        ]
      },
      {
        value: 'FL',
        label: '佛罗里达州',
        children: [
          { value: 'miami', label: '迈阿密' },
          { value: 'orlando', label: '奥兰多' },
          { value: 'tampa', label: '坦帕' }
        ]
      }
    ]
  },
  {
    value: 'JP',
    label: '日本',
    children: [
      {
        value: 'tokyo',
        label: '东京都',
        children: [
          { value: 'chiyoda', label: '千代田区' },
          { value: 'chuo', label: '中央区' },
          { value: 'minato', label: '港区' },
          { value: 'shinjuku', label: '新宿区' },
          { value: 'shibuya', label: '渋谷区' }
        ]
      },
      {
        value: 'osaka',
        label: '大阪府',
        children: [
          { value: 'osaka-city', label: '大阪市' },
          { value: 'sakai', label: '堺市' },
          { value: 'higashiosaka', label: '东大阪市' }
        ]
      },
      {
        value: 'kyoto',
        label: '京都府',
        children: [
          { value: 'kyoto-city', label: '京都市' },
          { value: 'uji', label: '宇治市' }
        ]
      },
      {
        value: 'hokkaido',
        label: '北海道',
        children: [
          { value: 'sapporo', label: '札幌市' },
          { value: 'hakodate', label: '函馆市' }
        ]
      }
    ]
  },
  {
    value: 'GB',
    label: '英国',
    children: [
      {
        value: 'england',
        label: '英格兰',
        children: [
          { value: 'london', label: '伦敦' },
          { value: 'manchester', label: '曼彻斯特' },
          { value: 'birmingham', label: '伯明翰' },
          { value: 'liverpool', label: '利物浦' },
          { value: 'leeds', label: '利兹' }
        ]
      },
      {
        value: 'scotland',
        label: '苏格兰',
        children: [
          { value: 'edinburgh', label: '爱丁堡' },
          { value: 'glasgow', label: '格拉斯哥' },
          { value: 'aberdeen', label: '阿伯丁' }
        ]
      },
      {
        value: 'wales',
        label: '威尔士',
        children: [
          { value: 'cardiff', label: '卡迪夫' },
          { value: 'swansea', label: '斯旺西' }
        ]
      }
    ]
  },
  {
    value: 'DE',
    label: '德国',
    children: [
      {
        value: 'bavaria',
        label: '巴伐利亚州',
        children: [
          { value: 'munich', label: '慕尼黑' },
          { value: 'nuremberg', label: '纽伦堡' }
        ]
      },
      {
        value: 'berlin',
        label: '柏林',
        children: [
          { value: 'berlin-city', label: '柏林市' }
        ]
      },
      {
        value: 'hamburg',
        label: '汉堡',
        children: [
          { value: 'hamburg-city', label: '汉堡市' }
        ]
      }
    ]
  },
  {
    value: 'FR',
    label: '法国',
    children: [
      {
        value: 'ile-de-france',
        label: '法兰西岛大区',
        children: [
          { value: 'paris', label: '巴黎' },
          { value: 'versailles', label: '凡尔赛' }
        ]
      },
      {
        value: 'provence',
        label: '普罗旺斯大区',
        children: [
          { value: 'marseille', label: '马赛' },
          { value: 'nice', label: '尼斯' }
        ]
      },
      {
        value: 'rhone-alpes',
        label: '罗纳-阿尔卑斯大区',
        children: [
          { value: 'lyon', label: '里昂' },
          { value: 'grenoble', label: '格勒诺布尔' }
        ]
      }
    ]
  },
  {
    value: 'KR',
    label: '韩国',
    children: [
      {
        value: 'seoul',
        label: '首尔特别市',
        children: [
          { value: 'gangnam', label: '江南区' },
          { value: 'jongno', label: '钟路区' },
          { value: 'jung', label: '中区' }
        ]
      },
      {
        value: 'busan',
        label: '釜山广域市',
        children: [
          { value: 'haeundae', label: '海云台区' },
          { value: 'busanjin', label: '釜山镇区' }
        ]
      },
      {
        value: 'incheon',
        label: '仁川广域市',
        children: [
          { value: 'namdong', label: '南洞区' },
          { value: 'yeonsu', label: '延寿区' }
        ]
      }
    ]
  },
  {
    value: 'SG',
    label: '新加坡',
    children: [
      {
        value: 'central',
        label: '中区',
        children: [
          { value: 'downtown', label: '市中心' },
          { value: 'orchard', label: '乌节路' },
          { value: 'marina-bay', label: '滨海湾' }
        ]
      },
      {
        value: 'east',
        label: '东区',
        children: [
          { value: 'bedok', label: '勿洛' },
          { value: 'tampines', label: '淡滨尼' }
        ]
      },
      {
        value: 'west',
        label: '西区',
        children: [
          { value: 'jurong', label: '裕廊' },
          { value: 'clementi', label: '金文泰' }
        ]
      }
    ]
  },
  {
    value: 'AU',
    label: '澳大利亚',
    children: [
      {
        value: 'nsw',
        label: '新南威尔士州',
        children: [
          { value: 'sydney', label: '悉尼' },
          { value: 'newcastle', label: '纽卡斯尔' }
        ]
      },
      {
        value: 'vic',
        label: '维多利亚州',
        children: [
          { value: 'melbourne', label: '墨尔本' },
          { value: 'geelong', label: '吉朗' }
        ]
      },
      {
        value: 'qld',
        label: '昆士兰州',
        children: [
          { value: 'brisbane', label: '布里斯班' },
          { value: 'gold-coast', label: '黄金海岸' }
        ]
      }
    ]
  },
  {
    value: 'CA',
    label: '加拿大',
    children: [
      {
        value: 'ontario',
        label: '安大略省',
        children: [
          { value: 'toronto', label: '多伦多' },
          { value: 'ottawa', label: '渥太华' },
          { value: 'mississauga', label: '密西沙加' }
        ]
      },
      {
        value: 'quebec',
        label: '魁北克省',
        children: [
          { value: 'montreal', label: '蒙特利尔' },
          { value: 'quebec-city', label: '魁北克市' }
        ]
      },
      {
        value: 'bc',
        label: '不列颠哥伦比亚省',
        children: [
          { value: 'vancouver', label: '温哥华' },
          { value: 'victoria', label: '维多利亚' }
        ]
      }
    ]
  },
  {
    value: 'IN',
    label: '印度',
    children: [
      {
        value: 'maharashtra',
        label: '马哈拉施特拉邦',
        children: [
          { value: 'mumbai', label: '孟买' },
          { value: 'pune', label: '浦那' }
        ]
      },
      {
        value: 'delhi',
        label: '德里',
        children: [
          { value: 'new-delhi', label: '新德里' }
        ]
      },
      {
        value: 'karnataka',
        label: '卡纳塔克邦',
        children: [
          { value: 'bangalore', label: '班加罗尔' },
          { value: 'mysore', label: '迈索尔' }
        ]
      }
    ]
  },
  {
    value: 'BR',
    label: '巴西',
    children: [
      {
        value: 'sao-paulo',
        label: '圣保罗州',
        children: [
          { value: 'sao-paulo-city', label: '圣保罗市' },
          { value: 'campinas', label: '坎皮纳斯' }
        ]
      },
      {
        value: 'rio',
        label: '里约热内卢州',
        children: [
          { value: 'rio-city', label: '里约热内卢市' }
        ]
      }
    ]
  },
  {
    value: 'RU',
    label: '俄罗斯',
    children: [
      {
        value: 'moscow',
        label: '莫斯科',
        children: [
          { value: 'moscow-city', label: '莫斯科市' }
        ]
      },
      {
        value: 'st-petersburg',
        label: '圣彼得堡',
        children: [
          { value: 'st-petersburg-city', label: '圣彼得堡市' }
        ]
      }
    ]
  },
  {
    value: 'IT',
    label: '意大利',
    children: [
      {
        value: 'lazio',
        label: '拉齐奥大区',
        children: [
          { value: 'rome', label: '罗马' }
        ]
      },
      {
        value: 'lombardy',
        label: '伦巴第大区',
        children: [
          { value: 'milan', label: '米兰' }
        ]
      },
      {
        value: 'veneto',
        label: '威尼托大区',
        children: [
          { value: 'venice', label: '威尼斯' }
        ]
      }
    ]
  },
  {
    value: 'ES',
    label: '西班牙',
    children: [
      {
        value: 'madrid',
        label: '马德里自治区',
        children: [
          { value: 'madrid-city', label: '马德里市' }
        ]
      },
      {
        value: 'catalonia',
        label: '加泰罗尼亚',
        children: [
          { value: 'barcelona', label: '巴塞罗那' }
        ]
      }
    ]
  },
  {
    value: 'MX',
    label: '墨西哥',
    children: [
      {
        value: 'cdmx',
        label: '墨西哥城',
        children: [
          { value: 'mexico-city', label: '墨西哥城' }
        ]
      },
      {
        value: 'jalisco',
        label: '哈利斯科州',
        children: [
          { value: 'guadalajara', label: '瓜达拉哈拉' }
        ]
      }
    ]
  },
  {
    value: 'TH',
    label: '泰国',
    children: [
      {
        value: 'bangkok',
        label: '曼谷',
        children: [
          { value: 'bangkok-city', label: '曼谷市' }
        ]
      },
      {
        value: 'chiang-mai',
        label: '清迈府',
        children: [
          { value: 'chiang-mai-city', label: '清迈市' }
        ]
      }
    ]
  },
  {
    value: 'MY',
    label: '马来西亚',
    children: [
      {
        value: 'kuala-lumpur',
        label: '吉隆坡',
        children: [
          { value: 'kl-city', label: '吉隆坡市' }
        ]
      },
      {
        value: 'penang',
        label: '槟城',
        children: [
          { value: 'george-town', label: '乔治市' }
        ]
      }
    ]
  },
  {
    value: 'ID',
    label: '印度尼西亚',
    children: [
      {
        value: 'jakarta',
        label: '雅加达',
        children: [
          { value: 'jakarta-city', label: '雅加达市' }
        ]
      },
      {
        value: 'bali',
        label: '巴厘岛',
        children: [
          { value: 'denpasar', label: '登巴萨' }
        ]
      }
    ]
  },
  {
    value: 'PH',
    label: '菲律宾',
    children: [
      {
        value: 'metro-manila',
        label: '马尼拉大都会',
        children: [
          { value: 'manila', label: '马尼拉市' },
          { value: 'quezon', label: '奎松市' }
        ]
      },
      {
        value: 'cebu',
        label: '宿务省',
        children: [
          { value: 'cebu-city', label: '宿务市' }
        ]
      }
    ]
  },
  {
    value: 'VN',
    label: '越南',
    children: [
      {
        value: 'hanoi',
        label: '河内市',
        children: [
          { value: 'hanoi-city', label: '河内' }
        ]
      },
      {
        value: 'ho-chi-minh',
        label: '胡志明市',
        children: [
          { value: 'hcm-city', label: '胡志明市' }
        ]
      }
    ]
  },
  {
    value: 'AE',
    label: '阿联酋',
    children: [
      {
        value: 'dubai',
        label: '迪拜',
        children: [
          { value: 'dubai-city', label: '迪拜市' }
        ]
      },
      {
        value: 'abu-dhabi',
        label: '阿布扎比',
        children: [
          { value: 'abu-dhabi-city', label: '阿布扎比市' }
        ]
      }
    ]
  },
  {
    value: 'SA',
    label: '沙特阿拉伯',
    children: [
      {
        value: 'riyadh',
        label: '利雅得',
        children: [
          { value: 'riyadh-city', label: '利雅得市' }
        ]
      },
      {
        value: 'mecca',
        label: '麦加',
        children: [
          { value: 'mecca-city', label: '麦加市' }
        ]
      }
    ]
  },
  {
    value: 'ZA',
    label: '南非',
    children: [
      {
        value: 'gauteng',
        label: '豪登省',
        children: [
          { value: 'johannesburg', label: '约翰内斯堡' },
          { value: 'pretoria', label: '比勒陀利亚' }
        ]
      },
      {
        value: 'western-cape',
        label: '西开普省',
        children: [
          { value: 'cape-town', label: '开普敦' }
        ]
      }
    ]
  },
  {
    value: 'EG',
    label: '埃及',
    children: [
      {
        value: 'cairo',
        label: '开罗省',
        children: [
          { value: 'cairo-city', label: '开罗市' }
        ]
      },
      {
        value: 'alexandria',
        label: '亚历山大省',
        children: [
          { value: 'alexandria-city', label: '亚历山大市' }
        ]
      }
    ]
  },
  {
    value: 'AR',
    label: '阿根廷',
    children: [
      {
        value: 'buenos-aires',
        label: '布宜诺斯艾利斯',
        children: [
          { value: 'ba-city', label: '布宜诺斯艾利斯市' }
        ]
      }
    ]
  },
  {
    value: 'CL',
    label: '智利',
    children: [
      {
        value: 'santiago',
        label: '圣地亚哥',
        children: [
          { value: 'santiago-city', label: '圣地亚哥市' }
        ]
      }
    ]
  },
  {
    value: 'NZ',
    label: '新西兰',
    children: [
      {
        value: 'auckland',
        label: '奥克兰',
        children: [
          { value: 'auckland-city', label: '奥克兰市' }
        ]
      },
      {
        value: 'wellington',
        label: '惠灵顿',
        children: [
          { value: 'wellington-city', label: '惠灵顿市' }
        ]
      }
    ]
  }
]

// 辅助函数：根据选中的值数组获取完整的地区名称
export function getRegionLabel(values) {
  if (!values || values.length === 0) return ''
  
  let result = []
  let currentLevel = regionData
  
  for (let i = 0; i < values.length; i++) {
    const item = currentLevel.find(region => region.value === values[i])
    if (item) {
      result.push(item.label)
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
      if (item.label.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({
          value: item.value,
          label: currentPath.map(p => p.label).join(' / '),
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
