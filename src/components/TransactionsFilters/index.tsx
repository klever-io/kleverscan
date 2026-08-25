import { PropsWithChildren } from 'react';
import Filter, { IFilter } from '@/components/Filter';
import { buyType, contracts, status } from '@/configs/transactions';
import { IAsset } from '@/types';
import { setQueryAndRouter } from '@/utils';
import { useFetchPartial } from '@/utils/hooks';
import { useTranslation } from 'next-i18next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { ContractsIndex } from '../../types/contracts';
import DateFilter from '../DateFilter';
import { FilterContainer } from './styles';

interface ITransactionsFilters {
  disabledInput?: boolean;
}

/**
 * The entry Filter prepends to every list, and the value `handleSelected`
 * recognises as "drop this filter". It is a value like any other, so it must
 * survive translation untouched.
 */
const ALL_VALUE = 'All';

const TransactionsFilters: React.FC<
  PropsWithChildren<ITransactionsFilters>
> = ({ disabledInput }) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'transactions']);
  const [query, setLocalQuery] = useState<NextParsedUrlQuery>({});
  const [assets, fetchPartialAsset, loading, setLoading] =
    useFetchPartial<IAsset>('assets', 'assets/list', 'assetId');

  useEffect(() => {
    if (!router.isReady) return;
    setLocalQuery(router.query);
  }, [router.isReady, router.query]);

  const getContractIndex = (contractName: string) =>
    ContractsIndex[contractName as keyof typeof ContractsIndex];
  const getContractName = (): string => ContractsIndex[Number(query.type)];

  const handleSelected = (selected: string, filterType: string): void => {
    // Every branch returns to the first page: a narrower result set can have
    // fewer pages than the one being viewed, which would otherwise leave the
    // table on an empty page with no pagination control to get back.
    const updatedQuery: NextParsedUrlQuery = { ...query, page: String(1) };
    if (selected === ALL_VALUE) {
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
          [filterType]: String(getContractIndex(selected)),
        },
        router,
      );
    } else if (selected !== query[filterType]) {
      setQueryAndRouter({ ...updatedQuery, [filterType]: selected }, router);
    }
  };

  /**
   * A value's label, with the value itself as the fallback. Every list here
   * also carries the "All" sentinel, and `current` can be anything a
   * hand-edited URL put there, so this has to answer for inputs that have no
   * key rather than rendering `transactions:Status.whatever` at the reader.
   */
  const labelIn = useCallback(
    (section: string) =>
      (value: string): string =>
        value === ALL_VALUE
          ? t('common:Buttons.All')
          : t(`transactions:${section}.${value}`, { defaultValue: value }),
    [t],
  );

  // Built during render rather than pushed into state from an effect. As state
  // it was a snapshot taken when `query`, `assets` or `loading` last changed,
  // so every label produced by `t` would have frozen at whatever the
  // translator returned at that moment.
  const filters: IFilter[] = [
    {
      title: t('transactions:Filters.Coin'),
      testId: 'coin',
      notFoundLabel: t('transactions:Filters.NotFound'),
      placeholder: t('transactions:Filters.CoinPlaceholder'),
      // Filtered at the source rather than defended against downstream: the
      // optional chain says a null-ish row is possible, and such an entry
      // renders as an empty option a reader can select.
      data: assets
        .map(asset => asset?.assetId)
        .filter((assetId): assetId is string => typeof assetId === 'string'),
      // Asset ids have no keys, so this only translates the "All" entry. Without
      // it this is the one filter here whose sentinel stays English.
      renderLabel: labelIn('Coin'),
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
      title: t('transactions:Filters.Status'),
      testId: 'status',
      notFoundLabel: t('transactions:Filters.NotFound'),
      data: status,
      renderLabel: labelIn('Status'),
      onClick: selected => handleSelected(selected, 'status'),
      current: query.status as string | undefined,
      isHiddenInput: false,
      // See Tabs/Proposals: this used to be inferred from the title reading
      // exactly "Status".
      inputType: 'button',
    },
    {
      title: t('transactions:Filters.Contract'),
      testId: 'contract',
      notFoundLabel: t('transactions:Filters.NotFound'),
      placeholder: t('transactions:Filters.ContractPlaceholder'),
      data: contracts,
      renderLabel: labelIn('Contracts'),
      onClick: selected => handleSelected(selected, 'type'),
      current: getContractName(),
    },
  ];
  if (getContractName() === 'Buy') {
    filters.push({
      title: t('transactions:Filters.BuyType'),
      testId: 'buyType',
      notFoundLabel: t('transactions:Filters.NotFound'),
      data: buyType,
      renderLabel: labelIn('BuyTypes'),
      inputType: 'button',
      onClick: selected => handleSelected(selected, 'buyType'),
      current: query.buyType as string | undefined,
    });
  }

  return (
    <FilterContainer>
      {/* Not gated on router.isReady. Next answers that differently on each
          side for a statically generated page: false while rendering on the
          server, true on the client's first render. While the filter list was
          state seeded with [], both sides rendered nothing and the difference
          stayed hidden; built during render it made /block/<n> hydrate against
          a tree that had no filters in it. Nothing here reads router.query
          directly, only the local `query` copy, which is {} on both sides
          until the effect runs. */}
      {filters.map(filter => (
        // Keyed on the identifier, not the title: a translated title would
        // otherwise change the key and remount the control.
        <Filter key={`${filter?.testId}-${filter?.current}`} {...filter} />
      ))}
      <DateFilter />
    </FilterContainer>
  );
};

export default TransactionsFilters;
