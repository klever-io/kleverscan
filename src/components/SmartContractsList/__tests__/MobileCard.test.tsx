import theme from '@/styles/theme';
import { SmartContractsList } from '@/types/smart-contract';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The real module pulls @/utils/precisionFunctions and from there an ESM chain
// Jest cannot transform; replaced wholesale like every other suite.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${String(value).slice(0, 8)}...`,
}));

// The name lookup is its own request. The card must read correctly before it
// answers, which is the state every row starts in.
jest.mock('@/components/TransactionsList/useContractName', () => ({
  useContractName: jest.fn(() => undefined),
}));

// Resolved against the shipped bundle, so a card asking for a key the locale
// file does not carry fails here rather than rendering the raw key.
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
        if (typeof value !== 'string')
          throw new Error(`missing smartContracts locale key: ${key}`);
        return value.replace(/\{\{(\w+)\}\}/g, (whole, name) =>
          options && name in options ? String(options[name]) : whole,
        );
      },
    }),
  };
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

import { useContractName } from '@/components/TransactionsList/useContractName';
import ContractsMobileCard from '../MobileCard';

const mockedName = useContractName as jest.Mock;

// Bitcoin.me on mainnet, trimmed to the fields the card reads.
const CONTRACT: SmartContractsList = {
  name: 'Bitcoin.me',
  contractAddress:
    'klv1qqqqqqqqqqqqqpgqu34l5t0w5qjajuk5w7j9jy4rxxhj974rx04sdw565h',
  deployer: 'klv1p4umsy0cr4yk3tsrwr6hp8nv4j6ksp0dwcl2plq6yswy24xlx04s3nw6rr',
  deployTxHash:
    '6af352e694578cbcee5eedd94e05a2a1d2289195088a43a74ad7f9d12b167ab5',
  timestamp: 1768498496,
  upgrades: [
    { upgradeTxHash: 'a', upgrader: 'klv1x', timestamp: 1770317888 },
    { upgradeTxHash: 'b', upgrader: 'klv1x', timestamp: 1771957092 },
  ],
  totalTransactions: 130759,
};

const renderCard = (item: SmartContractsList = CONTRACT, deferred = true) =>
  render(
    <ThemeProvider theme={theme}>
      <ContractsMobileCard item={item} index={0} deferred={deferred} />
    </ThemeProvider>,
  );

describe('ContractsMobileCard', () => {
  beforeEach(() => {
    mockedName.mockReset();
    mockedName.mockReturnValue(undefined);
  });

  it('names the contract the list already resolved', () => {
    renderCard();
    expect(screen.getByText('Bitcoin.me')).toBeTruthy();
  });

  it('carries the row testid the smoke test looks for', () => {
    const { container } = renderCard();
    expect(
      container.querySelector('[data-testid="table-row-0"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="smart-contract-link"]'),
    ).not.toBeNull();
  });

  it('links to the contract, the deployer and the deploy transaction', () => {
    const { container } = renderCard();
    const hrefs = [...container.querySelectorAll('a')].map(a =>
      a.getAttribute('href'),
    );
    expect(hrefs).toContain(`/smart-contract/${CONTRACT.contractAddress}`);
    expect(hrefs).toContain(`/account/${CONTRACT.deployer}`);
    expect(hrefs).toContain(`/transaction/${CONTRACT.deployTxHash}`);
  });

  it('groups the transaction count', () => {
    renderCard();
    expect(screen.getByText('130,759')).toBeTruthy();
  });

  it('counts the upgrades rather than listing them', () => {
    renderCard();
    expect(screen.getByText(/Upgrades\s+2/)).toBeTruthy();
  });

  it('shows a dash for a contract that was never upgraded', () => {
    renderCard({ ...CONTRACT, upgrades: [] });
    expect(screen.getByText(/Upgrades\s+- -/)).toBeTruthy();
  });

  it('falls back to the address when the contract has no name', () => {
    renderCard({ ...CONTRACT, name: undefined });
    expect(screen.queryByText('Bitcoin.me')).toBeNull();
    expect(
      screen.getByText(CONTRACT.contractAddress.slice(0, 8) + '...'),
    ).toBeTruthy();
  });

  it('takes the separately fetched name when the list carried none', () => {
    mockedName.mockReturnValue('Resolved Later');
    renderCard({ ...CONTRACT, name: undefined });
    expect(screen.getByText('Resolved Later')).toBeTruthy();
  });

  it('asks for a name only when the list did not carry one', () => {
    renderCard({ ...CONTRACT, name: undefined });
    expect(mockedName).toHaveBeenCalledWith(CONTRACT.contractAddress, true);
  });

  it('does not ask for a name the list already gave it', () => {
    renderCard();
    expect(mockedName).toHaveBeenCalledWith(CONTRACT.contractAddress, false);
  });

  it('holds the lookup back while the table is still fetching', () => {
    // The other half of the gate: even with no name to show, the row must not
    // add a request to the path the reader is already waiting on.
    renderCard({ ...CONTRACT, name: undefined }, false);
    expect(mockedName).toHaveBeenCalledWith(CONTRACT.contractAddress, false);
  });

  it('refuses a name that is shaped like an address', () => {
    // Owner-set text standing where an address would: the impersonation guard
    // must reject it and leave the real address on screen.
    renderCard({ ...CONTRACT, name: 'klv1qqqqqqqqqqqqqpgqevil' });
    expect(screen.queryByText('klv1qqqqqqqqqqqqqpgqevil')).toBeNull();
  });

  it('renders a contract with no transactions', () => {
    renderCard({
      ...CONTRACT,
      totalTransactions: undefined as unknown as number,
    });
    expect(screen.getByText('0')).toBeTruthy();
  });
});
