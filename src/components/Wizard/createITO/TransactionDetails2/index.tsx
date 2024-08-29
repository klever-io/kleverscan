import { parseAddress } from '@/utils/parseValues';
import {
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ReviewContainer,
} from '../../createAsset/styles';
import { infinitySymbol } from '../../createAsset';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { PropsWithChildren } from 'react';

export const TransactionDetails2: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const receiverAddress = watch('receiverAddress');
  const startTime = watch('startTime');
  const startTimeNow = watch('startTimeStartNow');
  const endTime = watch('endTime');
  const maxAmount = watch('maxAmount');
  const status = watch('status');

  const startTimeValue = startTimeNow ? 'Now' : '--';
  return (
    <ReviewContainer>
      <span>{t('createITO.steps.setUpITO')}</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.receiverAddress')}
          </span>
          <span>{parseAddress(receiverAddress, 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.itoTime')}
          </span>
          <span>
            {startTime || startTimeValue} to {endTime || infinitySymbol}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.maxAmount')}
          </span>
          <span>{maxAmount}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.status')}
          </span>
          <span>{status}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
