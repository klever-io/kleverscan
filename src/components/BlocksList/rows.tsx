import { AmountMuted, AmountPrimary } from '@/components/DataList/styles';
import ExplorerLink from '@/components/ExplorerLink';
import { CustomFieldWrapper } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { IBlock } from '@/types/blocks';
import { IRowSection } from '@/types/index';
import {
  formatAmount,
  formatDate,
  formatDateWithSeconds,
} from '@/utils/formatFunctions';
import { bandwidthFeeReward } from '@/utils/fees';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import React from 'react';
import { BLOCK_COLUMNS } from './columns';
import { NumericCell } from './styles';

const NUMBER_LOCALE = 'en-US';

const klv = (amount: number | undefined): string =>
  `${formatAmount((amount || 0) / 10 ** KLV_PRECISION)} KLV`;

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

export const blockRowSections = (block: IBlock | string): IRowSection[] => {
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
  const fullDate = formatDateWithSeconds(timestamp);
  const elapsed = formatDate(timestamp, { showElapsedTime: true }).split(
    ' (',
  )[0];

  const cells: Record<string, IRowSection['element']> = {
    block: () => (
      <Tooltip
        msg={`Epoch ${epoch}`}
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
    kAppFees: () => <AmountMuted>{klv(kAppFees)}</AmountMuted>,
    burnedFees: () => <AmountMuted>{klv(txBurnedFees)}</AmountMuted>,
    feeRewards: () => (
      <AmountMuted>{klv(bandwidthFeeReward(txFees))}</AmountMuted>
    ),
    blockRewards: () => <AmountPrimary>{klv(blockRewards)}</AmountPrimary>,
  };

  return BLOCK_COLUMNS.map(column => ({
    element: cells[column.key],
    span: column.span ?? 1,
    width: column.width,
  }));
};
