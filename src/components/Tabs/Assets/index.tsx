import { CustomLink } from '@/components/Table/styles';
import Table, { ITable } from '@/components/TableV2';
import { useContractModal } from '@/contexts/contractModal';
import { IAccountAsset, IInnerTableProps, IRowSection } from '@/types/index';
import { parseApr } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

interface IAssets {
  assetsTableProps: IInnerTableProps;
  address: string;
  showInteractionButtons?: boolean;
  Filters?: React.FC;
}

const Assets: React.FC<IAssets> = ({
  assetsTableProps,
  address,
  showInteractionButtons,
  Filters,
}) => {
  const { t } = useTranslation('accounts');
  const header = [
    'Token',
    'ID',
    'Token Type',
    'Precision',
    'Balance',
    'Frozen',
    'Unfrozen',
    'Staking Type',
    '',
  ];
  const { getInteractionsButtons } = useContractModal();

  const rowSections = (props: IAccountAsset): IRowSection[] => {
    const {
      assetId,
      assetType,
      precision,
      balance,
      frozenBalance,
      unfrozenBalance,
      staking,
    } = props;

    const ticker = assetId?.split('-')[0];
    const sectionViewNfts =
      assetType === 1 ? (
        <Link href={`/account/${address}/collection/${assetId}`} key={address}>
          <CustomLink tabAsset={true}>
            {t('accounts:SingleAccount.Buttons.ViewNFTs')}
          </CustomLink>
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
      { element: <span key={precision}>{precision}</span>, span: 1 },
      {
        element: (
          <span key={balance}>
            {formatAmount(balance / 10 ** precision)} {ticker}
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={frozenBalance}>
            {formatAmount(frozenBalance / 10 ** precision)} {ticker}
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={unfrozenBalance}>
            {formatAmount(unfrozenBalance / 10 ** precision)} {ticker}
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={JSON.stringify(staking)}>
            {parseApr(staking?.interestType)}
          </span>
        ),
        span: 1,
      },
    ];

    const [FreezeButton] = getInteractionsButtons([
      {
        title: t('accounts:SingleAccount.Buttons.Freeze'),
        contractType: 'FreezeContract',
      },
    ]);

    if (assetType === 1) {
      sections.push({
        element: sectionViewNfts,
        span: 2,
      });
    } else if (assetType === 0 && showInteractionButtons) {
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
    showLimit: false,
    header,
    Filters,
  };

  return <Table {...tableProps} />;
};

export default Assets;
