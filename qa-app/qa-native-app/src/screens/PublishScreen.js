import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Switch, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const questionTypes = [
  { id: 'free', name: '免费问题', desc: '公开提问', icon: 'gift', color: '#22c55e' },
  { id: 'reward', name: '悬赏问题', desc: '付费求答', icon: 'cash', color: '#f97316' },
  { id: 'targeted', name: '定向问题', desc: '指定回答', icon: 'locate', color: '#3b82f6' },
];

const rewardAmounts = [10, 20, 50, 100];
const topics = ['#职场', '#教育', '#科技', '#生活', '#健康', '#情感', '#理财', '#美食'];

// 问题类别数据
const categoryData = {
  level1: [
    { id: 1, name: '国家', icon: 'business', color: '#3b82f6', desc: '国家政策、社会民生' },
    { id: 2, name: '行业', icon: 'briefcase', color: '#22c55e', desc: '各行业专业问题' },
    { id: 3, name: '个人', icon: 'person', color: '#8b5cf6', desc: '个人生活、成长' },
  ],
  level2: {
    1: [ // 国家
      { id: 101, name: '政策法规', icon: 'document-text' },
      { id: 102, name: '社会民生', icon: 'people' },
      { id: 103, name: '经济发展', icon: 'trending-up' },
      { id: 104, name: '教育医疗', icon: 'school' },
      { id: 105, name: '环境保护', icon: 'leaf' },
      { id: 106, name: '基础设施', icon: 'construct' },
    ],
    2: [ // 行业
      { id: 201, name: '互联网', icon: 'globe' },
      { id: 202, name: '金融', icon: 'card' },
      { id: 203, name: '医疗健康', icon: 'fitness' },
      { id: 204, name: '教育培训', icon: 'school' },
      { id: 205, name: '房地产', icon: 'home' },
      { id: 206, name: '制造业', icon: 'cog' },
      { id: 207, name: '餐饮服务', icon: 'restaurant' },
    ],
    3: [ // 个人
      { id: 301, name: '职业发展', icon: 'rocket' },
      { id: 302, name: '情感生活', icon: 'heart' },
      { id: 303, name: '健康养生', icon: 'fitness' },
      { id: 304, name: '理财投资', icon: 'wallet' },
      { id: 305, name: '学习成长', icon: 'book' },
      { id: 306, name: '家庭关系', icon: 'home' },
    ],
  }
};

