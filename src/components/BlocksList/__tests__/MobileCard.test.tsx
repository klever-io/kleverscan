import theme from '@/styles/theme';
import { IBlock } from '@/types/blocks';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The real module pulls @/utils/precisionFunctions and from there an ESM
// chain Jest cannot transform; replaced wholesale like every other suite.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${value.slice(0, 10)}...`,
}));

// Resolved against the shipped bundle, with i18next's plural resolution
// mirrored: a `count` option first tries `<key>_one`/`<key>_other`, which is
// exactly the mechanism the transaction count relies on.
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/blocks.json',
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
      t: (
        key: string,
        options?: Record<string, unknown> & {
          defaultValue?: string;
          count?: number;
        },
      ) => {
        const path = key.includes(':') ? key.split(':')[1] : key;
        let value: unknown;
        if (typeof options?.count === 'number') {
          value = lookup(`${path}_${options.count === 1 ? 'one' : 'other'}`);
        }
        if (typeof value !== 'string') value = lookup(path);
        if (typeof value !== 'string') value = options?.defaultValue;
        if (typeof value !== 'string')
          throw new Error(`missing blocks locale key: ${key}`);
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

import BlocksMobileCard from '../MobileCard';

// Block 32739281 on mainnet, trimmed to the fields the card reads.
const BLOCK = {
  nonce: 32739281,
  epoch: 6076,
  size: 479,
  producerName: 'MOONLABS-1',
  producerOwnerAddress:
    'klv1qqqqqqqqqqqqqpgqp09vtjvv3rr57vvs6zaaaj4ddd736rthnqup6tmn4w',
  timestamp: 1787871964,
  txCount: 1,
  txFees: 6143952,
  kAppFees: 2000000,
  txBurnedFees: 3071976,
  blockRewards: 15000000,
} as IBlock;

const renderCard = (overrides: Partial<IBlock> = {}, index = 0) =>
  render(
    <ThemeProvider theme={theme}>
      <BlocksMobileCard
        item={{ ...BLOCK, ...overrides } as IBlock}
        index={index}
      />
    </ThemeProvider>,
  );

describe('BlocksMobileCard', () => {
  it('links the block number to its detail page', () => {
    renderCard();

    const link = screen.getByTestId('block-link');
    expect(link.getAttribute('href')).toBe('/block/32739281');
    expect(link.textContent).toBe('32739281');
  });

  it('keeps one testid per card, the shape the e2e counts rows by', () => {
    renderCard({}, 3);

    expect(screen.getByTestId('table-row-3')).toBeTruthy();
  });

  it('says "1 tx" for a single transaction, through the plural keys', () => {
    renderCard({ txCount: 1 });

    expect(screen.getByText(/1 tx ·/)).toBeTruthy();
  });

  it('says "3 txs" for several, the other half of the same plural pair', () => {
    renderCard({ txCount: 3 });

    expect(screen.getByText(/3 txs ·/)).toBeTruthy();
  });

  it('carries the epoch its desktop column gave up', () => {
    renderCard();

    expect(screen.getByText(/Epoch 6076/)).toBeTruthy();
  });

  it('shows the same fee-reward half the desktop row derives', () => {
    renderCard();

    // 6143952 / 2 through the shared bandwidthFeeReward helper.
    expect(screen.getByText(/Fee Rewards 3\.07 KLV/)).toBeTruthy();
  });

  it('renders a block without transactions as zero fees, not a crash', () => {
    renderCard({
      txCount: 0,
      txFees: undefined,
      kAppFees: undefined,
      txBurnedFees: undefined,
    });

    expect(screen.getByText(/Fee Rewards 0 KLV/)).toBeTruthy();
    expect(screen.getByText(/0 txs ·/)).toBeTruthy();
  });
});
