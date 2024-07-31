import { getAsset } from '@/services/requests/asset';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';
import { IAssetITOInformations } from '..';
import { infinitySymbol } from '../../createAsset';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../../createAsset/styles';

export const CreateITOSixStep: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({ informations: { currentStep, title, description }, handleStep, t }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const collection = watch('collection');
  const { data, isLoading } = useQuery({
    queryKey: 'collection',
    queryFn: () => getAsset(collection),
  });

  let error = errors?.maxAmount;

  const buttonsProps = {
    handleStep,
    next: !!!error,
  };
  const validateInput = (maxAmount: number) => {
    if (!isLoading) {
      const maxSupply = data?.data?.asset.maxSupply || 0;
      if (maxSupply === 0) {
        return true;
      } else if (maxSupply < maxAmount) {
        return 'Maximum Amount must be less than Maximum Supply';
      }
      return true;
    }
  };
  return (
    <GenericCardContainer>
      <div>
        <p> {t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {' '}
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whatIsTheAmount', { collection })}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <GenericInput
            error={error}
            type="number"
            autoFocus={true}
            placeholder="0"
            align={'right'}
            {...register('maxAmount', {
              validate: validateInput,
              pattern: { value: /\d+/g, message: 'Value must be only numbers' },
              valueAsNumber: true,
            })}
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipAmountOne')}{' '}
          <strong>{data?.data?.asset.maxSupply || infinitySymbol}</strong>{' '}
          {t('wizards:createITO.steps.tooltipAmountTwo')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
