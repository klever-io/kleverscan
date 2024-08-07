import { parseAddress } from '@/utils/parseValues';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { infinitySymbol } from '..';
import {
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ReviewContainer,
} from '../styles';

export const TransactionDetails2: React.FC<{
  assetType?: number;
  additionalFields?: boolean;
}> = ({ assetType, additionalFields }) => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const name = watch('name');
  const ticker = watch('ticker');
  const maxSupply = watch('maxSupply');
  const address = watch('ownerAddress');
  const logo = watch('logo');
  let precision = null;
  let initialSupply = null;
  precision = watch('precision');
  initialSupply = watch('initialSupply');

  const assetText = assetType === 0 ? 'Token' : 'NFT';

  return (
    <ReviewContainer>
      <span>
        {(assetText as string).toUpperCase()}{' '}
        {t('common.transactionDetails.basicSettings')}
      </span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>
            {assetText} {t('common.name')}
          </span>
          <span>{name}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {assetText} {t('common.ticker')}
          </span>
          <span>{ticker.toUpperCase()}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.maxSupply')}</span>
          <span>{maxSupply ? maxSupply : infinitySymbol}</span>
        </ConfirmCardBasisInfo>

        <ConfirmCardBasisInfo>
          <span>{t('common.URI', { assetText })}</span>
          <span>{logo || '--'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.basicOptions.ownerAddress')}</span>
          <span>{parseAddress(address, 12)}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
