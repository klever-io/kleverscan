import { Validators as Icon } from '@/assets/cards';
import Detail from '@/components/Layout/Detail';
import { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import api from '@/services/api';
import { INfts, IPagination, IResponse } from '@/types/index';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

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

  const requestCollection = (page: number) =>
    api.get({
      route: `address/${address}/collection/${collectionAsset}?page=${page}`,
    });
  const TableBody: React.FC<INfts> | null = ({
    address,
    collection: collectionId,
    assetName,
    nftNonce,
  }) => {
    return address ? (
      <Row type="nfts">
        <span>#{nftNonce}</span>
        <span>{assetName}</span>
        <span>{collectionId}</span>
        <Link href={`/account/${address}`}>{address}</Link>
        <Link
          href={`/account/${address}/collection/${collectionId}/${nftNonce}`}
        >
          Detail
        </Link>
      </Row>
    ) : null;
  };

  const tableProps: ITable = {
    type: 'nfts',
    header,
    body: TableBody,
    data: collection as any[],
    scrollUp: true,
    totalPages: pagination.totalPages,
    dataName: 'collection',
    request: (page: number) => requestCollection(page),
  };

  const detailProps = {
    title: 'NFT Collection',
    headerIcon: Icon,
    cards: undefined,
    paginationCount: pagination.totalPages,
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
