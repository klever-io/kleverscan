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
  TilesGrid,
} from '@/components/DataList/styles';
import { useDeferred } from '@/components/DataList/useDeferred';
import Skeleton from '@/components/Skeleton';
import {
  activeContracts24hCall,
  contractTransactions24hCall,
  smartContractsListCall,
  smartContractTotalTransactionsListCall,
} from '@/services/requests/smartContracts';
import { safeContractName } from '@/utils/contractName';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useTheme } from 'styled-components';
import { contractLabel } from './MostUsed/label';
import ContractsSummaryLoadingCard, {
  FiguresBarPlaceholder,
} from './LoadingCard';
import {
  ContractsSummaryCard,
  MostUsedTile,
  SummaryContractLink,
  LegendName,
} from './styles';
import {
  segmentColor,
  shareBarLabel,
  shareModel,
  topContracts,
} from './summaryFigures';
import { CONTRACT_SHARES_QUERY } from './sharesQuery';

import { IContractShare } from '@/components/SmartContractsList/summaryFigures';
/**
 * A quarter of an hour. These are chain-wide totals that move by fractions of
 * a percent between reads, and the page they sit on used to refetch four
 * queries every four seconds for the same numbers.
 */
const FIGURE_CACHE = { staleTime: 15 * 60_000, gcTime: 15 * 60_000 };

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
      const [contracts, transactions, windows, active] = await Promise.all([
        smartContractsListCall(),
        smartContractTotalTransactionsListCall(),
        contractTransactions24hCall(),
        activeContracts24hCall(),
      ]);
      return { contracts, transactions, windows, active };
    },
    ...FIGURE_CACHE,
  });

  const { data: shares, isPending: sharesPending } = useQuery({
    ...CONTRACT_SHARES_QUERY,
    // Behind the list, not beside it: the bar is decoration nobody waits on,
    // and the statistics call is the slowest of the page (0,55s measured).
    enabled: deferred,
  });

  if (isLoading) {
    return <ContractsSummaryLoadingCard label={label} />;
  }
  if (!data) return null;

  const { contracts, transactions, windows, active } = data;
  const busiest = topContracts(shares?.statistics);
  const model = shareModel(busiest, shares?.allSuccessful);
  // Each tile appears only when its own request answered; a failed part is
  // left out rather than printing a zero the chain never reported.
  if (contracts === undefined && transactions === undefined && !busiest) {
    return null;
  }

  const leader = busiest?.segments[0];
  const leaderName = leader?.name ? safeContractName(leader.name) : '';

  // blueGray500 stays reserved for the Other remainder, the way the
  // transactions breakdown mutes its own computed rest; rose is the fifth
  // distinct hue.
  const palette = [
    theme.violet,
    theme.purple,
    theme.lightPurple,
    theme.green,
    theme.rose,
  ];

  const identity = (segment: Pick<IContractShare, 'address' | 'name'>) =>
    segment.name
      ? safeContractName(segment.name) || segment.address
      : segment.address;
  const otherLabel = t('smartContracts:List.OtherContracts', {
    defaultValue: 'Other contracts',
  });

  const barLabel = shareBarLabel(model, otherLabel);

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
            {active !== undefined && (
              <TileSub>
                {/* The share that ran at all: 16 of 211 on 2026-09-03, which
                    a deployed count alone does not tell a reader. */}
                {t('smartContracts:List.ActiveLast24h', {
                  defaultValue: '{{formatted}} active in the last 24h',
                  formatted: active.toLocaleString(NUMBER_LOCALE),
                })}
              </TileSub>
            )}
          </Tile>
        )}

        {transactions !== undefined && (
          <Tile>
            <TileLabel>
              {t('smartContracts:List.ContractTransactions', {
                defaultValue: 'Contract transactions',
              })}
            </TileLabel>
            <TileValue>{transactions.toLocaleString(NUMBER_LOCALE)}</TileValue>
            {windows && (
              <TileSub>
                {t('smartContracts:List.Last24h', {
                  defaultValue: '{{formatted}} in the last 24 hours',
                  formatted: windows.last24h.toLocaleString(NUMBER_LOCALE),
                })}
              </TileSub>
            )}
          </Tile>
        )}

        {/* The statistics arrive after the tiles on purpose (deferred), so
            this tile reserves its boxes rather than growing the card while
            the reader is already below it. Label and value line boxes are
            27,5px and 16,5px, the same as the loaded lines. Third by
            position: ContractsSummaryLoadingCard mirrors this order blindly
            (its tileIndex 2 is the MostUsedTile), so reordering or inserting
            tiles here means moving that file with it. */}
        {leader ? (
          <MostUsedTile>
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
          </MostUsedTile>
        ) : (
          sharesPending && (
            <MostUsedTile aria-busy="true">
              <TileLabel>
                {t('smartContracts:List.MostUsed', {
                  defaultValue: 'Most used contract',
                })}
              </TileLabel>
              <Skeleton
                width="55%"
                height="1.09375rem"
                containerCustomStyles={{ margin: '0.3125rem 0' }}
              />
              <Skeleton
                width="70%"
                height="0.65625rem"
                containerCustomStyles={{
                  margin: '0.1875rem 0',
                  marginTop: 'calc(0.1875rem + 2px)',
                }}
              />
            </MostUsedTile>
          )
        )}
      </TilesGrid>

      {!model && sharesPending && <FiguresBarPlaceholder />}

      {model && (
        <>
          <DistBar role="img" aria-label={barLabel}>
            {model.segments.map((segment, index) => (
              <DistSegment
                key={segment.address}
                $color={segmentColor(index, palette)}
                $delay={index * 60}
                style={{
                  width: `${(segment.count / model.total) * 100}%`,
                }}
                title={`${segment.name ? safeContractName(segment.name) || segment.address : segment.address} · ${segment.count.toLocaleString(NUMBER_LOCALE)}`}
                aria-hidden="true"
              />
            ))}
            {model.other > 0 && (
              <DistSegment
                $color={theme.blueGray500}
                $delay={model.segments.length * 60}
                $dimmed
                style={{ width: `${(model.other / model.total) * 100}%` }}
                title={`${otherLabel} · ${model.other.toLocaleString(NUMBER_LOCALE)}`}
                aria-hidden="true"
              />
            )}
          </DistBar>
          <LegendRow>
            {model.segments.map((segment, index) => (
              <LegendItem key={segment.address} title={identity(segment)}>
                <LegendDot $color={segmentColor(index, palette)} />
                <LegendName>{contractLabel(segment, 10)}</LegendName>
                <strong>{formatShare(segment.count, model.total)}</strong>
              </LegendItem>
            ))}
            {model.other > 0 && (
              <LegendItem $dimmed title={otherLabel}>
                <LegendDot $color={theme.blueGray500} />
                <LegendName>{otherLabel}</LegendName>
                <strong>{formatShare(model.other, model.total)}</strong>
              </LegendItem>
            )}
          </LegendRow>
        </>
      )}
    </ContractsSummaryCard>
  );
};

export default ContractsSummary;
