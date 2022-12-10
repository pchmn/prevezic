import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { default as enTranslations } from './en.json';
import { default as frTranslations } from './fr.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

console.log(localStorage.getItem('language')?.replace(/['"]+/g, ''));
i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language')?.replace(/['"]+/g, '') || 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
