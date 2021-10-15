import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { GetStaticProps } from 'next';

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
  IHyperblock,
  ITransaction,
  ITransferContract,
  Contract,
  IPagination,
} from '../types';
import { getAge } from '../utils';

import api, { IPrice } from '../services/api';

import { FaLaravel } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';

interface IHome {
  transactions: ITransaction[];
  blocks: IHyperblock[];
  price: number;
  totalAccounts: number;
}

interface IChart {
  title: string;
  data: IChartData[];
}

interface ISection {
  title: string;
  href: string;
  Icon: IconType;
  data: (ITransaction | IHyperblock)[] | undefined;
  Component: React.FC<any>;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
}

interface IHyperblockResponse extends IResponse {
  data: {
    hyperblocks: IHyperblock[];
  };
}

interface IAccountResponse extends IResponse {
  pagination: IPagination;
}

interface IPriceResponse extends IResponse {
  data: {
    symbols: IPrice[];
  };
}

const Home: React.FC<IHome> = ({
  blocks,
  transactions,
  price,
  totalAccounts,
}) => {
  const [loaded] = useState(true);
  const [klvPrice, setKlvPrice] = useState(price);
  const priceInterval = 10 * 60 * 1000; // 10 min

  useEffect(() => {
    const interval = setInterval(async () => {
      const prices: IPriceResponse = await api.getPrices();

      if (prices.error) {
        setKlvPrice(0);
      }

      if (!prices.error && prices.data?.symbols.length > 0) {
        setKlvPrice(prices.data.symbols[0].price);
      }
    }, priceInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const StatsCard: React.FC = () => {
    const data = [
      {
        key: 'KLV Price',
        data: `${klvPrice.toFixed(4)} USD`,
      },
      { key: 'Market Cap', data: `0 USD` },
      { key: 'Total Accounts', data: totalAccounts },
      { key: 'Transactions Last Day', data: 0 },
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

  const PriceHistoryChart: React.FC = () => {
    const title = '24h Price History';

    return (
      <PriceHistoryContainer>
        <span>{title}</span>
        <Chart data={infoChartData} />
      </PriceHistoryContainer>
    );
  };

  const TransactionCharts: React.FC = () => {
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

    return (
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
    );
  };

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
        <div>
          <span>{amount.toLocaleString()} KLV</span>
        </div>
      </ListItem>
    );
  };

  const BlockItem: React.FC<IHyperblock> = ({
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
            </Link>{' '}
            in {0} secs
          </p>
        </span>
      </div>
      {/* <div>
        <span>{0} KLV</span>
      </div> */}
    </ListItem>
  );

  const ReportList: React.FC = () => {
    const sections: ISection[] = [
      {
        title: 'Blocks',
        href: 'blocks',
        Icon: FaLaravel,
        data: blocks,
        Component: BlockItem,
      },
      {
        title: 'Transfer',
        href: 'transactions',
        Icon: BiSort,
        data: transactions,
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
        <Button>
          <Link href={href}>
            <p>View All</p>
          </Link>
        </Button>
      </ListHeader>
    );

    const renderList = (
      Component: React.FC,
      list: (ITransaction | IHyperblock)[] | undefined,
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
          <strong>Klever</strong> <p>Blockchain Explorer (Testnet)</p>
        </span>
        <Input mainPage />
      </InputContainer>
      <Container>
        <CardContainer>
          <StatsCard />
          <PriceHistoryChart />
        </CardContainer>
        <TransactionCharts />
      </Container>
      <ListContainer>
        <ReportList />
      </ListContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps<IHome> = async () => {
  const props: IHome = {
    blocks: [],
    transactions: [],
    price: 0,
    totalAccounts: 0,
  };

  const blocks: IHyperblockResponse = await api.get({
    route: 'hyperblock/list',
  });
  if (!blocks.error) {
    props.blocks = blocks.data.hyperblocks;
  }

  const transactions: ITransactionResponse = await api.get({
    route: 'transaction/list',
  });
  if (!transactions.error) {
    props.transactions = transactions.data.transactions.filter(
      transaction =>
        Object.keys(Contract)[transaction.contract[0].type] ===
        Contract.Transfer,
    );
  }

  const accounts: IAccountResponse = await api.get({
    route: 'address/list',
  });
  if (!accounts.error) {
    props.totalAccounts = accounts.pagination.totalRecords;
  }

  const prices: IPriceResponse = await api.getPrices();

  if (prices.error) {
    props.price = 0;
  }

  if (!prices.error && prices.data?.symbols.length > 0) {
    props.price = prices.data.symbols[0].price;
  }

  return { props };
};

export default Home;
