import { Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import NetInfo from '@react-native-community/netinfo';

/**
 * 设备信息收集工具
 * 收集用户设备的各种信息，用于分析和统计
 */
class DeviceInfo {
  /**
   * 获取完整的设备信息
   * @returns {Promise<Object>} 设备信息对象
   */
  static async getDeviceInfo() {
    const { width, height } = Dimensions.get('window');
    const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
    
    // 获取网络信息
    const netInfo = await NetInfo.fetch();

    const deviceInfo = {
      // ==================== 基础平台信息 ====================
      platform: {
        os: Platform.OS, // 'ios' 或 'android'
        osVersion: Platform.Version, // 系统版本号
        isPad: Device.deviceType === Device.DeviceType.TABLET,
        isTV: Device.deviceType === Device.DeviceType.TV,
        isDesktop: Device.deviceType === Device.DeviceType.DESKTOP,
      },

      // ==================== 设备硬件信息 ====================
      device: {
        brand: Device.brand, // 品牌 (如: Apple, Samsung, Xiaomi)
        manufacturer: Device.manufacturer, // 制造商
        modelName: Device.modelName, // 型号名称 (如: iPhone 14 Pro)
        modelId: Device.modelId, // 型号ID
        deviceName: Device.deviceName, // 设备名称
        deviceYearClass: Device.deviceYearClass, // 设备年份等级
        totalMemory: Device.totalMemory, // 总内存 (字节)
        supportedCpuArchitectures: Device.supportedCpuArchitectures, // CPU 架构
      },

      // ==================== 屏幕信息 ====================
      screen: {
        width: screenWidth,
        height: screenHeight,
        windowWidth: width,
        windowHeight: height,
        scale: Dimensions.get('window').scale, // 屏幕缩放比例
        fontScale: Dimensions.get('window').fontScale, // 字体缩放比例
        pixelRatio: Platform.select({
          ios: Dimensions.get('window').scale,
          android: Dimensions.get('window').scale,
        }),
      },

      // ==================== 应用信息 ====================
      app: {
        name: Constants.expoConfig?.name,
        version: Constants.expoConfig?.version,
        buildNumber: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode,
        bundleId: Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package,
        expoVersion: Constants.expoVersion,
        isDevice: Device.isDevice, // 是否真机（false 表示模拟器）
      },

      // ==================== 系统信息 ====================
      system: {
        // iOS 特有信息
        ...(Platform.OS === 'ios' && {
          systemName: Device.osName,
          systemVersion: Device.osVersion,
          platform: Platform.isPad ? 'iPad' : 'iPhone',
        }),
        
        // Android 特有信息
        ...(Platform.OS === 'android' && {
          apiLevel: Platform.Version,
          systemVersion: Device.osVersion,
          androidId: Constants.sessionId, // Android 设备 ID
        }),
      },

      // ==================== 地区和语言信息 ====================
      locale: {
        locale: Localization.locale, // 当前语言环境 (如: zh-CN, en-US)
        locales: Localization.locales, // 所有语言环境
        timezone: Localization.timezone, // 时区 (如: Asia/Shanghai)
        region: Localization.region, // 地区代码 (如: CN, US)
        currency: Localization.currency, // 货币代码 (如: CNY, USD)
        isRTL: Localization.isRTL, // 是否从右到左的语言
        isMetric: Localization.isMetric, // 是否使用公制单位
      },

      // ==================== 网络信息 ====================
      network: {
        type: netInfo.type, // 网络类型: wifi, cellular, none, unknown
        isConnected: netInfo.isConnected, // 是否连接
        isInternetReachable: netInfo.isInternetReachable, // 是否可访问互联网
        details: netInfo.details, // 详细信息（如运营商、信号强度等）
      },

      // ==================== 安装和会话信息 ====================
      session: {
        installationId: Constants.installationId, // 安装 ID（每次安装唯一）
        sessionId: Constants.sessionId, // 会话 ID（每次启动唯一）
        isFirstLaunch: false, // 需要通过 AsyncStorage 判断
      },

      // ==================== 时间戳 ====================
      timestamp: new Date().toISOString(),
    };

    return deviceInfo;
  }

  /**
   * 获取简化的设备信息（用于日志）
   * @returns {Promise<Object>}
   */
  static async getSimpleDeviceInfo() {
    const info = await this.getDeviceInfo();
    
    return {
      platform: `${info.platform.os} ${info.platform.osVersion}`,
      device: `${info.device.brand} ${info.device.modelName}`,
      screen: `${info.screen.width}x${info.screen.height}`,
      locale: info.locale.locale,
      network: info.network.type,
      isDevice: info.app.isDevice,
    };
  }

  /**
   * 打印设备信息到控制台（格式化输出）
   */
  static async printDeviceInfo() {
    const info = await this.getDeviceInfo();
    
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                      设备信息 / Device Info                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    // 基础平台信息
    console.log('📱 平台信息 (Platform)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   操作系统: ${info.platform.os.toUpperCase()}`);
    console.log(`   系统版本: ${info.platform.osVersion}`);
    console.log(`   设备类型: ${info.platform.isPad ? 'Tablet' : info.platform.isTV ? 'TV' : 'Phone'}`);
    console.log('\n');

    // 设备硬件信息
    console.log('🔧 硬件信息 (Hardware)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   品牌: ${info.device.brand || 'Unknown'}`);
    console.log(`   制造商: ${info.device.manufacturer || 'Unknown'}`);
    console.log(`   型号: ${info.device.modelName || 'Unknown'}`);
    console.log(`   型号ID: ${info.device.modelId || 'Unknown'}`);
    console.log(`   设备名称: ${info.device.deviceName || 'Unknown'}`);
    console.log(`   年份等级: ${info.device.deviceYearClass || 'Unknown'}`);
    console.log(`   总内存: ${info.device.totalMemory ? (info.device.totalMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'Unknown'}`);
    console.log(`   CPU架构: ${info.device.supportedCpuArchitectures?.join(', ') || 'Unknown'}`);
    console.log('\n');

    // 屏幕信息
    console.log('🖥️  屏幕信息 (Screen)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   屏幕尺寸: ${info.screen.screenWidth} x ${info.screen.screenHeight}`);
    console.log(`   窗口尺寸: ${info.screen.windowWidth} x ${info.screen.windowHeight}`);
    console.log(`   缩放比例: ${info.screen.scale}x`);
    console.log(`   字体缩放: ${info.screen.fontScale}x`);
    console.log('\n');

    // 应用信息
    console.log('📦 应用信息 (Application)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   应用名称: ${info.app.name || 'Unknown'}`);
    console.log(`   应用版本: ${info.app.version || 'Unknown'}`);
    console.log(`   构建号: ${info.app.buildNumber || 'Unknown'}`);
    console.log(`   Bundle ID: ${info.app.bundleId || 'Unknown'}`);
    console.log(`   Expo版本: ${info.app.expoVersion || 'Unknown'}`);
    console.log(`   运行环境: ${info.app.isDevice ? '真机' : '模拟器'}`);
    console.log('\n');

    // 地区和语言
    console.log('🌍 地区语言 (Locale)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   语言环境: ${info.locale.locale}`);
    console.log(`   所有语言: ${info.locale.locales?.join(', ') || 'Unknown'}`);
    console.log(`   时区: ${info.locale.timezone}`);
    console.log(`   地区: ${info.locale.region || 'Unknown'}`);
    console.log(`   货币: ${info.locale.currency || 'Unknown'}`);
    console.log(`   文字方向: ${info.locale.isRTL ? 'RTL (从右到左)' : 'LTR (从左到右)'}`);
    console.log(`   度量单位: ${info.locale.isMetric ? '公制' : '英制'}`);
    console.log('\n');

    // 网络信息
    console.log('🌐 网络信息 (Network)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   网络类型: ${info.network.type?.toUpperCase() || 'Unknown'}`);
    console.log(`   连接状态: ${info.network.isConnected ? '已连接' : '未连接'}`);
    console.log(`   互联网: ${info.network.isInternetReachable ? '可访问' : '不可访问'}`);
    if (info.network.details) {
      console.log(`   详细信息: ${JSON.stringify(info.network.details, null, 2)}`);
    }
    console.log('\n');

    // 会话信息
    console.log('🔑 会话信息 (Session)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   安装ID: ${info.session.installationId}`);
    console.log(`   会话ID: ${info.session.sessionId}`);
    console.log('\n');

    // 时间戳
    console.log('⏰ 时间戳 (Timestamp)');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`   ${info.timestamp}`);
    console.log('\n');

    console.log('═════════════════════════════════════════════════════════════════');
    console.log('\n');

    // 返回完整信息对象
    return info;
  }

  /**
   * 生成设备指纹字符串（用于后端注册）
   * 将设备信息组合成唯一的指纹字符串
   * 注意：只使用稳定的设备信息，避免每次启动都变化
   * @returns {Promise<string>}
   */
  static async generateFingerprintString() {
    const info = await this.getDeviceInfo();
    
    // 只使用稳定的设备信息（不会变化的字段）
    const components = [
      info.platform.os || 'unknown',                    // 操作系统
      info.platform.osVersion || 'unknown',             // 系统版本
      info.device.brand || 'unknown',                   // 品牌
      info.device.modelName || 'unknown',               // 型号名称
      info.device.modelId || 'unknown',                 // 型号ID
      `${info.screen.screenWidth}x${info.screen.screenHeight}`, // 屏幕分辨率
      info.locale.timezone || 'unknown',                // 时区（相对稳定）
      // 不使用 installationId（每次安装都会变）
      // 不使用 timestamp（每次都会变）
    ];
    
    // 将所有组件连接成字符串
    const fingerprintData = components.join('|');
    
    console.log('🔐 设备指纹组成:', fingerprintData);
    
    // 生成简单的哈希值（使用简单算法）
    let hash = 0;
    for (let i = 0; i < fingerprintData.length; i++) {
      const char = fingerprintData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // 转换为16进制字符串（不添加时间戳，保证每次相同）
    const fingerprint = Math.abs(hash).toString(16).padStart(16, '0');
    
    return fingerprint;
  }
}

export default DeviceInfo;
