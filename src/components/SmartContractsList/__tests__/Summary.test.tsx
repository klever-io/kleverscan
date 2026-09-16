import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** Keys resolve from the shipped bundle, so a key nobody added fails here
 *  instead of rendering "smartContracts:List.ActiveLast24h" at a reader. */
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/smartContracts.json',
  );

  const lookup = (path: string): unknown =>
    path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundle,
      );

  return {
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) => {
        const path = key.includes(':') ? key.split(':')[1] : key;
        const value = lookup(path);
        const template =
          typeof value === 'string'
            ? value
            : ((options?.defaultValue as string) ?? key);
        return template.replace(/\{\{(\w+)\}\}/g, (_m, name: string) =>
          String(options?.[name] ?? ''),
        );
      },
    }),
  };
});

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite carries this createRoot shim.
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

const listCall = jest.fn();
const totalCall = jest.fn();
const windowsCall = jest.fn();
const activeCall = jest.fn();
const sharesCall = jest.fn();

jest.mock('@/services/requests/smartContracts', () => ({
  smartContractsListCall: () => listCall(),
  smartContractTotalTransactionsListCall: () => totalCall(),
  contractTransactions24hCall: () => windowsCall(),
  activeContracts24hCall: () => activeCall(),
  contractActivitySharesCall: () => sharesCall(),
}));

// The bar is deferred behind an idle check; resolving it immediately keeps
// these tests about the tiles.
jest.mock('@/components/DataList/useDeferred', () => ({
  useDeferred: () => true,
}));

/** `parseValues` reaches `precisionFunctions` -> `pages/transactions` ->
 *  react-syntax-highlighter, an ESM chain Jest cannot transform. A factory
 *  mock never loads the real module, which is what makes this file testable. */
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (address: string, size: number) =>
    address.length > size ? `${address.slice(0, size)}...` : address,
}));

import ContractsSummary from '../Summary';

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
        <ContractsSummary />
      </ThemeProvider>
    </QueryClientProvider>,
  );

const loaded = async (): Promise<HTMLElement> =>
  waitFor(() => screen.getByTestId('contracts-summary'));

describe('ContractsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    listCall.mockResolvedValue({ totalContracts: 211 });
    totalCall.mockResolvedValue(483474);
    windowsCall.mockResolvedValue({ last24h: 3023 });
    activeCall.mockResolvedValue(16);
    sharesCall.mockResolvedValue({ statistics: [], allSuccessful: undefined });
  });

  it('names how many of the deployed contracts actually ran', async () => {
    const card = await (renderSummary(), loaded());

    expect(card.textContent).toContain('211');
    expect(card.textContent).toContain('16 active in the last 24h');
  });

  it('keeps a genuine zero, which a quiet day really is', async () => {
    activeCall.mockResolvedValue(0);
    const card = await (renderSummary(), loaded());

    expect(card.textContent).toContain('0 active in the last 24h');
  });

  it('leaves the active line out when only that request failed', async () => {
    // Its own line, not the tile: the deployed count still answered.
    activeCall.mockResolvedValue(undefined);
    const card = await (renderSummary(), loaded());

    expect(card.textContent).not.toContain('active in the last 24h');
    expect(card.textContent).toContain('211');
  });

  it('drops the whole tile when the deployed count is the one that failed', async () => {
    // The active line hangs off the tile, so it cannot outlive it.
    listCall.mockResolvedValue(undefined);
    const card = await (renderSummary(), loaded());

    expect(card.textContent).not.toContain('Contracts deployed');
    expect(card.textContent).not.toContain('active in the last 24h');
    expect(card.textContent).toContain('483,474');
  });

  it('shows the rolling window under the transaction total', async () => {
    const card = await (renderSummary(), loaded());

    expect(card.textContent).toContain('3,023 in the last 24 hours');
  });

  it('names each legend entry and its bar segment the same way', async () => {
    // The whole legend subtree hangs off a resolved share model, so without
    // statistics none of it renders and its naming rule goes unexercised.
    // A named contract, an unnamed one and a remainder large enough for the
    // "Other" entry, so all three legend shapes are drawn.
    sharesCall.mockResolvedValue({
      statistics: [
        {
          address: 'klv1namedcontractaddress0000000000000000',
          name: 'Bitcoin.me',
          count: 60,
        },
        { address: 'klv1unnamedcontractaddress00000000000000', count: 40 },
      ],
      allSuccessful: 200,
    });

    const card = await (renderSummary(), loaded());

    await waitFor(() => expect(card.textContent).toContain('Bitcoin.me'));
    // The unnamed one falls back to its address, cut to the ten characters
    // the legend allows.
    expect(card.textContent).toContain('klv1unname...');
    expect(card.textContent).toContain('Other contracts');

    // The bar's tooltip and the legend's must agree on what a segment is
    // called: one rule, applied in both places.
    const named = Array.from(card.querySelectorAll('[title]')).filter(node =>
      (node.getAttribute('title') ?? '').startsWith('Bitcoin.me'),
    );
    expect(named).toHaveLength(2);
    expect(named.map(node => node.getAttribute('title'))).toEqual([
      'Bitcoin.me \u00b7 60',
      'Bitcoin.me',
    ]);
  });
});
