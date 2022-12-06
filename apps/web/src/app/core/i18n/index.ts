import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { default as enTranslations } from './en.json';

const resources = {
  en: {
    translation: enTranslations,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
