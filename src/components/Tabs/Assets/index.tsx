import Filter, { IFilter } from '@/components/Filter';
import Table, { ITable } from '@/components/Table';
import { CustomFieldWrapper, CustomLink } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { FilterDiv } from '@/components/TransactionsFilters/styles';
import { useContractModal } from '@/contexts/contractModal';
import { AssetType, AssetTypeString } from '@/types/assets';
import { IAccountAsset, IInnerTableProps, IRowSection } from '@/types/index';
import { parseApr, setQueryAndRouter } from '@/utils';
import { formatAmount, toLocaleFixed } from '@/utils/formatFunctions';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const router = useRouter();
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

  const getAssetTypeFilter = () => {
    if (router.query?.assetType === AssetTypeString.Fungible) {
      return 'Fungible';
    } else if (router.query?.assetType === AssetTypeString.NonFungible) {
      return 'Non-Fungible';
    } else if (router.query?.assetType === AssetTypeString.SemiFungible) {
      return 'Semi-Fungible';
    }
    return 'All';
  };

  const handleAssetTypeFilter = (filter: string) => {
    const updatedQuery = { ...router.query };
    delete updatedQuery.page;

    switch (filter) {
      case 'All':
        delete updatedQuery.assetType;
        break;
      case 'Fungible':
        updatedQuery.assetType = AssetTypeString.Fungible;
        break;
      case 'Non-Fungible':
        updatedQuery.assetType = AssetTypeString.NonFungible;
        break;
      case 'Semi-Fungible':
        updatedQuery.assetType = AssetTypeString.SemiFungible;
        break;
    }

    setQueryAndRouter(updatedQuery, router);
  };

  const assetTypeFilters: IFilter[] = [
    {
      firstItem: 'All',
      data: ['Fungible', 'Non-Fungible', 'Semi-Fungible'],
      onClick: e => {
        handleAssetTypeFilter(e);
      },
      current: getAssetTypeFilter(),
      overFlow: 'visible',
      inputType: 'button',
      isHiddenInput: false,
      title: 'Asset Type',
    },
  ];

  const FiltersComponent: React.FC<PropsWithChildren> = () => {
    return (
      <>
        <FilterDiv>
          {assetTypeFilters.map((filter, index) => (
            <Filter key={index} {...filter} />
          ))}
        </FilterDiv>
        {Filters && <Filters />}
      </>
    );
  };

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
    Filters: FiltersComponent,
  };

  return <Table {...tableProps} />;
};

export default Assets;
