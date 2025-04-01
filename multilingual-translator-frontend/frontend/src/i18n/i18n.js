import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './translations/en.json';
import translationZH from './translations/zh.json';
import translationKO from './translations/ko.json';
import translationJA from './translations/ja.json';

// Resources object with translations
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  },
  ko: {
    translation: translationKO
  },
  ja: {
    translation: translationJA
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

export default i18n;
