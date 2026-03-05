import contentApiClient from './contentApiClient';
import { API_ENDPOINTS } from '../../config/api';

/**
 * 分类相关 API
 */
const categoryApi = {
  /**
   * 获取分类列表
   * @param {Object} params - 查询参数
   * @param {Object} params.category - 分类查询条件
   * @param {number} params.pageNum - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  getCategoryList: (params = {}) => {
    const requestParams = {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 20,
      ...params.category,
    };
    
    // 使用内容服务的 apiClient
    return contentApiClient.get(API_ENDPOINTS.CATEGORY.LIST, { params: requestParams });
  },
};

export default categoryApi;
