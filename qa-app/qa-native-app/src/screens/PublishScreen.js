import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const questionTypes = [
  { id: 'free', name: '免费提问', desc: '所有人可回答', icon: 'chatbubbles-outline', color: '#22c55e' },
  { id: 'reward', name: '悬赏提问', desc: '设置悬赏金额', icon: 'cash-outline', color: '#f97316' },
  { id: 'targeted', name: '定向提问', desc: '指定专家回答', icon: 'person-outline', color: '#3b82f6' },
];

export default function PublishScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('free');
  const [reward, setReward] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);

  const topics = ['Python学习', '编程入门', '职业规划', '数据分析', '健康', '职场', '情感', '美食'];

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布问题</Text>
        <TouchableOpacity style={[styles.publishBtn, (!title || !content) && styles.publishBtnDisabled]}>
          <Text style={[styles.publishBtnText, (!title || !content) && styles.publishBtnTextDisabled]}>发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 问题类型 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题类型</Text>
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
            <Text style={styles.sectionTitle}>悬赏金额</Text>
            <View style={styles.rewardInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput style={styles.rewardTextInput} placeholder="输入金额" keyboardType="numeric" value={reward} onChangeText={setReward} />
            </View>
            <View style={styles.quickAmounts}>
              {[10, 20, 50, 100].map(amount => (
                <TouchableOpacity key={amount} style={styles.quickAmountBtn} onPress={() => setReward(String(amount))}>
                  <Text style={styles.quickAmountText}>${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 问题标题 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题标题</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="请输入问题标题（5-50字）"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <Text style={styles.charCount}>{title.length}/50</Text>
        </View>

        {/* 问题描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>问题描述</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="详细描述你的问题，让回答者更好地理解..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 选择话题 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择话题（最多3个）</Text>
          <View style={styles.topicList}>
            {topics.map(topic => (
              <TouchableOpacity
                key={topic}
                style={[styles.topicTag, selectedTopics.includes(topic) && styles.topicTagActive]}
                onPress={() => toggleTopic(topic)}
              >
                <Text style={[styles.topicTagText, selectedTopics.includes(topic) && styles.topicTagTextActive]}>
                  #{topic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  publishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  publishBtnDisabled: { backgroundColor: '#fecaca' },
  publishBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  publishBtnTextDisabled: { color: '#fca5a5' },
  content: { flex: 1 },
  section: { padding: 16, borderBottomWidth: 8, borderBottomColor: '#f3f4f6' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  typeList: { flexDirection: 'row', gap: 12 },
  typeCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  typeCardActive: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  typeName: { fontSize: 13, fontWeight: '500', color: '#374151', marginTop: 8 },
  typeDesc: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  rewardInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16 },
  currencySymbol: { fontSize: 20, fontWeight: 'bold', color: '#374151' },
  rewardTextInput: { flex: 1, fontSize: 24, fontWeight: 'bold', paddingVertical: 16, marginLeft: 8 },
  quickAmounts: { flexDirection: 'row', gap: 12, marginTop: 12 },
  quickAmountBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, backgroundColor: '#f3f4f6', borderRadius: 8 },
  quickAmountText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  titleInput: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
  charCount: { textAlign: 'right', fontSize: 12, color: '#9ca3af', marginTop: 8 },
  contentInput: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, minHeight: 150 },
  topicList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  topicTag: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f3f4f6', borderRadius: 16 },
  topicTagActive: { backgroundColor: '#fef2f2' },
  topicTagText: { fontSize: 13, color: '#6b7280' },
  topicTagTextActive: { color: '#ef4444' },
});
