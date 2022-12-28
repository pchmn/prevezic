import 'react-i18next';

import en from './core/i18n/en.json';
import fr from './core/i18n/fr.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: 'en';
    // custom resources type
    resources: {
      fr: typeof fr;
      en: typeof en;
    };
  }
}
