import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Toast from './Toast';

/**
 * Toast 容器组件
 * 用于在应用中显示 Toast 提示
 */
const ToastContainer = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error');
  const [duration, setDuration] = useState(2000);

  useImperativeHandle(ref, () => ({
    show: (msg, toastType = 'error', toastDuration = 2000) => {
      setMessage(msg);
      setType(toastType);
      setDuration(toastDuration);
      setVisible(true);
    },
  }));

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Toast
      visible={visible}
      message={message}
      type={type}
      duration={duration}
      onHide={handleHide}
    />
  );
});

export default ToastContainer;
