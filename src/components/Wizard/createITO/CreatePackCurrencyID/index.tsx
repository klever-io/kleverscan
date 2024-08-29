import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IWizardComponents } from '../../createAsset';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  BorderedButton,
  GenericCardContainer,
  GenericInput,
  UriButtonsContainer,
  WizardRightArrowSVG,
} from '../../createAsset/styles';
import { CreatePacks } from '../CreatePacks';

export const CreatePackCurrencyID: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, previousStep, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { control, watch, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'packInfo',
  });
  const buttonsProps = {
    handleStep,
    previousStep,
    next: true,
  };
  const packInfoID = watch(`packInfo[${currentIndex}].currencyId`);
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

  const getOrder = (num: number) => {
    switch (num) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return `${num}th`;
    }
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {t('wizards:createITO.steps.packsInfo')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div>
        <p>
          {t('wizards:createITO.steps.packInfoFor')}{' '}
          {getOrder(currentIndex + 1)} {t('wizards:createITO.steps.currency')}{' '}
        </p>
        <div key={`packInfo[${currentIndex}].currencyId`}>
          <GenericInput
            type="text"
            autoFocus={true}
            placeholder="Pack Currency ID"
            {...register(`packInfo[${currentIndex}].currencyId`)}
          />
          <p>{t('wizards:createITO.steps.currencyInfo')}</p>
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
          {t('wizards:createITO.steps.removePack')}
        </BorderedButton>
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
            <span> {t('wizards:createITO.steps.addAnotherPack')}</span>
            <FiPlusSquare />
          </BorderedButton>
        </UriButtonsContainer>
        <CreatePacks packInfoIndex={currentIndex} key={currentIndex} />
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
