import Table, { ITable } from '@/components/Table';
import { CustomLink } from '@/styles/common';
import { IAccountAsset, IInnerTableProps, IRowSection } from '@/types';
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
    ];
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
