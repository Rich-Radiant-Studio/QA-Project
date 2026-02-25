import apiClient from './apiClient';
import { API_ENDPOINTS } from '../../config/api';

/**
 * 用户相关 API
 */
const userApi = {
  /**
   * 获取用户资料
   * @param {string} userId - 用户ID（可选，不传则获取当前用户）
   * @returns {Promise<Object>}
   */
  getProfile: async (userId) => {
    console.log('\n📡 调用 getProfile API...');
    console.log('   userId:', userId || '当前用户');
    
    let response;
    if (userId) {
      // 获取其他用户的资料
      console.log('   请求 URL:', `${API_ENDPOINTS.USER.PROFILE}/${userId}`);
      response = await apiClient.get(`${API_ENDPOINTS.USER.PROFILE}/${userId}`);
    } else {
      // 获取当前用户的详细信息
      console.log('   请求 URL:', API_ENDPOINTS.USER.PROFILE_ME);
      response = await apiClient.get(API_ENDPOINTS.USER.PROFILE_ME);
    }
    
    console.log('\n📥 /app/user/profile/me 接口返回数据:');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(JSON.stringify(response, null, 2));
    console.log('─────────────────────────────────────────────────────────────────');
    
    if (response && response.data) {
      console.log('\n📊 用户数据字段详情:');
      console.log('   userId:', response.data.userId);
      console.log('   username:', response.data.username, '(用户名)');
      console.log('   usernameLastModified:', response.data.usernameLastModified, '(用户名上次修改时间)');
      console.log('   nickName:', response.data.nickName);
      console.log('   email:', response.data.email);
      console.log('   phonenumber:', response.data.phonenumber);
      console.log('   avatar:', response.data.avatar);
      console.log('   signature:', response.data.signature);
      console.log('   profession:', response.data.profession);
      console.log('   location:', response.data.location);
      console.log('   sex:', response.data.sex);
      console.log('   passwordChanged:', response.data.passwordChanged, '(是否修改过密码)');
    }
    
    return response;
  },

  /**
   * 更新用户资料
   * @param {Object} data - 用户资料
   * @returns {Promise<Object>}
   */
  updateProfile: (data) => {
    return apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  },

  /**
   * 修改用户名
   * @param {string} username - 新用户名
   * @returns {Promise<Object>}
   */
  updateUsername: async (username) => {
    console.log('\n📡 调用 updateUsername API...');
    console.log('   新用户名:', username);
    console.log('   请求 URL:', API_ENDPOINTS.USER.UPDATE_USERNAME);
    
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_USERNAME, { username });
    
    console.log('\n📥 /app/user/profile/username 接口返回数据:');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(JSON.stringify(response, null, 2));
    console.log('─────────────────────────────────────────────────────────────────');
    
    return response;
  },

  /**
   * 上传头像
   * @param {string} imageUri - 图片的本地 URI
   * @returns {Promise<Object>}
   */
  uploadAvatar: async (imageUri) => {
    console.log('🔧 准备上传头像:');
    console.log('   imageUri:', imageUri);
    
    // 从 URI 中提取文件名和扩展名
    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    
    // 判断文件类型
    let fileType = 'image/jpeg'; // 默认
    if (fileName.toLowerCase().endsWith('.png')) {
      fileType = 'image/png';
    } else if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) {
      fileType = 'image/jpeg';
    } else if (fileName.toLowerCase().endsWith('.gif')) {
      fileType = 'image/gif';
    } else if (fileName.toLowerCase().endsWith('.bmp')) {
      fileType = 'image/bmp';
    }
    
    // 创建 FormData
    const formData = new FormData();
    
    // 尝试不同的方式添加文件
    // 方式1：标准的 React Native FormData 格式
    const file = {
      uri: imageUri,
      type: fileType,
      name: fileName || 'avatar.jpg',
    };
    
    formData.append('avatarfile', file);
    
    console.log('📦 FormData 已创建:');
    console.log('   文件名:', fileName);
    console.log('   文件类型:', fileType);
    console.log('   URI:', imageUri);
    console.log('   File对象:', JSON.stringify(file));
    
    try {
      // 发送 multipart/form-data 请求
      const response = await apiClient.post(API_ENDPOINTS.USER.AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 不设置 Accept，使用默认值
        },
        transformRequest: (data) => data, // 不转换数据
        timeout: 60000, // 60秒超时（上传文件需要更长时间）
      });
      
      console.log('✅ 头像上传成功');
      console.log('📥 响应数据:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('❌ 头像上传失败:', error);
      console.error('❌ 错误类型:', error.constructor.name);
      console.error('❌ 错误消息:', error.message);
      
      if (error.response) {
        console.error('❌ 响应状态:', error.response.status);
        console.error('❌ 响应数据:', JSON.stringify(error.response.data, null, 2));
        console.error('❌ 响应头:', JSON.stringify(error.response.headers, null, 2));
      }
      
      // 提供更友好的错误信息
      if (error.message === 'Network Error' || error.message.includes('网络')) {
        throw new Error('网络连接失败，请检查网络后重试');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('上传超时，请检查网络或选择更小的图片');
      } else if (error.response) {
        const errorMsg = error.response.data?.msg || error.response.data?.message || '上传失败';
        throw new Error(errorMsg);
      } else {
        throw new Error('上传失败：' + error.message);
      }
    }
  },

  /**
   * 关注用户
   * @param {string} userId - 要关注的用户ID
   * @returns {Promise<Object>}
   */
  followUser: (userId) => {
    return apiClient.post(API_ENDPOINTS.USER.FOLLOW, { userId });
  },

  /**
   * 取消关注用户
   * @param {string} userId - 要取消关注的用户ID
   * @returns {Promise<Object>}
   */
  unfollowUser: (userId) => {
    return apiClient.post(API_ENDPOINTS.USER.UNFOLLOW, { userId });
  },

  /**
   * 获取粉丝列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  getFollowers: (params) => {
    return apiClient.get(API_ENDPOINTS.USER.FOLLOWERS, { params });
  },

  /**
   * 获取关注列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  getFollowing: (params) => {
    return apiClient.get(API_ENDPOINTS.USER.FOLLOWING, { params });
  },
};

export default userApi;
