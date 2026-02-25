import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 性别选择弹窗组件（底部弹出式 ActionSheet 风格）
 */
export default function GenderPickerModal({ visible, onClose, currentGender, onSelect }) {
  const insets = useSafeAreaInsets();
  
  const genderOptions = [
    { value: '男', label: '男' },
    { value: '女', label: '女' },
    { value: '保密', label: '保密' },
  ];

  const handleSelect = (value) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={[styles.modalContainer, { paddingBottom: insets.bottom || 20 }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* 标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>选择性别</Text>
          </View>

          {/* 选项列表 */}
          <View style={styles.optionsList}>
            {genderOptions.map((option, index) => {
              const isSelected = currentGender === option.value;
              const isLast = index === genderOptions.length - 1;
              
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    !isLast && styles.optionItemBorder
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.6}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={24} color="#ef4444" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 取消按钮 */}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.6}
          >
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '400',
  },
  optionsList: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  optionItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5ea',
  },
  optionText: {
    fontSize: 17,
    color: '#000',
    fontWeight: '400',
  },
  optionTextSelected: {
    color: '#ef4444',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  cancelText: {
    fontSize: 17,
    color: '#000',
    fontWeight: '500',
  },
});
