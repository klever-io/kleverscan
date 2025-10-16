import Table, { ITable } from '@/components/Table';
import { CustomFieldWrapper, CustomLink } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { useContractModal } from '@/contexts/contractModal';
import { AssetType } from '@/types/assets';
import { IAccountAsset, IInnerTableProps, IRowSection } from '@/types/index';
import { parseApr } from '@/utils';
import { formatAmount, toLocaleFixed } from '@/utils/formatFunctions';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

interface IAssets {
  assetsTableProps: IInnerTableProps;
  address: string;
  showInteractionButtons?: boolean;
  Filters?: React.FC<PropsWithChildren>;
}

const getAssetTypeName = (type: number) => {
  switch (type) {
    case AssetType.Fungible:
      return 'Fungible';
    case AssetType.NonFungible:
      return 'Non-Fungible';
    case AssetType.SemiFungible:
      return 'Semi-Fungible';
    default:
      return 'Unknown';
  }
};

const Assets: React.FC<PropsWithChildren<IAssets>> = ({
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
    'Staking',
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
        <Link
          href={`/account/${address}/collection/${assetId}`}
          key={address}
          legacyBehavior
        >
          <CustomLink tabAsset={true}>
            {t('accounts:SingleAccount.Buttons.ViewNFTs')}
          </CustomLink>
        </Link>
      ) : (
        <></>
      );
    const sections: IRowSection[] = [
      { element: props => <span key={ticker}>{ticker}</span>, span: 1 },
      {
        element: props => (
          <Link key={assetId} href={`/asset/${assetId}`} legacyBehavior>
            {assetId}
          </Link>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={assetType}>{getAssetTypeName(assetType)}</span>
        ),
        span: 1,
      },
      { element: props => <span key={precision}>{precision}</span>, span: 1 },
      {
        element: props => (
          <Tooltip
            msg={`${toLocaleFixed(balance / 10 ** precision, precision)} ${ticker}`}
            Component={() => (
              <CustomFieldWrapper>
                <span>
                  {formatAmount(balance / 10 ** precision)} {ticker}
                </span>
              </CustomFieldWrapper>
            )}
          />
        ),
        span: 1,
      },
      {
        element: props => (
          <Tooltip
            msg={`${toLocaleFixed(frozenBalance / 10 ** precision, precision)} ${ticker}`}
            Component={() => (
              <CustomFieldWrapper>
                <span key={frozenBalance}>
                  {formatAmount(frozenBalance / 10 ** precision)} {ticker}
                </span>
              </CustomFieldWrapper>
            )}
          />
        ),
        span: 1,
      },
      {
        element: props => (
          <Tooltip
            msg={`${toLocaleFixed(unfrozenBalance / 10 ** precision, precision)} ${ticker}`}
            Component={() => (
              <CustomFieldWrapper>
                <span key={unfrozenBalance}>
                  {formatAmount(unfrozenBalance / 10 ** precision)} {ticker}
                </span>
              </CustomFieldWrapper>
            )}
          />
        ),
        span: 1,
      },
      {
        element: props => (
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
        element: props => sectionViewNfts,
        span: 2,
      });
    } else if (assetType === 0 && showInteractionButtons) {
      sections.push({
        element: props => <FreezeButton />,
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
