import { Transactions as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Table, { ITable } from '@/components/TableV2';
import {
  CustomFieldWrapper,
  Status,
  TimestampInfo,
} from '@/components/TableV2/styles';
import Tooltip from '@/components/Tooltip';
import TransactionsFilters from '@/components/TransactionsFilters';
import api from '@/services/api';
import { CenteredRow, Container, DoubleRow, Header } from '@/styles/common';
import { capitalizeString } from '@/utils/convertString';
import { findReceipt } from '@/utils/findKey';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import { TransactionType } from '@klever/sdk-web';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
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
  IBuyContractPayload,
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
  if (toAddress === '- -') {
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

const getAssetsAndCurreciesList = (
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
  if (contract?.type === TransactionType.Claim) {
    const claimReceipt = findReceipt(transaction.receipts, 17) as
      | IClaimReceipt
      | undefined;
    if (claimReceipt?.assetIdReceived) {
      assets.push(claimReceipt.assetIdReceived);
    }
  }
  if (contract?.type === TransactionType.BuyOrder) {
    const buyContract = transaction.contract[0]
      ?.parameter as IBuyContractPayload;

    if (buyContract.buyType === 'ITOBuy' && buyContract?.id) {
      assets.push(buyContract.id);
    }
  }

  return assets;
};

const getTransactionPrecision = (
  contract: IContract,
  transaction: ITransaction,
  assetPrecisions: { [key: string]: number },
): number | undefined => {
  if (contract.parameter === undefined) return;

  if (contract?.type === TransactionType.Claim) {
    const claimReceipt = findReceipt(transaction.receipts, 17) as
      | IClaimReceipt
      | undefined;
    if (claimReceipt?.assetIdReceived) {
      return assetPrecisions[claimReceipt.assetIdReceived];
    }
  }
  if (contract?.type === TransactionType.BuyOrder) {
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
    return assetPrecisions[contract.parameter.assetId];
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
          assets.push(...getAssetsAndCurreciesList(contract, transaction));
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

const getContractType = contractTypes;

const getCustomFields = (
  contract: IContract[],
  receipts: IReceipt[],
  precision?: number,
  data?: string[],
): JSX.Element[] => {
  const contractType = getContractType(contract);
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

  let toAddress = '- -';
  const contractType = getContractType(contract);

  if (contractType === Contract.Transfer) {
    const parameter = contract[0].parameter as ITransferContract;

    toAddress = parameter.toAddress;
  }

  const customFields = getCustomFields(contract, receipts, precision, data);

  const sections = [
    {
      element: (
        <DoubleRow key={hash}>
          <CenteredRow className="bucketIdCopy">
            <Link href={`/transaction/${hash}`}>{parseAddress(hash, 24)}</Link>
            <Copy info="TXHash" data={hash} />
          </CenteredRow>
          <CenteredRow>
            <TimestampInfo>{formatDate(timestamp || Date.now())}</TimestampInfo>
            <Status status={status?.toLowerCase()}>
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
              <span>{ContractsName[contractType]}</span>
            </CenteredRow>
            <CenteredRow>
              {getLabelForTableField(contractType)?.[0] ? (
                <Tooltip
                  msg={getLabelForTableField(contractType)[0]}
                  Component={() => (
                    <CustomFieldWrapper>{customFields[0]}</CustomFieldWrapper>
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
    {
      element: contractType ? (
        <DoubleRow>
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
  ];

  return sections;
};

const Transactions: React.FC = () => {
  const router = useRouter();

  const tableProps: ITable = {
    type: 'transactions',
    header: transactionTableHeaders,
    rowSections: transactionRowSections,
    dataName: 'transactions',
    request: (page, limit) => requestTransactionsDefault(page, limit, router),
    Filters: TransactionsFilters,
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
