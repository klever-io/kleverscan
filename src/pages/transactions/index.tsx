import { Transactions as Icon } from '@/assets/title-icons';
import ExplorerLink from '@/components/ExplorerLink';
import Title from '@/components/Layout/Title';
import LinkWithDropdown from '@/components/LinkWithDropdown';
import Table, { ITable } from '@/components/Table';
import { useTransactionHeaders } from '@/components/TransactionsList/useTransactionHeaders';
import {
  getTransactionColumns,
  listsWholeChain,
  showsInOut,
  TransactionColumnKey,
} from '@/components/TransactionsList/columns';
import { BadgePill, VisuallyHidden } from '@/components/DataList/styles';
import { CustomFieldWrapper } from '@/components/Table/styles';
import {
  DIRECTION_GLYPHS,
  InOutBadge,
  MultiContractBadge,
  statusVariant,
  TransactionTypeBadge,
} from '@/components/TransactionsList/badges';
import TransactionsMobileCard from '@/components/TransactionsList/MobileCard';
import ContractTargetLabel from '@/components/TransactionsList/ContractTargetLabel';
import {
  getTransactionRowDetails,
  valueDirection,
} from '@/components/TransactionsList/rowDetails';
import TransactionsSummary from '@/components/TransactionsList/Summary';
import TransactionsTable from '@/components/TransactionsList/Table';
import {
  ContractMark,
  DirectionStatusBadge,
} from '@/components/TransactionsList/styles';
import Tooltip from '@/components/Tooltip';
import TransactionsFilters from '@/components/TransactionsFilters';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { CenteredRow, Container, Header, Mono } from '@/styles/common';
import {
  IAssetTransactionResponse,
  IClaimReceipt,
  IReceipt,
  IRowSection,
  ITransaction,
} from '@/types';
import {
  ContractsName,
  IBuyContractPayload,
  IContract,
} from '@/types/contracts';
import {
  contractTypes,
  filteredSections,
  getLabelForTableField,
} from '@/utils/contracts';
import { capitalizeString } from '@/utils/convertString';
import { findReceipt } from '@/utils/findKey';
import {
  formatAmount,
  formatDate,
  formatDateWithSeconds,
} from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import { TXType } from '@klever/connect';
import { GetServerSideProps } from 'next';
import { MdOutlineDescription } from 'react-icons/md';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import React, { PropsWithChildren, useCallback } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

interface IRequestTxQuery {
  asset?: string;
  address?: string;
}

export const toAddressSectionElement = (
  toAddress: string,
  chars = 16,
): React.ReactElement => {
  if (toAddress === '--') {
    return <Mono>{toAddress}</Mono>;
  }
  return (
    <LinkWithDropdown link={`/account/${toAddress}`} address={toAddress}>
      <Link href={`/account/${toAddress}`} key={toAddress} className="address">
        <Mono>{parseAddress(toAddress, chars)}</Mono>
      </Link>
    </LinkWithDropdown>
  );
};
/** A component, not a render helper: it reads the mobile context, and row
 *  cells are called as plain functions where a hook is illegal (#697). */
export const MobileAddressSection: React.FC<{
  toAddress: string;
  chars?: number;
}> = ({ toAddress, chars = 16 }) => {
  const { isMobile } = useMobile();
  if (isMobile) {
    return (
      <LinkWithDropdown link={`/account/${toAddress}`} address={toAddress}>
        <Mono>{parseAddress(toAddress, chars)}</Mono>
      </LinkWithDropdown>
    );
  }
  return (
    <LinkWithDropdown link={`/account/${toAddress}`} address={toAddress}>
      <Link href={`/account/${toAddress}`} key={toAddress} className="address">
        <Mono>{parseAddress(toAddress, chars)}</Mono>
      </Link>
    </LinkWithDropdown>
  );
};

export const getAssetsAndCurrenciesList = (
  contract: IContract,
  transaction: ITransaction,
): string[] => {
  const assets: string[] = [];
  if (contract.parameter === undefined) return assets;

  if ('assetId' in contract.parameter && contract.parameter.assetId) {
    assets.push(contract.parameter.assetId);
  }
  if ('currencyID' in contract.parameter && contract.parameter.currencyID) {
    assets.push(contract.parameter.currencyID);
  }
  if (contract?.type === TXType.Claim) {
    const claimReceipt = findReceipt(transaction.receipts, 17) as
      | IClaimReceipt
      | undefined;
    if (claimReceipt?.assetIdReceived) {
      assets.push(claimReceipt.assetIdReceived);
    }
  }
  if (contract?.type === TXType.Buy) {
    const buyContract = transaction.contract[0]
      ?.parameter as IBuyContractPayload;

    if (buyContract.buyType === 'ITOBuy' && buyContract?.id) {
      assets.push(buyContract.id);
    }
  }

  return assets;
};

