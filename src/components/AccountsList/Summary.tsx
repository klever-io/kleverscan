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
import {
  AccountsSummaryCard,
  AccountsSummaryLoading,
  TrendNote,
} from './styles';

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
      // allSettled, not all: the two figures are independent, and one endpoint
      // being down should cost its own tile rather than the whole strip. With
      // Promise.all a single rejection throws the query away and the render
      // below never gets to leave one tile out.
      const [total, created] = await Promise.allSettled([
        accountsTotalCall(),
        accountsCreatedCall(WINDOW_DAYS),
      ]);
      const days =
        created.status === 'fulfilled'
          ? (created.value?.data?.number_by_day ?? [])
          : [];
      return {
        totalRecords:
          total.status === 'fulfilled'
            ? total.value?.pagination?.totalRecords
            : undefined,
        // Newest entry first. Anything that is not a real count is dropped
        // rather than carried: a single undefined would turn the week total
        // into NaN and print "NaN" where a figure belongs.
        series: days
          .map(day => day?.doc_count)
          .filter((count): count is number => Number.isFinite(count)),
      };
    },
    // These move by a handful of accounts a day, so a fresh look on every
    // mount would cost a round trip to show the same number.
    staleTime: 5 * 60 * 1000,
    // No retry option on purpose: allSettled above swallows both rejections,
    // so the query never fails and a retry setting here would be a line that
    // declares a policy it can never apply.
  });

  if (isLoading) {
    return <AccountsSummaryLoading label={label} tiles={3} />;
  }

  if (!data) return null;

  const { totalRecords, series } = data;
  const today = series[0];
  // Undefined where the series is too short to have one, which is not the same
  // as a day on which nothing happened.
  const yesterday = series.length > 1 ? series[1] : undefined;
  const weekTotal = series.length
    ? series.reduce((sum, count) => sum + count, 0)
    : undefined;

  const change =
    today !== undefined && yesterday !== undefined
      ? today - yesterday
      : undefined;

  // Nothing to show is better than a card of blanks: every figure here comes
  // from one of the two requests, so if both came back empty the strip has no
  // subject.
  if (totalRecords === undefined && today === undefined) return null;

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
              <TileValue>{totalRecords.toLocaleString()}</TileValue>
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
              <TileValue>{today.toLocaleString()}</TileValue>
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
                    change: `${change > 0 ? '+' : ''}${change.toLocaleString()}`,
                  })}
                </TrendNote>
              </TileSub>
            )}
          </Tile>
        )}

        {weekTotal !== undefined && (
          <Tile>
            <TileLabel>
              {t('accounts:List.NewWindow', {
                defaultValue: 'New ({{days}}d)',
                days: WINDOW_DAYS,
              })}
            </TileLabel>
            <TileValueRow>
              <TileValue>{weekTotal.toLocaleString()}</TileValue>
            </TileValueRow>
            <TileSub>
              {/* The days actually summed, not the days asked for: a short
                  series would otherwise be labelled as a full week. Pluralised
                  through i18next's `count`, so the one-day case the API can
                  return does not read "across 1 days". */}
              {t('accounts:List.AcrossDays', {
                count: series.length,
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
