import Table, { ITable } from '@/components/Table';
import { CustomLink } from '@/components/Table/styles';
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
}

const ProprietaryAssets: React.FC<IProprietaryAssets> = ({
  assetsTableProps,
  address,
  showInteractionButtons,
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
  };

  return <Table {...tableProps} />;
};

export default ProprietaryAssets;
