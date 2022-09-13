import Table, { ITable } from '@/components/Table';
import { IAccountAsset, IAsset, IResponse } from '@/types/index';
import { formatAmount } from '@/utils/index';
import Link from 'next/link';
import React from 'react';

interface IAssets {
  assets: IAccountAsset[];
  address: string;
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

const Assets: React.FC<IAssets> = ({ assets, address }) => {
  const header = [
    'Token',
    'ID',
    'Token Type',
    'Precision',
    'Balance',
    'Frozen',
    '',
  ];

  const rowSections = (props: IAccountAsset): JSX.Element[] => {
    const { assetId, assetType, precision, balance, frozenBalance } = props;
    const ticker = assetId?.split('-')[0];
    return [
      <span key={ticker}>{ticker}</span>,
      <Link key={assetId} href={`/asset/${assetId}`}>
        {assetId}
      </Link>,
      <span key={assetType}>
        {assetType === 0 ? 'Fungible' : 'Non Fungible'}
      </span>,
      <strong key={precision}>{precision}</strong>,
      <strong key={balance}>
        {formatAmount(balance / 10 ** precision)} {ticker}
      </strong>,
      <strong key={frozenBalance}>
        {formatAmount(frozenBalance / 10 ** precision)} {ticker}
      </strong>,
      <span key={address}>
        {assetType === 1 && (
          <Link href={`/account/${address}/collection/${assetId}`}>
            View NFTs
          </Link>
        )}
      </span>,
    ];
  };

  const tableProps: ITable = {
    rowSections,
    columnSpans: [1, 1, 1, 1, 1, 1, 1],
    type: 'assets',
    header,
    data: assets,
  };

  return <Table {...tableProps} />;
};

export default Assets;
