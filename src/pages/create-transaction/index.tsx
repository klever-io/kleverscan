import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import api from '@/services/api';

import { Container, Header, Title } from '@/views/assets';

import { ArrowLeft } from '@/assets/icons';
import { Transactions as Icon } from '@/assets/title-icons';
import { ICollectionList } from '@/types/index';
import Contract from '@/components/Contract';

import { IProposalsResponse } from '@/types/proposals';

interface IContract {
  assets?: any;
  proposals?: any;
}

const CreateTransaction: React.FC<IContract> = ({ proposals }) => {
  const [assets, setAssets] = useState<any>({});
  const [assetsList, setAssetsLists] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const getAssets = async () => {
      if (sessionStorage.getItem('walletAddress')) {
        const account: any = await api.get({
          route: `address/${sessionStorage.getItem('walletAddress')}`,
        });

        if (account?.data?.account?.assets) {
          const { assets, frozenBalance, balance } = account?.data?.account;
          const list: ICollectionList[] = [];
          if (Object.keys(assets).length === 0 && balance !== 0) {
            list.push({
              label: 'KLV',
              value: 'KLV',
              isNFT: false,
              balance,
              frozenBalance: frozenBalance ? frozenBalance : 0,
              precision: 6,
            });
          } else {
            Object.keys(account.data.account.assets).map(item => {
              const { assetType, frozenBalance, balance, precision } =
                account.data.account.assets[item];
              list.push({
                label: item,
                value: item,
                isNFT: assetType === 1,
                balance,
                frozenBalance,
                precision,
              });
            });
            setAssets(account.data.account.assets);
          }
          setAssetsLists(list);
        }
      }
    };

    getAssets();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('walletAddress')) {
        router.push('/');
      }
    }
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>Create Transaction</h1>
          <Icon />
        </Title>
      </Header>

      <Contract assetsList={assetsList} proposalsList={proposals} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const proposalResponse: IProposalsResponse = await api.get({
    route: 'proposals/list',
  });

  const proposals: any = [];

  const descriptionProposal = (item: any) => {
    if (item.description !== '') {
      if (item.description.length < 40) {
        return `${item.proposalId}: ${item.description}`;
      }
      return `${item.proposalId}: ${item.description.substring(0, 40)}...`;
    }

    return String(item.proposalId);
  };

  proposalResponse?.data?.proposals.forEach((item: any) => {
    proposals.push({
      label: descriptionProposal(item),
      value: item.proposalId,
    });
  });

  proposals.sort((a: any, b: any) => (a.value > b.value ? 1 : -1));

  const props: any = {
    proposals: proposals,
  };

  return { props };
};

export default CreateTransaction;
