import Filter, { IFilter } from '@/components/Filter';
import api from '@/services/api';
import { setQueryAndRouter } from '@/utils';
import { getNetwork } from '@/utils/networkFunctions';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { NextRouter, useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { FilterContainer } from '../TransactionsFilters/styles';

export const getSortParams = (filterOption: string) => {
  switch (filterOption) {
    case 'Recent Transactions':
      return { sortBy: 'timestamp', orderBy: 'desc' };
    case 'Old Transactions':
      return { sortBy: 'timestamp', orderBy: 'asc' };
    case 'Most Transacted':
      return { sortBy: 'totalTransactions', orderBy: 'desc' };
    case 'Least Transacted':
      return { sortBy: 'totalTransactions', orderBy: 'asc' };
    default:
      return { sortBy: 'timestamp', orderBy: 'desc' };
  }
};

interface IUseSmartContractsList {
  request: (page: number, limit: number, router: NextRouter) => Promise<any>;
  Filters: React.FC;
}

export const useSmartContractsList = (
  initialOrderBy = 'Recent Transactions',
  deployerAddress?: string,
): IUseSmartContractsList => {
  const request = useCallback(
    async (page: number, limit: number, router: NextRouter) => {
      try {
        const localQuery: { [key: string]: any } = {
          ...router.query,
          page,
          limit,
        };

        if (deployerAddress) {
          localQuery.deployer = deployerAddress;
        }

        const smartContractsListRes = await api.get({
          route: 'sc/list',
          query: localQuery,
        });
        if (!smartContractsListRes.error) {
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
    [deployerAddress],
  );

  const Filters: React.FC = () => {
    const router = useRouter();

    const [query, setLocalQuery] = useState<NextParsedUrlQuery>({});
    const [filters, setFilters] = useState<IFilter[]>([]);

    useEffect(() => {
      if (!router.isReady) return;
      setLocalQuery(router.query);
    }, [router.isReady, router.query]);

    const currentNetwork = getNetwork();
    const isDevnet = currentNetwork === 'Devnet';

    const sortOptions = isDevnet
      ? ['Timestamp', 'Total Transactions']
      : ['Timestamp'];
    const orderOptions = ['Desc', 'Asc'];

    const initialParts = getSortParams(initialOrderBy);

    const currentSort = (query.sortBy as string) || initialParts.sortBy;
    const currentOrder = (query.orderBy as string) || initialParts.orderBy;

    const sortLabel =
      currentSort === 'timestamp' ? 'Timestamp' : 'Total Transactions';
    const orderLabel = currentOrder === 'desc' ? 'Desc' : 'Asc';

    useEffect(() => {
      const filters = [
        {
          title: 'Sort By',
          data: sortOptions,
          current: sortLabel,
          hideAllOption: true,
          onClick: (selected: string) => {
            const newSortBy =
              selected === 'Timestamp' ? 'timestamp' : 'totalTransactions';
            setQueryAndRouter(
              { ...query, sortBy: newSortBy, orderBy: currentOrder, page: '1' },
              router,
            );
          },
        },
        {
          title: 'Order',
          data: orderOptions,
          current: orderLabel,
          hideAllOption: true,
          onClick: (selected: string) => {
            const newOrder = selected === 'Desc' ? 'desc' : 'asc';
            setQueryAndRouter(
              { ...query, sortBy: currentSort, orderBy: newOrder, page: '1' },
              router,
            );
          },
        },
      ];
      setFilters(filters);
    }, [query]);

    return (
      <FilterContainer>
        {router.isReady &&
          filters.map(filter => (
            <Filter key={`${filter?.title}-${filter?.current}`} {...filter} />
          ))}
      </FilterContainer>
    );
  };

  return { request, Filters };
};

export default useSmartContractsList;
