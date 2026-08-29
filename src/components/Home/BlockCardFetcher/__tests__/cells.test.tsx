import theme from '@/styles/theme';
import { IBlock } from '@/types/blocks';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The chains the module under test does NOT need, but its sibling index pulls
// in for the drift test below: precisionFunctions and the full ExplorerLink
// are untransformable by Jest; replaced wholesale like every other suite.
jest.mock('@/utils/precisionFunctions', () => ({}));
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${value.slice(0, 10)}...`,
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

import { blockFeesCell, blockRewardsCell, blockSizeTxsCell } from '../cells';
import { blocksRowSections, blocksTabletRowSections } from '../index';

// Same mainnet block 32739281 the BlocksList rows suite uses.
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

const renderCell = (cell: { element: (props: object) => React.ReactNode }) =>
  render(<ThemeProvider theme={theme}>{cell.element({})}</ThemeProvider>);

describe('home block cells', () => {
  it('renders size and a singular TX count', () => {
    renderCell(blockSizeTxsCell(BLOCK));
    expect(screen.getByText('479 Bytes')).toBeTruthy();
    expect(screen.getByText('1 TX')).toBeTruthy();
  });

  it('pluralizes the TX count above one', () => {
    renderCell(blockSizeTxsCell({ ...BLOCK, txCount: 2 } as IBlock));
    expect(screen.getByText('2 TXs')).toBeTruthy();
  });

  it('renders kApp and burned fees in KLV', () => {
    renderCell(blockFeesCell(BLOCK));
    expect(screen.getByText('2 KLV')).toBeTruthy();
    expect(screen.getByText('3.07 KLV')).toBeTruthy();
  });

  it('renders the fee reward half and the block reward', () => {
    renderCell(blockRewardsCell(BLOCK));
    expect(screen.getByText('3.07 KLV')).toBeTruthy();
    expect(screen.getByText('15 KLV')).toBeTruthy();
  });

  it('renders zeroes rather than NaN when the fee fields are missing', () => {
    renderCell(
      blockFeesCell({
        ...BLOCK,
        kAppFees: undefined,
        txBurnedFees: undefined,
      } as unknown as IBlock),
    );
    expect(screen.getAllByText('0 KLV')).toHaveLength(2);
  });

  // The drift guard #700 asks for: both home variants must keep rendering the
  // shared cells identically. Positions 2 to 4 in both builders.
  it('keeps the desktop and tablet builders on the same three cells', () => {
    const desktop = blocksRowSections(BLOCK).slice(2, 5);
    const tablet = blocksTabletRowSections(BLOCK).slice(2, 5);

    desktop.forEach((section, index) => {
      const a = renderCell(section);
      const b = renderCell(tablet[index]);
      expect(a.container.innerHTML).toBe(b.container.innerHTML);
    });
  });
});
