import React from 'react';

import Link from 'next/link';

import { fromUnixTime } from 'date-fns';

import { BlockCardContainer, BlockCardRow } from '@/views/home';

import { IBlock, IBlockCard } from '../../types';

import { formatAmount, getAge } from '../../utils';

const BlockCard: React.FC<IBlock & IBlockCard> = ({
  nonce,
  timestamp,
  hash,
  blockRewards,
  blockIndex,
  txCount,
  burnedFees,
  precision,
}) => {
  return (
    <BlockCardContainer blockIndex={blockIndex}>
      <BlockCardRow>
        <Link href={`/block/${nonce}`}>
          <strong>#{nonce}</strong>
        </Link>
        <p>Miner</p>
      </BlockCardRow>
      <BlockCardRow>
        <small>{getAge(fromUnixTime(timestamp / 1000))} ago</small>
        <a>{hash}</a>
      </BlockCardRow>
      <BlockCardRow>
        <p>Burned</p>
        <span>{formatAmount((burnedFees || 0) / 10 ** precision)} KLV</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>Transactions</p>
        <span>{txCount}</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>Reward</p>
        <span>{formatAmount(blockRewards / 10 ** precision)} KLV</span>
      </BlockCardRow>
    </BlockCardContainer>
  );
};

export default BlockCard;
