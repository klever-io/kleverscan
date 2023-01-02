import { WarningIcon } from '@/assets/calendar';
import { Transactions as Icon } from '@/assets/title-icons';
import Contract from '@/components/Contract';
import Title from '@/components/Layout/Title';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import { useExtension } from '@/contexts/extension';
import api from '@/services/api';
import { ICollectionList, IKAssets, IParamList } from '@/types/index';
import { INetworkParam, IProposalsResponse } from '@/types/proposals';
import { useDidUpdateEffect } from '@/utils/hooks';
import { Header } from '@/views/assets';
import { Card } from '@/views/blocks';
import {
  CardContainer,
  Container,
  WarningContainer,
  WarningText,
} from '@/views/create-transaction';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IContract {
  assets?: any;
  proposals?: any;
  paramsList?: any;
}

const CreateTransaction: React.FC<IContract> = ({ proposals, paramsList }) => {
  const [assetsList, setAssetsLists] = useState<ICollectionList[]>([]);
  const [kassetsList, setKAssetsList] = useState<IKAssets[]>([]);
  const router = useRouter();

  const { extensionInstalled, connectExtension, logoutExtension } =
    useExtension();

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const getKAssets = async (address: string) => {
    const response: any = await api.get({
      route: `assets/kassets`,
      query: {
        owner: address,
        limit: 10000,
      },
    });
    if (response.error) return;

    const list: IKAssets[] = [];

    if (response?.data?.assets?.length > 0) {
      response.data.assets.forEach((item: any) => {
        list.push({
          label: item.assetId,
          value: item.assetId,
          properties: item.properties,
          isNFT: item.assetType !== 'Fungible',
          isPaused: item.attributes.isPaused,
        });
      });

      setKAssetsList([...list]);
    }
  };

  const getAssets = async () => {
    if (typeof window !== 'undefined') {
      const address = sessionStorage.getItem('walletAddress') || '';

      if (address === '') {
        logoutExtension();
        toast.error('Please connect your wallet to create a transaction');
        router.push('/');
        return;
      }

      getKAssets(address);

      const account: any = await api.get({
        route: `address/${address}`,
      });

      if (
        !account?.data?.account?.assets &&
        account?.data?.account?.balance === 0
      ) {
        setAssetsLists([]);
        return;
      }

      const accountData = account?.data?.account
        ? account.data.account
        : {
            assets: [],
            frozenBalance: 0,
            balance: 0,
          };

      const { assets, frozenBalance, balance } = accountData;
      const list: ICollectionList[] = [];
      const addAssetsInfo = Object.keys(assets).map(async item => {
        const assetInfo: any = await api.get({
          route: `assets/${item}`,
        });

        const minEpochsToWithdraw =
          assetInfo.data?.asset?.staking?.minEpochsToWithdraw;
        const ownerAddress = assetInfo.data?.asset?.ownerAddress;
        const { assetType, frozenBalance, balance, precision, buckets } =
          account.data.account.assets[item];

        list.push({
          label: item,
          value: item,
          isNFT: assetType === 1,
          balance,
          frozenBalance,
          precision,
          buckets,
          minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
          ownerAddress,
        });
      });

      await Promise.all(addAssetsInfo);

      if (!Object.keys(assets).includes('KLV') && balance !== 0) {
        const assetInfo: any = await api.get({
          route: `assets/KLV`,
        });

        const minEpochsToWithdraw =
          assetInfo.data?.asset?.staking?.minEpochsToWithdraw;

        list.push({
          label: 'KLV',
          value: 'KLV',
          isNFT: false,
          balance,
          frozenBalance: frozenBalance ? frozenBalance : 0,
          precision: 6,
          buckets: [],
          minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
        });
      }
      list.sort((a, b) => (a.label > b.label ? 1 : -1));

      const KLV = list.splice(
        list.indexOf(
          list.find(item => item.label === 'KLV') as ICollectionList,
        ),
        1,
      );

      const KFI = list.splice(
        list.indexOf(
          list.find(item => item.label === 'KFI') as ICollectionList,
        ),
        1,
      );

      setAssetsLists([...KLV, ...KFI, ...list]);
    }
  };

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <Container>
      {!assetsList.find(
        (item: ICollectionList) => item.label === 'KLV' && item.balance > 0,
      ) && (
        <WarningContainer>
          <WarningIcon />
          <WarningText>
            Your KLV balance{' '}
            {process.env.DEFAULT_API_HOST?.includes('testnet') && '(testnet)'}{' '}
            {process.env.DEFAULT_API_HOST?.includes('devnet') && '(devnet)'} is
            zero. You can preview the transaction, but you will not be able to
            send it.
          </WarningText>
        </WarningContainer>
      )}
      <Header>
        <Title Icon={Icon} title={'Create Transaction'} />
      </Header>

      <CardContainer>
        <Card>
          <div>
            <span>
              Select a contract type, fill in the form fields and click on the
              &quot;Create Transaction&quot; button. A Klever Extension window
              will appear and you will fill in your wallet password. At the end,
              the hash of your transaction will be generated. You can view your
              transaction details on the{' '}
              <a href="https://kleverscan.org/transactions/">Transactions</a>{' '}
              page.
            </span>
          </div>
        </Card>
      </CardContainer>

      <Contract
        assetsList={assetsList}
        proposalsList={proposals}
        paramsList={paramsList}
        getAssets={getAssets}
        kAssets={kassetsList}
      />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const proposalResponse: IProposalsResponse = await api.get({
    route: 'proposals/list',
  });

  const { data } = await api.get({ route: 'network/network-parameters' });

  let networkParams = {} as INetworkParam[];
  const paramsList = [] as IParamList[];

  if (data) {
    networkParams = Object.keys(proposalsMessages).map((key, index) => {
      return {
        number: index,
        parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
        currentValue: data.parameters[key].value,
      };
    });
  }

  networkParams.length &&
    networkParams?.forEach((param: INetworkParam) => {
      paramsList.push({
        value: param.number,
        label: `${param.parameter}: ${param.currentValue}`,
        currentValue: param.currentValue,
      });
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
    paramsList: paramsList,
  };

  return { props };
};

export default CreateTransaction;
