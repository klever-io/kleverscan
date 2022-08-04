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
import { doIf } from '@/utils/index';
import { toast } from 'react-toastify';

interface IContract {
  assets?: any;
  proposals?: any;
}

const CreateTransaction: React.FC<IContract> = ({ proposals }) => {
  const [assetsList, setAssetsLists] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const getAssets = async () => {
      if (typeof window !== 'undefined') {
        const callback = async () => {
          let address = '';

          console.log(window?.kleverWeb?.getWalletAddress !== undefined);

          await doIf(
            () => (address = window.kleverWeb.getWalletAddress()),
            () => handleLogout(),
            () => window?.kleverWeb?.getWalletAddress !== undefined,
            500,
          );

          if (address) {
            const account: any = await api.get({
              route: `address/${address}`,
            });

            if (account?.data?.account?.assets) {
              const { assets, frozenBalance, balance } = account?.data?.account;
              const list: ICollectionList[] = [];

              Object.keys(account.data.account.assets).map(item => {
                const {
                  assetType,
                  frozenBalance,
                  balance,
                  precision,
                  buckets,
                } = account.data.account.assets[item];
                list.push({
                  label: item,
                  value: item,
                  isNFT: assetType === 1,
                  balance,
                  frozenBalance,
                  precision,
                  buckets,
                });
              });

              if (!Object.keys(assets).includes('KLV') && balance !== 0) {
                list.unshift({
                  label: 'KLV',
                  value: 'KLV',
                  isNFT: false,
                  balance,
                  frozenBalance: frozenBalance ? frozenBalance : 0,
                  precision: 6,
                  buckets: [],
                });
              }

              setAssetsLists(list);
            }
          }
        };

        doIf(
          async () => await callback(),
          () => handleLogout(),
          () => window.kleverWeb !== undefined,
          500,
        );
      }
    };

    getAssets();
  }, []);

  const handleLogout = () => {
    if (router.pathname.includes('/create-transaction')) {
      toast.error('Please connect your wallet to create a transaction');
      router.push('/');
    }
  };

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

  proposalResponse?.data?.proposals
    .filter(proposal => proposal.proposalStatus === 'ActiveProposal')
    .forEach((item: any) => {
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
