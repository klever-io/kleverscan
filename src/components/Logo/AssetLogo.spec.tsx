import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithTheme } from '../../test/utils';
import AssetLogo from './AssetLogo';

describe('Component AssetLogo', () => {
  const logoUrl = 'https://bc.klever.finance/logo_klv';
  const name = 'KLEVER';
  const ticker = 'KLV';
  let verified = true;

  test('Should render the component and AssetLogo Verified', async () => {
    renderWithTheme(
      <AssetLogo
        name={name}
        ticker={ticker}
        logo={logoUrl}
        verified={verified}
      />,
    );

    const container = await screen.findByTestId('asset-logo-container');
    const svg = container.lastChild;
    const img = screen.getByAltText('KLEVER-logo');
    expect(svg).toBeVisible();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(img).toBeVisible();
    expect(img).toHaveAttribute('alt', 'KLEVER-logo');
  });

  test('Should render the component and AssetLogo not Verified', async () => {
    verified = false;

    renderWithTheme(
      <AssetLogo
        name={name}
        ticker={ticker}
        logo={logoUrl}
        verified={verified}
      />,
    );
    const img = await screen.findByRole('img');
    expect(img).toBeVisible();
    expect(img).toHaveAttribute('alt', 'KLEVER-logo');
  });
});
