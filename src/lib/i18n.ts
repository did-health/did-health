import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../locales/en.json'
// Import more languages as needed
import es from '../locales/es.json' // Example for Spanish
import fr from '../locales/fr.json' // Example for French

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
  })

export default i18n
