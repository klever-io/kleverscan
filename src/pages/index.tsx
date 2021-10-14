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
  defaultEquivalentCoin,
  statsData,
} from '../configs/home';

import { IResponse, IHyperblock, ITransaction } from '../types';
import { getAge } from '../utils';

import api, { IPrice } from '../services/api';

import { FaLaravel } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';

interface IHome {
  transactions: ITransaction[];
  blocks: IHyperblock[];
  price: number;
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

interface IPriceResponse extends IResponse {
  data: {
    symbols: IPrice[];
  };
}

const Home: React.FC<IHome> = ({ blocks, transactions, price }) => {
  const [loaded] = useState(true);
  const [klvPrice, setKlvPrice] = useState(price);
  const priceInterval = 10 * 60 * 1000; // 10 min

  useEffect(() => {
    const interval = setInterval(async () => {
      const prices: IPriceResponse = await api.getPrices();
      if (prices.data.symbols.length > 0) {
        setKlvPrice(prices.data.symbols[0].price);
      }
    }, priceInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const StatsCard: React.FC = () => {
    return (
      <StatsContainer>
        {statsData.map((item, index) => (
          <item.Side key={index}>
            <div>
              <span>{item.name}</span>
              {loaded ? (
                <p>{`${
                  item.name === 'KLV Price' ? klvPrice.toFixed(4) : item.value
                } ${item.haveCoin ? defaultEquivalentCoin : ''}`}</p>
              ) : (
                <Skeleton />
              )}
            </div>
          </item.Side>
        ))}
      </StatsContainer>
    );
  };

  const PriceHistoryChart: React.FC = () => {
    const title = '24h Price History';
    const skeletonProps = { width: 150, height: 40 };

    return (
      <PriceHistoryContainer>
        <span>{title}</span>
        {loaded ? (
          <Chart data={infoChartData} />
        ) : (
          <LoaderContainer>
            <Skeleton {...skeletonProps} />
          </LoaderContainer>
        )}
      </PriceHistoryContainer>
    );
  };

  const TransactionCharts: React.FC = () => {
    const charts: IChart[] = [
      {
        title: '14 days Transaction History',
        data: infoChartData,
      },
      {
        title: '14 days Address Growth',
        data: infoChartData,
      },
    ];
    const skeletonProps = { width: 200, height: 60 };

    return (
      <ChartContainer>
        {charts.map((chart, index) => (
          <TimeChart key={index}>
            <span>{chart.title}</span>
            <Divider />
            {loaded ? (
              <Chart data={chart.data} />
            ) : (
              <LoaderContainer>
                <Skeleton {...skeletonProps} />
              </LoaderContainer>
            )}
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
    const parameter = contract[contractPosition].parameter;

    const amount = contract[contractPosition].parameter.amount || 0;

    return (
      <ListItem>
        <div>
          <span>
            <a>{hash}</a>
          </span>
          <p>{getAge(fromUnixTime(timeStamp))} ago</p>
        </div>
        <div>
          <span>
            From <a>{parameter.ownerAddress}</a>
          </span>
          <span>
            To <a>{parameter.toAddress}</a>
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
    sizeTxs,
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
            <a>{sizeTxs} txns</a> in {0} secs
          </p>
        </span>
      </div>
      <div>
        <span>{0} KLV</span>
      </div>
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
        href: 'tranfers',
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
          <strong>Klever</strong> <p>Blockchain Explorer</p>
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
  const props: IHome = { blocks: [], transactions: [], price: 0 };

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
    props.transactions = transactions.data.transactions;
  }

  const prices: IPriceResponse = await api.getPrices();
  if (prices.data.symbols.length > 0) {
    props.price = prices.data.symbols[0].price;
  }

  return { props };
};

export default Home;
