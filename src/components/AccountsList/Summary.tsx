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

// Pinned: bare toLocaleString() follows the reader's browser locale, and a
// Dutch browser would print 176.197 beside English labels.
const NUMBER_LOCALE = 'en-US';

/** Days of history fetched. The first entry is the running 24 hours. */
const WINDOW_DAYS = 7;

// The series is asked for a week because a seven-day answer opens with the
// same entry a one-day answer returns: one call covers all three tiles.
const AccountsSummary: React.FC = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const label = t('accounts:List.SummaryAria', {
    defaultValue: 'Account statistics',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['accountsSummary'],
    queryFn: async () => {
      // api.get resolves failures as undefined instead of rejecting: a degraded
      // endpoint costs its own tile, and Promise.all has nothing left to reject.
      const [totalRecords, series] = await Promise.all([
        accountsTotalCall(),
        accountsCreatedCall(WINDOW_DAYS),
      ]);
      // Newest entry first.
      return { totalRecords, series: series ?? [] };
    },
    // A function, not a constant, for the reason `badgeQueries` spells out.
    staleTime: query => {
      const cached = query.state.data as
        | { totalRecords?: number; series?: unknown[] }
        | undefined;
      // The series keeps holes, so its length alone is true for a strip of
      // undefineds; require at least one figure that actually arrived.
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

  // `windowTotal` is genuinely a third check: the series keeps holes, so today
  // can be absent while the rest of the window still carries figures.
  if (
    totalRecords === undefined &&
    today === undefined &&
    windowTotal === undefined
  ) {
    return null;
  }

  // The loading shape renders the same aria-label, so an assertion on the
  // label alone can land on the skeleton; hence the testid.
  return (
    <AccountsSummaryCard aria-label={label} data-testid="accounts-summary">
      <TilesGrid>
        {totalRecords !== undefined && (
          <Tile>
            <TileLabel>{t('common:Cards.Total Accounts')}</TileLabel>
            <TileValueRow>
              {/* Written out, not compacted: the figure a reader may quote. The
                  query is unresolved during SSR; the server renders the skeleton. */}
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
                {/* A count, not a percentage: the daily figures run in single
                    and double digits, where one account moves it ten points. */}
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
              {/* The days actually summed, not the days asked for. Pluralised
                  through i18next's `count` so one day does not read "across 1 days". */}
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
