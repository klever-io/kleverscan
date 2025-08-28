import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SmartContractsList } from '@/types/smart-contract';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { IRowSection } from '@/types';
import Copy from '@/components/Copy';
import api from '@/services/api';
import Table, { ITable } from '@/components/Table';
import { CardsTitleWrapper, InputContractContainer } from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { parseAddress } from '@/utils/parseValues';
import { Cell } from '@/components/Home/MostTransacted/styles';
import { formatDate } from '@/utils/formatFunctions';
import Link from 'next/link';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { NextRouter, useRouter } from 'next/router';
import TransactionsFilters from '@/components/TransactionsFilters';
import Filter from '@/components/Filter';

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

const BrowseAllDeployedContracts: React.FC<PropsWithChildren> = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('Recent Transactions');
  const router = useRouter();

  const getSortParams = (filterOption: string) => {
    switch (filterOption) {
      case 'Recent Transactions':
        return { sortBy: 'timestamp', orderBy: 'desc' };
      case 'Old Transactions':
        return { sortBy: 'timestamp', orderBy: 'asc' };
      case 'Most Transactioned':
        return { sortBy: 'totalTransactions', orderBy: 'desc' };
      case 'Least Transactioned':
        return { sortBy: 'totalTransactions', orderBy: 'asc' };
      default:
        return { sortBy: 'timestamp', orderBy: 'desc' };
    }
  };

  const requestSmartContractsList = useCallback(
    async (
      page: number,
      limit: number,
      router: NextRouter,
      query?: IRequestQuery,
    ) => {
      try {
        const sortParams = getSortParams(orderBy);
        const localQuery: { [key: string]: any } = {
          ...router.query,
          page,
          limit,
          ...sortParams,
        };

        const smartContractsListRes = await api.get({
          route: 'sc/list',
          query: query ?? localQuery,
        });
        if (
          !smartContractsListRes.error ||
          smartContractsListRes.error === ''
        ) {
          const data = {
            ...smartContractsListRes,
            data: { smartContracts: smartContractsListRes.data.sc },
          };
          return data;
        } else {
          throw new Error(smartContractsListRes.error);
        }
      } catch (error) {
        console.error('Error fetching smart contracts list:', error);
        throw error;
      }
    },
    [orderBy],
  );

  const handleFilters = () => {
    const filters = [
      {
        title: 'Order By',
        current: orderBy,
        data: [
          'Recent Transactions',
          'Old Transactions',
          'Most Transactioned',
          'Least Transactioned',
        ],
        onClick: (selected: string) => {
          setOrderBy(selected);
          setRefreshKey((prev: number) => prev + 1);
        },
      },
    ];

    return (
      <>
        {filters?.map((filter: any) => (
          <Filter key={`${filter?.title}-${filter?.current}`} {...filter} />
        ))}
      </>
    );
  };

  const tableProps: ITable = {
    type: 'smartContracts',
    header: smartContractsTableHeaders,
    rowSections: smartContractsListRowSections,
    request: (page, limit) => requestSmartContractsList(page, limit, router),
    dataName: 'smartContracts',
    showLimit: true,
    Filters: handleFilters,
  };

  return (
    <>
      <CardsTitleWrapper>
        <h3>Browse All Deployed Contracts</h3>
      </CardsTitleWrapper>
      <Table key={refreshKey} {...tableProps} />
    </>
  );
};

export default BrowseAllDeployedContracts;
