import { Edit } from '@/assets/icons';
import * as SocialIcons from '@/assets/social';
import { AssetProps } from '@/components/Asset/OverviewTab';
import { HashComponent } from '@/components/Contract';
import { LoadingBackground } from '@/components/Contract/styles';
import Title from '@/components/Layout/Title';
import { Loader } from '@/components/Loader/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import Skeleton from '@/components/Skeleton';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { assetInfoCall } from '@/services/requests/asset';
import { IParsedITO } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useQuery } from 'react-query';
import { ApplyFormModal } from './ApplyFormModal';
import { AssetITOSummary } from './AssetITOSummary';
import { ParticipateModal } from './ParticipateModal';
import {
  About,
  AssetHeaderContainer,
  AssetSubtitle,
  AssetTitle,
  AssetTypeContainer,
  BackgroundImage,
  Container,
  Description,
  EditContainer,
  Header,
  LeftSide,
  LinkStyles,
  ParticipateButton,
  RightSide,
  SocialNetworks,
} from './styles';

export interface AssetSummaryProps extends AssetProps {
  ITO: IParsedITO | undefined;
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ asset, ITO }) => {
  const [openParticipateModal, setOpenParticipateModal] = useState(false);
  const [openApplyFormModal, setOpenApplyFormModal] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isTablet } = useMobile();
  const router = useRouter();
  const { walletAddress, connectExtension, extensionInstalled } =
    useExtension();

  const getSocialNetworks = useCallback(() => {
    const availableSocialNetworks = Object.keys(SocialIcons).map(key => key);

    const matchingSocials = Object.entries(asset?.uris || {})
      .map(([key, value]) => {
        const matchingSocial = availableSocialNetworks.filter(social => {
          return value.toLowerCase().includes(social.toLocaleLowerCase());
        });

        return !!matchingSocial.length
          ? {
              uri: value.startsWith('http') ? value : `https://${value}`,
              social: matchingSocial[0],
              icon: SocialIcons[matchingSocial[0]],
            }
          : null;
      })
      .filter(key => key !== null) as {
      uri: string;
      social: string;
      icon: any;
    }[];

    return matchingSocials;
  }, [asset]);

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const { data: asset_info, refetch: refetchAssetInfo } = useQuery({
    queryKey: [`assetInfo`, router.query.asset],
    queryFn: () => assetInfoCall(router),
    enabled: !!router?.isReady,
  });

  const hashProps = {
    hash: txHash,
    setHash: setTxHash,
  };

  return (
    <>
      {asset ? (
        <Container>
          {txHash && <HashComponent {...hashProps} />}
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
                  Add a description
                </ParticipateButton>
              ) : null}
              <SocialNetworks>
                {getSocialNetworks().map(social => (
                  <LinkStyles
                    key={social.social}
                    href={social.uri}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <social.icon />
                  </LinkStyles>
                ))}
              </SocialNetworks>
            </LeftSide>
            <RightSide>
              {asset && ITO && asset.assetType === 'Fungible' && (
                <AssetITOSummary
                  asset={asset}
                  ITO={ITO}
                  setOpenParticipateModal={setOpenParticipateModal}
                />
              )}
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
              <h2>
                About the project
                {walletAddress && asset?.ownerAddress === walletAddress && (
                  <EditContainer onClick={() => setOpenApplyFormModal(true)}>
                    <Edit />
                  </EditContainer>
                )}
              </h2>
              <p>{asset_info?.project_description}</p>
            </About>
          ) : null}
          {ReactDOM.createPortal(
            asset && (
              <ApplyFormModal
                key={JSON.stringify(asset_info) + asset.assetId}
                isOpenApplyFormModal={openApplyFormModal}
                setOpenApplyFormModal={setOpenApplyFormModal}
                defaultValues={{
                  short_description: asset_info?.short_description,
                  project_description: asset_info?.project_description,
                }}
                refetchAssetInfo={refetchAssetInfo}
                asset={asset}
                setTxHash={setTxHash}
                setLoading={setLoading}
              />
            ),
            window.document.body,
          )}

          {ReactDOM.createPortal(
            asset && ITO && (
              <ParticipateModal
                isOpenParticipateModal={openParticipateModal}
                setOpenParticipateModal={setOpenParticipateModal}
                asset={asset}
                ITO={ITO}
                setTxHash={setTxHash}
                setLoading={setLoading}
              />
            ),
            window.document.body,
          )}

          {loading
            ? ReactDOM.createPortal(
                <LoadingBackground>
                  <Loader />
                </LoadingBackground>,
                window.document.body,
              )
            : null}
        </Container>
      ) : (
        <Skeleton width={200} height={40} />
      )}
    </>
  );
};
