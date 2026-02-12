import i18n from './index';

export const useTranslation = () => {
  const t = (key) => {
    return i18n.t(key);
  };
  
  return { t, i18n };
};

export default useTranslation;
