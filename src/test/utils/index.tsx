import React from 'react';
import { render, RenderResult} from '@testing-library/react';

import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';


export const renderWithTheme = (children: JSX.Element): RenderResult => {
  return render(
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
};

export const getMonthWithYear = (month: string, months: string[]): string => {
  const date = new Date();
  switch(month) {
    case 'lastMonth':
      return `${months[date.getMonth() - 1]} ${date.getFullYear()}`;
    case 'nextMonth':
      return `${months[date.getMonth() + 1]} ${date.getFullYear()}`;
    default:
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
};