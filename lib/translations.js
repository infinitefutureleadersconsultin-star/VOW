import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('vow_language') || 'en';
    setLanguage(saved);
    loadTranslations(saved);
  }, []);

  const loadTranslations = async (lang) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English
      const fallback = await fetch('/locales/en.json');
      setTranslations(await fallback.json());
    }
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('vow_language', newLang);
    loadTranslations(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }

  const { translations } = context;

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key; // Return key if translation missing
    }
    
    return value;
  };

  return { ...context, t };
}
