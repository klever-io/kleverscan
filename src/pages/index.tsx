import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format, fromUnixTime } from 'date-fns';

import {
  BlockCardContainer,
  CoinChartContainer,
  CoinDataCard,
  CoinDataContent,
  CoinDataDescription,
  CoinDataHeader,
  CoinDataHeaderContainer,
  CoinDataName,
  CoinSelector,
  CoinSelectorContainer,
  CoinValueContainer,
  CoinValueContent,
  CoinValueDetail,
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
  IChainStatistics,
  IPagination,
  IResponse,
  ITransaction,
  ITransferContract,
} from '../types';

import { IChartData } from '@/configs/home';
import { formatAmount, getAge } from '../utils';

import Carousel from '@/components/Carousel';

interface ICoinInfo {
  name: string;
  shortname: string;
  price: number;
  variation: number;
  marketCap: {
    price: number;
    variation: number;
  };
  volume: {
    price: number;
    variation: number;
  };
  prices: IChartData[];
}

interface IDailyTransaction {
  doc_count: number;
  key: number;
}
interface IHome {
  transactions: ITransaction[];
  transactionsList: IDailyTransaction[];
  blocks: IBlock[];
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  coinsData: ICoinInfo[];
  yeasterdayTransactions: number;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

interface ITransactionListResponse extends IResponse {
  data: {
    number_by_day: IDailyTransaction[];
  };
  pagination: IPagination;
}

interface IAccountResponse extends IResponse {
  pagination: IPagination;
}

interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
}

interface IStatisticsResponse extends IResponse {
  data: {
    statistics: {
      chainStatistics: IChainStatistics;
    };
  };
}

interface IGeckoResponse extends IResponse {
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    market_cap_change_percentage_24h: number;
    total_volume: {
      usd: number;
    };
  };
}

interface IYesterdayResponse extends IResponse {
  data: {
    number_by_day: {
      doc_count: number;
      key: number;
    }[];
  };
}

interface IGeckoChartResponse extends IResponse {
  prices: number[][];
}