export const getTransactionPrecision = (
  contract: IContract,
  transaction: ITransaction,
  assetPrecisions: { [key: string]: number },
): number | undefined => {
  if (contract.parameter === undefined) return;

  if (contract?.type === TXType.Claim) {
    const claimReceipt = findReceipt(transaction.receipts, 17) as
      | IClaimReceipt
      | undefined;
    if (claimReceipt?.assetIdReceived) {
      return assetPrecisions[claimReceipt.assetIdReceived];
    }
  }
  if (contract?.type === TXType.Buy) {
    const buyContract = transaction.contract[0]
      ?.parameter as IBuyContractPayload;
    if (buyContract.buyType === 'ITOBuy' && buyContract?.id) {
      return assetPrecisions[buyContract.id];
    }
  }

  if ('currencyID' in contract.parameter && contract.parameter.currencyID) {
    return assetPrecisions[contract.parameter.currencyID];
  }

  if ('assetId' in contract.parameter && contract.parameter.assetId) {
    const assetId = contract.parameter.assetId.split('/')[0];
    return assetPrecisions[assetId];
  }

  return;
};

export const requestTransactionsDefault = async (
  page: number,
  limit: number,
  router: NextRouter,
  query?: IRequestTxQuery,
): Promise<IAssetTransactionResponse> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const localQuery: { [key: string]: any } = {
    ...router.query,
    page,
    limit,
  };
  router.query.account && (localQuery['address'] = router.query.account);
  delete localQuery.account;

  const transactionsResponse = await api.get({
    route: `transaction/list`,
    query: query ?? localQuery,
  });

  const assets: string[] = [];

  transactionsResponse?.data?.transactions.forEach(
    (transaction: ITransaction) => {
      if (transaction.contract && transaction.contract.length) {
        transaction.contract.forEach(contract => {
          assets.push(...getAssetsAndCurrenciesList(contract, transaction));
        });
      }
    },
  );

  const assetPrecisions = await getPrecision(assets);

  const parsedTransactions = transactionsResponse.data?.transactions?.map(
    (transaction: ITransaction) => {
      if (transaction.contract && transaction.contract.length) {
        transaction.contract.forEach(contract => {
          if (contract.parameter === undefined) return;

          transaction.precision = getTransactionPrecision(
            contract,
            transaction,
            assetPrecisions,
          );
        });
      }
      return transaction;
    },
  );
  return {
    ...transactionsResponse,
    data: {
      transactions: parsedTransactions,
    },
  };
};

export const getCustomFields = (
  contract: IContract[],
  receipts: IReceipt[],
  precision?: number,
  data?: string[],
): React.ReactElement[] => {
  const contractType = contractTypes(contract);
  const filteredSectionsResult = filteredSections(
    contract,
    contractType,
    receipts,
    precision,
    data,
  );
  return filteredSectionsResult;
};

