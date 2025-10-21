import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import { useContractModal } from '@/contexts/contractModal';
import { CustomLink } from '@/styles/common';
import {
  IInnerTableProps,
  IProprietaryAsset,
  IRowSection,
} from '@/types/index';
import { parseApr, setQueryAndRouter } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { AssetType, AssetTypeString } from '@/types/assets';
import { useRouter } from 'next/router';
import Filter, { IFilter } from '@/components/Filter';
import { FilterDiv } from '@/components/TransactionsFilters/styles';

interface IProprietaryAssets {
  assetsTableProps: IInnerTableProps;
  address: string;
  showInteractionButtons?: boolean;
  Filters?: React.FC<PropsWithChildren>;
}

const getAssetTypeName = (type: string) => {
  switch (type) {
    case AssetTypeString.Fungible:
      return 'Fungible';
    case AssetTypeString.NonFungible:
      return 'Non-Fungible';
    case AssetTypeString.SemiFungible:
      return 'Semi-Fungible';
    default:
      return 'Unknown';
  }
};

const ProprietaryAssets: React.FC<PropsWithChildren<IProprietaryAssets>> = ({
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
  const router = useRouter();

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

  const rowSections = (props: IProprietaryAsset): IRowSection[] => {
    const { assetId, assetType, precision, circulatingSupply, staking } = props;

    const ticker = assetId?.split('-')[0];
    const sectionViewNfts =
      assetType === 'Non Fungible' ? (
        <Link
          href={`/account/${address}/collection/${assetId}`}
          key={address}
          legacyBehavior
        >
          <CustomLink>
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
          <span key={circulatingSupply}>
            {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
          </span>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={staking?.totalStaked || 0}>
            {formatAmount((staking?.totalStaked || 0) / 10 ** precision)}{' '}
            {ticker}
          </span>
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
      { element: props => sectionViewNfts, span: 2 },
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
        element: props => <AssetTriggerButton />,
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
    Filters: FiltersComponent,
  };

  return <Table {...tableProps} />;
};

export default ProprietaryAssets;
