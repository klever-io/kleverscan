import { NUMBER_LOCALE, formatShare } from '@/components/DataList/format';
import { useDeferred } from '@/components/DataList/useDeferred';
import Skeleton from '@/components/Skeleton';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { shareModel, topContracts } from '../summaryFigures';
import { CONTRACT_SHARES_QUERY } from '../sharesQuery';
import { contractLabel } from './label';
import {
  CardAddress,
  Section,
  CardBar,
  CardBarRow,
  CardCount,
  CardCountLabel,
  CardCountRow,
  CountLabelFull,
  CountLabelShort,
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

/** Cards on the podium. */
const PODIUM = 4;

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
 * The busiest contracts on chain, top four, each with its share of all
 * contract activity.
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

  const { data, isPending, isError } = useQuery({
    ...CONTRACT_SHARES_QUERY,
    // Behind the list: this is the slowest of the page's calls (measured
    // 0,55s against 0,12s for the others) and nobody waits on it.
    enabled: deferred,
  });

  const busiest = topContracts(data?.statistics, 5);
  // Shares divide by ALL successful contract transactions, the same model the
  // summary bar draws from. Dividing by the segments' own sum read as a
  // market share it never was, and disagreed with the bar above.
  const model = shareModel(busiest, data?.allSuccessful);
  // Bars divide by what the printed share divides by; only when that
  // denominator failed to arrive do they fall back to leader scale, where no
  // label renders to disagree with.
  const barDenominator = model?.total ?? busiest?.segments[0]?.count ?? 0;
  const loadingLabel = t('smartContracts:List.MostUsedLoading', {
    defaultValue: 'Loading the most used applications',
  });

  return (
    <Section aria-labelledby="most-used-heading">
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

      {/* isPending, not isLoading: the query starts disabled while the table
          fetches, and in that state isLoading is false; keying the empty note
          on it flashed "no activity" over a chain that has plenty. */}
      {isPending && <PodiumLoading label={loadingLabel} />}

      {/* Not on isError: a failed fetch says nothing about the chain, and
          this note states a fact. */}
      {!isPending && !isError && !busiest && (
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
                  <CountLabelFull>
                    {t('smartContracts:Table.Transactions', {
                      defaultValue: 'Transactions',
                    })}
                  </CountLabelFull>
                  <CountLabelShort>
                    {t('smartContracts:List.TransactionsShort', {
                      defaultValue: 'Tx',
                    })}
                  </CountLabelShort>
                </CardCountLabel>
              </CardCountRow>

              <CardBarRow>
                {/* Scaled to the leader this bar sat full beside a label
                    saying 30%, reading as broken. */}
                <CardTrack $fluid>
                  <CardBar
                    $delay={index * 60}
                    style={{
                      width:
                        barDenominator > 0
                          ? `${(segment.count / barDenominator) * 100}%`
                          : '0%',
                    }}
                  />
                </CardTrack>
                {/* Left out rather than recomputed against the segment sum
                    when the denominator failed to arrive. */}
                {model && (
                  <CardShare>
                    {formatShare(segment.count, model.total)}
                  </CardShare>
                )}
              </CardBarRow>
            </ContractCard>
          ))}
        </PodiumRow>
      )}
    </Section>
  );
};

export default MostUsed;
