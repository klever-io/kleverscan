import { BadgePill, VisuallyHidden } from '@/components/DataList/styles';
import Tooltip from '@/components/Tooltip';
import { ContractsIndex, IContract } from '@/types/contracts';
import { capitalizeString } from '@/utils/convertString';
import React from 'react';
import {
  MdAccessTime,
  MdArrowForward,
  MdCallMade,
  MdCallReceived,
  MdPriorityHigh,
} from 'react-icons/md';
import { BadgeCount, DirectionStatusBadge } from './styles';

/**
 * Badge dialect of the transactions table, shared by the desktop rows and
 * the mobile card so the two cannot drift apart. The colors keep the meaning
 * the old pill gave them: green for success and In, amber for pending and
 * Out, red for fail.
 */

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  success: 'success',
  pending: 'warning',
  fail: 'danger',
};

export const statusVariant = (
  status?: string,
): 'success' | 'warning' | 'danger' | 'neutral' =>
  STATUS_VARIANT[status?.toLowerCase() ?? ''] ?? 'neutral';

/** One glyph per status, so the color is never the only signal. Lives here
 *  rather than in the page: the desktop status cell and the card have to read
 *  the same, and this file is the one both can import. */
export const DIRECTION_GLYPHS = {
  success: MdArrowForward,
  danger: MdPriorityHigh,
  warning: MdAccessTime,
  neutral: MdArrowForward,
} as const;

/**
 * The status as the same circled glyph the desktop row carries, not a word:
 * the card header holds the hash, the type badge and the timestamp on one
 * line, and "SUCCESS" spelled out took 74px of it. The word stays for
 * assistive tech and as the hover title.
 */
export const TransactionStatusBadge: React.FC<{ status?: string }> = ({
  status,
}) => {
  const variant = statusVariant(status);
  const Glyph = DIRECTION_GLYPHS[variant];
  const label = capitalizeString(status ?? '');

  return (
    <DirectionStatusBadge $variant={variant} title={label}>
      <Glyph size={11} aria-hidden="true" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </DirectionStatusBadge>
  );
};

/** The same status as a word pill, for the widths where the glyph lane is
 *  hidden and a lone icon in the header would carry no context. */
export const TransactionStatusPill: React.FC<{ status?: string }> = ({
  status,
}) => (
  <BadgePill $variant={statusVariant(status)}>
    {capitalizeString(status ?? '')}
  </BadgePill>
);

/** Same treatment for the direction, which only renders on an account's own
 *  transaction list. Diagonal arrows, so an incoming transfer cannot be read
 *  as the status glyph beside it. */
export const InOutBadge: React.FC<{ direction: 'In' | 'Out' }> = ({
  direction,
}) => {
  const Glyph = direction === 'In' ? MdCallReceived : MdCallMade;

  return (
    <DirectionStatusBadge
      $variant={direction === 'In' ? 'success' : 'warning'}
      title={direction}
    >
      <Glyph size={11} aria-hidden="true" />
      <VisuallyHidden>{direction}</VisuallyHidden>
    </DirectionStatusBadge>
  );
};

/**
 * Hovering one type badge marks every badge of the same contract type in the
 * list (the Basescan interaction), so a reader can spot "all the swaps" at a
 * glance. Direct class toggling instead of React state: the match set is
 * pure presentation, and re-rendering fifty rows per mouse move to paint an
 * outline would be waste. The marker class is styled by
 * TransactionsTableWrapper.
 */
const markSameType = (
  event: React.MouseEvent<HTMLElement>,
  on: boolean,
): void => {
  const badge = event.currentTarget;
  const type = badge.dataset.contractType;
  if (!type) return;
  const scope = badge.closest('[data-testid="table-body"]') ?? document;
  // Self-cleaning: a touch tap fires mouseenter but its mouseleave only
  // arrives on the next tap elsewhere, so entering always sweeps first.
  scope
    .querySelectorAll('.type-hover-match')
    .forEach(el => el.classList.remove('type-hover-match'));
  if (!on) return;
  scope
    .querySelectorAll(`[data-contract-type="${CSS.escape(type)}"]`)
    .forEach(el => el.classList.add('type-hover-match'));
};

export const TransactionTypeBadge: React.FC<{
  label: string;
  contractType: string;
}> = ({ label, contractType }) => (
  <BadgePill
    $variant="contract"
    data-contract-type={contractType}
    onMouseEnter={event => markSameType(event, true)}
    onMouseLeave={event => markSameType(event, false)}
  >
    {label}
  </BadgePill>
);

/**
 * The multi-contract case as the same pill dialect: count in the badge, the
 * per-type breakdown behind the shared Tooltip, instead of the old
 * bold-text-with-counter-chip that stood out of the row. The breakdown is
 * computed before the tooltip body, so hovering repaints nothing (the churn
 * the Age column had fixed).
 */
export const MultiContractBadge: React.FC<{ contract: IContract[] }> = ({
  contract,
}) => {
  const counts: Record<string, number> = {};
  contract.forEach(inner => {
    // Numeric-enum reverse lookup: index by contract type number, get the
    // display name back.
    const name = String(
      (ContractsIndex as unknown as Record<number, string>)[inner.type] ??
        inner.type,
    );
    counts[name] = (counts[name] ?? 0) + 1;
  });
  const breakdown = Object.entries(counts)
    .map(([name, count]) => `${name}: ${count}x`)
    .join('\n');

  return (
    <Tooltip
      msg={breakdown}
      focusable
      Component={() => (
        <BadgePill
          $variant="contract"
          data-contract-type="Multi contract"
          onMouseEnter={event => markSameType(event, true)}
          onMouseLeave={event => markSameType(event, false)}
        >
          Multi contract (<BadgeCount>{contract.length}</BadgeCount>)
          {/* The tooltip is hover-only; readers get the same breakdown. */}
          <VisuallyHidden>{breakdown}</VisuallyHidden>
        </BadgePill>
      )}
    />
  );
};
