import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { clearDeployerHref, readDeployerFilter } from './queryState';
import { FilterClear, FilterNote } from './styles';

/**
 * What the list is narrowed to, and the way out.
 *
 * Nothing but the deployer count in a row writes `?deployer=`, so without this
 * the filter is a one-way door: a reader arrives at four rows with no visible
 * reason and no control that clears it. Renders nothing when the list is not
 * narrowed, so the unfiltered page is unchanged.
 */
const ActiveFilter: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['smartContracts']);
  const deployer = readDeployerFilter(router.query);

  if (!deployer) return null;

  return (
    <FilterNote data-testid="deployer-filter-note">
      <span>
        {t('smartContracts:List.FilteredByDeployer', {
          defaultValue: 'Contracts deployed by',
        })}
      </span>
      <strong title={deployer}>{parseAddress(deployer, 16)}</strong>
      <FilterClear href={clearDeployerHref(router.query)}>
        {t('smartContracts:List.ClearFilter', { defaultValue: 'Clear filter' })}
      </FilterClear>
    </FilterNote>
  );
};

export default ActiveFilter;
