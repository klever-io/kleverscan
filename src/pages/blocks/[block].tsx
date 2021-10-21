import React from 'react';

import { GetStaticProps } from 'next';

import Detail, { ITab, ITabData } from '../../components/Layout/Detail';

import api from '../../services/api';
import { IBlock, IResponse } from '../../types';

import { navbarItems } from '../../configs/navbar';

interface IBlockResponse extends IResponse {
  data: {
    block: IBlock;
  };
}

const Block: React.FC<IBlock> = props => {
  const overviewData: ITabData[] = [
    { name: 'Nonce', info: props.nonce },
    { name: 'Slot', info: props.slot },
    { name: 'Epoch', info: props.epoch },
    { name: 'Size', info: props.size },
    { name: 'Size TXs', info: props.sizeTxs },
    { name: 'TX Count', info: props.txCount },
    { name: 'Producer Public Key', info: props.ProducerPublicKey },
    { name: 'Producer Signature', info: props.producerSignature },
    { name: 'Software Version', info: props.softwareVersion },
    { name: 'Chain ID', info: props.chainID },
  ];
  const transactionData: ITabData[] = props.transactions.map(transaction => ({
    name: 'Transaction',
    info: transaction.hash,
    linked: `/transactions/${transaction.hash}`,
  }));
  const hashesData: ITabData[] = [
    { name: 'Parent Hash', info: props.parentHash },
    { name: 'TX Root Hash', info: props.txRootHash },
    { name: 'Trie Root', info: props.trieRoot },
    { name: 'Validators Trie Root', info: props.validatorsTrieRoot },
    { name: 'Asset Trie Root', info: props.assetTrieRoot },
    { name: 'Previous Random Seed', info: props.prevRandSeed },
    { name: 'Random Seed', info: props.randSeed },
  ];

  const title = 'Block Details';
  const tabs: ITab[] = [
    { title: 'Overview', data: overviewData },
    { title: 'Transactions', data: transactionData },
    { title: 'Block Info', data: hashesData },
  ];
  const Icon = navbarItems.find(item => item.name === 'Blocks')?.Icon;

  const detailProps = { title, tabs, Icon };

  return <Detail {...detailProps} />;
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
