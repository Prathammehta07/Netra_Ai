import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import gu from '../i18n/gu.json';
import mr from '../i18n/mr.json';
import ta from '../i18n/ta.json';
import te from '../i18n/te.json';
import kn from '../i18n/kn.json';
import ml from '../i18n/ml.json';
import bn from '../i18n/bn.json';

export type SupportedLanguage = 'en' | 'hi' | 'gu' | 'mr' | 'ta' | 'te' | 'kn' | 'ml' | 'bn';

const translations: Record<SupportedLanguage, any> = {
  en, hi, gu, mr, ta, te, kn, ml, bn
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  gu: { label: 'Gujarati', native: 'ગુજરાતી' },
  mr: { label: 'Marathi', native: 'मराठी' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
  ml: { label: 'Malayalam', native: 'മലയാളം' },
  bn: { label: 'Bengali', native: 'বাংলা' }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('netraai_lang') || localStorage.getItem('swasthmitra_lang');
    return (saved as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('netraai_lang', lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current = translations[language] || translations.en;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
