import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import {
  AssetHeaderContainer,
  AssetTitle,
  Header,
} from '@/views/assets/detail';
import React from 'react';
import Skeleton from '../Skeleton';
import { AssetProps } from './OverviewTab';

export const AssetSummary: React.FC<AssetProps> = ({ asset }) => {
  return (
    <>
      {asset ? (
        <Header>
          <Title
            Component={() => (
              <>
                <AssetLogo
                  logo={asset?.logo || ''}
                  ticker={asset?.ticker || ''}
                  name={asset?.name || ''}
                  verified={asset?.verified}
                />
                <AssetTitle>
                  <AssetHeaderContainer>
                    <h1>
                      {asset?.name} ({asset?.assetId})
                    </h1>
                  </AssetHeaderContainer>
                  <div>{asset?.assetType}</div>
                </AssetTitle>
              </>
            )}
            route={'/assets'}
          />
        </Header>
      ) : (
        <Skeleton width={200} height={40} />
      )}
    </>
  );
};
