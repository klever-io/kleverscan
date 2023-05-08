import Table, { ITable } from '@/components/Table';
import { CustomLink } from '@/components/Table/styles';
import {
  IInnerTableProps,
  IProprietaryAsset,
  IRowSection,
} from '@/types/index';
import { parseApr } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import Link from 'next/link';
import React from 'react';

interface IProprietaryAssets {
  assetsTableProps: IInnerTableProps;
  address: string;
  showInteractionsButtons?: (
    title: string,
    value: string,
    assets: IProprietaryAsset,
    isAssetTrigger: boolean,
  ) => JSX.Element;
}

const ProprietaryAssets: React.FC<IProprietaryAssets> = ({
  assetsTableProps,
  address,
  showInteractionsButtons,
}) => {
  const header = [
    'Token',
    'ID',
    'Token Type',
    'Precision',
    'Circulating Supply',
    'Frozen Balance',
    'Staking Type',
    '',
  ];

  const rowSections = (props: IProprietaryAsset): IRowSection[] => {
    const { assetId, assetType, precision, circulatingSupply, staking } = props;

    const ticker = assetId?.split('-')[0];
    const sectionViewNfts =
      assetType === 'Non Fungible' ? (
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
            {assetType === 'Fungible' ? 'Fungible' : 'Non Fungible'}
          </span>
        ),
        span: 1,
      },
      { element: <strong key={precision}>{precision}</strong>, span: 1 },
      {
        element: (
          <strong key={circulatingSupply}>
            {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={staking?.totalStaked || 0}>
            {formatAmount((staking?.totalStaked || 0) / 10 ** precision)}{' '}
            {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={JSON.stringify(staking)}>
            {parseApr(staking?.interestType)}
          </strong>
        ),
        span: 1,
      },
      { element: sectionViewNfts, span: 2 },
    ];

    if (showInteractionsButtons) {
      sections.push({
        element: showInteractionsButtons(
          'Asset Trigger',
          'AssetTriggerContract',
          props,
          true,
        ),
        span: 2,
      });
    }

    return sections;
  };
  const tableProps: ITable = {
    ...assetsTableProps,
    rowSections,
    type: 'assets',
    header,
  };

  return <Table {...tableProps} />;
};

export default ProprietaryAssets;
