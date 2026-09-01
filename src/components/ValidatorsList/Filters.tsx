import Filter, { IFilter } from '@/components/Filter';
import { CompactFilterBar } from '@/components/DataList/styles';
import { buildVersionStats } from '@/services/requests/heartbeat';
import { setQueryAndRouter } from '@/utils';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { useValidatorSources } from './useValidatorSources';

/** The value Filter prepends to every list, and what "drop this filter" means. */
const ALL_VALUE = 'All';

/**
 * Name and software version.
 *
 * Version is a client-side filter: the API has no counterpart, the values come
 * from the heartbeat join, and both this bar and the table read them from the
 * one shared query rather than fetching their own copy.
 */
const ValidatorsFilters: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['validators']);
  const { data, isLoading } = useValidatorSources();

  /* The version of a validator is a join of the list against the heartbeat, so
     with either half missing the dropdown has nothing to offer: an empty map
     still yields the "Unknown" bucket, and picking it wrote `?version=Unknown`
     and drove the table down the empty-success path. The name filter stays
     open, because names come from the list half alone. */
  const versionResolvable = data.heartbeatAvailable && data.validatorsAvailable;

  const versions = buildVersionStats(data.validators, data.versionMap, '').map(
    stat => stat.version,
  );

  const patch = (key: string, selected: string): void => {
    // A narrower set has fewer pages, so staying put would land on an empty
    // page with no control to get back from.
    const updated: NextParsedUrlQuery = { ...router.query };
    if (selected === ALL_VALUE) {
      delete updated[key];
    } else {
      updated[key] = selected;
    }
    // Dropping the parameter is the reset: no `page` reads as page 1.
    delete updated.page;
    setQueryAndRouter(updated, router);
  };

  const filters: IFilter[] = [
    {
      title: t('validators:Filters.Name'),
      testId: 'validator-name',
      placeholder: t('validators:Filters.SearchName'),
      data: data.validators
        .map(validator => validator.name)
        .filter((name): name is string => !!name),
      onClick: selected => patch('name', selected),
      current:
        typeof router.query.name === 'string' ? router.query.name : undefined,
      loading: isLoading,
    },
    {
      title: t('validators:Filters.Version'),
      testId: 'validator-version',
      placeholder: versionResolvable
        ? t('validators:Filters.SearchVersion')
        : t('validators:Filters.VersionUnavailable'),
      data: versionResolvable ? versions : [],
      onClick: selected => patch('version', selected),
      current:
        typeof router.query.version === 'string'
          ? router.query.version
          : undefined,
      loading: isLoading,
      disabledInput: !isLoading && !versionResolvable,
    },
  ];

  return (
    <CompactFilterBar>
      {filters.map(filter => (
        <Filter key={filter.testId} {...filter} />
      ))}
    </CompactFilterBar>
  );
};

export default ValidatorsFilters;
