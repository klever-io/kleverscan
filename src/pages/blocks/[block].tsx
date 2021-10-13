import React, { Fragment, useEffect, useState } from 'react';

import { GetStaticProps } from 'next';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Container,
  Content,
  Divider,
  Header,
  HeaderIcon,
  Indicator,
  Info,
  Tab,
  TabContainer,
} from '../../views/blocks';

import Input from '../../components/Input';

import api from '../../services/api';
import { IHyperblock, IResponse } from '../../types';

import { FaLaravel } from 'react-icons/fa';

interface IHyperblockResponse extends IResponse {
  data: {
    hyperblock: IHyperblock;
  };
}

interface ITab {
  title: string;
  data: {
    name: string;
    info: string | number;
    linked?: string;
  }[];
}

const Block: React.FC<IHyperblock> = props => {
  const overviewData = [
    { name: 'Nonce', info: props.nonce },
    { name: 'Slot', info: props.slot },
    { name: 'Epoch', info: props.epoch },
    { name: 'Size', info: props.size },
    { name: 'Size TXs', info: props.sizeTxs },
    { name: 'TX Count', info: props.txCount },
    { name: 'Producer ID', info: props.producerID },
    { name: 'Producer Public Key', info: props.ProducerPublicKey },
    { name: 'Producer Signature', info: props.producerSignature },
    { name: 'Software Version', info: props.softwareVersion },
    { name: 'Chain ID', info: props.chainID },
  ];
  const transactionData = props.transactions.map(transaction => ({
    name: 'Transaction',
    info: transaction.hash,
    linked: `/transactions/${transaction.hash}`,
  }));
  const hashesData = [
    { name: 'Parent Hash', info: props.parentHash },
    { name: 'TX Root Hash', info: props.txRootHash },
    { name: 'Trie Root', info: props.trieRoot },
    { name: 'Validators Trie Root', info: props.validatorsTrieRoot },
    { name: 'Staking Trie Root', info: props.stakingTrieRoot },
    { name: 'Asset Trie Root', info: props.assetTrieRoot },
    { name: 'Previous Random Seed', info: props.prevRandSeed },
    { name: 'Random Seed', info: props.randSeed },
  ];

  const tabs: ITab[] = [
    { title: 'Overview', data: overviewData },
    { title: 'Transactions', data: transactionData },
    { title: 'Hashes', data: hashesData },
  ];
  const title = 'Block Details';

  const [selectedTab, setSelectedTab] = useState<ITab>(tabs[0]);

  useEffect(() => {
    const tab = document.getElementById(
      `tab-${selectedTab.title.toLowerCase()}`,
    );
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

  const handleCopyInfo = (info: string, data: string | number) => {
    const toastProps = {
      autoClose: 2000,
      pauseOnHover: false,
      closeOnClick: true,
    };

    navigator.clipboard.writeText(String(data));
    toast.info(`${info} copied to clipboard`, toastProps);
  };

  return (
    <Container>
      <ToastContainer />

      <Input />
      <Header>
        <HeaderIcon>
          <FaLaravel />
        </HeaderIcon>
        <h3>{title}</h3>
      </Header>

      <Content>
        <TabContainer>
          <Indicator id="tab-indicator" />

          {renderTabs()}
        </TabContainer>
        {selectedTab.data.map((data, index) => {
          return (
            <Fragment key={String(index)}>
              <Info>
                <span>{data.name}</span>
                {data.linked ? (
                  <Link href={data.linked}>{data.info}</Link>
                ) : (
                  <p onClick={() => handleCopyInfo(data.name, data.info)}>
                    {data.info}
                  </p>
                )}
              </Info>

              {index + 1 !== selectedTab.data.length && <Divider />}
            </Fragment>
          );
        })}
      </Content>
    </Container>
  );
};

export const getServerSideProps: GetStaticProps<IHyperblock> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const blockNonce = Number(params?.block);

  if (!blockNonce || isNaN(blockNonce)) {
    return redirectProps;
  }

  const hyperblock: IHyperblockResponse = await api.get({
    route: `hyperblock/by-nonce/${blockNonce}`,
  });

  if (hyperblock.error) {
    return redirectProps;
  }

  const props: IHyperblock = hyperblock.data.hyperblock;

  return { props };
};

export default Block;
