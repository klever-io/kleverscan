import React, { Fragment } from 'react';

import { GetStaticProps } from 'next';

import { IconType } from 'react-icons/lib';

import {
  Container,
  Content,
  Header,
  HeaderIcon,
  Body,
  AddressInfoContainer,
  Divider,
  BalanceContainer,
  SideContainer,
  BalanceHeader,
  BalanceBody,
  TransferContainer,
  PowerContainer,
  EnergyContainer,
  EnergyLoader,
  CircleChart,
  ChartContainer,
  HorizontalDivider,
  ChartContent,
  ChartHeader,
  ChartBody,
} from '../../views/address';

import Input from '../../components/Input';

import { FaRegUser } from 'react-icons/fa';
import { IoSnowOutline } from 'react-icons/io5';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import { IoMdWifi, IoMdHelp } from 'react-icons/io';
import { VscSymbolEvent } from 'react-icons/vsc';
import api from '../../services/api';
import { IAccount, IPagination, IResponse } from '../../types';

interface IAddress {
  address: string;
  name: string;
  balance: number;
  convertedBalance: string;
  available: string;
  frozen: string;
  transfers: {
    receive: number;
    send: number;
  };
  transactions: number;
  energy: {
    used: number;
    available: number;
  };
}

interface IAccountResponse extends IResponse {
  data: {
    account: IAccount;
  };
}

interface ITransactionsResponse extends IResponse {
  pagination: IPagination;
}

interface Chart {
  Icon: IconType;
  title: string;
  percent: number;
  available: number;
}

const Address: React.FC<IAddress> = ({
  address,
  // name,
  balance,
  convertedBalance,
  available,
  frozen,
  transfers,
  transactions,
  energy,
}) => {
  const getChartProps = () => {
    const chartsProps = [
      { Icon: IoMdWifi, title: 'Bandwidth', percent: 90, available: 61025 },
      {
        Icon: VscSymbolEvent,
        title: 'Energy',
        percent: 0,
        available: 0,
      },
    ];

    return chartsProps;
  };

  // const getName = () => {
  //   if (!name) {
  //     return '--';
  //   }

  //   return name;
  // };

  const AddressInfo = () => {
    return (
      <AddressInfoContainer>
        <span>Address</span>
        <p>{address}</p>
        {/* <span>Name</span>
        <p>{getName()}</p> */}
      </AddressInfoContainer>
    );
  };

  const Balance = () => {
    return (
      <BalanceContainer>
        <BalanceHeader>
          <span>Balance</span>
          <div>
            <span>{balance.toLocaleString()} KLV</span>
            <p>({convertedBalance} USD)</p>
          </div>
        </BalanceHeader>
        <BalanceBody>
          <span>Available</span>
          <p>{available}</p>
          <span>Frozen</span>
          <div>
            <p>{frozen}</p>
            <IoSnowOutline size={20} />
          </div>
        </BalanceBody>
      </BalanceContainer>
    );
  };

  const Transfers = () => {
    return (
      <TransferContainer>
        <span>Transfers</span>
        <div>
          <MdKeyboardArrowUp size={24} />
          <p>{transfers.send}</p>
          <MdKeyboardArrowDown size={24} />
          <p>{transfers.receive}</p>
        </div>
        <span>Transactions</span>
        <p>{transactions}</p>
      </TransferContainer>
    );
  };

  const Power = () => {
    const getTotalEnergy = () => {
      return energy.used + energy.available;
    };

    const getPercentEnergy = () => {
      return (energy.used / getTotalEnergy()) * 100;
    };

    const Chart: React.FC<Chart> = ({ Icon, title, percent, available }) => {
      return (
        <ChartContent>
          <ChartHeader>
            <div>
              <Icon />
              <span>{title}</span>
            </div>
            <div>
              <IoMdHelp />
            </div>
          </ChartHeader>
          <ChartBody>
            <CircleChart active={percent > 0}>
              <div>
                <span>{percent}%</span>
              </div>
            </CircleChart>
            <div>
              <span>Available</span>
              <span>{title}</span>
              <strong>{available.toLocaleString()}</strong>
            </div>
          </ChartBody>
        </ChartContent>
      );
    };

    return (
      <PowerContainer>
        <span>Tron Power</span>
        <EnergyContainer>
          <div>
            <p>{getTotalEnergy().toLocaleString()}</p>
            <span>
              ( Used: {energy.used.toLocaleString()} Available:{' '}
              {energy.available.toLocaleString()} )
            </span>
          </div>
          <EnergyLoader percent={getPercentEnergy()}>
            <div />
          </EnergyLoader>
          <ChartContainer>
            {getChartProps().map((chart, index) => (
              <Fragment key={String(index)}>
                <Chart {...chart} />
                {index === 0 && <HorizontalDivider />}
              </Fragment>
            ))}
          </ChartContainer>
        </EnergyContainer>
      </PowerContainer>
    );
  };

  return (
    <Container>
      <Input />
      <Content>
        <Header>
          <HeaderIcon>
            <FaRegUser />
          </HeaderIcon>
          <h3>Address</h3>
          <span>#{address}</span>
        </Header>
        <Body>
          <SideContainer>
            <AddressInfo />
            <Divider />
            <Balance />
            <Divider />
            <Transfers />
          </SideContainer>
          <SideContainer>
            <Power />
          </SideContainer>
        </Body>
      </Content>
    </Container>
  );
};

export const getServerSideProps: GetStaticProps = async ({ params }) => {
  const accountLength = 62;
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const address = String(params?.accounts);

  if (!address || address.length !== accountLength) {
    return redirectProps;
  }

  const account: IAccountResponse = await api.get({
    route: `address/${address}`,
  });
  const transactions: ITransactionsResponse = await api.get({
    route: `address/${address}/transactions`,
  });

  if (account.error) {
    return redirectProps;
  }

  const props: IAddress = {
    address,
    name: '',
    balance: account.data.account.balance,
    convertedBalance: '698.949',
    available: '14,000.46696',
    frozen: '14,000.46696',
    transfers: {
      send: 0,
      receive: 0,
    },
    transactions: transactions.pagination.totalRecords || 0,
    energy: {
      used: 1531,
      available: 10000,
    },
  };

  return { props };
};

export default Address;
