import { klvAmount, NUMBER_LOCALE } from '@/components/DataList/format';
import { AmountMuted, AmountPrimary } from '@/components/DataList/styles';
import {
  resolveValidatorVersion,
  UNKNOWN_VERSION,
} from '@/services/requests/heartbeat';
import { IRowSection, IValidator } from '@/types/index';
import React from 'react';
import {
  CapacityCell,
  IValidatorRowLabels,
  MissedCell,
  StatusBadge,
  ValidatorIdentity,
  VersionBadge,
} from './cells';
import { VALIDATOR_COLUMNS, ValidatorColumnKey } from './columns';
import { NumericCell } from './styles';

export interface IValidatorRowContext {
  versionMap: Record<string, string>;
  latestVersion?: string;
  /** False when the heartbeat did not answer. Every version then resolves to
   *  Unknown, which on this chain is also a real state for about a third of
   *  the set, so without this flag an outage is indistinguishable from the
   *  truth. */
  heartbeatAvailable: boolean;
  labels: IValidatorRowLabels;
}

/**
 * Widths and spans with no cell content. The shared Table calls `rowSections`
 * with a header string to read them, twice per header cell on every render,
 * and answering from here keeps the real builder off that path.
 */
export const COLUMN_LAYOUT: IRowSection[] = VALIDATOR_COLUMNS.map(column => ({
  element: () => null,
  span: column.span ?? 1,
  width: column.width,
}));

export const validatorRowSections = (
  validator: IValidator | string,
  context: IValidatorRowContext,
): IRowSection[] => {
  // The header-string probe above. Handled explicitly so a future dereference
  // of the argument cannot take the page down while rendering its own header.
  if (typeof validator !== 'object' || validator === null) return COLUMN_LAYOUT;

  const {
    rank,
    staked,
    commission,
    maxDelegation,
    rating,
    status,
    totalProduced,
    totalMissed,
    blsPublicKey,
  } = validator;

  const { versionMap, latestVersion, heartbeatAvailable, labels } = context;
  const resolved = resolveValidatorVersion(blsPublicKey, versionMap);
  const version = resolved === UNKNOWN_VERSION ? undefined : resolved;

  // The key set pinned, not erased: a column added or renamed without a cell
  // is a compile error here, where an unchecked index made it a whole-page
  // render crash at runtime.
  const cells: Record<ValidatorColumnKey, IRowSection['element']> = {
    rank: () => <NumericCell>{rank}</NumericCell>,
    validator: () => (
      <ValidatorIdentity validator={validator} labels={labels} />
    ),
    status: () => <StatusBadge status={status} />,
    rating: () => (
      <AmountMuted>{`${((rating * 100) / 10000000).toFixed(2)}%`}</AmountMuted>
    ),
    stake: () => <AmountPrimary>{klvAmount(staked)}</AmountPrimary>,
    commission: () => <AmountMuted>{`${commission / 10 ** 2}%`}</AmountMuted>,
    produced: () => (
      <AmountMuted>
        {(totalProduced ?? 0).toLocaleString(NUMBER_LOCALE)}
      </AmountMuted>
    ),
    missed: () => (
      <MissedCell
        totalMissed={totalMissed}
        totalProduced={totalProduced}
        shareLabel={labels.missedShare}
      />
    ),
    version: () => (
      <VersionBadge
        version={version}
        isLatest={!!version && version === latestVersion}
        unknownLabel={
          heartbeatAvailable ? labels.unknownVersion : labels.versionUnavailable
        }
        unknownTooltip={
          heartbeatAvailable ? undefined : labels.versionUnavailableTooltip
        }
      />
    ),
    capacity: () => (
      <CapacityCell
        staked={staked}
        maxDelegation={maxDelegation}
        noLimitLabel={labels.noDelegationLimit}
        detail={labels.capacityDetail(staked, maxDelegation)}
      />
    ),
  };

  return VALIDATOR_COLUMNS.map(column => ({
    element: cells[column.key],
    span: column.span ?? 1,
    width: column.width,
  }));
};
