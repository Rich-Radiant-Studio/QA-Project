import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * 现代化的头像操作底部弹出框
 * 参考微信、QQ、小红书等主流 APP 的设计
 */
export default function AvatarActionSheet({ visible, onClose, onTakePhoto, onChooseFromAlbum }) {
  const insets = useSafeAreaInsets();
  const [slideAnim] = React.useState(new Animated.Value(SCREEN_HEIGHT));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleTakePhoto = () => {
    handleClose();
    setTimeout(() => onTakePhoto(), 300);
  };

  const handleChooseFromAlbum = () => {
    handleClose();
    setTimeout(() => onChooseFromAlbum(), 300);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* 遮罩层 - 点击关闭 */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        
        {/* 内容区域 - 不拦截点击 */}
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: insets.bottom || 20,
            },
          ]}
          pointerEvents="box-none"
        >
          {/* 标题 */}
          <View style={styles.header} pointerEvents="auto">
            <View style={styles.dragIndicator} />
            <Text style={styles.title}>更换头像</Text>
          </View>

          {/* 操作选项 */}
          <View style={styles.optionsContainer} pointerEvents="auto">
            {/* 拍照 */}
            <TouchableOpacity
              style={styles.option}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="camera" size={24} color="#fff" />
              </View>
              <Text style={styles.optionText}>拍照</Text>
            </TouchableOpacity>

            {/* 从相册选择 */}
            <TouchableOpacity
              style={styles.option}
              onPress={handleChooseFromAlbum}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="images" size={24} color="#fff" />
              </View>
              <Text style={styles.optionText}>从相册选择</Text>
            </TouchableOpacity>
          </View>

          {/* 取消按钮 */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            activeOpacity={0.7}
            pointerEvents="auto"
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  option: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});
