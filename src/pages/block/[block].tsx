import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import api from '@/services/api';
import { IBlock } from '@/types/blocks';
import { toLocaleFixed } from '@/utils/index';
import {
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  CenteredRow,
  CenteredRowSpan,
  CommonSpan,
  Container,
  Header,
  Input,
  Row,
} from '@/views/blocks/detail';
import { format, fromUnixTime } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useState } from 'react';
import { IPagination, IResponse, ITransaction } from '../../types';

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
    txFees,
    txBurnedFees,
    softwareVersion,
    chainID,
    producerSignature,
    parentHash,
    trieRoot,
    validatorsTrieRoot,
    kappsTrieRoot,
    prevRandSeed,
    randSeed,
  } = block;

  const cardHeaders = ['Overview', 'Info'];
  const tableHeaders = ['Transactions'];
  const precision = 6; // default KLV precision

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const requestBlock = async (page: number): Promise<ITransactionResponse> =>
    api.get({
      route: `transaction/list?page=${page}&blockNum=${nonce}`,
    });

  const Overview: React.FC = () => {
    return (
      <>
        <Row>
          <CommonSpan>
            <strong>Hash</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{hash}</CenteredRowSpan>
            <Copy info="Hash" data={hash} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Timestamp</strong>
          </CommonSpan>
          <CommonSpan>
            <small>
              {format(fromUnixTime(timestamp / 1000), 'dd/MM/yyyy HH:mm')}
            </small>
          </CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Nonce</strong>
          </CommonSpan>
          <CommonSpan>{nonce}</CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Epoch</strong>
          </CommonSpan>
          <CommonSpan>
            <small>{epoch}</small>
          </CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Block Size</strong>
          </CommonSpan>
          <CommonSpan>{size} Bytes</CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>KApp Fee</strong>
          </CommonSpan>
          <CommonSpan>
            <small>
              {toLocaleFixed((kAppFees || 0) / 10 ** precision, precision)}
            </small>
          </CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Burned Fee</strong>
          </CommonSpan>
          <CommonSpan>
            <small>
              {toLocaleFixed((txBurnedFees || 0) / 10 ** precision, precision)}
            </small>
          </CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Bandwidth Fee</strong>
          </CommonSpan>
          <CommonSpan>
            <small>
              {toLocaleFixed((txFees || 0) / 10 ** precision, precision)}
            </small>
          </CommonSpan>
        </Row>
      </>
    );
  };

  const Info: React.FC = () => {
    return (
      <>
        <Row>
          <CommonSpan>
            <strong>Software Version</strong>
          </CommonSpan>
          <CommonSpan>{softwareVersion}</CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Chain ID</strong>
          </CommonSpan>
          <CommonSpan>
            <small>{chainID}</small>
          </CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Producer Signature</strong>
          </CommonSpan>

          <CenteredRow>
            <CenteredRowSpan>{producerSignature}</CenteredRowSpan>
            <Copy info="Signature" data={producerSignature} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Parent Hash</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{parentHash}</CenteredRowSpan>
            <Copy info="Parent hash" data={parentHash} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Trie Root</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{trieRoot}</CenteredRowSpan>
            <Copy info="Trie root" data={trieRoot} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Validators Trie Root</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{validatorsTrieRoot}</CenteredRowSpan>
            <Copy data={validatorsTrieRoot} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>KApps Trie Root</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{kappsTrieRoot}</CenteredRowSpan>
            <Copy data={kappsTrieRoot} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Previous Random Seed</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{prevRandSeed}</CenteredRowSpan>
            <Copy data={prevRandSeed} />
          </CenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Random Seed</strong>
          </CommonSpan>
          <CenteredRow>
            <CenteredRowSpan>{randSeed}</CenteredRowSpan>
            <Copy info="Random seed" data={randSeed} />
          </CenteredRow>
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

  const transactionTableProps = {
    scrollUp: false,
    totalPages: totalPagesTransactions || 0,
    dataName: 'transactions',
    request: (page: number) => requestBlock(page),
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return (
          <>
            <Transactions
              precision={precision}
              transactions={defaultTransactions}
              transactionsTableProps={transactionTableProps}
            />
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
        <Title title="Block Details" />

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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IBlockPage> = async ({
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
    route: `transaction/list?blockNum=${block.data.block.nonce}`,
  });

  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalPagesTransactions = transactions?.pagination?.totalPages || 0;
  }

  return {
    props,
  };
};

export default Block;
