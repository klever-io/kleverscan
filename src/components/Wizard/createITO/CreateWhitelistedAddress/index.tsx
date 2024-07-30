import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IWizardComponents } from '../../createAsset';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  BorderedButton,
  ErrorMessage,
  GenericCardContainer,
  GenericInput,
  UriButtonsContainer,
  WizardRightArrowSVG,
} from '../../createAsset/styles';

export const CreateWhitelistedAddress: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, previousStep, t }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'whitelistInfo',
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let errorWhitelistedAddress = null;
  let errorWhitelistedLimit = null;

  const ticker = watch('ticker');

  const buttonsProps = {
    handleStep,
    previousStep,
    next: true,
  };

  try {
    errorWhitelistedAddress = eval(
      `errors?.whitelistInfo[${currentIndex}].address`,
    );
    errorWhitelistedLimit = eval(
      `errors?.whitelistInfo[${currentIndex}].limit`,
    );
  } catch {
    errorWhitelistedAddress = null;
    errorWhitelistedLimit = null;
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
  }, []);

  return (
    <GenericCardContainer alignCenter key={currentIndex}>
      <div>
        <p>{t('wizards:createITO.steps.whitelist')}</p>
        <p key={fields.length}>
          {t('wizards:createITO.steps.whitelistedAddress')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistAddressAndLimit')}</p>
        <p></p>
        <GenericInput
          error={errorWhitelistedLimit}
          type="text"
          autoFocus={true}
          {...register(`whitelistInfo[${currentIndex}].address`)}
          placeholder="Address"
        />
        <p>{t('wizards:createITO.steps.whitelistedAddress')}</p>
        {errorWhitelistedAddress && (
          <ErrorMessage>{errorWhitelistedAddress?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorWhitelistedLimit}
          type="number"
          {...register(`whitelistInfo[${currentIndex}].limit`, {
            valueAsNumber: true,
          })}
          placeholder="Limit"
        />
        <p>{t('wizards:createITO.steps.maxAmountOfTokens')}</p>
        {errorWhitelistedLimit && (
          <ErrorMessage>{errorWhitelistedLimit?.message}</ErrorMessage>
        )}

        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:createITO.steps.removeAddress')}
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
          <span>{t('wizards:createITO.steps.addAnotherAddress')}</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};
