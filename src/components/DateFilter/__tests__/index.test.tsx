import theme from '@/styles/theme';
import { setQueryAndRouter } from '@/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routerQuery: Record<string, string> = {};

jest.mock('next/router', () => ({
  useRouter: () => ({ isReady: true, query: routerQuery, push: jest.fn() }),
}));

jest.mock('@/utils', () => ({
  setQueryAndRouter: jest.fn(),
}));

// SVG imports resolve to an object under Jest, which React cannot render.
jest.mock('@/assets/calendar', () => ({
  ArrowLeft: () => <svg data-testid="arrow-left" />,
  ArrowRight: () => <svg data-testid="arrow-right" />,
  WarningIcon: () => <svg data-testid="warning" />,
}));

jest.mock('@/assets/icons', () => ({
  Calendar: () => <svg data-testid="calendar" />,
}));

jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  const client = jest.requireActual('react-dom/client');
  const ReactLib = jest.requireActual('react');
  const roots = new Map<
    Element,
    { render: (ui: React.ReactNode) => void; unmount: () => void }
  >();

  return {
    ...actual,
    render: (ui: React.ReactNode, container: Element) => {
      let root = roots.get(container);
      if (!root) {
        root = client.createRoot(container);
        roots.set(container, root);
      }
      ReactLib.act(() => {
        root.render(ui);
      });
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;
      ReactLib.act(() => {
        root.unmount();
      });
      roots.delete(container);
      return true;
    },
  };
});

import DateFilter from '../index';

const mockedSetQuery = setQueryAndRouter as jest.Mock;

const renderFilter = (query: Record<string, string>) => {
  Object.keys(routerQuery).forEach(key => delete routerQuery[key]);
  Object.assign(routerQuery, query);

  render(
    <ThemeProvider theme={theme}>
      <DateFilter />
    </ThemeProvider>,
  );
};

/** Opens the calendar, picks the first day of the month and confirms. */
const pickADayAndConfirm = () => {
  fireEvent.focus(screen.getByPlaceholderText('All'));
  fireEvent.click(screen.getAllByText('1')[0]);
  fireEvent.click(screen.getByText('Confirm'));
};

describe('DateFilter page reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns to the first page when a range is confirmed', () => {
    renderFilter({ page: '5' });

    pickADayAndConfirm();

    const [query] = mockedSetQuery.mock.calls[0];
    expect(query.page).toBe('1');
    expect(query.startdate).toBeDefined();
    expect(query.enddate).toBeDefined();
  });

  it('returns to the first page when the range is cleared', () => {
    renderFilter({ page: '5' });

    pickADayAndConfirm();
    mockedSetQuery.mockClear();

    // The clear control only exists once a range has been applied.
    fireEvent.click(screen.getByTestId('date-filter-clear'));

    const [query] = mockedSetQuery.mock.calls[0];
    expect(query.page).toBe('1');
    expect(query).not.toHaveProperty('startdate');
    expect(query).not.toHaveProperty('enddate');
  });
});
