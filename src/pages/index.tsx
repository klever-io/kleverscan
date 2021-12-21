import React, { useState, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { format, fromUnixTime } from 'date-fns';

import {
  BlockCardContainer,
  Container,
  DataCard,
  DataCardLatest,
  DataCardsContainer,
  DataCardsContent,
  DataCardValue,
  DataContainer,
  IconContainer,
  Input,
  BlockCardRow,
  Section,
  TransactionContainer,
  TransactionContent,
  TransactionRow,
  TransactionData,
  TransactionAmount,
  TransactionChart,
  TransactionChartContent,
  TransactionEmpty,
} from '@/views/home';

import Chart, { ChartType } from '@/components/Chart';

import { Accounts, Transactions } from '@/assets/cards';

import api, { Service } from '@/services/api';

import { toLocaleFixed } from '../utils';

import {
  IBlock,
  IBlockCard,
  ITransaction,
  ITransferContract,
  IHome,
  ITransactionResponse,
  IAccountResponse,
  IBlockResponse,
  IStatisticsResponse,
  ICard,
} from '../types';

import { formatAmount, getAge } from '../utils';
import HomeServerSideProps from '../utils/ServerSideProps/Home';

import Carousel from '@/components/Carousel';
import CoinCard from '@/components/Cards/CoinCard';
import Maintenance from '@/components/Maintenance';

const Home: React.FC<IHome> = ({
  blocks,
  transactionsList,
  transactions: defaultTransactions,
  totalAccounts: defaultTotalAccounts,
  totalTransactions: defaultTotalTransactions,
  tps,
  coinsData,
  yeasterdayTransactions,
}) => {
  const precision = 6; // default KLV precision
  const blockWatcherTimeout = 4000;
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [listedBlocks, setListedBlocks] = useState<IBlock[]>(blocks);
  const [actualTPS, setActualTPS] = useState<string>(tps);

  const [transactions, setTransactions] = useState(defaultTransactions);
  const [totalAccounts, setTotalAccounts] = useState(defaultTotalAccounts);
  const [totalTransactions, setTotalTransactions] = useState(
    defaultTotalTransactions,
  );

  // Block Watcher

  useEffect(() => {
    const blockWatcher = setInterval(async () => {
      const response: IBlockResponse = await api.get({
        route: 'block/list',
      });

      if (!response.error) {
        setListedBlocks(response.data?.blocks);
      }
    }, blockWatcherTimeout);

    return () => clearInterval(blockWatcher);
  }, [listedBlocks]);

  // Statistics Watcher

  useEffect(() => {
    const statisticsWatcher = setInterval(async () => {
      const statistics: IStatisticsResponse = await api.get({
        route: 'node/statistics',
        service: Service.NODE,
      });

      if (!statistics.error) {
        const chainStatistics = statistics.data.statistics.chainStatistics;

        setActualTPS(`${chainStatistics.liveTPS}/${chainStatistics.peakTPS}`);
      }
    }, statisticsWatcherTimeout);

    const cardWatcher = setInterval(async () => {
      const accounts: IAccountResponse = await api.get({
        route: 'address/list',
      });
      if (!accounts.error) {
        setTotalAccounts(accounts.pagination.totalRecords);
      }

      const transactions: ITransactionResponse = await api.get({
        route: 'transaction/list',
      });
      if (!transactions.error) {
        setTransactions(transactions.data.transactions);
        setTotalTransactions(transactions.pagination.totalRecords);
      }
    }, cardWatcherInterval);

    return () => {
      clearInterval(statisticsWatcher);
      clearInterval(cardWatcher);
    };
  });

  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: 'Total accounts',
      value: totalAccounts,
      variation: '+ 0.00%',
    },
    {
      Icon: Transactions,
      title: 'Total transactions',
      value: totalTransactions,
      variation: `+ ${yeasterdayTransactions.toLocaleString()}`,
    },
  ];

  const TransactionItem: React.FC<ITransaction> = ({
    hash,
    timestamp,
    contract,
  }) => {
    const contractPosition = 0;
    const parameter = contract[contractPosition].parameter as ITransferContract;

    const amount = parameter.amount || 0;

    return (
      <TransactionRow>
        <TransactionData>
          <Link href={`/transaction/${hash}`}>{hash}</Link>
          <span>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </span>
        </TransactionData>
        <TransactionData>
          <p>
            <strong>From: </strong>
            {parameter.ownerAddress}
          </p>
          <p>
            <strong>To: </strong>
            {parameter.toAddress}
          </p>
        </TransactionData>
        <TransactionAmount>
          <span>{toLocaleFixed(amount / 10 ** precision, precision)} KLV</span>
        </TransactionAmount>
      </TransactionRow>
    );
  };

  const getTransactionChartData = () => {
    const sortedTransactionsList = transactionsList.sort(
      (a, b) => a.key - b.key,
    );
    return sortedTransactionsList.map(transaction => {
      if (transaction.key) {
        // Create date object
        const date = new Date(transaction.key);
        // Set timezone to UTC
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        return {
          date: format(date, 'dd MMM'),
          value: transaction.doc_count,
        };
      }
    });
  };

  //TODO: Fix re-rendering and improve animation;

  const BlockCard: React.FC<IBlock & IBlockCard> = ({
    nonce,
    timestamp,
    hash,
    blockRewards,
    blockIndex,
    txCount,
    burnedFees,
  }) => (
    <BlockCardContainer blockIndex={blockIndex}>
      <BlockCardRow>
        <Link href={`/block/${nonce}`}>
          <strong>#{nonce}</strong>
        </Link>
        <p>Miner</p>
      </BlockCardRow>
      <BlockCardRow>
        <small>{getAge(fromUnixTime(timestamp / 1000))} ago</small>
        <a>{hash}</a>
      </BlockCardRow>
      <BlockCardRow>
        <p>Burned</p>
        <span>{formatAmount((burnedFees || 0) / 10 ** precision)} KLV</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>Transactions</p>
        <span>{txCount}</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>Reward</p>
        <span>{formatAmount(blockRewards / 10 ** precision)} KLV</span>
      </BlockCardRow>
    </BlockCardContainer>
  );

  return (
    <Container>
      <DataContainer>
        <Maintenance />
        <Input />

        <DataCardsContainer>
          <DataCardsContent>
            {dataCards.map(({ Icon, title, value, variation }, index) => (
              <DataCard key={String(index)}>
                <IconContainer>
                  <Icon />
                </IconContainer>
                <DataCardValue>
                  <span>{title}</span>
                  <p>{value.toLocaleString()}</p>
                </DataCardValue>
                {!variation.includes('%') && (
                  <DataCardLatest positive={variation.includes('+')}>
                    <span>Last 24h</span>
                    <p>{variation}</p>
                  </DataCardLatest>
                )}
              </DataCard>
            ))}
          </DataCardsContent>

          <CoinCard coins={coinsData} actualTPS={actualTPS} />
        </DataCardsContainer>
      </DataContainer>

      <Section>
        <h1>Blocks</h1>
        <Carousel>
          {listedBlocks.map((block: IBlock, index) => (
            <BlockCard blockIndex={index} key={String(index)} {...block} />
          ))}
        </Carousel>
      </Section>

      <Section>
        <h1>Transactions</h1>
        <TransactionContainer>
          <TransactionContent>
            {transactions.length === 0 && (
              <TransactionEmpty>
                <span>Oops! Apparently no data here.</span>
              </TransactionEmpty>
            )}

            {transactions.map((transaction, index) => (
              <TransactionItem key={String(index)} {...transaction} />
            ))}
          </TransactionContent>
          <TransactionChart>
            <span>Daily Transactions</span>
            <p>
              ({transactionsList.length} day
              {transactionsList.length > 1 ? 's' : ''})
            </p>
            <TransactionChartContent>
              <Chart type={ChartType.Linear} data={getTransactionChartData()} />
            </TransactionChartContent>
          </TransactionChart>
        </TransactionContainer>
      </Section>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IHome> = async () => {
  return HomeServerSideProps();
};

export default Home;
