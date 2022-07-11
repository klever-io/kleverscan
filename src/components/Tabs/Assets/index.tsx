import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import { IAccountAsset, IAsset, IResponse } from '@/types/index';
import { formatAmount } from '@/utils/index';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface IAssets {
  assets: IAccountAsset[];
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

const Assets: React.FC<IAssets> = ({ assets }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      setLoading(false);
    };

    fetchData();
  }, []);

  const header = [
    'Token',
    'ID',
    'Token Type',
    'Precision',
    'Balance',
    'Frozen',
  ];

  const TableBody: React.FC<IAccountAsset> = ({
    assetId,
    assetType,
    precision,
    balance,
    frozenBalance,
  }) => {
    const ticker = assetId?.split('-')[0];
    return (
      <Row type="assets">
        <span>
          <span>{ticker}</span>
        </span>
        <span>
          <Link href={`/asset/${assetId}`}>{assetId}</Link>
        </span>
        <span>{assetType === 0 ? 'Fungible' : 'Non Fungible'}</span>
        <span>
          <strong>{precision}</strong>
        </span>
        <span>
          <strong>
            {formatAmount(balance / 10 ** precision)} {ticker}
          </strong>
        </span>
        <span>
          <strong>
            {formatAmount(frozenBalance / 10 ** precision)} {ticker}
          </strong>
        </span>
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'assets',
    header,
    data: assets,
    body: TableBody,
    loading,
  };

  return <Table {...tableProps} />;
};

export default Assets;
