import { useExtension } from '@/contexts/extension';
import api from '@/services/api';
import { IAccountAsset, IAssetResponse, ICollectionList } from '@/types';
import { useDidUpdateEffect } from '@/utils/hooks';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Contract from '..';
import { Container, Content, TitleContent } from './styles';

interface IModalContract {
  title: string;
  contractType: string;
  setContractType: React.Dispatch<React.SetStateAction<string>>;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  assetTriggerSelected?: IAccountAsset;
  setAssetTriggerSelected: React.Dispatch<
    React.SetStateAction<IAccountAsset | undefined>
  >;
  stakingRewards: number;
  setStakingRewards: React.Dispatch<React.SetStateAction<number>>;
  valueContract: any;
  setValueContract: React.Dispatch<any>;
}

const ModalContract: React.FC<IModalContract> = ({
  title,
  contractType,
  openModal,
  setOpenModal,
  assetTriggerSelected,
  setContractType,
  setAssetTriggerSelected,
  stakingRewards,
  setStakingRewards,
  valueContract,
  setValueContract,
}) => {
  const [assetsList, setAssetsLists] = useState<ICollectionList[]>([]);
  const [kassetsList, setKAssetsList] = useState<ICollectionList[]>([]);
  const { extensionInstalled, connectExtension } = useExtension();
  const stakingRewardsType = {
    0: { label: 'Staking Claim (0)', value: 0 },
    1: { label: 'Allowance Claim (1)', value: 1 },
    2: { label: 'Market Claim (2)', value: 2 },
  };
  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const getKAssets = async (address: string) => {
    const response: IAssetResponse = await api.get({
      route: `assets/kassets`,
      query: {
        owner: address,
        limit: 10000,
      },
    });
    if (response.error) return;

    const list: ICollectionList[] = [];

    if (response?.data?.assets?.length > 0) {
      response.data.assets.forEach(item => {
        list.push({
          ...item,
          label: item.assetId,
          value: item.assetId,
          isNFT: item.assetType !== 'Fungible',
        });
      });

      setKAssetsList([...list]);
    }
  };

  const getAssets = async () => {
    if (typeof window !== 'undefined') {
      const address = sessionStorage.getItem('walletAddress') || '';

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

  useEffect(() => {
    document.body.style.overflow = openModal ? 'hidden' : 'visible';
  }, [openModal]);

  const closeModal = () => {
    setOpenModal(false);
    setContractType('');
    setAssetTriggerSelected({} as IAccountAsset);
    setStakingRewards(0);
    setValueContract([]);
  };

  return (
    <Container onMouseDown={closeModal} openModal={openModal}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <TitleContent>
          <h1>{title}</h1>
          <AiOutlineClose onClick={closeModal} cursor={'pointer'} />
        </TitleContent>
        <Contract
          isModal={true}
          assetsList={assetsList}
          proposalsList={[]}
          paramsList={[]}
          getAssets={getAssets}
          kAssets={kassetsList}
          modalContractType={{ value: contractType }}
          assetTriggerSelected={assetTriggerSelected}
          claimSelectedType={stakingRewardsType[stakingRewards]}
          openModal={openModal}
          valueContract={valueContract}
        />
      </Content>
    </Container>
  );
};

export default ModalContract;
