import { render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key.split(/[:.]/).pop(),
  }),
}));

import theme from '@/styles/theme';
import { IAsset } from '@/types';
import { ThemeProvider } from 'styled-components';
import AssetsMobileCard from '../MobileCard';

const asset = (overrides: Partial<IAsset> = {}): IAsset =>
  ({
    assetId: 'KID-36W3',
    name: 'KleverKid Coin',
    ticker: 'KID',
    logo: '',
    verified: false,
    assetType: 'Fungible',
    precision: 6,
    maxSupply: 100_000_000_000_000,
    circulatingSupply: 1_360_000_000_000,
    initialSupply: 0,
    staking: undefined,
    attributes: undefined,
    hasKdaPool: true,
    ...overrides,
  }) as unknown as IAsset;

const draw = (item: IAsset) =>
  render(
    <ThemeProvider theme={theme}>
      <AssetsMobileCard item={item} index={0} />
    </ThemeProvider>,
  );

describe('AssetsMobileCard', () => {
  /* The header was rebuilt in review: one line, the id as a badge inside the
     link, so the name and its handle travel together. */
  it('carries the name and the id badge inside one link', () => {
    draw(asset());

    const link = screen.getByTestId('asset-link');
    expect(link).toHaveTextContent('KleverKid Coin');
    expect(link).toHaveTextContent('KID-36W3');
  });

  it('keeps the action buttons as the header row content after the badges', () => {
    draw(asset());

    const row = screen.getByTestId('asset-link').parentElement as Element;
    const kids = [...row.children].map(
      el => el.className.split(' ')[0].split('-sc-')[0],
    );
    expect(/RowActions/.test(kids[kids.length - 1])).toBe(true);
  });

  it('names the pool badge only where the asset has one', () => {
    draw(asset({ hasKdaPool: false }));

    expect(screen.queryByText('Fee Pool')).toBeNull();
  });

  // The other direction, or the absence check above also passes on a badge
  // that never renders for anyone.
  it('shows the pool badge where the asset has one', () => {
    draw(asset());

    expect(screen.getByText('Fee Pool')).toBeInTheDocument();
  });
});
