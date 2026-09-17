import theme from '@/styles/theme';
import { IAssetPoolRow } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const capturedTableProps: Array<Record<string, unknown>> = [];

// Capture pattern, as the validators page suite does: the table itself is
// pinned by its own suite; what this one owns is the rowSections wiring.
jest.mock('../../Table', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedTableProps.push(props);
    return null;
  },
}));

jest.mock('@/services/requests/assetsPools', () => ({
  requestAssetsPoolsQuery: jest.fn(),
  requestAllAssetsPools: jest.fn(async () => []),
}));

jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => value,
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, pathname: '/assets', isReady: true }),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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

import AssetsPools from '../index';
import PoolsMobileCard from '../MobileCard';
import { IRowSection } from '@/types/index';

/** Twins whose last digit differs from the double: only the twin renders it. */
const POOL = {
  kda: 'BIG-8DGT',
  active: true,
  ownerAddress: 'klv1owner',
  adminAddress: 'klv1owner',
  klvBalance: 10000000000000000,
  klvBalanceString: '10000000000000001',
  kdaBalance: 20000000000000000,
  kdaBalanceString: '20000000000000002',
  fRatioKLV: 1,
  fRatioKDA: 1,
  ticker: 'BIG',
  name: 'Big Token',
  precision: 8,
} as unknown as IAssetPoolRow;

const wrap = (element: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>
    <ThemeProvider theme={theme}>{element}</ThemeProvider>
  </QueryClientProvider>
);

describe('AssetsPools desktop reserve tooltips', () => {
  it('pairs each reserve with its twin, precision and unit', () => {
    capturedTableProps.length = 0;
    render(wrap(<AssetsPools />));

    const rowSections = capturedTableProps[0]
      ?.rowSections as (pool: IAssetPoolRow) => IRowSection[];
    expect(typeof rowSections).toBe('function');

    const { container } = render(
      wrap(
        <>
          {rowSections(POOL).map((section, index) => (
            <div key={index}>{section.element({})}</div>
          ))}
        </>,
      ),
    );

    const titles = Array.from(container.querySelectorAll('[title]')).map(
      element => element.getAttribute('title'),
    );
    // KLV reserve: twin digits at KLV precision 6.
    expect(
      titles.some(title => title?.includes('10,000,000,000.000001 KLV')),
    ).toBe(true);
    // KDA reserve: its own twin at the asset's precision 8.
    expect(
      titles.some(title => title?.includes('200,000,000.00000002 BIG')),
    ).toBe(true);
  });
});

describe('PoolsMobileCard reserve tooltips', () => {
  it('pairs the same twins on the mobile card', () => {
    const { container } = render(wrap(<PoolsMobileCard item={POOL} index={0} />));

    const titles = Array.from(container.querySelectorAll('[title]')).map(
      element => element.getAttribute('title'),
    );
    expect(
      titles.some(title => title?.includes('10,000,000,000.000001 KLV')),
    ).toBe(true);
    expect(
      titles.some(title => title?.includes('200,000,000.00000002 BIG')),
    ).toBe(true);
  });

  it('falls back to the doubles when no twins arrived', () => {
    const { container } = render(
      wrap(
        <PoolsMobileCard
          item={
            {
              ...POOL,
              klvBalanceString: undefined,
              kdaBalanceString: undefined,
            } as IAssetPoolRow
          }
          index={0}
        />,
      ),
    );

    const titles = Array.from(container.querySelectorAll('[title]')).map(
      element => element.getAttribute('title'),
    );
    expect(
      titles.some(title => title?.includes('10,000,000,000 KLV')),
    ).toBe(true);
    expect(titles.some(title => title?.includes('200,000,000 BIG'))).toBe(
      true,
    );
  });
});
