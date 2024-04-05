import Copy from '@/components/Copy';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import {
  CustomFieldWrapper,
  Status,
  TimestampInfo,
} from '@/components/TableV2/styles';
import Tooltip from '@/components/Tooltip';
import { useHomeData } from '@/contexts/mainPage';
import {
  getCustomFields,
  requestTransactionsDefault,
  toAddressSectionElement,
} from '@/pages/transactions';
import { CenteredRow, DoubleRow } from '@/styles/common';
import { IRowSection, ITransaction } from '@/types';
import { Contract, ContractsName, ITransferContract } from '@/types/contracts';
import { contractTypes, getLabelForTableField } from '@/utils/contracts';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import {
  ArrowUpSquareHideMenu,
  ContainerHide,
  SectionCards,
  TransactionContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Table, { ITable } from '../TableV2';

export const homeTransactionTableHeaders = [
  'Transaction Hash',
  'Block/Fees',
  'From/To',
  'Type',
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
  } = props;

  let toAddress = '- -';
  const contractType = contractTypes(contract);

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
  ];

  return sections;
};

const HomeTransactions: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { transactions: homeTransactions } = useHomeData();
  const [hideMenu, setHideMenu] = useState(false);

  const router = useRouter();

  const tableProps: ITable = {
    type: 'transactions',
    header: homeTransactionTableHeaders,
    rowSections: homeTransactionsRowSections,
    dataName: 'transactions',
    request: (page, limit) => requestTransactionsDefault(page, limit, router),
    showLimit: false,
    showPagination: false,
    smaller: true,
  };

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Last Transactions')}</h1>
        <div onClick={() => setHideMenu(!hideMenu)}>
          <p>{hideMenu ? 'Show' : 'Hide'}</p>
          <ArrowUpSquareHideMenu $hide={hideMenu} />
        </div>
      </ContainerHide>
      <TransactionContainer>
        {!hideMenu && <Table {...tableProps} />}
      </TransactionContainer>
    </SectionCards>
  );
};

export default HomeTransactions;
