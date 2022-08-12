import BlockCardList from '@/components/BlockCardList';
import HomeDataCards from '@/components/Cards/HomeDataCards';
import HomeTransactions from '@/components/HomeTransactions';
import { Container, DataContainer, Input } from '@/views/home';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { IHome } from '../types';
import HomeServerSideProps from '../utils/ServerSideProps/Home';

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
  assetsData,
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
          block={blocks?.[0]}
          totalAccounts={defaultTotalAccounts}
          totalTransactions={totalTransactions}
          epochInfo={defaultEpochInfo}
          tps={tps}
          coinsData={coinsData}
          yesterdayTransactions={yesterdayTransactions}
          yesterdayAccounts={yesterdayAccounts}
          assetsData={assetsData}
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
