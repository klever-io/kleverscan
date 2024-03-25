import { Transactions as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Table, { ITable } from '@/components/TableV2';
import { Status, TimestampInfo } from '@/components/TableV2/styles';
import Tooltip from '@/components/Tooltip';
import TransactionsFilters from '@/components/TransactionsFilters';
import api from '@/services/api';
import { CenteredRow, Container, DoubleRow, Header } from '@/styles/common';
import { setQueryAndRouter } from '@/utils';
import { capitalizeString } from '@/utils/convertString';
import { findReceipt } from '@/utils/findKey';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import { TransactionType } from '@klever/sdk-web';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  IAssetTransactionResponse,
  IClaimReceipt,
  IReceipt,
  IRowSection,
  ITransaction,
} from '../../types';
import {
  Contract,
  ContractsName,
  IContract,
  ITransferContract,
} from '../../types/contracts';
import {
  contractTypes,
  filteredSections,
  getLabelForTableField,
  transactionTableHeaders,
} from '../../utils/contracts';

interface IRequestTxQuery {
  asset?: string;
}

export const toAddressSectionElement = (toAddress: string): JSX.Element => {
  if (toAddress === '--') {
    return (
      <span data-testid="toAddressEmpty" style={{ cursor: 'default' }}>
        {toAddress}
      </span>
    );
  }
  return (
    <Link href={`/account/${toAddress}`} key={toAddress}>
      <a className="address">{parseAddress(toAddress, 16)}</a>
    </Link>
  );
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

  const localQuery = { ...router.query, page, limit };
  const transactionsResponse = await api.get({
    route: `transaction/list`,
    query: query ?? localQuery,
  });

  const assets: string[] = [];

  transactionsResponse?.data?.transactions.forEach(
    (transaction: ITransaction) => {
      if (transaction.contract && transaction.contract.length) {
        transaction.contract.forEach(contract => {
          if (contract.parameter === undefined) return;

          if ('assetId' in contract.parameter && contract.parameter.assetId) {
            assets.push(contract.parameter.assetId);
          }
          if (
            'currencyID' in contract.parameter &&
            contract.parameter.currencyID
          ) {
            assets.push(contract.parameter.currencyID);
          }

          if (contract.type === TransactionType.Claim) {
            const claimReceipt = findReceipt(transaction.receipts, 17) as
              | IClaimReceipt
              | undefined;
            if (claimReceipt?.assetIdReceived) {
              assets.push(claimReceipt?.assetIdReceived);
            }
          }
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

          if ('assetId' in contract.parameter && contract.parameter.assetId) {
            transaction.precision = assetPrecisions[contract.parameter.assetId];
          }
          if (
            'currencyID' in contract.parameter &&
            contract.parameter.currencyID
          ) {
            transaction.precision =
              assetPrecisions[contract.parameter.currencyID];
          }
          if (contract?.type === TransactionType.Claim) {
            const claimReceipt = findReceipt(transaction.receipts, 17) as
              | IClaimReceipt
              | undefined;
            if (claimReceipt?.assetIdReceived) {
              transaction.precision =
                assetPrecisions[claimReceipt.assetIdReceived];
            }
          }
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

const Transactions: React.FC = () => {
  const router = useRouter();

  const getContractType = useCallback(contractTypes, []);
  const getCustomFields = (
    contract: IContract[],
    receipts: IReceipt[],
    precision?: number,
  ): JSX.Element[] => {
    const contractType = getContractType(contract);
    const filteredSectionsResult = filteredSections(
      contract,
      contractType,
      receipts,
      precision,
    );
    if (contractType === 'Multi contract') {
      const extraHeadersLength = 0;
      return Array(extraHeadersLength)
        .fill(extraHeadersLength)
        .map(_ => <span key={Math.random()}>--</span>);
    }
    return filteredSectionsResult;
  };

  const rowSections = (props: ITransaction): IRowSection[] => {
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
    } = props;

    let toAddress = '- -';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
    }

    const customFields = getCustomFields(contract, receipts, precision);

    const sections = [
      {
        element: (
          <DoubleRow key={hash}>
            <CenteredRow className="bucketIdCopy">
              <Link href={`/transaction/${hash}`}>
                {parseAddress(hash, 24)}
              </Link>
              <Copy info="TXHash" data={hash} />
            </CenteredRow>
            <CenteredRow>
              <TimestampInfo>{formatDate(timestamp)}</TimestampInfo>
              <Status status={status.toLowerCase()}>
                {capitalizeString(status)}
              </Status>
            </CenteredRow>
          </DoubleRow>
        ),
        span: 2,
      },
      {
        element: (
          <DoubleRow key={blockNum}>
            <Link href={`/block/${blockNum || 0}`}>
              <a className="address">{blockNum || 0}</a>
            </Link>
            <span>
              {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
            </span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: (
          <DoubleRow key={sender}>
            <Link href={`/account/${sender}`}>
              <a className="address">{parseAddress(sender, 16)}</a>
            </Link>
            {toAddressSectionElement(toAddress)}
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element:
          contractType === 'Multi contract' ? (
            <DoubleRow>
              <MultiContractToolTip
                contract={contract}
                contractType={contractType}
              />
              <CenteredRow>- -</CenteredRow>
            </DoubleRow>
          ) : (
            <DoubleRow>
              <CenteredRow key={contractType}>
                {ContractsName[contractType]}
              </CenteredRow>
              <CenteredRow>
                {getLabelForTableField(contractType)?.[0] ? (
                  <Tooltip
                    msg={getLabelForTableField(contractType)[0]}
                    Component={() => <span>{customFields[0]}</span>}
                  />
                ) : (
                  <span> - - </span>
                )}
              </CenteredRow>
            </DoubleRow>
          ),
        span: 1,
      },
      {
        element: contractType ? (
          <DoubleRow>
            {getLabelForTableField(contractType)?.[1] ? (
              <Tooltip
                msg={getLabelForTableField(contractType)[1]}
                Component={() => <span>{customFields[1]}</span>}
              />
            ) : (
              <span> - - </span>
            )}
            {getLabelForTableField(contractType)?.[2] ? (
              <Tooltip
                msg={getLabelForTableField(contractType)[2]}
                Component={() => <span>{customFields[2]}</span>}
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
    ];

    return sections;
  };

  const transactionsFiltersProps = {
    setQuery: setQueryAndRouter,
  };

  const Filters = () => {
    return <TransactionsFilters {...transactionsFiltersProps} />;
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: transactionTableHeaders,
    rowSections,
    dataName: 'transactions',
    scrollUp: true,
    request: (page, limit) => requestTransactionsDefault(page, limit, router),
    Filters,
  };

  return (
    <Container>
      <Header>
        <Title title="Transactions" Icon={Icon} />
      </Header>

      <Table {...tableProps} />
    </Container>
  );
};

export default Transactions;
