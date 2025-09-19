import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import { CustomLink, DoubleRow } from '@/styles/common';
import { IAccountAsset, IInnerTableProps, IRowSection } from '@/types';
import { toLocaleFixed } from '@/utils/formatFunctions';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface INftCollections {
  nftCollectionsTableProps: IInnerTableProps;
  address: string;
}

const NftCollections: React.FC<PropsWithChildren<INftCollections>> = ({
  nftCollectionsTableProps,
  address,
}) => {
  const { t } = useTranslation('accounts');
  const header = ['Collection', 'ID', 'Token Type', 'Holding'];

  const rowSections = (props: IAccountAsset): IRowSection[] => {
    const { assetId, assetType, precision, balance } = props;

    const ticker = assetId?.split('-')[0];

    const sections: IRowSection[] = [
      {
        element: props => (
          <DoubleRow>
            <span key={ticker}>{ticker}</span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow>
            <Link key={assetId} href={`/asset/${assetId}`}>
              {assetId}
            </Link>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow>
            <span key={assetType}>Non Fungible</span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow>
            <span key={balance}>
              {balance
                ? toLocaleFixed(balance / 10 ** precision, precision)
                : '0'}
            </span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow>
            <Link
              href={`/account/${address}/collection/${assetId}`}
              key={address}
              legacyBehavior
            >
              <CustomLink tabAsset={true}>
                {t('accounts:SingleAccount.Buttons.ViewNFTs')}
              </CustomLink>
            </Link>
          </DoubleRow>
        ),
        span: 1,
      },
    ];

    return sections;
  };

  const tableProps: ITable = {
    ...nftCollectionsTableProps,
    rowSections,
    type: 'assets',
    showLimit: false,
    header,
  };

  return <Table {...tableProps} />;
};

export default NftCollections;
