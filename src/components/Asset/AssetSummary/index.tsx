import SocialIcons from '@/assets/social';
import { AssetProps } from '@/components/Asset/OverviewTab';
import { HashComponent } from '@/components/Contract';
import Title from '@/components/Layout/Title';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { useParticipate } from '@/contexts/participate';
import { assetInfoCall } from '@/services/requests/asset';
import { IParsedITO } from '@/types';
import DOMPurify from 'dompurify';
import { useTranslation } from 'next-i18next';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TbPencilMinus } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { ApplyFormModal } from './ApplyFormModal';
import { AssetITOSummary } from './AssetITOSummary';
import { ParticipateModal } from './ParticipateModal';

import { AssetTitle } from './AssetTitle';
import {
  About,
  AboutContent,
  AboutTitle,
  AddDescriptionButton,
  AddProjectDescription,
  BackgroundImage,
  Container,
  Description,
  EditDescriptionButton,
  Header,
  LeftSide,
  LinkStyles,
  PageTitle,
  RightSide,
  SocialNetworks,
  TitleContainer,
} from './styles';

export interface AssetSummaryProps extends AssetProps {
  ITO: IParsedITO | undefined;
}

export const AssetSummary: React.FC<PropsWithChildren<AssetSummaryProps>> = ({
  asset,
  ITO,
}) => {
  const {
    openApplyFormModal,
    setOpenApplyFormModal,
    openParticipateModal,
    setOpenParticipateModal,
    txHash,
    setTxHash,
    loading,
    setLoading,
  } = useParticipate();
  const { isTablet, isMobile } = useMobile();
  const router = useRouter();
  const { walletAddress, connectExtension, extensionInstalled } =
    useExtension();

  const { t } = useTranslation(['common', 'assets', 'table']);

  const getSocialNetworks = useCallback(() => {
    const availableSocialNetworks = Object.keys(SocialIcons).map(key => key);

    const matchingSocials = Object.entries(asset?.uris || {})
      .map(([key, value]) => {
        const matchingSocial = availableSocialNetworks.filter(social => {
          return value?.toLowerCase().includes(social?.toLocaleLowerCase());
        });

        return !!matchingSocial.length
          ? {
              uri: value.startsWith('http') ? value : `https://${value}`,
              social: matchingSocial[0],
              icon: SocialIcons[matchingSocial[0] as keyof typeof SocialIcons],
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

  const getRoute = () => {
    if (!router.query.reference) {
      return '/assets';
    } else {
      return `/${router.query.reference}`;
    }
  };

  return (
    <Container>
      {txHash && <HashComponent {...hashProps} />}
      <Header>
        <LeftSide>
          <TitleContainer>
            <Title
              key={asset?.assetId}
              route={getRoute()}
              Component={() => (
                <PageTitle>{t('common:Titles.Asset')}</PageTitle>
              )}
            />

            <AssetTitle asset={asset} />
          </TitleContainer>

          {asset_info?.short_description ? (
            <Description>{asset_info?.short_description}</Description>
          ) : null}

          <SocialNetworks>
            {getSocialNetworks().map(social => (
              <LinkStyles
                key={social.social}
                href={social.uri}
                target="_blank"
                rel="noreferrer nofollow"
              >
                <social.icon />
              </LinkStyles>
            ))}
          </SocialNetworks>
        </LeftSide>
        <RightSide>
          {asset && ITO && (
            <AssetITOSummary
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
      {asset_info?.project_description_copy ? (
        <About>
          <AboutTitle>About the project</AboutTitle>
          <AboutContent
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(asset_info?.project_description_copy),
            }}
            editable={
              walletAddress && asset?.ownerAddress === walletAddress
                ? true
                : false
            }
          />

          {walletAddress && asset?.ownerAddress === walletAddress && (
            <EditDescriptionButton
              type="button"
              onClick={() => setOpenApplyFormModal(true)}
            >
              <TbPencilMinus />
              Edit description
            </EditDescriptionButton>
          )}
        </About>
      ) : null}
      {!asset_info?.project_description_copy &&
      walletAddress &&
      asset?.ownerAddress === walletAddress ? (
        <About>
          <AboutTitle>About the project</AboutTitle>
          <AddProjectDescription>
            <p>Add a Project Description</p>
            <p>Add a brief description of your project here.</p>
            <AddDescriptionButton
              type="button"
              onClick={() => setOpenApplyFormModal(true)}
            >
              <TbPencilMinus />
              Add a description
            </AddDescriptionButton>
          </AddProjectDescription>
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
              project_description_copy: asset_info?.project_description_copy,
            }}
            refetchAssetInfo={refetchAssetInfo}
            asset={asset}
            setTxHash={setTxHash}
            setLoading={setLoading}
          />,
          window.document.body,
        )}

      {ITO?.packData &&
        ITO.packData.length > 0 &&
        ReactDOM.createPortal(
          <ParticipateModal
            isOpenParticipateModal={openParticipateModal}
            setOpenParticipateModal={setOpenParticipateModal}
            ITO={ITO}
            setTxHash={setTxHash}
            setLoading={setLoading}
          />,
          window.document.body,
        )}
    </Container>
  );
};
