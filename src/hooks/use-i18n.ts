import { useState, useCallback, useEffect } from 'react';
import { Language, defaultLanguage, t as translate } from '../lib/i18n';

export function useI18n() {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Load language from localStorage or browser preference
    const stored = localStorage.getItem('language') as Language;
    const browserLang = navigator.language.split('-')[0] as Language;
    
    if (stored && ['es', 'en'].includes(stored)) {
      setLanguage(stored);
    } else if (['es', 'en'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translate(key, params, language);
  }, [language]);

  return {
    language,
    changeLanguage,
    t,
  };
}