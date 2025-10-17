import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Skeleton from '@/components/Skeleton';

import {
  AssetHeaderContainer,
  AssetSubtitle,
  AssetTitleContainer,
  AssetTypeContainer,
} from './styles';
import { useMobile } from '@/contexts/mobile';

export const AssetTitle: React.FC<{ asset: any }> = ({ asset }) => {
  const { isMobile } = useMobile();

  return (
    <AssetTitleContainer>
      {asset ? (
        <AssetLogo
          logo={asset?.logo || ''}
          ticker={asset?.ticker || ''}
          name={asset?.name || ''}
          verified={asset?.verified}
          size={56}
        />
      ) : (
        <Skeleton width={56} height={56} />
      )}
      <AssetHeaderContainer>
        {asset ? (
          <Title
            key={asset?.name}
            Component={() =>
              isMobile ? <span>{asset?.name}</span> : <h1>{asset?.name}</h1>
            }
          />
        ) : (
          <Skeleton width={200} height={40} />
        )}
        {asset ? (
          <AssetSubtitle>
            {asset?.assetId}
            <AssetTypeContainer>{asset?.assetType}</AssetTypeContainer>
          </AssetSubtitle>
        ) : (
          <Skeleton width={'100%'} height={34} />
        )}
      </AssetHeaderContainer>
    </AssetTitleContainer>
  );
};
