import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  AddressLink,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import { IAccount } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import React from 'react';

export interface IAccountsMobileCardProps {
  item: IAccount;
  index: number;
}

/**
 * Card layout for mobile and tablet: the address with its row actions on top,
 * then the balance, then staked and nonce on one meta line. Replaces the
 * generic heading-per-cell card the shared Table falls back to, which laid the
 * four cells out in a two-column grid and left the last half empty.
 */
const AccountsMobileCard: React.FC<IAccountsMobileCardProps> = ({
  item,
  index,
}) => {
  const { t } = useTranslation(['accounts', 'table']);
  const { address, nonce, balance, frozenBalance } = item;

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <AddressLink
          href={`/account/${address}`}
          title={address}
          data-testid="account-link"
        >
          {parseAddress(address, 20)}
        </AddressLink>
        <RowActions>
          <CopyAction
            value={address}
            label={t('accounts:Common.CopyAddress', {
              defaultValue: 'Copy address',
            })}
            announcement={t('accounts:Common.AddressCopied', {
              defaultValue: 'Address copied to clipboard',
            })}
            large
          />
          <ExplorerLink
            href={`/account/${address}`}
            label={t('accounts:Common.OpenAccount', {
              defaultValue: 'Open account in a new tab',
            })}
            title={t('accounts:Common.OpenInNewTab', {
              defaultValue: 'Open in a new tab',
            })}
            large
          />
        </RowActions>
      </MobileTopRow>
      <MobileTotalRow>
        <MobileMetaItem>{`KLV ${t('table:Balance')}`}</MobileMetaItem>
        <strong>{formatAmount(balance / 10 ** KLV_PRECISION)} KLV</strong>
      </MobileTotalRow>
      <MobileMetaRow>
        <MobileMetaItem>
          {`KLV ${t('table:Staked')}`}{' '}
          {formatAmount(frozenBalance / 10 ** KLV_PRECISION)}
        </MobileMetaItem>
        <MobileMetaItem>Nonce {nonce}</MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default AccountsMobileCard;
