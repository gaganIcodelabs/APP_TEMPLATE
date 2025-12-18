import { createInstance } from 'i18next';
import en from '@locales/en.json';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance();

const resources = {
  en: {
    translation: en,
  },
};

i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

export const mergeTranslations = (translations: any) => ({
  ...en,
  ...translations,
});
