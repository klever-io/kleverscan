import { Copy } from '@/assets/icons';
import Filters from '@/components/SmartContracts/SmartContractFilters';
import Table, { ITable } from '@/components/Table';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IInnerTableProps, IRowSection } from '@/types';
import { SmartContractsList } from '@/types/smart-contract';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { formatDate } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

interface ISCDeployedByAddress {
  smartContractsTableProps: IInnerTableProps;
}

const SCDeployedByAddress: React.FC<
  PropsWithChildren<ISCDeployedByAddress>
> = ({ smartContractsTableProps }) => {
  const scDeployerListRowSections = (
    props: SmartContractsList,
  ): IRowSection[] => {
    const {
      name,
      deployTxHash,
      deployer,
      timestamp,
      totalTransactions,
      contractAddress,
    } = props;

    return [
      {
        element: props => (
          <DoubleRow key={contractAddress}>
            <CenteredRow>
              <span>{name || '- -'}</span>
            </CenteredRow>
            <CenteredRow>
              <Link
                href={`/smart-contract/${contractAddress}`}
                key={contractAddress}
              >
                <Mono>{parseAddress(contractAddress, 25)}</Mono>
              </Link>
              <Copy data={contractAddress} info="contractAddress" />
            </CenteredRow>
          </DoubleRow>
        ),
        span: 2,
      },

      {
        element: props => (
          <CenteredRow key={contractAddress}>
            <span>{totalTransactions}</span>
          </CenteredRow>
        ),
        span: 1,
      },

      {
        element: props => (
          <CenteredRow key={contractAddress}>
            <Link href={`/account/${deployer}`} key={contractAddress}>
              <Mono>{parseAddress(deployer, 25)}</Mono>
            </Link>
            <Copy data={deployer} info="deployer" />
          </CenteredRow>
        ),
        span: 1,
      },

      {
        element: props => (
          <DoubleRow key={contractAddress}>
            <CenteredRow>
              <Mono>{parseAddress(deployTxHash, 25)}</Mono>
              <Copy data={deployTxHash} info="deployTxHash" />
            </CenteredRow>
            <CenteredRow>
              <span>{formatDate(timestamp)}</span>
            </CenteredRow>
          </DoubleRow>
        ),
        span: 1,
      },
    ];
  };

  const tableProps: ITable = {
    ...smartContractsTableProps,
    type: 'smartContracts',
    header: smartContractsTableHeaders,
    rowSections: scDeployerListRowSections,
    dataName: 'sc',
    showLimit: true,
    Filters,
  };

  return <Table {...tableProps} />;
};

export default SCDeployedByAddress;
