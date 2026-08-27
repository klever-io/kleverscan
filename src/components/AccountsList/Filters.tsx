import Filter, { IFilter } from '@/components/Filter';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import { ACCOUNT_FILTERS, isAccountFilter } from '@/services/requests/accounts';
import { setQueryAndRouter } from '@/utils';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

/** The value Filter prepends to every list, and what "drop this filter" means. */
const ALL_VALUE = 'All';

/**
 * Two types, though the rows badge three. Both of these are subsets of the
 * genesis block, which the API returns in one request; the plain validator
 * badge has no such source, so filtering on it would mean one request per
 * validator.
 */
const AccountsFilters: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['accounts']);

  const handleSelected = (selected: string): void => {
    // A narrower set has fewer pages, so staying put would land on an empty
    // page with no control to get back from.
    const updated: NextParsedUrlQuery = { ...router.query, page: '1' };
    if (selected === ALL_VALUE) {
      delete updated.type;
    } else {
      updated.type = selected;
    }
    setQueryAndRouter(updated, router);
  };

  const filters: IFilter[] = [
    {
      title: t('accounts:Filters.Type'),
      testId: 'account-type',
      data: [...ACCOUNT_FILTERS],
      // Values stay the wire format; only the label is translated.
      renderLabel: value =>
        value === ALL_VALUE
          ? t('accounts:Filters.All')
          : t(`accounts:Filters.${value}`, { defaultValue: value }),
      onClick: handleSelected,
      // Only a value the list narrows on: `?type=nonsense` leaves the list
      // unfiltered, so echoing it back would label it as filtered.
      current: isAccountFilter(router.query.type)
        ? router.query.type
        : undefined,
      inputType: 'button',
      isHiddenInput: false,
    },
  ];

  return (
    <FilterContainer>
      {filters.map(filter => (
        <Filter key={filter.testId} {...filter} />
      ))}
    </FilterContainer>
  );
};

export default AccountsFilters;
