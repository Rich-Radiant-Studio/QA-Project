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
   * 上传头像
   * @param {string} base64Image - Base64 编码的图片字符串 (data:image/...;base64,...)
   * @param {string} imageUri - 图片的本地 URI
   * @returns {Promise<Object>}
   */
  uploadAvatar: async (base64Image, imageUri) => {
    // 从 base64 字符串中提取纯 Base64 数据（去掉 data:image 前缀）
    const matches = base64Image.match(/^data:image\/\w+;base64,(.+)$/);
    const base64Data = matches ? matches[1] : base64Image;
    
    console.log('🔧 准备上传数据:');
    console.log('   base64Data length:', base64Data.length);
    console.log('   base64Data 前50字符:', base64Data.substring(0, 50));
    
    // 创建 FormData，直接放入 Base64 字符串
    const formData = new FormData();
    formData.append('avatarfile', base64Data);
    
    console.log('📦 FormData 已创建（包含 Base64 字符串）');
    
    // 发送 multipart/form-data 请求
    // 重要：删除默认的 Content-Type，让浏览器/axios 自动设置正确的 boundary
    return apiClient.post(API_ENDPOINTS.USER.AVATAR, formData, {
      headers: {
        'Content-Type': undefined,  // 删除默认的 application/json
      },
      transformRequest: [(data) => data],  // 不要转换 FormData
    });
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
