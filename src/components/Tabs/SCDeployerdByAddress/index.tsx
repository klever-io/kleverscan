import { IInnerTableProps, IRowSection } from '@/types';
import React, { PropsWithChildren } from 'react';
import { smartContractsTableHeaders } from '@/utils/contracts';
import Table, { ITable } from '@/components/Table';
import { SmartContractsList } from '@/types/smart-contract';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { parseAddress } from '@/utils/parseValues';
import { Copy } from '@/assets/icons';
import { formatDate } from '@/utils/formatFunctions';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSmartContractsList from '@/components/SmartContracts/useSmartContractsList';

interface ISCDepoyedByAddress {
  smartContractsTableProps: IInnerTableProps;
  address: string;
}

const SCDeployerdByAddress: React.FC<
  PropsWithChildren<ISCDepoyedByAddress>
> = ({ smartContractsTableProps, address }) => {
  const router = useRouter();
  const { request, Filters } = useSmartContractsList(
    'Recent Transactions',
    address,
  );

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
          <DoubleRow>
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
          <CenteredRow>
            <span>{totalTransactions}</span>
          </CenteredRow>
        ),
        span: 1,
      },

      {
        element: props => (
          <CenteredRow>
            <Link
              href={`/smart-contract/${contractAddress}`}
              key={contractAddress}
            >
              <Mono>{parseAddress(deployer, 25)}</Mono>
            </Link>
            <Copy data={deployer} info="deployer" />
          </CenteredRow>
        ),
        span: 1,
      },

      {
        element: props => (
          <DoubleRow>
            <CenteredRow>
              <Link href={''}>
                <Mono>{parseAddress(deployTxHash, 25)}</Mono>
              </Link>
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
    request: (page, limit) => request(page, limit, router),
    dataName: 'smartContracts',
    showLimit: true,
    Filters,
  };

  return <Table {...tableProps} />;
};

export default SCDeployerdByAddress;
