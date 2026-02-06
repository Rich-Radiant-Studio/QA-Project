import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../i18n';

export default function EmergencyScreen({ navigation }) {
  const t = (key) => i18n.t(key);
  const [emergencyForm, setEmergencyForm] = useState({ 
    title: '', 
    description: '', 
    location: '', 
    contact: '', 
    rescuerCount: 1 
  });

  const freeCount = 1;
  const usedCount = 0;
  const remainingFree = freeCount - usedCount;
  const freeRescuerLimit = 5;
  const extraRescuerFee = 2;
  
  const calculateRescuerFee = (count) => {
    if (count <= freeRescuerLimit) return 0;
    return (count - freeRescuerLimit) * extraRescuerFee;
  };

  const rescuerFee = calculateRescuerFee(emergencyForm.rescuerCount || 1);

  const quickTitles = [
    t('emergency.quickTitle1'),
    t('emergency.quickTitle2'),
    t('emergency.quickTitle3')
  ];

  const handleSubmit = () => {
    if (!emergencyForm.title.trim()) {
      Alert.alert(t('emergency.enterTitle'));
      return;
    }
    const feeInfo = rescuerFee > 0 ? `\n${t('emergency.needPay')}：${rescuerFee}` : '';
    Alert.alert(
      t('emergency.published'),
      `${t('emergency.rescuersNeeded')}${emergencyForm.rescuerCount}${t('emergency.rescuerUnit')}${feeInfo}\n${t('emergency.nearbyNotified')}`,
      [{ text: t('emergency.confirm'), onPress: () => navigation.goBack() }]
    );
    setEmergencyForm({ title: '', description: '', location: '', contact: '', rescuerCount: 1 });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.headerTitle}>{t('emergency.title')}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.submitBtn, !emergencyForm.title.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!emergencyForm.title.trim()}
        >
          <Text style={[styles.submitText, !emergencyForm.title.trim() && styles.submitTextDisabled]}>
            {t('emergency.publish')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Warning */}
      <View style={styles.warning}>
        <Ionicons name="warning" size={18} color="#f59e0b" />
        <Text style={styles.warningText}>{t('emergency.warning')}</Text>
      </View>

      {/* Free Count Banner */}
      <View style={styles.freeCountBanner}>
        <View style={styles.freeCountLeft}>
          <Ionicons name="gift" size={20} color={remainingFree > 0 ? "#22c55e" : "#9ca3af"} />
          <Text style={styles.freeCountText}>{t('emergency.freeCount')}</Text>
          <Text style={[styles.freeCountNumber, remainingFree <= 0 && { color: '#9ca3af' }]}>
            {remainingFree}/{freeCount}
          </Text>
        </View>
        {remainingFree <= 0 && (
          <TouchableOpacity 
            style={styles.monthlyPayButton}
            onPress={() => Alert.alert(t('emergency.monthlyUnlock'))}
          >
            <Text style={styles.monthlyPayButtonText}>{t('emergency.payAmount')}</Text>
            <Ionicons name="arrow-forward" size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.formArea} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            {t('emergency.formTitle')} <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={styles.formInput}
            placeholder={t('emergency.formTitlePlaceholder')}
            placeholderTextColor="#bbb"
            value={emergencyForm.title}
            onChangeText={(text) => setEmergencyForm({...emergencyForm, title: text})}
          />
          <View style={styles.quickTitlesContainer}>
            <Text style={styles.quickTitlesLabel}>{t('emergency.quickTitles')}</Text>
            <View style={styles.quickTitlesRow}>
              {quickTitles.map((title, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickTitleTag}
                  onPress={() => setEmergencyForm({...emergencyForm, title: title})}
                >
                  <Text style={styles.quickTitleText}>{title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t('emergency.description')}</Text>
          <TextInput
            style={[styles.formInput, styles.formTextarea]}
            placeholder={t('emergency.descriptionPlaceholder')}
            placeholderTextColor="#bbb"
            value={emergencyForm.description}
            onChangeText={(text) => setEmergencyForm({...emergencyForm, description: text})}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t('emergency.location')}</Text>
          <View style={styles.locationRow}>
            <View style={styles.locationInput}>
              <Ionicons name="location" size={18} color="#ef4444" />
              <TextInput
                style={styles.locationText}
                placeholder={t('emergency.locationPlaceholder')}
                placeholderTextColor="#bbb"
                value={emergencyForm.location}
                onChangeText={(text) => setEmergencyForm({...emergencyForm, location: text})}
              />
            </View>
            <TouchableOpacity style={styles.locationBtn}>
              <Ionicons name="navigate" size={18} color="#3b82f6" />
              <Text style={styles.locationBtnText}>{t('emergency.locate')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{t('emergency.contact')}</Text>
          <View style={styles.contactInput}>
            <Ionicons name="call" size={18} color="#6b7280" />
            <TextInput
              style={styles.contactText}
              placeholder={t('emergency.contactPlaceholder')}
              placeholderTextColor="#bbb"
              value={emergencyForm.contact}
              onChangeText={(text) => setEmergencyForm({...emergencyForm, contact: text})}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Rescuer Count */}
        <View style={styles.formGroup}>
          <View style={styles.rescuerCountHeader}>
            <Text style={styles.formLabel}>{t('emergency.rescuerCount')}</Text>
            <View style={styles.rescuerFreeTag}>
              <Ionicons name="information-circle" size={14} color="#22c55e" />
              <Text style={styles.rescuerFreeText}>{t('emergency.rescuerFree')}</Text>
            </View>
          </View>
          
          <View style={styles.rescuerCountInputWrapper}>
            <TextInput
              style={styles.rescuerCountInput}
              placeholder={t('emergency.rescuerPlaceholder')}
              placeholderTextColor="#bbb"
              value={emergencyForm.rescuerCount === 0 ? '' : emergencyForm.rescuerCount.toString()}
              onChangeText={(text) => {
                if (text === '') {
                  setEmergencyForm({...emergencyForm, rescuerCount: 0});
                  return;
                }
                const num = parseInt(text);
                if (!isNaN(num)) {
                  const validNum = Math.max(1, Math.min(20, num));
                  setEmergencyForm({...emergencyForm, rescuerCount: validNum});
                }
              }}
              onBlur={() => {
                if (emergencyForm.rescuerCount === 0) {
                  setEmergencyForm({...emergencyForm, rescuerCount: 1});
                }
              }}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.rescuerCountUnit}>{t('emergency.rescuerUnit')}</Text>
          </View>

          <View style={styles.rescuerFeeInfo}>
            {rescuerFee === 0 ? (
              <View style={styles.rescuerFeeRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.rescuerFeeTextFree}>{t('emergency.rescuerFeeTextFree')}</Text>
              </View>
            ) : (
              <View style={styles.rescuerFeeCard}>
                <View style={styles.rescuerFeeRow}>
                  <View style={styles.rescuerFeeLeft}>
                    <Text style={styles.rescuerFeeLabel}>{t('emergency.rescuerFeeLabel')}</Text>
                    <Text style={styles.rescuerFeeExtra}>
                      {emergencyForm.rescuerCount - freeRescuerLimit}{t('emergency.rescuerUnit')} × ${extraRescuerFee}
                    </Text>
                  </View>
                  <View style={styles.rescuerFeeRight}>
                    <Text style={styles.rescuerFeeTotalLabel}>{t('emergency.needPay')}</Text>
                    <Text style={styles.rescuerFeeTotal}>${rescuerFee}</Text>
                  </View>
                </View>
                <Text style={styles.rescuerFeeNote}>{t('emergency.rescuerFeeNote')}</Text>
                <TouchableOpacity 
                  style={styles.payButton}
                  onPress={() => Alert.alert(
                    t('emergency.pay') + ' ' + rescuerFee,
                    t('emergency.paymentMethods')
                  )}
                >
                  <Ionicons name="card" size={18} color="#fff" />
                  <Text style={styles.payButtonText}>{t('emergency.payNow')} ${rescuerFee}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>{t('emergency.tips')}</Text>
          <Text style={styles.tipsText}>{t('emergency.tip1')}</Text>
          <Text style={styles.tipsText}>{t('emergency.tip2')}</Text>
          <Text style={styles.tipsText}>{t('emergency.tip3')}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  submitBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  submitBtnDisabled: { backgroundColor: '#fecaca' },
  submitText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  submitTextDisabled: { color: '#fff' },
  warning: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fffbeb', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    gap: 8 
  },
  warningText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 18 },
  freeCountBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#f0fdf4', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb' 
  },
  freeCountLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  freeCountText: { fontSize: 14, color: '#374151' },
  freeCountNumber: { fontSize: 16, fontWeight: 'bold', color: '#22c55e' },
  monthlyPayButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  monthlyPayButtonText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  formArea: { flex: 1, padding: 16 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  formInput: { 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    fontSize: 15, 
    color: '#1f2937' 
  },
  quickTitlesContainer: { marginTop: 12 },
  quickTitlesLabel: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  quickTitlesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickTitleTag: { 
    backgroundColor: '#fef2f2', 
    borderWidth: 1, 
    borderColor: '#fecaca', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16 
  },
  quickTitleText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  formTextarea: { minHeight: 100, textAlignVertical: 'top' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locationInput: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    gap: 8 
  },
  locationText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  locationBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#eff6ff', 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    borderRadius: 8, 
    gap: 4 
  },
  locationBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  contactInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    gap: 8 
  },
  contactText: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  rescuerCountHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  rescuerFreeTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#f0fdf4', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#bbf7d0' 
  },
  rescuerFreeText: { fontSize: 12, color: '#16a34a', fontWeight: '500' },
  rescuerCountInputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    gap: 8 
  },
  rescuerCountInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  rescuerCountUnit: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  rescuerFeeInfo: { marginTop: 12 },
  rescuerFeeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rescuerFeeTextFree: { fontSize: 14, color: '#22c55e', fontWeight: '500' },
  rescuerFeeCard: { 
    backgroundColor: '#fff7ed', 
    borderWidth: 1, 
    borderColor: '#fed7aa', 
    borderRadius: 8, 
    padding: 12 
  },
  rescuerFeeLeft: { flex: 1 },
  rescuerFeeLabel: { fontSize: 13, color: '#92400e', marginBottom: 4 },
  rescuerFeeExtra: { fontSize: 15, color: '#ea580c', fontWeight: '600' },
  rescuerFeeRight: { alignItems: 'flex-end' },
  rescuerFeeTotalLabel: { fontSize: 12, color: '#92400e', marginBottom: 2 },
  rescuerFeeTotal: { fontSize: 24, fontWeight: 'bold', color: '#ef4444' },
  rescuerFeeNote: { fontSize: 12, color: '#92400e', marginTop: 8 },
  payButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#ef4444', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    marginTop: 12, 
    gap: 8 
  },
  payButtonText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  tips: { 
    backgroundColor: '#fef2f2', 
    borderRadius: 8, 
    padding: 12, 
    marginTop: 8 
  },
  tipsTitle: { fontSize: 13, fontWeight: '500', color: '#991b1b', marginBottom: 8 },
  tipsText: { fontSize: 12, color: '#b91c1c', lineHeight: 20 },
});
