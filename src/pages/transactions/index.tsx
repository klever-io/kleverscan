import { Transactions as Icon } from '@/assets/title-icons';
import ExplorerLink from '@/components/ExplorerLink';
import Title from '@/components/Layout/Title';
import LinkWithDropdown from '@/components/LinkWithDropdown';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Table, { ITable } from '@/components/Table';
import { useTransactionHeaders } from '@/components/TransactionsList/useTransactionHeaders';
import {
  getTransactionColumns,
  showsInOut,
  TransactionColumnKey,
} from '@/components/TransactionsList/columns';
import {
  CustomFieldWrapper,
  InOutSpan,
  Status,
  TimestampInfo,
} from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import TransactionsFilters from '@/components/TransactionsFilters';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  CenteredRow,
  Container,
  DoubleRow,
  Header,
  Mono,
} from '@/styles/common';
import {
  IAssetTransactionResponse,
  IClaimReceipt,
  IReceipt,
  IRowSection,
  ITransaction,
} from '@/types';
import {
  Contract,
  ContractsName,
  IBuyContractPayload,
  IContract,
  ITransferContract,
} from '@/types/contracts';
import {
  contractTypes,
  filteredSections,
  getLabelForTableField,
} from '@/utils/contracts';
import { capitalizeString } from '@/utils/convertString';
import { findReceipt } from '@/utils/findKey';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import { TXType } from '@klever/connect';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

interface IRequestTxQuery {
  asset?: string;
  address?: string;
}
export const toAddressSectionElement = (
  toAddress: string,
): React.ReactElement => {
  if (toAddress === '--') {
    return <Mono>{toAddress}</Mono>;
  }
  return (
    <LinkWithDropdown link={`/account/${toAddress}`} address={toAddress}>
      <Link href={`/account/${toAddress}`} key={toAddress} className="address">
        <Mono>{parseAddress(toAddress, 16)}</Mono>
      </Link>
    </LinkWithDropdown>
  );
};
export const mobileAddressSectionElement = (
  toAddress: string,
): React.ReactElement => {
  const { isMobile } = useMobile();
  if (isMobile) {
    return (
      <LinkWithDropdown link={`/account/${toAddress}`} address={toAddress}>
        <Mono>{parseAddress(toAddress, 16)}</Mono>
      </LinkWithDropdown>
    );
  }
  return (
    <LinkWithDropdown link={`/account/${toAddress}`} address={toAddress}>
      <Link href={`/account/${toAddress}`} key={toAddress} className="address">
        <Mono>{parseAddress(toAddress, 16)}</Mono>
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

export const transactionRowSections = (props: ITransaction): IRowSection[] => {
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
  const router = useRouter();

  let toAddress = '--';
  const contractType = contractTypes(contract);
  if (contractType === Contract.Transfer) {
    const parameter = contract[0].parameter as ITransferContract;

    toAddress = parameter.toAddress;
  }

  const inOrOut = router?.query?.account === sender ? 'Out' : 'In';

  const customFields = getCustomFields(contract, receipts, precision, data);

  const sectionByColumn: Record<TransactionColumnKey, IRowSection> = {
    hash: {
      element: props => (
        <DoubleRow {...props} key={hash}>
          <ExplorerLink
            type="transaction"
            value={hash}
            label={parseAddress(hash, 24)}
            compact
          />
          <CenteredRow>
            <TimestampInfo>
              {formatDate(timestamp || Date.now(), {
                showElapsedTime: true,
              })}
            </TimestampInfo>
            <Status status={status?.toLowerCase()}>
              {capitalizeString(status)}
            </Status>
          </CenteredRow>
        </DoubleRow>
      ),
      span: 2,
    },
    blockFees: {
      element: props => (
        <DoubleRow {...props} key={blockNum}>
          <ExplorerLink type="block" value={String(blockNum || 0)} compact />
          <span>
            {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
          </span>
        </DoubleRow>
      ),
      span: 1,
    },
    fromTo: {
      element: props => (
        <DoubleRow {...props} key={sender}>
          {mobileAddressSectionElement(sender)}
          {toAddressSectionElement(toAddress)}
        </DoubleRow>
      ),
      span: 1,
    },
    inOut: {
      element: props => (
        <DoubleRow {...props} key={inOrOut}>
          <CenteredRow>
            {contractType === 'TransferContractType' ? (
              <InOutSpan status={inOrOut === 'In' ? 'success' : 'pending'}>
                {inOrOut}
              </InOutSpan>
            ) : (
              <InOutSpan status={'icon'}>- -</InOutSpan>
            )}
          </CenteredRow>
        </DoubleRow>
      ),
      span: 1,
    },
    type: {
      element: props =>
        contractType === 'Multi contract' ? (
          <DoubleRow {...props}>
            <MultiContractToolTip
              contract={contract}
              contractType={contractType}
            />
            <CenteredRow>- -</CenteredRow>
          </DoubleRow>
        ) : (
          <DoubleRow {...props}>
            <CenteredRow key={contractType}>
              <span>
                {ContractsName[contractType as keyof typeof ContractsName]}
              </span>
            </CenteredRow>
            <CenteredRow>
              {getLabelForTableField(contractType)?.[0] ? (
                <Tooltip
                  msg={getLabelForTableField(contractType)[0]}
                  Component={() => (
                    <>
                      <CustomFieldWrapper>{customFields[0]}</CustomFieldWrapper>
                    </>
                  )}
                />
              ) : (
                <span> - - </span>
              )}
            </CenteredRow>
          </DoubleRow>
        ),
      span: 1,
    },
    misc: {
      element: props =>
        contractType ? (
          <DoubleRow {...props}>
            {getLabelForTableField(contractType)?.[1] ? (
              <Tooltip
                msg={getLabelForTableField(contractType)[1]}
                Component={() => (
                  <CustomFieldWrapper>{customFields[1]}</CustomFieldWrapper>
                )}
              />
            ) : (
              <span> - - </span>
            )}
            {getLabelForTableField(contractType)?.[2] ? (
              <Tooltip
                msg={getLabelForTableField(contractType)[2]}
                Component={() => (
                  <CustomFieldWrapper>{customFields[2]}</CustomFieldWrapper>
                )}
              />
            ) : (
              <span> - - </span>
            )}
          </DoubleRow>
        ) : (
          <></>
        ),
      span: 1,
    },
  };

  // Ordered by the column list rather than assembled here, so the cells and
  // the headings above them come from the same decision.
  return getTransactionColumns({ showInOut: showsInOut(router) }).map(
    column => sectionByColumn[column.key],
  );
};

const Transactions: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'transactions']);
  const header = useTransactionHeaders();

  const tableProps: ITable = {
    type: 'transactions',
    header,
    rowSections: transactionRowSections,
    dataName: 'transactions',
    request: (page, limit) => requestTransactionsDefault(page, limit, router),
    Filters: TransactionsFilters,
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Transactions')} Icon={Icon} />
      </Header>

      <Table {...tableProps} />
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
