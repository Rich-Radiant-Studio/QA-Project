// 设备信息获取示例
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';

// 获取完整设备信息
export const getDeviceInfo = async () => {
  // 获取网络信息
  const netInfo = await NetInfo.fetch();
  
  return {
    // 设备基本信息
    device: {
      name: Device.deviceName,
      type: Device.deviceType,
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      modelId: Device.modelId,
      isDevice: Device.isDevice, // 是否真机
    },
    
    // 系统信息
    os: {
      name: Device.osName,
      version: Device.osVersion,
      buildId: Device.osBuildId,
    },
    
    // 应用信息
    app: {
      version: Constants.expoConfig?.version,
      name: Constants.expoConfig?.name,
      bundleId: Constants.expoConfig?.ios?.bundleIdentifier || 
                Constants.expoConfig?.android?.package,
    },
    
    // 唯一标识
    identifiers: {
      installationId: Constants.installationId, // 安装ID
      sessionId: Constants.sessionId,           // 会话ID
    },
    
    // 硬件信息
    hardware: {
      totalMemory: Device.totalMemory,
      cpuArchitectures: Device.supportedCpuArchitectures,
    },
    
    // 网络信息
    network: {
      type: netInfo.type,           // wifi/cellular/none
      isConnected: netInfo.isConnected,
      isInternetReachable: netInfo.isInternetReachable,
    },
    
    // 时间戳
    timestamp: new Date().toISOString(),
  };
};

// 使用示例
const sendDeviceInfoToBackend = async () => {
  try {
    const deviceInfo = await getDeviceInfo();
    
    const response = await fetch('https://your-api.com/device-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceInfo),
    });
    
    console.log('设备信息已发送', deviceInfo);
  } catch (error) {
    console.error('发送设备信息失败', error);
  }
};