interface ICard {
  Icon: any;
  title: string;
  value: number;
  variation: string;
}

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

  const [selectedCoin, setSelectedCoin] = useState(0);

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

  const coinData = useMemo(() => {
    return coinsData[selectedCoin];
  }, [selectedCoin]);

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

  const handleSelectionCoin = useCallback(
    (index: number) => {
      if (selectedCoin !== index) {
        setSelectedCoin(index);
      }
    },
    [selectedCoin],
  );

  const getVariation = useCallback((variation: number) => {
    const precision = 2;

    if (variation < 0) {
      return `- ${Math.abs(variation).toFixed(precision)}%`;
    }

    return `+ ${variation.toFixed(precision)}%`;
  }, []);

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

          <CoinDataCard>
            <CoinDataContent>
              <CoinDataHeaderContainer>
                <IconContainer>
                  <Image
                    src={`/coins/${coinData.shortname}.png`}
                    alt="Coin"
                    width="50"
                    height="50"
                  />
                </IconContainer>
                <CoinDataHeader>
                  <CoinDataName>
                    <span>{coinData.shortname}</span>
                    <span>U$ {coinData.price.toLocaleString()}</span>
                  </CoinDataName>
                  <CoinDataDescription
                    positive={getVariation(coinData.variation).includes('+')}
                  >
                    <span>{coinData.name}</span>
                    <p>{getVariation(coinData.variation)}</p>
                  </CoinDataDescription>
                </CoinDataHeader>
              </CoinDataHeaderContainer>

              <CoinChartContainer>
                <Chart data={coinData.prices} />
              </CoinChartContainer>

              <CoinValueContainer>
                {[coinData.marketCap, coinData.volume].map((item, index) => (
                  <CoinValueContent key={String(index)}>
                    <p>{index === 0 ? 'Market Cap' : 'Volume'}</p>
                    <CoinValueDetail
                      positive={getVariation(item.variation).includes('+')}
                    >
                      <span>$ {item.price.toLocaleString()}</span>
                      <p>{getVariation(item.variation)}</p>
                    </CoinValueDetail>
                  </CoinValueContent>
                ))}
                <CoinValueContent>
                  <CoinValueDetail>
                    <p>Live/Peak TPS</p>
                    <span>{actualTPS}</span>
                  </CoinValueDetail>
                </CoinValueContent>
              </CoinValueContainer>
            </CoinDataContent>

            <CoinSelectorContainer>
              {coinsData.map((_, index) => (
                <CoinSelector
                  key={String(index)}
                  onClick={() => handleSelectionCoin(index)}
                  isSelected={selectedCoin === index}
                />
              ))}
            </CoinSelectorContainer>
          </CoinDataCard>
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
  const props: IHome = {
    blocks: [],
    transactions: [],
    transactionsList: [],
    totalAccounts: 0,
    totalTransactions: 0,
    tps: '0/0',
    coinsData: [],
    yeasterdayTransactions: 0,
  };

  const blocks: IBlockResponse = await api.getCached({
    route: 'block/list',
    refreshTime: 4,
  });
  if (!blocks.error) {
    props.blocks = blocks.data.blocks;
  }

  const transactions: ITransactionResponse = await api.getCached({
    route: 'transaction/list',
  });
  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalTransactions = transactions.pagination.totalRecords;
  }

  const transactionsList: ITransactionListResponse = await api.getCached({
    route: 'transaction/list/count/15',
  });
  if (!transactionsList.error) {
    const { number_by_day } = transactionsList.data;
    props.transactionsList = number_by_day;
  }

  const accounts: IAccountResponse = await api.getCached({
    route: 'address/list',
  });
  if (!accounts.error) {
    props.totalAccounts = accounts.pagination.totalRecords;
  }

  const statistics: IStatisticsResponse = await api.getCached({
    route: 'node/statistics',
    service: Service.NODE,
  });
  if (!statistics.error) {
    const chainStatistics = statistics.data.statistics.chainStatistics;

    props.tps = `${chainStatistics.liveTPS}/${chainStatistics.peakTPS}`;
  }

  const pushCoinData = (
    name: string,
    shortname: string,
    response: IGeckoResponse,
    chart: IGeckoChartResponse,
  ) => {
    props.coinsData.push({
      name,
      shortname,
      price: response.market_data.current_price.usd,
      variation: response.market_data.price_change_percentage_24h,
      marketCap: {
        price: response.market_data.market_cap.usd,
        variation: response.market_data.market_cap_change_percentage_24h,
      },
      volume: {
        price: response.market_data.total_volume.usd,
        variation: 0,
      },
      prices: chart.prices.map(item => ({ value: item[1] })),
    });
  };

  const klvData: IGeckoResponse = await api.getCached({
    route: 'coins/klever',
    service: Service.GECKO,
  });
  const klvChart: IGeckoChartResponse = await api.getCached({
    route: `coins/klever/market_chart?vs_currency=usd&days=1`,
    service: Service.GECKO,
  });
  pushCoinData('Klever', 'KLV', klvData, klvChart);

  const kfiData: IGeckoResponse = await api.getCached({
    route: 'coins/klever-finance',
    service: Service.GECKO,
  });
  const kfiChart: IGeckoChartResponse = await api.getCached({
    route: `coins/klever-finance/market_chart?vs_currency=usd&days=1`,
    service: Service.GECKO,
  });
  // Currently hardcoded marketcap
  kfiData.market_data.market_cap.usd =
    150000 * kfiData.market_data.current_price.usd;
  pushCoinData('Klever Finance', 'KFI', kfiData, kfiChart);

  const yesterdayTransactions: IYesterdayResponse = await api.getCached({
    route: 'transaction/list/count/1',
  });
  if (!yesterdayTransactions.error) {
    props.yeasterdayTransactions =
      yesterdayTransactions.data.number_by_day[0].doc_count;
  }

  return { props };
};

export default Home;
