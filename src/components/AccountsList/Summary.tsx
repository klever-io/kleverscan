import {
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TileValueRow,
  TilesGrid,
} from '@/components/DataList/styles';
import {
  accountsCreatedCall,
  accountsTotalCall,
} from '@/services/requests/accounts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { summaryFigures } from './summaryFigures';
import {
  AccountsSummaryCard,
  AccountsSummaryLoading,
  TrendNote,
} from './styles';

/**
 * Pinned rather than left to the browser, the way the assets registry strip
 * pins its own counts. Bare toLocaleString() formats in the reader's browser
 * locale, which can differ from the page's: a Dutch browser would print
 * 176.197 beside English labels, and the site ships one locale.
 */
const NUMBER_LOCALE = 'en-US';

/** Days of history fetched. The first entry is the running 24 hours. */
const WINDOW_DAYS = 7;

/**
 * The figures above the account list.
 *
 * Two requests, which is what the card this replaced already cost: the record
 * count, and the daily series. The series is asked for a week rather than a
 * day because a seven-day answer opens with the same entry a one-day answer
 * returns, so one call covers the 24-hour figure, its change against yesterday
 * and the week total.
 */
const AccountsSummary: React.FC = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const label = t('accounts:List.SummaryAria', {
    defaultValue: 'Account statistics',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['accountsSummary'],
    queryFn: async () => {
      // Each call answers undefined for its own failure instead of throwing,
      // because `api.get` resolves on failure rather than rejecting. That is
      // what lets a degraded endpoint cost its own tile and leave the other
      // standing, and it is why plain Promise.all is right here: after those
      // guards there is nothing left to reject.
      const [totalRecords, series] = await Promise.all([
        accountsTotalCall(),
        accountsCreatedCall(WINDOW_DAYS),
      ]);
      // Newest entry first. An empty series and a failed request both end up
      // as no tile, which is the honest rendering of either.
      return { totalRecords, series: series ?? [] };
    },
    // These move by a handful of accounts a day, so a fresh look on every
    // mount would cost a round trip to show the same number. A function, not a
    // constant, for the reason `badgeQueries` spells out: both calls answer
    // undefined on failure and the queryFn wraps them in an object, so a wholly
    // failed strip is filed as a success and a flat value would pin it for five
    // minutes across client-side navigation.
    staleTime: query => {
      const cached = query.state.data as
        | { totalRecords?: number; series?: unknown[] }
        | undefined;
      // At least one figure that actually arrived. A series is positional and
      // keeps a hole for a day with no usable count, so its length alone is
      // true for `[undefined, undefined, ...]`, which is a failed strip.
      const answered =
        cached?.totalRecords !== undefined ||
        !!cached?.series?.some(day => day !== undefined);
      return answered ? 5 * 60 * 1000 : 0;
    },
  });

  if (isLoading) {
    return <AccountsSummaryLoading label={label} tiles={3} />;
  }

  if (!data) return null;

  const { totalRecords, series } = data;
  const { today, change, windowTotal, countedDays } = summaryFigures(series);

  // Nothing to show is better than a card of blanks. All three figures have to
  // be missing before that is true, and `windowTotal` is genuinely a third
  // one: since the series keeps holes, today can be absent while the rest of
  // the window still carries figures, and testing only the first two would
  // hide a tile that has something to say.
  if (
    totalRecords === undefined &&
    today === undefined &&
    windowTotal === undefined
  ) {
    return null;
  }

  // Carries a testid as well as the label, because the loading shape above
  // renders the same aria-label: an assertion aimed at the label alone can
  // land on the skeleton and read its empty tiles as the real figures.
  return (
    <AccountsSummaryCard aria-label={label} data-testid="accounts-summary">
      <TilesGrid>
        {totalRecords !== undefined && (
          <Tile>
            <TileLabel>{t('common:Cards.Total Accounts')}</TileLabel>
            <TileValueRow>
              {/* Written out rather than compacted: this is the figure a
                  reader may want to quote. Locale-formatted like the home
                  page renders the same number; the query is unresolved during
                  SSR, so the server renders the skeleton and never this. */}
              <TileValue>
                {totalRecords.toLocaleString(NUMBER_LOCALE)}
              </TileValue>
            </TileValueRow>
            <TileSub>
              {t('accounts:List.OnChain', { defaultValue: 'on chain' })}
            </TileSub>
          </Tile>
        )}

        {today !== undefined && (
          <Tile>
            <TileLabel>
              {t('accounts:List.New24h', { defaultValue: 'New (24h)' })}
            </TileLabel>
            <TileValueRow>
              <TileValue>{today.toLocaleString(NUMBER_LOCALE)}</TileValue>
            </TileValueRow>
            {change !== undefined && (
              <TileSub>
                {/* A count, not a percentage. The daily figures run in single
                    and double digits, where one account moves the percentage
                    by ten points and suggests a precision the number does not
                    have. */}
                <TrendNote>
                  {t('accounts:List.VersusYesterday', {
                    defaultValue: '{{change}} vs yesterday',
                    change: `${change > 0 ? '+' : ''}${change.toLocaleString(NUMBER_LOCALE)}`,
                  })}
                </TrendNote>
              </TileSub>
            )}
          </Tile>
        )}

        {windowTotal !== undefined && (
          <Tile>
            <TileLabel>
              {t('accounts:List.NewWindow', {
                defaultValue: 'New ({{days}}d)',
                days: WINDOW_DAYS,
              })}
            </TileLabel>
            <TileValueRow>
              <TileValue>{windowTotal.toLocaleString(NUMBER_LOCALE)}</TileValue>
            </TileValueRow>
            <TileSub>
              {/* The days actually summed, not the days asked for: a short
                  series would otherwise be labelled as a full week. Pluralised
                  through i18next's `count`, so the one-day case the API can
                  return does not read "across 1 days". */}
              {t('accounts:List.AcrossDays', {
                count: countedDays,
                defaultValue_one: 'across {{count}} day',
                defaultValue_other: 'across {{count}} days',
              })}
            </TileSub>
          </Tile>
        )}
      </TilesGrid>
    </AccountsSummaryCard>
  );
};

export default AccountsSummary;
