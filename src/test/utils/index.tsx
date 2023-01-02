import { MobileProvider } from '@/contexts/mobile';
import { InternalThemeProvider } from '@/contexts/theme';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';

export const renderWithTheme = (children: JSX.Element): RenderResult => {
  return render(
    <MobileProvider>
      <InternalThemeProvider>{children}</InternalThemeProvider>
    </MobileProvider>,
  );
};

export const getMonthWithYear = (month: string, months: string[]): string => {
  const date = new Date();
  switch (month) {
    case 'lastMonth':
      return `${months[date.getMonth() !== 0 ? date.getMonth() - 1 : 11]} ${
        date.getMonth() !== 0 ? date.getFullYear() : date.getFullYear() - 1
      }`;
    case 'nextMonth':
      return `${months[date.getMonth() !== 11 ? date.getMonth() + 1 : 0]} ${
        date.getMonth() !== 11 ? date.getFullYear() : date.getFullYear() + 1
      }`;
    default:
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
};
