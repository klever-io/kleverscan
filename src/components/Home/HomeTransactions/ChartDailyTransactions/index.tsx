import { PropsWithChildren } from 'react';
import Chart, { ChartType } from '@/components/Chart';
import { DoubleTxsTooltip } from '@/components/Chart/Tooltips';
import { ArrowVariation } from '@/components/Home/CoinDataFetcher/CoinCard/styles';
import { Loader } from '@/components/Loader/styles';
import { IDoubleChart } from '@/pages/charts';
import api from '@/services/api';
import { IDailyTransaction } from '@/types';
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
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

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
    const getTransactionsChartTimeSeries = async () => {
      try {
        setIsLoadingDailyTxs(true);

        const res = await api.get({
          route: `transaction/list/count/${filterPeriod * 2}`,
        });
        if (res?.error?.length) return;

        const rawTxList: IDailyTransaction[] = res?.data?.number_by_day;
        if (!rawTxList) return;

        const parsedTxList = rawTxList
          .sort((a, b) => a.key - b.key)
          .reduce(
            (acc, transaction) => {
              if (
                !transaction ||
                !transaction.key ||
                isNaN(transaction.doc_count)
              )
                return acc;

              const date = new Date(transaction.key);

              date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

              const formattedDate = format(date, 'dd MMM');
              const [day, month] = formattedDate.split(' ');

              const monthString = commonT(`Date.Months.${month}`);

              const dateString = `${day} ${monthString}`;

              acc.push({
                date: dateString,
                value: transaction.doc_count,
              });

              return acc;
            },
            [] as Array<{ date: string; value: number }>,
          );

        const firstSlice = parsedTxList.slice(0, parsedTxList.length / 2);
        const secondSlice = parsedTxList.slice(
          parsedTxList.length / 2,
          parsedTxList.length,
        );

        const mergedTransactionTimeSeries = firstSlice.map((txPast, index) => ({
          valueNow: secondSlice[index].value as number,
          dateNow: secondSlice[index].date,
          txNow: secondSlice[index],
          valuePast: txPast.value as number,
          datePast: txPast.date as string,
          txPast,
        })) as IDoubleChart[];

        // The two the legend names: this period against the one before it.
        // The figure used to be the first day of the current period against
        // its own last day, divided by a thousand and forced positive, so a
        // fortnight that ran 49.74 percent above the previous one reported
        // 0.63 percent (measured 2026-09-03).
        const totalSum = mergedTransactionTimeSeries.reduce(
          (acc, curr) => acc + (curr?.valueNow ?? 0),
          0,
        );
        const previousSum = mergedTransactionTimeSeries.reduce(
          (acc, curr) => acc + (curr?.valuePast ?? 0),
          0,
        );

        setTransactionTimeSeries(mergedTransactionTimeSeries);
        setTransactionTimeSeriesChgValue({
          inPeriod: totalSum,
          // No baseline is no percentage: against zero every change is
          // infinite, and getVariation prints "--" for a falsy figure.
          percent: getVariation(
            previousSum > 0
              ? ((totalSum - previousSum) / previousSum) * 100
              : 0,
          ),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingDailyTxs(false);
      }
    };

    getTransactionsChartTimeSeries();
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
