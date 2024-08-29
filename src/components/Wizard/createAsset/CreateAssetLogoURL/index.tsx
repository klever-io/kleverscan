import { validateImgUrl } from '@/utils/imageValidate';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../styles';

export const CreateAssetLogoURL: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { currentStep, assetType }, handleStep, t }) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const ticker = watch('ticker');
  const assetText = assetType === 0 ? 'token' : 'NFT';
  let error = errors?.logo;

  const buttonsProps = {
    handleStep,
    next: !error,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:common.imageTicker', { ticker, assetText })}</p>
        <p>{t('wizards:common.imageInfo', { assetText })}</p>
        <GenericInput
          type="text"
          error={error}
          placeholder={t('wizards:common.uriPlaceholder')}
          {...register('logo', {
            validate: async (logoUri: any) => {
              const isValid = await validateImgUrl(logoUri, 2000);
              if (logoUri && !isValid) {
                return `${t('wizards:common.errorMessage.validURI')}`;
              }
              return true;
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>{t('wizards:common.imageTooltip')}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
