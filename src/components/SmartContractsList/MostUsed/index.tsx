import { NUMBER_LOCALE, formatShare } from '@/components/DataList/format';
import { useDeferred } from '@/components/DataList/useDeferred';
import Skeleton from '@/components/Skeleton';
import { smartContractsStatisticCall } from '@/services/requests/smartContracts';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { topContracts } from '../summaryFigures';
import { contractLabel } from './label';
import {
  CardAddress,
  CardBar,
  CardBarRow,
  CardCount,
  CardCountLabel,
  CardCountRow,
  CardIdentity,
  CardName,
  CardRank,
  CardShare,
  CardTopRow,
  CardTrack,
  ContractCard,
  EmptyNote,
  PlaceholderCard,
  PodiumRow,
  SectionNote,
  SectionTitle,
} from './styles';

/** Cards on the podium. The share texts still divide by the ten busiest, the
 *  denominator the section note names. */
const PODIUM = 3;

/**
 * The same line boxes as the loaded card, so the section holds its height
 * while the statistics are still out. That matters more here than usual:
 * the query is deliberately deferred behind the table's own request, so
 * without this the cards land while the reader is already reading the rows
 * below, and push them down.
 */
const PodiumLoading: React.FC<{ label: string }> = ({ label }) => (
  <PodiumRow aria-label={label} aria-busy="true">
    {Array.from({ length: PODIUM }, (unused, index) => (
      <PlaceholderCard key={index}>
        <CardTopRow>
          <Skeleton width={26} height={26} />
          <CardIdentity>
            {/* Name (1.25rem) and address (1rem) line boxes, in rem so they
                shrink with the root font the way the real text does. */}
            <Skeleton
              width="45%"
              height="0.875rem"
              containerCustomStyles={{ margin: '0.1875rem 0' }}
            />
            <Skeleton
              width="70%"
              height="0.625rem"
              containerCustomStyles={{ margin: '0.1875rem 0' }}
            />
          </CardIdentity>
        </CardTopRow>
        {/* The count's 1.875rem line box. */}
        <Skeleton
          width="35%"
          height="1.375rem"
          containerCustomStyles={{ margin: '0.25rem 0' }}
        />
        {/* The real bar row, so its height derives from the same boxes as the
            loaded one instead of being re-approximated here. */}
        <CardBarRow>
          <CardTrack $fluid />
          <CardShare>
            {/* A bar in the share text's own 0.9375rem line box. */}
            <Skeleton
              width={38}
              height="0.6875rem"
              containerCustomStyles={{ margin: '0.125rem 0' }}
            />
          </CardShare>
        </CardBarRow>
      </PlaceholderCard>
    ))}
  </PodiumRow>
);

/**
 * The busiest contracts on chain, top three, each with its share of the ten
 * busiest.
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

  const { data, isPending } = useQuery({
    queryKey: ['smartContractsStatistic'],
    queryFn: smartContractsStatisticCall,
    // Behind the list: this is the slowest of the page's calls (measured
    // 0,55s against 0,12s for the others) and nobody waits on it.
    enabled: deferred,
    staleTime: 15 * 60_000,
    gcTime: 15 * 60_000,
  });

  // Ten, not three: the ten busiest are the denominator of every share shown.
  const busiest = topContracts(data?.statistics, 10);
  const leaderCount = busiest?.segments[0]?.count ?? 0;
  const loadingLabel = t('smartContracts:List.MostUsedLoading', {
    defaultValue: 'Loading the most used applications',
  });

  return (
    <section aria-labelledby="most-used-heading">
      <SectionTitle id="most-used-heading">
        {t('smartContracts:Titles.MostUsed', {
          defaultValue: 'Most used applications',
        })}
      </SectionTitle>
      <SectionNote>
        {t('smartContracts:List.MostUsedNote', {
          defaultValue:
            'By successful contract transactions, all time. Shares are of the ten busiest.',
        })}
      </SectionNote>

      {/* isPending, not isLoading: the query starts disabled while the table
          fetches, and in that state isLoading is false; keying the empty note
          on it flashed "no activity" over a chain that has plenty. */}
      {isPending && <PodiumLoading label={loadingLabel} />}

      {!isPending && !busiest && (
        <EmptyNote>
          {t('smartContracts:List.NoStatistics', {
            defaultValue: 'No contract activity has been recorded yet.',
          })}
        </EmptyNote>
      )}

      {busiest && (
        <PodiumRow>
          {busiest.segments.slice(0, PODIUM).map((segment, index) => (
            <ContractCard
              key={segment.address}
              href={`/smart-contract/${segment.address}`}
              title={`${contractLabel(segment, 60)} · ${segment.address}`}
            >
              <CardTopRow>
                <CardRank $leader={index === 0}>{index + 1}</CardRank>
                <CardIdentity>
                  <CardName>{contractLabel(segment, 18)}</CardName>
                  <CardAddress>{parseAddress(segment.address, 16)}</CardAddress>
                </CardIdentity>
              </CardTopRow>

              <CardCountRow>
                <CardCount>
                  {segment.count.toLocaleString(NUMBER_LOCALE)}
                </CardCount>
                <CardCountLabel>
                  {t('smartContracts:Table.Transactions', {
                    defaultValue: 'Transactions',
                  })}
                </CardCountLabel>
              </CardCountRow>

              <CardBarRow>
                {/* Scaled against the leader so the second and third bar stay
                    readable; the text beside it carries the true share. */}
                <CardTrack $fluid>
                  <CardBar
                    $delay={index * 60}
                    style={{
                      width:
                        leaderCount > 0
                          ? `${(segment.count / leaderCount) * 100}%`
                          : '0%',
                    }}
                  />
                </CardTrack>
                <CardShare>
                  {formatShare(segment.count, busiest.total)}
                </CardShare>
              </CardBarRow>
            </ContractCard>
          ))}
        </PodiumRow>
      )}
    </section>
  );
};

export default MostUsed;
