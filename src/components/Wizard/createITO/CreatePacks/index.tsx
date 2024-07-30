import { PropsWithChildren, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IAssetITOInformations } from '..';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  BorderedButton,
  ConfigITOStartTime,
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  UriButtonsContainer,
  WizardRightArrowSVG,
} from '../../createAsset/styles';
import { useTranslation } from 'react-i18next';
import { WizardLeftArrow } from '@/assets/icons';
import { FiPlusSquare } from 'react-icons/fi';

interface IPackInfoITO {
  packInfoIndex: number;
}

export const CreatePacks: React.FC<PropsWithChildren<IPackInfoITO>> = ({
  packInfoIndex,
}) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation('wizards');
  const { fields, append, remove } = useFieldArray({
    control,
    name: `packInfo[${packInfoIndex}].packs`,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let errorPackAmount = null;
  let errorPackPrice = null;

  try {
    errorPackAmount = eval(
      `errors?.packInfo[${packInfoIndex}].packs[${currentIndex}].amount`,
    );
    errorPackPrice = eval(
      `errors?.packInfo[${packInfoIndex}].packs[${currentIndex}].price`,
    );
  } catch {
    errorPackAmount = null;
    errorPackPrice = null;
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

  if (fields.length === 0) append({});

  return (
    <GenericCardContainer>
      <div>
        <p>{t('createITO.steps.createPacks')}</p>
        <p key={fields.length}>
          {t('createITO.steps.packs')} {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={`packInfo[${packInfoIndex}].packs[${currentIndex}]`}>
        <p>
          {' '}
          {t('createITO.steps.packInfoFor')} {packInfoIndex + 1}
        </p>
        <GenericInput
          error={errorPackAmount}
          type="number"
          {...register(
            `packInfo[${packInfoIndex}].packs[${currentIndex}].amount`,
            {
              valueAsNumber: true,
              required: { value: true, message: 'This field is required' },
            },
          )}
          placeholder="Amount"
        />
        <p>{t('createITO.steps.forNFTS')}</p>
        {errorPackAmount && (
          <ErrorMessage>{errorPackAmount?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorPackPrice}
          type="number"
          {...register(
            `packInfo[${packInfoIndex}].packs[${currentIndex}].price`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
              required: { value: true, message: 'This field is required' },
            },
          )}
          placeholder="Price"
        />
        <p>{t('createITO.steps.forNFTS/Tokens')}</p>
        {errorPackPrice && (
          <ErrorMessage>{errorPackPrice?.message}</ErrorMessage>
        )}
      </div>

      <BorderedButton
        type="button"
        onClick={() => {
          remove(currentIndex);
          if (currentIndex !== 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }}
        isHidden={fields.length <= 1}
        fullWidth
      >
        {t('createITO.steps.removePack')}
      </BorderedButton>
      <UriButtonsContainer>
        <div>
          <BorderedButton
            type="button"
            onClick={handlePreviousIndex}
            isHidden={fields.length <= 1}
          >
            <WizardLeftArrow />

            <span>{t('common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>{t('common.next')}</span>
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
          <span>{t('createITO.steps.addAnotherPack')}</span>
          <FiPlusSquare />
        </BorderedButton>
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};
