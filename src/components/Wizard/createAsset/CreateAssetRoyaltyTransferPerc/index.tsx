import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IWizardComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  BorderedButton,
  ErrorMessage,
  GenericCardContainer,
  GenericInput,
  UriButtonsContainer,
  WizardRightArrowSVG,
} from '../styles';

export const CreateAssetRoyaltyTransferPerc: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transferPercentage',
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let errorTransferPercAmount = null;
  let errorTransferPerc = null;

  const ticker = watch('ticker');

  const buttonsProps = {
    handleStep,
    next: true,
  };

  try {
    errorTransferPercAmount = eval(
      `errors?.royalties.transferPercentage[${currentIndex}]?.amount`,
    );
    errorTransferPerc = eval(
      `errors?.royalties.transferPercentage[${currentIndex}]?.percentage`,
    );
  } catch {
    errorTransferPercAmount = null;
    errorTransferPerc = null;
  }

  const handleNextIndex = () => {
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIndex = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    if (fields.length === 0) append({});
  }, [fields]);

  return (
    <GenericCardContainer alignCenter>
      <div>
        <p>
          {t('wizards:common.advancedOptions.royalties.transferPercentage')}
        </p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.royalties.transferPercentage')}{' '}
          {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>
          {t('wizards:common.advancedOptions.royalties.fillAmountPercentage')}
        </p>
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.percentageValueTransfers',
            { ticker },
          )}
        </p>
        <GenericInput
          error={errorTransferPercAmount}
          type="number"
          {...register(`royalties.transferPercentage[${currentIndex}].amount`, {
            valueAsNumber: true,
          })}
          placeholder="Amount"
        />
        <p>{t('wizards:common.advancedOptions.royalties.amountHint')}</p>
        {errorTransferPercAmount && (
          <ErrorMessage>{errorTransferPercAmount?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorTransferPerc}
          type="number"
          autoFocus={true}
          {...register(
            `royalties.transferPercentage[${currentIndex}].percentage`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="Percentage"
        />
        <p>{t('wizards:common.advancedOptions.royalties.percentageHint')}</p>
        {errorTransferPerc && (
          <ErrorMessage>{errorTransferPerc?.message}</ErrorMessage>
        )}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:common.advancedOptions.royalties.removePercentage')}
        </BorderedButton>
      </div>
      <UriButtonsContainer>
        <div>
          <BorderedButton
            type="button"
            onClick={handlePreviousIndex}
            isHidden={fields.length <= 1}
          >
            <WizardLeftArrow />

            <span>{t('wizards:common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>{t('wizards:common.next')}</span>
            <WizardRightArrowSVG />
          </BorderedButton>
        </div>
        <BorderedButton
          type="button"
          onClick={() => {
            append({});
            setCurrentIndex(fields.length);
          }}
          fullWidth
        >
          <span>
            {t('wizards:common.advancedOptions.royalties.addPercentage')}
          </span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};
