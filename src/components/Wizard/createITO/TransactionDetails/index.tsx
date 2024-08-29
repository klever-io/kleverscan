import { useExtension } from '@/contexts/extension';
import { parseAddress } from '@/utils/parseValues';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ReviewContainer,
} from '../../createAsset/styles';

export const TransactionDetails: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('wizards');
  const { walletAddress } = useExtension();
  return (
    <ReviewContainer>
      <span>{t('common.transactionDetails.transactionDetails')}</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.transaction')}</span>
          <span>{t('createITO.steps.configITO')}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.from')}</span>
          <span>{parseAddress(walletAddress || '', 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.fee')}</span>
          <span>20,000 KLV</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
