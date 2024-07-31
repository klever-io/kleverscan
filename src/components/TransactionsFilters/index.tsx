import { PropsWithChildren } from 'react';
import Filter, { IFilter } from '@/components/Filter';
import { buyType, contracts, status } from '@/configs/transactions';
import { IAsset } from '@/types';
import { setQueryAndRouter } from '@/utils';
import { useFetchPartial } from '@/utils/hooks';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ContractsIndex } from '../../types/contracts';
import DateFilter from '../DateFilter';
import { FilterContainer } from './styles';

interface ITransactionsFilters {
  disabledInput?: boolean;
}

const TransactionsFilters: React.FC<
  PropsWithChildren<ITransactionsFilters>
> = ({ disabledInput }) => {
  const router = useRouter();
  const [query, setLocalQuery] = useState<NextParsedUrlQuery>({});
  const [assets, fetchPartialAsset, loading, setLoading] =
    useFetchPartial<IAsset>('assets', 'assets/list', 'assetId');

  const [filters, setFilters] = useState<IFilter[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    setLocalQuery(router.query);
  }, [router.isReady, router.query]);

  const getContractIndex = (contractName: string) =>
    ContractsIndex[contractName as keyof typeof ContractsIndex];
  const getContractName = (): string => ContractsIndex[Number(query.type)];

  const handleSelected = (selected: string, filterType: string): void => {
    const updatedQuery = { ...query };
    if (selected === 'All') {
      delete updatedQuery[filterType];
      if (filterType === 'type') {
        delete updatedQuery['buyType'];
      }
      setQueryAndRouter(updatedQuery, router);
    } else if (filterType === 'type') {
      if (selected !== 'Buy') {
        delete updatedQuery['buyType'];
      }
      setQueryAndRouter(
        {
          ...updatedQuery,
          page: String(1),
          [filterType]: String(getContractIndex(selected)),
        },
        router,
      );
    } else if (selected !== query[filterType]) {
      setQueryAndRouter({ ...query, [filterType]: selected }, router);
    }
  };

  useEffect(() => {
    const filters: IFilter[] = [
      {
        title: 'Coin',
        data: assets.map(asset => asset?.assetId),
        onClick: selected => {
          handleSelected(selected, 'asset');
        },
        onChange: async value => {
          setLoading(true);
          await fetchPartialAsset(value);
        },
        current: query.asset as string | undefined,
        loading,
        disabledInput,
      },
      {
        title: 'Status',
        data: status,
        onClick: selected => handleSelected(selected, 'status'),
        current: query.status as string | undefined,
        isHiddenInput: false,
      },
      {
        title: 'Contract',
        data: contracts,
        onClick: selected => handleSelected(selected, 'type'),
        current: getContractName(),
      },
    ];
    if (getContractName() === 'Buy') {
      filters.push({
        title: 'Buy Type',
        data: buyType,
        inputType: 'button',
        onClick: selected => handleSelected(selected, 'buyType'),
        current: query.buyType as string | undefined,
      });
    }

    setFilters(filters);
  }, [query, assets, loading]);

  return (
    <FilterContainer>
      {router.isReady &&
        filters.map(filter => (
          <Filter key={`${filter?.title}-${filter?.current}`} {...filter} />
        ))}
      <DateFilter />
    </FilterContainer>
  );
};

export default TransactionsFilters;
