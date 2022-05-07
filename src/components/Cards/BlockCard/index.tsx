import React from 'react';

import { useRouter } from 'next/router';

import { fromUnixTime } from 'date-fns';

import { BlockCardContainer, BlockCardRow } from '@/views/home';

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
  const router = useRouter();
  const handleClick = () => {
    router.push(`/block/${nonce}`);
  };
  return (
    <BlockCardContainer blockIndex={blockIndex} onClick={handleClick}>
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
        <span>{formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV</span>
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
