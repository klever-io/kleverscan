import { NUMBER_LOCALE } from '@/components/DataList/format';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  AddressLink,
  AmountMuted,
  BadgePill,
  BadgeVariant,
  IdentityCell,
  RowActions,
  ShareCell,
  ShareFill,
  ShareSegment,
  ShareTrack,
  ShareValue,
  VisuallyHidden,
} from '@/components/DataList/styles';
import Tooltip from '@/components/Tooltip';
import { IValidator } from '@/types/index';
import { capitalizeString } from '@/utils/convertString';
import { validatorCapacity } from './capacity';
import { VersionPill } from './styles';
import React from 'react';

/**
 * Labels the row builder cannot resolve itself. It is no component, and the
 * shared Table also calls it with a header string, so `useTranslation` is out
 * of reach; the page passes these in already translated. Same shape as the
 * `epochLabel` blocks passes in #701.
 */
export interface IValidatorRowLabels {
  copyAddress: string;
  addressCopied: string;
  openValidator: string;
  openInNewTab: string;
  canDelegate: string;
  canDelegateTooltip: string;
  cannotDelegate: string;
  cannotDelegateTooltip: string;
  missedShare: string;
  unknownVersion: string;
  /** Shown in place of Unknown when the heartbeat itself did not answer. */
  versionUnavailable: string;
  versionUnavailableTooltip: string;
  noDelegationLimit: string;
  /** "14.0M of 15.0M KLV delegated", built by the page so it can translate. */
  capacityDetail: (staked: number, maxDelegation: number) => string;
}

/**
 * One badge colour per chain list state, matching the segment colours the
 * summary bar uses for the same states: green, violet, light purple, grey,
 * red. Sharing the mapping is the point, so a colour in the legend and the
 * same colour in a row are the same fact.
 *
 * Eligible and waiting used to fall through to `neutral` together, which left
 * the two largest groups on mainnet (105 and 2) looking identical to inactive.
 */
export const statusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'elected':
      return 'success';
    case 'eligible':
      return 'accent';
    case 'waiting':
      return 'contract';
    case 'jailed':
      return 'danger';
    case 'inactive':
      return 'warning';
    default:
      return 'neutral';
  }
};

export const ValidatorIdentity: React.FC<{
  validator: IValidator;
  labels: IValidatorRowLabels;
}> = ({ validator, labels }) => {
  const { ownerAddress, name, parsedAddress, canDelegate } = validator;
  const delegateMsg = canDelegate
    ? labels.canDelegateTooltip
    : labels.cannotDelegateTooltip;

  return (
    <IdentityCell>
      <AddressLink
        href={`/validator/${ownerAddress}`}
        data-testid="validator-link"
      >
        {name || parsedAddress}
      </AddressLink>
      {/* Focusable tooltip plus hidden text, not a `title`: a title never opens
          from the keyboard or on touch (#699). */}
      <Tooltip
        msg={delegateMsg}
        focusable
        Component={() => (
          <BadgePill $variant={canDelegate ? 'success' : 'neutral'}>
            {canDelegate ? labels.canDelegate : labels.cannotDelegate}
            <VisuallyHidden>{`, ${delegateMsg}`}</VisuallyHidden>
          </BadgePill>
        )}
      />
      <RowActions>
        <CopyAction
          value={ownerAddress}
          label={labels.copyAddress}
          announcement={labels.addressCopied}
        />
        <ExplorerLink
          href={`/validator/${ownerAddress}`}
          label={labels.openValidator}
          title={labels.openInNewTab}
        />
      </RowActions>
    </IdentityCell>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <BadgePill $variant={statusVariant(status)}>
    {capitalizeString(status)}
  </BadgePill>
);

export const VersionBadge: React.FC<{
  version?: string;
  isLatest: boolean;
  unknownLabel: string;
  /** Only where the label stands for an outage rather than for a state the
   *  chain really has: "Unknown" is a third of mainnet and needs no
   *  explanation, "Unavailable" does. */
  unknownTooltip?: string;
}> = ({ version, isLatest, unknownLabel, unknownTooltip }) => {
  if (!version) {
    const label = <AmountMuted>{unknownLabel}</AmountMuted>;
    if (!unknownTooltip) return label;
    return <Tooltip msg={unknownTooltip} focusable Component={() => label} />;
  }
  return (
    <VersionPill $variant={isLatest ? 'success' : 'warning'}>
      {version}
    </VersionPill>
  );
};

export const MissedCell: React.FC<{
  totalMissed: number;
  totalProduced: number;
  shareLabel: string;
}> = ({ totalMissed, totalProduced, shareLabel }) => {
  /* Of the blocks this validator was up for, not of the ones it landed.
     `totalProduced` counts successes only, so missed over produced is not a
     share at all: one produced against a hundred missed printed 10000.00%.
     The same denominator `blockResult.successShare` uses on this page, so the
     two figures can no longer contradict each other. */
  const missed = Number.isFinite(totalMissed) ? totalMissed : 0;
  const attempted =
    (Number.isFinite(totalProduced) ? totalProduced : 0) + missed;
  const pct = attempted ? ((missed * 100) / attempted).toFixed(2) : '- -';

  return (
    <Tooltip
      msg={`${shareLabel}: ${pct}%`}
      focusable
      Component={() => (
        <AmountMuted>{missed.toLocaleString(NUMBER_LOCALE)}</AmountMuted>
      )}
    />
  );
};

/**
 * How full a validator's delegation cap already is. The track is that
 * validator's own cap, so the fill matches the percentage printed above it,
 * the rule `buildRowBar` states for holders.
 *
 * `maxDelegation === 0` is no cap rather than no room: the two uncapped
 * validators on mainnet hold 270T and 120T against roughly 12T for every
 * capped one, and both still accept delegation. A fill would need a
 * denominator that does not exist, so those rows print the state instead.
 */
export const CapacityCell: React.FC<{
  staked: number;
  maxDelegation: number;
  noLimitLabel: string;
  detail: string;
}> = ({ staked, maxDelegation, noLimitLabel, detail }) => {
  const { fill, uncapped } = validatorCapacity(staked, maxDelegation);
  if (uncapped || fill === undefined) {
    return <AmountMuted>{noLimitLabel}</AmountMuted>;
  }
  const pct = fill;
  // `title` plus hidden text, not a `Tooltip`: Tooltip takes a `Component` and
  // renders it as `<Component />`, so the fresh arrow a cell must pass is a new
  // type every render and remounts the subtree (#705, item 2). Here that would
  // restart the bar's grow animation on every table refetch. Same shape the
  // holders and assets share cells already use.
  return (
    <ShareCell title={detail}>
      <ShareValue>
        {`${pct.toFixed(1)}%`}
        <VisuallyHidden>{`, ${detail}`}</VisuallyHidden>
      </ShareValue>
      <ShareTrack aria-hidden="true">
        <ShareFill $delay={0}>
          <ShareSegment $kind="staked" style={{ width: `${pct}%` }} />
        </ShareFill>
      </ShareTrack>
    </ShareCell>
  );
};
