import React, { useState } from 'react';

import { GetStaticProps } from 'next';
import Link from 'next/link';

import List, { IList } from '../../components/Layout/List';

import { IAsset, IPagination, IResponse } from '../../types';

import api from '../../services/api';
import { navbarItems } from '../../configs/navbar';

interface IAssetPage {
  assets: IAsset[];
  pagination: IPagination;
}

interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
  pagination: IPagination;
}

const Blocks: React.FC<IAssetPage> = ({
  assets: initialAssets,
  pagination,
}) => {
  const title = 'Assets';
  const Icon = navbarItems.find(item => item.name === 'Assets')?.Icon;
  const maxItems = pagination.totalRecords;
  const headers = ['Ticker', 'Name', 'Address', 'Type', 'Owner'];

  const [assets, setAssets] = useState<IAsset[]>(initialAssets);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    const newAssets: IAssetResponse = await api.get({
      route: 'assets/kassets',
      query: { page },
    });
    if (!newAssets.error) {
      setAssets([...assets, ...newAssets.data.assets]);

      const next = newAssets.pagination.next;
      if (next !== 0) {
        setPage(next);
      }
    }
  };

  const listProps: IList = {
    title,
    Icon,
    maxItems,
    listSize: assets.length,
    headers,
    loadMore,
  };

  const renderItems = () =>
    assets.map((asset, index) => {
      return (
        <tr key={String(index)}>
          <td>{asset.ticker}</td>
          <td>{asset.name}</td>
          <td>
            <span>
              <Link href={`/assets/${asset.address}`}>{asset.address}</Link>
            </span>
          </td>
          <td>{asset.type}</td>
          <td>
            <span>
              <Link href={`/accounts/${asset.ownerAddress}`}>
                {asset.ownerAddress}
              </Link>
            </span>
          </td>
        </tr>
      );
    });

  return <List {...listProps}>{renderItems()}</List>;
};

export const getStaticProps: GetStaticProps<IAssetPage> = async () => {
  const props: IAssetPage = { assets: [], pagination: {} as IPagination };

  const assets: IAssetResponse = await api.get({
    route: 'assets/kassets',
  });
  if (!assets.error) {
    props.assets = assets.data.assets;
    props.pagination = assets.pagination;
  }

  return { props };
};

export default Blocks;
