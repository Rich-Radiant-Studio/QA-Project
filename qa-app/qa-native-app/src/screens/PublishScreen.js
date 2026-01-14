import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const questionTypes = [
  { id: 'free', name: '免费问题', desc: '公开提问', icon: 'gift', color: '#22c55e' },
  { id: 'reward', name: '悬赏问题', desc: '付费求答', icon: 'cash', color: '#f97316' },
  { id: 'targeted', name: '定向问题', desc: '指定回答', icon: 'locate', color: '#3b82f6' },
];

const rewardAmounts = [10, 20, 50, 100];
const topics = ['#职场', '#教育', '#科技', '#生活', '#健康', '#情感', '#理财', '#美食'];

export default function PublishScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('free');
  const [reward, setReward] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState([]);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const addImage = () => {
    if (images.length < 9) {
      setImages([...images, `https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=200&fit=crop&r=${Date.now()}`]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布问题</Text>
        <TouchableOpacity><Text style={styles.saveDraft}>存草稿</Text></TouchableOpacity>
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
          <Text style={styles.sectionTitle}>问题标题</Text>
          <TextInput style={styles.titleInput} placeholder="请输入问题标题（5-50字）" value={title} onChangeText={setTitle} maxLength={50} />
          <Text style={styles.charCount}>{title.length}/50</Text>
        </View>

        {/* 问题描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题描述</Text>
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
            <TextInput style={styles.customTopicInput} placeholder="自定义话题" />
            <TouchableOpacity style={styles.addTopicBtn}><Text style={styles.addTopicBtnText}>添加</Text></TouchableOpacity>
          </View>
        </View>

        {/* 更多设置 */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="location-outline" size={20} color="#9ca3af" />
            <Text style={styles.settingLabel}>添加位置</Text>
            <Text style={styles.settingValue}>北京市</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="eye-outline" size={20} color="#9ca3af" />
            <Text style={styles.settingLabel}>谁可以看</Text>
            <Text style={styles.settingValue}>所有人</Text>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Ionicons name="person-outline" size={20} color="#9ca3af" />
            <Text style={styles.settingLabel}>匿名提问</Text>
            <Switch value={isAnonymous} onValueChange={setIsAnonymous} trackColor={{ false: '#e5e7eb', true: '#fecaca' }} thumbColor={isAnonymous ? '#ef4444' : '#fff'} />
          </View>
        </View>

        {/* 发布按钮 */}
        <TouchableOpacity style={[styles.publishBtn, (!title || !content) && styles.publishBtnDisabled]}>
          <Text style={styles.publishBtnText}>发布问题</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
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
  typeList: { flexDirection: 'row', gap: 10 },
  typeCard: { flex: 1, alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb' },
  typeCardActive: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  typeName: { fontSize: 12, fontWeight: '500', color: '#374151', marginTop: 8 },
  typeDesc: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
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
});
