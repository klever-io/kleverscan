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

/** Keys resolve from the shipped bundles rather than echoing back, so a key nobody
 *  added fails this suite instead of rendering "accounts:List.New24h" at a reader.
 *  Plurals go through the same `_one`/`_other` selection i18next applies. */
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

// The installed testing-library still calls the removed ReactDOM.render; every component suite carries this createRoot shim.
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
const windowCall = jest.fn();

jest.mock('@/services/requests/accounts', () => ({
  accountsTotalCall: () => totalCall(),
  accountsCreatedCall: () => createdCall(),
  accountsCreatedInWindow: (windows: number) => windowCall(windows),
}));

import AccountsSummary from '../Summary';

/** The request layer answers undefined for its own failure: `api.get` never rejects, so mockRejectedValue would model an impossible shape. */

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

/** Resolves once the skeleton is gone: the loading shape renders no text and no testid, so an "is absent" check passes while still loading. */
const settled = async (): Promise<void> =>
  // queryBy, not getBy: lets waitForElementToBeRemoved say "already absent" instead of throwing the getter's own not-found error.
  waitForElementToBeRemoved(() =>
    screen.queryByLabelText('Account statistics'),
  );

/** Two mounts sharing one cache, which is what a client-side navigation back is; renderSummary's fresh client per call can never observe re-requests. */
const renderShared = (client: QueryClient) =>
  render(
    <QueryClientProvider client={client}>
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
    totalCall.mockResolvedValue(176197);
    createdCall.mockResolvedValue([10, 9]);
    windowCall.mockResolvedValue(133);
  });

  it('asks each figure once, and the wider tile for seven windows', async () => {
    renderSummary();
    await loaded();

    expect(createdCall).toHaveBeenCalledTimes(1);
    expect(windowCall).toHaveBeenCalledTimes(1);
    expect(windowCall).toHaveBeenCalledWith(7);
    expect(totalCall).toHaveBeenCalledTimes(1);
  });

  it('shows the total, the running day and the window total', async () => {
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('176,197');
    expect(card.textContent).toContain('10');
    expect(card.textContent).toContain('133');
    expect(card.textContent).toContain('across 7 days');
  });

  it('reports the day-on-day change as a count, with its sign', async () => {
    renderSummary();
    const card = await loaded();

    // 10 against 9: a percentage would read "+11%" and claim a precision a
    // single account does not support.
    expect(card.textContent).toContain('+1 vs previous 24h');
    expect(card.textContent).not.toContain('%');
  });

  it('shows a fall without inventing a plus sign', async () => {
    createdCall.mockResolvedValue([4, 9]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('-5 vs previous 24h');
  });

  it('says nothing about yesterday when the series has only today', async () => {
    createdCall.mockResolvedValue([3]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).not.toContain('vs previous 24h');
  });

  it('keeps the day figures when the total request fails', async () => {
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
    expect(card.textContent).not.toContain('vs previous 24h');
  });

  it('keeps the day tile when only the wider window failed', async () => {
    // Separate requests, so one gone must not take the others with it.
    windowCall.mockResolvedValue(undefined);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).toContain('10');
    expect(card.textContent).not.toContain('across 7 days');
  });

  it('renders nothing when neither request answers', async () => {
    totalCall.mockResolvedValue(undefined);
    createdCall.mockResolvedValue(undefined);
    windowCall.mockResolvedValue(undefined);
    const { container } = renderSummary();

    // Wait for the skeleton to go, not merely for the testid to be absent: the loading
    // shape carries neither, so both assertions pass against a component that never resolves.
    await settled();

    expect(screen.queryByTestId('accounts-summary')).toBeNull();
    expect(container.textContent).toBe('');
  });

  it('says nothing about the previous window when it is a hole', async () => {
    createdCall.mockResolvedValue([10, undefined]);
    renderSummary();
    const card = await loaded();

    expect(card.textContent).not.toContain('vs previous 24h');
    expect(within(card).getByText('10')).toBeTruthy();
    expect(card.textContent).not.toContain('NaN');
  });

  it('keeps the window tile when the day figure is a hole and the total is gone', async () => {
    totalCall.mockResolvedValue(undefined);
    createdCall.mockResolvedValue([undefined, 4]);
    windowCall.mockResolvedValue(184);
    renderSummary();
    const card = await loaded();

    expect(within(card).getByText('184')).toBeTruthy();
    expect(card.textContent).not.toContain('New (24h)');
    expect(card.textContent).not.toContain('Total Accounts');
  });

  it('asks again on the next mount when nothing but holes came back', async () => {
    // All-holes is a wholly failed strip the queryFn still files as a success; measured by
    // length alone it pinned for five minutes, gone across client-side navigation until a full reload.
    totalCall.mockResolvedValue(undefined);
    createdCall.mockResolvedValue([undefined, undefined]);
    windowCall.mockResolvedValue(undefined);

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const first = renderShared(client);
    await waitFor(() => expect(createdCall).toHaveBeenCalledTimes(1));
    expect(first.container.textContent).toBe('');
    first.unmount();

    renderShared(client);
    await waitFor(() => expect(createdCall).toHaveBeenCalledTimes(2));
  });

  it('keeps a real answer out of a second request on the next mount', async () => {
    // The other half of the same rule, so the fix above cannot be "never cache".
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderShared(client).unmount();
    await waitFor(() => expect(createdCall).toHaveBeenCalledTimes(1));

    renderShared(client);
    await loaded();
    expect(createdCall).toHaveBeenCalledTimes(1);
    expect(totalCall).toHaveBeenCalledTimes(1);
  });

  it('caches on the wider window alone, when it is the only figure that came', async () => {
    // Three separate requests, so the 7d tile can answer while the other two
    // fail. Judging freshness on the other two alone refetched a strip that
    // had something to show, on every mount.
    totalCall.mockResolvedValue(undefined);
    createdCall.mockResolvedValue(undefined);
    windowCall.mockResolvedValue(184);

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderShared(client).unmount();
    await waitFor(() => expect(windowCall).toHaveBeenCalledTimes(1));

    renderShared(client);
    await loaded();
    expect(windowCall).toHaveBeenCalledTimes(1);
  });
});
