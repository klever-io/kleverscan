import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { clearDeployerHref, readDeployerFilter } from './queryState';
import { shallowNavigate } from './shallowNavigate';
import { ClearIcon, ClearLabel, FilterClear, FilterNote } from './styles';

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

  // Only where the parameter is actually applied: the account tab reuses this
  // filter bar but scopes by route segment, and a hand-added `?deployer=`
  // there would put a claim above a table that ignores it.
  if (router.pathname !== '/smart-contracts') return null;
  if (!deployer) return null;

  const clearLabel = t('smartContracts:List.ClearFilter', {
    defaultValue: 'Clear filter',
  });

  return (
    <FilterNote data-testid="deployer-filter-note">
      <span>
        {t('smartContracts:List.DeployedByShort', {
          defaultValue: 'Deployed by',
        })}
      </span>
      {/* The short label and a 10 character address keep the chip at 283px,
          which is what fits beside the two dropdowns at 1026px, the narrowest
          width where the filter bar is still a row. Measured. */}
      <strong title={deployer}>{parseAddress(deployer, 10)}</strong>
      <FilterClear
        href={clearDeployerHref(router.query)}
        onClick={shallowNavigate(router, clearDeployerHref(router.query))}
        aria-label={clearLabel}
        title={clearLabel}
      >
        <ClearLabel>{clearLabel}</ClearLabel>
        <ClearIcon>
          <AiOutlineClose size={14} />
        </ClearIcon>
      </FilterClear>
    </FilterNote>
  );
};

export default ActiveFilter;
