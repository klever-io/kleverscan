import theme from '@/styles/theme';
import { IBlock } from '@/types/blocks';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('next/router', () => ({
  useRouter: () => ({ isReady: true, pathname: '/blocks', query: {} }),
}));

// These two pull ESM chains Jest cannot transform (parseValues via
// precisionFunctions, the full ExplorerLink via the contract modal and
// react-syntax-highlighter); replaced wholesale like every other suite.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${value.slice(0, 10)}...`,
}));
// Thin: the real one renders through react-tooltip's portal after a delay,
// which is library behavior; what this suite owns is which `msg` a cell hands
// it, so the mock surfaces that as a title attribute.
jest.mock('@/components/Tooltip', () => ({
  __esModule: true,
  default: ({ msg, Component }: { msg: string; Component?: React.FC }) => (
    <span title={msg}>{Component ? <Component /> : null}</span>
  ),
}));
jest.mock('@/components/ExplorerLink', () => ({
  __esModule: true,
  default: ({ value, label }: { value?: string; label?: string }) => (
    <a href={`#${value ?? ''}`}>{label ?? value}</a>
  ),
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

import { BLOCK_COLUMNS } from '../columns';
import { blockRowSections, COLUMN_LAYOUT } from '../rows';

// Block 32739281 on mainnet, trimmed to the fields the row reads.
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

const renderCell = (
  key: string,
  block: IBlock = BLOCK,
  t?: Parameters<typeof blockRowSections>[2],
) => {
  const sections = blockRowSections(block, 'Epoch', t);
  const index = BLOCK_COLUMNS.findIndex(column => column.key === key);
  return render(
    <ThemeProvider theme={theme}>{sections[index].element({})}</ThemeProvider>,
  );
};

describe('blockRowSections', () => {
  // The shared Table calls rowSections with the header STRING to read column
  // widths, twice per header cell per render. An implementation that
  // dereferences that argument crashes the whole page while rendering its own
  // header, which is exactly how the Pools tab once went down.
  it('answers the header-string probe with the layout, not a crash', () => {
    const layout = blockRowSections('Block');

    expect(layout).toBe(COLUMN_LAYOUT);
    expect(layout).toHaveLength(BLOCK_COLUMNS.length);
    layout.forEach((section, index) => {
      expect(section.width).toBe(BLOCK_COLUMNS[index].width);
      expect(section.span).toBe(BLOCK_COLUMNS[index].span ?? 1);
      // The probe's cells render nothing; the Table only reads the widths.
      expect(section.element({})).toBeNull();
    });
  });

  it('builds one section per column, in column order', () => {
    const sections = blockRowSections(BLOCK);

    expect(sections).toHaveLength(BLOCK_COLUMNS.length);
    sections.forEach((section, index) => {
      expect(section.width).toBe(BLOCK_COLUMNS[index].width);
    });
  });

  it('shows the producer half of the bandwidth fee as the fee reward', () => {
    renderCell('feeRewards');

    // 6143952 / 2 = 3071976 units at precision 6.
    expect(screen.getByText('3.07 KLV')).toBeTruthy();
  });

  it('agrees with the burned column, the other half of the same split', () => {
    renderCell('burnedFees');

    expect(screen.getByText('3.07 KLV')).toBeTruthy();
  });

  it('renders a block without transactions as zero fees, not a crash', () => {
    const empty = {
      ...BLOCK,
      txCount: 0,
      txFees: undefined,
      kAppFees: undefined,
      txBurnedFees: undefined,
    } as IBlock;

    renderCell('feeRewards', empty);

    expect(screen.getByText('0 KLV')).toBeTruthy();
  });

  it('turns an absent count and size into zeros, the malformed-answer shape', () => {
    const malformed = {
      ...BLOCK,
      txCount: undefined,
      size: undefined,
    } as unknown as IBlock;

    renderCell('txs', malformed);
    expect(screen.getByText('0')).toBeTruthy();
    renderCell('size', malformed);
    expect(screen.getByText('0 B')).toBeTruthy();
  });

  it('carries the byte unit in the cell, not the heading', () => {
    renderCell('size');

    expect(screen.getByText('479 B')).toBeTruthy();
  });

  it('puts the epoch in the block cell tooltip, where its column went', () => {
    renderCell('block');

    expect(screen.getByText('32739281')).toBeTruthy();
    expect(screen.getByTitle('Epoch 6076')).toBeTruthy();
  });

  it('hands the age tooltip the full date and the epoch, keyboard-reachably', () => {
    renderCell('age');

    // timestamp 1787871964 (seconds) is 2026-08-27 23:06:04 UTC. The epoch
    // rides along because this tooltip is the focusable one; the block cell's
    // own is hover-only, which left keyboard users without the epoch.
    expect(
      screen.getByTitle('08/27/26 23:06:04 UTC · Epoch 6076'),
    ).toBeTruthy();
  });

  it('translates the elapsed age using the translator passed to blockRowSections', () => {
    const t = jest.fn((key: string) =>
      key === 'Date.Elapsed_Time' ? 'atrás' : key,
    );
    renderCell('age', BLOCK, t as unknown as Parameters<typeof blockRowSections>[2]);

    expect(t).toHaveBeenCalledWith('Date.Elapsed_Time');
    expect(screen.getByText(/atrás/)).toBeTruthy();
  });
});
