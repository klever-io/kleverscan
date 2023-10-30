//create context

import theme from '@/styles/theme';
import darkTheme from '@/styles/theme/dark';
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

interface ITheme {
  toggleDarkTheme: () => void;
  isDarkTheme: boolean;
  theme: typeof theme;
}

export const ThemeContext = createContext({} as ITheme);

const setDarkThemePreference = (isDark: boolean) => {
  localStorage.setItem('isDarkTheme', String(isDark));
};

export const InternalThemeProvider: React.FC = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const storedIsDarkTheme = localStorage.getItem('isDarkTheme');
    if (storedIsDarkTheme === 'true') {
      setIsDarkTheme(true);
    } else if (storedIsDarkTheme === null) {
      const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setDarkThemePreference(prefersDarkMode);
      setIsDarkTheme(prefersDarkMode);
    }
  }, []);

  const toggleDarkTheme = () => {
    const newIsDarkTheme = !isDarkTheme;
    setIsDarkTheme(newIsDarkTheme);
    setDarkThemePreference(newIsDarkTheme);
  };

  const values: ITheme = {
    toggleDarkTheme,
    isDarkTheme,
    theme: isDarkTheme ? darkTheme : theme,
  };

  return (
    <ThemeContext.Provider value={values}>
      <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ITheme => useContext(ThemeContext);
