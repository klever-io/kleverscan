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
  accountsCreatedInWindow,
  accountsTotalCall,
} from '@/services/requests/accounts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { summaryFigures } from './summaryFigures';
import {
  AccountsSummaryCard,
  AccountsSummaryLoading,
  LabelFull,
  LabelShort,
  TrendNote,
} from './styles';

import { NUMBER_LOCALE } from '@/components/DataList/format';

/** Windows of 24 hours the wider tile covers. */
const WINDOW_DAYS = 7;

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
      const [totalRecords, series, windowTotal] = await Promise.all([
        accountsTotalCall(),
        accountsCreatedCall(),
        accountsCreatedInWindow(WINDOW_DAYS),
      ]);
      // Newest entry first.
      return { totalRecords, series: series ?? [], windowTotal };
    },
    // A function, not a constant, for the reason `badgeQueries` spells out.
    staleTime: query => {
      const cached = query.state.data as
        | {
            totalRecords?: number;
            series?: unknown[];
            windowTotal?: number;
          }
        | undefined;
      // The series keeps holes, so its length alone is true for a strip of
      // undefineds; require at least one figure that actually arrived. All
      // three sources count: each is its own request, so the wider window can
      // answer when the other two did not, and a cached strip that holds one
      // real figure must not be refetched on every mount.
      const answered =
        cached?.totalRecords !== undefined ||
        cached?.windowTotal !== undefined ||
        !!cached?.series?.some(day => day !== undefined);
      return answered ? 5 * 60 * 1000 : 0;
    },
  });

  if (isLoading) {
    return <AccountsSummaryLoading label={label} tiles={3} />;
  }

  if (!data) return null;

  const { totalRecords, series, windowTotal } = data;
  const { today, change } = summaryFigures(series);

  // `windowTotal` is genuinely a third check: it is its own request, so it can
  // arrive when the day figure did not.
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
            <TileLabel>
              <LabelFull>{t('common:Cards.Total Accounts')}</LabelFull>
              <LabelShort>
                {t('accounts:List.TotalShort', { defaultValue: 'Accounts' })}
              </LabelShort>
            </TileLabel>
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
                    defaultValue: '{{change}} vs previous 24h',
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
              {/* One counted range, so the days summed are the days asked for.
                  Pluralised through i18next's `count` so one day does not read
                  "across 1 days". */}
              {t('accounts:List.AcrossDays', {
                count: WINDOW_DAYS,
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
