import apiClient from './apiClient';
import contentApiClient from './contentApiClient';
import { API_ENDPOINTS, replaceUrlParams } from '../../config/api';

/**
 * 问题相关 API
 */
const questionApi = {
  /**
   * 获取问题列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.sort - 排序方式
   * @returns {Promise<Object>}
   */
  getQuestions: (params) => {
    return apiClient.get(API_ENDPOINTS.QUESTION.LIST, { params });
  },

  /**
   * 获取问题详情
   * @param {string} questionId - 问题ID
   * @returns {Promise<Object>}
   */
  getQuestionDetail: (questionId) => {
    const url = replaceUrlParams(API_ENDPOINTS.QUESTION.DETAIL, { id: questionId });
    return apiClient.get(url);
  },

  /**
   * 创建问题
   * @param {Object} data - 问题数据
   * @param {number} data.type - 问题类型：0=公开问题，1=悬赏问题，2=定向问题
   * @param {number} data.categoryId - 二级分类ID（必填）
   * @param {string} data.title - 问题标题（必填，5-50字）
   * @param {string} data.description - 问题描述（必填）
   * @param {string} data.subQuestions - 子问题（可选）
   * @param {boolean} data.asDraft - 是否保存为草稿
   * @param {number} data.bountyAmount - 悬赏金额（type=1或2时必填，单位：分）
   * @param {number} data.payViewAmount - 付费查看金额（单位：分）
   * @param {string} data.location - 位置信息（可选）
   * @param {number} data.visibilityScope - 可见范围：0=所有人，1=仅关注我的人，2=仅自己
   * @param {number} data.isAnonymous - 是否匿名：0=不匿名，1=匿名
   * @param {number} data.isPublicAnswer - 是否公开答案：0=不公开，1=公开
   * @param {number} data.teamId - 团队ID（以团队身份发布时必填）
   * @param {Array<number>} data.expertIds - 专家ID列表（type=2时必填）
   * @param {Array<number>} data.topicIds - 已有话题ID列表（可选）
   * @param {Array<string>} data.topicNames - 新话题名称列表（可选）
   * @param {Array<string>} data.imageUrls - 图片URL列表（最多9张）
   * @returns {Promise<Object>}
   */
  createQuestion: (data) => {
    return contentApiClient.post(API_ENDPOINTS.QUESTION.CREATE, data);
  },

  /**
   * 更新问题
   * @param {string} questionId - 问题ID
   * @param {Object} data - 更新的数据
   * @returns {Promise<Object>}
   */
  updateQuestion: (questionId, data) => {
    const url = replaceUrlParams(API_ENDPOINTS.QUESTION.UPDATE, { id: questionId });
    return apiClient.put(url, data);
  },

  /**
   * 删除问题
   * @param {string} questionId - 问题ID
   * @returns {Promise<Object>}
   */
  deleteQuestion: (questionId) => {
    const url = replaceUrlParams(API_ENDPOINTS.QUESTION.DELETE, { id: questionId });
    return apiClient.delete(url);
  },

  /**
   * 获取热门问题
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>}
   */
  getHotQuestions: (params) => {
    return apiClient.get(API_ENDPOINTS.QUESTION.HOT, { params });
  },

  /**
   * 获取问题排行榜
   * @param {Object} params - 查询参数
   * @param {string} params.type - 排行类型（views/answers/rewards）
   * @returns {Promise<Object>}
   */
  getQuestionRanking: (params) => {
    return apiClient.get(API_ENDPOINTS.QUESTION.RANKING, { params });
  },

  /**
   * 搜索问题
   * @param {Object} params - 搜索参数
   * @param {string} params.keyword - 关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  searchQuestions: (params) => {
    return apiClient.get(API_ENDPOINTS.QUESTION.SEARCH, { params });
  },
};

export default questionApi;
