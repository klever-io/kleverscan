import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Keys are resolved from the shipped bundles rather than echoed back, so a key
 * the strip asks for that nobody ever added fails this suite instead of
 * rendering "accounts:List.New24h" at a reader. Plural forms go through the
 * same `_one`/`_other` selection i18next applies.
 */
jest.mock('next-i18next', () => {
  const bundles: Record<string, unknown> = {
    accounts: jest.requireActual('../../../../public/locales/en/accounts.json'),
    common: jest.requireActual('../../../../public/locales/en/common.json'),
  };

  const lookup = (namespace: string, path: string): unknown =>
    path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundles[namespace],
      );

  const translate = (
    key: string,
    options?: Record<string, unknown>,
  ): string => {
    const [namespace, path] = key.includes(':')
      ? key.split(':')
      : ['accounts', key];

    let value = lookup(namespace, path);
    if (typeof value !== 'string' && options && 'count' in options) {
      const suffix = options.count === 1 ? '_one' : '_other';
      value = lookup(namespace, `${path}${suffix}`);
    }
    if (typeof value !== 'string') {
      throw new Error(`missing ${namespace} locale key: ${key}`);
    }
    return value.replace(/\{\{(\w+)\}\}/g, (whole, name) =>
      options && name in options ? String(options[name]) : whole,
    );
  };

  return { useTranslation: () => ({ t: translate }) };
});

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite in this repo carries the same createRoot shim.
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

const totalCall = jest.fn();
const createdCall = jest.fn();

jest.mock('@/services/requests/accounts', () => ({
  accountsTotalCall: () => totalCall(),
  accountsCreatedCall: (days: number) => createdCall(days),
}));

import AccountsSummary from '../Summary';

const totalResponse = (totalRecords: number) => ({
  data: { accounts: [] },
  pagination: { totalRecords },
  error: '',
  code: 'successful',
});

const seriesResponse = (counts: number[]) => ({
  data: { number_by_day: counts.map((doc_count, key) => ({ doc_count, key })) },
  error: '',
  code: 'successful',
});

const renderSummary = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false, gcTime: 0 } },
        })
      }
    >
      <ThemeProvider theme={theme}>
        <AccountsSummary />
      </ThemeProvider>
    </QueryClientProvider>,
  );

/** The loaded card, which the loading shape deliberately does not carry. */
const loaded = async (): Promise<HTMLElement> =>
  waitFor(() => screen.getByTestId('accounts-summary'));

describe('AccountsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    totalCall.mockResolvedValue(totalResponse(176197));
    createdCall.mockResolvedValue(seriesResponse([10, 9, 4, 82, 12, 8, 8]));
  });

  it('asks for a week in one request, not a day in a second one', async () => {
    renderSummary();
    await loaded();

    expect(createdCall).toHaveBeenCalledTimes(1);
    expect(createdCall).toHaveBeenCalledWith(7);
    expect(totalCall).toHaveBeenCalledTimes(1);
  });

  it('shows the total, the running day and the window total', async () => {
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('176,197');
    expect(card.textContent).toContain('10');
    // 10 + 9 + 4 + 82 + 12 + 8 + 8
    expect(card.textContent).toContain('133');
    expect(card.textContent).toContain('across 7 days');
  });

  it('reports the day-on-day change as a count, with its sign', async () => {
    renderSummary();
    const card = await loaded();

    // 10 today against 9 yesterday. A percentage would read "+11%" and claim a
    // precision a single account does not support.
    expect(card.textContent).toContain('+1 vs yesterday');
    expect(card.textContent).not.toContain('%');
  });

  it('shows a fall without inventing a plus sign', async () => {
    createdCall.mockResolvedValue(seriesResponse([4, 9]));
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('-5 vs yesterday');
  });

  it('says nothing about yesterday when the series has only today', async () => {
    createdCall.mockResolvedValue(seriesResponse([3]));
    renderSummary();
    const card = await loaded();

    expect(card.textContent).not.toContain('vs yesterday');
    // Singular, because "across 1 days" is what a plain interpolation prints.
    expect(card.textContent).toContain('across 1 day');
    expect(card.textContent).not.toContain('across 1 days');
  });

  it('keeps the day figures when the count request fails', async () => {
    totalCall.mockRejectedValue(new Error('down'));
    renderSummary();
    const card = await loaded();

    // The failing call costs its own tile, not the whole strip.
    expect(card.textContent).toContain('10');
    expect(card.textContent).toContain('across 7 days');
    expect(card.textContent).not.toContain('176,197');
  });

  it('keeps the total when the day series fails', async () => {
    createdCall.mockRejectedValue(new Error('down'));
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('176,197');
    expect(card.textContent).not.toContain('vs yesterday');
  });

  it('renders nothing when neither request answers', async () => {
    totalCall.mockRejectedValue(new Error('down'));
    createdCall.mockRejectedValue(new Error('down'));
    const { container } = renderSummary();

    await waitFor(() =>
      expect(screen.queryByTestId('accounts-summary')).toBeNull(),
    );
    expect(container.textContent).toBe('');
  });

  it('drops a malformed day rather than printing NaN', async () => {
    createdCall.mockResolvedValue({
      data: { number_by_day: [{ doc_count: 5 }, { key: 2 }, { doc_count: 4 }] },
      error: '',
      code: 'successful',
    });
    renderSummary();
    const card = await loaded();

    expect(card.textContent).not.toContain('NaN');
    // 5 + 4, with the entry that carried no count left out of both the sum and
    // the day span.
    expect(card.textContent).toContain('9');
    expect(card.textContent).toContain('across 2 days');
  });
});
