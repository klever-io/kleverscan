import { PropsWithChildren } from 'react';
import { PurpleArrowRight } from '@/assets/icons';
import Copy from '@/components/Copy';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import {
  CustomFieldWrapper,
  Status,
  TimestampInfo,
} from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { homeDefaultInterval, useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { getCustomFields, toAddressSectionElement } from '@/pages/transactions';
import { defaultPagination } from '@/services/apiCalls';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IPaginatedResponse, IRowSection, ITransaction } from '@/types';
import { Contract, ContractsName, ITransferContract } from '@/types/contracts';
import { contractTypes, getLabelForTableField } from '@/utils/contracts';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import {
  ArrowHide,
  ContainerHide,
  SectionCards,
  TransactionContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import Table, { ITable } from '../../Table';
import api from '@/services/api';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import SkeletonTable from '@/components/SkeletonTable';

export const homeTransactionTableHeaders = [
  'Transaction Hash',
  'Block/Fees',
  'From/To',
  'Type',
];

export const homeTransactionTabletTableHeaders = [
  'Transaction Hash',
  'Type',
  'Block/Fees',
  'From/To',
];

export const homeTransactionsRowSections = (
  props: ITransaction,
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
    nonce,
  } = props;

  let toAddress = '--';
  const contractType = contractTypes(contract);

  if (contractType === Contract.Transfer) {
    const parameter = contract[0].parameter as ITransferContract;

    toAddress = parameter.toAddress;
  }

  const customFields = getCustomFields(contract, receipts, precision, data);

  const sections: IRowSection[] = [
    {
      element: props => (
        <DoubleRow {...props} key={hash}>
          <CenteredRow className="bucketIdCopy">
            <Link href={`/transaction/${hash}`}>
              <Mono>{parseAddress(hash, 24)}</Mono>
            </Link>
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
      element: props => (
        <DoubleRow {...props} key={blockNum}>
          <Link href={`/block/${blockNum || 0}`} className="address">
            {blockNum || 0}
          </Link>
          <span>
            {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
          </span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: props => (
        <DoubleRow {...props} key={sender}>
          <Link href={`/account/${sender}`} className="address">
            <Mono>{parseAddress(sender, 16)}</Mono>
          </Link>
          {toAddressSectionElement(toAddress)}
        </DoubleRow>
      ),
      span: 1,
    },
    {
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
            <CenteredRow>
              <span>
                {ContractsName[contractType as keyof typeof ContractsName]}
              </span>
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
  ];

  return sections;
};

export const homeTransactionsTabletRowSections = (
  props: ITransaction,
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

  let toAddress = '--';
  const contractType = contractTypes(contract);

  if (contractType === Contract.Transfer) {
    const parameter = contract[0].parameter as ITransferContract;

    toAddress = parameter.toAddress;
  }

  const customFields = getCustomFields(contract, receipts, precision, data);

  const sections: IRowSection[] = [
    {
      element: props => (
        <DoubleRow {...props} key={hash}>
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
          <CenteredRow>
            <Link href={`/transaction/${hash}`}>
              <Mono>{parseAddress(hash, 16)}</Mono>
            </Link>
            <Copy info="TXHash" data={hash} svgSize={16} />
          </CenteredRow>
        </DoubleRow>
      ),
      span: 1,
    },
    {
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
            <CenteredRow>
              <span>
                {ContractsName[contractType as keyof typeof ContractsName]}
              </span>
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
      element: props => (
        <DoubleRow {...props} key={blockNum}>
          <Link href={`/block/${blockNum || 0}`} className="address">
            {blockNum || 0}
          </Link>
          <span>
            {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
          </span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: props => (
        <DoubleRow {...props} key={sender}>
          <Link href={`/account/${sender}`} className="address">
            <Mono>{parseAddress(sender, 16)}</Mono>
          </Link>
          {toAddressSectionElement(toAddress)}
        </DoubleRow>
      ),
      span: 1,
    },
  ];

  return sections;
};

const HomeTransactions: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('transactions');
  const {
    transactions: homeTransactions,
    loadingTransactions: loadingTransactions,
  } = useHomeData();
  const [hideMenu, setHideMenu] = useState(false);

  const { isTablet } = useMobile();

  const homeTransactionsCall: (
    page: number,
    limit: number,
  ) => Promise<IPaginatedResponse> = useCallback(
    async (_page = 1, _limit = 10) => {
      const quantity = isTablet ? 5 : 10;

      return {
        data: {
          transactions: (homeTransactions || []).slice(0, quantity),
        },
        error: '',
        code: '',
        pagination: defaultPagination,
      };
    },
    [homeTransactions, isTablet],
  );

  const tableProps: ITable = {
    type: 'transactions',
    header: isTablet
      ? homeTransactionTabletTableHeaders
      : homeTransactionTableHeaders,
    rowSections: isTablet
      ? homeTransactionsTabletRowSections
      : homeTransactionsRowSections,
    dataName: 'transactions',
    request: (page, limit) => homeTransactionsCall(page, limit),
    showLimit: false,
    showPagination: false,
    smaller: true,
    interval: homeDefaultInterval,
  };

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Last Transactions')}</h1>
        <Link
          href={{
            pathname: '/transactions',
          }}
        >
          {' '}
          View All
          <PurpleArrowRight />
        </Link>

        {isTablet ? (
          <div onClick={() => setHideMenu(!hideMenu)}>
            <ArrowHide $hide={hideMenu} />
          </div>
        ) : null}
      </ContainerHide>
      {!loadingTransactions ? (
        <TransactionContainer>
          {!hideMenu && <Table {...tableProps} />}
        </TransactionContainer>
      ) : (
        <TransactionContainer>
          <table>
            <tbody>
              <SkeletonTable items={10} columns={4} />
            </tbody>
          </table>
        </TransactionContainer>
      )}
    </SectionCards>
  );
};

export default HomeTransactions;
