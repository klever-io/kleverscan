import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import { IconType } from 'react-icons/lib';

import {
  BackgroundVideo,
  CardContainer,
  TopRow,
  InputContainer,
  Container,
  BottomRow,
  StatsContainer,
  PriceHistoryContainer,
  LoaderContainer,
  ChartContainer,
  Divider,
  TimeChart,
  ReportsContainer,
  ChartContent,
  ReportHeader,
  ReportHeaderIcon,
} from '../views/home';

import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';
import Chart from '../components/Chart';
import Button from '../components/Button';

import {
  infoChartData,
  IChartData,
  defaultEquivalentCoin,
} from '../configs/home';
import { FaLaravel } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';

interface IStats {
  Side: React.FC;
  name: string;
  value: number | string;
  haveCoin: boolean;
}

interface IChart {
  title: string;
  data: IChartData[];
}

interface IReport {
  title: string;
  data: string; // unkown data type
  href: string;
  Icon: IconType;
}

import {
  BackgroundVideo,
  CardContainer,
  TopRow,
  InputContainer,
  Container,
  BottomRow,
  StatsContainer,
  PriceHistoryContainer,
} from '../views/home';

import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';

interface IStats {
  Side: React.FC;
  name: string;
  value: number;
  haveCoin: boolean;
}

const Home: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const time = 0.75 * 1000; //ms

    setTimeout(() => {
      setLoaded(true);
    }, time); // simulate delay
  }, []);

  const StatsCard: React.FC = () => {
    const statsData: IStats[] = [
      {
        Side: TopRow,
        name: 'Klever Price',
        value: (0.0).toFixed(4),
        haveCoin: true,
      },
      {
        Side: TopRow,
        name: 'Market Cap',
        value: 0,
        haveCoin: true,
      },
      {
        Side: BottomRow,
        name: 'Transaction Last Day',
        value: 0,
        haveCoin: false,
      },
      {
        Side: BottomRow,
        name: 'Total Accounts',
        value: 0,
        haveCoin: false,
      },
    ];

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
    const skeletonProps = { width: 150, height: 40 };

    return (
      <PriceHistoryContainer>
        <span>24h Price History</span>
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

  const ReportChart: React.FC = () => {
    const reports: IReport[] = [
      {
        title: 'Blocks',
        data: '?',
        href: 'blocks',
        Icon: FaLaravel,
      },
      {
        title: 'Transfers',
        data: '?',
        href: 'transfers',
        Icon: BiSort,
      },
    ];

    const Header: React.FC<IReport> = ({ title, href, Icon }) => (
      <ReportHeader>
        <div>
          <ReportHeaderIcon>
            <Icon />
          </ReportHeaderIcon>
          <span>{title}</span>
        </div>
        <Link href={href} passHref>
          <Button>
            <p>View All</p>
          </Button>
        </Link>
      </ReportHeader>
    );

    return (
      <ChartContainer>
        {reports.map((report, index) => (
          <ChartContent key={index}>
            <Header {...report} />
            <Divider />
            <p>{report.data}</p>
          </ChartContent>
        ))}
      </ChartContainer>
    );
  };

  return (
    <>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <Navbar background={false} />

      <main>
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
        <ReportsContainer>
          <ReportChart />
        </ReportsContainer>
      </main>
    </>
  );
};

export default Home;
