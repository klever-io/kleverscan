import { Copy } from '@/assets/icons';
import ExplorerLink from '@/components/ExplorerLink';
import Filters from '@/components/SmartContracts/SmartContractFilters';
import Table, { ITable } from '@/components/Table';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IInnerTableProps, IRowSection } from '@/types';
import { SmartContractsList } from '@/types/smart-contract';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { formatDate } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
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
              <ExplorerLink
                type="smart-contract"
                value={contractAddress}
                label={parseAddress(contractAddress, 25)}
                compact
              />
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
            <ExplorerLink
              type="account"
              value={deployer}
              label={parseAddress(deployer, 25)}
              compact
            />
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
