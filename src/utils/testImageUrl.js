import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 测试图片 URL 是否可以访问
 * 用于诊断头像加载问题
 */
export const testImageUrl = async (imageUrl) => {
  console.log('\n🔍 开始测试图片 URL...');
  console.log('   URL:', imageUrl);
  
  try {
    // 获取 token
    const token = await AsyncStorage.getItem('authToken');
    console.log('   Token 存在:', !!token);
    
    // 发送请求
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    console.log('\n📥 响应信息:');
    console.log('   状态码:', response.status);
    console.log('   状态文本:', response.statusText);
    console.log('   Content-Type:', response.headers.get('Content-Type'));
    console.log('   Content-Length:', response.headers.get('Content-Length'));
    
    // 获取响应体的前 200 个字符
    const text = await response.text();
    console.log('\n📄 响应内容（前 200 字符）:');
    console.log(text.substring(0, 200));
    
    // 判断是否是图片
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('image/')) {
      console.log('\n✅ 这是一个图片文件');
      console.log('   图片类型:', contentType);
    } else {
      console.log('\n❌ 这不是图片文件！');
      console.log('   实际类型:', contentType);
      console.log('   可能是错误页面或需要认证');
    }
    
    return {
      success: contentType && contentType.startsWith('image/'),
      status: response.status,
      contentType,
      preview: text.substring(0, 200),
    };
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default testImageUrl;
