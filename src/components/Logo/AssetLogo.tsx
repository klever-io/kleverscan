import React from 'react';

interface IAssetLogo {
  LetterLogo: React.FunctionComponent<any>,
  Logo: React.FunctionComponent<any>,
  logo: string,
  ticker: string,
  name: string,
}
const AssetLogo: React.FC<IAssetLogo> = ({ LetterLogo, Logo, logo, ticker, name }) => {
  const regex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  if (
    regex.test(logo) ||
    logo === 'https://bc.klever.finance/logo_klv' ||
    logo === 'https://bc.klever.finance/logo_kfi'
  ) {
    return <Logo alt={`${name}-logo`} src={logo} />;
  }
  return <LetterLogo>{ticker.split('')[0]}</LetterLogo>;
};

export default AssetLogo;
