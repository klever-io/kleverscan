import { validateImgUrl } from '@/utils/imageValidate';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { Container, LetterLogo, Verified } from './styles';

interface IAssetLogo {
  logo: string;
  ticker: string;
  name: string;
  verified?: boolean;
  invertColors?: boolean;
}
const AssetLogo: React.FC<IAssetLogo> = ({
  logo,
  ticker,
  name,
  verified,
  invertColors,
}) => {
  const isVerified = () => {
    if (verified) {
      return <Verified />;
    }
  };
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
      <Container data-testid="asset-logo-container">
        <Image
          alt={`${name}-logo`}
          src={url}
          onError={() => setError(true)}
          loader={({ src }) => src}
        />
        {isVerified()}
      </Container>
    );
  };

  if (urlIsImg && !error) {
    return renderLogo(getCorrectLogo());
  }

  return (
    <Container data-testid="asset-logo-container">
      <LetterLogo invertColors={invertColors}>
        {ticker?.split('')?.[0] || '--'}
      </LetterLogo>
      {isVerified()}
    </Container>
  );
};

export default AssetLogo;
