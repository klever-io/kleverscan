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

import api, { IPrice, Service } from '@/services/api';

import {
  IBlock,
  IChainStatistics,
  IPagination,
  IResponse,
  ITransaction,
  ITransferContract,
} from '../types';

import { coinMockedData, transactionMockedData } from '@/configs/home';
import { formatAmount, getAge } from '../utils';

import Carousel from '@/components/Carousel';

interface IHome {
  transactions: ITransaction[];
  blocks: IBlock[];
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  kfiPrice: number;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
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

interface IPriceResponse extends IResponse {
  symbols: IPrice[];
}

interface ICard {
  Icon: any;
  title: string;
  value: number;
  variation: string;
}

interface ICoinDetail {
  price: number;
  variation: string;
}

interface ICoinCard {
  Icon: any;
  shortname: string;
  name: string;
  price: number;
  variation: string;
  marketCap: ICoinDetail;
  volume: ICoinDetail;
}

const Home: React.FC<IHome> = ({
  blocks,
  transactions,
  totalAccounts,
  totalTransactions,
  tps,
  kfiPrice,
}) => {
  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: 'Total accounts',
      value: totalAccounts,
      variation: '+ 89.34%',
    },
    {
      Icon: Transactions,
      title: 'Total transactions',
      value: totalTransactions,
      variation: '+ 802,679',
    },
  ];

  const coinDataCards: ICoinCard[] = [
    {
      Icon: KFILogo,
      name: 'Klever Finance',
      shortname: 'KFI',
      price: kfiPrice,
      variation: '+ 2.34%',
      marketCap: {
        price: 11544537494.529,
        variation: '+ 2.34%',
      },
      volume: {
        price: 11544537494.529,
        variation: '+ 2.34%',
      },
    },
  ];

  const [selectedCoin, setSelectedCoin] = useState(0);

  const handleSelectionCoin = (index: number) => {
    if (selectedCoin !== index) {
      setSelectedCoin(index);
    }
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
      <DataCardLatest positive={variation.includes('+')}>
        <span>Last 24h</span>
        <p>{variation}</p>
      </DataCardLatest>
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
            <CoinDataDescription positive={variation.includes('+')}>
              <span>{name}</span>
              <p>{variation}</p>
            </CoinDataDescription>
          </CoinDataHeader>
        </CoinDataHeaderContainer>

        <CoinChartContainer>
          <Chart data={coinMockedData} />
        </CoinChartContainer>

        <CoinValueContainer>
          {[marketCap, volume].map((item, index) => (
            <CoinValueContent key={String(index)}>
              <p>{index === 0 ? 'Market Cap' : 'Volume'}</p>
              <CoinValueDetail positive={item.variation.includes('+')}>
                <span>$ {item.price.toLocaleString()}</span>
                <p>{item.variation}</p>
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
        {coinDataCards.map((_, index) => (
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
  }) => (
    <BlockCardContainer>
      <BlockCardRow>
        <strong>#{nonce}</strong>
        <p>Miner</p>
      </BlockCardRow>
      <BlockCardRow>
        <small>{getAge(fromUnixTime(timestamp / 1000))} ago</small>
        <Link href={`/blocks/${nonce}`}>{hash}</Link>
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
        <span>{Number(4000.89).toFixed(2)} KLV</span>
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
    return transactionMockedData.map(transaction => {
      if (transaction.date) {
        return {
          date: format(fromUnixTime(transaction.date / 1000), 'dd MMM'),
          value: transaction.value,
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

          <CoinCard {...coinDataCards[selectedCoin]} />
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
                <span>Oops! Apparently no data loaded.</span>
              </TransactionEmpty>
            )}

            {transactions.map((transaction, index) => (
              <TransactionItem key={String(index)} {...transaction} />
            ))}
          </TransactionContent>
          <TransactionChart>
            <span>Daily Transactions</span>
            <p>(14 days)</p>
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
    totalAccounts: 0,
    totalTransactions: 0,
    tps: '0/0',
    kfiPrice: 0,
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

  const kfiPrice: IPriceResponse = await api.post({
    route: 'prices',
    service: Service.PRICE,
    body: { names: ['KFI/USD'] },
  });
  if (!kfiPrice.error) {
    props.kfiPrice = kfiPrice.symbols[0].price;
  }

  return { props };
};

export default Home;
