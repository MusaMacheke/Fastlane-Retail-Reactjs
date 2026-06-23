import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../ui-translations';

/**
 * Custom hook for translations
 * Usage: const t = useTranslation(); t('nav.shop')
 */
const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (path) => {
    return getTranslation(language, path);
  };
  
  return { t, language };
};

export default useTranslation;