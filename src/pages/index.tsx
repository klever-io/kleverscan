import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { fromUnixTime } from 'date-fns';
import { IconType } from 'react-icons/lib';

import {
  BackgroundVideo,
  CardContainer,
  InputContainer,
  Container,
  StatsContainer,
  PriceHistoryContainer,
  LoaderContainer,
  ChartContainer,
  Divider,
  TimeChart,
  ListContainer,
  ChartContent,
  ListHeader,
  ListHeaderIcon,
  ListContent,
  ListItem,
  ChartContentError,
} from '../views/home';

import Input from '../components/Input';
import Skeleton from '../components/Skeleton';
import Chart from '../components/Chart';
import Button from '../components/Button';

import {
  infoChartData,
  IChartData,
  statsData,
  transactionHistory,
  accountGrowth,
} from '../configs/home';

import {
  IResponse,
  IBlock,
  ITransaction,
  ITransferContract,
  IPagination,
  IChainStatistics,
} from '../types';
import { getAge } from '../utils';

import api, { IPrice, Service } from '../services/api';

import { FaLaravel } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';

interface IHome {
  transactions: ITransaction[];
  blocks: IBlock[];
  price: number;
  totalAccounts: number;
  tps: string;
}

interface IChart {
  title: string;
  data: IChartData[];
}

interface ISection {
  title: string;
  href: string;
  Icon: IconType;
  data: (ITransaction | IBlock)[] | undefined;
  Component: React.FC<any>;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
}

interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
}

