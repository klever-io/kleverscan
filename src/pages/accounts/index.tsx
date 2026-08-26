import { Accounts as Icon } from '@/assets/title-icons';
import AccountsMobileCard from '@/components/AccountsList/MobileCard';
import AccountsSummary from '@/components/AccountsList/Summary';
import { AccountsTableWrapper } from '@/components/AccountsList/styles';
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
import { accountsCall } from '@/services/requests/accounts';
import { Container, Header } from '@/styles/common';
import { IAccount, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const klvAmount = (raw: number): string =>
  formatAmount(raw / 10 ** KLV_PRECISION);

const Accounts: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'accounts', 'table']);

  /**
   * Built inside the component so the row actions can be translated, the way
   * the assets list does it. Note the shared Table also calls this with a
   * header *string* to read each column's width, so nothing here may touch the
   * argument outside an `element` closure: those are not invoked for that
   * probe, the destructure below simply yields undefined, and the page keeps
   * rendering its header.
   */
  const rowSections = (account: IAccount): IRowSection[] => {
    const { address, balance, frozenBalance, nonce } = account;

    return [
      {
        element: () => (
          <IdentityCell>
            {/* The whole address, as this page has always shown it here.
                Truncation would have to cut the middle rather than ellipsise,
                because the tail of a bech32 address is its checksum and hiding
                it is what makes a look-alike address cheap to grind. This
                builder only runs above the tablet breakpoint, where the column
                has room; below it the mobile card takes over and shortens. */}
            <AddressLink
              href={`/account/${address}`}
              title={address}
              data-testid="account-link"
            >
              {address}
            </AddressLink>
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

  const header = [
    `${t('table:Address')}`,
    'Nonce',
    `KLV ${t('table:Balance')}`,
    `KLV ${t('table:Staked')}`,
  ];

  const tableProps: ITable = {
    type: 'accounts',
    header,
    rowSections,
    request: (page, limit) => accountsCall(page, limit, router.query),
    dataName: 'accounts',
    MobileCard: AccountsMobileCard,
    singleLineSkeleton: true,
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
