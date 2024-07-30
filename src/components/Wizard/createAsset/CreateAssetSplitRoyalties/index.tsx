import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IWizardComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  BorderedButton,
  ButtonsContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  IconWizardInfoSquare,
  InfoCard,
  UriButtonsContainer,
  WizardButton,
  WizardRightArrowSVG,
} from '../styles';

export const CreateAssetSplitRoyalties: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splitRoyalties',
  });

  const [splitRoyalties, setSplitRoyalties] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  let errorsplitAddres = null;
  let errorSplitTransferPerc = null;
  let errorSplitITOPerc = null;
  let errorSplitPercentITOFixed = null;

  const buttonsProps = {
    handleStep,
    next: true,
  };

  try {
    errorsplitAddres = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.address`,
    );
    errorSplitTransferPerc = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.percentTransferPercentage`,
    );
    errorSplitITOPerc = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.percentITOPercentage`,
    );
    errorSplitPercentITOFixed = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.percentITOFixed`,
    );
  } catch {
    errorsplitAddres = null;
    errorSplitTransferPerc = null;
    errorSplitITOPerc = null;
    errorSplitPercentITOFixed = null;
  }

  if (splitRoyalties) {
    buttonsProps.next = true;
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

  return !splitRoyalties ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.royalties.royalties')}</p>
        <p>{t('wizards:common.advancedOptions.royalties.splitRoyalties')}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.royalties.wantToSplitRoyalties')}
        </p>
        <ButtonsContainer columnDirection>
          <WizardButton
            centered
            onClick={() => {
              setSplitRoyalties(true);
            }}
          >
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton secondary centered onClick={() => handleStep(10)}>
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>
        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:common.advancedOptions.royalties.whatSplitRoyalties')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.royalties.royaltyReceiverAddress')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.royalties.splitRoyalties')}</p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.royalties.splitRoyalties')}{' '}
          {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>{t('wizards:common.advancedOptions.royalties.howRoyaltiesSplit')}</p>
        <GenericInput
          error={errorsplitAddres}
          type="text"
          autoFocus={true}
          {...register(`royalties.splitRoyalties[${currentIndex}].address`, {
            minLength: {
              value: 62,
              message: 'This field must have 62 characters',
            },
            maxLength: {
              value: 62,
              message: 'This field must have 62 characters',
            },
          })}
          placeholder="Address"
        />
        <p>
          {t('wizards:common.advancedOptions.royalties.royaltyReceiverAddress')}
        </p>
        {errorsplitAddres && (
          <ErrorMessage>{errorsplitAddres?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorSplitTransferPerc}
          type="number"
          {...register(
            `royalties.splitRoyalties[${currentIndex}].percentTransferPercentage`,
            {
              pattern: { value: /\d+/g, message: 'Value must be only numbers' },
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="Transfer Percentage"
        />
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.transferPercentageReceiverAddressFee',
          )}
        </p>
        {errorSplitTransferPerc && (
          <ErrorMessage>{errorSplitTransferPerc?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorSplitITOPerc}
          type="number"
          {...register(
            `royalties.splitRoyalties[${currentIndex}].percentITOPercentage`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="ITO Percentage"
        />
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.percentITOPercentageReceiverAddressFee',
          )}
        </p>
        {errorSplitITOPerc && (
          <ErrorMessage>{errorSplitITOPerc?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorSplitPercentITOFixed}
          type="number"
          {...register(
            `royalties.splitRoyalties[${currentIndex}].percentITOFixed`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="ITO Fixed"
        />
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.itoFixedReceiverAddressFee',
          )}
        </p>
        {errorSplitPercentITOFixed && (
          <ErrorMessage>{errorSplitPercentITOFixed?.message}</ErrorMessage>
        )}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:common.remove')}
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
          <span>{t('wizards:common.addAnother', { text: 'Address' })}</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};
