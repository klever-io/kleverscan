import Filter, { IFilter } from '@/components/Filter';
import { contracts, status } from '@/configs/transactions';
import { useFetchPartialAsset } from '@/utils/hooks';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ContractsIndex } from '../../types/contracts';
import { FilterContainer } from './styles';

interface ITransactionsFilters {
  setQuery: (newQuery: NextParsedUrlQuery) => void;
}

const TransactionsFilters: React.FC<ITransactionsFilters> = ({ setQuery }) => {
  const router = useRouter();
  const [query, setLocalQuery] = useState<NextParsedUrlQuery>({});
  const [assets, fetchPartialAsset, loading, setLoading] =
    useFetchPartialAsset();

  useEffect(() => {
    if (!router.isReady) return;
    setLocalQuery(router.query);
  }, [router.isReady, router.query]);

  const getContractIndex = (contractName: string): string =>
    ContractsIndex[contractName];
  const getContractName = (): string => ContractsIndex[Number(query.type)];

  const handleSelected = (selected: string, filterType: string): void => {
    if (selected === 'All') {
      const updatedQuery = { ...query };
      delete updatedQuery[filterType];
      setQuery(updatedQuery);
    } else if (filterType === 'type') {
      setQuery({ ...query, [filterType]: getContractIndex(selected) });
    } else if (selected !== query[filterType]) {
      setQuery({ ...query, [filterType]: selected });
    }
  };

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
    },
    {
      title: 'Status',
      data: status,
      onClick: selected => handleSelected(selected, 'status'),
      current: query.status as string | undefined,
    },
    {
      title: 'Contract',
      data: contracts,
      onClick: selected => handleSelected(selected, 'type'),
      current: getContractName(),
    },
  ];

  return (
    <FilterContainer>
      {filters.map(filter => (
        <Filter key={filter.current} {...filter} />
      ))}
    </FilterContainer>
  );
};

export default TransactionsFilters;
