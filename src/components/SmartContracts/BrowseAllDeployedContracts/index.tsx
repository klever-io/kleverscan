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
              href={
                `/smart-contract/${contractAddress}` +
                (name ? `?name=${name}` : '')
              }
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
          <span>{totalTransactions || '- -'}</span>
        </CenteredRow>
      ),
      span: 1,
    },

    {
      element: props => (
        <CenteredRow>
          <Link
            href={
              `/smart-contract/${contractAddress}` +
              (name ? `?name=${name}` : '')
            }
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
  const [orderBy, setOrderBy] = useState<string>('Most Transactioned');
  const router = useRouter();

  const requestSmartContractsList = useCallback(
    async (
      page: number,
      limit: number,
      router: NextRouter,
      query?: IRequestQuery,
    ) => {
      try {
        const localQuery: { [key: string]: any } = {
          ...router.query,
          page,
          limit,
          orderBy,
        };

        const smartContractsListRes = await api.get({
          route: 'sc/list',
          query: query ?? localQuery,
        });
        if (
          !smartContractsListRes.error ||
          smartContractsListRes.error === ''
        ) {
          const sortedSmartContracts = smartContractsListRes.data.sc.sort(
            (a: any, b: any) => {
              switch (orderBy) {
                case 'Last Date':
                  return (b.timestamp || 0) - (a.timestamp || 0);
                case 'First Date':
                  return (a.timestamp || 0) - (b.timestamp || 0);
                case 'Most Transactioned':
                  return (
                    (b.totalTransactions || 0) - (a.totalTransactions || 0)
                  );
                case 'Least Transactioned':
                  return (
                    (a.totalTransactions || 0) - (b.totalTransactions || 0)
                  );
                default:
                  return (
                    (b.totalTransactions || 0) - (a.totalTransactions || 0)
                  );
              }
            },
          );

          const data = {
            ...smartContractsListRes,
            data: { smartContracts: sortedSmartContracts },
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
          'Last Date',
          'First Date',
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
