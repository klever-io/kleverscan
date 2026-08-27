import theme from '@/styles/theme';
import { ITransaction } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routerQuery: Record<string, string | string[] | undefined> = {};
let routerPathname = '/transactions';

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    pathname: routerPathname,
    query: routerQuery,
  }),
}));

// The card only formats what these give back; their real implementations pull
// @/utils/precisionFunctions and from there an ESM chain Jest cannot
// transform, so they are replaced wholesale like every other suite does.
// Classification mirrors the real dispatch (contract count, then contract
// type), NOT the payload shape: an earlier version keyed on the presence of
// toAddress, which made "Transfer without toAddress", the crash shape the
// card guards against, unrepresentable in this suite.
const customLabels = { current: ['Amount'] as string[] };
/** Controllable for the same reason `customLabels` is: the card pairs the two by index, so a case needs both sides. */
const customFields = {
  current: [<span key="amount">1 KLV</span>] as React.ReactNode[],
};

jest.mock('@/utils/contracts', () => ({
  contractTypes: (contracts: { type?: number }[]) => {
    if (contracts?.length > 1) return 'Multi contract';
    return contracts?.[0]?.type === 0
      ? 'TransferContractType'
      : 'FreezeContractType';
  },
  filteredSections: () => customFields.current,
  getLabelForTableField: () => customLabels.current,
}));

jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${value.slice(0, 6)}...`,
}));

// Resolved against the real English locale file rather than stubbed, so a key
// the card asks for that nobody ever added fails the suite here instead of
// rendering "transactions:Table.Type" at a reader.
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/transactions.json',
  );

  const translate = (key: string): string => {
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
    if (typeof value === 'string') return value;
    throw new Error(`missing transactions locale key: ${key}`);
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

import TransactionsMobileCard from '../MobileCard';

const SENDER = 'klv1sendersendersendersender';
const RECEIVER = 'klv1receiverreceiverreceiver';

const transfer = (overrides: Partial<ITransaction> = {}): ITransaction =>
  ({
    hash: 'abc123def456',
    blockNum: 4242,
    timestamp: 1700000000000,
    sender: SENDER,
    receipts: [],
    contract: [
      {
        type: 0,
        parameter: { amount: 1_000_000, assetId: 'KLV', toAddress: RECEIVER },
      },
    ],
    kAppFee: 1_000_000,
    bandwidthFee: 500_000,
    status: 'success',
    precision: 6,
    ...overrides,
  }) as unknown as ITransaction;

const renderCard = (
  item: ITransaction,
  {
    pathname = '/transactions',
    query = {},
  }: {
    pathname?: string;
    query?: Record<string, string | string[] | undefined>;
  } = {},
) => {
  routerPathname = pathname;
  Object.keys(routerQuery).forEach(key => delete routerQuery[key]);
  Object.assign(routerQuery, query);

  // The card looks a contract name up through react-query. Retries and the
  // console noise they produce are off: this suite is about what the card
  // renders, and the name is decoration it does without.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <TransactionsMobileCard item={item} index={3} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  customLabels.current = ['Amount'];
  customFields.current = [<span key="amount">1 KLV</span>];
});

describe('TransactionsMobileCard', () => {
  it('is the row for the shared table: one card carrying the row testid', () => {
    renderCard(transfer());
    const card = screen.getByTestId('table-row-3');

    const hashLink = within(card).getByTestId('transaction-link');
    expect(hashLink.getAttribute('href')).toBe('/transaction/abc123def456');

    expect(within(card).getByText('Type')).toBeTruthy();
    expect(within(card).getByText('Transfer')).toBeTruthy();
    expect(within(card).getByText('From')).toBeTruthy();
    expect(within(card).getByText('To')).toBeTruthy();
    expect(within(card).getByText('Block/Fees')).toBeTruthy();
    expect(within(card).getByText('4242').getAttribute('href')).toBe(
      '/block/4242',
    );
    expect(within(card).getByText('Success')).toBeTruthy();
    expect(within(card).getByText('Amount')).toBeTruthy();
  });

  it('shows -- for the receiver when the contract has none', () => {
    renderCard(
      transfer({
        contract: [{ type: 4, parameter: {} }],
      } as Partial<ITransaction>),
    );
    const card = screen.getByTestId('table-row-3');

    expect(within(card).getByText('--')).toBeTruthy();
    expect(within(card).queryByText('Transfer')).toBeNull();
  });

  it('survives a Transfer whose parameter is missing, without a broken link', () => {
    renderCard(
      transfer({
        contract: [{ type: 0, parameter: undefined }],
      } as unknown as Partial<ITransaction>),
    );
    const card = screen.getByTestId('table-row-3');

    expect(within(card).getByText('--')).toBeTruthy();
    expect(card.querySelector('a[href="/account/undefined"]')).toBeNull();
  });

  it('renders a colliding custom "Type" label as "Action type"', () => {
    customLabels.current = ['Type'];
    renderCard(transfer());
    const card = screen.getByTestId('table-row-3');

    expect(within(card).getAllByText('Type')).toHaveLength(1);
    expect(within(card).getByText('Action type')).toBeTruthy();
  });

  it('renders a multi-contract row as one badge carrying the count', () => {
    renderCard(
      transfer({
        contract: [
          { type: 0, parameter: {} },
          { type: 4, parameter: {} },
        ],
      } as unknown as Partial<ITransaction>),
    );

    expect(screen.getByText(/Multi contract/)).toBeTruthy();
    // The count is the emphasized element inside the badge.
    expect(screen.getByText('2').tagName).toBe('B');
  });

  it('adds the direction badge only when the list is scoped to the sender', () => {
    renderCard(transfer(), { query: { account: SENDER } });
    expect(screen.getByText('Out')).toBeTruthy();
  });

  it('leaves the direction off when the route does not filter by account', () => {
    renderCard(transfer(), {
      pathname: '/asset/[asset]',
      query: { account: SENDER },
    });
    expect(screen.queryByText('Out')).toBeNull();
    expect(screen.queryByText('In')).toBeNull();
  });

  it('gives colliding custom labels distinct keys', () => {
    // The rows were keyed on the label alone, several sets already name their first field "Type", and React reconciles a duplicate key by reusing the wrong row on the next render.
    // Asserted on React's own warning: a first render draws both either way.
    const errors: unknown[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => errors.push(args[0]);

    try {
      customLabels.current = ['Type', 'Type'];
      customFields.current = [
        <span key="a">first value</span>,
        <span key="b">second value</span>,
      ];

      renderCard(transfer());
      const card = screen.getByTestId('table-row-3');

      expect(card.textContent).toContain('first value');
      expect(card.textContent).toContain('second value');
    } finally {
      console.error = original;
    }

    expect(errors.filter(e => String(e).includes('same key'))).toHaveLength(0);
  });
});
