import { PropsWithChildren } from 'react';
import theme from '@/styles/theme';
import darkTheme from '@/styles/theme/dark';
import { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { setCookie, getCookie } from 'cookies-next';
import isPropValid from '@emotion/is-prop-valid';

interface ITheme {
  toggleDarkTheme: () => void;
  isDarkTheme: boolean;
  theme: typeof theme;
}

export const ThemeContext = createContext({} as ITheme);

const setDarkThemePreference = (isDark: boolean) => {
  setCookie('isDarkTheme', String(isDark));
};

interface InternalThemeProviderProps {
  initialDarkTheme?: boolean;
}

export const InternalThemeProvider: React.FC<
  PropsWithChildren<InternalThemeProviderProps>
> = ({ children, initialDarkTheme = false }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(initialDarkTheme);

  useEffect(() => {
    const storedIsDarkTheme = getCookie('isDarkTheme');

    if (storedIsDarkTheme === undefined) {
      const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setDarkThemePreference(prefersDarkMode);
      setIsDarkTheme(prefersDarkMode);
    }
  }, [initialDarkTheme]);

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

  const shouldForwardProp = (propName: string, target: any) => {
    return typeof target === 'string' ? isPropValid(propName) : true;
  };

  return (
    <ThemeContext.Provider value={values}>
      <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
        <StyleSheetManager
          enableVendorPrefixes
          shouldForwardProp={shouldForwardProp}
        >
          {children}
        </StyleSheetManager>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ITheme => useContext(ThemeContext);
