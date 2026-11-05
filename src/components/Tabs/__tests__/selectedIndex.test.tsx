import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// RTL 12 renders through the legacy `react-dom` entry, which React 19 removed.
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

import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import Tabs from '../index';

const router = {
  isReady: true,
  query: {} as Record<string, string>,
  pathname: '/page',
  asPath: '/page',
};

jest.mock('next/router', () => ({
  useRouter: () => router,
}));

const draw = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Tabs selectedIndex', () => {
  beforeEach(() => {
    router.isReady = true;
    router.query = {};
  });

  it('follows the URL when the parent does not own the tab', () => {
    router.query = { tab: 'Second' };
    draw(
      <Tabs headers={['First', 'Second']}>
        <span>body</span>
      </Tabs>,
    );
    expect(screen.getByTestId('tab-content-1')).toBeInTheDocument();
  });

  it('stays on the first tab until the router is ready', () => {
    router.isReady = false;
    router.query = { tab: 'Second' };
    draw(
      <Tabs headers={['First', 'Second']}>
        <span>body</span>
      </Tabs>,
    );
    expect(screen.getByTestId('tab-content-0')).toBeInTheDocument();
  });

  it('highlights nothing while the parent has not read the URL', () => {
    router.query = { tab: 'Second' };
    draw(
      <Tabs headers={['First', 'Second']} selectedIndex={-1}>
        <span>body</span>
      </Tabs>,
    );
    expect(screen.getByTestId('tab-content--1')).toBeInTheDocument();
  });

  it('keeps the parent highlight when a tab is clicked', () => {
    const onClick = jest.fn();
    draw(
      <Tabs headers={['First', 'Second']} selectedIndex={1} onClick={onClick}>
        <span>body</span>
      </Tabs>,
    );
    fireEvent.click(screen.getByText('First'));
    expect(onClick).toHaveBeenCalledWith('First', 0);
    expect(screen.getByTestId('tab-content-1')).toBeInTheDocument();
  });

  it('selects the clicked tab when nobody handles the click', () => {
    draw(
      <Tabs headers={['First', 'Second']}>
        <span>body</span>
      </Tabs>,
    );
    fireEvent.click(screen.getByText('Second'));
    expect(screen.getByTestId('tab-content-1')).toBeInTheDocument();
  });
});
