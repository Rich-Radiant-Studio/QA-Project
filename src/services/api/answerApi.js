import apiClient from './apiClient';
import { API_ENDPOINTS, replaceUrlParams } from '../../config/api';

/**
 * 回答相关 API
 */
const answerApi = {
  /**
   * 获取回答列表
   * @param {Object} params - 查询参数
   * @param {string} params.questionId - 问题ID
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  getAnswers: (params) => {
    return apiClient.get(API_ENDPOINTS.ANSWER.LIST, { params });
  },

  /**
   * 获取回答详情
   * @param {string} answerId - 回答ID
   * @returns {Promise<Object>}
   */
  getAnswerDetail: (answerId) => {
    const url = replaceUrlParams(API_ENDPOINTS.ANSWER.DETAIL, { id: answerId });
    return apiClient.get(url);
  },

  /**
   * 创建回答
   * @param {Object} data - 回答数据
   * @param {string} data.questionId - 问题ID
   * @param {string} data.content - 回答内容
   * @param {Array} data.images - 图片列表
   * @returns {Promise<Object>}
   */
  createAnswer: (data) => {
    return apiClient.post(API_ENDPOINTS.ANSWER.CREATE, data);
  },

  /**
   * 更新回答
   * @param {string} answerId - 回答ID
   * @param {Object} data - 更新的数据
   * @returns {Promise<Object>}
   */
  updateAnswer: (answerId, data) => {
    const url = replaceUrlParams(API_ENDPOINTS.ANSWER.UPDATE, { id: answerId });
    return apiClient.put(url, data);
  },

  /**
   * 删除回答
   * @param {string} answerId - 回答ID
   * @returns {Promise<Object>}
   */
  deleteAnswer: (answerId) => {
    const url = replaceUrlParams(API_ENDPOINTS.ANSWER.DELETE, { id: answerId });
    return apiClient.delete(url);
  },

  /**
   * 采纳回答
   * @param {string} answerId - 回答ID
   * @returns {Promise<Object>}
   */
  adoptAnswer: (answerId) => {
    const url = replaceUrlParams(API_ENDPOINTS.ANSWER.ADOPT, { id: answerId });
    return apiClient.post(url);
  },

  /**
   * 点赞回答
   * @param {string} answerId - 回答ID
   * @returns {Promise<Object>}
   */
  likeAnswer: (answerId) => {
    const url = replaceUrlParams(API_ENDPOINTS.ANSWER.LIKE, { id: answerId });
    return apiClient.post(url);
  },
};

export default answerApi;
