import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language, languages, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof import('@/lib/i18n').translations['zh-TW']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh-TW');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && languages.some(l => l.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: keyof typeof import('@/lib/i18n').translations['zh-TW']) => {
    return getTranslation(language, key);
  };

  if (!isLoaded) {
    return <div>{/* Loading */}</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
