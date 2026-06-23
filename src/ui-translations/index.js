import en from './en.json';
import zu from './zu.json';
import xh from './xh.json';
import af from './af.json';
import nso from './nso.json';
import tn from './tn.json';
import st from './st.json';
import ts from './ts.json';
import ss from './ss.json';
import ve from './ve.json';
import nr from './nr.json';

export const uiTranslations = {
  'English': en,
  'Zulu': zu,
  'Xhosa': xh,
  'Afrikaans': af,
  'Sepedi': nso,
  'Setswana': tn,
  'Sesotho': st,
  'Tsonga': ts,
  'Swati': ss,
  'Venda': ve,
  'Ndebele': nr,
};

export const supportedLanguages = [
  { code: 'English', name: 'English', flag: '🇬🇧' },
  { code: 'Zulu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'Xhosa', name: 'isiXhosa', flag: '🇿🇦' },
  { code: 'Afrikaans', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'Sepedi', name: 'Sepedi', flag: '🇿🇦' },
  { code: 'Setswana', name: 'Setswana', flag: '🇿🇦' },
  { code: 'Sesotho', name: 'Sesotho', flag: '🇿🇦' },
  { code: 'Tsonga', name: 'Xitsonga', flag: '🇿🇦' },
  { code: 'Swati', name: 'siSwati', flag: '🇿🇦' },
  { code: 'Venda', name: 'Tshivenda', flag: '🇿🇦' },
  { code: 'Ndebele', name: 'isiNdebele', flag: '🇿🇦' },
];

/**
 * Hook to get translated text
 * Usage: const t = useTranslation(); t('nav.shop') returns "Shop" or translated version
 */
export const getTranslation = (language, path) => {
  const keys = path.split('.');
  let value = uiTranslations[language] || uiTranslations['English'];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to English
      value = uiTranslations['English'];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return path; // Return path as last resort
        }
      }
      return value;
    }
  }
  
  return value;
};