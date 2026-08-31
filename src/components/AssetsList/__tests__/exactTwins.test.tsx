import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IAsset } from '@/types';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const capturedTableProps: Array<Record<string, unknown>> = [];

// Capture pattern, as the validators page suite does.
jest.mock('@/components/Table', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedTableProps.push(props);
    return null;
  },
}));

// Raw svg imports do not resolve to components under jest; every icon the
// page graph touches becomes an inert stub.
jest.mock('@/assets/icons', () =>
  new Proxy({}, { get: () => () => null }),
);
jest.mock('@/assets/title-icons', () =>
  new Proxy({}, { get: () => () => null }),
);

// The page reaches parseValues (and through it the contract-modal ESM chain)
// via the AssetsPools tab import; severed wholesale like every other suite.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => value,
}));
jest.mock('@/utils/precisionFunctions', () => ({}));

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, pathname: '/assets', isReady: true }),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// The registry strip reads the app theme context; the strip is not under test.
jest.mock('@/contexts/theme', () => ({
  useTheme: () => ({ theme: jest.requireActual('@/styles/theme').default, isDarkTheme: false }),
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

import Assets from '@/pages/assets';
import { IRowSection } from '@/types/index';

/**
 * The seam test the review asked for: an asset whose twins differ from their
 * doubles in the last digit, walked through the page's own rowSections, so
 * every exact tooltip provably reads the twin at the right precision.
 */
const ASSET = {
  assetId: 'BIG-8DGT',
  name: 'Big Token',
  ticker: 'BIG',
  logo: '',
  assetType: 'Fungible',
  precision: 8,
  verified: false,
  circulatingSupply: 100000000000000000,
  circulatingSupplyString: '100000000000000001',
  maxSupply: 100000000000000000,
  maxSupplyString: '100000000000000002',
  initialSupply: 100000000000000000,
  initialSupplyString: '100000000000000003',
  burnedValue: 100000000000000000,
  burnedValueString: '100000000000000004',
  staking: {
    interestType: 'APRI',
    totalStaked: 100000000000000000,
    totalStakedString: '100000000000000005',
    apr: [],
  },
  attributes: { isPaused: false },
  uris: {},
} as unknown as IAsset;

describe('assets list exact tooltips', () => {
  const renderCells = (asset: IAsset) => {
    capturedTableProps.length = 0;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider theme={theme}>
          <Assets />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    const rowSections = capturedTableProps[0]?.rowSections as (
      item: IAsset,
    ) => IRowSection[];
    expect(typeof rowSections).toBe('function');
    return render(
      <ThemeProvider theme={theme}>
        <>
          {rowSections(asset).map((section, index) => (
            <div key={index}>{section.element({})}</div>
          ))}
        </>
      </ThemeProvider>,
    );
  };

  it('pairs every figure in the supply and staked tooltips with its twin', () => {
    const { container } = renderCells(ASSET);
    const titles = Array.from(container.querySelectorAll('[title]')).map(
      element => element.getAttribute('title') ?? '',
    );

    const supplyTitle = titles.find(title => title.includes('Circulating'));
    expect(supplyTitle).toContain('Circulating 1,000,000,000.00000001 BIG');
    expect(supplyTitle).toContain('Max 1,000,000,000.00000002');
    expect(supplyTitle).toContain('Initial 1,000,000,000.00000003');
    expect(supplyTitle).toContain('Burned 1,000,000,000.00000004');

    expect(
      titles.some(title => title.startsWith('1,000,000,000.00000002 BIG')),
    ).toBe(true);
    expect(
      titles.some(title =>
        title.includes('1,000,000,000.00000005 BIG staked'),
      ),
    ).toBe(true);
  });

  it('falls back to the doubles when no twins arrived', () => {
    const { container } = renderCells({
      ...ASSET,
      circulatingSupplyString: undefined,
      maxSupplyString: undefined,
      initialSupplyString: undefined,
      burnedValueString: undefined,
      staking: {
        ...(ASSET.staking as object),
        totalStakedString: undefined,
      },
    } as unknown as IAsset);

    const supplyTitle = Array.from(container.querySelectorAll('[title]'))
      .map(element => element.getAttribute('title') ?? '')
      .find(title => title.includes('Circulating'));
    expect(supplyTitle).toContain('Circulating 1,000,000,000 BIG');
    expect(supplyTitle).toContain('Max 1,000,000,000');
  });
});
