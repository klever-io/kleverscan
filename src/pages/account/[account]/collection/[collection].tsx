import { Validators as Icon } from '@/assets/cards';
import Detail from '@/components/Layout/Detail';
import { ITable } from '@/components/Table';
import { CustomLink } from '@/components/Table/styles';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { INfts, IPagination, IResponse, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/index';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ICollectionPage {
  collection: INfts[];
  pagination: IPagination;
  address: string;
  collectionAsset: string;
}

interface ICollectionResponse extends IResponse {
  data: {
    collection: INfts[];
  };
  pagination: IPagination;
}

const Validators: React.FC<ICollectionPage> = ({
  collection,
  pagination,
  address,
  collectionAsset,
}) => {
  // initialCollection
  const header = ['ID', 'Collection Name', 'Collection Id', 'Address', ''];
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const tabletWindow = window.innerWidth <= 1025 && window.innerWidth >= 769;
    setIsTablet(tabletWindow);
  });

  const requestCollection = (page: number, limit: number) =>
    api.get({
      route: `address/${address}/collection/${collectionAsset}?page=${page}&limit=${limit}`,
    });

  const { isMobile } = useMobile();

  const rowSections = (nft: INfts): IRowSection[] => {
    const {
      address,
      collection: collectionId,
      assetName: collection,
      nftNonce,
    } = nft;

    const sections = address
      ? [
          { element: <span key={nftNonce}>#{nftNonce}</span>, span: 1 },
          { element: <span key={collection}>{collection}</span>, span: 1 },
          { element: <span key={collectionId}>{collectionId}</span>, span: 1 },
          {
            element: (
              <Link href={`/account/${address}`} key={address}>
                {isMobile
                  ? parseAddress(address, 14)
                  : address || isTablet
                  ? parseAddress(address, 20)
                  : address}
              </Link>
            ),
            span: 1,
          },
          {
            element: (
              <Link
                href={`/account/${address}/collection/${collectionId}/${nftNonce}`}
                key={nftNonce}
              >
                <CustomLink>Details</CustomLink>
              </Link>
            ),
            span: 2,
          },
        ]
      : [{ element: <></>, span: 1 }];

    return sections;
  };

  const tableProps: ITable = {
    type: 'nfts',
    header,
    rowSections,
    data: collection as any[],
    scrollUp: true,
    totalPages: pagination?.totalPages || 1,
    dataName: 'collection',
    request: (page: number, limit: number) => requestCollection(page, limit),
  };

  const detailProps = {
    title: 'NFT Collection',
    headerIcon: Icon,
    cards: undefined,
    paginationCount: pagination?.totalPages || 1,
    tableProps,
    route: `/account/${address}`,
  };

  return <Detail {...detailProps} />;
};

export const getServerSideProps: GetServerSideProps<ICollectionPage> = async ({
  params,
}: any) => {
  const { account: address, collection } = params;
  const props: ICollectionPage = {
    collection: [],
    pagination: {} as IPagination,
    address: '',
    collectionAsset: collection,
  };
  props.address = address;

  const getCollection: ICollectionResponse = await api.get({
    route: `address/${address}/collection/${collection}`,
  });

  if (getCollection.code !== 'successful') {
    return { props };
  }

  if (!getCollection.error) {
    props.collection = getCollection.data.collection;
    props.pagination = getCollection.pagination;
  }
  return { props };
};

export default Validators;
