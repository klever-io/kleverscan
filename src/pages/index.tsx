import React, { useState } from 'react';

import { GetServerSideProps } from 'next';

import { Container, DataContainer, Input } from '@/views/home';

import { IHome } from '../types';

import HomeServerSideProps from '../utils/ServerSideProps/Home';

import HomeDataCards from '@/components/HomeDataCards';
import BlockCardList from '@/components/BlockCardList';
import HomeTransactions from '@/components/HomeTransactions';

const Home: React.FC<IHome> = ({
  totalAccounts: defaultTotalAccounts,
  totalTransactions: defaultTotalTransactions,
  tps,
  coinsData,
  yeasterdayTransactions,
  blocks,
  transactionsList,
  transactions: defaultTransactions,
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
          tps={tps}
          coinsData={coinsData}
          yeasterdayTransactions={yeasterdayTransactions}
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
