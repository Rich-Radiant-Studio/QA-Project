import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';

/**
 * 公开主页顶部导航栏组件（今日头条风格）
 * 左侧：返回按钮
 * 中间：用户简介（过长时截断）
 * 右侧：更多操作按钮
 */
export default function PublicProfileHeader({ bio, onBack, onShare }) {
  const { t } = useTranslation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  /**
   * 截断简介文字
   */
  const truncateBio = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  /**
   * 处理更多操作菜单
   */
  const handleMorePress = () => {
    setShowMoreMenu(true);
  };

  /**
   * 处理分享
   */
  const handleShare = async () => {
    setShowMoreMenu(false);
    if (onShare) {
      onShare();
    }
  };

  /**
   * 处理举报
   */
  const handleReport = () => {
    setShowMoreMenu(false);
    // TODO: 实现举报功能
    console.log('Report user');
  };

  /**
   * 处理拉黑
   */
  const handleBlock = () => {
    setShowMoreMenu(false);
    // TODO: 实现拉黑功能
    console.log('Block user');
  };

  return (
    <>
      <View style={styles.container}>
        {/* 返回按钮 */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>

        {/* 中间留空 */}
        <View style={styles.centerSection} />

        {/* 更多操作按钮 */}
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* 更多操作菜单 Modal */}
      <Modal
        visible={showMoreMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color="#374151" />
              <Text style={styles.menuItemText}>{t('common.share')}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleReport}>
              <Ionicons name="flag-outline" size={22} color="#374151" />
              <Text style={styles.menuItemText}>{t('common.report')}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleBlock}>
              <Ionicons name="ban-outline" size={22} color="#ef4444" />
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                {t('common.block')}
              </Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setShowMoreMenu(false)}
            >
              <Text style={styles.menuItemCancel}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
  },
  menuItemDanger: {
    color: '#ef4444',
  },
  menuItemCancel: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    width: '100%',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
});
