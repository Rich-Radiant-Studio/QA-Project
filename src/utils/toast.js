/**
 * Toast 工具类
 * 提供全局 Toast 提示功能
 */

let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

export const showToast = (message, type = 'error', duration = 2000) => {
  if (toastRef) {
    toastRef.show(message, type, duration);
  } else {
    console.warn('Toast ref not set. Please add ToastContainer to your app.');
  }
};

export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration),
};
