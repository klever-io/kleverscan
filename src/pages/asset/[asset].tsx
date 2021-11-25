import React from 'react';
import { GetStaticProps } from 'next';

import Detail, { ITab, ITabData } from '../../components/Layout/Detail';

import api from '../../services/api';
import { IAsset, IResponse } from '../../types';

import { navbarItems } from '../../configs/navbar';

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

const Asset: React.FC<IAsset> = props => {
  const overviewData: ITabData[] = [
    { name: 'Type', info: props.type },
    { name: 'Address', info: props.address },
    { name: 'Name', info: props.name },
    { name: 'Ticker', info: props.ticker },
    {
      name: 'Owner Address',
      info: props.ownerAddress,
      linked: `/accounts/${props.ownerAddress}`,
    },
  ];
  const assetInfoData: ITabData[] = [
    { name: 'Uris', info: props.uris },
    { name: 'Precision', info: props.precision },
    {
      name: 'Initial Supply',
      info: (props.initialSupply / 10 ** props.precision).toFixed(
        props.precision,
      ),
    },
    {
      name: 'Circulating Supply',
      info: (props.circulatingSupply / 10 ** props.precision).toFixed(
        props.precision,
      ),
    },
    {
      name: 'Max Supply',
      info: (props.maxSupply / 10 ** props.precision).toFixed(props.precision),
    },
    { name: 'Royalties', info: props.royalties },
  ];

  const title = 'Asset Detail';
  const tabs: ITab[] = [
    { title: 'Overview', data: overviewData },
    { title: 'Asset Info', data: assetInfoData },
  ];
  const Icon = navbarItems.find(item => item.name === 'Assets')?.Icon;

  const detailProps = { title, tabs, Icon };

  return <Detail {...detailProps} />;
};

export const getServerSideProps: GetStaticProps<IAsset> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const address = params?.asset;

  const asset: IAssetResponse = await api.get({ route: `assets/${address}` });
  if (asset.error) {
    return redirectProps;
  }

  const props: IAsset = asset.data.asset;

  return { props };
};

export default Asset;
