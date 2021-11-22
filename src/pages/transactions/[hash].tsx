import React from 'react';

import {
  IResponse,
  ITransaction,
  IAsset,
  Contract,
  ITransferContract,
  ICreateAssetContract,
} from '@/types/index';
import { GetServerSideProps } from 'next';
import api from '@/services/api';

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

const Transaction: React.FC<ITransactionPage> = () => {
  return <div />;
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
