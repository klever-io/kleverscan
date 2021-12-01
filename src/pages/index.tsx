import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
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
import { KFILogo } from '@/assets/coins';

import api, { Service } from '@/services/api';

import {
  IBlock,
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

interface ICoinCard extends ICoinInfo {
  Icon: any;
}

const Home: React.FC<IHome> = ({
  blocks,
  transactions,
  transactionsList,
  totalAccounts,
  totalTransactions,
  tps,
  coinsData,
  yeasterdayTransactions,
}) => {
  const precision = 6; // default KLV precision

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

  const getCoinData = () => {
    const icons = {
      KLV: KFILogo,
      KFI: KFILogo,
    };

    return coinsData.map(coin => ({ ...coin, Icon: icons[coin.shortname] }));
  };

  const [selectedCoin, setSelectedCoin] = useState(0);

  const handleSelectionCoin = (index: number) => {
    if (selectedCoin !== index) {
      setSelectedCoin(index);
    }
  };

  const getVariation = (variation: number) => {
    const precision = 2;

    if (variation < 0) {
      return `- ${Math.abs(variation).toFixed(precision)}%`;
    }

    return `+ ${variation.toFixed(precision)}%`;
  };

  const Card: React.FC<ICard> = ({ Icon, title, value, variation }) => (
    <DataCard>
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
  );

  const CoinCard: React.FC<ICoinCard> = ({
    Icon,
    shortname,
    name,
    price,
    variation,
    marketCap,
    volume,
    prices,
  }) => (
    <CoinDataCard>
      <CoinDataContent>
        <CoinDataHeaderContainer>
          <IconContainer>
            <Icon />
          </IconContainer>
          <CoinDataHeader>
            <CoinDataName>
              <span>{shortname}</span>
              <span>U$ {price.toLocaleString()}</span>
            </CoinDataName>
            <CoinDataDescription
              positive={getVariation(variation).includes('+')}
            >
              <span>{name}</span>
              <p>{getVariation(variation)}</p>
            </CoinDataDescription>
          </CoinDataHeader>
        </CoinDataHeaderContainer>

        <CoinChartContainer>
          <Chart data={prices} />
        </CoinChartContainer>

        <CoinValueContainer>
          {[marketCap, volume].map((item, index) => (
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
              <span>{tps}</span>
            </CoinValueDetail>
          </CoinValueContent>
        </CoinValueContainer>
      </CoinDataContent>

      <CoinSelectorContainer>
        {getCoinData().map((_, index) => (
          <CoinSelector
            key={String(index)}
            onClick={() => handleSelectionCoin(index)}
            isSelected={selectedCoin === index}
          />
        ))}
      </CoinSelectorContainer>
    </CoinDataCard>
  );

  const BlockCard: React.FC<IBlock> = ({
    nonce,
    timestamp,
    hash,
    transactions,
    blockRewards,
  }) => (
    <BlockCardContainer>
      <BlockCardRow>
        <strong>#{nonce}</strong>
        <p>Miner</p>
      </BlockCardRow>
      <BlockCardRow>
        <small>{getAge(fromUnixTime(timestamp / 1000))} ago</small>
        <Link href={`/block/${nonce}`}>{hash}</Link>
      </BlockCardRow>
      <BlockCardRow>
        <p>Burned</p>
        <span>142</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>Transactions</p>
        <span>{transactions.length}</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>Reward</p>
        <span>{formatAmount(blockRewards / 10 ** precision)} KLV</span>
      </BlockCardRow>
    </BlockCardContainer>
  );

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
          <span>{formatAmount(amount)} KLV</span>
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
        return {
          date: format(fromUnixTime(transaction.key / 1000), 'dd MMM'),
          value: transaction.doc_count,
        };
      }
    });
  };

  return (
    <Container>
      <DataContainer>
        <Input />

        <DataCardsContainer>
          <DataCardsContent>
            {dataCards.map((card, index) => (
              <Card key={String(index)} {...card} />
            ))}
          </DataCardsContent>

          <CoinCard {...getCoinData()[selectedCoin]} />
        </DataCardsContainer>
      </DataContainer>

      <Section>
        <h1>Blocks</h1>
        <Carousel>
          {blocks.map((block, index) => (
            <BlockCard key={String(index)} {...block} />
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

  const blocks: IBlockResponse = await api.get({
    route: 'block/list',
  });
  if (!blocks.error) {
    props.blocks = blocks.data.blocks;
  }

  const transactions: ITransactionResponse = await api.get({
    route: 'transaction/list',
  });
  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalTransactions = transactions.pagination.totalRecords;
  }

  const transactionsList: ITransactionListResponse = await api.get({
    route: 'transaction/list/count/15',
  });
  if (!transactionsList.error) {
    const { number_by_day } = transactionsList.data;
    props.transactionsList = number_by_day;
  }

  const accounts: IAccountResponse = await api.get({ route: 'address/list' });
  if (!accounts.error) {
    props.totalAccounts = accounts.pagination.totalRecords;
  }

  const statistics: IStatisticsResponse = await api.get({
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

  const klvData: IGeckoResponse = await api.get({
    route: 'coins/klever',
    service: Service.GECKO,
  });
  const klvChart: IGeckoChartResponse = await api.get({
    route: `coins/klever/market_chart?vs_currency=usd&days=1`,
    service: Service.GECKO,
  });
  pushCoinData('Klever', 'KLV', klvData, klvChart);

  const kfiData: IGeckoResponse = await api.get({
    route: 'coins/klever-finance',
    service: Service.GECKO,
  });
  const kfiChart: IGeckoChartResponse = await api.get({
    route: `coins/klever-finance/market_chart?vs_currency=usd&days=1`,
    service: Service.GECKO,
  });
  pushCoinData('Klever Finance', 'KFI', kfiData, kfiChart);

  const yesterdayTransactions: IYesterdayResponse = await api.get({
    route: 'transaction/list/count/1',
  });
  if (!yesterdayTransactions.error) {
    props.yeasterdayTransactions =
      yesterdayTransactions.data.number_by_day[0].doc_count;
  }

  return { props };
};

export default Home;
