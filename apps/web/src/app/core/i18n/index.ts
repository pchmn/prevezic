import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './en.json';
import frTranslations from './fr.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language')?.replace(/['"]+/g, '') || 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
