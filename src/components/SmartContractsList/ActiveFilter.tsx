import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { clearDeployerHref, readDeployerFilter } from './queryState';
import { shallowNavigate } from './shallowNavigate';
import { FilterClear, FilterNote } from './styles';

export interface IActiveFilterProps {
  /** Which of the two spots this instance fills; each hides at the other's
   *  breakpoint, so exactly one is visible. */
  placement: 'filters' | 'controls';
}

/**
 * What the list is narrowed to, and the way out.
 *
 * Nothing but the deployer count in a row writes `?deployer=`, so without this
 * the filter is a one-way door: a reader arrives at four rows with no visible
 * reason and no control that clears it. Renders nothing when the list is not
 * narrowed, so the unfiltered page is unchanged.
 */
const ActiveFilter: React.FC<IActiveFilterProps> = ({ placement }) => {
  const router = useRouter();
  const { t } = useTranslation(['smartContracts']);
  const deployer = readDeployerFilter(router.query);

  if (!deployer) return null;

  // The narrow spot beside Items per page holds about 130px, so it gets the
  // short label and a shorter address; the full sentence stays on wide
  // screens, where the chip shares the filter row.
  const compact = placement === 'controls';

  return (
    <FilterNote $placement={placement} data-testid="deployer-filter-note">
      <span>
        {compact
          ? t('smartContracts:List.DeployedByShort', {
              defaultValue: 'Deployed by',
            })
          : t('smartContracts:List.FilteredByDeployer', {
              defaultValue: 'Contracts deployed by',
            })}
      </span>
      <strong title={deployer}>
        {parseAddress(deployer, compact ? 10 : 16)}
      </strong>
      <FilterClear
        href={clearDeployerHref(router.query)}
        onClick={shallowNavigate(router, clearDeployerHref(router.query))}
      >
        {t('smartContracts:List.ClearFilter', { defaultValue: 'Clear filter' })}
      </FilterClear>
    </FilterNote>
  );
};

export default ActiveFilter;
