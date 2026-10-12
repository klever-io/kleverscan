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
import api from '@/services/api';
import { blockTransactionsCall } from '@/services/requests/block';
import theme from '@/styles/theme';
import { IBlock } from '@/types/blocks';
import { setQueryAndRouter } from '@/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Block, { getStaticPaths, getStaticProps } from '@/pages/block/[block]';

jest.mock('@/services/requests/block', () => ({
  blockTransactionsCall: jest.fn(),
}));

jest.mock('@/components/Layout/Title', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ title }: { title: string }) =>
      React.createElement('h1', null, title),
  };
});

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(async () => ({ translations: true })),
}));

jest.mock('@/components/Tabs/Transactions', () => {
  const React = require('react');
  return function Transactions(props: {
    transactionsTableProps?: {
      request?: (page: number, limit: number) => void;
    };
  }) {
    props.transactionsTableProps?.request?.(2, 20);
    return React.createElement('div', { 'data-testid': 'transactions-panel' });
  };
});

jest.mock(
  '@/components/Tabs/Validators',
  () =>
    (props: { validators: string[]; producerOwnerAddress?: string }) => (
      <div
        data-testid="validators-panel"
        data-count={String(props.validators.length)}
        data-producer={props.producerOwnerAddress ?? ''}
      />
    ),
);

const router = {
  isReady: true,
  asPath: '/block/7',
  pathname: '/block/[block]',
  query: { block: '7' } as Record<string, string>,
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => router,
}));

jest.mock('@/utils', () => ({
  setQueryAndRouter: jest.fn(),
  getSelectedTab: (tab: string | undefined, headers: string[]) => {
    const index = typeof tab === 'string' ? headers.indexOf(tab) : -1;
    return index === -1 ? 0 : index;
  },
}));

const apiGet = api.get as jest.Mock;
const loadTransactions = blockTransactionsCall as jest.Mock;
const setQuery = setQueryAndRouter as jest.Mock;
const translate = serverSideTranslations as jest.Mock;

const block = {
  hash: 'hash-overview',
  timestamp: 1787664055000,
  nonce: 7,
  epoch: 3,
  size: 400,
  kAppFees: Number.NaN,
  txFees: 1_500_000,
  softwareVersion: 'v9',
  chainID: 'T',
  producerSignature: 'sig-1',
  parentHash: 'parent-1',
  trieRoot: 'trie-1',
  validatorsTrieRoot: 'vtrie-1',
  validators: ['aa', 'bb'],
  producerOwnerAddress: 'klv1producer',
  kappsTrieRoot: 'kapps-1',
  prevRandSeed: 'prev-seed',
  randSeed: 'rand-seed',
} as IBlock;

const draw = () =>
  render(
    <ThemeProvider theme={theme}>
      <Block block={block} />
    </ThemeProvider>,
  );

describe('block detail page', () => {
  beforeEach(() => {
    router.query = { block: '7' };
    router.asPath = '/block/7';
    window.history.pushState({}, '', '/block/7');
    setQuery.mockClear();
    apiGet.mockReset();
    translate.mockClear();
    loadTransactions.mockClear();
  });

  it('reads the tab and the card from the address bar, not from router.query', () => {
    router.query = { block: '7', tab: 'Transactions', card: 'Overview' };
    window.history.pushState({}, '', '/block/7?tab=Validators&card=Info');
    draw();
    expect(screen.getByTestId('validators-panel')).toHaveAttribute(
      'data-count',
      '2',
    );
    expect(screen.getByTestId('validators-panel')).toHaveAttribute(
      'data-producer',
      'klv1producer',
    );
    expect(screen.queryByTestId('transactions-panel')).not.toBeInTheDocument();
    expect(screen.getByText('Software Version')).toBeInTheDocument();
    expect(screen.getByText('v9')).toBeInTheDocument();
    expect(screen.queryByText('Timestamp')).not.toBeInTheDocument();
  });

  it('does not mount the table until the router has the page from the query', () => {
    router.isReady = false;
    window.history.pushState({}, '', '/block/7?tab=Validators&page=2');
    const view = draw();
    expect(screen.queryByTestId('validators-panel')).not.toBeInTheDocument();
    expect(screen.getByTestId('tab-content-1')).toBeInTheDocument();

    router.isReady = true;
    view.rerender(
      <ThemeProvider theme={theme}>
        <Block block={block} />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('validators-panel')).toBeInTheDocument();
  });

  it('falls back to Transactions and Overview for an unknown query', () => {
    window.history.pushState({}, '', '/block/7?tab=Nope&card=Nope');
    draw();
    expect(screen.getByTestId('transactions-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('validators-panel')).not.toBeInTheDocument();
    expect(screen.getByText('08/25/26 13:20:55 UTC')).toBeInTheDocument();
    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('400 Bytes')).toBeInTheDocument();
    expect(screen.getAllByText('0.000000')).toHaveLength(2);
    expect(screen.getByText('1.500000')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View previous block' }),
    ).toHaveAttribute('href', '/block/6');
    expect(
      screen.getByRole('link', { name: 'View next block' }),
    ).toHaveAttribute('href', '/block/8');
    expect(screen.getByTitle('hash-overview')).toHaveTextContent(
      'hash-overview',
    );
    expect(loadTransactions).toHaveBeenCalledWith(7, 2, 20, router.query);
  });

  it('writes the card into the query and drops paging when the tab changes', () => {
    router.query = { block: '7', page: '2', limit: '10' };
    draw();
    fireEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(setQuery).toHaveBeenCalledWith(
      { block: '7', page: '2', limit: '10', card: 'Info' },
      router,
    );
    expect(screen.getByText('Chain ID')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Validators'));
    expect(setQuery).toHaveBeenCalledWith(
      { block: '7', tab: 'Validators' },
      router,
    );
  });
});

describe('block getStaticPaths', () => {
  it('builds no paths and lets the first request fill them in', async () => {
    await expect(getStaticPaths({} as never)).resolves.toEqual({
      paths: [],
      fallback: 'blocking',
    });
  });
});

describe('block getStaticProps', () => {
  beforeEach(() => {
    apiGet.mockReset();
    translate.mockClear();
  });

  it('does not call the API for a nonce that is not a block', async () => {
    await expect(
      getStaticProps({ params: { block: '-1' } } as never),
    ).resolves.toEqual({ notFound: true });
    await expect(
      getStaticProps({ params: { block: 'nope' } } as never),
    ).resolves.toEqual({ notFound: true });
    await expect(getStaticProps({ params: {} } as never)).resolves.toEqual({
      notFound: true,
    });
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('returns notFound when the API reports an error, including nonce 0', async () => {
    apiGet.mockResolvedValue({ error: 'missing' });
    await expect(
      getStaticProps({ params: { block: '0' } } as never),
    ).resolves.toEqual({ notFound: true });
    expect(apiGet).toHaveBeenCalledWith({ route: 'block/by-nonce/0' });
  });

  it('returns the block and the namespaces the transactions table needs', async () => {
    apiGet.mockResolvedValue({ error: '', data: { block } });
    await expect(
      getStaticProps({ params: { block: '7' }, locale: 'en' } as never),
    ).resolves.toEqual({
      props: { block, translations: true },
    });
    expect(apiGet).toHaveBeenCalledWith({ route: 'block/by-nonce/7' });
    expect(translate).toHaveBeenCalledWith(
      'en',
      ['common', 'transactions'],
      expect.anything(),
      ['en'],
    );
  });
});
