import { PropsWithChildren } from 'react';
import { Validators as Icon } from '@/assets/cards';
import Detail from '@/components/Detail';
import { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { CustomLink } from '@/styles/common';
import { INfts, IPagination, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface ICollectionPage {
  collection: INfts[];
  pagination: IPagination;
  address: string;
  collectionAsset: string;
}

const Collection: React.FC<PropsWithChildren<ICollectionPage>> = () => {
  const header = ['ID', 'Collection Name', 'Collection Id', 'Address', ''];
  const [isTablet, setIsTablet] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [collection, setCollection] = useState<null | string>(null);
  const router = useRouter();

  useEffect(() => {
    const tabletWindow = window.innerWidth <= 1025 && window.innerWidth >= 769;
    setIsTablet(tabletWindow);
  });

  useEffect(() => {
    if (router.isReady) {
      setAddress(router.query.account as string);
      setCollection(router.query.collection as string);
    }
  }, [router.isReady]);

  const requestCollection = (page: number, limit: number) =>
    api.get({
      route: `address/${address}/collection/${collection}?page=${page}&limit=${limit}`,
    });

  const { isMobile } = useMobile();

  const rowSections = (nft: INfts): IRowSection[] => {
    const { address, assetName: collection, assetId } = nft;

    const collectionId = assetId?.split('/')[0];
    const nftId = assetId?.split('/')[1];
    const sections: IRowSection[] = address
      ? [
          {
            element: props => <span key={assetId}>#{nftId}</span>,
            span: 1,
          },
          {
            element: props => <span key={collection}>{collection}</span>,
            span: 1,
          },
          {
            element: props => <span key={collectionId}>{collectionId}</span>,
            span: 1,
          },
          {
            element: props => (
              <Link href={`/account/${address}`} key={address} legacyBehavior>
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
            element: props => (
              <Link
                href={`/account/${address}/collection/${collectionId}/${nftId}`}
                key={assetId}
                legacyBehavior
              >
                <CustomLink>Details</CustomLink>
              </Link>
            ),
            span: 2,
          },
        ]
      : [{ element: props => <></>, span: 1 }];

    return sections;
  };

  const tableProps: ITable = {
    type: 'nfts',
    header,
    rowSections,
    dataName: 'collection',
    request: (page: number, limit: number) => requestCollection(page, limit),
  };

  const detailProps = {
    title: 'NFT Collection',
    headerIcon: Icon,
    cards: undefined,
    tableProps,
    route: `/account/${address}`,
  };

  return <>{address && collection && <Detail {...detailProps} />}</>;
};

export default Collection;
