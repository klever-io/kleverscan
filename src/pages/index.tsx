import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Navbar from '../components/Navbar';
import { BackgroundVideo } from '../views/home';

import { BackgroundVideo, InputContainer } from '../views/home';

import Input from '../components/Input';
import Navbar from '../components/Navbar';

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

  const coin = 'USD';
  const statsData: IStats[] = [
    {
      Side: TopRow,
      name: 'Klever Price',
      value: 0.0,
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

  useEffect(() => {
    const time = 0.75 * 1000; //ms

    setTimeout(() => {
      setLoaded(true);
    }, time); // simulate delay
  }, []);

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
            <StatsContainer>
              {statsData.map((item, index) => (
                <item.Side key={index}>
                  <div>
                    <span>{item.name}</span>
                    {loaded ? (
                      <p>{`${item.value} ${item.haveCoin ? coin : ''}`}</p>
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </item.Side>
              ))}
            </StatsContainer>
            <PriceHistoryContainer>
              <span>24h Price History</span>
            </PriceHistoryContainer>
          </CardContainer>
        </Container>
      </main>
    </>
  );
};

export default Home;
