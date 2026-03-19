import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Theme = 'dark' | 'light' | 'system';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('language') || 'zh';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove('light', 'dark');
      
      let effectiveTheme: 'light' | 'dark';
      if (currentTheme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        effectiveTheme = currentTheme;
      }
      
      root.classList.add(effectiveTheme);
      root.style.colorScheme = effectiveTheme;
      root.setAttribute('data-theme', effectiveTheme);
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes if in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language, i18n]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLang: string) => {
    setLanguageState(newLang);
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
