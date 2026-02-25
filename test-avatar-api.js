// 测试头像上传 API
const axios = require('axios');

const API_BASE_URL = 'http://27.8.143.201:30560/qa-hero-app-user';
const AVATAR_ENDPOINT = '/app/user/profile/avatar';

// 测试用的小图片 Base64（1x1 像素的红色图片）
const TEST_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testAvatarUpload() {
  console.log('🧪 测试头像上传 API\n');
  console.log('📍 API 地址:', API_BASE_URL + AVATAR_ENDPOINT);
  console.log('📊 测试图片大小:', TEST_IMAGE_BASE64.length, '字符\n');

  try {
    // 1. 测试不带 Token 的请求
    console.log('1️⃣ 测试不带 Token 的请求...');
    try {
      const response1 = await axios.post(
        API_BASE_URL + AVATAR_ENDPOINT,
        { avatarfile: TEST_IMAGE_BASE64 },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('✅ 响应:', response1.data);
    } catch (error) {
      if (error.response) {
        console.log('❌ 错误响应:', error.response.status, error.response.data);
      } else {
        console.log('❌ 请求失败:', error.message);
      }
    }

    console.log('\n2️⃣ 测试带 Token 的请求...');
    // 2. 测试带 Token 的请求（需要先获取 Token）
    console.log('⚠️ 需要先登录获取 Token\n');

    // 3. 测试服务器连接
    console.log('3️⃣ 测试服务器连接...');
    try {
      const response3 = await axios.get(API_BASE_URL + '/app/user/profile/me', {
        timeout: 5000
      });
      console.log('✅ 服务器在线');
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log('❌ 连接超时');
      } else if (error.response) {
        console.log('⚠️ 服务器响应:', error.response.status);
      } else {
        console.log('❌ 无法连接到服务器:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testAvatarUpload();
