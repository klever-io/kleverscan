import Table, { ITable } from '@/components/Table';
import { CustomLink } from '@/components/Table/styles';
import { useContractModal } from '@/contexts/contractModal';
import { IAccountAsset, IInnerTableProps, IRowSection } from '@/types/index';
import { parseApr } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import Link from 'next/link';
import React from 'react';

interface IAssets {
  assetsTableProps: IInnerTableProps;
  address: string;
  showInteractionButtons?: boolean;
}

const Assets: React.FC<IAssets> = ({
  assetsTableProps,
  address,
  showInteractionButtons,
}) => {
  const header = [
    'Token',
    'ID',
    'Token Type',
    'Precision',
    'Balance',
    'Frozen',
    'Staking Type',
    '',
  ];
  const { getInteractionsButtons } = useContractModal();

  const rowSections = (props: IAccountAsset): IRowSection[] => {
    const { assetId, assetType, precision, balance, frozenBalance, staking } =
      props;

    const ticker = assetId?.split('-')[0];
    const sectionViewNfts =
      assetType === 1 ? (
        <Link href={`/account/${address}/collection/${assetId}`} key={address}>
          <CustomLink tabAsset={true}>View NFTs</CustomLink>
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

    const [FreezeButton] = getInteractionsButtons([
      {
        title: 'Freeze',
        contractType: 'FreezeContract',
      },
    ]);

    if (assetType === 0 && showInteractionButtons) {
      sections.push({
        element: <FreezeButton />,
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

export default Assets;
