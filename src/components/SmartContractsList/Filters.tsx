import Filter, { IFilter } from '@/components/Filter';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import ActiveFilter from './ActiveFilter';
import { setQueryAndRouter } from '@/utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import {
  activeOrder,
  activeSort,
  ContractOrder,
  ContractSort,
  ORDER_VALUES,
  SORT_VALUES,
} from './queryState';

/**
 * Sort and order above the list.
 *
 * The two dropdowns show what the list is actually sorted by, which is not
 * always what the URL holds: both parameters are silently coerced, once by the
 * request layer's defaults and once by the server. Echoing the raw value back
 * would label the bar with a sort nothing is using.
 *
 * Writes through the router rather than to a fixed path: the account page
 * renders this same bar over its own deployed-contracts tab, and a hardcoded
 * `/smart-contracts` href would navigate away from it.
 */
const ContractsFilters: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['smartContracts']);

  const sortLabels: Record<ContractSort, string> = {
    totalTransactions: t('smartContracts:Filters.SortTransactions', {
      defaultValue: 'Transactions',
    }),
    timestamp: t('smartContracts:Filters.SortDeployed', {
      defaultValue: 'Deployed',
    }),
  };

  const orderLabels: Record<ContractOrder, string> = {
    desc: t('smartContracts:Filters.OrderDesc', {
      defaultValue: 'Descending',
    }),
    asc: t('smartContracts:Filters.OrderAsc', { defaultValue: 'Ascending' }),
  };

  const filters: IFilter[] = [
    {
      title: t('smartContracts:Filters.SortBy', { defaultValue: 'Sort by' }),
      testId: 'sort-by',
      data: SORT_VALUES,
      current: activeSort(router.query),
      hideAllOption: true,
      // Total, as the interface requires: it also receives the "All" entry and
      // whatever a hand-edited URL put in `current`.
      renderLabel: (value: string) =>
        sortLabels[value as ContractSort] ?? value,
      onClick: (selected: string) =>
        setQueryAndRouter(
          { ...router.query, sortBy: selected, page: '1' },
          router,
        ),
    },
    {
      title: t('smartContracts:Filters.Order', { defaultValue: 'Order' }),
      testId: 'order',
      data: ORDER_VALUES,
      current: activeOrder(router.query),
      hideAllOption: true,
      renderLabel: (value: string) =>
        orderLabels[value as ContractOrder] ?? value,
      onClick: (selected: string) =>
        setQueryAndRouter(
          { ...router.query, orderBy: selected, page: '1' },
          router,
        ),
    },
  ];

  return (
    <FilterContainer>
      {router.isReady && (
        <>
          {filters.map(filter => (
            <Filter key={`${filter.testId}-${filter.current}`} {...filter} />
          ))}
          <ActiveFilter placement="filters" />
        </>
      )}
    </FilterContainer>
  );
};

export default ContractsFilters;
