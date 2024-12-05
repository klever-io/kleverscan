import { parseAddress } from '@/utils/parseValues';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ReviewContainer,
} from '../styles';

export const TransactionDetails: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const address = watch('ownerAddress');
  return (
    <ReviewContainer>
      <span>{t('common.transactionDetails.transactionDetails')}</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.transaction')}</span>
          <span>{t('common.transactionDetails.createAsset')}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.from')}</span>
          <span>{parseAddress(address, 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.fee')}</span>
          <span>20,000 KLV</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
