import Assets from '@/components/Tabs/Assets';
import Buckets from '@/components/Tabs/Buckets';
import NftCollections from '@/components/Tabs/NftCollections';
import ProprietaryAssets from '@/components/Tabs/ProprietaryAssets';
import Rewards from '@/components/Tabs/Rewards';
import SCDeployedByAddress from '@/components/Tabs/SCDeployedByAddress';
import Transactions from '@/components/Tabs/Transactions';
import { useContractModal } from '@/contexts/contractModal';
import { requestTransactionsDefault } from '@/pages/transactions';
import {
  assetsRequest,
  bucketsRequest,
  getSCDeployedByAddress,
  nftCollectionsRequest,
  ownedAssetsRequest,
  rewardsFPRPool,
} from '@/services/requests/account';
import {
  IInnerTableProps,
  IPartialInnerTableProps,
  IResponse,
} from '@/types/index';
import { TFunction } from 'i18next';
import { useTranslation } from 'next-i18next';
import { NextRouter, useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';

const getRequest = (
  router: NextRouter,
  t: TFunction<[string, string], undefined>,
): ((page: number, limit: number) => Promise<IResponse | []>) => {
  const address = router.query.account as string;

  switch (router.query.tab) {
    case t('common:Titles.Assets'):
      return (page: number, limit: number) =>
        assetsRequest(address)(page, limit);
    case t('accounts:SingleAccount.Tabs.ProprietaryAssets'):
      return (page: number, limit: number) =>
        ownedAssetsRequest(address)(page, limit);
    case t('common:Titles.Transactions'):
      return (page: number, limit: number) =>
        requestTransactionsDefault(page, limit, router);
    case t('accounts:SingleAccount.Tabs.Buckets'):
      return (page: number, limit: number) =>
        bucketsRequest(address)(page, limit);
    case t('accounts:SingleAccount.Tabs.Rewards'):
      return (page: number, limit: number) =>
        rewardsFPRPool(address)(page, limit);
    case t('accounts:SingleAccount.Tabs.NFTCollections'):
      return (page: number, limit: number) =>
        nftCollectionsRequest(address)(page, limit);
    case t('accounts:SingleAccount.Tabs.SmartContracts'):
      return (page: number, limit: number) =>
        getSCDeployedByAddress(address, router.query)(page, limit);
    default:
      return (page: number, limit: number) =>
        assetsRequest(address)(page, limit);
  }
};

const assetsTableProps: IPartialInnerTableProps = {
  scrollUp: false,
  dataName: 'assets',
};

const proprietaryAssetsTableProps: IPartialInnerTableProps = {
  scrollUp: false,
  dataName: 'proprietaryAssets',
};

const transactionTableProps: IPartialInnerTableProps = {
  dataName: 'transactions',
};

const bucketsTableProps: IPartialInnerTableProps = {
  scrollUp: false,
  dataName: 'buckets',
};

const rewardsTableProps: IPartialInnerTableProps = {
  scrollUp: false,
  dataName: 'rewards',
};

const nftCollectionsTableProps: IPartialInnerTableProps = {
  scrollUp: false,
  dataName: 'assets',
};

const smartContractsTableProps: IPartialInnerTableProps = {
  scrollUp: false,
  dataName: 'sc',
};

interface ISelectedTabProps {
  showInteractionButtons: boolean;
}

export const EmptyComponent: React.FC<PropsWithChildren> = () => {
  return <></>;
};

const SelectedTabComponent: React.FC<PropsWithChildren<ISelectedTabProps>> = ({
  showInteractionButtons,
}) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'accounts']);
  const { getInteractionsButtons } = useContractModal();

  const [CreateAssetButton] = showInteractionButtons
    ? getInteractionsButtons([
        {
          title: t('accounts:SingleAccount.Buttons.CreateAsset'),
          contractType: 'CreateAssetContract',
        },
      ])
    : Array.from({ length: 1 }, () => EmptyComponent);

  const Filters = showInteractionButtons ? CreateAssetButton : undefined;

  switch (router?.query?.tab || t('common:Titles.Assets')) {
    case t('common:Titles.Assets'):
      return (
        <Assets
          assetsTableProps={
            {
              ...assetsTableProps,
              request: getRequest(router, t),
              query: router.query,
            } as IInnerTableProps
          }
          address={router.query.account as string}
          showInteractionButtons={showInteractionButtons}
          Filters={Filters}
        />
      );

    case t('accounts:SingleAccount.Tabs.ProprietaryAssets'):
      return (
        <ProprietaryAssets
          assetsTableProps={
            {
              ...proprietaryAssetsTableProps,
              request: getRequest(router, t),
              query: router.query,
            } as IInnerTableProps
          }
          address={router.query.account as string}
          showInteractionButtons={showInteractionButtons}
          Filters={Filters}
        />
      );
    case t('common:Titles.Transactions'):
      return (
        <Transactions
          transactionsTableProps={
            {
              ...transactionTableProps,
              request: getRequest(router, t),
              query: router.query,
            } as IInnerTableProps
          }
        />
      );
    case t('accounts:SingleAccount.Tabs.Buckets'):
      return (
        <Buckets
          bucketsTableProps={
            {
              ...bucketsTableProps,
              request: getRequest(router, t),
              query: router.query,
            } as IInnerTableProps
          }
          showInteractionButtons={showInteractionButtons}
        />
      );
    case t('accounts:SingleAccount.Tabs.Rewards'):
      return (
        <Rewards
          rewardsTableProps={
            {
              ...rewardsTableProps,
              request: getRequest(router, t),
              query: router.query,
            } as IInnerTableProps
          }
        />
      );
    case t('accounts:SingleAccount.Tabs.NFTCollections'):
      return (
        <NftCollections
          nftCollectionsTableProps={
            {
              ...nftCollectionsTableProps,
              request: getRequest(router, t),
              query: router.query,
            } as IInnerTableProps
          }
          address={router.query.account as string}
        />
      );
    case t('accounts:SingleAccount.Tabs.SmartContracts'):
      return (
        <SCDeployedByAddress
          smartContractsTableProps={
            {
              ...smartContractsTableProps,
              request: getRequest(router, t),
              query: {
                ...router.query,
                deployer: router.query.account as string,
              },
            } as IInnerTableProps
          }
          address={router.query.account as string}
        />
      );
    default:
      return <div />;
  }
};

export default SelectedTabComponent;
