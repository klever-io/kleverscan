import Table, { ITable } from '@/components/Table';
import { CustomLink } from '@/components/Table/styles';
import { IAccountAsset, IAsset, IResponse, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/index';
import Link from 'next/link';
import React from 'react';

interface IAssets {
  assets: IAccountAsset[];
  address: string;
  showInteractionsButtons?: (
    title: string,
    value: string,
    isAssetTrigger: boolean,
    assets: IAccountAsset,
  ) => JSX.Element;
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

const Assets: React.FC<IAssets> = ({
  assets,
  address,
  showInteractionsButtons,
}) => {
  const header = [
    'Token',
    'ID',
    'Token Type',
    'Precision',
    'Balance',
    'Frozen',
    '',
  ];

  const rowSections = (props: IAccountAsset): IRowSection[] => {
    const {
      assetId,
      assetType,
      precision,
      balance,
      frozenBalance,
      address: ownerAddress,
    } = props;
    const ticker = assetId?.split('-')[0];
    const sectionViewNfts =
      assetType === 1 ? (
        <Link href={`/account/${address}/collection/${assetId}`} key={address}>
          <CustomLink>View NFTs</CustomLink>
        </Link>
      ) : (
        <></>
      );
    const sections = [
      { element: <span key={ticker}>{ticker}</span>, span: 1 },
      {
        element: (
          <Link key={assetId} href={`/asset/${assetId}`}>
            {assetId}
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <span key={assetType}>
            {assetType === 0 ? 'Fungible' : 'Non Fungible'}
          </span>
        ),
        span: 1,
      },
      { element: <strong key={precision}>{precision}</strong>, span: 1 },
      {
        element: (
          <strong key={balance}>
            {formatAmount(balance / 10 ** precision)} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={frozenBalance}>
            {formatAmount(frozenBalance / 10 ** precision)} {ticker}
          </strong>
        ),
        span: 1,
      },
      { element: sectionViewNfts, span: 2 },
    ];

    if (address === ownerAddress && showInteractionsButtons)
      sections.push({
        element: showInteractionsButtons(
          'Asset Trigger',
          'AssetTriggerContract',
          true,
          props,
        ),
        span: 2,
      });
    return sections;
  };

  const tableProps: ITable = {
    rowSections,
    type: 'assets',
    header,
    data: assets,
  };

  return <Table {...tableProps} />;
};

export default Assets;
