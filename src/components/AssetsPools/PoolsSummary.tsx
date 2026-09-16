import SummaryLoading from '@/components/DataList/SummaryLoading';
import { PoolsSummaryCard } from './styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
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
  const { t } = useTranslation(['assets']);
  const { data: pools, isLoading } = useQuery({
    queryKey: ['assetsPoolsAll'],
    queryFn: requestAllAssetsPools,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return <SummaryLoading label={t('assets:Pools.SummaryAria')} tiles={3} />;
  }

  if (!pools || pools.length === 0) {
    return null;
  }

  const summary = summarizePools(pools);

  return (
    <PoolsSummaryCard aria-label={t('assets:Pools.SummaryAria')}>
      <TilesGrid>
        <Tile>
          <TileLabel>{t('assets:Pools.FeePools')}</TileLabel>
          <TileValue>{summary.total.toLocaleString('en-US')}</TileValue>
          <TileSub>{t('assets:Pools.AssetsAcceptFees')}</TileSub>
        </Tile>
        <Tile>
          <TileLabel>{t('assets:Pools.Active')}</TileLabel>
          <TileValue>{summary.active.toLocaleString('en-US')}</TileValue>
          <TileSub>{t('assets:Pools.CurrentlyAccepting')}</TileSub>
        </Tile>
        <Tile>
          <TileLabel>{t('assets:Pools.KlvReserves')}</TileLabel>
          <TileValue>{formatAmount(summary.klvReserves)}</TileValue>
          <TileSub>{t('assets:Pools.CombinedAcrossPools')}</TileSub>
        </Tile>
      </TilesGrid>
    </PoolsSummaryCard>
  );
};

export default PoolsSummary;
