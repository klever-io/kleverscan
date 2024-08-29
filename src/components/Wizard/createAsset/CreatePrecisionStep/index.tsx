import { PropsWithChildren, useState } from 'react';
import { IWizardComponents } from '..';
import { useFormContext } from 'react-hook-form';
import {
  GenericCardContainer,
  GenericInfoCard,
  PrecicionsContainer,
  PrecisionCard,
  PrecisionContainer,
} from '../styles';
import { formatPrecision } from '../../utils';
import { ButtonsComponent } from '../ButtonsComponent';

export const CreatePrecisionStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  const { setValue, watch } = useFormContext();
  const precisionWatcher = watch('precision');
  const [precision, setPrecision] = useState<number>(precisionWatcher);
  const ticker = watch('ticker');
  const name = watch('name');

  const handleRegister = (value: number) => {
    setValue('precision', value || 0, { shouldValidate: true });
    setPrecision(value || 0);
  };

  const buttonsProps = {
    handleStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 4/7</p>
      </div>
      <div>
        <p>
          {t('wizards:common.basicOptions.whatTickerPrecision', {
            ticker: ticker,
          })}
        </p>
        <p>{t('wizards:common.basicOptions.precisionHint')}</p>
        <PrecisionContainer key={precision}>
          <div>
            <p>{ticker}</p>
            <p>{name}</p>
          </div>
          <span>{formatPrecision(precision ?? 0)}</span>
        </PrecisionContainer>

        <PrecicionsContainer>
          {Array.from(Array(9).keys()).map((_, index) => (
            <PrecisionCard
              onClick={() => handleRegister(index)}
              key={String(index)}
              $isSelected={precision === index}
            >
              {index}
            </PrecisionCard>
          ))}
        </PrecicionsContainer>
        <GenericInfoCard>
          {t('wizards:common.basicOptions.kleverPrecisionTip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
