import { ArrowLeft, ArrowRight } from '@/assets/pagination';
import { useDeferred } from '@/components/DataList/useDeferred';
import { smartContractsStatisticCall } from '@/services/requests/smartContracts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { topContracts } from '../summaryFigures';
import {
  CarouselArrow,
  CarouselRow,
  CarouselTrack,
  EmptyNote,
  SectionNote,
  SectionTitle,
} from './styles';
import {
  BarsVariant,
  CardsVariant,
  FeaturedVariant,
  isVariant,
  MostUsedVariant,
  RankedVariant,
} from './variants';

/** Which variants scroll sideways and so need the arrows around them. */
const SCROLLING: MostUsedVariant[] = ['cards', 'bars'];

/**
 * The busiest contracts on chain.
 *
 * The counts are all-time, verified against the proxy's own query: it filters
 * successful type-63 transactions and adds a time range only when an `epoch`
 * parameter is passed, which this page does not send. The section used to be
 * labelled "today", which the numbers never supported.
 */
const MostUsed: React.FC = () => {
  const { t } = useTranslation(['smartContracts']);
  const router = useRouter();
  const deferred = useDeferred();
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // TEMPORARY: the variant switch for choosing between the four candidates.
  // Removed with `variants.tsx` once one is picked.
  const variant: MostUsedVariant = isVariant(router.query.carousel)
    ? router.query.carousel
    : 'cards';

  const { data, isLoading } = useQuery({
    queryKey: ['smartContractsStatistic'],
    queryFn: smartContractsStatisticCall,
    // Behind the list: this is the slowest of the page's calls (measured
    // 0,55s against 0,12s for the others) and nobody waits on it.
    enabled: deferred,
    staleTime: 15 * 60_000,
    gcTime: 15 * 60_000,
  });

  const readEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 1);
    // A pixel of slack: fractional layout widths mean scrollLeft never reaches
    // the exact difference, so an exact comparison never disables the arrow.
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 1);
  }, []);

  useEffect(() => {
    readEdges();
  }, [readEdges, data, variant]);

  const scrollBy = (direction: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft += direction * track.offsetWidth;
  };

  const busiest = topContracts(data?.statistics, 10);
  const countLabel = t('smartContracts:Table.Transactions', {
    defaultValue: 'Transactions',
  });

  const body = (): React.ReactElement | null => {
    if (!busiest) return null;
    const props = {
      segments: busiest.segments,
      total: busiest.total,
      countLabel,
    };
    switch (variant) {
      case 'bars':
        return <BarsVariant {...props} />;
      case 'ranked':
        return <RankedVariant {...props} />;
      case 'featured':
        return <FeaturedVariant {...props} />;
      default:
        return <CardsVariant {...props} />;
    }
  };

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

      {busiest && SCROLLING.includes(variant) && (
        <CarouselRow>
          <CarouselArrow
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            $enabled={!atStart}
            aria-label={t('smartContracts:List.ScrollBack', {
              defaultValue: 'Scroll back',
            })}
          >
            <ArrowLeft />
          </CarouselArrow>
          <CarouselTrack ref={trackRef} onScroll={readEdges} tabIndex={0}>
            {body()}
          </CarouselTrack>
          <CarouselArrow
            type="button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            $enabled={!atEnd}
            aria-label={t('smartContracts:List.ScrollForward', {
              defaultValue: 'Scroll forward',
            })}
          >
            <ArrowRight />
          </CarouselArrow>
        </CarouselRow>
      )}

      {busiest && !SCROLLING.includes(variant) && body()}
    </section>
  );
};

export default MostUsed;
