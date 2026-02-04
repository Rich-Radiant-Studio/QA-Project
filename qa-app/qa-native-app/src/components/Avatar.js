import React, { useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

/**
 * 通用头像组件
 * 自动处理加载失败，显示首字母占位符
 */
export default function Avatar({ uri, name = '用户', size = 40, style, textStyle }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 如果加载失败或没有 URI，显示首字母占位符
  if (error || !uri) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const colors = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
    ];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return (
      <View 
        style={[
          styles.placeholder, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: bgColor
          }, 
          style
        ]}
      >
        <Text 
          style={[
            styles.initial, 
            { fontSize: size / 2.2 },
            textStyle
          ]}
        >
          {initial}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={{ 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: '#f3f4f6'
        }}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          console.log('头像加载失败:', uri, e.nativeEvent.error);
          setError(true);
          setLoading(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
