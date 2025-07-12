import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';

import enHelp from '../locales/en-help.json';
import esHelp from '../locales/es-help.json';
import frHelp from '../locales/fr-help.json';

import enFHIR from '../locales/fhir/en.fhir.json';
import esFHIR from '../locales/fhir/es.fhir.json';
import frFHIR from '../locales/fhir/fr.fhir.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    ns: ['translation', 'help', 'fhir'],
    defaultNS: 'translation',
    resources: {
      en: {
        translation: en,
        help: enHelp,
        fhir: enFHIR
      },
      es: {
        translation: es,
        help: esHelp,
        fhir: esFHIR
      },
      fr: {
        translation: fr,
        help: frHelp,
        fhir: frFHIR
      }
    }
  });

export default i18n;
