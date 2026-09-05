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

// A day is drawn as 24 hourly points per stretch: one point per stretch drew
// as two dots and no line, which is why 1D was out until the series route
// could bucket by the hour.
const CHART_TIME_FILTER = [1, 7, 15, 30];
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
          { hourly: filterPeriod === 1 },
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
