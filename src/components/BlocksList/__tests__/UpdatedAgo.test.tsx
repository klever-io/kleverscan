import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** Resolved against the shipped English bundle, so a missing key fails here
 *  rather than rendering "Cards.UpdatedAgo" on the page: this repo's dev server
 *  does not reload locale files, so that mistake survives a local check. */
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/common.json',
  );

  const translate = (
    key: string,
    options?: { defaultValue?: string; age?: string },
  ): string => {
    const path = key.includes(':') ? key.split(':')[1] : key;
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundle,
      );
    const template = typeof value === 'string' ? value : options?.defaultValue;
    if (!template) throw new Error(`missing common locale key: ${key}`);
    return template.replace('{{age}}', options?.age ?? '');
  };

  return { useTranslation: () => ({ t: translate }) };
});

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

import { act } from 'react';
import UpdatedAgo from '../UpdatedAgo';

const NOW = Date.UTC(2026, 7, 28, 12, 0, 0);

const renderAt = (at: number) =>
  render(
    <ThemeProvider theme={theme}>
      <UpdatedAgo at={at} />
    </ThemeProvider>,
  );

describe('UpdatedAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('counts up while the data stands still', () => {
    renderAt(NOW - 3000);

    expect(screen.getByTestId('blocks-updated-ago').textContent).toBe(
      'Updated 3 secs ago',
    );

    // advanceTimersByTime moves the clock itself; setting it as well counted
    // the thirty seconds twice and read as a minute.
    act(() => {
      jest.advanceTimersByTime(30_000);
    });

    expect(screen.getByTestId('blocks-updated-ago').textContent).toBe(
      'Updated 33 secs ago',
    );
  });

  // The opposite of the line's purpose: an age that keeps climbing past a
  // refetch would report the figures as older than they are.
  it('drops back to zero when fresh data arrives', () => {
    const { rerender } = renderAt(NOW - 60_000);

    expect(screen.getByTestId('blocks-updated-ago').textContent).toBe(
      'Updated 1 min ago',
    );

    act(() => {
      rerender(
        <ThemeProvider theme={theme}>
          <UpdatedAgo at={NOW} />
        </ThemeProvider>,
      );
    });

    expect(screen.getByTestId('blocks-updated-ago').textContent).toBe(
      // getAge only pluralises above one, so zero is "0 sec".
      'Updated 0 sec ago',
    );
  });

  it('renders nothing before any data has arrived', () => {
    const { container } = renderAt(0);

    expect(container.textContent).toBe('');
  });

  it('stops its interval on unmount, so a navigation leaves no timer behind', () => {
    const { unmount } = renderAt(NOW - 1000);
    const before = jest.getTimerCount();

    unmount();

    expect(before).toBeGreaterThan(0);
    expect(jest.getTimerCount()).toBe(0);
  });
});
