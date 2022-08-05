import React from 'react';

interface IAssetLogo {
  LetterLogo: React.FunctionComponent<any>;
  Logo: React.FunctionComponent<any>;
  logo: string;
  ticker: string;
  name: string;
  isVerified: () => JSX.Element | undefined;
}
const AssetLogo: React.FC<IAssetLogo> = ({
  LetterLogo,
  Logo,
  logo,
  ticker,
  name,
  isVerified,
}) => {
  const regex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  if (
    regex.test(logo) ||
    logo === 'https://bc.klever.finance/logo_klv' ||
    logo === 'https://bc.klever.finance/logo_kfi'
  ) {
    return (
      <>
        {isVerified()}
        <Logo alt={`${name}-logo`} src={logo} />
      </>
    );
  }
  return (
    <>
      {isVerified()}
      <LetterLogo>{ticker?.split('')?.[0] || ''}</LetterLogo>
    </>
  );
};

export default AssetLogo;
