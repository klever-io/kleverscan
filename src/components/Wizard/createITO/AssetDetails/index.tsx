import { getAsset } from '@/services/requests/asset';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  ConfirmCardBasisInfo,
  ConfirmCardImage,
} from '../../createAsset/styles';
import Image from 'next/legacy/image';
import { IAsset } from '@/types';
import { infinitySymbol } from '../../createAsset';
import { parseAddress } from '@/utils/parseValues';

export const AssetDetails: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const collection = watch('collection');
  const { data, isLoading } = useQuery({
    queryKey: 'collection',
    queryFn: () => getAsset(collection),
  });
  const RenderLogo: React.FC<PropsWithChildren<{ logo: string }>> = ({
    logo,
  }) => {
    if (logo) {
      return (
        <ConfirmCardImage>
          <Image
            alt="logo"
            src={logo}
            width={40}
            height={40}
            objectPosition="center"
            style={{ borderRadius: '10px' }}
            loader={({ src, width }) => `${src}?w=${width}`}
          />
        </ConfirmCardImage>
      );
    }
    return <ConfirmCardImage>{collection[0]?.toUpperCase()}</ConfirmCardImage>;
  };
  const RenderAssetDetails: React.FC<PropsWithChildren> = () => {
    if (data) {
      const asset = data.data?.asset as IAsset;

      return (
        <>
          <div>
            <RenderLogo logo={asset.logo} />
            <div>
              <span>{asset.ticker}</span>
              <span>{asset.name}</span>
            </div>
          </div>
          <ConfirmCardBasisInfo>
            <span>{t('common.maxSupply')}</span>
            <span>{asset.maxSupply ? asset.maxSupply : infinitySymbol}</span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>
              {t(
                'createToken.stepsInformations.basicStepsLabels.initialSupply',
              )}
            </span>
            <span>{asset.initialSupply ? asset.initialSupply : 0}</span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>{t('common.precision')}</span>
            <span>
              <span>{asset.precision || 0} </span>
            </span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>{t('common.basicOptions.ownerAddress')}</span>
            <span>{parseAddress(asset.ownerAddress, 14)}</span>
          </ConfirmCardBasisInfo>
        </>
      );
    }
    return <></>;
  };

  return <RenderAssetDetails />;
};
