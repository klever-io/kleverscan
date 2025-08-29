import { PropsWithChildren } from 'react';
import { Validators as Icon } from '@/assets/cards';
import Detail from '@/components/Detail';
import { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { CustomLink, NftImage, NftImageContainer, NftImageEmpty, NftImageError } from '@/styles/common';
import { INfts, IPagination, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Skeleton from '@/components/Skeleton';

interface ICollectionPage {
  collection: INfts[];
  pagination: IPagination;
  address: string;
  collectionAsset: string;
}

interface INftImage {
  [key: string]: {
    url: string;
    loading: boolean;
    error: boolean;
  };
}

const Collection: React.FC<PropsWithChildren<ICollectionPage>> = () => {
  const header = ['Image', 'ID', 'Collection Name', 'Collection Id', 'Address', ''];
  const [isTablet, setIsTablet] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [collection, setCollection] = useState<null | string>(null);
  const [metadata, setMetadata] = useState<null | string>(null);
  const [nftImages, setNftImages] = useState<INftImage>({});
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

  const requestMetadata = async () => {
    const assetId = router.query.collection as string;
    const response = await api.get({
      route: `assets/${assetId}`,
    });
    const uris = response.data.asset.uris;
    const metadataUri = uris?.find((uri: { key: string; value: string }) => uri.key === 'metadata');
    const nftMetadata = metadataUri ? metadataUri.value : null;
    setMetadata(nftMetadata);
  };

  const fetchNftImage = async (metadataUrl: string, nftId: string) => {
    setNftImages(prev => ({
      ...prev,
      [nftId]: { url: '', loading: true, error: false }
    }));

    try {
      const fullUrl = `${metadataUrl}/${nftId}`;
      const response = await fetch(`/api/nft-metadata?url=${encodeURIComponent(fullUrl)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setNftImages(prev => ({
            ...prev,
            [nftId]: { url: data.image, loading: false, error: false }
          }));
        } else {
          setNftImages(prev => ({
            ...prev,
            [nftId]: { url: '', loading: false, error: true }
          }));
        }
      } else {
        setNftImages(prev => ({
          ...prev,
          [nftId]: { url: '', loading: false, error: true }
        }));
      }
    } catch (error) {
      console.error(`Error fetching NFT image for ID ${nftId}:`, error);
      setNftImages(prev => ({
        ...prev,
        [nftId]: { url: '', loading: false, error: true }
      }));
    }
  };

  useEffect(() => {
    requestMetadata();
  }, [router.query.collection]);

  const { isMobile } = useMobile();

  const rowSections = (nft: INfts): IRowSection[] => {
    const { address, assetName: collection, assetId } = nft;

    const collectionId = assetId?.split('/')[0];
    const nftId = assetId?.split('/')[1];
    
    if (metadata && nftId && !nftImages[nftId]) {
      fetchNftImage(metadata, nftId);
    }

    const sections: IRowSection[] = address
      ? [
          {
            element: props => (
              nftImages[nftId]?.loading ? (
                <Skeleton width={50} height={50} />
              ) : (
              <NftImageContainer key={`image-${assetId}`}>
               {nftImages[nftId]?.url ? (
                  <NftImage 
                    src={nftImages[nftId].url} 
                    alt={`NFT ${nftId}`} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : nftImages[nftId]?.error ? (
                  <NftImageError>Error</NftImageError>
                ) : (
                  <NftImageEmpty>-</NftImageEmpty>
                )}
              </NftImageContainer>
                
              )
            ),
            span: 1,
          },
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
            span: 1,
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