interface IAccountResponse extends IResponse {
  pagination: IPagination;
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

const Home: React.FC<IHome> = ({
  blocks,
  transactions,
  price,
  totalAccounts,
  tps,
}) => {
  const router = useRouter();
  const [loaded] = useState(true);

  const [boardData, setBoardData] = useState({ price, totalAccounts, tps });

  const [data, setData] = useState({ transactions, blocks });
  const dataInterval = 10 * 1000; // 10 seconds

  useEffect(() => {
    const interval = setInterval(async () => {
      let latestBlocks = [...data.blocks];
      let latestTransactions = [...data.transactions];

      const blocks: IBlockResponse = await api.get({
        route: 'block/list',
      });
      if (!blocks.error) {
        latestBlocks = blocks.data.blocks;
      }

      const transactions: ITransactionResponse = await api.get({
        route: 'transaction/list',
      });
      if (!transactions.error) {
        latestTransactions = transactions.data.transactions;
      }

      setData({ blocks: latestBlocks, transactions: latestTransactions });
    }, dataInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      let newPrice = boardData.price;
      let newAccounts = boardData.totalAccounts;
      let newTps = boardData.tps;

      const prices: IPriceResponse = await api.post({
        route: 'prices',
        service: Service.PRICE,
        body: { names: ['KLV/USD'] },
      });
      if (!prices.error) {
        newPrice = prices.symbols[0].price;
      }

      const statistics: IStatisticsResponse = await api.get({
        route: 'node/statistics',
        service: Service.NODE,
      });
      if (!statistics.error) {
        const chainStatistics = statistics.data.statistics.chainStatistics;

        newTps = `${chainStatistics.liveTPS}/${chainStatistics.peakTPS}`;
      }

      const accounts: IAccountResponse = await api.get({
        route: 'address/list',
      });
      if (!accounts.error) {
        newAccounts = accounts.pagination.totalRecords;
      }

      setBoardData({
        price: newPrice,
        tps: newTps,
        totalAccounts: newAccounts,
      });
    }, dataInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const StatsCard: React.FC = () => {
    const data = [
      {
        key: 'KLV Price',
        data: `${boardData.price.toFixed(4)} USD`,
      },
      { key: 'Market Cap', data: `0 USD` },
      { key: 'Total Accounts', data: boardData.totalAccounts },
      { key: 'Live/Peak TPS', data: boardData.tps },
    ];

    return (
      <StatsContainer>
        {statsData.map((item, index) => (
          <item.Side key={index}>
            <div>
              <span>{item.name}</span>
              <p>{data.find(i => i.key === item.name)?.data || 0}</p>
            </div>
          </item.Side>
        ))}
      </StatsContainer>
    );
  };

  const charts: IChart[] = [
    {
      title: '14 days Transaction History',
      data: transactionHistory,
    },
    {
      title: '14 days Address Growth',
      data: accountGrowth,
    },
  ];

  const TransactionItem: React.FC<ITransaction> = ({
    hash,
    contract,
    timeStamp,
  }) => {
    const contractPosition = 0;
    const parameter = contract[contractPosition].parameter as ITransferContract;

    const amount = parameter.amount || 0;

    return (
      <ListItem>
        <div>
          <span>
            <Link href={`/transactions/${hash}`}>
              <a>{hash}</a>
            </Link>
          </span>
          <p>{getAge(fromUnixTime(timeStamp))} ago</p>
        </div>
        <div>
          <span>
            From{' '}
            <Link href={`/accounts/${parameter.ownerAddress}`}>
              {parameter.ownerAddress}
            </Link>
          </span>
          <span>
            To{' '}
            <Link href={`/accounts/${parameter.toAddress}`}>
              <a>{parameter.toAddress}</a>
            </Link>
          </span>
        </div>
        <div style={{ alignItems: 'center' }}>
          <span>{amount.toLocaleString()} KLV</span>
        </div>
      </ListItem>
    );
  };

  const BlockItem: React.FC<IBlock> = ({
    nonce,
    parentHash,
    timeStamp,
    txCount,
  }) => (
    <ListItem>
      <div>
        <span>
          <Link href={`/blocks/${nonce}`}>
            <a>{nonce}</a>
          </Link>
        </span>
        <p>{getAge(fromUnixTime(timeStamp))} ago</p>
      </div>
      <div>
        <span>
          Miner <a>{parentHash}</a>
        </span>
        <span>
          <p>
            <Link href={`/blocks/${nonce}`}>
              <a>{txCount} txns</a>
            </Link>
          </p>
        </span>
      </div>
    </ListItem>
  );

  const ReportList: React.FC = () => {
    const sections: ISection[] = [
      {
        title: 'Blocks',
        href: 'blocks',
        Icon: FaLaravel,
        data: data.blocks,
        Component: BlockItem,
      },
      {
        title: 'Transactions',
        href: 'transactions',
        Icon: BiSort,
        data: data.transactions,
        Component: TransactionItem,
      },
    ];

    const Header: React.FC<ISection> = ({ title, href, Icon }) => (
      <ListHeader>
        <div>
          <ListHeaderIcon>
            <Icon />
          </ListHeaderIcon>
          <span>{title}</span>
        </div>
        <Button onClick={() => router.push(href)}>
          <p>View All</p>
        </Button>
      </ListHeader>
    );

    const renderList = (
      Component: React.FC,
      list: (ITransaction | IBlock)[] | undefined,
    ): JSX.Element => {
      const skeletonProps = { width: 200, height: 60 };
      const errorMessage = 'Unable to load data';

      if (!loaded) {
        return (
          <LoaderContainer>
            <Skeleton {...skeletonProps} />
          </LoaderContainer>
        );
      }

      if (!list || list.length === 0) {
        return (
          <ChartContentError>
            <span>{errorMessage}</span>
          </ChartContentError>
        );
      }

      return (
        <>
          {list.map((item, index) => (
            <Component key={index} {...item} />
          ))}
        </>
      );
    };

    return (
      <ChartContainer>
        {sections.map((section, index) => (
          <ChartContent key={index}>
            <Header {...section} />
            <Divider />
            <ListContent>
              {renderList(section.Component, section.data)}
            </ListContent>
          </ChartContent>
        ))}
      </ChartContainer>
    );
  };

  return (
    <>
      <BackgroundVideo>
        <video playsInline autoPlay muted loop>
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
      </BackgroundVideo>
      <InputContainer>
        <span>
          <strong>KleverChain</strong> <p>(Testnet)</p>
        </span>
        <Input mainPage />
      </InputContainer>
      <Container>
        <CardContainer>
          <StatsCard />
          <PriceHistoryContainer>
            <span>24h Price History</span>
            <Chart data={infoChartData} />
          </PriceHistoryContainer>
        </CardContainer>
        <ChartContainer>
          {charts.map((chart, index) => (
            <TimeChart key={index}>
              <span>{chart.title}</span>
              <Divider />
              <span style={{ fontSize: '.875rem' }}>
                The information contained in the chart is for illustration
              </span>
              <Chart data={chart.data} />
            </TimeChart>
          ))}
        </ChartContainer>
      </Container>
      <ListContainer>
        <ReportList />
      </ListContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IHome> = async () => {
  const props: IHome = {
    blocks: [],
    transactions: [],
    price: 0,
    totalAccounts: 0,
    tps: '0/0',
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
  }

  const accounts: IAccountResponse = await api.get({
    route: 'address/list',
  });
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

  const prices: IPriceResponse = await api.post({
    route: 'prices',
    service: Service.PRICE,
    body: { names: ['KLV/USD'] },
  });
  if (!prices.error) {
    props.price = prices.symbols[0].price;
  }

  return { props };
};

export default Home;
