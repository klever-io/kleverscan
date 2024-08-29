import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { ButtonsComponent } from '../ButtonsComponent';
import { ErrorMessage, GenericCardContainer, GenericInput } from '../styles';

export const CreateAssetRoyaltyITOToken: React.FC<PropsWithChildren<any>> = ({
  buttonsProps,
  t,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const ticker = watch('ticker');
  let errorTransferPercentage = errors?.royalties?.itoPercentage;
  let errorTransferFixed = errors?.royalties?.itoFixed;

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.royalties.royalties')}</p>
        <p>{t('wizards:common.step')} 3/5</p>
      </div>
      <div>
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.setTheValuesITORoyalties',
            { ticker },
          )}
        </p>
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.nowChooseReceiverAddress',
          )}
        </p>
        <GenericInput
          error={errorTransferPercentage}
          type="number"
          autoFocus={true}
          placeholder="ITO Percentage"
          {...register('royalties.itoPercentage', {
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 100, message: 'Max value is 100' },
            valueAsNumber: true,
          })}
        />
        <p>{t('wizards:common.advancedOptions.royalties.percentageITOBuy')}</p>
        {errorTransferPercentage && (
          <ErrorMessage>{errorTransferPercentage?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorTransferFixed}
          type="number"
          placeholder="ITO Fixed"
          {...register('royalties.itoFixed', {
            valueAsNumber: true,
          })}
        />
        <p>{t('wizards:common.advancedOptions.royalties.fixedAmountITOBuy')}</p>
        {errorTransferFixed && (
          <ErrorMessage>{errorTransferFixed?.message}</ErrorMessage>
        )}
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
