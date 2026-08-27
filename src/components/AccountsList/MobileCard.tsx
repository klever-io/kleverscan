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

/**
 * Card layout for mobile and tablet: the address with its row actions on top,
 * then the balance, then staked and nonce on one meta line. Replaces the
 * generic heading-per-cell card the shared Table falls back to, which laid the
 * four cells out in a two-column grid and left the last half empty.
 */
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
        {/* No `defaultValue` on these four, so they read the same way the
            desktop row calls the same keys. A key nobody added shows up as a
            failing test rather than as readable text here and a raw key
            there. */}
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
        {/* Translated, unlike the desktop column heading of the same name:
            that one doubles as a sort key, which is what issue #678 is about.
            This label carries no such duty. */}
        <MobileMetaItem>
          {t('accounts:List.Nonce')} {nonce}
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default AccountsMobileCard;
