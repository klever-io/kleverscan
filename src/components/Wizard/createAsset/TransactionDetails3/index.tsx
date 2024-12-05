import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ReviewContainer,
} from '../styles';

export const TransactionDetails3: React.FC<
  PropsWithChildren<{ assetType?: number }>
> = ({ assetType }) => {
  const { t } = useTranslation(['wizards', 'common']);
  const { watch } = useFormContext();
  const properties = watch('properties');
  const assetText = assetType === 0 ? 'TOKEN' : 'NFT';

  return (
    <ReviewContainer>
      <span>
        {assetText} {t('wizards:common.transactionDetails.defaultSettings')}
      </span>
      <ConfirmCardBasics>
        {assetType === 0 && (
          <ConfirmCardBasisInfo>
            <span>{t('common:Properties.Staking')}</span>
            <span>--</span>
          </ConfirmCardBasisInfo>
        )}
        <ConfirmCardBasisInfo>
          <span>{t('common:Properties.Roles')}</span>
          <span>--</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Freeze')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canFreeze
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Burn')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canBurn
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Pause')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canPause
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Add Roles')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canAddRoles
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Mint')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canMint
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Change Owner')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canChangeOwner
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Wipe')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canWipe
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
