import { BlockCardContainer, BlockCardRow } from '@/views/home';
import { fromUnixTime } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { IBlock, IBlockCard } from '../../../types';
import { formatAmount, getAge } from '../../../utils';

const BlockCard: React.FC<IBlock & IBlockCard> = ({
  nonce,
  timestamp,
  hash,
  blockRewards,
  blockIndex,
  txCount,
  txBurnedFees,
  precision,
}) => {
  return (
    <BlockCardContainer blockIndex={blockIndex}>
      <Link href={`/block/${nonce}`}>
        <a>
          <BlockCardRow>
            <strong>#{nonce}</strong>
            <p>Miner</p>
          </BlockCardRow>
          <BlockCardRow>
            <small>{getAge(fromUnixTime(timestamp / 1000))} ago</small>
            <a>{hash}</a>
          </BlockCardRow>
          <BlockCardRow>
            <p>Burned</p>
            <span>
              {formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV
            </span>
          </BlockCardRow>
          <BlockCardRow>
            <p>Transactions</p>
            <span>{txCount}</span>
          </BlockCardRow>
          <BlockCardRow>
            <p>Reward</p>
            <span>
              {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
            </span>
          </BlockCardRow>
        </a>
      </Link>
    </BlockCardContainer>
  );
};

export default BlockCard;
