import i18n from './index';

export const useTranslation = () => {
  const t = (key) => i18n.t(key);
  
  return { t, i18n };
};

export default useTranslation;
