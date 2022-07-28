import React, { useState } from 'react';

import { GetServerSideProps } from 'next';

import { Container, DataContainer, Input } from '@/views/home';

import { IHome } from '../types';

import HomeServerSideProps from '../utils/ServerSideProps/Home';

import HomeDataCards from '@/components/Cards/HomeDataCards';
import BlockCardList from '@/components/BlockCardList';
import HomeTransactions from '@/components/HomeTransactions';

const Home: React.FC<IHome> = ({
  totalAccounts: defaultTotalAccounts,
  totalTransactions: defaultTotalTransactions,
  epochInfo: defaultEpochInfo,
  tps,
  coinsData,
  yesterdayTransactions,
  blocks,
  transactionsList,
  transactions: defaultTransactions,
  yesterdayAccounts,
  coinsStaking,
}) => {
  const precision = 6; // default KLV precision
  const [totalTransactions, setTotalTransactions] = useState(
    defaultTotalTransactions,
  );
  return (
    <Container>
      <DataContainer>
        <Input />
        <HomeDataCards
          totalAccounts={defaultTotalAccounts}
          totalTransactions={totalTransactions}
          epochInfo={defaultEpochInfo}
          tps={tps}
          coinsData={coinsData}
          yesterdayTransactions={yesterdayTransactions}
          yesterdayAccounts={yesterdayAccounts}
          coinsStaking={coinsStaking}
        />
      </DataContainer>

      <BlockCardList blocks={blocks} precision={precision} />
      <HomeTransactions
        setTotalTransactions={setTotalTransactions}
        transactions={defaultTransactions}
        transactionsList={transactionsList}
        precision={precision}
      />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IHome> =
  HomeServerSideProps;

export default Home;
