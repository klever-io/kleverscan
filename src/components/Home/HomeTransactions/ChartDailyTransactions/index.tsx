import { PropsWithChildren } from 'react';
import Chart, { ChartType } from '@/components/Chart';
import { DoubleTxsTooltip } from '@/components/Chart/Tooltips';
import { ArrowVariation } from '@/components/Home/CoinDataFetcher/CoinCard/styles';
import { Loader } from '@/components/Loader/styles';
import { IDoubleChart } from '@/pages/charts';
import { buildChartSeries } from '@/services/requests/home/chartSeries';
import { transactionSeriesCall } from '@/services/requests/home/transactionSeries';
import { getVariation } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import {
  ContainerTimeFilter,
  ItemTimeFilter,
  ListItemTimeFilter,
  TimeSeriesChgValue,
  TimeSeriesChgValueText,
  TransactionChart,
  TransactionChartContent,
  TransactionEmpty,
  VariationText,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

/**
 * A period needs at least two points per line to draw one, and a day gives one
 * per stretch, so 1D used to render a pair of dots and no line. Hourly points
 * would fix it, but the proxy's histogram only buckets by day or month, and a
 * request per hour is refused: 48 in parallel answered once and then returned
 * 10 and 0 on the two runs after it, while testnet, which CI uses, refused 20
 * of them outright. The card beside the chart already reports the last 24
 * hours, and now agrees with this chart's own figures.
 */
const CHART_TIME_FILTER = [7, 15, 30];
const TIME_SERIES_CHG_VALUE = {
  inPeriod: 0,
  percent: '',
};

export const ChartDailyTransactions: React.FC<PropsWithChildren> = () => {
  const [isLoadingDailyTxs, setIsLoadingDailyTxs] = useState(false);
  // The period the chart reports, in days, and the same number the buttons
  // carry. It used to hold the button's value plus one, so every slice ran a
  // day long: "1D" summed two days, "7D" eight, "1M" thirty-one.
  const [filterPeriod, setFilterPeriod] = useState(15);
  const [transactionTimeSeriesChgValue, setTransactionTimeSeriesChgValue] =
    useState(TIME_SERIES_CHG_VALUE);
  const [transactionTimeSeries, setTransactionTimeSeries] = useState<
    IDoubleChart[]
  >([]);

  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('transactions');

  useEffect(() => {
    // The periods do not settle in the order they were asked for: 7D counts a
    // rolling window per point, fourteen requests, while 15D and 1M take one.
    // Switching away from 7D therefore lands the newer answer first and the
    // older one on top of it, under the newer label.
    let current = true;

    const getTransactionsChartTimeSeries = async () => {
      try {
        setIsLoadingDailyTxs(true);

        // Rolling windows where the request count allows it, UTC-day buckets
        // beyond that; the module says which and why.
        const rawTxList = await transactionSeriesCall(filterPeriod);
        if (!current) return;
        if (!rawTxList.length) {
          // Cleared, not left alone: returning here kept the previous
          // period's line and percentage on screen under the new label.
          setTransactionTimeSeries([]);
          setTransactionTimeSeriesChgValue(TIME_SERIES_CHG_VALUE);
          return;
        }

        // Parsed and paired outside the effect, where Jest can reach it:
        // the effect keeps the fetch, the guards and the state.
        const { pairs, total, previousTotal } = buildChartSeries(
          rawTxList,
          month => commonT(`Date.Months.${month}`),
        );

        setTransactionTimeSeries(pairs as IDoubleChart[]);
        setTransactionTimeSeriesChgValue({
          inPeriod: total,
          // No baseline is no percentage: against zero every change is
          // infinite, and getVariation prints "--" for a falsy figure.
          percent: getVariation(
            previousTotal > 0
              ? ((total - previousTotal) / previousTotal) * 100
              : 0,
          ),
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (current) setIsLoadingDailyTxs(false);
      }
    };

    getTransactionsChartTimeSeries();

    return () => {
      current = false;
    };
  }, [filterPeriod]);

  return (
    <TransactionChart>
      <ContainerTimeFilter>
        <div>
          <span>{t('Transactions')}</span>

          <TimeSeriesChgValue>
            {toLocaleFixed(transactionTimeSeriesChgValue.inPeriod, 0)}

            <TimeSeriesChgValueText>
              <span>{filterPeriod < 30 ? `${filterPeriod}D` : '1M'}</span>
            </TimeSeriesChgValueText>
          </TimeSeriesChgValue>
          <VariationText
            $positive={transactionTimeSeriesChgValue.percent.includes('+')}
          >
            <ArrowVariation
              $isPositive={transactionTimeSeriesChgValue.percent.includes('+')}
            />
            {transactionTimeSeriesChgValue.percent}
          </VariationText>
        </div>

        <ListItemTimeFilter>
          {isLoadingDailyTxs && <Loader width={20} height={20} />}

          {CHART_TIME_FILTER.map(item => (
            <ItemTimeFilter
              key={String(item)}
              onClick={() => setFilterPeriod(item)}
              selected={filterPeriod === item}
            >
              {item !== 30 ? `${String(item)}D` : '1M'}
            </ItemTimeFilter>
          ))}
        </ListItemTimeFilter>
      </ContainerTimeFilter>

      {!!transactionTimeSeries?.length && (
        <TransactionChartContent>
          <Chart
            type={ChartType.DoubleArea}
            data={transactionTimeSeries}
            CustomTooltip={DoubleTxsTooltip}
            value="valueNow"
            value2="valuePast"
            yAxis={true}
            hasTooltip={true}
            strokeWidth={1}
            height={'100%'}
          />
        </TransactionChartContent>
      )}

      {!isLoadingDailyTxs && !transactionTimeSeries?.length && (
        <TransactionEmpty>
          <span>{commonT('EmptyData')}</span>
        </TransactionEmpty>
      )}
    </TransactionChart>
  );
};
