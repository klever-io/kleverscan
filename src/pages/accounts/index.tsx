import { Accounts as Icon } from '@/assets/title-icons';
import AccountBadges from '@/components/AccountsList/AccountBadges';
import AccountsMobileCard, {
  type IAccountsMobileCardExtras,
} from '@/components/AccountsList/MobileCard';
import AccountsFilters from '@/components/AccountsList/Filters';
import AccountsSummary from '@/components/AccountsList/Summary';
import { accountBadges } from '@/components/AccountsList/badges';
import { accountsFilteredCall } from '@/components/AccountsList/filteredList';
import { klvAmount } from '@/components/AccountsList/format';
import { AccountsTableWrapper } from '@/components/AccountsList/styles';
import { useAccountBadgeSources } from '@/components/AccountsList/useAccountBadgeSources';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  AddressLink,
  AmountMuted,
  AmountPrimary,
  IdentityCell,
  RowActions,
} from '@/components/DataList/styles';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { isAccountFilter } from '@/services/requests/accounts';
import { Container, Header } from '@/styles/common';
import { IAccount, IRowSection } from '@/types/index';
import { useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

/**
 * Widths and spans per column, with no cell content.
 *
 * The shared Table calls `rowSections` with a header string to read these, and
 * that probe happens twice per header cell on every render. Answering it from
 * here keeps the real builder off that path entirely.
 */
const COLUMN_LAYOUT: IRowSection[] = [
  { element: () => null, span: 2 },
  { element: () => null, span: 1, width: 100 },
  { element: () => null, span: 1, width: 190 },
  { element: () => null, span: 1, width: 190 },
];

const Accounts: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'accounts', 'table']);

  // Built inside the component so the row actions can be translated, the way
  // the assets list does it.
  const rowSections = (account: IAccount | string): IRowSection[] => {
    // The shared Table calls this with a header string to read column widths.
    // Handled explicitly rather than relying on a string destructuring to
    // undefined: the compiler cannot catch a future line that dereferences the
    // argument, and the probe runs twice per header cell on every render.
    if (typeof account !== 'object' || account === null) return COLUMN_LAYOUT;

    const { address, balance, frozenBalance, nonce, timestamp } = account;
    const badges = accountBadges(address, timestamp, genesisTimestamp, owners);

    return [
      {
        element: () => (
          <IdentityCell>
            {/* The whole address, as this page has always shown it here, and
                so no `title`: a tooltip repeating the visible text is announced
                twice by some screen readers. The mobile card shortens and does
                carry one.

                Shortening here would have to cut the middle rather than
                ellipsise, because the tail of a bech32 address is its checksum,
                and hiding it is what makes a look-alike address cheap to grind.
                It does not have to: this builder only runs above the tablet
                breakpoint, where the column has the room. Below it the mobile
                card takes over, which the e2e checks. */}
            <AddressLink
              href={`/account/${address}`}
              data-testid="account-link"
            >
              {address}
            </AddressLink>
            <AccountBadges badges={badges} />
            <RowActions>
              <CopyAction
                value={address}
                label={t('accounts:Common.CopyAddress')}
                announcement={t('accounts:Common.AddressCopied')}
              />
              <ExplorerLink
                href={`/account/${address}`}
                label={t('accounts:Common.OpenAccount')}
                title={t('accounts:Common.OpenInNewTab')}
              />
            </RowActions>
          </IdentityCell>
        ),
        span: 2,
      },
      {
        element: () => <AmountMuted>{nonce}</AmountMuted>,
        span: 1,
        width: 100,
      },
      {
        element: () => <AmountPrimary>{klvAmount(balance)} KLV</AmountPrimary>,
        span: 1,
        width: 190,
      },
      {
        element: () => (
          <AmountMuted>{klvAmount(frozenBalance)} KLV</AmountMuted>
        ),
        span: 1,
        width: 190,
      },
    ];
  };

  const queryClient = useQueryClient();
  const filter = isAccountFilter(router.query.type)
    ? router.query.type
    : undefined;
  // Eager only for the filter that decides which rows exist from this set.
  // Under `foundation` the request reads nothing from it, so eagerness there
  // would put three validator pages in front of the rows for nothing.
  const { owners, genesisTimestamp } = useAccountBadgeSources(
    filter === 'genesisValidator',
  );

  const header = [
    `${t('table:Address')}`,
    `${t('accounts:List.Nonce')}`,
    `KLV ${t('table:Balance')}`,
    `KLV ${t('table:Staked')}`,
  ];

  const tableProps: ITable<IAccountsMobileCardExtras> = {
    type: 'accounts',
    header,
    rowSections,
    request: (page, limit) =>
      accountsFilteredCall({
        page,
        limit,
        filter,
        routerQuery: router.query,
        queryClient,
      }),
    dataName: 'accounts',
    // No refreshKey: the filtered request awaits its own sources, and the row
    // badges recompute from a plain re-render when the validator set lands,
    // so there is nothing left for a changing key to trigger.
    Filters: AccountsFilters,
    MobileCard: AccountsMobileCard,
    // Once here, not per card: ten cards calling the hook would open ten
    // subscriptions to the same two queries.
    mobileCardProps: { owners, genesisTimestamp },
    singleLineSkeleton: true,
    rightAlignedSkeletonColumns: [1, 2, 3],
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Accounts')} Icon={Icon} />
      </Header>

      <AccountsSummary />

      <AccountsTableWrapper>
        <Table {...tableProps} />
      </AccountsTableWrapper>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'accounts', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Accounts;
