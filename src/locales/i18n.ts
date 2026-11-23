import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import global_en from "../locales/en/globals.json";
import global_id from "../locales/id/globals.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "global";
    resources: {
      global: typeof global_en;
    };
  }
}

i18next.use(LanguageDetector).init({
  supportedLngs: ["id", "en"],
  interpolation: { escapeValue: false },
  fallbackLng: "en",
  detection: {
    // Detection options
    order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
    caches: ["localStorage", "cookie"], // Cache user language
  },
  resources: {
    en: {
      global: global_en,
    },
    id: {
      global: global_id,
    },
  },
});

export function i18nInit() {
  return i18next;
}

export default i18next;
