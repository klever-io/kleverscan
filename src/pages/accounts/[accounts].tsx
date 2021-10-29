import React, { useEffect, useState } from 'react';

import { GetStaticProps } from 'next';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
} from '../../views/address';

import Input from '../../components/Input';

import api, { IPrice, Service } from '../../services/api';
import {
  Contract,
  IAccount,
  IPagination,
  IResponse,
  ITransaction,
} from '../../types';

import { IoSnowOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';
import {
  Indicator,
  Tab,
  TabContainer,
} from '../../components/Layout/Detail/styles';
import { TableContainer } from '../../components/Layout/List/styles';
import { IToast } from '../../components/Layout/Detail';

interface IAccountResponse extends IResponse {
  data: {
    account: IAccount;
  };
}

interface ITransactionsResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

interface IPriceResponse extends IResponse {
  symbols: IPrice[];
}

interface IAccountPage {
  account: IAccount;
  transactions: ITransactionsResponse;
  convertedBalance: number;
}

interface ITab {
  title: string;
  headers: string[];
  data: any[];
}

const Address: React.FC<IAccountPage> = ({
  account,
  convertedBalance,
  transactions,
}) => {
  const precision = 6; // KLV default precision

  const handleCopyInfo = (info: string, data: string | number) => {
    const toastProps: IToast = {
      autoClose: 2000,
      pauseOnHover: false,
      closeOnClick: true,
    };

    navigator.clipboard.writeText(String(data));
    toast.info(`${info} copied to clipboard`, toastProps);
  };

  const getTokenData = () =>
    Object.keys(account.assets).map((assetId, index) => (
      <tr key={String(index)}>
        <td>
          <Link href={`/assets/${assetId}`}>{assetId}</Link>
        </td>
        <td>{account.assets[assetId].balance.toLocaleString()}</td>
        <td>{account.assets[assetId].frozenBalance.toLocaleString()}</td>
      </tr>
    ));

  const getBucketData = () =>
    Object.keys(account.buckets).map((bucketId, index) => (
      <tr key={String(index)}>
        <td>{account.buckets[bucketId].stakeValue.toLocaleString()}</td>
        <td>{account.buckets[bucketId].staked ? 'True' : 'False'}</td>
        <td>{account.buckets[bucketId].stakedEpoch}</td>
        <td>{account.buckets[bucketId].unstakedEpoch}</td>
        <td>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() =>
              handleCopyInfo('Delegation', account.buckets[bucketId].delegation)
            }
          >
            {account.buckets[bucketId].delegation}
          </span>
        </td>
      </tr>
    ));

  const getTransactionData = () =>
    transactions.data.transactions.map((transaction, index) => (
      <tr key={String(index)}>
        <td>{Object.values(Contract)[transaction.contract[0].type]}</td>
        <td>
          <Link href={`/transactions/${transaction.hash}`}>
            {transaction.hash}
          </Link>
        </td>
      </tr>
    ));

  const tabs: ITab[] = [
    ...(account.assets && Object.values(account.assets).length > 0
      ? [
          {
            title: 'Assets',
            headers: ['Asset ID', 'Balance', 'Frozen'],
            data: getTokenData(),
          },
        ]
      : []),
    ...(account.buckets && Object.values(account.buckets).length > 0
      ? [
          {
            title: 'Buckets',
            headers: [
              'Staked Value',
              'Staked',
              'Staked Epoch',
              'Unstaked Epoch',
              'Delegation',
            ],
            data: getBucketData(),
          },
        ]
      : []),
    ...(transactions.data.transactions &&
    transactions.data.transactions.length > 0
      ? [
          {
            title: 'Transactions',
            headers: ['Contract Type', 'Hash'],
            data: getTransactionData(),
          },
        ]
      : []),
  ];

  const [selectedTab, setSelectedTab] = useState<ITab>(tabs[0] || ({} as ITab));

  const getTotalBalance = () => {
    return (account.balance + getFreezeBalance()) / 10 ** precision;
  };

  const getFreezeBalance = () => {
    if (Object.values(account.buckets).length <= 0) {
      return 0;
    }

    const freezeBalance = Object.values(account.buckets).reduce(
      (acc, bucket) => acc + bucket.stakeValue,
      0,
    );

    return freezeBalance / 10 ** precision;
  };

  useEffect(() => {
    const title = selectedTab?.title ? selectedTab.title : '';

    const tab = document.getElementById(`tab-${title.toLowerCase()}`);
    const indicator = document.getElementById('tab-indicator');

    if (indicator && tab) {
      indicator.style.width = `${String(tab.offsetWidth)}px`;
      indicator.style.transform = `translateX(${String(tab.offsetLeft)}px)`;
    }
  }, [selectedTab]);

  const renderTabs = () =>
    tabs.map((tab, index) => {
      const id = `tab-${tab.title.toLowerCase()}`;
      const active = tab.title === selectedTab.title;
      const handleTab = () => setSelectedTab(tab);

      const props = { id, active, onClick: handleTab };

      return (
        <Tab key={String(index)} {...props}>
          {tab.title}
        </Tab>
      );
    });

  const AddressInfo = () => {
    return (
      <AddressInfoContainer>
        <p>Address</p>
        <span>{account.address}</span>
      </AddressInfoContainer>
    );
  };

  const Balance = () => {
    return (
      <BalanceContainer>
        <BalanceHeader>
          <span>Balance</span>
          <div>
            <span>{getTotalBalance().toLocaleString()} KLV</span>
            <p>({convertedBalance.toLocaleString()} USD)</p>
          </div>
        </BalanceHeader>
        <BalanceBody>
          <span>Available</span>
          <p>{(account.balance / 10 ** precision).toLocaleString()}</p>
          <span>Frozen</span>
          <div>
            <p>{getFreezeBalance().toLocaleString()}</p>
            <IoSnowOutline size={20} />
          </div>
        </BalanceBody>
      </BalanceContainer>
    );
  };

  const Transfers = () => {
    return (
      <TransferContainer>
        <span>Transactions</span>
        <p>{transactions.pagination.totalRecords}</p>
      </TransferContainer>
    );
  };

  const AccountTabs: React.FC = () => (
    <Content style={{ marginTop: '.75rem' }}>
      <TabContainer>
        <Indicator id="tab-indicator" />

        {renderTabs()}
      </TabContainer>

      <TableContainer>
        <table>
          <thead>
            <tr>
              {selectedTab.headers.map((header, index) => (
                <td key={String(index)}>{header}</td>
              ))}
            </tr>
          </thead>
          <tbody>{selectedTab.data}</tbody>
        </table>
      </TableContainer>
    </Content>
  );

  return (
    <Container>
      <ToastContainer />

      <Input />
      <Content>
        <Header>
          <HeaderIcon>
            <FaRegUser />
          </HeaderIcon>
          <h3>Address</h3>
          <span>#{account.address}</span>
        </Header>
        <Body>
          <SideContainer>
            <AddressInfo />
            <Divider />
            <Balance />
            <Divider />
            <Transfers />
          </SideContainer>
        </Body>
      </Content>

      {tabs.length > 0 && <AccountTabs />}
    </Container>
  );
};

export const getServerSideProps: GetStaticProps<IAccountPage> = async ({
  params,
}) => {
  const props: IAccountPage = {
    account: {} as IAccount,
    convertedBalance: 0,
    transactions: {} as ITransactionsResponse,
  };

  const precision = 6; // KLV default precision;
  const accountLength = 62;
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const address = String(params?.accounts);

  if (!address || address.length !== accountLength) {
    return redirectProps;
  }

  const account: IAccountResponse = await api.get({
    route: `address/${address}`,
  });
  if (account.error) {
    return redirectProps;
  }
  props.account = account.data.account;

  const transactions: ITransactionsResponse = await api.get({
    route: `address/${address}/transactions`,
  });
  if (account.error) {
    return redirectProps;
  }
  props.transactions = transactions;

  const prices: IPriceResponse = await api.post({
    route: 'prices',
    service: Service.PRICE,
    body: { names: ['KLV/USD'] },
  });
  if (!prices.error) {
    props.convertedBalance =
      prices.symbols[0].price *
      (account.data.account.balance / 10 ** precision);
  }

  return { props };
};

export default Address;
