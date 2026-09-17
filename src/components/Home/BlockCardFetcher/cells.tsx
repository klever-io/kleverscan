import { DoubleRow } from '@/styles/common';
import { IBlock } from '@/types/blocks';
import { IRowSection } from '@/types/index';
import { bandwidthFeeReward } from '@/utils/fees';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React from 'react';

/** The three cells the desktop and tablet home block rows share (#700). */
export const blockSizeTxsCell = (block: IBlock): IRowSection => {
  const { size, txCount } = block;
  return {
    element: props => (
      <DoubleRow {...props} key={txCount + size}>
        <span>{size} Bytes</span>
        <span>
          {txCount} TX{txCount > 1 ? 's' : ''}
        </span>
      </DoubleRow>
    ),
    span: 1,
  };
};

export const blockFeesCell = (block: IBlock): IRowSection => {
  const { kAppFees, txBurnedFees } = block;
  return {
    element: props => (
      <DoubleRow {...props} key={String(kAppFees) + String(txBurnedFees)}>
        <span>{formatAmount((kAppFees || 0) / 10 ** KLV_PRECISION)} KLV</span>
        <span>{`${formatAmount(
          (txBurnedFees || 0) / 10 ** KLV_PRECISION,
        )} KLV`}</span>
      </DoubleRow>
    ),
    span: 1,
  };
};

export const blockRewardsCell = (block: IBlock): IRowSection => {
  const { txFees, blockRewards } = block;
  return {
    element: props => (
      <DoubleRow {...props} key={String(txFees) + String(blockRewards)}>
        <span>
          {formatAmount(bandwidthFeeReward(txFees) / 10 ** KLV_PRECISION)} KLV
        </span>
        <span>
          {formatAmount((blockRewards || 0) / 10 ** KLV_PRECISION)} KLV
        </span>
      </DoubleRow>
    ),
    span: 1,
  };
};
