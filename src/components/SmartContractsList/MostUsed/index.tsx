import { NUMBER_LOCALE, formatShare } from '@/components/DataList/format';
import { ShareTrack } from '@/components/DataList/styles';
import { useDeferred } from '@/components/DataList/useDeferred';
import { smartContractsStatisticCall } from '@/services/requests/smartContracts';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { topContracts } from '../summaryFigures';
import { contractLabel } from './label';
import {
  CardAddress,
  CardCount,
  CardCountLabel,
  CardName,
  CardRank,
  CardTopRow,
  ContractCard,
  EmptyNote,
  PodiumRow,
  RankedList,
  RankedRow,
  RowBar,
  RowCount,
  RowName,
  RowRank,
  SectionNote,
  SectionTitle,
} from './styles';

/**
 * The busiest contracts on chain: the podium as cards, the rest as rows, all
 * ten on screen at once.
 *
 * Replaces a horizontal carousel that showed 5,19 of its 10 cards at 1440px
 * and 1,50 at 390px (measured), behind arrows that were hardcoded enabled at
 * both ends.
 *
 * The counts are all-time, verified against the proxy's own aggregation: it
 * filters successful type-63 transactions and adds a time range only when an
 * `epoch` parameter is passed, which this page does not send. The section used
 * to be labelled "today", which the numbers never supported.
 */
const MostUsed: React.FC = () => {
  const { t } = useTranslation(['smartContracts']);
  const deferred = useDeferred();

  const { data, isLoading } = useQuery({
    queryKey: ['smartContractsStatistic'],
    queryFn: smartContractsStatisticCall,
    // Behind the list: this is the slowest of the page's calls (measured
    // 0,55s against 0,12s for the others) and nobody waits on it.
    enabled: deferred,
    staleTime: 15 * 60_000,
    gcTime: 15 * 60_000,
  });

  const busiest = topContracts(data?.statistics, 10);
  const leaderCount = busiest?.segments[0]?.count ?? 0;

  return (
    <section aria-labelledby="most-used-heading">
      <SectionTitle id="most-used-heading">
        {t('smartContracts:Titles.MostUsed', {
          defaultValue: 'Most used applications',
        })}
      </SectionTitle>
      <SectionNote>
        {t('smartContracts:List.MostUsedNote', {
          defaultValue: 'By successful contract transactions, all time.',
        })}
      </SectionNote>

      {!busiest && !isLoading && (
        <EmptyNote>
          {t('smartContracts:List.NoStatistics', {
            defaultValue: 'No contract activity has been recorded yet.',
          })}
        </EmptyNote>
      )}

      {busiest && (
        <>
          <PodiumRow>
            {busiest.segments.slice(0, 3).map((segment, index) => (
              <ContractCard
                key={segment.address}
                href={`/smart-contract/${segment.address}`}
                title={`${contractLabel(segment, 60)} · ${segment.address}`}
              >
                <CardTopRow>
                  <CardRank>{index + 1}</CardRank>
                  <CardCountLabel>
                    {formatShare(segment.count, busiest.total)}
                  </CardCountLabel>
                </CardTopRow>
                <div>
                  <CardName>{contractLabel(segment)}</CardName>
                  <CardAddress>{parseAddress(segment.address, 10)}</CardAddress>
                </div>
                <CardCount>
                  {segment.count.toLocaleString(NUMBER_LOCALE)}
                </CardCount>
              </ContractCard>
            ))}
          </PodiumRow>

          <RankedList>
            {busiest.segments.slice(3).map((segment, index) => (
              <li key={segment.address}>
                <RankedRow
                  href={`/smart-contract/${segment.address}`}
                  title={`${contractLabel(segment, 60)} · ${segment.address}`}
                >
                  <RowRank>{index + 4}</RowRank>
                  <RowName>{contractLabel(segment, 20)}</RowName>
                  {/* Scaled against the leader, not the sum: against the sum
                      the tenth bar is a two-pixel stub that says nothing. */}
                  <ShareTrack $fluid>
                    <RowBar
                      $delay={index * 40}
                      style={{
                        width:
                          leaderCount > 0
                            ? `${(segment.count / leaderCount) * 100}%`
                            : '0%',
                      }}
                    />
                  </ShareTrack>
                  <RowCount>
                    {segment.count.toLocaleString(NUMBER_LOCALE)}
                    {` · ${formatShare(segment.count, busiest.total)}`}
                  </RowCount>
                </RankedRow>
              </li>
            ))}
          </RankedList>
        </>
      )}
    </section>
  );
};

export default MostUsed;
