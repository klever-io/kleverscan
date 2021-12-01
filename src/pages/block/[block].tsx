import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { format, fromUnixTime } from 'date-fns';

import { ArrowLeft } from '@/assets/icons';

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

import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import Copy from '@/components/Copy';

import { IBlock, IPagination, IResponse, ITransaction } from '../../types';
import api from '@/services/api';
import { CenteredRow } from '@/views/transactions/detail';
import { formatAmount } from '@/utils/index';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';

interface IBlockPage {
  block: IBlock;
  transactions: ITransaction[];
  totalPagesTransactions: number;
}

interface IBlockResponse extends IResponse {
  data: {
    block: IBlock;
  };
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

const Block: React.FC<IBlockPage> = ({
  block,
  transactions: defaultTransactions,
  totalPagesTransactions,
}) => {
  const {
    hash,
    timestamp,
    nonce,
    epoch,
    size,
    kAppFees,
    softwareVersion,
    chainID,
    producerSignature,
    parentHash,
    trieRoot,
    validatorsTrieRoot,
    assetTrieRoot,
    prevRandSeed,
    randSeed,
  } = block;

  const router = useRouter();
  const cardHeaders = ['Overview', 'Info'];
  const tableHeaders = ['Transactions'];
  const precision = 6; // default KLV precision

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const [transactionPage, setTransactionPage] = useState(0);
  const [transactions, setTransactions] = useState(defaultTransactions);

  useEffect(() => {
    const fetchData = async () => {
      const response: ITransactionResponse = await api.get({
        route: `transaction/list?page=${transactionPage}&nonce=${nonce}`,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
      }
    };

    fetchData();
  }, [transactionPage]);

  const handleCopyInfo = (data: string) => {
    navigator.clipboard.writeText(String(data));
  };

  const Overview: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>Hash</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{hash}</span>
              <Copy info="Hash" data={hash} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Timestamp</strong>
          </span>
          <span>
            <small>
              {format(fromUnixTime(timestamp / 1000), 'dd/MM/yyyy HH:mm')}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Nonce</strong>
          </span>
          <span>{nonce}</span>
        </Row>
        <Row>
          <span>
            <strong>Epoch</strong>
          </span>
          <span>
            <small>{epoch}</small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Block Size</strong>
          </span>
          <span>{size} Bytes</span>
        </Row>
        <Row>
          <span>
            <strong>kApp Fee</strong>
          </span>
          <span>{formatAmount((kAppFees || 0) / 10 ** precision)}</span>
        </Row>
      </>
    );
  };

  const Info: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>Software Version</strong>
          </span>
          <span>{softwareVersion}</span>
        </Row>
        <Row>
          <span>
            <strong>Chain ID</strong>
          </span>
          <span>
            <small>{chainID}</small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Producer Signature</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{producerSignature}</span>
              <Copy info="Signature" data={producerSignature} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Parent Hash</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{parentHash}</span>
              <Copy info="Parent hash" data={parentHash} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Trie Root</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{trieRoot}</span>
              <Copy info="Trie root" data={trieRoot} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Validators Trie Root</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{validatorsTrieRoot}</span>
              <Copy data={validatorsTrieRoot} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Asset Trie Root</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{assetTrieRoot}</span>
              <Copy data={assetTrieRoot} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Previous Random Seed</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{prevRandSeed}</span>
              <Copy data={prevRandSeed} />
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Previous Random Seed</strong>
          </span>
          <span>
            <CenteredRow>
              <span>{randSeed}</span>
              <Copy info="Random seed" data={randSeed} />
            </CenteredRow>
          </span>
        </Row>
      </>
    );
  };

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case 'Overview':
        return <Overview />;
      case 'Info':
        return <Info />;
      default:
        return <div />;
    }
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return (
          <>
            <Transactions {...transactions} />

            <PaginationContainer>
              <Pagination
                count={totalPagesTransactions}
                page={transactionPage}
                onPaginate={page => setTransactionPage(page)}
              />
            </PaginationContainer>
          </>
        );
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
            <h1>Block Detail</h1>
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

export const getServerSideProps: GetStaticProps<IBlockPage> = async ({
  params,
}) => {
  const props: IBlockPage = {
    block: {} as IBlock,
    totalPagesTransactions: 0,
    transactions: [],
  };

  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const blockNonce = Number(params?.block);

  if (!blockNonce || isNaN(blockNonce)) {
    return redirectProps;
  }

  const block: IBlockResponse = await api.get({
    route: `block/by-nonce/${blockNonce}`,
  });
  if (block.error) {
    return redirectProps;
  }
  props.block = block.data.block;

  const transactions: ITransactionResponse = await api.get({
    route: `transaction/list?nonce=${block.data.block.nonce}`,
  });
  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalPagesTransactions = transactions.pagination.totalPages;
  }

  return { props };
};

export default Block;
