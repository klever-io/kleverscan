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
import { useTranslation } from 'next-i18next';
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
  PageTitle,
  ParticipateButton,
  RightSide,
  SocialNetworks,
  TitleContainer,
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

  const { t } = useTranslation(['common', 'assets', 'table']);

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
    <Container>
      {txHash && <HashComponent {...hashProps} />}
      <Header>
        <LeftSide>
          <TitleContainer>
            <Title
              key={asset?.assetId}
              route={'/assets'}
              Component={() => (
                <PageTitle>{t('common:Titles.Asset')}</PageTitle>
              )}
            />

            <AssetTitle>
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
                  <h1>{asset?.name}</h1>
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
            </AssetTitle>
          </TitleContainer>

          <>
            {asset_info?.short_description ? (
              <Description>{asset_info?.short_description}</Description>
            ) : null}
            {!asset_info?.short_description &&
            walletAddress &&
            asset?.ownerAddress === walletAddress ? (
              <ParticipateButton
                secondary
                type="button"
                onClick={() => setOpenApplyFormModal(true)}
              >
                <Edit />
                Add a description
              </ParticipateButton>
            ) : null}
          </>

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
          {asset && ITO && (
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
                alt=""
                width={550}
                height={450}
                loader={({ src, width }) => `${src}?w=${width}`}
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
      {asset &&
        ReactDOM.createPortal(
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
          />,
          window.document.body,
        )}

      {asset &&
        ITO &&
        ReactDOM.createPortal(
          <ParticipateModal
            isOpenParticipateModal={openParticipateModal}
            setOpenParticipateModal={setOpenParticipateModal}
            asset={asset}
            ITO={ITO}
            setTxHash={setTxHash}
            setLoading={setLoading}
          />,
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
  );
};
