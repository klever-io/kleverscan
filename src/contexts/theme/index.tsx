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

  const setBodyColor = () => {
    const body = document.getElementsByTagName('body')[0];

    body.style.backgroundColor = isDarkTheme
      ? darkTheme.navbar.background
      : theme.background;
  };

  useEffect(() => {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    setIsDarkTheme(isDarkTheme);
    setBodyColor();
  }, []);

  const toggleDarkTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('isDarkTheme', String(!isDarkTheme));
    setBodyColor();
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
