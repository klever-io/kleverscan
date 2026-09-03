import { klvAmount, NUMBER_LOCALE } from '@/components/DataList/format';
import {
  AmountMuted,
  AmountPrimary,
  NumericCell,
} from '@/components/DataList/styles';
import ExplorerLink from '@/components/ExplorerLink';
import { CustomFieldWrapper } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { IBlock } from '@/types/blocks';
import { IRowSection } from '@/types/index';
import { formatDate, formatDateWithSeconds } from '@/utils/formatFunctions';
import { bandwidthFeeReward } from '@/utils/fees';
import { parseAddress } from '@/utils/parseValues';
import { TFunction } from 'next-i18next';
import React from 'react';
import { BLOCK_COLUMNS, BlockColumnKey } from './columns';

/**
 * Widths and spans with no cell content. The shared Table calls `rowSections`
 * with a header string to read them, twice per header cell on every render,
 * and answering from here keeps the real builder off that path.
 */
export const COLUMN_LAYOUT: IRowSection[] = BLOCK_COLUMNS.map(column => ({
  element: () => null,
  span: column.span ?? 1,
  width: column.width,
}));

/**
 * `epochLabel` arrives translated from the page: `t()` is out of reach in
 * this builder (it is no component, and it also runs for the Table's
 * header-string probe), and hardcoding it here showed "Epoch" on desktop
 * beside "Época" on the pt-BR mobile card.
 */
export const blockRowSections = (
  block: IBlock | string,
  epochLabel = 'Epoch',
  t?: TFunction,
): IRowSection[] => {
  // The header-string probe above. Handled explicitly so a future dereference
  // of the argument cannot take the page down while rendering its own header.
  if (typeof block !== 'object' || block === null) return COLUMN_LAYOUT;

  const {
    nonce,
    epoch,
    size,
    producerName,
    producerOwnerAddress,
    timestamp,
    txCount,
    txFees,
    kAppFees,
    txBurnedFees,
    blockRewards,
  } = block;

  // Computed per row, not inside the tooltip: the body mounts on hover, and a
  // fresh formatDate there makes the visible elapsed time jump on pointer entry.
  // The epoch rides along on the focusable age tooltip: the block cell's own
  // tooltip is hover-only, so without this a keyboard user on desktop had no
  // way to reach the epoch at all.
  const fullDate = `${formatDateWithSeconds(timestamp)} · ${epochLabel} ${epoch}`;
  const elapsed = formatDate(timestamp, { showElapsedTime: true, t }).split(
    ' (',
  )[0];

  // The key set pinned, not erased: a column added or renamed without a cell
  // is a compile error here, where an unchecked index made it a whole-page
  // render crash at runtime.
  const cells: Record<BlockColumnKey, IRowSection['element']> = {
    block: () => (
      <Tooltip
        msg={`${epochLabel} ${epoch}`}
        Component={() => (
          <ExplorerLink type="block" value={String(nonce)} compact />
        )}
      />
    ),
    age: () => (
      <Tooltip
        msg={fullDate}
        focusable
        Component={() => <CustomFieldWrapper>{elapsed}</CustomFieldWrapper>}
      />
    ),
    txs: () => (
      <NumericCell>{(txCount ?? 0).toLocaleString(NUMBER_LOCALE)}</NumericCell>
    ),
    // Bytes carry their unit here rather than in the heading, which would
    // stop being true the day a block is measured in anything else.
    size: () => (
      <NumericCell>{`${(size ?? 0).toLocaleString(NUMBER_LOCALE)} B`}</NumericCell>
    ),
    producer: () => (
      <ExplorerLink
        type="validator"
        value={producerOwnerAddress}
        label={parseAddress(producerName, 16)}
        compact
      />
    ),
    kAppFees: () => <AmountMuted>{klvAmount(kAppFees)}</AmountMuted>,
    burnedFees: () => <AmountMuted>{klvAmount(txBurnedFees)}</AmountMuted>,
    feeRewards: () => (
      <AmountMuted>{klvAmount(bandwidthFeeReward(txFees))}</AmountMuted>
    ),
    blockRewards: () => (
      <AmountPrimary>{klvAmount(blockRewards)}</AmountPrimary>
    ),
  };

  return BLOCK_COLUMNS.map(column => ({
    element: cells[column.key],
    span: column.span ?? 1,
    width: column.width,
  }));
};
