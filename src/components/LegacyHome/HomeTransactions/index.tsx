import Chart, { ChartType } from '@/components/Chart';
import TransactionItem, {
  IContract,
  TransactionItemLoading,
} from '@/components/LegacyHome/TransactionItem';
import { HomeLoader } from '@/components/Loader/styles';
import { useHomeData } from '@/contexts/mainPage';
import api from '@/services/api';
import { IDailyTransaction, ITransaction } from '@/types';
import { getContractType } from '@/utils';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  ContainerTimeFilter,
  HomeLoaderContainer,
  ItemTimeFilter,
  ListItemTimeFilter,
  Section,
  TransactionChart,
  TransactionChartContent,
  TransactionContainer,
  TransactionContent,
  TransactionEmpty,
} from '@/views/legacyHome';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

const HomeTransactions: React.FC = () => {
  const filterDays = [1, 7, 15, 30];
  const { t } = useTranslation('transactions');
  const { transactions: homeTransactions } = useHomeData();
  const [transactions, setTransactions] =
    useState<ITransaction[]>(homeTransactions);
  const [loading, setLoading] = useState(false);

  const { t: commonT } = useTranslation('common');
  const [transactionsList, setTransactionsList] = useState<IDailyTransaction[]>(
    [],
  );
  const [timeFilter, setTimeFilter] = useState(16);
  const [loadingDailyTxs, setLoadingDailyTxs] = useState(false);

  useEffect(() => {
    const fetchTotalDays = async () => {
      setLoadingDailyTxs(true);
      try {
        const res = await api.get({
          route: `transaction/list/count/${timeFilter}`,
        });
        if (!res.error || res.error === '') {
          setTransactionsList(res.data.number_by_day);
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingDailyTxs(false);
    };

    fetchTotalDays();
  }, [timeFilter]);

  useEffect(() => {
    const assetsIds = homeTransactions.map(({ contract }) => {
      let contractFilter = {} as IContract;
      contractFilter = contract[0] as IContract;
      const assetId = contractFilter?.parameter?.assetId;
      if (assetId) {
        return assetId.split('/')[0];
      }
      return 'KLV';
    });

    const addPrecisions = async () => {
      setLoading(true);
      const precisions = await getPrecision(assetsIds);
      const assetsPrecision = assetsIds.map(item => {
        return precisions[item];
      });
      const newTxs = homeTransactions.map((obj, index) => {
        const contractType = obj.contract[0].typeString;
        const checkContract = getContractType(contractType);

        if (checkContract) {
          obj.contract[0] = {
            ...obj.contract[0],
            precision: assetsPrecision[index],
          };
        }

        return obj;
      });
      setTransactions(newTxs);
      setLoading(false);
    };
    addPrecisions();
  }, [homeTransactions]);

  const getTransactionChartData = useCallback(() => {
    const sortedTransactionsList = transactionsList.sort(
      (a, b) => a.key - b.key,
    );
    return sortedTransactionsList.map(transaction => {
      if (transaction.key) {
        // Create date object
        const date = new Date(transaction.key);
        // Set timezone to UTC
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        const dateString = format(date, 'dd MMM');
        return {
          date:
            dateString.slice(0, 2) +
            ' ' +
            commonT(`Date.Months.${dateString.slice(3)}`),
          value: transaction.doc_count,
        };
      }
    });
  }, [transactionsList]);

  return (
    <Section>
      <Link href={'/transactions'}>
        <a>
          <h1>{t('Transactions')}</h1>
        </a>
      </Link>

      <TransactionContainer>
        <TransactionContent>
          {loading &&
            Array.from(Array(10).keys()).map(key => (
              <TransactionItemLoading key={key} />
            ))}

          {!loading &&
            transactions?.map(transaction => (
              <TransactionItem key={transaction.hash} {...transaction} />
            ))}

          {!loading && transactions.length === 0 && (
            <TransactionEmpty>
              <span>{commonT('EmptyData')}</span>
            </TransactionEmpty>
          )}
        </TransactionContent>
        <TransactionChart>
          <ContainerTimeFilter>
            <span>{t('Daily Transactions')}</span>
            <ListItemTimeFilter>
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
          {loadingDailyTxs && (
            <HomeLoaderContainer>
              <HomeLoader />
            </HomeLoaderContainer>
          )}
          {!loadingDailyTxs && (
            <TransactionChartContent>
              <Chart type={ChartType.Linear} data={getTransactionChartData()} />
            </TransactionChartContent>
          )}
        </TransactionChart>
      </TransactionContainer>
    </Section>
  );
};

export default HomeTransactions;
