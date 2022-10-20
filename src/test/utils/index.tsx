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
      return `${months[date.getMonth() - 1]} ${date.getFullYear()}`;
    case 'nextMonth':
      return `${months[date.getMonth() + 1]} ${date.getFullYear()}`;
    default:
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
};
