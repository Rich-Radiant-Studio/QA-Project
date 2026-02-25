import { useState, useCallback } from 'react';
import ErrorHandler from '../utils/errorHandler';

/**
 * API 请求 Hook
 * 提供 loading 状态和错误处理
 * 
 * @example
 * const { data, loading, error, execute } = useApi(questionApi.getQuestions);
 * 
 * useEffect(() => {
 *   execute({ page: 1, pageSize: 10 });
 * }, []);
 */
const useApi = (apiFunc, options = {}) => {
  const {
    initialData = null,
    onSuccess = null,
    onError = null,
    showErrorAlert = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFunc(...args);
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      setError(err);

      if (showErrorAlert) {
        ErrorHandler.handleApiError(err);
      }

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, onSuccess, onError, showErrorAlert]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
};

export default useApi;
