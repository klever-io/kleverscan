import Filter, { IFilter } from '@/components/Filter';
import { contracts, status } from '@/configs/transactions';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IAsset } from '../../types';
import { ContractsIndex } from '../../types/contracts';
import { fetchPartialAsset } from '../../utils';
import { FilterContainer } from './styles';

interface ITransactionsFilters {
  query: NextParsedUrlQuery;
  setQuery: (newQuery: NextParsedUrlQuery) => void;
  assets: IAsset[];
}

const TransactionsFilters: React.FC<ITransactionsFilters> = ({
  query,
  setQuery,
  assets,
}) => {
  const router = useRouter();
  const getContractIndex = (contractName: string): string =>
    ContractsIndex[contractName];
  const getContractName = (): string => ContractsIndex[Number(query.type)];

  const [assetFilters, setAssetsFilters] = useState(assets);
  const handleSelected = (selected: string, filterType: string): void => {
    if (selected === 'All') {
      const updatedQuery = { ...query };
      delete updatedQuery[filterType];
      setQuery(updatedQuery);
    } else if (filterType === 'type') {
      setQuery({ ...query, [filterType]: getContractIndex(selected) });
    } else if (selected !== query[filterType]) {
      if (selected === 'KLV' && router.pathname === '/account/[account]') {
        setQuery({ ...query, [filterType]: selected });
      } else {
        setQuery({ ...query, [filterType]: selected });
      }
    }
  };

  let fetchPartialAssetTimeout: ReturnType<typeof setTimeout>;
  const filters: IFilter[] = [
    {
      title: 'Coin',
      data: assetFilters.map(asset => asset.assetId),
      onClick: selected => handleSelected(selected, 'asset'),
      onChange: async value => {
        const response = await fetchPartialAsset(
          fetchPartialAssetTimeout,
          value,
          assets,
        );
        if (response) {
          setAssetsFilters([...assetFilters, ...response]);
        }
      },
      current: query.asset as string | undefined,
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
      {filters.map((filter, index) => (
        <Filter key={String(index)} {...filter} />
      ))}
    </FilterContainer>
  );
};

export default TransactionsFilters;
