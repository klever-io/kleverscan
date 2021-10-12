import React, { useState } from 'react';

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
import { breakText, getAge } from '../utils';

import api from '../services/api';

import { FaLaravel } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';

interface IHome {
  transactions: ITransaction[];
  blocks: IHyperblock[];
  error: string;
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

const Home: React.FC<IHome> = ({ blocks, transactions }) => {
  const [loaded] = useState(true);

  const StatsCard: React.FC = () => {
    return (
      <StatsContainer>
        {statsData.map((item, index) => (
          <item.Side key={index}>
            <div>
              <span>{item.name}</span>
              {loaded ? (
                <p>{`${item.value} ${
                  item.haveCoin ? defaultEquivalentCoin : ''
                }`}</p>
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
    const limitWordLetter = 14;
    const contractPosition = 0;

    const parameter = contract[contractPosition].parameter;

    return (
      <ListItem>
        <div>
          <span>
            <a>{breakText(hash, limitWordLetter)}</a>
          </span>
          <p>{getAge(fromUnixTime(timeStamp))} ago</p>
        </div>
        <div>
          <span>
            From <a>{breakText(parameter.ownerAddress, limitWordLetter)}</a>
          </span>
          <span>
            To <a>{breakText(parameter.toAddress, limitWordLetter)}</a>
          </span>
        </div>
        <div>
          <span>{parameter.amount.toLocaleString()} KLV</span>
        </div>
      </ListItem>
    );
  };

  const BlockItem: React.FC<IHyperblock> = ({
    nonce,
    parentHash,
    timeStamp,
    sizeTxs,
  }) => {
    const limitWordLetter = 14;

    return (
      <ListItem>
        <div>
          <span>
            <a>{breakText(String(nonce), limitWordLetter)}</a>
          </span>
          <p>{getAge(fromUnixTime(timeStamp))} ago</p>
        </div>
        <div>
          <span>
            Miner <a>{breakText(parentHash, limitWordLetter)}</a>
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
  };

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

      if (!list) {
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
  const props: IHome = { blocks: [], transactions: [], error: '' };

  const getLatest = (array: any[]): any[] => {
    array.reverse();

    if (array.length > 10) {
      array.length = 10;
    }

    return array;
  };

  const blocks: IHyperblockResponse = await api.get('hyperblock/list');
  if (!blocks.error) {
    props.blocks = getLatest(blocks.data.hyperblocks);
  }

  const transactions: ITransactionResponse = await api.get('transaction/list');
  if (!transactions.error) {
    props.transactions = getLatest(transactions.data.transactions);
  }

  return { props };
};

export default Home;
