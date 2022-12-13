import { waitFor } from '@testing-library/react';
import React from 'react';
import { renderWithTheme } from '../../test/utils';
import { LetterLogo, Logo, VerifiedContainer } from '../../views/assets/detail';
import AssetLogo from './AssetLogo';

describe('Component AssetLogo', () => {
  const logoUrl = 'https://bc.klever.finance/logo_klv';
  const name = 'KLEVER';
  const ticker = 'KLV';
  let verified = true;
  const isVerified = () => {
    if (verified) {
      return <VerifiedContainer />;
    }
  };
  test('Should render the component and AssetLogo Verified', async () => {
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <AssetLogo
            Logo={Logo}
            LetterLogo={LetterLogo}
            name={name}
            ticker={ticker}
            logo={logoUrl}
            isVerified={isVerified}
          />,
        )),
    );
    const svg = container.lastChild;
    const img = container.firstChild;
    expect(svg).toBeVisible();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(img).toBeVisible();
    expect(img).toHaveAttribute('src', '/assets/klv-logo.png');
    expect(img).toHaveAttribute('alt', 'KLEVER-logo');
  });

  test('Should render the component and AssetLogo not Verified', async () => {
    let container: any;
    verified = false;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <AssetLogo
            Logo={Logo}
            LetterLogo={LetterLogo}
            name={name}
            ticker={ticker}
            logo={logoUrl}
            isVerified={isVerified}
          />,
        )),
    );
    const element = container.childNodes;
    const img = container.firstChild;
    expect(element).toHaveLength(1);
    expect(img).toBeVisible();
    expect(img).toHaveAttribute('src', '/assets/klv-logo.png');
    expect(img).toHaveAttribute('alt', 'KLEVER-logo');
  });
});
