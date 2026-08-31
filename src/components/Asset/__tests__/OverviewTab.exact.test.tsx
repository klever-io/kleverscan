import theme from '@/styles/theme';
import { IAsset } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The requests module reaches parseValues/precisionFunctions, untransformable
// by Jest; the tab only imports two count calls from it, disabled here anyway
// via router.isReady false.
jest.mock('@/services/requests/asset', () => ({
  holdersCall: jest.fn(),
  transactionCall: jest.fn(),
}));

// QrCodeModal reaches utils/hooks and from there the react-syntax-highlighter
// ESM chain; the views barrel reaches the same chain through PrePageTooltip.
// Neither is under test here; severed wholesale like every other suite.
jest.mock('@/components/QrCodeModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/utils/precisionFunctions', () => ({}));
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => value,
}));
// Pulled in by the views barrel, not by the tab; drags the search tooltip and
// the contract-modal chain along.
jest.mock('@/components/InputGlobal', () => ({
  __esModule: true,
  default: () => null,
}));
// Thin, like every suite that meets it: react-tooltip does not load under
// jest; what this suite owns is the figures, not the tips.
jest.mock('@/components/Tooltip', () => ({
  __esModule: true,
  default: ({ msg }: { msg: string }) => <span title={msg} />,
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { asset: 'BIG-TEST' }, isReady: false }),
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

import { OverviewTab } from '../OverviewTab';

/**
 * The seam between the parse boundary and the renderer: an asset whose twins
 * deliberately differ from their doubles in the last digit, so only the twin
 * can produce the asserted text. The initial supply carries no twin, pinning
 * the unchanged number path in the same render.
 */
const ASSET = {
  assetId: 'BIG-TEST',
  assetType: 'Fungible',
  precision: 8,
  ownerAddress: '',
  circulatingSupply: 100000000000000000,
  circulatingSupplyString: '100000000000000001',
  maxSupply: 100000000000000000,
  maxSupplyString: '100000000000000002',
  initialSupply: 5000000000000000,
  burnedValue: 0,
  mintedValue: 0,
  uris: {},
} as unknown as IAsset;

const renderTab = (asset: IAsset) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider theme={theme}>
        <OverviewTab asset={asset} />
      </ThemeProvider>
    </QueryClientProvider>,
  );

describe('OverviewTab exact supply figures', () => {
  it('renders the digit twins with fixed decimals, and the number path without a twin', () => {
    renderTab(ASSET);

    // Twin paths: last digits 1 and 2 exist only in the strings.
    expect(screen.getByText('1,000,000,000.00000001')).toBeInTheDocument();
    expect(screen.getByText('1,000,000,000.00000002')).toBeInTheDocument();
    // Number path (no twin): toLocaleFixed presentation, unchanged.
    expect(screen.getByText('50,000,000.00000000')).toBeInTheDocument();
  });

  it('falls back to the rounded double when no twin arrived', () => {
    renderTab({
      ...ASSET,
      circulatingSupplyString: undefined,
      maxSupplyString: undefined,
    } as IAsset);

    // Twice: circulating and max both land on the same double now.
    expect(screen.getAllByText('1,000,000,000.00000000')).toHaveLength(2);
  });
});
