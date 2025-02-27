import React, { createContext, useContext, useLayoutEffect, useState } from 'react';

const APPLICATION_NAME = 'project-management-theme';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lightTheme: Theme = 'light';
  const darkTheme: Theme = 'dark';

  const getDataTheme = (theme: Theme) => theme === darkTheme ? darkTheme : lightTheme;
  const getToggledTheme = (theme: Theme) => theme === darkTheme ? lightTheme : darkTheme;

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(APPLICATION_NAME);
      if (savedTheme) return savedTheme as Theme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
    }
    return lightTheme;
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', getDataTheme(theme));
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = getToggledTheme(theme);
    setTheme(newTheme);
    localStorage.setItem(APPLICATION_NAME, getDataTheme(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
