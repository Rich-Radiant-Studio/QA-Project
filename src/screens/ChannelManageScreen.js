import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/withTranslation';
import { getRegionData } from '../data/regionData';

// 地区数据（使用多语言数据）
// 已移除硬编码数据，改用 getRegionData()

// 频道数据 - 使用翻译键
const getChannelData = (t) => ({
  country: [
    t('channelManage.countryCategories.policy'),
    t('channelManage.countryCategories.society'),
    t('channelManage.countryCategories.economy'),
    t('channelManage.countryCategories.environment'),
    t('channelManage.countryCategories.infrastructure')
  ],
  industry: [
    t('channelManage.industryCategories.internet'),
    t('channelManage.industryCategories.finance'),
    t('channelManage.industryCategories.healthcare'),
    t('channelManage.industryCategories.education'),
    t('channelManage.industryCategories.realestate'),
    t('channelManage.industryCategories.manufacturing')
  ],
  enterprise: [
    t('channelManage.enterpriseCategories.management'),
    t('channelManage.enterpriseCategories.hr'),
    t('channelManage.enterpriseCategories.marketing'),
    t('channelManage.enterpriseCategories.finance'),
    t('channelManage.enterpriseCategories.operations'),
    t('channelManage.enterpriseCategories.legal')
  ],
  personal: [
    t('channelManage.personalCategories.workplace'),
    t('channelManage.personalCategories.tech'),
    t('channelManage.personalCategories.health'),
    t('channelManage.personalCategories.education'),
    t('channelManage.personalCategories.food'),
    t('channelManage.personalCategories.emotion'),
    t('channelManage.personalCategories.travel'),
    t('channelManage.personalCategories.entertainment')
  ]
});

