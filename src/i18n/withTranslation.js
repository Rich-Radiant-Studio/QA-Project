import React from 'react';
import i18n from './index';

// HOC 高阶组件，为任何组件注入翻译功能
export const withTranslation = (Component) => {
  return (props) => {
    const t = (key) => i18n.t(key);
    return <Component {...props} t={t} i18n={i18n} />;
  };
};

// Hook 方式使用翻译
export const useTranslation = () => {
  const t = (key) => i18n.t(key);
  return { t, i18n };
};

export default withTranslation;
