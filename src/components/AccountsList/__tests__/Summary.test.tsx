import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
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

/**
 * The request layer answers plain values now, and undefined for its own
 * failure. That undefined is the shape to mock: `api.get` never rejects, so a
 * mockRejectedValue would model something this layer cannot produce.
 */

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

/** Resolves once the skeleton is gone, so an assertion cannot pass while the
 *  card is still loading: the loading shape renders no text and no testid, and
 *  both would satisfy an "is absent" check. */
const settled = async (): Promise<void> =>
  // queryBy, not getBy: the callback form lets waitForElementToBeRemoved say
  // "already absent" instead of throwing the getter's own not-found error,
  // which would read as a failure of the thing being waited for.
  waitForElementToBeRemoved(() =>
    screen.queryByLabelText('Account statistics'),
  );

/** The loaded card, which the loading shape deliberately does not carry. */
const loaded = async (): Promise<HTMLElement> =>
  waitFor(() => screen.getByTestId('accounts-summary'));

describe('AccountsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    totalCall.mockResolvedValue(176197);
    createdCall.mockResolvedValue([10, 9, 4, 82, 12, 8, 8]);
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
    createdCall.mockResolvedValue([4, 9]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('-5 vs yesterday');
  });

  it('says nothing about yesterday when the series has only today', async () => {
    createdCall.mockResolvedValue([3]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).not.toContain('vs yesterday');
    // Singular, because "across 1 days" is what a plain interpolation prints.
    expect(card.textContent).toContain('across 1 day');
    expect(card.textContent).not.toContain('across 1 days');
  });

  it('keeps the day figures when the count request fails', async () => {
    totalCall.mockResolvedValue(undefined);
    renderSummary();
    const card = await loaded();

    // The failing call costs its own tile, not the whole strip.
    expect(card.textContent).toContain('10');
    expect(card.textContent).toContain('across 7 days');
    expect(card.textContent).not.toContain('176,197');
  });

  it('keeps the total when the day series fails', async () => {
    createdCall.mockResolvedValue(undefined);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('176,197');
    expect(card.textContent).not.toContain('vs yesterday');
  });

  it('renders nothing when neither request answers', async () => {
    totalCall.mockResolvedValue(undefined);
    createdCall.mockResolvedValue(undefined);
    const { container } = renderSummary();

    // Waiting for the skeleton to go, not merely for the testid to be absent.
    // The loading shape carries no testid and no text, so both of the
    // assertions below hold while the card is still loading and would pass
    // against a component that never resolves.
    await settled();

    expect(screen.queryByTestId('accounts-summary')).toBeNull();
    expect(container.textContent).toBe('');
  });

  it('sums only the days that carried a count, and counts those days', async () => {
    createdCall.mockResolvedValue([5, undefined, 4]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).not.toContain('NaN');
    // Matched as its own element, not as a substring of the card: the total
    // tile above reads "176,197", which contains a 9 and would satisfy a
    // textContent check on its own.
    expect(within(card).getByText('9')).toBeTruthy();
    // Two days carried a figure out of the three the window returned, and the
    // label describes the days that were summed.
    expect(card.textContent).toContain('across 2 days');
  });

  it('says nothing about yesterday when yesterday is the hole', async () => {
    createdCall.mockResolvedValue([10, undefined, 4]);
    renderSummary();
    const card = await loaded();

    // The trap this guards: compacting the series to [10, 4] would make the
    // day before yesterday stand in for yesterday and report "+6".
    expect(card.textContent).not.toContain('vs yesterday');
    expect(within(card).getByText('10')).toBeTruthy();
  });

  it('still reads yesterday from position one when an older day is missing', async () => {
    createdCall.mockResolvedValue([10, 9, undefined, 4]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('+1 vs yesterday');
    expect(card.textContent).toContain('across 3 days');
  });
});
