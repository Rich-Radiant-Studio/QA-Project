import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';

/**
 * 内容列表组件
 * 使用 FlatList 实现虚拟化列表
 */
export default function ContentList({ 
  data, 
  renderItem,
  onEndReached,
  isLoadingMore,
  hasMore,
  refreshing,
  onRefresh,
}) {
  const { t } = useTranslation();

  /**
   * 渲染空状态
   */
  const renderEmptyComponent = () => {
    if (refreshing) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyText}>{t('profile.noContent')}</Text>
      </View>
    );
  };

  /**
   * 渲染底部加载指示器
   */
  const renderFooterComponent = () => {
    if (!isLoadingMore) {
      if (!hasMore && data.length > 0) {
        return (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>{t('common.noMoreContent')}</Text>
          </View>
        );
      }
      return null;
    }

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#ef4444" />
        <Text style={styles.footerLoadingText}>{t('common.loading')}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooterComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={data.length === 0 ? styles.emptyListContainer : null}
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  footerLoadingText: {
    fontSize: 13,
    color: '#6b7280',
  },
});
