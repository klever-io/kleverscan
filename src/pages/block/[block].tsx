import React, { useState } from 'react';
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

import { IBlock, IResponse } from '../../types';
import api from '@/services/api';
import { CenteredRow } from '@/views/transactions/detail';
import { formatAmount } from '@/utils/index';

interface IBlockResponse extends IResponse {
  data: {
    block: IBlock;
  };
}

const Block: React.FC<IBlock> = ({
  hash,
  timestamp,
  nonce,
  epoch,
  size,
  kAppFees,
  transactions,
  softwareVersion,
  chainID,
  producerSignature,
  parentHash,
  trieRoot,
  validatorsTrieRoot,
  assetTrieRoot,
  prevRandSeed,
  randSeed,
}) => {
  const router = useRouter();
  const cardHeaders = ['Overview', 'Info'];
  const tableHeaders = ['Transactions'];
  const precision = 6; // default KLV precision

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

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
        return <Transactions {...transactions} />;
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

export const getServerSideProps: GetStaticProps<IBlock> = async ({
  params,
}) => {
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

  const props: IBlock = block.data.block;

  return { props };
};

export default Block;
