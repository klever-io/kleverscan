import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { smartContractsTableRequest } from '@/services/requests/smartContracts';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IRowSection } from '@/types';
import { SmartContractsList } from '@/types/smart-contract';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { formatDate } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import Filters from '../SmartContractFilters';
import { CardsTitleWrapper } from './styles';

interface IRequestQuery {
  deployer?: string;
  orderBy?: 'desc' | 'asc';
  sortBy?: 'timestamp' | 'totalTransactions';
}

const smartContractsListRowSections = (
  smartContracts: SmartContractsList,
): IRowSection[] => {
  const {
    name,
    deployTxHash,
    deployer,
    timestamp,
    upgrades,
    totalTransactions,
    contractAddress,
  } = smartContracts;

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
              data-testid="smart-contract-link"
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
        <DoubleRow>
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

const BrowseAllDeployedContracts: React.FC<PropsWithChildren> = () => {
  const router = useRouter();

  const tableProps: ITable = {
    type: 'smartContracts',
    header: smartContractsTableHeaders,
    rowSections: smartContractsListRowSections,
    request: (page, limit) =>
      smartContractsTableRequest(page, limit, router.query),
    dataName: 'sc',
    Filters,
  };

  return (
    <>
      <CardsTitleWrapper>
        <h3>Browse All Deployed Contracts</h3>
      </CardsTitleWrapper>
      <Table {...tableProps} />
    </>
  );
};

export default BrowseAllDeployedContracts;
