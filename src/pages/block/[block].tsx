import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import Validators from '@/components/Tabs/Validators';
import Tooltip from '@/components/Tooltip';
import api from '@/services/api';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  Container,
  Header,
  Row,
} from '@/styles/common';
import { IBlock, IBlockPage, IBlockResponse } from '@/types/blocks';
import { setQueryAndRouter } from '@/utils';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import {
  CenteredRowSpan,
  CommonSpan,
  RowBlockNavigation,
  ToolTipStyle,
  TooltipContainer,
} from '@/views/blocks/detail';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { ITransactionsResponse, NotFound } from '../../types';

const Block: React.FC<IBlockPage> = ({ block }) => {
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
    validators,
    kappsTrieRoot,
    prevRandSeed,
    randSeed,
  } = block;
  const router = useRouter();
  const cardHeaders = ['Overview', 'Info'];
  const tableHeaders = ['Transactions', 'Validators'];
  const precision = 6; // default KLV precision

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const requestBlock = async (
    page: number,
    limit: number,
  ): Promise<ITransactionsResponse> =>
    api.get({
      route: `transaction/list?page=${page}&blockNum=${nonce}&limit=${limit}`,
    });

  useEffect(() => {
    if (!router.isReady) return;
    setSelectedTab((router.query.tab as string) || tableHeaders[0]);
    setSelectedCard((router.query.card as string) || cardHeaders[0]);
    setQueryAndRouter({ ...router.query }, router);
  }, [router.isReady]);

  const BlockNavigation: React.FC = () => {
    return (
      <TooltipContainer>
        <Link href={`/block/${nonce - 1}`}>
          <a>
            <ToolTipStyle>
              <Tooltip
                msg="View previous block"
                Component={MdOutlineKeyboardArrowLeft}
              />
            </ToolTipStyle>
          </a>
        </Link>
        <Link href={`/block/${nonce + 1}`}>
          <a>
            <ToolTipStyle>
              <Tooltip
                msg="View next block"
                Component={MdOutlineKeyboardArrowRight}
              />
            </ToolTipStyle>
          </a>
        </Link>
      </TooltipContainer>
    );
  };

  const Overview: React.FC = () => {
    return (
      <>
        <Row>
          <CommonSpan>
            <strong>Block</strong>
          </CommonSpan>
          <RowBlockNavigation>
            #{nonce}
            <BlockNavigation />
          </RowBlockNavigation>
        </Row>
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
            <small>{formatDate(timestamp)}</small>
          </CommonSpan>
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
    dataName: 'transactions',
    request: (page: number, limit: number) => requestBlock(page, limit),
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionTableProps} />;
      case 'Validators':
        return <Validators validators={validators} />;
      default:
        return <div />;
    }
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header);
      const updatedQuery = { ...router.query };
      delete updatedQuery.page;
      delete updatedQuery.limit;
      setQueryAndRouter({ ...updatedQuery, tab: header }, router);
    },
  };

  return (
    <Container>
      <Header>
        <Title title="Block Details" route="/blocks" />
      </Header>

      <CardTabContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => {
                setSelectedCard(header);
                setQueryAndRouter({ ...router.query, card: header }, router);
              }}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardTabContainer>

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
  };

  const redirectProps: NotFound = {
    notFound: true,
  };

  const blockNonce = Number(params?.block);

  if (blockNonce < 0 || isNaN(blockNonce)) {
    return redirectProps;
  }

  const block: IBlockResponse = await api.get({
    route: `block/by-nonce/${blockNonce}`,
  });

  if (block.error) {
    return redirectProps;
  }

  props.block = block.data.block;

  return {
    props,
  };
};

export default Block;
