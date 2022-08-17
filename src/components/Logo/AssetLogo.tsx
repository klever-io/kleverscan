import { validateImgUrl } from '@/utils/index';
import React, { useCallback, useEffect, useState } from 'react';

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
  const [urlIsImg, setUrlIsImg] = useState(false);
  const [error, setError] = useState(false);
  const maxRequestAwaitTime = 2000; // 2 secs

  const validateLogo = useCallback(
    async (url: string) => {
      const isImg = await validateImgUrl(url, maxRequestAwaitTime);
      if (isImg) {
        setUrlIsImg(true);
      }
    },
    [urlIsImg],
  );

  const getCorrectLogo = () => {
    if (ticker === 'KLV') {
      return '/assets/klv-logo.png';
    }

    if (ticker === 'KFI') {
      return '/assets/kfi-logo.png';
    }
    return logo;
  };
  useEffect(() => {
    validateLogo(getCorrectLogo());
  }, []);

  const renderLogo = (url: string) => {
    return (
      <>
        {isVerified()}
        <Logo alt={`${name}-logo`} src={url} onError={() => setError(true)} />
      </>
    );
  };

  if (urlIsImg && !error) {
    return renderLogo(getCorrectLogo());
  }

  return (
    <>
      {isVerified()}
      <LetterLogo>{ticker?.split('')?.[0] || ''}</LetterLogo>
    </>
  );
};

export default AssetLogo;
