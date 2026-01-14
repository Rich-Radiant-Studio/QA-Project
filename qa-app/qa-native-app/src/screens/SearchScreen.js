import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const searchHistory = ['Python学习', '养猫攻略', '职业规划', '数据分析'];
const hotSearches = [
  { rank: 1, text: '2024年最值得学习的编程语言', hot: true },
  { rank: 2, text: '如何高效学习新技能', rising: true },
  { rank: 3, text: '远程办公的利与弊' },
  { rank: 4, text: '健康饮食指南' },
  { rank: 5, text: '理财入门知识' },
  { rank: 6, text: '如何提高睡眠质量' },
];
const hotTopics = [
  { name: '#职场', color: '#ef4444', bg: '#fef2f2' },
  { name: '#科技', color: '#3b82f6', bg: '#eff6ff' },
  { name: '#健康', color: '#22c55e', bg: '#f0fdf4' },
  { name: '#教育', color: '#a855f7', bg: '#faf5ff' },
  { name: '#美食', color: '#f97316', bg: '#fff7ed' },
  { name: '#情感', color: '#ec4899', bg: '#fdf2f8' },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const getRankStyle = (rank) => {
    if (rank === 1) return { backgroundColor: '#ef4444' };
    if (rank === 2) return { backgroundColor: '#f97316' };
    if (rank === 3) return { backgroundColor: '#eab308' };
    return { backgroundColor: '#d1d5db' };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索问题、话题或用户"
            value={query}
            onChangeText={(text) => { setQuery(text); setIsSearching(text.length > 0); }}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setIsSearching(false); }}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 搜索历史 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>搜索历史</Text>
            <TouchableOpacity><Ionicons name="trash-outline" size={18} color="#9ca3af" /></TouchableOpacity>
          </View>
          <View style={styles.tagList}>
            {searchHistory.map((item, index) => (
              <TouchableOpacity key={index} style={styles.historyTag} onPress={() => { setQuery(item); setIsSearching(true); }}>
                <Text style={styles.historyTagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 热门搜索 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>热门搜索</Text>
            <TouchableOpacity style={styles.refreshBtn}>
              <Ionicons name="refresh" size={14} color="#9ca3af" />
              <Text style={styles.refreshText}>换一批</Text>
            </TouchableOpacity>
          </View>
          {hotSearches.map((item) => (
            <TouchableOpacity key={item.rank} style={styles.hotItem}>
              <View style={[styles.rankBadge, getRankStyle(item.rank)]}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <Text style={styles.hotText}>{item.text}</Text>
              {item.hot && <Text style={styles.hotTag}>🔥 热</Text>}
              {item.rising && <Text style={styles.risingTag}>↑ 升</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* 热门话题 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>热门话题</Text>
            <TouchableOpacity><Text style={styles.moreText}>查看更多</Text></TouchableOpacity>
          </View>
          <View style={styles.tagList}>
            {hotTopics.map((topic, index) => (
              <TouchableOpacity key={index} style={[styles.topicTag, { backgroundColor: topic.bg }]}>
                <Text style={[styles.topicTagText, { color: topic.color }]}>{topic.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  backBtn: { padding: 8 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  searchBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  searchBtnText: { color: '#ef4444', fontSize: 14, fontWeight: '500' },
  content: { flex: 1 },
  section: { backgroundColor: '#fff', marginTop: 8, paddingHorizontal: 16, paddingVertical: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyTag: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  historyTagText: { fontSize: 13, color: '#6b7280' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center' },
  refreshText: { marginLeft: 4, fontSize: 12, color: '#9ca3af' },
  hotItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rankBadge: { width: 20, height: 20, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  rankText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  hotText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#1f2937' },
  hotTag: { fontSize: 11, color: '#ef4444' },
  risingTag: { fontSize: 11, color: '#f97316' },
  moreText: { fontSize: 12, color: '#ef4444' },
  topicTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  topicTagText: { fontSize: 13 },
});
