import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from '../utils/deviceInfo';

/**
 * 设备信息查看页面
 */
export default function DeviceInfoScreen({ navigation }) {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      setLoading(true);
      const info = await DeviceInfo.getDeviceInfo();
      setDeviceInfo(info);
      
      // 同时在控制台打印
      await DeviceInfo.printDeviceInfo();
    } catch (error) {
      console.error('获取设备信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!deviceInfo) return;

    const message = `
设备信息
─────────────────
平台: ${deviceInfo.platform.os.toUpperCase()} ${deviceInfo.platform.osVersion}
设备: ${deviceInfo.device.brand} ${deviceInfo.device.modelName}
屏幕: ${deviceInfo.screen.width}x${deviceInfo.screen.height}
语言: ${deviceInfo.locale.locale}
时区: ${deviceInfo.locale.timezone}
网络: ${deviceInfo.network.type}
安装ID: ${deviceInfo.session.installationId}
    `.trim();

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  const handleCopyToConsole = () => {
    if (deviceInfo) {
      console.log('📋 设备信息已复制到控制台:');
      console.log(JSON.stringify(deviceInfo, null, 2));
      alert('设备信息已输出到控制台');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>正在收集设备信息...</Text>
      </View>
    );
  }

  if (!deviceInfo) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>无法获取设备信息</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDeviceInfo}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设备信息</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCopyToConsole} style={styles.headerButton}>
            <Ionicons name="terminal" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 平台信息 */}
        <InfoSection
          icon="phone-portrait"
          title="平台信息"
          data={[
            { label: '操作系统', value: deviceInfo.platform.os.toUpperCase() },
            { label: '系统版本', value: deviceInfo.platform.osVersion },
            { label: '设备类型', value: deviceInfo.platform.isPad ? 'Tablet' : 'Phone' },
          ]}
        />

        {/* 硬件信息 */}
        <InfoSection
          icon="hardware-chip"
          title="硬件信息"
          data={[
            { label: '品牌', value: deviceInfo.device.brand || 'Unknown' },
            { label: '制造商', value: deviceInfo.device.manufacturer || 'Unknown' },
            { label: '型号', value: deviceInfo.device.modelName || 'Unknown' },
            { label: '型号ID', value: deviceInfo.device.modelId || 'Unknown' },
            { label: '设备名称', value: deviceInfo.device.deviceName || 'Unknown' },
            { label: '年份等级', value: deviceInfo.device.deviceYearClass || 'Unknown' },
            {
              label: '总内存',
              value: deviceInfo.device.totalMemory
                ? `${(deviceInfo.device.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`
                : 'Unknown',
            },
            {
              label: 'CPU架构',
              value: deviceInfo.device.supportedCpuArchitectures?.join(', ') || 'Unknown',
            },
          ]}
        />

        {/* 屏幕信息 */}
        <InfoSection
          icon="desktop"
          title="屏幕信息"
          data={[
            {
              label: '屏幕尺寸',
              value: `${deviceInfo.screen.screenWidth} x ${deviceInfo.screen.screenHeight}`,
            },
            {
              label: '窗口尺寸',
              value: `${deviceInfo.screen.windowWidth} x ${deviceInfo.screen.windowHeight}`,
            },
            { label: '缩放比例', value: `${deviceInfo.screen.scale}x` },
            { label: '字体缩放', value: `${deviceInfo.screen.fontScale}x` },
          ]}
        />

        {/* 应用信息 */}
        <InfoSection
          icon="apps"
          title="应用信息"
          data={[
            { label: '应用名称', value: deviceInfo.app.name || 'Unknown' },
            { label: '应用版本', value: deviceInfo.app.version || 'Unknown' },
            { label: '构建号', value: deviceInfo.app.buildNumber || 'Unknown' },
            { label: 'Bundle ID', value: deviceInfo.app.bundleId || 'Unknown' },
            { label: 'Expo版本', value: deviceInfo.app.expoVersion || 'Unknown' },
            { label: '运行环境', value: deviceInfo.app.isDevice ? '真机' : '模拟器' },
          ]}
        />

        {/* 地区语言 */}
        <InfoSection
          icon="globe"
          title="地区语言"
          data={[
            { label: '语言环境', value: deviceInfo.locale.locale },
            { label: '所有语言', value: deviceInfo.locale.locales?.join(', ') || 'Unknown' },
            { label: '时区', value: deviceInfo.locale.timezone },
            { label: '地区', value: deviceInfo.locale.region || 'Unknown' },
            { label: '货币', value: deviceInfo.locale.currency || 'Unknown' },
            { label: '文字方向', value: deviceInfo.locale.isRTL ? 'RTL' : 'LTR' },
            { label: '度量单位', value: deviceInfo.locale.isMetric ? '公制' : '英制' },
          ]}
        />

        {/* 网络信息 */}
        <InfoSection
          icon="wifi"
          title="网络信息"
          data={[
            { label: '网络类型', value: deviceInfo.network.type?.toUpperCase() || 'Unknown' },
            { label: '连接状态', value: deviceInfo.network.isConnected ? '已连接' : '未连接' },
            {
              label: '互联网',
              value: deviceInfo.network.isInternetReachable ? '可访问' : '不可访问',
            },
          ]}
        />

        {/* 会话信息 */}
        <InfoSection
          icon="key"
          title="会话信息"
          data={[
            { label: '安装ID', value: deviceInfo.session.installationId },
            { label: '会话ID', value: deviceInfo.session.sessionId },
          ]}
        />

        {/* 时间戳 */}
        <InfoSection
          icon="time"
          title="时间戳"
          data={[{ label: '收集时间', value: deviceInfo.timestamp }]}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 信息区块组件
function InfoSection({ icon, title, data }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color="#ef4444" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {data.map((item, index) => (
          <View key={index} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});
