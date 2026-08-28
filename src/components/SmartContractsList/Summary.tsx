import { NUMBER_LOCALE, formatShare } from '@/components/DataList/format';
import {
  DistBar,
  DistSegment,
  LegendDot,
  LegendItem,
  LegendRow,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TileValueRow,
  TilesGrid,
} from '@/components/DataList/styles';
import { useDeferred } from '@/components/DataList/useDeferred';
import { TrendValue } from '@/components/TransactionsList/styles';
import {
  smartContractsBeforeYesterdayTransactionsCall,
  smartContractsListCall,
  smartContractsStatisticCall,
  smartContractTotalTransactionsListCall,
} from '@/services/requests/smartContracts';
import { safeContractName } from '@/utils/contractName';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useTheme } from 'styled-components';
import {
  ContractsSummaryCard,
  ContractsSummaryLoading,
  SummaryContractLink,
} from './styles';
import { dailyVariation, topContracts } from './summaryFigures';

/**
 * A quarter of an hour. These are chain-wide totals that move by fractions of
 * a percent between reads, and the page they sit on used to refetch four
 * queries every four seconds for the same numbers.
 */
const FIGURE_CACHE = { staleTime: 15 * 60_000, gcTime: 15 * 60_000 };

/** Percentage with its sign, e.g. "+18.6%". A rate, not a share, so it has no
 *  ceiling: a figure that more than doubled reads "+140%". */
const formatVariation = (variation: number): string =>
  `${variation > 0 ? '+' : ''}${(variation * 100).toFixed(1)}%`;

/**
 * The figures above the deployed-contracts list: how many contracts exist, how
 * much traffic they carry, and which of them carries the most.
 */
const ContractsSummary: React.FC = () => {
  const { t } = useTranslation(['smartContracts']);
  const theme = useTheme();
  const label = t('smartContracts:List.SummaryAria', {
    defaultValue: 'Smart contract statistics',
  });

  const deferred = useDeferred();

  const { data, isLoading } = useQuery({
    queryKey: ['smartContractsSummary'],
    queryFn: async () => {
      // Every one of these maps its own failure to undefined, so a half-failed
      // set still lands here as data rather than as an error, and each tile
      // decides on its own whether it has something to say.
      const [contracts, transactions, daily] = await Promise.all([
        smartContractsListCall(),
        smartContractTotalTransactionsListCall(),
        smartContractsBeforeYesterdayTransactionsCall(),
      ]);
      return { contracts, transactions, daily };
    },
    ...FIGURE_CACHE,
  });

  const { data: statistics } = useQuery({
    queryKey: ['smartContractsStatistic'],
    queryFn: smartContractsStatisticCall,
    // Behind the list, not beside it: the bar is decoration nobody waits on,
    // and this is the slowest of the four calls (measured 0,55s against 0,12s).
    enabled: deferred,
    ...FIGURE_CACHE,
  });

  if (isLoading) {
    return <ContractsSummaryLoading label={label} tiles={3} bar />;
  }
  if (!data) return null;

  const { contracts, transactions, daily } = data;
  const busiest = topContracts(statistics?.statistics);
  const variation = dailyVariation(
    daily && {
      today: daily.newTransactions,
      previous: daily.beforeYesterdayTxs,
    },
  );

  // Each tile appears only when its own request answered; a failed part is
  // left out rather than printing a zero the chain never reported.
  if (contracts === undefined && transactions === undefined && !busiest) {
    return null;
  }

  const leader = busiest?.segments[0];
  const leaderName = leader?.name ? safeContractName(leader.name) : '';

  const segmentColor = (index: number): string =>
    [
      theme.violet,
      theme.purple,
      theme.lightPurple,
      theme.green,
      theme.blueGray500,
    ][index % 5];

  const barLabel = (busiest?.segments ?? [])
    .map(
      segment =>
        `${segment.name ? safeContractName(segment.name) || segment.address : segment.address} ${formatShare(segment.count, busiest?.total ?? 0)}`,
    )
    .join(', ');

  return (
    <ContractsSummaryCard aria-label={label} data-testid="contracts-summary">
      <TilesGrid>
        {contracts !== undefined && (
          <Tile>
            <TileLabel>
              {t('smartContracts:List.ContractsDeployed', {
                defaultValue: 'Contracts deployed',
              })}
            </TileLabel>
            <TileValue>
              {contracts.totalContracts.toLocaleString(NUMBER_LOCALE)}
            </TileValue>
          </Tile>
        )}

        {transactions !== undefined && (
          <Tile>
            <TileLabel>
              {t('smartContracts:List.ContractTransactions', {
                defaultValue: 'Contract transactions',
              })}
            </TileLabel>
            <TileValueRow>
              <TileValue>
                {transactions.toLocaleString(NUMBER_LOCALE)}
              </TileValue>
              {variation !== undefined && (
                <TrendValue $positive={variation >= 0}>
                  {formatVariation(variation)}
                </TrendValue>
              )}
            </TileValueRow>
            {daily && (
              <TileSub>
                {t('smartContracts:List.Today', {
                  defaultValue: '{{count}} today',
                  count: daily.newTransactions,
                  formatted:
                    daily.newTransactions.toLocaleString(NUMBER_LOCALE),
                  defaultValue_one: '{{formatted}} today',
                  defaultValue_other: '{{formatted}} today',
                })}
              </TileSub>
            )}
          </Tile>
        )}

        {leader && (
          <Tile>
            <TileLabel>
              {t('smartContracts:List.MostUsed', {
                defaultValue: 'Most used contract',
              })}
            </TileLabel>
            <TileValue>
              <SummaryContractLink href={`/smart-contract/${leader.address}`}>
                {leaderName || parseAddress(leader.address, 12)}
              </SummaryContractLink>
            </TileValue>
            <TileSub>
              {t('smartContracts:List.LeaderTransactions', {
                defaultValue: '{{amount}} transactions, all time',
                amount: leader.count.toLocaleString(NUMBER_LOCALE),
              })}
            </TileSub>
          </Tile>
        )}
      </TilesGrid>

      {busiest && (
        <>
          <DistBar role="img" aria-label={barLabel}>
            {busiest.segments.map((segment, index) => (
              <DistSegment
                key={segment.address}
                $color={segmentColor(index)}
                $delay={index * 60}
                style={{
                  width: `${(segment.count / busiest.total) * 100}%`,
                }}
                title={`${segment.name ? safeContractName(segment.name) || segment.address : segment.address} · ${segment.count.toLocaleString(NUMBER_LOCALE)}`}
                aria-hidden="true"
              />
            ))}
          </DistBar>
          <LegendRow>
            {/* "Among the busiest five" and not "of all activity": the endpoint
                returns a top ten, so the denominator is those, not the chain. */}
            <LegendItem>
              {t('smartContracts:List.BarCaption', {
                defaultValue: 'Share among the five busiest contracts',
              })}
            </LegendItem>
            {busiest.segments.map((segment, index) => (
              <LegendItem key={segment.address}>
                <LegendDot $color={segmentColor(index)} />
                {segment.name
                  ? safeContractName(segment.name) ||
                    parseAddress(segment.address, 10)
                  : parseAddress(segment.address, 10)}{' '}
                <strong>{formatShare(segment.count, busiest.total)}</strong>
              </LegendItem>
            ))}
          </LegendRow>
        </>
      )}
    </ContractsSummaryCard>
  );
};

export default ContractsSummary;
