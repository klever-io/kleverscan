import { AssetProps } from '@/components/Asset/OverviewTab';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import { PlusIcon } from '@/components/QuickAccess/styles';
import Skeleton from '@/components/Skeleton';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { assetInfoCall } from '@/services/requests/asset';
import { IParsedITO } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useQuery } from 'react-query';
import { ApplyFormModal } from './ApplyFormModal';
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
  ParticipateButton,
  RightSide,
  SocialNetworks,
} from './styles';

export interface AssetSummaryProps extends AssetProps {
  ITO: IParsedITO | undefined;
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ asset, ITO }) => {
  const [openApplyFormModal, setOpenApplyFormModal] = useState(false);
  const socialNetworks = Object.values(asset?.uris || {});
  const { isTablet } = useMobile();
  const router = useRouter();
  const { walletAddress, connectExtension, extensionInstalled } =
    useExtension();

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

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
              {asset_info?.short_description ? (
                <Description>{asset_info?.short_description}</Description>
              ) : null}
              {!asset_info?.short_description &&
              walletAddress &&
              asset?.ownerAddress === walletAddress ? (
                <ParticipateButton
                  type="button"
                  onClick={() => setOpenApplyFormModal(true)}
                >
                  Add a description for this asset
                </ParticipateButton>
              ) : null}
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
              {asset && ITO && <AssetITOSummary asset={asset} ITO={ITO} />}
              {!isTablet && asset?.logo && (
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
          {asset_info?.project_description ? (
            <About>
              <h2>About the project</h2>
              <p>{asset_info?.project_description}</p>
            </About>
          ) : null}
          {ReactDOM.createPortal(
            asset && (
              <ApplyFormModal
                isOpenApplyFormModal={openApplyFormModal}
                setOpenApplyFormModal={setOpenApplyFormModal}
                asset={asset}
              />
            ),
            window.document.body,
          )}
        </Container>
      ) : (
        <Skeleton width={200} height={40} />
      )}
    </>
  );
};
