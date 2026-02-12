import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/withTranslation';

/**
 * 收藏列表项组件
 */
export default function FavoriteListItem({ item, onPress }) {
  const { t } = useTranslation();
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return t('components.favoriteListItem.savedToday');
    if (days === 1) return t('components.favoriteListItem.savedYesterday');
    if (days < 7) return t('components.favoriteListItem.savedDaysAgo').replace('{days}', days);
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return t('components.favoriteListItem.savedWeeksAgo').replace('{weeks}', weeks);
    }
    return `${t('components.favoriteListItem.savedOn')}${date.toLocaleDateString()}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  author: {
    fontSize: 13,
    color: '#6b7280',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
