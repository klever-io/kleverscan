import SummaryLoading from '@/components/DataList/SummaryLoading';
import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  DistBar,
  DistSegment,
  LegendDot,
  LegendItem,
  LegendRow,
  SummaryCard,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
import { useTheme } from '@/contexts/theme';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { StripBarArea } from './styles';

interface IRegistryCounts {
  total: number;
  fungible: number;
  nonFungible: number;
  semiFungible: number;
}

const fetchTotalRecords = async (type?: string): Promise<number> => {
  const response = await api.get({
    route: 'assets/list',
    query: { limit: 1, hidden: false, ...(type ? { type } : {}) },
  });
  if (response.error) throw new Error(response.error);
  return response?.pagination?.totalRecords ?? 0;
};

/**
 * The only honest chain-level picture the assets API offers is counts, so
 * the strip stays minimal: four tiles and a composition bar. When the type
 * filter is active the other segments dim, which feeds the filter state back
 * without duplicating the filter control itself.
 */
const RegistryStrip: React.FC = () => {
  const { t } = useTranslation(['assets']);
  const router = useRouter();
  const { theme } = useTheme();

  const { data: counts, isLoading } = useQuery<IRegistryCounts>({
    queryKey: ['assetsRegistryCounts'],
    queryFn: async () => {
      const [total, fungible, nonFungible, semiFungible] = await Promise.all([
        fetchTotalRecords(),
        fetchTotalRecords('Fungible'),
        fetchTotalRecords('NonFungible'),
        fetchTotalRecords('SemiFungible'),
      ]);
      return { total, fungible, nonFungible, semiFungible };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <SummaryLoading label={t('assets:List.RegistryAria')} tiles={4} bar />
    );
  }

  if (!counts) {
    return null;
  }

  const segments = [
    {
      type: 'Fungible',
      label: t('assets:List.Fungible'),
      count: counts.fungible,
      color: theme.violet,
    },
    {
      type: 'NonFungible',
      label: t('assets:List.NftCollections'),
      count: counts.nonFungible,
      color: theme.purple,
    },
    {
      type: 'SemiFungible',
      label: t('assets:List.SemiFungible'),
      count: counts.semiFungible,
      color: theme.lightPurple,
    },
  ].filter(segment => segment.count > 0);

  const segmentsTotal = segments.reduce(
    (acc, segment) => acc + segment.count,
    0,
  );
  const activeType = router.query.type as string | undefined;

  const barLabel = t('assets:List.AssetTypesAria', {
    fungible: counts.fungible,
    nft: counts.nonFungible,
    sft: counts.semiFungible,
  });

  return (
    <SummaryCard aria-label={t('assets:List.RegistryAria')}>
      <TilesGrid>
        <Tile>
          <TileLabel>{t('assets:List.AssetsOnChain')}</TileLabel>
          <TileValue>{counts.total.toLocaleString('en-US')}</TileValue>
          <TileSub>{t('assets:List.AllTokenTypes')}</TileSub>
        </Tile>
        <Tile>
          <TileLabel>{t('assets:List.Fungible')}</TileLabel>
          <TileValue>{counts.fungible.toLocaleString('en-US')}</TileValue>
          <TileSub>{t('assets:List.Tokens')}</TileSub>
        </Tile>
        <Tile>
          <TileLabel>{t('assets:List.NftCollections')}</TileLabel>
          <TileValue>{counts.nonFungible.toLocaleString('en-US')}</TileValue>
          <TileSub>{t('assets:List.Collections')}</TileSub>
        </Tile>
        <Tile>
          <TileLabel>{t('assets:List.SemiFungible')}</TileLabel>
          <TileValue>{counts.semiFungible.toLocaleString('en-US')}</TileValue>
          <TileSub>{t('assets:List.Collections')}</TileSub>
        </Tile>
      </TilesGrid>
      {segments.length > 0 && segmentsTotal > 0 && (
        <StripBarArea>
          <DistBar role="img" aria-label={barLabel}>
            {segments.map((segment, index) => (
              <DistSegment
                key={segment.type}
                $color={segment.color}
                $delay={index * 60}
                $dimmed={!!activeType && activeType !== segment.type}
                style={{ width: `${(segment.count / segmentsTotal) * 100}%` }}
                title={`${segment.label} · ${segment.count.toLocaleString('en-US')}`}
                aria-hidden="true"
              />
            ))}
          </DistBar>
          <LegendRow>
            {segments.map(segment => (
              <LegendItem
                key={segment.type}
                $dimmed={!!activeType && activeType !== segment.type}
              >
                <LegendDot $color={segment.color} />
                {segment.label}{' '}
                <strong>{segment.count.toLocaleString('en-US')}</strong>
              </LegendItem>
            ))}
          </LegendRow>
        </StripBarArea>
      )}
    </SummaryCard>
  );
};

export default RegistryStrip;
