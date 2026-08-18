import React from 'react';
import {
  SummaryCard,
  SummarySkeletonRow,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
import Skeleton from '@/components/Skeleton';
import { requestAllAssetsPools } from '@/services/requests/assetsPools';
import { formatAmount } from '@/utils/formatFunctions';
import { useQuery } from '@tanstack/react-query';
import { summarizePools } from './helpers';

/**
 * Chain-wide pool figures. The pool set is small enough to fetch whole, so
 * these are real totals rather than a sum of the current page. KDA reserves
 * are deliberately absent: adding up different tokens says nothing.
 */
const PoolsSummary: React.FC = () => {
  const { data: pools, isLoading } = useQuery({
    queryKey: ['assetsPoolsAll'],
    queryFn: requestAllAssetsPools,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <SummaryCard aria-label="Fee pools summary">
        <SummarySkeletonRow>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} width={150} height={56} />
          ))}
        </SummarySkeletonRow>
      </SummaryCard>
    );
  }

  if (!pools || pools.length === 0) {
    return null;
  }

  const summary = summarizePools(pools);

  return (
    <SummaryCard aria-label="Fee pools summary">
      <TilesGrid>
        <Tile>
          <TileLabel>Fee pools</TileLabel>
          <TileValue>{summary.total.toLocaleString('en-US')}</TileValue>
          <TileSub>assets that accept fees</TileSub>
        </Tile>
        <Tile>
          <TileLabel>Active</TileLabel>
          <TileValue>{summary.active.toLocaleString('en-US')}</TileValue>
          <TileSub>currently accepting fees</TileSub>
        </Tile>
        <Tile>
          <TileLabel>KLV reserves</TileLabel>
          <TileValue>{formatAmount(summary.klvReserves)}</TileValue>
          <TileSub>combined across all pools</TileSub>
        </Tile>
      </TilesGrid>
    </SummaryCard>
  );
};

export default PoolsSummary;