export default function PublishScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('free');
  const [reward, setReward] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [location, setLocation] = useState('北京市');
  const [visibility, setVisibility] = useState('所有人');
  
  // 问题类别状态
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedLevel1, setSelectedLevel1] = useState(null);
  const [selectedLevel2, setSelectedLevel2] = useState(null);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic]);
    } else {
      Alert.alert('提示', '最多选择3个话题');
    }
  };

  const addImage = () => {
    if (images.length < 9) {
      setImages([...images, `https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=200&fit=crop&r=${Date.now()}`]);
    }
  };

  const addCustomTopic = () => {
    if (customTopic.trim() && !selectedTopics.includes(`#${customTopic}`)) {
      if (selectedTopics.length < 3) {
        setSelectedTopics([...selectedTopics, `#${customTopic}`]);
        setCustomTopic('');
      } else {
        Alert.alert('提示', '最多选择3个话题');
      }
    }
  };

  const handleSaveDraft = () => {
    if (!title && !content) {
      Alert.alert('提示', '请先输入内容');
      return;
    }
    Alert.alert('保存成功', '草稿已保存');
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入问题标题');
      return;
    }
    if (title.length < 5) {
      Alert.alert('提示', '标题至少5个字');
      return;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入问题描述');
      return;
    }
    if (!selectedLevel1 || !selectedLevel2) {
      Alert.alert('提示', '请选择问题类别');
      return;
    }
    if (selectedType === 'reward' && (!reward || parseInt(reward) < 1)) {
      Alert.alert('提示', '请设置悬赏金额');
      return;
    }
    Alert.alert('发布成功', '您的问题已发布', [
      { text: '确定', onPress: () => navigation.goBack() }
    ]);
  };

  const handleLocationPress = () => {
    Alert.alert('选择位置', '选择您的位置', [
      { text: '北京市', onPress: () => setLocation('北京市') },
      { text: '上海市', onPress: () => setLocation('上海市') },
      { text: '广州市', onPress: () => setLocation('广州市') },
      { text: '不显示位置', onPress: () => setLocation('不显示') },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const handleVisibilityPress = () => {
    Alert.alert('谁可以看', '选择可见范围', [
      { text: '所有人', onPress: () => setVisibility('所有人') },
      { text: '仅关注我的人', onPress: () => setVisibility('仅关注我的人') },
      { text: '仅自己', onPress: () => setVisibility('仅自己') },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const selectLevel1 = (cat) => {
    setSelectedLevel1(cat);
    setSelectedLevel2(null);
  };

  const selectLevel2 = (cat) => {
    setSelectedLevel2(cat);
    setShowCategoryModal(false);
  };

  const getCategoryDisplay = () => {
    if (selectedLevel1 && selectedLevel2) {
      return `${selectedLevel1.name} > ${selectedLevel2.name}`;
    }
    return '请选择问题类别';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布问题</Text>
        <TouchableOpacity onPress={handleSaveDraft}><Text style={styles.saveDraft}>存草稿</Text></TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 问题类型选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择问题类型</Text>
          <View style={styles.typeList}>
            {questionTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, selectedType === type.id && styles.typeCardActive]}
                onPress={() => setSelectedType(type.id)}
              >
                <Ionicons name={type.icon} size={24} color={selectedType === type.id ? type.color : '#9ca3af'} />
                <Text style={[styles.typeName, selectedType === type.id && { color: type.color }]}>{type.name}</Text>
                <Text style={styles.typeDesc}>{type.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 问题类别选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题类别 <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.categorySelector} onPress={() => setShowCategoryModal(true)}>
            <View style={styles.categorySelectorLeft}>
              {selectedLevel1 ? (
                <View style={[styles.categoryIcon, { backgroundColor: selectedLevel1.color + '20' }]}>
                  <Ionicons name={selectedLevel1.icon} size={18} color={selectedLevel1.color} />
                </View>
              ) : (
                <View style={[styles.categoryIcon, { backgroundColor: '#f3f4f6' }]}>
                  <Ionicons name="folder-outline" size={18} color="#9ca3af" />
                </View>
              )}
              <Text style={[styles.categorySelectorText, !selectedLevel1 && { color: '#9ca3af' }]}>
                {getCategoryDisplay()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* 悬赏金额 */}
        {selectedType === 'reward' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>设置悬赏金额</Text>
            <View style={styles.quickAmounts}>
              {rewardAmounts.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.amountBtn, reward === String(amount) && styles.amountBtnActive]}
                  onPress={() => setReward(String(amount))}
                >
                  <Text style={[styles.amountText, reward === String(amount) && styles.amountTextActive]}>${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.customAmount}>
              <Text style={styles.customLabel}>自定义金额：</Text>
              <TextInput style={styles.customInput} placeholder="输入金额" keyboardType="numeric" value={reward} onChangeText={setReward} />
              <Text style={styles.currencySymbol}>$</Text>
            </View>
          </View>
        )}

        {/* 问题标题 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题标题 <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.titleInput} placeholder="请输入问题标题（5-50字）" value={title} onChangeText={setTitle} maxLength={50} />
          <Text style={styles.charCount}>{title.length}/50</Text>
        </View>

        {/* 问题描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题描述 <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.contentInput} placeholder="详细描述你的问题，让回答者更好地理解..." value={content} onChangeText={setContent} multiline textAlignVertical="top" maxLength={2000} />
          <Text style={styles.charCount}>{content.length}/2000</Text>
        </View>

        {/* 添加图片 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>添加图片（最多9张）</Text>
          <View style={styles.imageGrid}>
            {images.map((img, idx) => (
              <View key={idx} style={styles.imageItem}>
                <TouchableOpacity style={styles.removeImage} onPress={() => setImages(images.filter((_, i) => i !== idx))}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 9 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={addImage}>
                <Ionicons name="add" size={24} color="#9ca3af" />
                <Text style={styles.addImageText}>添加图片</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 选择话题 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择话题</Text>
          <View style={styles.topicList}>
            {topics.map(topic => (
              <TouchableOpacity
                key={topic}
                style={[styles.topicTag, selectedTopics.includes(topic) && styles.topicTagActive]}
                onPress={() => toggleTopic(topic)}
              >
                <Text style={[styles.topicTagText, selectedTopics.includes(topic) && styles.topicTagTextActive]}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customTopic}>
            <TextInput style={styles.customTopicInput} placeholder="自定义话题" value={customTopic} onChangeText={setCustomTopic} />
            <TouchableOpacity style={styles.addTopicBtn} onPress={addCustomTopic}><Text style={styles.addTopicBtnText}>添加</Text></TouchableOpacity>
          </View>
        </View>

        {/* 更多设置 */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLocationPress}>
            <Ionicons name="location-outline" size={20} color="#9ca3af" />
            <Text style={styles.settingLabel}>添加位置</Text>
            <Text style={styles.settingValue}>{location}</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleVisibilityPress}>
            <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            <Text style={styles.settingLabel}>谁可以看</Text>
            <Text style={styles.settingValue}>{visibility}</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Ionicons name="person-outline" size={20} color="#9ca3af" />
            <Text style={styles.settingLabel}>匿名提问</Text>
            <Switch value={isAnonymous} onValueChange={setIsAnonymous} trackColor={{ false: '#e5e7eb', true: '#fecaca' }} thumbColor={isAnonymous ? '#ef4444' : '#fff'} />
          </View>
        </View>

        {/* 发布按钮 */}
        <TouchableOpacity style={[styles.publishBtn, (!title || !content || !selectedLevel2) && styles.publishBtnDisabled]} onPress={handlePublish}>
          <Text style={styles.publishBtnText}>发布问题</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 问题类别选择弹窗 */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>选择问题类别</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.categoryContent}>
              {/* 一级类别 */}
              <View style={styles.level1Container}>
                <Text style={styles.levelTitle}>一级类别</Text>
                {categoryData.level1.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.level1Item, selectedLevel1?.id === cat.id && styles.level1ItemActive]}
                    onPress={() => selectLevel1(cat)}
                  >
                    <View style={[styles.level1Icon, { backgroundColor: cat.color + '20' }]}>
                      <Ionicons name={cat.icon} size={20} color={cat.color} />
                    </View>
                    <View style={styles.level1Info}>
                      <Text style={[styles.level1Name, selectedLevel1?.id === cat.id && { color: cat.color }]}>{cat.name}</Text>
                      <Text style={styles.level1Desc}>{cat.desc}</Text>
                    </View>
                    {selectedLevel1?.id === cat.id && (
                      <Ionicons name="checkmark-circle" size={20} color={cat.color} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* 二级类别 */}
              <View style={styles.level2Container}>
                <Text style={styles.levelTitle}>二级类别</Text>
                {selectedLevel1 ? (
                  <View style={styles.level2Grid}>
                    {categoryData.level2[selectedLevel1.id]?.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.level2Item, selectedLevel2?.id === cat.id && styles.level2ItemActive]}
                        onPress={() => selectLevel2(cat)}
                      >
                        <Ionicons name={cat.icon} size={18} color={selectedLevel2?.id === cat.id ? selectedLevel1.color : '#6b7280'} />
                        <Text style={[styles.level2Name, selectedLevel2?.id === cat.id && { color: selectedLevel1.color }]}>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.level2Empty}>
                    <Ionicons name="arrow-back" size={24} color="#d1d5db" />
                    <Text style={styles.level2EmptyText}>请先选择一级类别</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  saveDraft: { fontSize: 14, color: '#ef4444' },
  content: { flex: 1, padding: 12 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  required: { color: '#ef4444' },
  typeList: { flexDirection: 'row', gap: 10 },
  typeCard: { flex: 1, alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb' },
  typeCardActive: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  typeName: { fontSize: 12, fontWeight: '500', color: '#374151', marginTop: 8 },
  typeDesc: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  // 类别选择器
  categorySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  categorySelectorLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  categorySelectorText: { fontSize: 14, color: '#1f2937' },
  quickAmounts: { flexDirection: 'row', gap: 10 },
  amountBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, backgroundColor: '#f3f4f6', borderRadius: 8 },
  amountBtnActive: { backgroundColor: '#ef4444' },
  amountText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  amountTextActive: { color: '#fff' },
  customAmount: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  customLabel: { fontSize: 13, color: '#6b7280' },
  customInput: { flex: 1, marginLeft: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, fontSize: 14 },
  currencySymbol: { marginLeft: 8, fontSize: 14, color: '#6b7280' },
  titleInput: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14 },
  charCount: { textAlign: 'right', fontSize: 11, color: '#9ca3af', marginTop: 6 },
  contentInput: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, minHeight: 120 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  imageItem: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#e5e7eb', position: 'relative' },
  removeImage: { position: 'absolute', top: -8, right: -8 },
  addImageBtn: { width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  addImageText: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  topicList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicTag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 16 },
  topicTagActive: { backgroundColor: '#fef2f2' },
  topicTagText: { fontSize: 13, color: '#6b7280' },
  topicTagTextActive: { color: '#ef4444' },
  customTopic: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  customTopicInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, fontSize: 14 },
  addTopicBtn: { marginLeft: 8, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addTopicBtnText: { fontSize: 13, color: '#fff' },
  settingsSection: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  settingLabel: { flex: 1, marginLeft: 12, fontSize: 14, color: '#1f2937' },
  settingValue: { fontSize: 13, color: '#9ca3af', marginRight: 4 },
  publishBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  publishBtnDisabled: { backgroundColor: '#fecaca' },
  publishBtnText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  // 弹窗样式
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  categoryModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  categoryContent: { padding: 16 },
  levelTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 12 },
  level1Container: { marginBottom: 20 },
  level1Item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: '#f9fafb' },
  level1ItemActive: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  level1Icon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  level1Info: { flex: 1 },
  level1Name: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  level1Desc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  level2Container: { marginBottom: 20 },
  level2Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  level2Item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#f9fafb', borderRadius: 20, gap: 6 },
  level2ItemActive: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  level2Name: { fontSize: 13, color: '#374151' },
  level2Empty: { alignItems: 'center', paddingVertical: 30 },
  level2EmptyText: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
});
