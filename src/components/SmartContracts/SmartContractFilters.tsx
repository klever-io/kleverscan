import Filter, { IFilter } from '@/components/Filter';
import { setQueryAndRouter } from '@/utils';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FilterContainer } from '../TransactionsFilters/styles';

const Filters: React.FC = () => {
  const router = useRouter();

  const [query, setLocalQuery] = useState<NextParsedUrlQuery>({});
  const [filters, setFilters] = useState<IFilter[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    setLocalQuery(router.query);
  }, [router.isReady, router.query]);

  const sortOptions = ['Timestamp', 'Total Transactions'];
  const orderOptions = ['Desc', 'Asc'];

  const initialParts = { sortBy: 'totalTransactions', orderBy: 'desc' };

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

export default Filters;