export default function ChannelManageScreen({ navigation }) {
  const { t } = useTranslation();
  
  // 获取多语言区域数据和频道数据
  const regionData = getRegionData();
  const channelData = getChannelData(t);
  
  // 添加调试信息
  React.useEffect(() => {
    console.log('='.repeat(50));
    console.log('🔍 ChannelManageScreen mounted - Language Detection Debug');
    console.log('='.repeat(50));
    console.log('📱 regionData.countries:', regionData.countries?.slice(0, 3));
    console.log('🌐 First country:', regionData.countries?.[0]);
    console.log('='.repeat(50));
  }, []);
  // 我的频道 - 使用翻译后的默认值
  const [myChannels, setMyChannels] = useState([
    t('channelManage.countryCategories.policy'),
    t('channelManage.industryCategories.internet'),
    t('channelManage.personalCategories.workplace'),
    t('channelManage.personalCategories.tech')
  ]);
  
  // 组合频道创建
  const [showComboCreator, setShowComboCreator] = useState(true);
  const [comboName, setComboName] = useState('');
  const [comboStep, setComboStep] = useState('region'); // 'region' 或 'category'
  const [regionStep, setRegionStep] = useState(0); // 0:国家 1:省份 2:城市 3:区域
  const [comboSelection, setComboSelection] = useState({
    country: null,
    province: null,
    city: null,
    district: null,
    categoryType: null, // 'country', 'industry', 'personal'
    category: null
  });
  const [myComboChannels, setMyComboChannels] = useState([
    { id: 1, name: '纽约互联网', path: '美国>纽约州>纽约市>曼哈顿>行业问题>互联网' }
  ]);
  
  // 区域搜索
  const [regionSearchText, setRegionSearchText] = useState('');

  // 切换频道订阅
  const toggleChannel = (channel) => {
    if (myChannels.includes(channel)) {
      setMyChannels(myChannels.filter(c => c !== channel));
    } else {
      setMyChannels([...myChannels, channel]);
    }
  };

  // 组合频道选择逻辑
  const getRegionOptions = () => {
    let options = [];
    switch(regionStep) {
      case 0: // 国家列表
        options = regionData.countries.map(name => ({ name }));
        break;
      case 1: // 省份/州列表
        if (comboSelection.country) {
          const cities = regionData.cities[comboSelection.country.name] || [];
          options = cities.map(name => ({ name }));
        }
        break;
      case 2: // 城市列表
        if (comboSelection.province) {
          const states = regionData.states[comboSelection.province.name] || [];
          options = states.map(name => ({ name }));
        }
        break;
      case 3: // 区域列表
        if (comboSelection.city) {
          const districts = regionData.districts[comboSelection.city.name] || [];
          options = districts.map(name => ({ name }));
        }
        break;
      default: 
        options = [];
    }
    
    // 根据搜索文本过滤
    if (regionSearchText.trim()) {
      options = options.filter(option => 
        option.name.toLowerCase().includes(regionSearchText.toLowerCase())
      );
    }
    
    return options;
  };

  const getCategoryOptions = () => {
    if (!comboSelection.categoryType) {
      return [
        { id: 'country', name: t('channelManage.categoryTypes.country'), icon: 'flag', color: '#3b82f6' },
        { id: 'industry', name: t('channelManage.categoryTypes.industry'), icon: 'briefcase', color: '#22c55e' },
        { id: 'enterprise', name: t('channelManage.categoryTypes.enterprise'), icon: 'business', color: '#f59e0b' },
        { id: 'personal', name: t('channelManage.categoryTypes.personal'), icon: 'person', color: '#8b5cf6' }
      ];
    }
    
    // 返回对应类型的频道列表
    if (comboSelection.categoryType === 'country') return channelData.country.map(name => ({ name }));
    if (comboSelection.categoryType === 'industry') return channelData.industry.map(name => ({ name }));
    if (comboSelection.categoryType === 'enterprise') return channelData.enterprise.map(name => ({ name }));
    if (comboSelection.categoryType === 'personal') return channelData.personal.map(name => ({ name }));
    return [];
  };

  const selectRegionOption = (option) => {
    const newSelection = { ...comboSelection };
    
    switch(regionStep) {
      case 0: // 选择国家
        newSelection.country = option;
        newSelection.province = null;
        newSelection.city = null;
        newSelection.district = null;
        // 检查是否有下一层数据
        if (regionData.cities[option.name] && regionData.cities[option.name].length > 0) {
          setRegionStep(1);
        }
        break;
      case 1: // 选择省份/州
        newSelection.province = option;
        newSelection.city = null;
        newSelection.district = null;
        // 检查是否有下一层数据
        if (regionData.states[option.name] && regionData.states[option.name].length > 0) {
          setRegionStep(2);
        }
        break;
      case 2: // 选择城市
        newSelection.city = option;
        newSelection.district = null;
        // 检查是否有下一层数据
        if (regionData.districts[option.name] && regionData.districts[option.name].length > 0) {
          setRegionStep(3);
        }
        break;
      case 3: // 选择区域
        newSelection.district = option.name;
        break;
    }
    
    setComboSelection(newSelection);
    setRegionSearchText(''); // 清空搜索框
  };

  const selectCategoryOption = (option) => {
    console.log('🎯 selectCategoryOption called with:', option);
    console.log('📊 Current categoryType:', comboSelection.categoryType);
    
    const newSelection = { ...comboSelection };
    
    if (!comboSelection.categoryType) {
      // 选择分类类型
      console.log('✅ Selecting category type:', option.id);
      newSelection.categoryType = option.id;
      newSelection.category = null;
    } else {
      // 选择具体分类
      console.log('✅ Selecting specific category:', option.name);
      newSelection.category = option;
    }
    
    console.log('📦 New selection:', newSelection);
    setComboSelection(newSelection);
  };

  const goToCategory = () => {
    setComboStep('category');
  };

  const backToRegion = () => {
    setComboStep('region');
    setComboSelection({
      ...comboSelection,
      categoryType: null,
      category: null
    });
  };

  const createComboChannel = () => {
    const { categoryType, category } = comboSelection;
    if (!categoryType || !category) {
      Alert.alert(t('common.ok'), t('channelManage.selectCategoryPrompt'));
      return;
    }

    const pathParts = [];
    const { country, province, city, district } = comboSelection;
    
    // 添加区域路径（如果有选择）
    if (country) pathParts.push(country.name);
    if (province) pathParts.push(province.name);
    if (city) pathParts.push(city.name);
    if (district) pathParts.push(district);
    
    // 添加分类路径
    const typeNames = { 
      country: t('channelManage.categoryTypes.country'), 
      industry: t('channelManage.categoryTypes.industry'),
      enterprise: t('channelManage.categoryTypes.enterprise'),
      personal: t('channelManage.categoryTypes.personal') 
    };
    pathParts.push(typeNames[categoryType]);
    pathParts.push(category.name);

    // 自动生成频道名称：使用最后一级区域 + 分类名称
    const regionName = district || city?.name || province?.name || country?.name || '';
    const categoryName = category.name || '';
    const autoGeneratedName = `${regionName} ${categoryName}`.trim();

    const newCombo = {
      id: Date.now(),
      name: autoGeneratedName,
      path: pathParts.join('>')
    };

    setMyComboChannels([...myComboChannels, newCombo]);
    
    // 重置
    setComboName('');
    setComboStep('region');
    setRegionStep(0);
    setComboSelection({
      country: null,
      province: null,
      city: null,
      district: null,
      categoryType: null,
      category: null
    });
    setShowComboCreator(false);
    Alert.alert(t('common.ok'), t('channelManage.createSuccess'));
  };

  const getSelectedPath = () => {
    const { country, province, city, district, categoryType, category } = comboSelection;
    const parts = [];
    
    if (country) parts.push(country.name);
    if (province) parts.push(province.name);
    if (city) parts.push(city.name);
    if (district) parts.push(district);
    
    if (categoryType) {
      const typeNames = { 
        country: t('channelManage.categoryTypes.country'), 
        industry: t('channelManage.categoryTypes.industry'), 
        personal: t('channelManage.categoryTypes.personal') 
      };
      parts.push(typeNames[categoryType]);
    }
    if (category) parts.push(category.name);
    
    return parts.length > 0 ? parts.join(' > ') : t('channelManage.notSelected');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('channelManage.title')}</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(t('common.ok'), t('channelManage.saveSuccess'));
          navigation.goBack();
        }} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={styles.saveBtn}>{t('channelManage.done')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 我的频道 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="star" size={18} color="#f59e0b" />
            <Text style={styles.sectionTitle}>{t('channelManage.myChannels')}</Text>
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
            <Text style={styles.sectionTitle}>{t('channelManage.countryIssues')}</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.country.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 行业问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="briefcase" size={18} color="#22c55e" />
            <Text style={styles.sectionTitle}>{t('channelManage.industryIssues')}</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.industry.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 企业问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="business" size={18} color="#f59e0b" />
            <Text style={styles.sectionTitle}>{t('channelManage.enterpriseIssues')}</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.enterprise.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 个人问题 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person" size={18} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>{t('channelManage.personalIssues')}</Text>
          </View>
          <View style={styles.channelsGrid}>
            {channelData.personal.filter(channel => !myChannels.includes(channel)).map((channel, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.channelTag}
                onPress={() => toggleChannel(channel)}
              >
                <Text style={styles.channelText}>{channel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 组合频道 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="layers" size={16} color="#ef4444" /> {t('channelManage.comboChannels')}
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowComboCreator(!showComboCreator)}
            >
              <Ionicons name={showComboCreator ? "remove-circle" : "add-circle"} size={20} color="#ef4444" />
              <Text style={styles.addBtnText}>{showComboCreator ? t('channelManage.collapse') : t('channelManage.expand')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionNote}>
            {t('channelManage.comboDescription')}
          </Text>

          {/* 创建组合频道表单 */}
          {showComboCreator && (
            <View style={styles.comboCreator}>
              <View style={styles.comboSteps}>
                <View style={styles.comboStepHeader}>
                  <Text style={styles.comboStepTitle}>
                    {comboStep === 'region' ? t('channelManage.step1') : t('channelManage.step2')}
                  </Text>
                </View>
                <Text style={styles.comboPath}>{t('channelManage.selected')} {getSelectedPath()}</Text>
                
                {/* 区域搜索框 - 只在区域选择步骤显示 */}
                {comboStep === 'region' && (
                  <View style={styles.regionSearchContainer}>
                    <Ionicons name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                      style={styles.regionSearchInput}
                      placeholder={t('channelManage.searchRegion') || '搜索地区...'}
                      placeholderTextColor="#9ca3af"
                      value={regionSearchText}
                      onChangeText={setRegionSearchText}
                    />
                    {regionSearchText.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => setRegionSearchText('')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close-circle" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                
                <ScrollView style={styles.comboOptions} nestedScrollEnabled>
                  {comboStep === 'region' ? (
                    // 区域选择
                    getRegionOptions().map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.comboOption}
                        onPress={() => selectRegionOption(option)}
                      >
                        <Text style={styles.comboOptionText}>
                          {typeof option === 'string' ? option : option.name}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    ))
                  ) : (
                    // 分类选择
                    getCategoryOptions().map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.comboOption,
                          option.icon && styles.comboOptionWithIcon
                        ]}
                        onPress={() => selectCategoryOption(option)}
                      >
                        {option.icon && (
                          <View style={[styles.categoryIcon, { backgroundColor: option.color + '20' }]}>
                            <Ionicons name={option.icon} size={18} color={option.color} />
                          </View>
                        )}
                        <Text style={styles.comboOptionText}>{option.name}</Text>
                        {/* 只有在选择分类类型时才显示箭头，选择具体分类时不显示 */}
                        {!comboSelection.categoryType && (
                          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>

                <View style={styles.comboActions}>
                  {comboStep === 'region' ? (
                    <>
                      {regionStep > 0 && (
                        <TouchableOpacity
                          style={styles.comboBackBtn}
                          onPress={() => {
                            setRegionStep(regionStep - 1);
                            const newSelection = { ...comboSelection };
                            if (regionStep === 1) newSelection.country = null;
                            if (regionStep === 2) newSelection.province = null;
                            if (regionStep === 3) newSelection.city = null;
                            setComboSelection(newSelection);
                          }}
                        >
                          <Ionicons name="arrow-back" size={16} color="#6b7280" />
                          <Text style={styles.comboBackText}>{t('channelManage.previousStep')}</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.comboNextBtn}
                        onPress={goToCategory}
                      >
                        <Text style={styles.comboNextText}>{t('channelManage.nextStep')}</Text>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.comboBackBtn}
                        onPress={() => {
                          if (comboSelection.categoryType) {
                            // 返回到分类类型选择
                            setComboSelection({
                              ...comboSelection,
                              categoryType: null,
                              category: null
                            });
                          } else {
                            // 返回到区域选择
                            backToRegion();
                            setRegionSearchText(''); // 清空搜索框
                          }
                        }}
                      >
                        <Ionicons name="arrow-back" size={16} color="#6b7280" />
                        <Text style={styles.comboBackText}>{t('channelManage.previousStep')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.comboCreateBtn,
                          !comboSelection.category && styles.comboCreateBtnDisabled
                        ]}
                        onPress={() => {
                          console.log('🔍 Create button pressed');
                          console.log('📂 comboSelection.category:', comboSelection.category);
                          console.log('✅ Can create:', comboSelection.category);
                          createComboChannel();
                        }}
                        disabled={!comboSelection.category}
                      >
                        <Text style={styles.comboCreateText}>
                          {t('channelManage.createChannel')}
                          {!comboSelection.category && ' (Disabled)'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
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
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 8
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
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
    marginRight: -4,
    marginBottom: -4
  },
  myChannelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4
  },
  myChannelText: {
    fontSize: 15,
    color: '#374151',
    marginRight: 4
  },
  
  // 频道网格样式
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -4,
    marginBottom: -4
  },
  channelTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4
  },
  channelText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '400'
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
    color: '#ef4444',
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 60
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepDotActive: {
    backgroundColor: '#ef4444'
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af'
  },
  stepDotTextActive: {
    color: '#fff'
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 6
  },
  stepLineActive: {
    backgroundColor: '#ef4444'
  },
  comboStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  comboStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  skipBtnText: {
    fontSize: 12,
    color: '#ef4444'
  },
  comboPath: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 8
  },
  regionSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  searchIcon: {
    marginRight: 6
  },
  regionSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    padding: 0
  },
  comboOptions: {
    maxHeight: 200,
    marginBottom: 12
  },
  comboOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 4
  },
  comboOptionWithIcon: {
    paddingVertical: 8
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  comboOptionText: {
    flex: 1,
    fontSize: 13,
    color: '#374151'
  },
  comboActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
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
  comboNextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6
  },
  comboNextText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600'
  },
  comboCreateBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center'
  },
  comboCreateBtnDisabled: {
    backgroundColor: '#fca5a5',
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
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca'
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
    color: '#ef4444'
  }
});
