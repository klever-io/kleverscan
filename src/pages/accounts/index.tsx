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

/** Widths and spans with no cell content: the shared Table calls `rowSections`
 *  with a header string to read them, twice per header cell on every render,
 *  and answering from here keeps the real builder off that path. */
const COLUMN_LAYOUT: IRowSection[] = [
  { element: () => null, span: 2 },
  { element: () => null, span: 1, width: 100 },
  { element: () => null, span: 1, width: 190 },
  { element: () => null, span: 1, width: 190 },
];

const Accounts: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'accounts', 'table']);

  // Inside the component so the row actions can be translated.
  const rowSections = (account: IAccount | string): IRowSection[] => {
    // The shared Table calls this with a header string to read column widths;
    // handled explicitly so a future dereference of the argument cannot crash.
    if (typeof account !== 'object' || account === null) return COLUMN_LAYOUT;

    const { address, balance, frozenBalance, nonce, timestamp } = account;
    const badges = accountBadges(address, timestamp, genesisTimestamp, owners);

    return [
      {
        element: () => (
          <IdentityCell>
            {/* The whole address and no `title`: a tooltip repeating visible
                text is announced twice by some screen readers, and the tail of
                a bech32 address is its checksum, the part a look-alike grind
                hides. Below tablet width the mobile card takes over. */}
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
  // Eager only for the filter that decides which rows exist from this set:
  // under `foundation` it would put three validator pages before the rows.
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
    // No refreshKey: the request awaits its own sources and the badges
    // recompute on a plain re-render, leaving a changing key nothing to do.
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
