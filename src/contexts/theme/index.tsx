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

export const InternalThemeProvider: React.FC = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const isDarkTheme = localStorage.getItem('isDarkTheme');
    if (isDarkTheme === 'true') {
      setIsDarkTheme(true);
    } else if (isDarkTheme === null) {
      const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setIsDarkTheme(prefersDarkMode);
    }
  }, []);

  const toggleDarkTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('isDarkTheme', String(!isDarkTheme));
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