export const transactionRowSections = (
  props: ITransaction,
  routeState?: { pathname?: string; query?: ParsedUrlQuery },
): IRowSection[] => {
  const {
    hash,
    blockNum,
    timestamp,
    sender,
    receipts,
    contract,
    kAppFee,
    bandwidthFee,
    status,
    precision,
    data,
  } = props;

  const contractType = contractTypes(contract);
  // The counterparty, the second type badge and the contract-mark tooltip,
  // straight from the raw parameter (the misc columns' element output cannot
  // feed a string tooltip).
  const details = getTransactionRowDetails({
    contract,
    contractType,
    data,
    sender,
    receipts,
  });

  const inOrOut = valueDirection({
    account:
      typeof routeState?.query?.account === 'string'
        ? routeState.query.account
        : undefined,
    sender,
    contractType,
    receipts,
  });

  const customFields = getCustomFields(contract, receipts, precision, data);
  const customLabels = getLabelForTableField(contractType) ?? [];
  // Amount first, else Price: a buy or a sell moves the amount its price
  // names, and those label sets carry no field literally called Amount.
  //
  // This reads a position out of `contractLabels` and uses it to index the
  // elements `filteredSections` built, so the two lists have to stay in the
  // same order. They do today, checked per type: Transfer 0, Freeze 0,
  // Claim 0, Vote 1, Withdraw 1, Buy 2, Sell 2, Deposit 2. Reordering either
  // one alone puts the wrong field in this column with nothing to catch it,
  // and nothing can: both modules reach the ESM dependency Jest cannot
  // transform, so neither is importable by a unit test. If you touch the
  // order in `@/utils/contracts` or `@/utils/transactionListSections`, this
  // is what you break.
  const amountLabelIndex = customLabels.indexOf('Amount');
  const amountIndex =
    amountLabelIndex >= 0 ? amountLabelIndex : customLabels.indexOf('Price');

  // Computed once per row render, not inside the tooltip: the tooltip body
  // mounts on hover, and a fresh formatDate there made the visible elapsed
  // time jump the moment the pointer touched it.
  const ageFullDate = formatDateWithSeconds(timestamp || Date.now());
  // formatDate's elapsed form is "<n> <unit> ago (<date> UTC)"; the column
  // shows the first half, the tooltip the full date.
  const ageElapsed = formatDate(timestamp || Date.now(), {
    showElapsedTime: true,
  }).split(' (')[0];

  const emptyCell = (
    <>
      {/* English like every other literal this builder renders: t() is out
          of reach here, the builder also runs for the header-string probe
          outside any i18n context. */}
      <span aria-hidden="true">- -</span>
      <VisuallyHidden>Not applicable</VisuallyHidden>
    </>
  );

  const sectionByColumn: Record<TransactionColumnKey, IRowSection> = {
    hash: {
      element: props => (
        <CenteredRow key={hash}>
          <ExplorerLink
            type="transaction"
            value={hash}
            label={parseAddress(hash, 14)}
            compact
            dataTestId="transaction-link"
          />
        </CenteredRow>
      ),
      span: 1,
      // Hinted like every other column: the one unhinted column would
      // absorb all of the table's slack and open a gulf behind the hash.
      width: 186,
    },
    type: {
      element: props => (
        <CenteredRow key={contractType}>
          {contractType === 'Multi contract' ? (
            <MultiContractBadge contract={contract} />
          ) : (
            <TransactionTypeBadge
              label={
                ContractsName[contractType as keyof typeof ContractsName] ??
                contractType
              }
              contractType={contractType}
            />
          )}
          {/* The refinement the Misc column used to carry (StakingClaim,
              Mint, MarketBuy, ...), now riding with its type. */}
          {details.typeDetail && (
            <BadgePill $variant="neutral">{details.typeDetail}</BadgePill>
          )}
        </CenteredRow>
      ),
      span: 1,
      width: 191,
    },
    block: {
      element: props => (
        <ExplorerLink type="block" value={String(blockNum || 0)} compact />
      ),
      span: 1,
      width: 98,
    },
    age: {
      element: props => (
        <Tooltip
          msg={ageFullDate}
          focusable
          Component={() => (
            <CustomFieldWrapper>{ageElapsed}</CustomFieldWrapper>
          )}
        />
      ),
      span: 1,
      width: 114,
    },
    from: {
      element: props => (
        <CenteredRow key={sender}>
          {/* 16, the same as everywhere else, and not the 12 this column
              briefly used to buy width.

              A bech32 address ends in a six character checksum and opens with
              a constant prefix, so 12 shows an attacker two free characters
              to reproduce where 16 shows six: 2^40 against 2^60, hours of
              grinding on one GPU against longer than anyone will wait. That
              is the price of a poisoned row whose From cell reads exactly
              like a real one, and the cell offers a prefilled transfer.

              The width it bought did not settle anything either. Measured at
              this font, the four characters are 33.7px a column and 67px
              across both, against a 100px overflow at a 1100px viewport: the
              table scrolled sideways at 12 as well, and at 1280 it scrolls at
              neither. */}
          <MobileAddressSection toAddress={sender} chars={16} />
        </CenteredRow>
      ),
      span: 1,
      width: 182,
    },
    direction: {
      element: props => {
        // Glyph and color vary together (arrow, exclamation, clock), so the
        // state survives color blindness; the word rides in the focusable
        // tooltip and in hidden text.
        const DirectionGlyph = DIRECTION_GLYPHS[statusVariant(status)];
        return (
          <CenteredRow key={status}>
            <Tooltip
              msg={capitalizeString(status ?? '')}
              focusable
              Component={() => (
                <DirectionStatusBadge $variant={statusVariant(status)}>
                  <DirectionGlyph size={11} aria-hidden="true" />
                  <VisuallyHidden>
                    {`Status: ${capitalizeString(status ?? '')}`}
                  </VisuallyHidden>
                </DirectionStatusBadge>
              )}
            />
          </CenteredRow>
        );
      },
      span: 1,
      width: 48,
    },
    to: {
      element: props => (
        <CenteredRow key={details.target?.address ?? '--'}>
          {details.target ? (
            <>
              <ExplorerLink
                type={details.target.isContract ? 'smart-contract' : 'account'}
                value={details.target.address}
                label={
                  <ContractTargetLabel
                    address={details.target.address}
                    isContract={details.target.isContract}
                    truncateTo={16}
                  />
                }
                // The label brings its own typography: a resolved contract
                // name is words, the address it falls back to is a hash.
                mono={false}
                compact
              />
              {/* After the address, not before: this way every address in
                  the column starts at the same x. */}
              {details.target.isContract && (
                <Tooltip
                  msg={details.contractTooltip ?? 'Contract'}
                  focusable
                  Component={() => (
                    <ContractMark>
                      <MdOutlineDescription size={14} aria-hidden="true" />
                      <VisuallyHidden>
                        {details.contractTooltip ?? 'Contract'}
                      </VisuallyHidden>
                    </ContractMark>
                  )}
                />
              )}
            </>
          ) : (
            emptyCell
          )}
        </CenteredRow>
      ),
      span: 1,
      // Follows ContractName's own box, which holds a 16-character address at
      // 160px; 150 here left the column hint disagreeing with its content.
      width: 205,
    },
    inOut: {
      element: props => (
        <CenteredRow key={inOrOut}>
          {/* No badge where the transaction says nothing about direction: a
              delegation aimed at this validator, or a send that failed and
              moved nothing. Claiming one would be worse than leaving it. */}
          {inOrOut ? <InOutBadge direction={inOrOut} /> : emptyCell}
        </CenteredRow>
      ),
      span: 1,
      width: 70,
    },
    amount: {
      element: props => (
        <CenteredRow>
          {amountIndex >= 0 && customFields[amountIndex]
            ? customFields[amountIndex]
            : emptyCell}
        </CenteredRow>
      ),
      span: 1,
      width: 150,
    },
    fee: {
      element: props => (
        <span>
          {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
        </span>
      ),
      span: 1,
      width: 104,
    },
  };

  // Ordered by the column list rather than assembled here, so the cells and
  // the headings above them come from the same decision.
  return getTransactionColumns({ showInOut: showsInOut(routeState ?? {}) }).map(
    column => sectionByColumn[column.key],
  );
};

/**
 * Companion to `useTransactionHeaders`: the account that decides the In/Out
 * direction comes from the URL, and a row builder is called by the table
 * rather than mounted, so it cannot read a hook itself.
 */
export const useTransactionRowSections = (): ((
  props: ITransaction,
) => IRowSection[]) => {
  const { pathname, query } = useRouter();

  return useCallback(
    (props: ITransaction) => transactionRowSections(props, { pathname, query }),
    [pathname, query],
  );
};

const Transactions: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'transactions']);
  const header = useTransactionHeaders();
  const rowSections = useTransactionRowSections();

  const tableProps: ITable = {
    type: 'transactions',
    header,
    rowSections,
    dataName: 'transactions',
    request: (page, limit) => requestTransactionsDefault(page, limit, router),
    Filters: TransactionsFilters,
    MobileCard: TransactionsMobileCard,
    singleLineSkeleton: true,
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Transactions')} Icon={Icon} />
      </Header>

      {/* Only above an unscoped list. Every filter this page offers narrows
          the rows below while leaving these figures chain-wide, so above a
          filtered table they would describe something the reader is not
          looking at. `?account=` is one of those filters: the query is mapped
          onto `address` before the request goes out. */}
      {listsWholeChain(router) && <TransactionsSummary />}

      <TransactionsTable {...tableProps} />
    </Container>
  );
};

/**
 * The page carried no data method at all, so it loaded no translation
 * namespace and `t()` here would have returned its own key. Server-rendered
 * rather than static: `_app` defines getInitialProps, which already disables
 * static optimisation app-wide, so this changes what the page receives and not
 * how it renders. getStaticProps would have changed how it renders, by turning
 * `router.isReady` false on the first render of any URL carrying a query
 * string, which is every filtered link into this page.
 */
export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'transactions'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Transactions;
