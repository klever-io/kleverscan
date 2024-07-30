import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  BackArrowSpan,
  ButtonsContainer,
  WizardButton,
  WizardRightArrowSVG,
} from '../styles';
interface IButtonsComponents {
  buttonsProps: {
    handleStep: React.Dispatch<React.SetStateAction<number>>;
    previousStep?: React.Dispatch<React.SetStateAction<number>>;
    next: boolean;
    isLastStep?: boolean;
  };
  noNextButton?: boolean;
  showAdvanced?: boolean;
  isRow?: boolean;
}

export const ButtonsComponent: React.FC<
  PropsWithChildren<IButtonsComponents>
> = ({
  buttonsProps: { handleStep, next, previousStep },
  noNextButton = false,
  isRow = true,
}) => {
  const { t } = useTranslation('wizards');
  const { trigger } = useFormContext();
  const handleClick = () => {
    trigger();
    if (next && handleStep) {
      handleStep(prev => prev + 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      trigger();
      if (next && handleStep) {
        handleStep(prev => prev + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (previousStep) {
      previousStep(prev => prev - 1);
      return;
    }
    handleStep && handleStep(prev => prev - 1);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleStep, next, trigger]);

  return (
    <ButtonsContainer isRow={isRow}>
      <BackArrowSpan onClick={handlePreviousStep}>
        <WizardLeftArrow />
      </BackArrowSpan>
      {noNextButton ? (
        <></>
      ) : (
        <WizardButton type="button" onClick={handleClick} isDisabled={!next}>
          <p>{t('common.next')}</p>
          <WizardRightArrowSVG />
        </WizardButton>
      )}
    </ButtonsContainer>
  );
};
