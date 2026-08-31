import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The five lookups the tooltip can fan out to; only the transaction one is
// exercised here, the rest exist so the module loads without its ESM chains.
const getTransactionMock = jest.fn();
jest.mock('@/services/requests/asset', () => ({
  getAssetByPartialSymbol: jest.fn(),
}));
jest.mock('@/services/requests/searchBar/account', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/services/requests/searchBar/block', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/services/requests/transaction', () => ({
  __esModule: true,
  default: (...args: unknown[]) => getTransactionMock(...args),
}));
jest.mock('@/services/requests/searchBar/smartContract', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/utils/gtag', () => ({ searchEvent: jest.fn() }));
jest.mock('@/contexts/inputSearch', () => ({
  useInputSearch: () => ({ setSearchValue: jest.fn() }),
}));
jest.mock('@/utils/precisionFunctions', () => ({
  getPrecision: jest.fn(async () => 6),
}));
jest.mock('@/assets/icons', () => new Proxy({}, { get: () => () => null }));
jest.mock('@/assets/status', () => ({
  getStatusIcon: () => () => null,
}));
jest.mock('@/components/ExplorerLink', () => ({
  __esModule: true,
  default: ({ value, label }: { value?: string; label?: string }) => (
    <a href={`#${value ?? ''}`}>{label ?? value}</a>
  ),
}));
jest.mock('@/components/Logo/AssetLogo', () => ({
  __esModule: true,
  default: () => <span data-testid="asset-logo" />,
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

import PrePageTooltip from '../index';

const HASH =
  'd971ae9f093d97d6bf6989116ba8d84765c947ceee841e0d7e2fc370f183052a';

/**
 * Renders the search preview end to end for a transaction hash, which is the
 * one `element()` call site no other suite reaches: the cards below only
 * exist if getCorrectRowSections ran and every cell function was invoked.
 * A FAILED transaction on purpose: search must present those like any other.
 */
describe('PrePageTooltip', () => {
  it('renders the card cells for a failed transaction hash', async () => {
    getTransactionMock.mockResolvedValue({
      data: {
        transaction: {
          hash: HASH,
          status: 'fail',
          sender: 'klv1senderaddress',
          blockNum: 123456,
          timestamp: 1787871964000,
          contract: [
            {
              type: 0,
              parameter: {
                toAddress: 'klv1receiveraddress',
                amount: 1000000,
                assetId: 'KLV',
              },
            },
          ],
        },
      },
      error: '',
      code: 'successful',
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider theme={theme}>
          <PrePageTooltip
            search={HASH}
            setShowTooltip={jest.fn()}
            isInHomePage={false}
          />
        </ThemeProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('card-item').length).toBeGreaterThan(0);
    });
    expect(getTransactionMock).toHaveBeenCalledWith(HASH);
  });
});
