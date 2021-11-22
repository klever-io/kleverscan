import React from 'react';

import { GetServerSideProps } from 'next';
import { format, fromUnixTime } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';

import {
  ITransaction,
  IResponse,
  Contract,
  ITransferContract,
  ICreateAssetContract,
  ICreateAssetReceipt,
  IFreezeReceipt,
  IUnfreezeReceipt,
  ICreateValidatorContract,
  IFreezeContract,
  IUnfreezeContract,
  IWithdrawContract,
  IAsset,
} from '../../types';

import Detail, { ITab, ITabData } from '../../components/Layout/Detail';

import api from '../../services/api';
import { navbarItems } from '../../configs/navbar';

interface ITransactionResponse extends IResponse {
  data: {
    transaction: ITransaction;
  };
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

interface ITransactionPage extends ITransaction {
  precision: number;
}

const Transaction: React.FC<ITransactionPage> = props => {
  const getContractTypeName = (type: Contract) => Object.values(Contract)[type];

  const getContract = (): ITabData[] => {
    const { contract: contracts } = props;
    const contract = contracts[0];

    if (contracts.length <= 0) {
      return [] as ITabData[];
    }

    switch (getContractTypeName(contract.type)) {
      case Contract.Transfer:
        const transferParam = contract.parameter as ITransferContract;

        return [
          { name: 'Contract', info: getContractTypeName(contract.type) },
          {
            name: 'From',
            info: transferParam.ownerAddress,
            linked: `/accounts/${transferParam.ownerAddress}`,
          },
          {
            name: 'To',
            info: transferParam.toAddress,
            linked: `/accounts/${transferParam.toAddress}`,
          },
          { name: 'Amount', info: transferParam.amount.toLocaleString() },
          ...(!!transferParam.assetAddress
            ? [
                {
                  name: 'Asset Address',
                  info: transferParam.assetAddress,
                  linked: `/assets/${transferParam.assetAddress}`,
                },
              ]
            : []),
        ];

      case Contract.CreateAsset:
        const createAssetParam = contract.parameter as ICreateAssetContract;

        return [
          { name: 'Contract', info: getContractTypeName(contract.type) },
          { name: 'Name', info: createAssetParam.name },
          {
            name: 'Owner Address',
            info: createAssetParam.ownerAddress,
            linked: `/accounts/${createAssetParam.ownerAddress}`,
          },
          { name: 'Token', info: createAssetParam.ticker },
          { name: 'Precision', info: createAssetParam.precision },
          {
            name: 'Circulating Supply',
            info: (
              createAssetParam.circulatingSupply /
              10 ** props.precision
            ).toFixed(props.precision),
          },
          {
            name: 'Initial Supply',
            info: (
              createAssetParam.initialSupply /
              10 ** props.precision
            ).toFixed(props.precision),
          },
          {
            name: 'Max Supply',
            info: (createAssetParam.maxSupply / 10 ** props.precision).toFixed(
              props.precision,
            ),
          },
        ];

      case Contract.CreateValidator:
      case Contract.ValidatorConfig:
        const validatorParam = contract.parameter as ICreateValidatorContract;

        return [
          { name: 'Contract', info: getContractTypeName(contract.type) },
          {
            name: 'Owner Address',
            info: validatorParam.ownerAddress,
            linked: `/accounts/${validatorParam.ownerAddress}`,
          },
          {
            name: 'Can Delegate',
            info: validatorParam.config.canDelegate ? 'True' : 'False',
          },
          { name: 'Comission', info: validatorParam.config.commission },
          {
            name: 'Max Delegation Amount',
            info: (
              validatorParam.config.maxDelegationAmount /
              10 ** props.precision
            ).toFixed(props.precision),
          },
          {
            name: 'Reward address',
            info: validatorParam.config.rewardAddress,
            linked: `/accounts/${validatorParam.config.rewardAddress}`,
          },
        ];

      case Contract.Freeze:
        const freezeParam = contract.parameter as IFreezeContract;

        return [
          { name: 'Contract', info: getContractTypeName(contract.type) },
          {
            name: 'Owner Address',
            info: freezeParam.ownerAddress,
            linked: `/accounts/${freezeParam.ownerAddress}`,
          },
          { name: 'Amount', info: freezeParam.amount.toLocaleString() },
        ];

      case Contract.Unfreeze:
      case Contract.Delegate:
      case Contract.Undelegate:
        const params = contract.parameter as IUnfreezeContract;

        return [
          { name: 'Contract', info: getContractTypeName(contract.type) },
          {
            name: 'Owner Address',
            info: params.ownerAddress,
            linked: `/accounts/${params.ownerAddress}`,
          },
          { name: 'Bucket ID', info: params.bucketID },
        ];

      case Contract.Withdraw:
        const withDrawParams = contract.parameter as IWithdrawContract;

        return [
          { name: 'Contract', info: getContractTypeName(contract.type) },
          {
            name: 'Owner Address',
            info: withDrawParams.ownerAddress,
            linked: `/accounts/${withDrawParams.ownerAddress}`,
          },
          {
            name: 'To Address',
            info: withDrawParams.toAddress,
            linked: `/accounts/${withDrawParams.toAddress}`,
          },
        ];

      default:
        return [] as ITabData[];
    }
  };

  const getReceipt = (): ITabData[] => {
    const { contract: contracts, receipt: receipts } = props;

    if (
      !contracts ||
      contracts.length <= 0 ||
      !receipts ||
      receipts.length <= 0
    ) {
      return [] as ITabData[];
    }

    const contract = contracts[0];
    const receipt = receipts[0];

    switch (getContractTypeName(contract.type)) {
      case Contract.CreateAsset:
        const createAssetReceipt = receipt as ICreateAssetReceipt;

        return [
          {
            name: 'Asset ID',
            info: createAssetReceipt.assetId,
            linked: `/assets/${createAssetReceipt.assetId}`,
          },
        ];

      case Contract.Freeze:
        const freezeReceipt = receipt as IFreezeReceipt;

        return [{ name: 'Bucket ID', info: freezeReceipt.bucketId }];

      case Contract.Unfreeze:
        const unfreezeReceipt = receipt as IUnfreezeReceipt;

        return [
          {
            name: 'Avaliable Withdraw Epoch',
            info: unfreezeReceipt.availableWithdrawEpoch,
          },
        ];

      default:
        return [] as ITabData[];
    }
  };

  const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const overviewData: ITabData[] = [
    { name: 'Hash', info: props.hash },
    { name: 'Status', info: props.status ? capitalize(props.status) : '- -' },
    { name: 'Block Number', info: props.blockNum },
    { name: 'Sender', info: props.sender, linked: `/accounts/${props.sender}` },
    {
      name: 'Timestamp',
      info: format(fromUnixTime(props.timestamp / 1000), 'dd/MM/yyyy HH:mm'),
    },
    { name: 'Signature', info: props.signature },
    {
      name: 'Kapp Fee',
      info: (props.kAppFee / 10 ** props.precision).toFixed(props.precision),
    },
    {
      name: 'Bandwith Fee',
      info: (props.bandwidthFee / 10 ** props.precision).toFixed(
        props.precision,
      ),
    },
  ];

  const contractData = getContract();
  const receiptData = getReceipt();

  const title = 'Transaction Details';
  const tabs: ITab[] = [
    { title: 'Overview', data: overviewData },
    { title: 'Contract', data: contractData },
    ...(receiptData.length > 0
      ? [{ title: 'Receipt', data: receiptData }]
      : []),
  ];
  const Icon = navbarItems.find(item => item.name === 'Transactions')?.Icon;

  const detailProps = { title, tabs, Icon };

  return <Detail {...detailProps} />;
};

export const getServerSideProps: GetServerSideProps<ITransactionPage> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const hash = params?.hash;
  if (!hash) {
    return redirectProps;
  }

  const transaction: ITransactionResponse = await api.get({
    route: `transaction/${hash}`,
  });
  if (transaction.error) {
    return redirectProps;
  }

  let precision = 6; // Default KLV precision
  const contractType =
    Object.values(Contract)[transaction.data.transaction.contract[0].type];

  if (contractType === Contract.Transfer) {
    const contract = transaction.data.transaction.contract[0]
      .parameter as ITransferContract;

    if (contract.assetAddress) {
      const asset: IAssetResponse = await api.get({
        route: `assets/${contract.assetAddress}`,
      });
      if (!asset.error) {
        precision = asset.data.asset.precision;
      }
    }
  } else if (contractType === Contract.CreateAsset) {
    const contract = transaction.data.transaction.contract[0]
      .parameter as ICreateAssetContract;

    precision = contract.precision;
  }

  const props: ITransactionPage = {
    ...transaction.data.transaction,
    precision,
  };

  return { props };
};

export default Transaction;
