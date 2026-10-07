import { PropsWithChildren } from 'react';
import CopyAction from '@/components/DataList/CopyAction';
import {
  BlockStep,
  FactHash,
  FactLabel,
  FactRow,
  FactsCard,
  FactsTab,
  FactsTabs,
  FactValue,
  FactValueRow,
} from '@/components/BlockDetail/styles';
import { pickUrlEffect } from '@/components/BlockDetail/urlEffect';
import Title from '@/components/Layout/Title';
import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import Validators from '@/components/Tabs/Validators';
import api from '@/services/api';
import { Container, Header } from '@/styles/common';
import { IBlock, IBlockPage, IBlockResponse } from '@/types/blocks';
import { setQueryAndRouter } from '@/utils';
import { formatDateWithSeconds, toLocaleFixed } from '@/utils/formatFunctions';
import { blockTransactionsCall } from '@/services/requests/block';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { ITransactionsResponse, NotFound } from '../../types';

const HashFact: React.FC<{
  label: string;
  value: string;
  copyLabel: string;
  announcement: string;
}> = ({ label, value, copyLabel, announcement }) => (
  <FactRow>
    <FactLabel>{label}</FactLabel>
    <FactValueRow>
      <FactHash title={value}>{value}</FactHash>
      <CopyAction value={value} label={copyLabel} announcement={announcement} />
    </FactValueRow>
  </FactRow>
);

const TextFact: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <FactRow>
    <FactLabel>{label}</FactLabel>
    <FactValue>{value}</FactValue>
  </FactRow>
);

const CARD_HEADERS = ['Overview', 'Info'];
const TABLE_HEADERS = ['Transactions', 'Validators'];

const Block: React.FC<PropsWithChildren<IBlockPage>> = ({ block }) => {
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
    producerOwnerAddress,
    kappsTrieRoot,
    prevRandSeed,
    randSeed,
  } = block;
  const router = useRouter();
  const precision = 6; // default KLV precision

  // Null until the URL is read. The server does not see ?tab= or ?card=, so
  // starting on Overview and Transactions painted those and then jumped.
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const requestBlock = async (
    page: number,
    limit: number,
  ): Promise<ITransactionsResponse> =>
    blockTransactionsCall(nonce, page, limit, router.query);

  // Before paint, and again when prev/next changes the URL. router.query is
  // empty on the first render, so the address bar is the source.
  const useUrlLayoutEffect = pickUrlEffect(globalThis.window);
  useUrlLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const card = params.get('card');
    setSelectedTab(tab && TABLE_HEADERS.includes(tab) ? tab : TABLE_HEADERS[0]);
    setSelectedCard(
      card && CARD_HEADERS.includes(card) ? card : CARD_HEADERS[0],
    );
  }, [router.asPath]);

  // `||` keeps a NaN fee at 0, which is what the three old call sites did.
  // `??` would hand NaN to the formatter.
  const klv = (raw: number | undefined): string =>
    toLocaleFixed((raw || 0) / 10 ** precision, precision);

  const transactionTableProps = {
    dataName: 'transactions',
    request: (page: number, limit: number) => requestBlock(page, limit),
  };

  const tabProps: ITabs = {
    headers: TABLE_HEADERS,
    selectedIndex:
      selectedTab === null ? -1 : TABLE_HEADERS.indexOf(selectedTab),
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

      <FactsCard>
        <FactsTabs aria-label="Block details">
          {CARD_HEADERS.map(header => (
            <FactsTab
              key={header}
              type="button"
              $selected={selectedCard === header}
              onClick={() => {
                setSelectedCard(header);
                setQueryAndRouter({ ...router.query, card: header }, router);
              }}
            >
              {header}
            </FactsTab>
          ))}
        </FactsTabs>

        {selectedCard === 'Info' && (
          <>
            <TextFact label="Software Version" value={softwareVersion} />
            <TextFact label="Chain ID" value={chainID} />
            <HashFact
              label="Producer Signature"
              value={producerSignature}
              copyLabel="Copy signature"
              announcement="Signature copied to clipboard"
            />
            <HashFact
              label="Parent Hash"
              value={parentHash}
              copyLabel="Copy parent hash"
              announcement="Parent hash copied to clipboard"
            />
            <HashFact
              label="Trie Root"
              value={trieRoot}
              copyLabel="Copy trie root"
              announcement="Trie root copied to clipboard"
            />
            <HashFact
              label="Validators Trie Root"
              value={validatorsTrieRoot}
              copyLabel="Copy validators trie root"
              announcement="Validators trie root copied to clipboard"
            />
            <HashFact
              label="KApps Trie Root"
              value={kappsTrieRoot}
              copyLabel="Copy KApps trie root"
              announcement="KApps trie root copied to clipboard"
            />
            <HashFact
              label="Previous Random Seed"
              value={prevRandSeed}
              copyLabel="Copy previous random seed"
              announcement="Previous random seed copied to clipboard"
            />
            <HashFact
              label="Random Seed"
              value={randSeed}
              copyLabel="Copy random seed"
              announcement="Random seed copied to clipboard"
            />
          </>
        )}
        {selectedCard === 'Overview' && (
          <>
            <FactRow>
              <FactLabel>Block</FactLabel>
              <FactValueRow>
                <FactValue>#{nonce}</FactValue>
                <BlockStep
                  href={`/block/${nonce - 1}`}
                  aria-label="View previous block"
                  title="View previous block"
                >
                  <MdOutlineKeyboardArrowLeft size={18} />
                </BlockStep>
                <BlockStep
                  href={`/block/${nonce + 1}`}
                  aria-label="View next block"
                  title="View next block"
                >
                  <MdOutlineKeyboardArrowRight size={18} />
                </BlockStep>
              </FactValueRow>
            </FactRow>
            <HashFact
              label="Hash"
              value={hash}
              copyLabel="Copy hash"
              announcement="Hash copied to clipboard"
            />
            <TextFact
              label="Timestamp"
              value={formatDateWithSeconds(timestamp)}
            />
            <TextFact label="Epoch" value={String(epoch)} />
            <TextFact label="Block Size" value={`${size} Bytes`} />
            <TextFact label="KApp Fee" value={klv(kAppFees)} />
            <TextFact label="Burned Fee" value={klv(txBurnedFees)} />
            <TextFact label="Bandwidth Fee" value={klv(txFees)} />
          </>
        )}
      </FactsCard>

      <Tabs {...tabProps}>
        {/* The highlight comes from the address bar, before paint. The table
            itself waits until the router has copied page and limit, or a
            refresh of page 2 paints page 1 and then jumps. */}
        {router.isReady && selectedTab === 'Transactions' && (
          <Transactions transactionsTableProps={transactionTableProps} />
        )}
        {router.isReady && selectedTab === 'Validators' && (
          <Validators
            validators={validators}
            producerOwnerAddress={producerOwnerAddress}
          />
        )}
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
  locale = 'en',
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

  // The page loaded no translation namespace at all, so every `t()` reachable
  // from it, including the ones inside the shared transactions table and its
  // filter bar, returned its own key.
  const translations = await serverSideTranslations(
    locale,
    ['common', 'transactions'],
    nextI18nextConfig,
    ['en'],
  );

  return {
    props: { ...props, ...translations },
  };
};

export default Block;
