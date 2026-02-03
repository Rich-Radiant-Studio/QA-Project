import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 地区数据（用于组合频道）
const regionData = {
  countries: [
    { id: 'cn', name: '中国', provinces: [
      { id: 'bj', name: '北京市', cities: [
        { id: 'bjc', name: '北京', districts: ['朝阳区', '海淀区', '东城区', '西城区'] }
      ]},
      { id: 'sh', name: '上海市', cities: [
        { id: 'shc', name: '上海', districts: ['浦东新区', '黄浦区', '静安区', '徐汇区'] }
      ]},
      { id: 'gd', name: '广东省', cities: [
        { id: 'gz', name: '广州', districts: ['天河区', '越秀区', '海珠区'] },
        { id: 'sz', name: '深圳', districts: ['南山区', '福田区', '罗湖区'] }
      ]}
    ]},
    { id: 'us', name: '美国', provinces: [
      { id: 'ny', name: '纽约州', cities: [
        { id: 'nyc', name: '纽约', districts: ['曼哈顿', '布鲁克林', '皇后区'] }
      ]},
      { id: 'ca', name: '加利福尼亚州', cities: [
        { id: 'la', name: '洛杉矶', districts: ['好莱坞', '比佛利山'] },
        { id: 'sf', name: '旧金山', districts: ['市中心', '硅谷'] }
      ]}
    ]}
  ]
};

// 简化的频道数据
const channelData = {
  country: [
    { name: '政策法规', subs: ['法律制定', '政策解读', '法规执行', '政策影响'] },
    { name: '社会民生', subs: ['教育', '医疗', '住房', '就业', '养老'] },
    { name: '经济发展', subs: ['宏观经济', '产业发展', '投资贸易', '区域经济'] },
    { name: '环境保护', subs: ['污染治理', '生态保护', '气候变化', '绿色发展'] },
    { name: '基础设施', subs: ['交通建设', '能源设施', '通信网络', '公共设施'] },
  ],
  industry: [
    { name: '互联网', subs: ['电商', '社交', '搜索', '云计算'] },
    { name: '金融', subs: ['银行', '证券', '保险', '支付'] },
    { name: '医疗健康', subs: ['医院', '药品', '医疗器械', '健康管理'] },
    { name: '教育培训', subs: ['K12', '高等教育', '职业培训', '在线教育'] },
    { name: '房地产', subs: ['住宅', '商业地产', '物业管理', '租赁'] },
    { name: '制造业', subs: ['汽车', '电子', '机械', '化工'] },
  ],
  personal: [
    { name: '职场', subs: ['求职', '晋升', '跳槽', '创业'] },
    { name: '科技', subs: ['数码', '软件', '硬件', 'AI'] },
    { name: '健康', subs: ['运动', '饮食', '医疗', '养生'] },
    { name: '教育', subs: ['学习', '考试', '培训', '留学'] },
    { name: '美食', subs: ['烹饪', '餐厅', '小吃', '饮品'] },
    { name: '情感', subs: ['恋爱', '婚姻', '家庭', '友情'] },
    { name: '旅游', subs: ['国内', '国外', '攻略', '住宿'] },
    { name: '娱乐', subs: ['影视', '音乐', '游戏', '综艺'] },
  ]
};

