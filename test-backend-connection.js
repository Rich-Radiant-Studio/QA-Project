/**
 * 后端服务连接测试脚本
 * 用于快速检查后端服务是否正常运行
 */

const axios = require('axios');

const BACKEND_URL = 'http://27.8.143.201:30560/qa-hero-app-user';

async function testBackendConnection() {
  console.log('🔍 开始测试后端服务连接...\n');
  console.log('📍 后端地址:', BACKEND_URL);
  console.log('⏰ 测试时间:', new Date().toLocaleString('zh-CN'));
  console.log('─'.repeat(60));

  // 测试1: 基础连接测试
  console.log('\n【测试 1】基础连接测试');
  try {
    const response = await axios.get(BACKEND_URL, {
      timeout: 5000,
      validateStatus: () => true, // 接受所有状态码
    });
    console.log('✅ 服务器可访问');
    console.log('   状态码:', response.status);
    console.log('   响应头:', JSON.stringify(response.headers, null, 2));
  } catch (error) {
    console.log('❌ 服务器不可访问');
    console.log('   错误:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   原因: 连接被拒绝，服务可能已停止');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   原因: 连接超时，网络可能有问题');
    }
  }

  // 测试2: 用户资料接口测试（需要 token）
  console.log('\n【测试 2】用户资料接口测试');
  try {
    const response = await axios.get(`${BACKEND_URL}/app/user/profile/me`, {
      timeout: 5000,
      validateStatus: () => true,
    });
    console.log('✅ 接口可访问');
    console.log('   状态码:', response.status);
    if (response.status === 401) {
      console.log('   说明: 需要 token（正常，说明接口存在）');
    } else {
      console.log('   响应:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 接口不可访问');
    console.log('   错误:', error.message);
  }

  // 测试3: 头像上传接口测试
  console.log('\n【测试 3】头像上传接口测试');
  try {
    const response = await axios.post(
      `${BACKEND_URL}/app/user/profile/avatar`,
      {},
      {
        timeout: 5000,
        validateStatus: () => true,
      }
    );
    console.log('✅ 接口可访问');
    console.log('   状态码:', response.status);
    console.log('   响应:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ 接口不可访问');
    console.log('   错误:', error.message);
  }

  // 测试4: 注册接口测试（不需要 token）
  console.log('\n【测试 4】注册接口测试');
  try {
    const response = await axios.post(
      `${BACKEND_URL}/app/user/auth/register`,
      { fingerprint: 'test-fingerprint-' + Date.now() },
      {
        timeout: 5000,
        validateStatus: () => true,
      }
    );
    console.log('✅ 接口可访问');
    console.log('   状态码:', response.status);
    console.log('   响应:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ 接口不可访问');
    console.log('   错误:', error.message);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('测试完成！');
}

// 运行测试
testBackendConnection().catch(console.error);
