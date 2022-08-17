import { Validators as Icon } from '@/assets/cards';
import Detail from '@/components/Layout/Detail';
import { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import api from '@/services/api';
import { INfts, IPagination, IResponse } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';

interface ICollectionPage {
  collection: INfts[];
  pagination: IPagination;
  address: string;
}

interface ICollectionResponse extends IResponse {
  data: {
    collection: INfts[];
  };
  pagination: IPagination;
}

const Validators: React.FC<ICollectionPage> = ({
  collection: initialCollection,
  pagination,
  address,
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<INfts[]>(initialCollection);
  const header = ['Nonce', 'Collection', 'Asset Id', 'Address', ''];

  const fetchData = async () => {
    setLoading(true);

    const getCollection: ICollectionResponse = await api.get({
      route: `address/${address}/collection/${collection}?page=${page}`,
    });
    if (getCollection.code !== 'successful') {
      setLoading(false);
      return;
    }

    if (!getCollection.error) {
      setCollection(collection);
      setLoading(false);
    }
  };

  useDidUpdateEffect(() => {
    fetchData();
  }, [page]);

  const TableBody: React.FC<INfts> | null = ({
    address,
    collection: assetId,
    assetName: collection,
    nftNonce,
  }) => {
    return address ? (
      <Row type="nfts">
        <span>#{nftNonce}</span>
        <span>{collection}</span>
        <span>{assetId}</span>
        <Link href={`/account/${address}`}>{address}</Link>
        <Link href={`/account/${address}/collection/${assetId}/${nftNonce}`}>
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
    loading: loading,
  };

  const detailProps = {
    title: 'NFT Collection',
    headerIcon: Icon,
    cards: undefined,
    paginationCount: pagination.totalPages,
    page: page,
    setPage: setPage,
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
