import { AssetProps } from '@/components/Asset/OverviewTab';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import { PlusIcon } from '@/components/QuickAccess/styles';
import Skeleton from '@/components/Skeleton';
import { useMobile } from '@/contexts/mobile';
import { IParsedITO } from '@/types';
import Link from 'next/link';
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
} from './style';

interface AssetSummaryProps extends AssetProps {
  ITO: IParsedITO | undefined;
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ asset, ITO }) => {
  const socialNetworks = Object.values(asset?.uris || {});
  const { isTablet } = useMobile();

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
                route={'/assets'}
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
              {!isTablet && (
                <BackgroundImage
                  src={asset?.logo || ''}
                  alt={asset?.name}
                  width={550}
                  height={450}
                />
              )}
            </RightSide>
          </Header>
          <About>
            <h2>About the project</h2>
            <p>
              Bitcoin was the first decentralized digital currency based on
              blockchain technology. It was created in 2008 by an anonymous
              programmer known as Satoshi Nakamoto, who released the white paper
              in a cryptography mailing list and later open sourced the software
              that implements the protocol.Bitcoin was the first decentralized
              digital currency based on blockchain technology. It was created in
              2008 by an anonymous programmer known as Satoshi Nakamoto, who
              released the white paper in a cryptography mailing list and later
              open sourced the software that implements the protocol.
            </p>
          </About>
        </Container>
      ) : (
        <Skeleton width={200} height={40} />
      )}
    </>
  );
};
