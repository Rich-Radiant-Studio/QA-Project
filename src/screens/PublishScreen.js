import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Switch, Alert, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import IdentitySelector from '../components/IdentitySelector';

const questionTypes = [
  { id: 'free', name: '公开问题', desc: '公开提问', icon: 'gift', color: '#22c55e' },
  { id: 'reward', name: '悬赏问题', desc: '付费求答', icon: 'cash', color: '#f97316' },
  { id: 'targeted', name: '定向问题', desc: '指定回答', icon: 'locate', color: '#3b82f6' },
];


const rewardAmounts = [10, 20, 50, 100];
const topics = ['#职场', '#教育', '#科技', '#生活', '#健康', '#情感', '#理财', '#美食'];

// 可邀请的专家用户
const expertUsers = [
  { id: 1, name: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert1', verified: true, title: '资深Python开发 · 10年经验', field: '编程', recommended: true },
  { id: 2, name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert2', verified: true, title: '主任医师 · 三甲医院', field: '医疗', recommended: true },
  { id: 3, name: '理财达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert3', verified: true, title: '注册理财规划师', field: '理财', recommended: true },
  { id: 4, name: '美食评论家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert4', verified: true, title: '美食博主 · 100万粉丝', field: '美食', recommended: false },
  { id: 5, name: '职场导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert5', verified: true, title: 'HR总监 · 15年经验', field: '职场', recommended: false },
  { id: 6, name: '心理咨询师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert6', verified: true, title: '国家二级心理咨询师', field: '心理', recommended: true },
  { id: 7, name: '法律顾问', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert7', verified: true, title: '执业律师 · 8年经验', field: '法律', recommended: false },
  { id: 8, name: '健身教练', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert8', verified: true, title: '国家级健身教练', field: '健身', recommended: false },
];

// 问题类别数据
const categoryData = {
  level1: [
    { id: 1, name: '国家', icon: 'business', color: '#3b82f6', desc: '国家政策、社会民生' },
    { id: 2, name: '行业', icon: 'briefcase', color: '#22c55e', desc: '各行业专业问题' },
    { id: 3, name: '个人', icon: 'person', color: '#8b5cf6', desc: '个人生活、成长' },
  ],
  level2: {
    1: [
      { id: 101, name: '政策法规', icon: 'document-text' },
      { id: 102, name: '社会民生', icon: 'people' },
      { id: 103, name: '经济发展', icon: 'trending-up' },
      { id: 104, name: '教育医疗', icon: 'school' },
      { id: 105, name: '环境保护', icon: 'leaf' },
      { id: 106, name: '基础设施', icon: 'construct' },
    ],
    2: [
      { id: 201, name: '互联网', icon: 'globe' },
      { id: 202, name: '金融', icon: 'card' },
      { id: 203, name: '医疗健康', icon: 'fitness' },
      { id: 204, name: '教育培训', icon: 'school' },
      { id: 205, name: '房地产', icon: 'home' },
      { id: 206, name: '制造业', icon: 'cog' },
      { id: 207, name: '餐饮服务', icon: 'restaurant' },
    ],
    3: [
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
  const [allowOthersReward, setAllowOthersReward] = useState(false); // 是否允许他人悬赏
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [location, setLocation] = useState('北京');
  const [visibility, setVisibility] = useState('所有人');
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [selectedLevel1, setSelectedLevel1] = useState(null);
  const [selectedLevel2, setSelectedLevel2] = useState(null);
  
  // 定向问题相关状态
  const [targetedUsers, setTargetedUsers] = useState([]);
  const [targetedReward, setTargetedReward] = useState('');
  const [expertSearchQuery, setExpertSearchQuery] = useState('');
  
  // 答案设置
  const [answerPublic, setAnswerPublic] = useState(true); // 是否公开答案
  const [answerPaid, setAnswerPaid] = useState(false); // 是否付费查看
  const [answerPrice, setAnswerPrice] = useState(''); // 查看答案价格
  
  // 身份选择
  const [publishIdentity, setPublishIdentity] = useState('personal'); // 'personal' or 'team'
  const [selectedTeams, setSelectedTeams] = useState([]); // 选中的团队ID数组

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

    // 验证悬赏问题金额
    if (selectedType === 'reward') {
      const amount = parseFloat(reward);
      if (isNaN(amount) || amount < 1) {
        Alert.alert('提示', '悬赏问题金额不能小于1');
        return;
      }
    }
    if (selectedType === 'targeted') {
      if (targetedUsers.length === 0) {
        Alert.alert('提示', '请至少邀请一位专家');
        return;
      }
      const amount = parseFloat(targetedReward);
      if (isNaN(amount) || amount < 1) {
        Alert.alert('提示', '定向问题奖赏金额不能小于1');
        return;
      }
    }
    if (answerPaid && (!answerPrice || parseInt(answerPrice) < 1)) {
      Alert.alert('提示', '请设置查看答案的价格');
      return;
    }
    Alert.alert('发布成功', '您的问题已发布', [
      { text: '确定', onPress: () => navigation.goBack() }
    ]);
  };

  const handleLocationPress = () => {
    Alert.alert('选择位置', '选择您的位置', [
      { text: '北京', onPress: () => setLocation('北京') },
      { text: '上海', onPress: () => setLocation('上海') },
      { text: '广州', onPress: () => setLocation('广州') },
      { text: '不显示位置', onPress: () => setLocation('不显示') },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const handleVisibilityPress = () => {
    setShowVisibilityModal(true);
  };

  const selectVisibility = (value) => {
    setVisibility(value);
    setShowVisibilityModal(false);
  };

  const toggleTargetedUser = (user) => {
    if (targetedUsers.find(u => u.id === user.id)) {
      setTargetedUsers(targetedUsers.filter(u => u.id !== user.id));
    } else if (targetedUsers.length < 5) {
      setTargetedUsers([...targetedUsers, user]);
    } else {
      Alert.alert('提示', '最多邀请5位专家');
    }
  };

  const removeTargetedUser = (userId) => {
    setTargetedUsers(targetedUsers.filter(u => u.id !== userId));
  };

  // 过滤专家列表
  const filteredExperts = expertUsers.filter(user => 
    user.name.toLowerCase().includes(expertSearchQuery.toLowerCase()) ||
    user.title.toLowerCase().includes(expertSearchQuery.toLowerCase()) ||
    user.field.toLowerCase().includes(expertSearchQuery.toLowerCase())
  );

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
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布问题</Text>
        <TouchableOpacity 
          onPress={handleSaveDraft}
          style={styles.saveDraftBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Text style={styles.saveDraft}>存草稿</Text>
        </TouchableOpacity>
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

        {/* 公开问题 - 允许他人悬赏 */}
        {selectedType === 'free' && (
          <View style={styles.section}>
            <View style={styles.rewardToggleRow}>
              <View style={styles.rewardToggleLeft}>
                <Ionicons name="gift-outline" size={22} color="#22c55e" />
                <View style={styles.rewardToggleText}>
                  <Text style={styles.rewardToggleTitle}>允许他人悬赏金额</Text>
                  <Text style={styles.rewardToggleDesc}>允许其他用户为此问题添加悬赏</Text>
                </View>
              </View>
              <Switch 
                value={allowOthersReward} 
                onValueChange={setAllowOthersReward}
                trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }} 
                thumbColor={allowOthersReward ? '#22c55e' : '#fff'} 
              />
            </View>
          </View>
        )}

        {/* 悬赏金额 */}
        {selectedType === 'reward' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>设置悬赏金额 <Text style={styles.required}>*</Text></Text>
            <Text style={styles.sectionDesc}>悬赏金额不能小于 $1</Text>
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
              <TextInput 
                style={styles.customInput} 
                placeholder="输入金额（最低$1）" 
                keyboardType="numeric" 
                value={reward} 
                onChangeText={(text) => {
                  // 只允许输入数字和小数点
                  const filtered = text.replace(/[^0-9.]/g, '');
                  setReward(filtered);
                }}
              />
              <Text style={styles.currencySymbol}>$</Text>
            </View>
          </View>
        )}

        {/* 定向问题 - 邀请专家 */}
        {selectedType === 'targeted' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>邀请回答专家 <Text style={styles.required}>*</Text></Text>
              <Text style={styles.sectionDesc}>最多邀请5位专家回答</Text>
              
              {/* 已选择的专家 */}
              {targetedUsers.length > 0 && (
                <View style={styles.selectedUsersContainer}>
                  {targetedUsers.map(user => (
                    <View key={user.id} style={styles.selectedUserChip}>
                      <View style={styles.selectedUserInfo}>
                        <Ionicons name="person-circle" size={20} color="#3b82f6" />
                        <Text style={styles.selectedUserName}>{user.name}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeTargetedUser(user.id)}>
                        <Ionicons name="close-circle" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* 搜索框 */}
              <View style={styles.expertSearchContainer}>
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput
                  style={styles.expertSearchInput}
                  placeholder="搜索专家姓名、领域或职称..."
                  value={expertSearchQuery}
                  onChangeText={setExpertSearchQuery}
                  placeholderTextColor="#9ca3af"
                />
                {expertSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setExpertSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              {/* 可选择的专家列表 */}
              <View style={styles.expertListContainer}>
                {/* 推荐标题 */}
                <View style={styles.recommendedHeader}>
                  <Ionicons name="star" size={18} color="#f59e0b" />
                  <Text style={styles.recommendedHeaderText}>推荐专家</Text>
                </View>

                {/* 专家列表 */}
                <View style={styles.expertList}>
                  {filteredExperts.length > 0 ? (
                    filteredExperts.map(user => {
                      const isSelected = targetedUsers.find(u => u.id === user.id);
                      return (
                        <TouchableOpacity
                          key={user.id}
                          style={[styles.expertItem, isSelected && styles.expertItemSelected]}
                          onPress={() => toggleTargetedUser(user)}
                        >
                          <View style={styles.expertAvatar}>
                            <Ionicons name="person-circle" size={40} color={isSelected ? '#3b82f6' : '#9ca3af'} />
                          </View>
                          <View style={styles.expertInfo}>
                            <View style={styles.expertNameRow}>
                              <Text style={styles.expertName}>{user.name}</Text>
                              {user.verified && (
                                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                              )}
                            </View>
                            <Text style={styles.expertTitle}>{user.title}</Text>
                            <View style={styles.expertFieldTag}>
                              <Text style={styles.expertFieldText}>{user.field}</Text>
                            </View>
                          </View>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View style={styles.noResultsContainer}>
                      <Ionicons name="search-outline" size={48} color="#d1d5db" />
                      <Text style={styles.noResultsText}>未找到匹配的专家</Text>
                      <Text style={styles.noResultsHint}>试试其他关键词</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* 定向问题奖赏 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>设置奖赏金额 <Text style={styles.required}>*</Text></Text>
              <Text style={styles.sectionDesc}>给予专家的回答奖励，不能小于 $1</Text>
              <View style={styles.quickAmounts}>
                {rewardAmounts.map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.amountBtn, targetedReward === String(amount) && styles.amountBtnActive]}
                    onPress={() => setTargetedReward(String(amount))}
                  >
                    <Text style={[styles.amountText, targetedReward === String(amount) && styles.amountTextActive]}>${amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.customAmount}>
                <Text style={styles.customLabel}>自定义金额：</Text>
                <TextInput 
                  style={styles.customInput} 
                  placeholder="输入金额（最低$1）" 
                  keyboardType="numeric" 
                  value={targetedReward} 
                  onChangeText={(text) => {
                    // 只允许输入数字和小数点
                    const filtered = text.replace(/[^0-9.]/g, '');
                    setTargetedReward(filtered);
                  }}
                />
                <Text style={styles.currencySymbol}>$</Text>
              </View>
            </View>
          </>
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

        {/* 答案设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>答案设置</Text>
          
          {/* 是否公开答案 */}
          <View style={styles.answerSettingItem}>
            <View style={styles.answerSettingLeft}>
              <Ionicons name="eye-outline" size={22} color="#3b82f6" />
              <View style={styles.answerSettingText}>
                <Text style={styles.answerSettingTitle}>公开答案</Text>
                <Text style={styles.answerSettingDesc}>所有人都可以看到问题的答案</Text>
              </View>
            </View>
            <Switch 
              value={answerPublic} 
              onValueChange={setAnswerPublic} 
              trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }} 
              thumbColor={answerPublic ? '#3b82f6' : '#fff'} 
            />
          </View>

          {/* 付费查看答案 */}
          {answerPublic && (
            <View style={styles.answerSettingItem}>
              <View style={styles.answerSettingLeft}>
                <Ionicons name="cash-outline" size={22} color="#f59e0b" />
                <View style={styles.answerSettingText}>
                  <Text style={styles.answerSettingTitle}>付费查看</Text>
                  <Text style={styles.answerSettingDesc}>用户需要付费才能查看答案</Text>
                </View>
              </View>
              <Switch 
                value={answerPaid} 
                onValueChange={setAnswerPaid} 
                trackColor={{ false: '#e5e7eb', true: '#fef3c7' }} 
                thumbColor={answerPaid ? '#f59e0b' : '#fff'} 
              />
            </View>
          )}

          {/* 查看价格设置 */}
          {answerPublic && answerPaid && (
            <View style={styles.answerPriceContainer}>
              <Text style={styles.answerPriceLabel}>查看价格</Text>
              <View style={styles.answerPriceInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput 
                  style={styles.priceInput} 
                  placeholder="设置查看答案的价格" 
                  keyboardType="numeric" 
                  value={answerPrice} 
                  onChangeText={setAnswerPrice}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <Text style={styles.answerPriceHint}>建议价格：$1 - $10</Text>
            </View>
          )}

          {/* 私密答案提示 */}
          {!answerPublic && (
            <View style={styles.privateAnswerTip}>
              <Ionicons name="lock-closed" size={16} color="#6b7280" />
              <Text style={styles.privateAnswerText}>答案将仅对你可见，其他用户无法查看</Text>
            </View>
          )}
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

        {/* 身份选择器 */}
        <View style={styles.section}>
          <IdentitySelector
            selectedIdentity={publishIdentity}
            selectedTeams={selectedTeams}
            onIdentityChange={setPublishIdentity}
            onTeamsChange={setSelectedTeams}
          />
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

      {/* 谁可以看弹窗 */}
      <Modal visible={showVisibilityModal} animationType="fade" transparent>
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowVisibilityModal(false)}
          />
          <View style={styles.visibilityModal}>
            <View style={styles.visibilityHeader}>
              <Text style={styles.visibilityTitle}>谁可以看</Text>
              <Text style={styles.visibilitySubtitle}>选择问题的可见范围</Text>
            </View>

            <View style={styles.visibilityOptions}>
              <TouchableOpacity
                style={[styles.visibilityOption, visibility === '所有人' && styles.visibilityOptionActive]}
                onPress={() => selectVisibility('所有人')}
                activeOpacity={0.7}
              >
                <View style={[styles.visibilityIconContainer, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="globe-outline" size={24} color="#3b82f6" />
                </View>
                <View style={styles.visibilityTextContainer}>
                  <Text style={styles.visibilityOptionTitle}>所有人</Text>
                  <Text style={styles.visibilityOptionDesc}>所有用户都可以看到这个问题</Text>
                </View>
                {visibility === '所有人' && (
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.visibilityOption, visibility === '仅关注我的人' && styles.visibilityOptionActive]}
                onPress={() => selectVisibility('仅关注我的人')}
                activeOpacity={0.7}
              >
                <View style={[styles.visibilityIconContainer, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="people-outline" size={24} color="#f59e0b" />
                </View>
                <View style={styles.visibilityTextContainer}>
                  <Text style={styles.visibilityOptionTitle}>仅关注我的人</Text>
                  <Text style={styles.visibilityOptionDesc}>只有关注你的用户可以看到</Text>
                </View>
                {visibility === '仅关注我的人' && (
                  <Ionicons name="checkmark-circle" size={24} color="#f59e0b" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.visibilityOption, visibility === '仅自己' && styles.visibilityOptionActive]}
                onPress={() => selectVisibility('仅自己')}
                activeOpacity={0.7}
              >
                <View style={[styles.visibilityIconContainer, { backgroundColor: '#fce7f3' }]}>
                  <Ionicons name="lock-closed-outline" size={24} color="#ec4899" />
                </View>
                <View style={styles.visibilityTextContainer}>
                  <Text style={styles.visibilityOptionTitle}>仅自己</Text>
                  <Text style={styles.visibilityOptionDesc}>只有你自己可以看到这个问题</Text>
                </View>
                {visibility === '仅自己' && (
                  <Ionicons name="checkmark-circle" size={24} color="#ec4899" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.visibilityCloseBtn}
              onPress={() => setShowVisibilityModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.visibilityCloseBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  closeBtn: { padding: 4, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  saveDraftBtn: { padding: 4, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  saveDraft: { fontSize: 14, color: '#ef4444' },
  content: { flex: 1, padding: 12 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  sectionDesc: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  required: { color: '#ef4444' },
  typeList: { flexDirection: 'row', gap: 10 },
  typeCard: { flex: 1, alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb' },
  typeCardActive: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  typeName: { fontSize: 12, fontWeight: '500', color: '#374151', marginTop: 8 },
  typeDesc: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
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
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }),
  },
  categoryModal: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    maxHeight: '80%',
    ...(Platform.OS === 'web' && {
      position: 'relative',
      zIndex: 10000,
    }),
  },
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
  
  // 谁可以看弹窗样式
  modalBackdrop: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    ...(Platform.OS === 'web' && {
      zIndex: 9999,
    }),
  },
  visibilityModal: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginHorizontal: 24, 
    width: '90%',
    maxWidth: 400, 
    alignSelf: 'center', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    ...(Platform.OS === 'web' && {
      position: 'relative',
      zIndex: 10000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }),
  },
  visibilityHeader: { 
    paddingTop: 24,
    paddingHorizontal: 20, 
    paddingBottom: 16,
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6', 
    alignItems: 'center' 
  },
  visibilityTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  visibilitySubtitle: { fontSize: 13, color: '#9ca3af' },
  visibilityOptions: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  visibilityOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 10, 
    backgroundColor: '#f9fafb', 
    borderWidth: 2, 
    borderColor: 'transparent' 
  },
  visibilityOptionActive: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  visibilityIconContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
    flexShrink: 0,
  },
  visibilityTextContainer: { flex: 1, marginRight: 8 },
  visibilityOptionTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 3 },
  visibilityOptionDesc: { fontSize: 12, color: '#6b7280', lineHeight: 16 },
  visibilityCloseBtn: { 
    marginHorizontal: 16, 
    marginTop: 8,
    marginBottom: 20, 
    paddingVertical: 14, 
    backgroundColor: '#f3f4f6', 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  visibilityCloseBtnText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  
  // 定向问题样式
  selectedUsersContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  selectedUserChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  selectedUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  selectedUserName: { fontSize: 13, color: '#1f2937', fontWeight: '500' },
  expertSearchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  expertSearchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1f2937' },
  expertListContainer: { marginTop: 8 },
  recommendedHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 4, marginBottom: 8 },
  recommendedHeaderText: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  expertList: { gap: 10 },
  expertItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f9fafb', borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  expertItemSelected: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  expertAvatar: { marginRight: 12 },
  expertInfo: { flex: 1 },
  expertNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4, flexWrap: 'wrap' },
  expertName: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  expertTitle: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  expertFieldTag: { alignSelf: 'flex-start', backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  expertFieldText: { fontSize: 11, color: '#f59e0b', fontWeight: '500' },
  noResultsContainer: { alignItems: 'center', paddingVertical: 40 },
  noResultsText: { fontSize: 15, fontWeight: '600', color: '#6b7280', marginTop: 12 },
  noResultsHint: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  
  // 答案设置样式
  answerSettingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerSettingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  answerSettingText: { marginLeft: 12, flex: 1 },
  answerSettingTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 2 },
  answerSettingDesc: { fontSize: 12, color: '#6b7280' },
  answerPriceContainer: { marginTop: 12, padding: 12, backgroundColor: '#fffbeb', borderRadius: 10, borderWidth: 1, borderColor: '#fef3c7' },
  answerPriceLabel: { fontSize: 13, fontWeight: '600', color: '#92400e', marginBottom: 8 },
  answerPriceInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#fde68a' },
  priceInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1f2937', marginLeft: 4 },
  answerPriceHint: { fontSize: 11, color: '#92400e', marginTop: 6 },
  privateAnswerTip: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 12, backgroundColor: '#f9fafb', borderRadius: 10, gap: 8 },
  privateAnswerText: { fontSize: 12, color: '#6b7280', flex: 1 },
  
  // 悬赏开关样式
  rewardToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  rewardToggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rewardToggleText: { marginLeft: 12, flex: 1 },
  rewardToggleTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 2 },
  rewardToggleDesc: { fontSize: 12, color: '#6b7280' },
  rewardAmountSection: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  rewardAmountLabel: { fontSize: 13, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
});