export default function ChannelManageScreen({ navigation }) {
  // 我的频道
  const [myChannels, setMyChannels] = useState(['政策法规', '互联网', '职场', '科技']);
  
  // 组合频道创建
  const [showComboCreator, setShowComboCreator] = useState(false);
  const [comboName, setComboName] = useState('');
  const [comboStep, setComboStep] = useState(0); // 0:国家 1:省份 2:城市 3:区域 4:问题类型 5:大类别 6:小类别
  const [comboSelection, setComboSelection] = useState({
    country: null,
    province: null,
    city: null,
    district: null,
    categoryType: null, // 'country', 'industry', 'personal'
    category: null,
    subcategory: null
  });
  const [myComboChannels, setMyComboChannels] = useState([
    { id: 1, name: '北京互联网', path: '中国>北京市>北京>朝阳区>行业问题>互联网>电商' }
  ]);

  // 切换频道订阅
  const toggleChannel = (channel) => {
    if (myChannels.includes(channel)) {
      setMyChannels(myChannels.filter(c => c !== channel));
    } else {
      setMyChannels([...myChannels, channel]);
    }
  };

  // 组合频道选择逻辑
  const getComboOptions = () => {
    switch(comboStep) {
      case 0: return regionData.countries;
      case 1: return comboSelection.country?.provinces || [];
      case 2: return comboSelection.province?.cities || [];
      case 3: return comboSelection.city?.districts || [];
      case 4: // 选择类别类型（国家/行业/个人）
        return [
          { id: 'country', name: '国家问题', icon: 'flag' },
          { id: 'industry', name: '行业问题', icon: 'business' },
          { id: 'personal', name: '个人问题', icon: 'person' }
        ];
      case 5: // 选择大类别
        if (comboSelection.categoryType === 'country') return channelData.country;
        if (comboSelection.categoryType === 'industry') return channelData.industry;
        if (comboSelection.categoryType === 'personal') return channelData.personal.map(p => ({ name: p, subs: [] }));
        return [];
      case 6: return comboSelection.category?.subs || [];
      default: return [];
    }
  };

  const selectComboOption = (option) => {
    const newSelection = { ...comboSelection };
    
    switch(comboStep) {
      case 0: // 选择国家
        newSelection.country = option;
        newSelection.province = null;
        newSelection.city = null;
        newSelection.district = null;
        break;
      case 1: // 选择省份
        newSelection.province = option;
        newSelection.city = null;
        newSelection.district = null;
        break;
      case 2: // 选择城市
        newSelection.city = option;
        newSelection.district = null;
        break;
      case 3: // 选择区域
        newSelection.district = option;
        break;
      case 4: // 选择类别类型
        newSelection.categoryType = option.id;
        newSelection.category = null;
        newSelection.subcategory = null;
        break;
      case 5: // 选择大类别
        newSelection.category = option;
        newSelection.subcategory = null;
        break;
      case 6: // 选择小类别
        newSelection.subcategory = option;
        break;
    }
    
    setComboSelection(newSelection);
    
    // 自动进入下一步（除了最后一步）
    if (comboStep < 6) {
      setComboStep(comboStep + 1);
    }
  };

  const skipComboStep = () => {
    if (comboStep < 6) {
      setComboStep(comboStep + 1);
    }
  };

  const createComboChannel = () => {
    if (!comboName.trim()) {
      Alert.alert('提示', '请输入组合频道名称');
      return;
    }
    
    const { country, province, city, district, categoryType, category, subcategory } = comboSelection;
    if (!country) {
      Alert.alert('提示', '请至少选择一个国家');
      return;
    }

    const pathParts = [];
    if (country) pathParts.push(country.name);
    if (province) pathParts.push(province.name);
    if (city) pathParts.push(city.name);
    if (district) pathParts.push(district);
    if (categoryType) {
      const typeNames = { country: '国家问题', industry: '行业问题', personal: '个人问题' };
      pathParts.push(typeNames[categoryType]);
    }
    if (category) pathParts.push(typeof category === 'string' ? category : category.name);
    if (subcategory) pathParts.push(subcategory);

    const newCombo = {
      id: Date.now(),
      name: comboName,
      path: pathParts.join('>')
    };

    setMyComboChannels([...myComboChannels, newCombo]);
    
    // 重置
    setComboName('');
    setComboStep(0);
    setComboSelection({
      country: null,
      province: null,
      city: null,
      district: null,
      categoryType: null,
      category: null,
      subcategory: null
    });
    setShowComboCreator(false);
    Alert.alert('成功', '组合频道创建成功！');
  };

  const getStepTitle = () => {
    const titles = ['选择国家', '选择省份', '选择城市', '选择区域', '选择问题类型', '选择大类别', '选择小类别'];
    return titles[comboStep];
  };

  const getSelectedPath = () => {
    const { country, province, city, district, categoryType, category, subcategory } = comboSelection;
    const parts = [];
    if (country) parts.push(country.name);
    if (province) parts.push(province.name);
    if (city) parts.push(city.name);
    if (district) parts.push(district);
    if (categoryType) {
      const typeNames = { country: '国家问题', industry: '行业问题', personal: '个人问题' };
      parts.push(typeNames[categoryType]);
    }
    if (category) parts.push(typeof category === 'string' ? category : category.name);
    if (subcategory) parts.push(subcategory);
    return parts.length > 0 ? parts.join(' > ') : '未选择';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>频道管理</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert('保存成功', '频道订阅已更新');
          navigation.goBack();
        }} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={styles.saveBtn}>完成</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 我的频道 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="star" size={18} color="#f59e0b" />
            <Text style={styles.sectionTitle}>我的频道</Text>
          </View>
          <View style={styles.myChannelsContainer}>
            {myChannels.map((channel, index) => (
              <View key={index} style={styles.myChannelTag}>
                <Text style={styles.myChannelText}>{channel}</Text>
                <TouchableOpacity onPress={() => toggleChannel(channel)} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                  <Ionicons name="close-circle" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 国家问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flag" size={18} color="#3b82f6" />
            <Text style={styles.sectionTitle}>国家问题</Text>
          </View>
          {channelData.country.map((category, idx) => (
            <View key={idx} style={styles.categoryBlock}>
              <TouchableOpacity
                style={[styles.categoryMainTag, myChannels.includes(category.name) && styles.categoryMainTagSelected]}
                onPress={() => toggleChannel(category.name)}
              >
                <Text style={[styles.categoryMainText, myChannels.includes(category.name) && styles.categoryMainTextSelected]}>
                  {category.name}
                </Text>
                {myChannels.includes(category.name) && (
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                )}
              </TouchableOpacity>
              <View style={styles.subTagsRow}>
                {category.subs.map((sub, subIdx) => {
                  const isSelected = myChannels.includes(sub);
                  return (
                    <TouchableOpacity
                      key={subIdx}
                      style={[styles.subTag, isSelected && styles.subTagSelected]}
                      onPress={() => toggleChannel(sub)}
                    >
                      <Text style={[styles.subTagText, isSelected && styles.subTagTextSelected]}>{sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* 行业问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="briefcase" size={18} color="#22c55e" />
            <Text style={styles.sectionTitle}>行业问题</Text>
          </View>
          {channelData.industry.map((category, idx) => (
            <View key={idx} style={styles.categoryBlock}>
              <TouchableOpacity
                style={[styles.categoryMainTag, myChannels.includes(category.name) && styles.categoryMainTagSelected]}
                onPress={() => toggleChannel(category.name)}
              >
                <Text style={[styles.categoryMainText, myChannels.includes(category.name) && styles.categoryMainTextSelected]}>
                  {category.name}
                </Text>
                {myChannels.includes(category.name) && (
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                )}
              </TouchableOpacity>
              <View style={styles.subTagsRow}>
                {category.subs.map((sub, subIdx) => {
                  const isSelected = myChannels.includes(sub);
                  return (
                    <TouchableOpacity
                      key={subIdx}
                      style={[styles.subTag, isSelected && styles.subTagSelected]}
                      onPress={() => toggleChannel(sub)}
                    >
                      <Text style={[styles.subTagText, isSelected && styles.subTagTextSelected]}>{sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* 个人问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person" size={18} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>个人问题</Text>
          </View>
          {channelData.personal.map((category, idx) => (
            <View key={idx} style={styles.categoryBlock}>
              <TouchableOpacity
                style={[styles.categoryMainTag, myChannels.includes(category.name) && styles.categoryMainTagSelected]}
                onPress={() => toggleChannel(category.name)}
              >
                <Text style={[styles.categoryMainText, myChannels.includes(category.name) && styles.categoryMainTextSelected]}>
                  {category.name}
                </Text>
                {myChannels.includes(category.name) && (
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                )}
              </TouchableOpacity>
              <View style={styles.subTagsRow}>
                {category.subs.map((sub, subIdx) => {
                  const isSelected = myChannels.includes(sub);
                  return (
                    <TouchableOpacity
                      key={subIdx}
                      style={[styles.subTag, isSelected && styles.subTagSelected]}
                      onPress={() => toggleChannel(sub)}
                    >
                      <Text style={[styles.subTagText, isSelected && styles.subTagTextSelected]}>{sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* 组合频道 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="layers" size={16} color="#8b5cf6" /> 组合频道
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowComboCreator(!showComboCreator)}
            >
              <Ionicons name={showComboCreator ? "remove-circle" : "add-circle"} size={20} color="#8b5cf6" />
              <Text style={styles.addBtnText}>{showComboCreator ? '取消' : '创建'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionNote}>
            组合频道可以将地理位置（国家-省份-城市-区域）和问题类型（国家/行业/个人问题及其子类别）组合，创建更精准的频道
          </Text>

          {/* 创建组合频道表单 */}
          {showComboCreator && (
            <View style={styles.comboCreator}>
              <Text style={styles.comboDesc}>组合频道可以将地理位置和问题类型组合，创建精准的频道</Text>
              
              <TextInput
                style={styles.comboInput}
                placeholder="输入组合频道名称（例如：北京互联网）"
                value={comboName}
                onChangeText={setComboName}
                placeholderTextColor="#9ca3af"
              />
              
              <View style={styles.comboSteps}>
                <View style={styles.comboStepHeader}>
                  <Text style={styles.comboStepTitle}>{getStepTitle()}</Text>
                  {comboStep < 6 && comboStep > 0 && (
                    <TouchableOpacity
                      style={styles.skipBtn}
                      onPress={skipComboStep}
                    >
                      <Text style={styles.skipBtnText}>跳过</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.comboPath}>已选: {getSelectedPath()}</Text>
                
                <ScrollView style={styles.comboOptions} nestedScrollEnabled>
                  {getComboOptions().map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.comboOption}
                      onPress={() => selectComboOption(option)}
                    >
                      <Text style={styles.comboOptionText}>
                        {typeof option === 'string' ? option : option.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.comboActions}>
                  {comboStep > 0 && (
                    <TouchableOpacity
                      style={styles.comboBackBtn}
                      onPress={() => setComboStep(comboStep - 1)}
                    >
                      <Ionicons name="arrow-back" size={16} color="#6b7280" />
                      <Text style={styles.comboBackText}>上一步</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.comboCreateBtn, !comboName.trim() && styles.comboCreateBtnDisabled]}
                    onPress={createComboChannel}
                    disabled={!comboName.trim()}
                  >
                    <Text style={styles.comboCreateText}>创建频道</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* 已创建的组合频道 */}
          <View style={styles.comboList}>
            {myComboChannels.map((combo) => (
              <View key={combo.id} style={styles.comboItem}>
                <View style={styles.comboItemContent}>
                  <Text style={styles.comboItemName}>{combo.name}</Text>
                  <Text style={styles.comboItemPath}>{combo.path}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setMyComboChannels(myComboChannels.filter(c => c.id !== combo.id));
                }}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', flex: 1, textAlign: 'center' },
  saveBtn: { fontSize: 16, color: '#ef4444', fontWeight: '600' },
  content: { flex: 1 },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  
  // 我的频道样式
  myChannelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  myChannelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#f3f4f6',
    borderRadius: 20
  },
  myChannelText: {
    fontSize: 14,
    color: '#374151'
  },
  
  // 类别块样式
  categoryBlock: {
    marginBottom: 12
  },
  categoryMainTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  categoryMainTagSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e'
  },
  categoryMainText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151'
  },
  categoryMainTextSelected: {
    color: '#16a34a'
  },
  
  // 子标签行样式
  subTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 12
  },
  subTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  subTagSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e'
  },
  subTagText: {
    fontSize: 13,
    color: '#6b7280'
  },
  subTagTextSelected: {
    color: '#16a34a',
    fontWeight: '500'
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionNote: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addBtnText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500'
  },
  comboCreator: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  comboDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18
  },
  comboInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12
  },
  comboSteps: {
    marginTop: 8
  },
  comboStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  comboStepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937'
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  skipBtnText: {
    fontSize: 12,
    color: '#8b5cf6'
  },
  comboPath: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 8
  },
  comboOptions: {
    maxHeight: 200,
    marginBottom: 12
  },
  comboOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 4
  },
  comboOptionText: {
    fontSize: 13,
    color: '#374151'
  },
  comboActions: {
    flexDirection: 'row',
    gap: 8
  },
  comboBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  comboBackText: {
    fontSize: 13,
    color: '#6b7280'
  },
  comboCreateBtn: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center'
  },
  comboCreateBtnDisabled: {
    backgroundColor: '#d8b4fe',
    opacity: 0.6
  },
  comboCreateText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600'
  },
  comboList: {
    marginTop: 12,
    gap: 8
  },
  comboItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f3ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff'
  },
  comboItemContent: {
    flex: 1
  },
  comboItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4
  },
  comboItemPath: {
    fontSize: 11,
    color: '#8b5cf6'
  }
});
