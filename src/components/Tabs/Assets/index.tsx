import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IAsset, IResponse } from '@/types/index';
import api from '@/services/api';
import { formatAmount } from '@/utils/index';

interface IAssets {
  [key: string]: {
    balance: number;
    frozenBalance: number;
  };
}

interface IAssetData extends IAsset {
  balance: number;
  frozenBalance: number;
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

const Assets: React.FC<IAssets> = props => {
  const assetData = Object.values(props).map((item, index) => ({
    tokenId: Object.keys(props)[index],
    ...item,
  }));

  const [data, setData] = useState<IAssetData[]>([] as IAssetData[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const lastData: IAssetData[] = [];

      for (let i = 0; i < assetData.length; i++) {
        // need old loop struct to save with async/await
        if (assetData[i].tokenId !== '') {
          const response: IAssetResponse = await api.get({
            route: `assets/${assetData[i].tokenId}`,
          });
          if (!response.error) {
            console.log(response.data);

            lastData.push({ ...response.data.asset, ...assetData[i] });
          }
        }
      }

      setData(lastData);

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

  const TableBody: React.FC<IAssetData> = ({
    ticker,
    assetId,
    type,
    precision,
    balance,
    frozenBalance,
  }) => {
    return (
      <Row type="assets">
        <span>
          <span>{ticker}</span>
        </span>
        <span>
          <Link href={`/asset/${assetId}`}>{assetId}</Link>
        </span>
        <span>{type}</span>
        <span>
          <strong>{precision}</strong>
        </span>
        <span>
          <strong>{formatAmount(balance / 10 ** precision)} KLV</strong>
        </span>
        <span>
          <strong>{formatAmount(frozenBalance)} KLV</strong>
        </span>
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'assets',
    header,
    data,
    body: TableBody,
    loading,
  };

  return <Table {...tableProps} />;
};

export default Assets;
