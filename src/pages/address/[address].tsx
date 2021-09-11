import React from 'react';

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

interface IAddress {
  address: string;
  name: string;
  balance: string;
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

interface Chart {
  Icon: IconType;
  title: string;
  percent: number;
  available: number;
}

const Address: React.FC<IAddress> = ({
  address,
  name,
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

  const getName = () => {
    if (!name) {
      return '--';
    }

    return name;
  };

  const AddressInfo = () => {
    return (
      <AddressInfoContainer>
        <span>Address</span>
        <p>{address}</p>
        <span>Name</span>
        <p>{getName()}</p>
      </AddressInfoContainer>
    );
  };

  const Balance = () => {
    return (
      <BalanceContainer>
        <BalanceHeader>
          <span>Balance</span>
          <div>
            <span>{balance} TRX</span>
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
              <>
                <Chart key={index} {...chart} />
                {index === 0 && <HorizontalDivider />}
              </>
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
  const accountLength = 34;

  let address;
  if (params && params.address) {
    address = params.address;
  }

  if (!address || address.length !== accountLength) {
    return {
      redirect: { destination: '/404', permanent: false },
    };
  }

  const props: IAddress = {
    address: 'TKi8JMDijic2QXF2oRe7Xg82fTbNa2gATr',
    name: '',
    balance: '14.670.46696',
    convertedBalance: '698.949',
    available: '14,000.46696',
    frozen: '14,000.46696',
    transfers: {
      send: 1000,
      receive: 1000,
    },
    transactions: 21793,
    energy: {
      used: 1531,
      available: 10000,
    },
  };

  return { props };
};

export default Address;
