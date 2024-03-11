import { AssetProps } from '@/components/Asset/OverviewTab';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import { PlusIcon } from '@/components/QuickAccess/styles';
import Skeleton from '@/components/Skeleton';
import { useMobile } from '@/contexts/mobile';
import { assetInfoCall } from '@/services/requests/asset';
import { IParsedITO } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { AssetITOSummary } from './AssetITOSummary';
import {
  About,
  AssetHeaderContainer,
  AssetSubtitle,
  AssetTitle,
  AssetTypeContainer,
  BackgroundImage,
  Container,
  Description,
  Header,
  LeftSide,
  RightSide,
  SocialNetworks,
} from './styles';

export interface AssetSummaryProps extends AssetProps {
  ITO: IParsedITO | undefined;
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ asset, ITO }) => {
  const socialNetworks = Object.values(asset?.uris || {});
  const { isTablet } = useMobile();
  const router = useRouter();

  const { data: asset_info } = useQuery({
    queryKey: [`assetInfo`, router.query.asset],
    queryFn: () => assetInfoCall(router),
    enabled: !!router?.isReady,
  });

  return (
    <>
      {asset ? (
        <Container>
          <Header>
            <LeftSide>
              <Title
                Component={() => (
                  <>
                    <AssetLogo
                      logo={asset?.logo || ''}
                      ticker={asset?.ticker || ''}
                      name={asset?.name || ''}
                      verified={asset?.verified}
                      size={56}
                    />
                    <AssetTitle>
                      <AssetHeaderContainer>
                        <h1>{asset?.name}</h1>
                        <AssetSubtitle>
                          {asset?.assetId}
                          <AssetTypeContainer>
                            {asset?.assetType}
                          </AssetTypeContainer>
                        </AssetSubtitle>
                      </AssetHeaderContainer>
                    </AssetTitle>
                  </>
                )}
                route={-1}
              />
              <Description>
                Start collecting funds and change the future of your project
                with our comunity. Start collecting funds and change the future
                of your project with our comunity
              </Description>
              <SocialNetworks>
                {socialNetworks.map(uri => (
                  <Link key={uri} href={uri}>
                    <a target="_blank" rel="noreferrer">
                      <PlusIcon />
                    </a>
                  </Link>
                ))}
              </SocialNetworks>
            </LeftSide>
            <RightSide>
              <AssetITOSummary asset={asset} ITO={ITO} />
              {!isTablet && (
                <BackgroundImage>
                  <Image
                    src={asset?.logo || ''}
                    alt={asset?.name}
                    width={550}
                    height={450}
                  />
                </BackgroundImage>
              )}
            </RightSide>
          </Header>
          <About>
            <h2>About the project</h2>
            <p>{asset_info?.project_description}</p>
          </About>
        </Container>
      ) : (
        <Skeleton width={200} height={40} />
      )}
    </>
  );
};
