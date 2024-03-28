import { CustomLink } from '@/components/Table/styles';
import Table, { ITable } from '@/components/TableV2';
import { useContractModal } from '@/contexts/contractModal';
import {
  IInnerTableProps,
  IProprietaryAsset,
  IRowSection,
} from '@/types/index';
import { parseApr } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

interface IProprietaryAssets {
  assetsTableProps: IInnerTableProps;
  address: string;
  showInteractionButtons?: boolean;
  Filters?: React.FC;
}

const ProprietaryAssets: React.FC<IProprietaryAssets> = ({
  assetsTableProps,
  address,
  showInteractionButtons,
  Filters,
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
  const { t } = useTranslation('accounts');
  const { getInteractionsButtons } = useContractModal();

  const rowSections = (props: IProprietaryAsset): IRowSection[] => {
    const { assetId, assetType, precision, circulatingSupply, staking } = props;

    const ticker = assetId?.split('-')[0];
    const sectionViewNfts =
      assetType === 'Non Fungible' ? (
        <Link href={`/account/${address}/collection/${assetId}`} key={address}>
          <CustomLink>
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
            {assetType === 'Fungible' ? 'Fungible' : 'Non Fungible'}
          </span>
        ),
        span: 1,
      },
      { element: <span key={precision}>{precision}</span>, span: 1 },
      {
        element: (
          <span key={circulatingSupply}>
            {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={staking?.totalStaked || 0}>
            {formatAmount((staking?.totalStaked || 0) / 10 ** precision)}{' '}
            {ticker}
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
      { element: sectionViewNfts, span: 2 },
    ];

    const [AssetTriggerButton] = getInteractionsButtons([
      {
        title: t('accounts:SingleAccount.Buttons.AssetTrigger'),
        contractType: 'AssetTriggerContract',
        defaultValues: {
          assetId,
        },
      },
    ]);

    if (showInteractionButtons) {
      sections.push({
        element: <AssetTriggerButton />,
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
    Filters,
  };

  return <Table {...tableProps} />;
};

export default ProprietaryAssets;
