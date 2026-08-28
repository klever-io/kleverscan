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
import { parseAddress } from '@/utils/parseValues';
import AccountBadges from './AccountBadges';
import { accountBadges } from './badges';
import { klvAmount } from './format';
import type { IAccountBadgeSources } from './useAccountBadgeSources';
import { useTranslation } from 'next-i18next';
import React from 'react';

/** Resolved once by the page and handed down, so ten cards do not each
 *  subscribe to the same two queries. */
export type IAccountsMobileCardExtras = IAccountBadgeSources;

export interface IAccountsMobileCardProps extends IAccountsMobileCardExtras {
  item: IAccount;
  index: number;
}

/** Replaces the generic heading-per-cell card the shared Table falls back to,
 *  which laid these four cells out in a two-column grid, half of it empty. */
const AccountsMobileCard: React.FC<IAccountsMobileCardProps> = ({
  item,
  index,
  owners,
  genesisTimestamp,
}) => {
  const { t } = useTranslation(['accounts', 'table']);
  const { address, nonce, balance, frozenBalance, timestamp } = item;
  const badges = accountBadges(address, timestamp, genesisTimestamp, owners);

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
        <AccountBadges badges={badges} />
        {/* No `defaultValue` on these four: a key nobody added fails a test
            instead of reading as text here and a raw key on the desktop row. */}
        <RowActions>
          <CopyAction
            value={address}
            label={t('accounts:Common.CopyAddress')}
            announcement={t('accounts:Common.AddressCopied')}
            large
          />
          <ExplorerLink
            href={`/account/${address}`}
            label={t('accounts:Common.OpenAccount')}
            title={t('accounts:Common.OpenInNewTab')}
            large
          />
        </RowActions>
      </MobileTopRow>
      <MobileTotalRow>
        <MobileMetaItem>{`KLV ${t('table:Balance')}`}</MobileMetaItem>
        <strong>{klvAmount(balance)} KLV</strong>
      </MobileTotalRow>
      <MobileMetaRow>
        <MobileMetaItem>
          {`KLV ${t('table:Staked')}`} {klvAmount(frozenBalance)}
        </MobileMetaItem>
        {/* Translated, unlike the desktop heading of the same name, which
            doubles as a sort key (#678); this label has no such duty. */}
        <MobileMetaItem>
          {t('accounts:List.Nonce')} {nonce}
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default AccountsMobileCard;
