import Chart, { ChartType } from '@/components/Chart';
import { DoubleTxsTooltip } from '@/components/Chart/Tooltips';
import { ArrowVariation } from '@/components/Home/CoinDataFetcher/CoinCard/styles';
import { Loader } from '@/components/Loader/styles';
import { IDoubleChart } from '@/pages/charts';
import api from '@/services/api';
import { IDailyTransaction, IParsedDailyTransaction } from '@/types';
import { getVariation } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import {
  ContainerTimeFilter,
  ItemTimeFilter,
  Last24hTxs,
  Last24Text,
  ListItemTimeFilter,
  TransactionChart,
  TransactionChartContent,
  TransactionEmpty,
  VariationText,
} from '@/views/home';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

export const ChartDailyTransactions: React.FC = () => {
  const filterDays = [1, 7, 15, 30];
  const [transactionsList, setTransactionsList] = useState<IDoubleChart[]>();
  const [timeFilter, setTimeFilter] = useState(16);
  const [loadingDailyTxs, setLoadingDailyTxs] = useState(false);
  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('transactions');

  useEffect(() => {
    const fetchTotalDays = async () => {
      setLoadingDailyTxs(true);
      try {
        const res = await api.get({
          route: `transaction/list/count/${timeFilter * 2}`,
        });
        if (!res.error || res.error === '') {
          const rawTxList = res?.data?.number_by_day;
          if (rawTxList) {
            const sortedTxList = rawTxList.sort(
              (a: IDailyTransaction, b: IDailyTransaction) => a.key - b.key,
            );
            const parsedTxList = sortedTxList.map((tx: IDailyTransaction) => {
              if (tx.key) {
                const date = new Date(tx.key);
                // Set timezone to UTC
                date.setTime(
                  date.getTime() + date.getTimezoneOffset() * 60 * 1000,
                );
                const dateString = format(date, 'dd MMM');
                return {
                  date:
                    dateString.slice(0, 2) +
                    ' ' +
                    commonT(`Date.Months.${dateString.slice(3)}`),
                  value: tx.doc_count,
                };
              }
            });
            const firstSlice = parsedTxList.slice(0, parsedTxList.length / 2);
            const secondSlice = parsedTxList.slice(
              parsedTxList.length / 2,
              parsedTxList.length,
            );
            const mergedDailyTransactions = firstSlice.map(
              (txPast: IParsedDailyTransaction, index: number) => {
                return {
                  valueNow: secondSlice[index].value,
                  dateNow: secondSlice[index].date,
                  valuePast: txPast.value,
                  datePast: txPast.date,
                  txPast,
                  txNow: secondSlice[index],
                };
              },
            );
            setTransactionsList(mergedDailyTransactions);
          }
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingDailyTxs(false);
    };

    fetchTotalDays();
  }, [timeFilter]);

  const last24h =
    transactionsList?.[transactionsList?.length - 1]?.valueNow || 0;
  const variationCalc =
    last24h - (transactionsList?.[transactionsList?.length - 2]?.valueNow || 0);
  const variation = getVariation(variationCalc / 100);
  return (
    <TransactionChart>
      <ContainerTimeFilter>
        <div>
          <span>{t('Transactions')}</span>
          <Last24hTxs>
            {toLocaleFixed(last24h, 0)}
            <Last24Text>
              <span>24h</span>
            </Last24Text>
          </Last24hTxs>
          <VariationText $positive={variation.includes('+')}>
            <ArrowVariation $positive={variation.includes('+')} />
            {variation}
          </VariationText>
        </div>
        <ListItemTimeFilter>
          {loadingDailyTxs && <Loader width={20} height={20} />}
          {filterDays.map(item => (
            <ItemTimeFilter
              key={String(item)}
              onClick={() => setTimeFilter(item + 1)}
              selected={!!(timeFilter === item + 1)}
            >
              {item !== 30 ? `${String(item)}D` : '1M'}
            </ItemTimeFilter>
          ))}
        </ListItemTimeFilter>
      </ContainerTimeFilter>
      {!!transactionsList?.length && (
        <TransactionChartContent>
          <Chart
            type={ChartType.DoubleArea}
            data={transactionsList}
            hasTooltip={true}
            value="valueNow"
            value2="valuePast"
            strokeWidth={1}
            yAxis={true}
            height={'100%'}
            CustomTooltip={DoubleTxsTooltip}
          />
        </TransactionChartContent>
      )}
      {!loadingDailyTxs && !transactionsList?.length && (
        <TransactionEmpty>
          <span>{commonT('EmptyData')}</span>
        </TransactionEmpty>
      )}
    </TransactionChart>
  );
};
