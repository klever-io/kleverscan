import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  AssetTitle,
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  Container,
  Header,
  Input,
  Row,
  Title,
} from '@/views/assets/detail';

import api from '@/services/api';
import {
  IAccount,
  IAsset,
  IPagination,
  IResponse,
  ITransaction,
} from '@/types/index';
import { toLocaleFixed } from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import Holders from '@/components/Tabs/Holders';

interface IAssetPage {
  asset: IAsset;
  transactions: ITransaction[];
  totalTransactions: number;
  holders: IAccount[];
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

interface IHoldersResponse extends IResponse {
  data: {
    accounts: IAccount[];
  };
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

const Asset: React.FC<IAssetPage> = ({
  asset,
  transactions,
  totalTransactions,
  holders,
}) => {
  const {
    name,
    ticker,
    type,
    ownerAddress,
    precision,
    maxSupply,
    initialSupply,
  } = asset;

  const router = useRouter();
  const cardHeaders = ['Overview', 'More'];
  const tableHeaders = ['Transactions', 'Holders'];

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const Overview: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Total Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(maxSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Initial Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(initialSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Holders</strong>
          </span>
          <span>{holders.length}</span>
        </Row>
        <Row>
          <span>
            <strong>Transactions</strong>
          </span>
          <span>{totalTransactions}</span>
        </Row>
        <Row>
          <span>
            <strong>Market Cap</strong>
          </span>
          <span>--</span>
        </Row>
      </>
    );
  };

  const More: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>White Papper</strong>
          </span>
          <span>
            <a href="#">--</a>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Official Website</strong>
          </span>
          <span>
            <a href="#">--</a>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Issuing Time</strong>
          </span>
          <span>--</span>
        </Row>
        <Row>
          <span>
            <strong>Issuer</strong>
          </span>
          <span>--</span>
        </Row>
        <Row>
          <span>
            <strong>Precision</strong>
          </span>
          <span>
            <p>{precision}</p>
          </span>
        </Row>
      </>
    );
  };

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case 'Overview':
        return <Overview />;
      case 'More':
        return <More />;
      default:
        return <div />;
    }
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <Transactions {...transactions} />;
      case 'Holders':
        return <Holders asset={asset} holders={holders} />;
      default:
        return <div />;
    }
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => setSelectedTab(header),
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>

          <AssetTitle>
            <h1>
              {name} ({ticker})
            </h1>
            <div>{type}</div>
          </AssetTitle>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => setSelectedCard(header)}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardContainer>

      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IAssetPage> = async ({
  params,
}) => {
  const props: IAssetPage = {
    asset: {} as IAsset,
    transactions: [],
    totalTransactions: 0,
    holders: [],
  };

  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const address = params?.asset;

  const asset: IAssetResponse = await api.get({ route: `assets/${address}` });
  if (asset.error) {
    return redirectProps;
  } else {
    props.asset = asset.data.asset;
  }

  const transactions: ITransactionResponse = await api.get({
    route: `transactions/list?asset=${address}`,
  });
  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalTransactions = transactions.pagination.totalRecords;
  }

  const holders: IHoldersResponse = await api.get({
    route: `assets/holders/${address}`,
  });
  if (!holders.error) {
    props.holders = holders.data.accounts;
  }

  return { props };
};

export default Asset;
